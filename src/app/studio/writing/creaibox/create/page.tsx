"use client";

import React, { useMemo, useState, useEffect } from 'react';
import CreaiboxCreateTab from "@/components/writing/creaibox/tabs/CreaiboxCreateTab";
import { createClient } from '@/utils/supabase/client';
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { User } from '@supabase/supabase-js';

const AUTH_RETRY_DELAY_MS = 700;
const AUTH_RETRY_ATTEMPTS = 3;

function getLengthPrompt(wordCountGoal: string) {
  switch (wordCountGoal) {
    case "800":
      return {
        label: "📰 짧게 (약 800자)",
        instruction: "뉴스형 / 핵심 정보 빠른 전달. 짧은 요약, 속보, 트렌드 소개에 적합한 구조로 작성하고 군더더기 없이 핵심만 빠르게 전달하십시오."
      };
    case "1500":
      return {
        label: "✍️ 보통 (약 1,500자)",
        instruction: "일반 정보성 블로그형. 가장 많이 사용하는 표준 콘텐츠 구성으로, 도입-핵심 설명-정리 흐름을 안정적으로 유지하십시오."
      };
    case "3000":
      return {
        label: "🚀 길게 (약 3,000자)",
        instruction: "SEO 최적화형 / 상위 노출 공략. 검색 유입과 키워드 최적화 중심으로 소제목을 충분히 쓰고, 문단 전개를 풍부하게 구성하십시오."
      };
    case "5000":
      return {
        label: "📚 아주 길게 (약 5,000자)",
        instruction: "전문 가이드형 / 심층 분석 콘텐츠. 비교, 설명, 활용법까지 자세히 정리하고 사례와 맥락 설명을 충분히 포함하십시오."
      };
    case "8000":
      return {
        label: "💰 초장문 (약 8,000자)",
        instruction: "애드센스 수익형 / 체류시간 극대화. SEO + FAQ + 사례 + 확장 정보를 포함한 전문 아티클형으로 작성하고, 검색자가 오래 머무를 수 있도록 매우 촘촘하게 구성하십시오."
      };
    default:
      return {
        label: "✍️ 보통 (약 1,500자)",
        instruction: "일반 정보성 블로그형으로 자연스럽고 안정적인 표준 콘텐츠 구조를 유지하십시오."
      };
  }
}

