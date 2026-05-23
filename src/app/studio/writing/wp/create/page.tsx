"use client";

import React, { useState } from 'react';
import CreateTab from "@/components/writing/wp/tabs/CreateTab";
import { createClient } from '@/utils/supabase/client';
import { GoogleGenerativeAI } from "@google/generative-ai";

function getLengthPrompt(length: string) {
  if (length.includes("약 800자")) {
    return "📰 짧게 (약 800자): 뉴스형 / 핵심 정보 빠른 전달. 짧은 요약, 속보, 트렌드 소개에 적합한 구조로 작성하고 군더더기 없이 핵심만 빠르게 전달해줘.";
  }
  if (length.includes("약 1,500자")) {
    return "✍️ 보통 (약 1,500자): 일반 정보성 블로그형. 가장 많이 사용하는 표준 콘텐츠 구성으로, 도입-핵심 설명-정리 흐름을 안정적으로 유지해줘.";
  }
  if (length.includes("약 3,000자")) {
    return "🚀 길게 (약 3,000자): SEO 최적화형 / 상위 노출 공략. 검색 유입과 키워드 최적화 중심으로 소제목을 충분히 쓰고 문단 전개를 풍부하게 구성해줘.";
  }
  if (length.includes("약 5,000자")) {
    return "📚 아주 길게 (약 5,000자): 전문 가이드형 / 심층 분석 콘텐츠. 비교, 설명, 활용법까지 자세히 정리하고 사례와 맥락 설명을 충분히 포함해줘.";
  }
  if (length.includes("약 8,000자")) {
    return "💰 초장문 (약 8,000자): 애드센스 수익형 / 체류시간 극대화. SEO + FAQ + 사례 + 확장 정보가 포함된 전문 아티클형으로 작성하고, 체류시간을 높일 수 있도록 매우 촘촘하게 구성해줘.";
  }
  return "✍️ 보통 (약 1,500자): 일반 정보성 블로그형으로 자연스럽고 안정적인 표준 콘텐츠 구조를 유지해줘.";
}

export default function WpCreatePage() {
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [useSearch, setUseSearch] = useState(true);
  const [tone, setTone] = useState("전문적이고 분석적인 말투 (경제, 기술, 정보전달)");
  const [length, setLength] = useState("✍️ 보통 (약 1,500자): 일반 정보성 블로그형");

  const supabase = createClient();

  // 🌟 [핵심] API 키 결정 로직 (개인 키 vs 금고 키)
  const getApiKey = async () => {
    // 1. 개인 로컬 키 확인
    const localKey = localStorage.getItem('gemini_api_key');
    if (localKey && localKey.trim()) return localKey;

    // 2. 금고에서 랜덤 키 가져오기
    const { data: vaultKeys } = await supabase
      .from('admin_api_vault')
      .select('key')
      .eq('status', 'active');

    if (!vaultKeys || vaultKeys.length === 0) throw new Error("사용 가능한 API 키가 없습니다.");

    const randomIndex = Math.floor(Math.random() * vaultKeys.length);
    const selectedKey = vaultKeys[randomIndex].key;

    // Base64 위장 해제 (atob)
    try { return atob(selectedKey); } catch (e) { return selectedKey; }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert("주제를 입력해주세요, 사장님!");
      return;
    }
    
    setLoading(true);
    setContent(""); 

    try {
      console.log("🚀 AI 포스팅 생성 프로세스 시작...");
      
      const lengthPrompt = getLengthPrompt(length);
      // 1. 키 확보
      const apiKey = await getApiKey();
      const genAI = new GoogleGenerativeAI(apiKey);
      
      // 2. 모델 설정 (Gemini-3-flash-preview 또는 1.5-flash)
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" }); 

      // 3. 프롬프트 구성 (말투, 길이 반영)
      const prompt = `
        주제: ${topic}
        말투: ${tone}
        길이 규격: ${length}
        길이 작성 지침: ${lengthPrompt}
        위 주제에 대해 블로그 포스팅 형식을 지켜서 작성해줘. 
        Markdown 형식을 사용하고, 소제목(h2)과 강조(strong), 테이블 등을 적절히 섞어서 아주 전문적으로 작성해줘.
        짧은 글은 압축적으로, 긴 글은 소제목/사례/FAQ/실행 팁을 충분히 넣어줘.
      `;

      // 4. 실제 호출 (이게 있어야 글이 써집니다!)
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (text) {
        console.log("✅ AI 응답 성공! 길이는:", text.length);
        setContent(text); // 🌟 여기서 content를 채워줘야 CreateTab이 감지하고 DB에 저장합니다!
      } else {
        throw new Error("AI가 빈 응답을 보냈습니다.");
      }

    } catch (error: any) {
      console.error("❌ 생성 실패:", error);
      alert(`생성 중 에러 발생: ${error.message}`);
    } finally {
      setLoading(false); // 🌟 로딩 종료! 이제 95%에서 100%로 넘어갑니다.
    }
  };

  return (
    <div className="h-full">
      <CreateTab 
        topic={topic} 
        setTopic={setTopic}
        content={content}
        setContent={setContent}
        loading={loading}
        handleGenerate={handleGenerate}
        useSearch={useSearch}
        setUseSearch={setUseSearch}
        tone={tone}
        setTone={setTone}
        length={length}
        setLength={setLength}
      />
    </div>
  );
}
