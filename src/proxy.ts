import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { CUSTOM_CLIENT_SITES } from './lib/constants/clientSites'

// 🌟 Edge Middleware In-Memory Caches (24시간 캐시로 도메인/빌더 DB 조회 왕복 지연 0ms 완전 실현)
const CACHE_TTL_24H = 24 * 60 * 60 * 1000; // 24 Hours
const dynamicClientCache = new Map<string, { isDynamic: boolean; expiry: number }>();
const customDomainCache = new Map<string, { brandId: string; expiry: number }>();
const subdomainRedirectCache = new Map<string, { redirectUrl: string | null; expiry: number }>();
const staticClientApprovedCache = new Map<string, { isApproved: boolean; expiry: number }>();

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 🌟 서브도메인 및 독립 도메인 라우팅 처리
  const host = request.headers.get("host") || "";
  const hostLower = host.toLowerCase();
  const cleanHost = hostLower.split(":")[0];
  const path = request.nextUrl.pathname;
  const now = Date.now();

  // 🌟 세션 정보 동기화 (대중 공개용 브랜드 블로그/AI 고객사 사이트는 세션 체크를 스킵하여 속도를 획기적으로 개선)
  const isTenantBlog = 
    (!cleanHost.endsWith("creaibox.com") && !cleanHost.endsWith("localhost") && cleanHost !== "127.0.0.1") || // 독립 도메인
    (cleanHost.split(".").length === 3 && cleanHost.split(".")[0] !== "www") || // 서브도메인
    (cleanHost.split(".").length === 2 && cleanHost.split(".")[0] !== "localhost" && cleanHost.endsWith("localhost")) || // 로컬 서브도메인
    path.startsWith("/brand");

  if (!isTenantBlog) {
    // 메인 플랫폼 영역만 세션 쿠키 관리
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
    );

    try {
      await Promise.race([
        supabase.auth.getUser(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Auth timeout")), 1500)),
      ]);
    } catch (e) {
      // Supabase Egress throttle or network delay safeguard - fail-safe proceed
    }
  }

  // static assets, api, nextJS internals 제외
  const isStaticOrApi = 
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.startsWith("/brand") || // 🌟 무한/중복 리라이트 방지: 내부 리라이트된 경로는 재라우팅하지 않음
    (path.includes(".") && path !== "/.well-known/creaibox-diagnostics" && path !== "/ads.txt");

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
      // 🌟 1. 독립 도메인 (Custom Domain) 24시간 인메모리 캐시 조회 (0ms)
      const cachedDomain = customDomainCache.get(cleanHost);
      if (cachedDomain && cachedDomain.expiry > now) {
        targetBrandId = cachedDomain.brandId;
      } else {
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

          // 🌟 24시간 인메모리 캐시 저장
          if (targetBrandId) {
            customDomainCache.set(cleanHost, {
              brandId: targetBrandId,
              expiry: now + CACHE_TTL_24H,
            });
          }
        } catch (err) {
          console.error("Custom domain lookup error:", err);
        }
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
      const brandKey = targetBrandId.toLowerCase();

      // 🌟 2. 서브도메인 -> 독립 도메인 리다이렉트 24시간 인메모리 캐시 조회 (0ms)
      if (isCreaiboxDomain) {
        let redirectTargetUrl: string | null = null;
        const cachedRedirect = subdomainRedirectCache.get(brandKey);

        if (cachedRedirect && cachedRedirect.expiry > now) {
          redirectTargetUrl = cachedRedirect.redirectUrl;
        } else {
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
            
            // 1. Try primary brand_id match
            let { data: profile } = await adminSupabase
              .from("profiles")
              .select("brand_id, extra_configs")
              .eq("brand_id", brandKey)
              .maybeSingle();

            // 2. Try secondary brand_ids list match if not found
            if (!profile) {
              const { data: allProfiles } = await adminSupabase
                .from("profiles")
                .select("brand_id, extra_configs")
                .not("extra_configs", "is", null);

              if (allProfiles) {
                profile = allProfiles.find((p: any) => {
                  const configs = p.extra_configs || {};
                  const list = [p.brand_id, ...(configs.brand_ids || [])].filter(Boolean);
                  return list.some(bid => bid.toLowerCase() === brandKey);
                }) || null;
              }
            }

            if (profile) {
              const configs = profile.extra_configs || {};
              const isPrimary = brandKey === (profile.brand_id || "").toLowerCase();
              const customDomain = isPrimary 
                ? configs.custom_domain 
                : configs[`custom_domain_${brandKey}`];
              const customDomainStatus = isPrimary 
                ? configs.custom_domain_status 
                : configs[`custom_domain_status_${brandKey}`];

              if (customDomainStatus === "APPROVED" && customDomain) {
                redirectTargetUrl = `https://${customDomain.toLowerCase()}`;
              }
            }

            subdomainRedirectCache.set(brandKey, {
              redirectUrl: redirectTargetUrl,
              expiry: now + CACHE_TTL_24H,
            });
          } catch (redirectLookupErr) {
            console.error("Subdomain to custom domain redirect check failed:", redirectLookupErr);
          }
        }

        if (redirectTargetUrl) {
          const redirectUrl = `${redirectTargetUrl}${path}${request.nextUrl.search}`;
          return NextResponse.redirect(new URL(redirectUrl, request.url));
        }
      }

      const isCustomClient = CUSTOM_CLIENT_SITES.includes(brandKey);
      
      let rewritePath = "";
      if (isCustomClient) {
        // 🌟 3. 맞춤형 기업 홈페이지 24시간 인메모리 캐시 조회 (0ms)
        let isStaticApproved = false;
        const cachedStatic = staticClientApprovedCache.get(brandKey);

        if (cachedStatic && cachedStatic.expiry > now) {
          isStaticApproved = cachedStatic.isApproved;
        } else {
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
            
            let { data: prof } = await adminSupabase
              .from("profiles")
              .select("id")
              .eq("brand_id", brandKey)
              .eq("brand_id_status", "APPROVED")
              .maybeSingle();
              
            if (prof?.id) {
              isStaticApproved = true;
            } else {
              const { data: allProfs } = await adminSupabase
                .from("profiles")
                .select("id, extra_configs")
                .not("extra_configs", "is", null);
                
              if (allProfs) {
                isStaticApproved = allProfs.some((p: any) => {
                  const configs = p.extra_configs || {};
                  const list = (configs.brand_ids || []).map((id: string) => id.toLowerCase());
                  return list.includes(brandKey);
                });
              }
            }

            staticClientApprovedCache.set(brandKey, {
              isApproved: isStaticApproved,
              expiry: now + CACHE_TTL_24H,
            });
          } catch (staticErr) {
            console.error("Static client license check failed:", staticErr);
          }
        }

        const clientFolder = brandKey === "auramerino" ? "aura-merino" : brandKey;
        rewritePath = (isStaticApproved || isLocalhost || isCustomClient)
          ? `/clients/${clientFolder}${path}`
          : `/brand/${brandKey}${path}`;
      } else {
        // 🌟 4. AI 웹사이트 빌더 24시간 인메모리 캐시 조회 (0ms)
        let isDynamicClient = false;

        const cached = dynamicClientCache.get(brandKey);
        if (cached && cached.expiry > now) {
          isDynamicClient = cached.isDynamic;
        } else {
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
              .select("id, status")
              .eq("brand_id", brandKey)
              .maybeSingle();
              
            if (siteData?.id) {
              isDynamicClient = true;
            }

            // Cache for 24 hours
            dynamicClientCache.set(brandKey, {
              isDynamic: isDynamicClient,
              expiry: now + CACHE_TTL_24H,
            });
          } catch (dbErr) {
            console.error("Middleware dynamic client lookup failed:", dbErr);
          }
        }
        
        const search = request.nextUrl.search || "";
        rewritePath = isDynamicClient
          ? `/clients/dynamic-renderer/${brandKey}${path}${search}`
          : `/brand/${brandKey}${path}${search}`;
      }
        
      const rewriteUrl = new URL(rewritePath, request.url);
      
      const rewriteResponse = NextResponse.rewrite(rewriteUrl, {
        request: {
          headers: new Headers(request.headers),
        }
      });

      // 🌟 [핵심] 대중 공개용 테넌트 사이트/블로그는 Set-Cookie를 절대로 추가하지 않음!
      // (Set-Cookie가 응답에 없어야 Vercel Global Edge CDN이 0.01초 광속 캐시로 서빙함)
      if (!isTenantBlog) {
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
      }

      rewriteResponse.headers.set("x-subdomain", brandKey);
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