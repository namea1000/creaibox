"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Loader2, AlertCircle } from "lucide-react";

export default function CreaiboxNewPostBridge() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
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
            window.alert("로그인을 하셔야 사용할 수 있는 메뉴입니다.");
            router.replace(`/login?redirect=${encodeURIComponent("/studio/writing/creaibox/new-post")}`);
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
        const targetDomain = searchParams.get("domain") || "";
        const initialCanonical = targetDomain ? `https://${targetDomain.toLowerCase()}.creaibox.com/blog` : null;

        if (!targetPost) {
          const payload = {
            user_id: user.id,
            user_nicename: user.email?.split("@")[0] ?? null,
            title: "새글 제목을 수정해 주세요",
            content: "",
            status: "draft",
            post_type: "create",
            target_keyword: "",
            selected_tone: "전문적이고 통찰력 있는 분석",
            slug: null,
            meta_description: "",
            focus_keyword: "",
            canonical_url: initialCanonical,
            seo_tags: [],
            word_count_goal: null,
            source_mode: "direct",
          };

          const { data: insertedData, error: insertError } = await supabase
            .from("writing_creaibox_posts")
            .insert([payload])
            .select("*")
            .single();

          if (insertError) {
            throw new Error(insertError.message);
          }
          targetPost = insertedData;
        }

        if (!active || !targetPost) return;

        // routeId 결정 (display_id가 있으면 우선 사용, 없으면 id 사용)
        const rawDisplayId = targetPost.display_id ?? targetPost.displayId;
        const routeId =
          typeof rawDisplayId === "number" && Number.isFinite(rawDisplayId) && rawDisplayId > 0
            ? String(rawDisplayId)
            : String(targetPost.id);

        // 에디터 상세 페이지로 워프 리다이렉트
        router.replace(`/studio/writing/creaibox/list/${routeId}?newPost=true`);
      } catch (err: any) {
        if (active) {
          setErrorMsg(err.message || "새글 작성 도중 에러가 발생했습니다.");
        }
      }
    }

    createNewPostAndRedirect();

    return () => {
      active = false;
    };
  }, [router, supabase]);

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
