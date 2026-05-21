"use client";

import React, { useState, useEffect } from 'react';
import NaverCreateTab from "@/components/writing/naver/tabs/NaverCreateTab";
import { createClient } from '@/utils/supabase/client';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function NaverCreatePage() {
  const supabase = createClient();

  // 📊 새 장부(create) 테이블과 1:1로 매칭할 핵심 상태 변수들
  const [targetKeyword, setTargetKeyword] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTone, setSelectedTone] = useState("친근하고 부드러운 말투 (블로그 후기, 일상)");
  const [postType, setPostType] = useState('AI 자동 포스팅');
  const [wordCountGoal, setWordCountGoal] = useState("1500");
  
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [useSearch, setUseSearch] = useState(true);
  const [userNickname, setUserNickname] = useState<string>("");

  // 프로필 정보 미리 확보
  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
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

  // 💾 [부모 총괄] 새 장부('create') 전용 실시간 동기화 엔진
  const saveToSupabase = async (currentContent: string, currentTitle: string, isManual: boolean = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const finalAuthor = userNickname || user.email?.split('@')[0] || "Unknown";

      // 🌟 새 SQL 장부 컬럼과 1:1 대응하는 무결점 페이로드
      const payload = {
        user_id: user.id,
        user_email: user.email,
        user_nicename: finalAuthor,
        title: currentTitle || title || '제목 없음',
        content: currentContent || content,
        status: 'saved',
        categories: [postType || 'AI 자동 포스팅'], 
        tags: [selectedTone || '기본 말투'],         
        post_type: 'create' // 🌟 사장님 오더 반영: 'create' 규격 명확화
      };

      // .select()를 붙여 전송 즉시 동기화 확정 보장
      const { error } = await supabase.from('writing_naver_posts').insert([payload]).select();

      if (!error) {
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

  // 🤖 제미나이 글 생성 엔진
  const handleAiGenerateLive = async () => {
    if (!targetKeyword.trim()) {
      alert("타겟 키워드를 기입해 주십시오, 사장님!");
      return;
    }
    
    setIsAiLoading(true);
    setTitle("");
    setContent("");

    try {
      const apiKey = await getApiKey();
      const genAI = new GoogleGenerativeAI(apiKey);
      const modelOptions: any = { model: "gemini-3-flash-preview" };
      if (useSearch) modelOptions.tools = [{ googleSearch: {} }];

      const model = genAI.getGenerativeModel(modelOptions); 
      const prompt = `
        너는 블로그 스마트블록 노출 전문 탑 마케터이다. 조건에 부합하는 고품질 원고를 빌드하라.
        - 키워드: ${targetKeyword} / 어조: ${selectedTone} / 유형: ${postType} / 분량: ${wordCountGoal}자 내외
        - 연도 정보: 2026년 최신 팩트체크 기반 전개 (구글 검색 활용)
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

        setTitle(finalTitle);
        setContent(finalContent);

        // 🔥 글 생성이 끝나면 부모 단에서 'create' 장부로 즉시 오토 세이브 가동!
        await saveToSupabase(finalContent, finalTitle, false);
      }
    } catch (error: any) {
      alert(`AI 생성 실패: ${error.message}`);
    } finally {
      setIsAiLoading(false); 
    }
  };

  return (
    <div className="h-full">
      <NaverCreateTab
        key={isAiLoading ? 'loading' : 'ready'} // 악성 캐시 복원 차단막
        targetKeyword={targetKeyword} setTargetKeyword={setTargetKeyword}
        title={title} setTitle={setTitle}
        content={content} setContent={setContent}
        selectedTone={selectedTone} setSelectedTone={setSelectedTone}
        wordCountGoal={wordCountGoal} setWordCountGoal={setWordCountGoal}
        postType={postType} setPostType={setPostType}
        isAiLoading={isAiLoading} setIsAiLoading={setIsAiLoading}
        useSearch={useSearch} setUseSearch={setUseSearch}
        handleAiGenerateLive={handleAiGenerateLive}
        handleSavePostToSupabase={() => saveToSupabase(content, title, true)} // 수동 저장 바인딩
      />
    </div>
  );
}