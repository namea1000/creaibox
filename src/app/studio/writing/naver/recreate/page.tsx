"use client";

import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from '@/utils/supabase/client';
import NaverRecreateTab from "@/components/writing/naver/tabs/NaverRecreateTab";

export default function NaverRecreatePage() {
  const [sourceMode, setSourceMode] = useState<'url' | 'text'>('url');
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("");
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const supabase = createClient();

  const getApiKey = async () => {
    const localKey = localStorage.getItem('gemini_api_key');
    if (localKey && localKey.trim()) return localKey;

    const { data: vaultKeys } = await supabase
      .from('admin_api_vault')
      .select('key')
      .eq('status', 'active');

    if (!vaultKeys || vaultKeys.length === 0) throw new Error("사용 가능한 API 키가 없습니다.");
    const selectedKey = vaultKeys[Math.floor(Math.random() * vaultKeys.length)].key;
    try { return atob(selectedKey); } catch (e) { return selectedKey; }
  };

  const handleAiRecreate = async () => {
    if (sourceMode === 'url' && !sourceUrl.trim()) return alert("분석 가동할 네이버 블로그 글 주소를 입력해 주세요 사장님!");
    if (sourceMode === 'text' && !sourceText.trim()) return alert("재창조할 소스 텍스트 원본 본문을 입력해 주세요 사장님!");
    if (!targetKeyword.trim()) return alert("유사도 우회를 위한 배정 타겟 키워드를 기입해 주십시오!");

    setIsAiLoading(true);
    setTitle("");
    setContent("");

    try {
      const apiKey = await getApiKey();
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

      const rawInputContext = sourceMode === 'url' ? `[수집된 대상 URL]: ${sourceUrl}` : `[입력된 본문]: ${sourceText}`;

      const prompt = `
        너는 네이버 스마트블록 C-Rank 및 DIA+ 로봇의 문서 유사도 카피캣 탐지기 필터를 완벽하게 우회 분쇄하는 원고 재창조 엔진이다.
        주어진 [기반 정보 영역]의 데이터 가치와 핵심 정보는 고스란히 계승하되, 문장의 어순, 형태소 수식 관계, 단어 배열을 180도 전면 파괴하여 완전히 최초로 창작된 오리지널 문서처럼 보이게 가공하라.

        [기반 정보 영역]
        ${rawInputContext}

        [빌드 조건 마스트 공정]
        1. 새로 탄생할 원고의 집중 공략 타겟 키워드: ${targetKeyword}
        2. 본문 안에 해당 타겟 키워드('${targetKeyword}')를 흐름상 어색하지 않게 총 3회~5회 내외로 고루 안착시켜 도배 방어벽을 충족하라.
        3. 마크다운의 대제목 및 소제목 구조(##, ###)를 반드시 3개 이상 쪼개어 가독성 벨트를 형성하라.
        4. 결과물은 부연설명이나 마크다운 코드 블록 선언부 기호 없이 오직 순수한 JSON 형식 데이터 규격으로만 정확하게 배출하라.
        
        [JSON 반환 양식 필수 규격]
        { "title": "유사도를 회피하고 시선을 강탈하는 고품질 새 제목", "content": "새로 전면 재창조된 풍부한 내용의 마크다운 본문" }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (text) {
        const cleanJsonText = text.replace(/```json|```/g, '').trim();
        const parsedData = JSON.parse(cleanJsonText);

        setTitle(parsedData.title || `[오리지널] ${targetKeyword} 최적화 보고서`);
        setContent(parsedData.content || "");
      }
    } catch (error: any) {
      alert(`AI 재창조 직조 실패: ${error.message}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="h-full">
      <NaverRecreateTab
        targetKeyword={targetKeyword} setTargetKeyword={setTargetKeyword}
        title={title} setTitle={setTitle}
        content={content} setContent={setContent}
        isAiLoading={isAiLoading} handleAiRecreate={handleAiRecreate}
        sourceMode={sourceMode} setSourceMode={setSourceMode}
        sourceUrl={sourceUrl} setSourceUrl={setSourceUrl}
        sourceText={sourceText} setSourceText={setSourceText}
      />
    </div>
  );
}