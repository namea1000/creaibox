"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Loader2, AlertCircle, Globe } from "lucide-react";

export default function CreaiboxNewPostBridge() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState<boolean>(false);
  const supabase = createClient();

  useEffect(() => {
    let active = true;

    async function createNewPostAndRedirect() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          if (active) {
            setShowLoginPrompt(true);
          }
          return;
        }

        // Check if there is already a blank draft post for this user to prevent cluttering
        const { data: existingDrafts, error: queryError } = await supabase
          .from("writing_creaibox_posts")
          .select("*")
          .eq("user_id", user.id)
          .eq("title", "새글 제목을 수정해 주세요")
          .eq("status", "draft")
          .order("id", { ascending: false });

        if (queryError) {
          console.error("Query blank post failed:", queryError);
        }

        const blankPost = existingDrafts?.find((post: any) => {
          const content = (post.content ?? "").trim();
          return content === "" || content === "<p></p>" || content === "<p></p>\n";
        });

        let targetPost = blankPost;

        const searchParams = new URLSearchParams(window.location.search);
        const prompt = searchParams.get("prompt");
        const keyword = searchParams.get("keyword");
        const domain = searchParams.get("domain");

        if (!targetPost) {
          const payload = {
            user_id: user.id,
            user_nicename: user.email?.split("@")[0] ?? null,
            title: "새글 제목을 수정해 주세요",
            content: "",
            status: "draft",
            post_type: "create",
            target_keyword: keyword || prompt || "",
            selected_tone: "전문적이고 통찰력 있는 분석",
            slug: null,
            meta_description: "",
            focus_keyword: keyword || prompt || "",
            canonical_url: domain ? `https://${domain}.creaibox.com` : null,
            seo_tags: [],
            word_count_goal: null,
            source_mode: "direct",
          };

          const { data: newDraft, error: insertError } = await supabase
            .from("writing_creaibox_posts")
            .insert([payload])
            .select("*")
            .single();

          if (insertError) {
            throw new Error(insertError.message);
          }
          targetPost = newDraft;
        }

        if (active && targetPost) {
          const params = new URLSearchParams();
          params.set("newPost", "true");
          if (prompt) params.set("prompt", prompt);
          if (keyword) params.set("keyword", keyword);
          if (domain) params.set("domain", domain);

          const searchStr = params.toString() ? `?${params.toString()}` : "";
          router.replace(`/studio/writing/creaibox/list/${targetPost.id}${searchStr}`);
        }
      } catch (err: any) {
        console.error("Bridge Error:", err);
        if (active) {
          setErrorMsg(err.message || "새글 작성 준비 중 오류가 발생했습니다.");
        }
      }
    }

    void createNewPostAndRedirect();

    return () => {
      active = false;
    };
  }, [router, supabase]);

  if (showLoginPrompt) {
    return (
      <div className="min-h-screen bg-black text-slate-100 flex items-center justify-center p-6 animate-fade-in">
        <div className="bg-[#0b0f19] border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative overflow-hidden animate-fade-in-up">
          <div className="mx-auto w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
            <Globe size={28} />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-white">
              로그인이 필요한 서비스입니다
            </h2>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">
              블로그 새글 작성 서비스를 이용하기 위해 로그인이 필요합니다. <br />
              로그인 후 AI 원고 자동 작성 및 에디터를 활용해 보세요!
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/login?redirect=/studio/writing/creaibox/new-post"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-extrabold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-500/25 transition-all active:scale-95 cursor-pointer"
            >
              <span>🔑 로그인 하러 가기</span>
            </Link>

            <button
              onClick={() => router.replace("/studio")}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold text-slate-400 bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
            >
              <span>스튜디오 홈으로 이동</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      {errorMsg ? (
        <div className="space-y-4 max-w-md">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
          <h2 className="text-lg font-black text-white">오류 발생</h2>
          <p className="text-sm text-slate-400 font-bold leading-relaxed">{errorMsg}</p>
          <button
            onClick={() => router.replace("/studio/writing/creaibox/list")}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs font-bold text-slate-200 hover:bg-white/[0.08] transition"
          >
            목록으로 돌아가기
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <Loader2 className="h-8 w-8 text-violet-400 animate-spin mx-auto" />
          <h2 className="text-sm font-black text-slate-350 tracking-wider">
            블로그 새글 작성 에디터를 준비하는 중입니다...
          </h2>
          <p className="text-[11px] text-slate-500 font-bold">
            임시 저장 포스트 레코드를 클라우드 서버에 안전하게 론칭하고 있습니다.
          </p>
        </div>
      )}
    </div>
  );
}
