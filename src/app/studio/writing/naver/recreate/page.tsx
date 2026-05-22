"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from '@/utils/supabase/client';
import NaverRecreateTab from "@/components/writing/naver/tabs/NaverRecreateTab";
import type { User } from '@supabase/supabase-js';

interface SourceAnalysisResult {
  keywords: string[];
  topic: string;
  summaryPoints: string[];
}

interface ExtractedSourceDocument {
  title: string;
  content: string;
  canonicalUrl: string;
}

interface RecreateAiResponse {
  title?: string;
  content?: string;
  targetKeyword?: string;
  sourceAnalysis?: {
    keywords?: string[];
    topic?: string;
    summaryPoints?: string[];
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "알 수 없는 에러가 발생했습니다.";
}

const AUTH_RETRY_DELAY_MS = 700;
const AUTH_RETRY_ATTEMPTS = 3;

export default function NaverRecreatePage() {
  const [sourceMode, setSourceMode] = useState<'url' | 'text'>('url');
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("");
  const [selectedTone, setSelectedTone] = useState("전문적이고 분석적인 말투 (경제, 기술, 정보전달)");
  const [wordCountGoal, setWordCountGoal] = useState("same");
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [sourceAnalysis, setSourceAnalysis] = useState<SourceAnalysisResult>({
    keywords: [],
    topic: "",
    summaryPoints: []
  });
  const [userNickname, setUserNickname] = useState<string>("");
  const [activeUser, setActiveUser] = useState<User | null>(null);
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

    const { data: vaultKeys } = await supabase
      .from('admin_api_vault')
      .select('key')
      .eq('status', 'active');

    if (!vaultKeys || vaultKeys.length === 0) throw new Error("사용 가능한 API 키가 없습니다.");
    const selectedKey = vaultKeys[Math.floor(Math.random() * vaultKeys.length)].key;
    try { return atob(selectedKey); } catch { return selectedKey; }
  };

