"use client";

import React, { useMemo, useState, useEffect } from 'react';
import NaverCreateTab from "@/components/writing/naver/tabs/NaverCreateTab";
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
        instruction: "뉴스형 / 핵심 정보 빠른 전달. 짧은 요약, 속보, 트렌드 소개에 적합하게 작성하고 군더더기 없이 핵심만 빠르게 전달하십시오."
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

export default function NaverCreatePage() {
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

  // 📊 새 장부(create) 테이블 매칭 핵심 상태 변수
  const [targetKeyword, setTargetKeyword] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTone, setSelectedTone] = useState("친근하고 부드러운 말투 (블로그 후기, 일상)");
  const [postType, setPostType] = useState('AI 자동 포스팅');
  const [wordCountGoal, setWordCountGoal] = useState("1500");
  
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [useSearch, setUseSearch] = useState(true);
  const [userNickname, setUserNickname] = useState<string>("");
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [editLink, setEditLink] = useState<string>("");

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
    if (!vaultKeys || vaultKeys.length === 0) throw new Error("사용 가능한 API 키가 없습니다.");
    const selectedKey = vaultKeys[Math.floor(Math.random() * vaultKeys.length)].key;
    try { return atob(selectedKey); } catch (e) { return selectedKey; }
  };

  // 💾 [부모 총괄] 무한 루프 렉 파괴형 실시간 직격 저장 엔진
  const saveToSupabase = async (currentContent: string, currentTitle: string, isManual: boolean = false) => {
    if (!currentContent || currentContent.length < 10) {
      alert("❌ 저장할 본문이 아직 충분히 생성되지 않았습니다.");
      return;
    }

    try {
      const user = activeUser || await resolveAuthUser();
      if (!user) {
        alert("❌ 로그인 세션을 확인하지 못해 저장을 진행하지 못했습니다. 다시 로그인했는지 확인해 주세요.");
        return;
      }

      if (!activeUser) {
        setActiveUser(user);
      }

      const finalAuthor = userNickname || user.email?.split('@')[0] || "Unknown";

      const payload = {
        user_id: user.id,
        user_email: user.email,
        user_nicename: finalAuthor,
        title: currentTitle || title || '제목 없음',
        content: currentContent,
        status: 'saved',
        categories: [postType || 'AI 자동 포스팅'],
        tags: [selectedTone || '기본 말투'],
        post_type: 'create',
        target_keyword: targetKeyword || null,
        selected_tone: selectedTone || null,
        word_count_goal: Number(wordCountGoal) || null,
        source_mode: null,
        source_url: null,
        source_text: null,
        rewrite_strategy: null
      };

      const { data: insertedRow, error } = await supabase
        .from('writing_naver_posts')
        .insert([payload])
        .select('id')
        .single();

      if (!error) {
        if (insertedRow?.id) {
          setEditLink(`/studio/writing/naver/list/${insertedRow.id}`);
        }
        if (isManual) {
          alert("🎉 에디터의 새 원고가 '네이버 발행 원고 관리' 장부에 즉시 수동 적재되었습니다!");
        } else {
          alert("✅ 콘텐츠가 생성되어 '네이버 발행 원고 관리' 장부에 즉시 자동 저장되었습니다!");
        }
      } else {
        console.error("DB 저장 에러:", error.message);
        alert(`❌ DB 저장 실패: ${error.message}`);
      }
    } catch (err: any) {
      alert(`❌ 시스템 오류: ${err.message}`);
    }
  };

  // 🤖 제미나이 생성 마스터 스위치
  const handleAiGenerateLive = async () => {
    if (!targetKeyword.trim()) {
      alert("타겟 키워드를 기입해 주십시오, 사장님!");
      return;
    }
    
    setIsAiLoading(true);
    setTitle("");
    setContent("");

    try {
      const lengthPrompt = getLengthPrompt(wordCountGoal);
      const apiKey = await getApiKey();
      const genAI = new GoogleGenerativeAI(apiKey);
      const modelOptions: any = { model: "gemini-3-flash-preview" };
      if (useSearch) modelOptions.tools = [{ googleSearch: {} }];

      const model = genAI.getGenerativeModel(modelOptions); 
      const prompt = `
        너는 블로그 스마트블록 노출 전문 탑 마케터이다. 조건에 부합하는 고품질 원고를 빌드하라.
        - 키워드: ${targetKeyword}
        - 어조: ${selectedTone}
        - 유형: ${postType}
        - 길이 규격: ${lengthPrompt.label}
        - 목표 분량: 약 ${wordCountGoal}자
        - 길이 작성 지침: ${lengthPrompt.instruction}
        - 연도 정보: 2026년 최신 팩트체크 기반 전개 (구글 검색 활용)
        - 제목은 클릭하고 싶게 만들되 과장하지 말고, 첫 문단에서 핵심 결론을 빠르게 전달하라.
        - 짧은 글은 압축적으로, 긴 글은 소제목/사례/FAQ/실행 팁을 충분히 넣어라.
        오직 규격에 맞는 JSON 오브젝트만 반환하라: { "title": "생성된 제목", "content": "마크다운 본문" }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (text) {
        const cleanJsonText = text.replace(/```json|```/g, '').trim();
        const parsedData = JSON.parse(cleanJsonText);
        
        const finalTitle = parsedData.title || `[스마트] ${targetKeyword} 핵심 분석`;
        const finalContent = parsedData.content || "";

        // 1. 화면 에디터 단에 데이터를 딱 한 번 깔끔하게 박아넣어 출력 완료
        setTitle(finalTitle);
        setContent(finalContent);

        // 2. 🌟 [핵심 수술] 출력이 완료되자마자 0.1초 만에 무한 로딩 바 브레이크부터 강제 오프(false) 시킵니다!
        setIsAiLoading(false);

        // 3. 로딩이 완벽하게 꺼져 화면 제어권이 회복된 상태에서, 단 1회 안전하게 백그라운드 자동 저장 실행!
        await saveToSupabase(finalContent, finalTitle, false);
      }
    } catch (error: any) {
      alert(`AI 생성 실패: ${error.message}`);
      setIsAiLoading(false);
    }
  };

  return (
    <div className="h-full">
      <NaverCreateTab
        key={isAiLoading ? 'active_loading' : 'active_ready'} // 악성 브라우저 인풋 렉 방어벽 고수
        targetKeyword={targetKeyword} setTargetKeyword={setTargetKeyword}
        title={title} setTitle={setTitle}
        content={content} setContent={setContent}
        selectedTone={selectedTone} setSelectedTone={setSelectedTone}
        wordCountGoal={wordCountGoal} setWordCountGoal={setWordCountGoal}
        postType={postType} setPostType={setPostType}
        isAiLoading={isAiLoading} setIsAiLoading={setIsAiLoading}
        useSearch={useSearch} setUseSearch={setUseSearch}
        handleAiGenerateLive={handleAiGenerateLive}
        handleSavePostToSupabase={() => saveToSupabase(content, title, true)} // 수동 원고 저장 버튼 1:1 결합
        editLink={editLink}
      />
    </div>
  );
}
