import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { CUSTOM_CLIENT_SITES } from './lib/constants/clientSites'

export async function middleware(request: NextRequest) {


  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 🌟 Supabase 클라이언트 설정 (쿠키 기반 세션 관리)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set({ name, value, ...options })
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set({ name, value, ...options })
          })
        },
      },
    }
  )

  // 🌟 세션 정보 동기화 (이게 없으면 로그인이 자꾸 풀립니다)
  await supabase.auth.getUser()

  // 🌟 서브도메인 및 독립 도메인 라우팅 처리
  const host = request.headers.get("host") || "";
  const hostLower = host.toLowerCase();
  const cleanHost = hostLower.split(":")[0];
  const path = request.nextUrl.pathname;

  // static assets, api, nextJS internals 제외
  const isStaticOrApi = 
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.startsWith("/brand") || // 🌟 무한/중복 리라이트 방지: 내부 리라이트된 경로는 재라우팅하지 않음
    (path.includes(".") && path !== "/.well-known/creaibox-diagnostics");

  if (!isStaticOrApi) {
    const isCreaiboxDomain = cleanHost.endsWith("creaibox.com");
    const isLocalhost = cleanHost.endsWith("localhost") || cleanHost.includes("localhost:");

    let targetBrandId = "";

    if (isLocalhost) {
      const parts = cleanHost.split(".");
      if (parts.length === 2 && parts[1] === "localhost") {
        targetBrandId = parts[0];
      }
    } else if (isCreaiboxDomain) {
      const parts = cleanHost.split(".");
      if (parts.length === 3 && parts[1] === "creaibox" && parts[2] === "com") {
        targetBrandId = parts[0];
      }
    } else {
      // 🌟 독립 도메인 (Custom Domain) 처리
      try {
        const adminSupabase = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
          {
            cookies: {
              get(name: string) { return ""; },
              set(name: string, value: string, options: any) {},
              remove(name: string, options: any) {},
            }
          }
        );

        // 1. Try RPC lookup first
        const { data: rpcBrandId, error: rpcErr } = await adminSupabase.rpc("get_brand_id_by_custom_domain", { domain_name: cleanHost });
        if (!rpcErr && rpcBrandId) {
          targetBrandId = rpcBrandId;
        } else {
          // 2. JS Fallback lookup (backward compatible + scan dynamic keys)
          const { data: primaryProfile } = await adminSupabase
            .from("profiles")
            .select("brand_id")
            .eq("extra_configs->>custom_domain", cleanHost)
            .eq("extra_configs->>custom_domain_status", "APPROVED")
            .maybeSingle();

          if (primaryProfile?.brand_id) {
            targetBrandId = primaryProfile.brand_id;
          } else {
            const { data: allProfiles } = await adminSupabase
              .from("profiles")
              .select("brand_id, extra_configs")
              .not("extra_configs", "is", null);

            if (allProfiles) {
              for (const prof of allProfiles) {
                const configs = prof.extra_configs || {};
                const list = [prof.brand_id, ...(configs.brand_ids || [])].filter(Boolean);
                for (const bid of list) {
                  const isPrimary = bid === prof.brand_id;
                  const cDom = configs[`custom_domain_${bid}`] || (isPrimary ? configs.custom_domain : "");
                  const cDomStatus = configs[`custom_domain_status_${bid}`] || (isPrimary ? configs.custom_domain_status : "NONE");
                  if (cDomStatus === "APPROVED" && cDom?.toLowerCase() === cleanHost) {
                    targetBrandId = bid;
                    break;
                  }
                }
                if (targetBrandId) break;
              }
            }
          }
        }
      } catch (err) {
        console.error("Custom domain lookup error:", err);
      }
    }

    const excludedSubdomains = ["www", "studio", "admin", "api", "assets"];

    // 🌟 실시간 진단용 엔드포인트 처리
    if (path === "/.well-known/creaibox-diagnostics") {
      const diagResponse = NextResponse.json({
        status: "success",
        domain: cleanHost,
        brandId: targetBrandId || null,
        message: targetBrandId ? "Middleware routing active and mapped." : "Domain recognized but no brand ID mapped.",
      });
      diagResponse.headers.set("Access-Control-Allow-Origin", "*");
      diagResponse.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
      return diagResponse;
    }

    if (targetBrandId && !excludedSubdomains.includes(targetBrandId.toLowerCase())) {
      const isCustomClient = CUSTOM_CLIENT_SITES.includes(targetBrandId.toLowerCase());
      
      let rewritePath = "";
      if (isCustomClient) {
        rewritePath = `/clients/${targetBrandId.toLowerCase()}${path}`;
      } else {
        // DB-driven Dynamic Website Builder Check
        let isDynamicClient = false;
        try {
          const adminSupabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
              cookies: {
                get(name: string) { return ""; },
                set(name: string, value: string, options: any) {},
                remove(name: string, options: any) {},
              }
            }
          );
          
          const { data: siteData } = await adminSupabase
            .from("client_sites")
            .select("id")
            .eq("brand_id", targetBrandId.toLowerCase())
            .eq("status", "ACTIVE")
            .maybeSingle();
            
          if (siteData?.id) {
            isDynamicClient = true;
          }
        } catch (dbErr) {
          console.error("Middleware dynamic client lookup failed:", dbErr);
        }
        
        rewritePath = isDynamicClient
          ? `/clients/dynamic-renderer/${targetBrandId.toLowerCase()}${path}`
          : `/brand/${targetBrandId.toLowerCase()}${path}`;
      }
        
      const rewriteUrl = new URL(rewritePath, request.url);
      
      const rewriteResponse = NextResponse.rewrite(rewriteUrl, {
        request: {
          headers: new Headers(request.headers),
        }
      });

      // 복사된 쿠키 동기화 (세션 연동 목적)
      response.cookies.getAll().forEach((cookie) => {
        rewriteResponse.cookies.set(cookie.name, cookie.value, {
          domain: cookie.domain,
          path: cookie.path,
          expires: cookie.expires,
          httpOnly: cookie.httpOnly,
          secure: cookie.secure,
          sameSite: cookie.sameSite,
        });
      });

      rewriteResponse.headers.set("x-subdomain", targetBrandId.toLowerCase());
      if (!isCreaiboxDomain && !isLocalhost) {
        rewriteResponse.headers.set("x-custom-domain", cleanHost);
      }
      
      return rewriteResponse;
    }
  }

  return response
}

// 🌟 미들웨어가 작동할 경로 설정 (모든 경로에서 작동하되 static 파일은 제외)
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}