export default function CreaiboxEditorPage() {
  const supabase = useMemo(() => createClient(), []);

  const resolveAuthUser = async (): Promise<User | null> => {
    for (let attempt = 0; attempt < AUTH_RETRY_ATTEMPTS; attempt += 1) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) return session.user;

      const { data: { user } } = await supabase.auth.getUser();
      if (user) return user;

      if (attempt < AUTH_RETRY_ATTEMPTS - 1) {
        await new Promise((resolve) => setTimeout(resolve, AUTH_RETRY_DELAY_MS));
      }
    }
    return null;
  };

  const [targetKeyword, setTargetKeyword] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTone, setSelectedTone] = useState("전문적이고 통찰력 있는 분석 (기술 블로그)");
  const [postType, setPostType] = useState('AI 인사이트 포스팅');
  const [wordCountGoal, setWordCountGoal] = useState("1500");
  
  const [slug, setSlug] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [seoTags, setSeoTags] = useState<string[]>([]);
  
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [useSearch, setUseSearch] = useState(true);
  const [userNickname, setUserNickname] = useState<string>("");
  const [activeUser, setActiveUser] = useState<User | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      const user = await resolveAuthUser();
      if (user) {
        setActiveUser(user);
        const { data: prof } = await supabase.from('profiles').select('nickname').eq('id', user.id).single();
        if (prof?.nickname) setUserNickname(prof.nickname);
      }
    };
    getProfile();
  }, []);

  const getApiKey = async () => {
    const localKey = localStorage.getItem('gemini_api_key');
    if (localKey && localKey.trim()) return localKey;

    const { data: vaultKeys } = await supabase.from('admin_api_vault').select('key').eq('status', 'active');
    if (!vaultKeys || vaultKeys.length === 0) throw new Error("API 키를 찾을 수 없습니다.");
    return atob(vaultKeys[0].key);
  };

  const saveToSupabase = async (currentContent: string, currentTitle: string, isManual: boolean = false) => {
    if (!currentContent || currentContent.length < 50) {
      alert("콘텐츠 내용을 더 작성해 주세요.");
      return;
    }

    try {
      const user = activeUser || await resolveAuthUser();
      if (!user) return;

      const payload = {
        user_id: user.id,
        user_nicename: userNickname || user.email?.split('@')[0],
        title: currentTitle,
        content: currentContent,
        status: 'saved',
        post_type: postType || 'AI 인사이트 포스팅',
        target_keyword: targetKeyword || null,
        selected_tone: selectedTone || null,
        slug: slug || null,
        meta_description: metaDescription || null,
        focus_keyword: focusKeyword || targetKeyword || null,
        canonical_url: canonicalUrl || null,
        seo_tags: seoTags.length > 0 ? seoTags : null,
        word_count_goal: wordCountGoal,
        use_search: useSearch
      };

      const { error } = await supabase.from('writing_creaibox_posts').insert([payload]);

      if (!error) {
        alert(isManual ? "원고가 아카이브에 저장되었습니다." : "AI 생성이 완료되어 아카이브에 자동 저장되었습니다.");
      } else {
        throw error;
      }
    } catch (err: any) {
      alert(`저장 실패: ${err.message}`);
    }
  };

  const handleAiGenerateLive = async () => {
    if (!targetKeyword.trim()) {
      alert("타겟 키워드를 입력해 주세요.");
      return;
    }
    
    setIsAiLoading(true);
    try {
      const lengthPrompt = getLengthPrompt(wordCountGoal);
      const apiKey = await getApiKey();
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" }); 

      const prompt = `
        당신은 Creaibox의 전문 블로그 콘텐츠 에디터입니다. 
        - 주제: ${targetKeyword}
        - 어조: ${selectedTone}
        - 글 유형: ${postType}
        - 길이 규격: ${lengthPrompt.label}
        - 목표 분량: 약 ${wordCountGoal}자
        - 길이 작성 지침: ${lengthPrompt.instruction}
        - 2026년 최신 기술 트렌드와 인사이트를 반영하여 작성하십시오.
        - 제목은 클릭하고 싶게 만들되 과장하지 말고, 첫 문단에서 글의 핵심 가치를 빠르게 전달하십시오.
        - 본문은 마크다운 형식으로 작성하고, 길이 규격에 맞게 문단 수와 정보 밀도를 조절하십시오.
        - 짧은 글은 압축적으로, 긴 글은 소제목/사례/FAQ/실행 팁을 충분히 포함해 깊이 있게 작성하십시오.
        - JSON 형식으로만 반환하십시오: { "title": "제목", "content": "마크다운 본문" }
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/```json|```/g, '').trim();
      const { title, content } = JSON.parse(text);
        
      setTitle(title);
      setContent(content);
      setIsAiLoading(false);
      await saveToSupabase(content, title, false);
    } catch (error: any) {
      alert(`AI 생성 실패: ${error.message}`);
      setIsAiLoading(false);
    }
  };

  return (
    <div className="h-full w-full">
      <CreaiboxCreateTab
        targetKeyword={targetKeyword} setTargetKeyword={setTargetKeyword}
        title={title} setTitle={setTitle}
        content={content} setContent={setContent}
        slug={slug} setSlug={setSlug}
        metaDescription={metaDescription} setMetaDescription={setMetaDescription}
        focusKeyword={focusKeyword} setFocusKeyword={setFocusKeyword}
        canonicalUrl={canonicalUrl} setCanonicalUrl={setCanonicalUrl}
        seoTags={seoTags} setSeoTags={setSeoTags}
        selectedTone={selectedTone} setSelectedTone={setSelectedTone}
        wordCountGoal={wordCountGoal} setWordCountGoal={setWordCountGoal}
        postType={postType} setPostType={setPostType}
        isAiLoading={isAiLoading} setIsAiLoading={setIsAiLoading}
        useSearch={useSearch} setUseSearch={setUseSearch}
        handleAiGenerateLive={handleAiGenerateLive}
        handleSavePostToSupabase={() => saveToSupabase(content, title, true)}
      />
    </div>
  );
}