  const saveToSupabase = async (
    currentContent: string,
    currentTitle: string,
    isManual: boolean = false,
    currentKeyword?: string,
    overrides?: {
      sourceMode?: 'url' | 'text';
      sourceUrl?: string;
      sourceText?: string;
      selectedTone?: string;
      wordCountGoal?: string;
    }
  ) => {
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

      const resolvedSourceMode = overrides?.sourceMode || sourceMode;
      const resolvedSourceUrl = overrides?.sourceUrl || sourceUrl;
      const resolvedSourceText = overrides?.sourceText || sourceText;
      const resolvedTone = overrides?.selectedTone || selectedTone;
      const resolvedWordCountGoal = overrides?.wordCountGoal || wordCountGoal;
      const finalAuthor = userNickname || user.email?.split('@')[0] || "Unknown";

      const basePayload = {
        user_id: user.id,
        user_email: user.email,
        user_nicename: finalAuthor,
        title: currentTitle || title || '재창조 원고',
        content: currentContent,
        status: 'saved',
        categories: [resolvedSourceMode === 'url' ? 'URL 재창조' : '텍스트 재창조'],
        tags: [resolvedTone || '기본 말투'],
        post_type: 'recreate',
        target_keyword: currentKeyword || targetKeyword || null
      };

      const detailPayload = {
        source_mode: resolvedSourceMode,
        source_url: resolvedSourceMode === 'url' ? resolvedSourceUrl || null : null,
        source_text: resolvedSourceMode === 'text' ? resolvedSourceText || null : null,
        selected_tone: resolvedTone || null,
        word_count_goal: resolvedWordCountGoal === 'same' ? null : Number(resolvedWordCountGoal) || null,
        rewrite_strategy: 'original-restructure'
      };

      const { data: insertedRow, error } = await supabase
        .from('writing_naver_posts')
        .insert([basePayload])
        .select('id')
        .single();

      if (!error && insertedRow?.id) {
        void supabase
          .from('writing_naver_posts')
          .update(detailPayload)
          .eq('id', insertedRow.id)
          .eq('user_id', user.id);

        if (isManual) {
          alert("🎉 재창조 원고가 '네이버 발행 원고 관리' 장부에 즉시 수동 적재되었습니다!");
        } else {
          alert("✅ AI 글 재창조 결과가 생성과 동시에 '네이버 발행 원고 관리' 장부에 자동 저장되었습니다!");
        }
      } else {
        const errorMessage = error?.message || '알 수 없는 저장 오류가 발생했습니다.';
        console.error("DB 저장 에러:", errorMessage);
        alert(`❌ DB 저장 실패: ${errorMessage}`);
      }
    } catch (error: unknown) {
      alert(`❌ 시스템 오류: ${getErrorMessage(error)}`);
    }
  };

  const handleAiRecreate = async () => {
    if (sourceMode === 'url' && !sourceUrl.trim()) return alert("분석 가동할 네이버 블로그 글 주소를 입력해 주세요 사장님!");
    if (sourceMode === 'text' && !sourceText.trim()) return alert("재창조할 소스 텍스트 원본 본문을 입력해 주세요 사장님!");

    setIsAiLoading(true);
    setTitle("");
    setContent("");
    setSourceAnalysis({ keywords: [], topic: "", summaryPoints: [] });

    try {
      const apiKey = await getApiKey();
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
      const keywordInstruction = targetKeyword.trim()
        ? `새로 탄생할 원고의 집중 공략 타겟 키워드는 '${targetKeyword.trim()}'이며, 반드시 이 키워드를 중심으로 최적화하라.`
        : `원본 글을 분석해 검색성과 문맥 적합성이 가장 높은 대표 타겟 키워드 1개를 스스로 선정하고, 그 키워드로 최적화하라.`;
      const lengthInstruction = wordCountGoal === 'same'
        ? `본문 길이는 원본과 대략 같은 길이로 맞추되, 정보량과 문단 구조는 유지하라.`
        : `본문 길이는 공백 포함 약 ${wordCountGoal}자 수준으로 충분히 길고 풍부하게 작성하라.`;

      let rawInputContext = `[입력된 본문]: ${sourceText}`;

      if (sourceMode === 'url') {
        const extractResponse = await fetch(`/api/naver-extract?url=${encodeURIComponent(sourceUrl)}`);
        const extractedResult = await extractResponse.json();

        if (!extractResponse.ok) {
          throw new Error(extractedResult?.error || '네이버 블로그 본문 추출에 실패했습니다.');
        }

        const extractedDocument = extractedResult as ExtractedSourceDocument;
        rawInputContext = `
        [실제 수집된 대상 URL]: ${extractedDocument.canonicalUrl || sourceUrl}
        [실제 추출된 원본 제목]: ${extractedDocument.title || '제목 추출 실패'}
        [실제 추출된 원본 본문]
        ${extractedDocument.content}
        `;
      }

      const prompt = `
        너는 네이버 스마트블록 C-Rank 및 DIA+ 로봇의 문서 유사도 카피캣 탐지기 필터를 완벽하게 우회 분쇄하는 원고 재창조 엔진이다.
        주어진 [기반 정보 영역]의 데이터 가치와 핵심 정보는 고스란히 계승하되, 문장의 어순, 형태소 수식 관계, 단어 배열을 180도 전면 파괴하여 완전히 최초로 창작된 오리지널 문서처럼 보이게 가공하라.

        [기반 정보 영역]
        ${rawInputContext}

        [빌드 조건 마스트 공정]
        1. ${keywordInstruction}
        2. 최종 선정한 타겟 키워드를 본문 안에 3회~5회 내외로 자연스럽게 배치하라.
        3. 말투는 반드시 '${selectedTone}'에 맞춰 유지하라.
        4. ${lengthInstruction}
        5. 마크다운의 대제목 및 소제목 구조(##, ###)를 반드시 3개 이상 쪼개어 가독성 벨트를 형성하라.
        6. 동시에 원본 글의 핵심 키워드, 핵심 주제, 핵심 내용을 사람이 한눈에 파악할 수 있게 별도 분석하라.
        7. 결과물은 부연설명이나 마크다운 코드 블록 선언부 기호 없이 오직 순수한 JSON 형식 데이터 규격으로만 정확하게 배출하라.
        
        [JSON 반환 양식 필수 규격]
        { "targetKeyword": "최종 선정된 대표 타겟 키워드 1개", "title": "유사도를 회피하고 시선을 강탈하는 고품질 새 제목", "content": "새로 전면 재창조된 풍부한 내용의 마크다운 본문", "sourceAnalysis": { "keywords": ["원본 핵심 키워드1", "원본 핵심 키워드2", "원본 핵심 키워드3"], "topic": "원본 글의 핵심 주제를 한 문장으로 정리한 결과", "summaryPoints": ["원본 핵심 내용 요약 1", "원본 핵심 내용 요약 2", "원본 핵심 내용 요약 3"] } }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (text) {
        const cleanJsonText = text.replace(/```json|```/g, '').trim();
        const parsedData = JSON.parse(cleanJsonText) as RecreateAiResponse;
        const resolvedKeyword = parsedData.targetKeyword?.trim()
          || parsedData.sourceAnalysis?.keywords?.find((keyword) => typeof keyword === 'string' && keyword.trim())?.trim()
          || targetKeyword.trim();

        const finalTitle = parsedData.title || `[오리지널] ${resolvedKeyword || '핵심 키워드'} 최적화 보고서`;
        const finalContent = parsedData.content || "";
        const finalKeyword = resolvedKeyword || "";

        if (finalKeyword) {
          setTargetKeyword(finalKeyword);
        }

        setTitle(finalTitle);
        setContent(finalContent);
        setSourceAnalysis({
          keywords: Array.isArray(parsedData.sourceAnalysis?.keywords) ? parsedData.sourceAnalysis.keywords.filter(Boolean) : [],
          topic: parsedData.sourceAnalysis?.topic || "",
          summaryPoints: Array.isArray(parsedData.sourceAnalysis?.summaryPoints) ? parsedData.sourceAnalysis.summaryPoints.filter(Boolean) : []
        });

        setIsAiLoading(false);
        setTimeout(() => {
          void saveToSupabase(finalContent, finalTitle, false, finalKeyword, {
            sourceMode,
            sourceUrl,
            sourceText,
            selectedTone,
            wordCountGoal
          });
        }, 100);
        return;
      }
    } catch (error: unknown) {
      alert(`AI 재창조 직조 실패: ${getErrorMessage(error)}`);
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
        selectedTone={selectedTone} setSelectedTone={setSelectedTone}
        wordCountGoal={wordCountGoal} setWordCountGoal={setWordCountGoal}
        handleSavePostToSupabase={() => saveToSupabase(content, title, true, targetKeyword)}
        sourceAnalysis={sourceAnalysis}
      />
    </div>
  );
}
