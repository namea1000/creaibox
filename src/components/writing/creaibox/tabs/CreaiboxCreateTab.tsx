"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CreaiboxAnalysisTower from "@/components/writing/creaibox/tabs/CreaiboxAnalysisTower";
import { createClient } from '@/utils/supabase/client';
import {
  Loader2, PenLine, ChevronDown, Zap, Copy, Download, ExternalLink, Eye, X, FileText, Trash2
} from 'lucide-react';

interface KeywordFrequency { word: string; count: number; density: number; status: 'good' | 'warning' | 'danger'; }

// 🌟 [타입스크립트 완전 호환] 부모와 연동되는 모든 매개변수 명세 선언
interface CreaiboxCreateTabProps {
  targetKeyword: string;
  setTargetKeyword: React.Dispatch<React.SetStateAction<string>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  slug: string;
  setSlug: React.Dispatch<React.SetStateAction<string>>;
  metaDescription: string;
  setMetaDescription: React.Dispatch<React.SetStateAction<string>>;
  focusKeyword: string;
  setFocusKeyword: React.Dispatch<React.SetStateAction<string>>;
  canonicalUrl: string;
  setCanonicalUrl: React.Dispatch<React.SetStateAction<string>>;
  seoTags: string[];
  setSeoTags: React.Dispatch<React.SetStateAction<string[]>>;
  selectedTone: string;
  setSelectedTone: React.Dispatch<React.SetStateAction<string>>;
  wordCountGoal: string;
  setWordCountGoal: React.Dispatch<React.SetStateAction<string>>;
  postType: string;
  setPostType: React.Dispatch<React.SetStateAction<string>>;
  isAiLoading: boolean;
  setIsAiLoading: React.Dispatch<React.SetStateAction<boolean>>;
  useSearch: boolean;
  setUseSearch: React.Dispatch<React.SetStateAction<boolean>>;
  handleAiGenerateLive: () => Promise<void>;
  handleSavePostToSupabase: () => Promise<void>;
  handleResetGeneratedContent: () => void;
  editLink?: string;
  generationStatusMessage?: string;
  generationErrorMessage?: string;
}

export default function CreaiboxCreateTab({
  targetKeyword, setTargetKeyword, title, content,
  slug, setSlug, metaDescription, setMetaDescription, focusKeyword, setFocusKeyword, canonicalUrl, setCanonicalUrl, seoTags, setSeoTags,
  selectedTone, setSelectedTone, wordCountGoal, setWordCountGoal,
  postType, setPostType, isAiLoading, useSearch, setUseSearch,
  handleAiGenerateLive,
  handleSavePostToSupabase,
  handleResetGeneratedContent,
  editLink,
  generationStatusMessage,
  generationErrorMessage
}: CreaiboxCreateTabProps) {

  const supabase = useMemo(() => createClient(), []);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaveDropdownOpen, setIsSaveDropdownOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [userNickname, setUserNickname] = useState<string>("");

  const charCount = content.length;
  const metaDescriptionLength = metaDescription.trim().length;
  const slugLength = slug.trim().length;
  const seoHealthLabel = !title || !content
    ? '대기 중'
    : metaDescriptionLength >= 90 && metaDescriptionLength <= 155 && focusKeyword
      ? '준비 완료'
      : '보완 필요';

  const stripMarkdown = (value: string) =>
    value
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/[#>*_\-\[\]\(\)`]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const sanitizeInsightPrefix = (value: string) =>
    value
      .replace(/\[\s*Creaibox\s+AI\s+Insight\s*\]/gi, '[Creaibox Insight]')
      .replace(/\[\s*Creaibox\s+Insight\s*\]/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

  const buildSlug = (value: string) => {
    const normalized = sanitizeInsightPrefix(value)
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const tokens = normalized.split(' ').filter(Boolean).slice(0, 6);
    return tokens.join('-').slice(0, 48);
  };

  const finalizeToExactLength = (value: string, targetLength: number, ending: string) => {
    const normalized = value.replace(/\s+/g, ' ').trim();
    const endingWithSpace = ` ${ending}`;

    if (!normalized) return ending.slice(0, targetLength);

    if (normalized.length >= targetLength) {
      const base = normalized.slice(0, Math.max(0, targetLength - endingWithSpace.length)).trim();
      return `${base}${endingWithSpace}`.slice(0, targetLength);
    }

    const base = normalized.slice(0, Math.max(0, targetLength - endingWithSpace.length)).trim();
    const padded = `${base}${endingWithSpace}`;
    return padded.length >= targetLength
      ? padded.slice(0, targetLength)
      : `${padded}${'.'.repeat(targetLength - padded.length)}`;
  };

  const buildMetaDescription = (rawContent: string, rawTitle: string) => {
    const source = sanitizeInsightPrefix(stripMarkdown(rawContent || rawTitle));
    const ending = '지금 핵심 포인트를 확인해보겠습니다.';
    return finalizeToExactLength(source, 160, ending);
  };

  const buildFocusKeyword = () => {
    if (targetKeyword.trim()) return targetKeyword.trim();
    const baseTitle = sanitizeInsightPrefix(title);
    const tokens = baseTitle.split(/[\s,:·|/]+/).filter((token) => token.length > 1);
    return tokens.slice(0, 2).join(' ').trim();
  };

  const buildSeoTags = (baseKeyword: string, baseTitle: string) => {
    const seed = baseKeyword || sanitizeInsightPrefix(baseTitle) || targetKeyword;
    if (!seed) return [];

    const cleanedSeed = seed.trim();
    return [
      cleanedSeed,
      `${cleanedSeed} 전망`,
      `${cleanedSeed} 분석`,
      `${cleanedSeed} 핵심 정리`,
      `${cleanedSeed} 투자 포인트`
    ].slice(0, 5);
  };

  useEffect(() => {
    const nextFocusKeyword = buildFocusKeyword();

    if (title && (!slug || slug.trim() === '')) {
      setSlug(buildSlug(title));
    }

    if (title && (!canonicalUrl || canonicalUrl.trim() === '')) {
      setCanonicalUrl(`https://creaibox.blog/${buildSlug(title)}`);
    }

    if (nextFocusKeyword && (!focusKeyword || focusKeyword.trim() === '')) {
      setFocusKeyword(nextFocusKeyword);
    }

    if ((content || title) && (!metaDescription || metaDescription.trim() === '')) {
      const summary = buildMetaDescription(content, title);
      if (summary) setMetaDescription(summary);
    }

    if (seoTags.length === 0 && nextFocusKeyword) {
      setSeoTags(buildSeoTags(nextFocusKeyword, title));
    }
  }, [
    canonicalUrl,
    content,
    focusKeyword,
    metaDescription,
    postType,
    seoTags.length,
    setCanonicalUrl,
    setFocusKeyword,
    setMetaDescription,
    setSeoTags,
    setSlug,
    slug,
    targetKeyword,
    title
  ]);

  useEffect(() => {
    // userNickname 참조 오류 완벽 박멸을 위한 닉네임 로컬 연동
    const getProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: prof } = await supabase.from('profiles').select('nickname').eq('id', user.id).single();
          if (prof?.nickname) setUserNickname(prof.nickname);
        }
      } catch (e) {
        console.error("닉네임 조회 실패:", e);
      }
    };
    getProfile();
  }, [supabase]);

  // 워드프레스식 프로그레스 제어 타이머
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    let resetTimer: ReturnType<typeof setTimeout> | undefined;
    if (isAiLoading) {
      resetTimer = setTimeout(() => setProgress(0), 0);
      let nextProgress = 0;
      interval = setInterval(() => {
        const step = nextProgress < 40 ? 5 : nextProgress < 70 ? 2 : 0.5;
        nextProgress = Math.min(nextProgress + step, 95);
        setProgress(nextProgress);
      }, 300);
    } else {
      resetTimer = setTimeout(() => setProgress(0), 0);
    }
    return () => {
      if (interval) clearInterval(interval);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [isAiLoading]);

  const analysisMetrics = useMemo(() => {
    const hasTitleKeyword = title.toLowerCase().includes(targetKeyword.toLowerCase());
    const count = targetKeyword ? (content.match(new RegExp(targetKeyword, 'gi')) || []).length : 0;
    const hasGoodDensity = count >= 3 && count <= 8;
    const hasGoodLength = charCount >= 1000;
    const hasSubHeadings = content.includes('##') || content.includes('###');

    if (title === "" && content === "") {
      return {
        seoScore: 0,
        seoChecks: { titleKeyword: false, contentDensity: false, lengthCheck: false, subHeadingCheck: false },
        isDensitySafe: true,
        nounRatio: 0,
        frequencies: [] as KeywordFrequency[],
        crawlabilityScore: 0
      };
    }

    let seoScore = 10;
    if (hasTitleKeyword) seoScore += 30;
    if (hasGoodDensity) seoScore += 25;
    if (hasGoodLength) seoScore += 20;
    if (hasSubHeadings) seoScore += 15;

    const frequencies: KeywordFrequency[] = [
      { word: targetKeyword, count: count, density: Math.min(100, count * 6.2), status: count >= 3 && count <= 5 ? 'good' : count > 5 ? 'danger' : 'warning' },
      { word: "수익", count: content.includes("수익") ? 4 : 0, density: content.includes("수익") ? 4.2 : 0, status: 'good' },
      { word: "시스템", count: content.includes("시스템") ? 3 : 0, density: content.includes("시스템") ? 3.1 : 0, status: 'good' },
    ];

    const nounRatio = Math.min(65, 50 + (content.length % 12));

    let crawlabilityScore = 20;
    if (count >= 3 && count <= 5) crawlabilityScore += 30;
    if (nounRatio >= 55 && nounRatio <= 65) crawlabilityScore += 20;
    if (hasSubHeadings) crawlabilityScore += 20;
    if (title.length > 10) crawlabilityScore += 10;

    return {
      seoScore,
      seoChecks: { titleKeyword: hasTitleKeyword, contentDensity: hasGoodDensity, lengthCheck: hasGoodLength, subHeadingCheck: hasSubHeadings },
      isDensitySafe: count <= 5,
      nounRatio,
      frequencies,
      crawlabilityScore
    };
  }, [title, content, targetKeyword, charCount]);

  const posRatio = useMemo(() => {
    const noun = analysisMetrics.nounRatio;
    const verb = noun > 0 ? Math.max(15, 30 - (content.length % 5)) : 0;

    return {
      noun,
      verb,
      other: noun === 0 ? 0 : 100 - noun - verb
    };
  }, [analysisMetrics.nounRatio, content.length]);

  // 📋 Creaibox 에디터 호환 Rich Text 복사 엔진
  const handleCopy = () => {
    const previewEl = document.querySelector('.markdown-content');
    if (!previewEl) {
      alert("복사할 본문이 존재하지 않습니다.");
      return;
    }

    // 임시 컨테이너 생성 및 화면 완전 은폐 & 백그라운드 색상 흰색 고정
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.style.whiteSpace = 'pre-wrap';
    tempDiv.style.backgroundColor = '#ffffff';
    tempDiv.style.color = '#333333';

    // 프리뷰 DOM 클론 복제
    const clone = previewEl.cloneNode(true) as HTMLElement;
    clone.setAttribute('style', "background-color: #ffffff; color: #333333; padding: 20px; font-family: 'Malgun Gothic', '맑은 고딕', sans-serif;");

    // 🌟 렌더링된 폰트와 스타일을 Creaibox 블로그 규격에 맞는 인라인 스타일로 변환
    const walkAndStyle = (node: HTMLElement) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const className = node.className || '';
        const tagName = node.tagName.toLowerCase();
        let inlineStyle = "";

        // 디폴트 다크 모드 속성 완벽 차단용 상속 덮어쓰기
        node.style.color = '#333333';
        node.style.backgroundColor = '#ffffff';
        node.style.fontFamily = "'Malgun Gothic', '맑은 고딕', sans-serif";

        // 블로그 에디터 복사용 가로 수평선(구분선) HTML Table 치환 로직
        if (className.includes('naver-divider')) {
          const table = document.createElement('table');
          table.setAttribute('style', 'width: 100%; border-collapse: collapse; margin: 30px 0; background-color: #ffffff;');
          table.innerHTML = `
            <tbody>
              <tr>
                <td style="width: 40%; border-bottom: 1px solid #e2e8f0; height: 1px; background-color: #ffffff; padding: 0;"></td>
                <td style="width: 20%; text-align: center; font-size: 16px; color: #00c73c; font-weight: bold; background-color: #ffffff; padding: 0 10px; line-height: 1; vertical-align: middle; font-family: 'Malgun Gothic', '맑은 고딕', sans-serif;">🍀✨🍀</td>
                <td style="width: 40%; border-bottom: 1px solid #e2e8f0; height: 1px; background-color: #ffffff; padding: 0;"></td>
              </tr>
            </tbody>
          `;
          node.parentNode?.replaceChild(table, node);
          return; // 바꾼 노드는 하위 자식 노드 순회를 스킵합니다.
        }

        if (tagName === 'h2') {
          // H1 대응 소제목 (📌 아이콘 + 하단 테두리 초록 바) - 제목 아래 여백 극소화(margin-bottom: 4px)
          inlineStyle = "font-size: 22px; font-weight: bold; color: #111111; margin-top: 36px; margin-bottom: 4px; border-bottom: 2px solid #00c73c; padding-bottom: 8px; font-family: 'Malgun Gothic', '맑은 고딕', sans-serif; display: flex; align-items: center; gap: 8px; background-color: #ffffff;";
        } else if (tagName === 'h3') {
          // H2 대응 소제목 (초록 수직 막대기 바) - 제목 아래 여백 극소화(margin-bottom: 4px)
          inlineStyle = "font-size: 19px; font-weight: bold; color: #000000; margin-top: 30px; margin-bottom: 4px; border-left: 5px solid #00c73c; padding-left: 10px; font-family: 'Malgun Gothic', '맑은 고딕', sans-serif; display: flex; align-items: center; gap: 8px; background-color: #ffffff;";
        } else if (tagName === 'h4') {
          // H3 대응 소제목 (여백 극소화)
          inlineStyle = "font-size: 16px; font-weight: bold; color: #1a1a1a; margin-top: 24px; margin-bottom: 4px; font-family: 'Malgun Gothic', '맑은 고딕', sans-serif; display: flex; align-items: center; background-color: #ffffff;";
        } else if (tagName === 'p') {
          // 가독성이 확보된 본문 줄 간격
          inlineStyle = "font-size: 15px; line-height: 1.8; color: #333333; margin-top: 0px; margin-bottom: 12px; font-family: 'Malgun Gothic', '맑은 고딕', sans-serif; word-break: break-all; background-color: #ffffff;";
        } else if (className.includes('bg-[#f9f9f9]') || node.style.backgroundColor === 'rgb(249, 249, 249)' || tagName === 'blockquote') {
          // 인용구 외곽 박스 (자체 배경색 적용)
          inlineStyle = "margin: 25px 0; padding: 20px; background-color: #f9f9f9; border-left: 5px solid #00c73c; border-radius: 0 12px 12px 0; font-family: 'Malgun Gothic', '맑은 고딕', sans-serif; position: relative; color: #333333;";
        } else if (className.includes('text-[#444444]') || className.includes('italic')) {
          // 인용구 본문 텍스트 (자체 인용 박스 배경색과 일치)
          inlineStyle = "font-size: 14px; font-weight: bold; color: #444444; line-height: 1.7; font-style: italic; font-family: 'Malgun Gothic', '맑은 고딕', sans-serif; background-color: #f9f9f9;";
        } else if (tagName === 'strong') {
          // 형광펜 반딧불 구절 (전용 강조 배경색 부여)
          inlineStyle = "font-weight: bold; color: #000000; background-color: #eefcf2; padding: 0 4px; border-bottom: 1px solid rgba(0,199,60,0.3); display: inline;";
        } else if (tagName === 'ul') {
          inlineStyle = "list-style-type: disc; padding-left: 20px; margin: 15px 0; background-color: #ffffff;";
        } else if (tagName === 'ol') {
          inlineStyle = "list-style-type: decimal; padding-left: 20px; margin: 15px 0; background-color: #ffffff;";
        } else if (tagName === 'li') {
          inlineStyle = "font-size: 15px; line-height: 1.8; color: #333333; margin-bottom: 8px; font-family: 'Malgun Gothic', '맑은 고딕', sans-serif; background-color: #ffffff;";
        }

        if (inlineStyle) {
          node.setAttribute('style', inlineStyle);
        }

        // 하위 자식까지 재귀 처리
        Array.from(node.children).forEach(child => walkAndStyle(child as HTMLElement));
      }
    };

    walkAndStyle(clone);

    // 🌟 단락 종료 뒤에만 선택적으로 공백 라인을 삽입
    // 소제목(h2, h3, h4) 뒤에는 절대 공백 라인을 넣지 않고 붙여 쓰며, 
    // 오직 본문 문단(p), 인용구(blockquote), 리스트(ul, ol)가 "완전히 끝난 뒤"에만 다음 단락 구분을 위해 빈 엔터 라인을 삽입합니다.
    const eligibleElements = clone.querySelectorAll('p, blockquote, ul, ol');
    eligibleElements.forEach((el) => {
      // 이미 완전히 비어있거나, 구분선이거나, 수평선 테이블인 경우는 엔터 중복 방지를 위해 패스합니다.
      if (el.tagName.toLowerCase() === 'p' && (el.innerHTML.trim() === '' || el.innerHTML.includes('br') || el.textContent?.includes('🍀'))) {
        return;
      }

      const spacer = document.createElement('p');
      spacer.setAttribute('style', "margin: 0; padding: 0; height: 18px; line-height: 1.8; background-color: #ffffff; font-family: 'Malgun Gothic', '맑은 고딕', sans-serif; display: block;");
      spacer.innerHTML = '<br>';
      el.parentNode?.insertBefore(spacer, el.nextSibling);
    });

    // 최상단에 제목 헤더 블록 추가 조각
    if (title) {
      const titleHeader = document.createElement('h1');
      titleHeader.innerText = title;
      titleHeader.setAttribute('style', "font-size: 26px; font-weight: bold; color: #111111; line-height: 1.4; margin-bottom: 24px; border-bottom: 1px solid #eeeeee; padding-bottom: 15px; font-family: 'Malgun Gothic', '맑은 고딕', sans-serif; background-color: #ffffff;");
      clone.insertBefore(titleHeader, clone.firstChild);

      // 제목 바로 아래에는 띄어쓰기 단락 한 칸 확실히 부여
      const titleSpacer = document.createElement('p');
      titleSpacer.setAttribute('style', "margin: 0; padding: 0; height: 20px; background-color: #ffffff;");
      titleSpacer.innerHTML = '<br>';
      clone.insertBefore(titleSpacer, clone.children[1]);
    }

    tempDiv.appendChild(clone);
    document.body.appendChild(tempDiv);

    // 가상 범위를 드래그하여 HTML 자체를 클립보드에 적재
    const range = document.createRange();
    range.selectNode(tempDiv);
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
      try {
        document.execCommand('copy');
        alert("📋 Creaibox 블로그용 Rich Text 복사가 완료되었습니다.\n\n에디터에 붙여넣으면 소제목과 본문 간격이 자연스럽게 유지되도록 정리되어 있습니다.");
      } catch (err) {
        console.error("복사 작동 중 에러 발생:", err);
        alert("클립보드 연동 실패: 복사 기능을 수동으로 개시해 주세요.");
      }
      selection.removeAllRanges();
    }
    document.body.removeChild(tempDiv);
  };

  const downloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([`제목: ${title}\n\n${content}`], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${targetKeyword || 'creaibox_post'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setIsSaveDropdownOpen(false);
  };

  const downloadPdf = () => {
    setIsSaveDropdownOpen(false);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${title || 'Creaibox 블로그 원고'}</title>
            <style>
              body { font-family: 'Malgun Gothic', sans-serif; padding: 40px; line-height: 1.8; color: #111; max-width: 800px; margin: 0 auto; }
              h1 { font-size: 24px; border-bottom: 2px solid #00c73c; padding-bottom: 12px; margin-bottom: 30px; color: #090909; }
              div { font-size: 15px; white-space: pre-wrap; word-break: break-all; }
              footer { margin-top: 50px; font-size: 11px; color: #888; border-top: 1px dashed #eee; padding-top: 15px; text-align: center; }
            </style>
          </head>
          <body>
            <h1>${title || '제목 없음'}</h1>
            <div>${content}</div>
            <footer>본 원고는 CreAIbox Contents Studio에서 생성되었습니다.</footer>
            <script>window.onload = function() { window.print(); }</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // 🎨 Creaibox 블로그 프리뷰용 마크다운 스타일 가이드 맵
  const customMarkdownComponents: Components = {
    h1: ({ children }) => (
      <h2 className="text-[25px] font-black text-[#111111] mt-12 mb-4 font-sans tracking-tight border-b border-zinc-200 pb-4 leading-[1.45]">
        {children}
      </h2>
    ),
    h2: ({ children }) => (
      <h3 className="text-[22px] font-black text-[#111111] mt-12 mb-4 font-sans tracking-tight leading-[1.5]">
        {children}
      </h3>
    ),
    h3: ({ children }) => (
      <h4 className="text-[18px] font-bold text-[#1f1f1f] mt-9 mb-3 font-sans tracking-tight leading-[1.5]">
        {children}
      </h4>
    ),
    p: ({ children }) => {
      if (!children || children === "\n") return <div className="h-5" />;
      return (
        <p className="text-[17px] leading-[2.05] text-[#2a2a2a] mb-7 font-sans font-normal whitespace-pre-line break-keep">
          {children}
        </p>
      );
    },
    blockquote: ({ children }) => (
      <div className="my-8 rounded-2xl border border-zinc-200 bg-[#f7f7f7] px-6 py-5">
        <div className="text-[15px] font-medium text-[#4a4a4a] leading-[1.95] font-sans italic">
          {children}
        </div>
      </div>
    ),
    hr: () => null,
    ul: ({ children }) => (
      <ul className="list-disc pl-6 my-6 space-y-3 text-[16px] leading-[1.95] text-[#333333] font-sans">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal pl-6 my-6 space-y-3 text-[16px] leading-[1.95] text-[#333333] font-sans">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="leading-[1.95] font-medium break-keep">{children}</li>
    ),
    strong: ({ children }) => (
      <strong className="font-extrabold text-[#111111] bg-[#eefcf2] px-1 rounded-sm border-b border-[#00c73c]/25">
        {children}
      </strong>
    )
  };

  const templates = [
    "최신 AI 기술을 활용한 워드프레스 automatic 포스팅 구축 방법과 수익화 전략",
    "초보자도 5분 만에 끝내는 실무형 AI 툴 사용법 및 업무 효율화 가이드",
    "윈도우 11 최적화 설정 및 필수 유틸리티 설치 가이드 (속도 향상 팁)",
    "2026년 꼭 알아야 할 생활 속 유용한 상식 및 정보 총정리",
    "2026년 청년 전세자금대출 조건 및 정부 지원금 신청 방법 완벽 가이드",
    "금리 인하 시기 필수 투자 전략: 안정적인 배당주 및 채권 투자 분석",
    "삼성전자 주가 현황 및 2026년 주가 전망: 반도체 패러다임 변화 분석",
    "비타민 D 부족 증상과 올바른 영양제 선택법: 성분별 함량 비교",
    "가성비 끝판왕 무선 이어폰 내돈내산 1개월 실제 사용 후기 및 장단점 비교",
    "2026년형형 신형 팰리세이드 시승기: 연비, 승차감, 옵션 추천 가이드",
    "신작 오픈월드 RPG 완벽 공략: 초반 레벨업 루트 및 필수 장비 획득처"
  ];

  return (
    <div className="h-full w-full overflow-hidden bg-[#0b0b0d] text-zinc-100 relative text-[16px]">
      <div className="h-full w-full grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)_380px] relative z-10">

        {/* 좌측 생성 패널 */}
        <div className="h-full overflow-y-auto custom-scrollbar border-r border-zinc-800/80 bg-[#111216] text-left">
          <div className="p-5 space-y-4">

            <div className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-black text-zinc-300">
                  최신 정보 팩트체크 엔진
                </span>
                <label className="relative flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useSearch}
                    onChange={(e) => setUseSearch(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-5 h-5 rounded border border-zinc-700 peer-checked:bg-blue-600 flex items-center justify-center transition-all">
                    {useSearch && <span className="text-white text-[10px] font-black">✓</span>}
                  </div>
                </label>
              </div>
              <p className="text-[11px] font-bold text-zinc-500">
                Google Search 기반 최신 정보 반영
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[12px] font-black text-zinc-400 flex items-center gap-1.5 mb-1.5">
                  <PenLine size={13} className="text-blue-500" /> 1. 타겟 키워드 및 주제
                </label>
                <input
                  type="text"
                  value={targetKeyword}
                  onChange={(e) => setTargetKeyword(e.target.value)}
                  placeholder="원하시는 주제를 입력해 주세요."
                  className="w-full px-3 py-2.5 text-[16px] rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-200 font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1.5">2. 글 유형</label>
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 flex items-center justify-between">
                  <select
                    value={postType}
                    onChange={(e) => setPostType(e.target.value)}
                    className="w-full bg-transparent text-[13px] font-bold outline-none cursor-pointer text-zinc-300 appearance-none"
                  >
                    <optgroup label="1️⃣ 인사이트 & 트렌드">
                      <option>AI 인사이트 포스팅</option>
                      <option>트렌드 브리프</option>
                      <option>시장/기술 분석 리포트</option>
                    </optgroup>
                    <optgroup label="2️⃣ 브랜드 & 퍼블리싱">
                      <option>브랜드 스토리 포스팅</option>
                      <option>서비스 소개형 포스팅</option>
                      <option>뉴스레터형 콘텐츠</option>
                    </optgroup>
                    <optgroup label="3️⃣ 실무형 가이드">
                      <option>실전 가이드 아티클</option>
                      <option>SEO 최적화 포스팅</option>
                      <option>튜토리얼 & 워크플로우</option>
                    </optgroup>
                  </select>
                  <ChevronDown size={14} className="text-zinc-500 shrink-0 ml-1" />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1.5">3. 말투</label>
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 flex items-center justify-between">
                  <select
                    value={selectedTone}
                    onChange={(e) => setSelectedTone(e.target.value)}
                    className="w-full bg-transparent text-[13px] font-bold outline-none cursor-pointer text-zinc-300 appearance-none"
                  >
                    <option>전문적이고 통찰력 있는 분석 (기술 블로그)</option>
                    <option>친근하고 명확한 실무 설명 (가이드형 포스팅)</option>
                    <option>브랜드 중심의 신뢰형 설명 (서비스 소개형)</option>
                    <option>인사이트 리포트형 톤 (트렌드 분석)</option>
                    <option>가볍고 설득력 있는 뉴스레터형 톤</option>
                  </select>
                  <ChevronDown size={14} className="text-zinc-500 shrink-0 ml-1" />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1.5">4. 길이</label>
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 flex items-center justify-between">
                  <select
                    value={wordCountGoal}
                    onChange={(e) => setWordCountGoal(e.target.value)}
                    className="w-full bg-transparent text-[13px] font-bold outline-none cursor-pointer text-zinc-300 appearance-none"
                  >
                    <option value="800">📰 짧게 (약 800자)</option>
                    <option value="1500">✍️ 보통 (약 1,500자)</option>
                    <option value="3000">🚀 길게 (약 3,000자)</option>
                    <option value="5000">📚 아주 길게 (약 5,000자)</option>
                    <option value="8000">💰 초장문 (약 8,000자)</option>
                  </select>
                  <ChevronDown size={14} className="text-zinc-500 shrink-0 ml-1" />
                </div>
              </div>
            </div>

            <button
              onClick={handleAiGenerateLive}
              disabled={isAiLoading}
              className="w-full h-16 bg-blue-600 hover:bg-blue-500 rounded-2xl relative overflow-hidden transition-all shadow-xl shadow-blue-900/40 active:scale-[0.98] disabled:opacity-80"
            >
              {isAiLoading && (
                <div
                  className="absolute left-0 top-0 h-full bg-emerald-400/40 transition-all duration-300 ease-out z-0 border-r-2 border-emerald-300"
                  style={{ width: `${progress}%` }}
                />
              )}
              <div className="relative z-10 flex items-center justify-center gap-3 text-white text-lg font-black">
                {isAiLoading ? (
                  <>
                    <Loader2 className="animate-spin text-white" size={24} />
                    <span>{Math.round(progress)}% 포스팅 집필 중...</span>
                  </>
                ) : (
                  <>
                    <Zap size={24} className="fill-white text-white" />
                    <span>AI 콘텐츠 생성 시작</span>
                  </>
                )}
              </div>
            </button>

            {generationStatusMessage && isAiLoading && (
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-200">
                  <Loader2 size={16} className="animate-spin" />
                  {generationStatusMessage}
                </div>
              </div>
            )}

            {generationErrorMessage && !isAiLoading && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
                {generationErrorMessage}
              </div>
            )}

            <div className="pt-4 space-y-2 border-t border-zinc-800/60">
              <p className="text-[14px] font-black text-zinc-400">글쓰기 템플릿 예시</p>
              <div className="space-y-1.5">
                {templates.map((text, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTargetKeyword(text)}
                    className="w-full text-left px-4 py-3 border rounded-xl text-[12px] font-bold transition-all bg-zinc-950/50 border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-800/60 text-zinc-400 truncate"
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 중앙 뷰어 */}
        <div className="h-full min-w-0 flex flex-col bg-white overflow-hidden relative">
          <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-200 bg-zinc-900 shrink-0">
            <span className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00c73c] animate-pulse" />
              Creaibox Blog View Mode
            </span>

            <div className="flex items-center gap-1.5 relative">
              <button
                type="button"
                onClick={handleResetGeneratedContent}
                disabled={(!title && !content && !slug && !metaDescription && !focusKeyword && seoTags.length === 0) || isAiLoading}
                className="px-3 py-1.5 border border-red-900/60 hover:border-red-500 hover:text-white bg-zinc-900/50 rounded-xl text-[11px] font-black text-red-300 transition-all flex items-center gap-1 disabled:opacity-30"
              >
                <Trash2 size={11} /> DELETE
              </button>

              <button
                onClick={handleCopy}
                disabled={!content || isAiLoading}
                className="px-3 py-1.5 border border-zinc-800 hover:border-zinc-700 hover:text-white bg-zinc-900/50 rounded-xl text-[11px] font-black text-zinc-400 transition-all flex items-center gap-1 disabled:opacity-30"
              >
                <Copy size={11} /> COPY
              </button>

              <div className="relative">
                <button
                  onClick={() => setIsSaveDropdownOpen(!isSaveDropdownOpen)}
                  disabled={!content || isAiLoading}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[11px] font-black transition-all flex items-center gap-1 disabled:opacity-30"
                >
                  <Download size={11} /> DOWN
                </button>

                {isSaveDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-36 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden text-left divide-y divide-zinc-800/40">
                    <button onClick={downloadTxt} className="w-full px-3 py-2 text-[10px] font-black text-zinc-300 hover:bg-zinc-900 hover:text-white flex items-center gap-1.5">
                      <FileText size={11} /> TXT 파일 다운
                    </button>
                    <button onClick={downloadPdf} className="w-full px-3 py-2 text-[10px] font-black text-zinc-300 hover:bg-zinc-900 hover:text-white flex items-center gap-1.5">
                      <Eye size={11} /> PDF 저장/인쇄
                    </button>
                  </div>
                )}
              </div>

              {editLink ? (
                <Link
                  href={editLink}
                  className="px-3 py-1.5 border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 hover:text-white rounded-xl text-[11px] font-black text-zinc-400 transition-all flex items-center gap-1"
                >
                  글수정 이동 <ExternalLink size={11} />
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="px-3 py-1.5 border border-zinc-800 bg-zinc-900/30 rounded-xl text-[11px] font-black text-zinc-600 transition-all flex items-center gap-1 cursor-not-allowed"
                >
                  글수정 이동 <ExternalLink size={11} />
                </button>
              )}

              <button
                onClick={() => setIsPreviewOpen(true)}
                disabled={!content || isAiLoading}
                className="px-3 py-1.5 border border-zinc-800 hover:border-zinc-700 hover:text-white bg-zinc-900/50 rounded-xl text-[11px] font-black text-zinc-400 transition-all disabled:opacity-30"
              >
                PREVIEW
              </button>
            </div>
          </div>

          <div className="flex-1 p-10 overflow-y-auto custom-scrollbar text-left bg-white transition-all">
            {!content && !isAiLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 italic font-bold text-sm">
                AI 콘텐츠가 생성되면 여기에 표시됩니다.
              </div>
            ) : (
              <div className="max-w-[860px] mx-auto pb-32 font-sans">
                {title && (
                  <h1 className="text-[28px] font-black text-[#111111] leading-snug mb-10 border-b border-zinc-200 pb-6 tracking-tight">
                    {title}
                  </h1>
                )}

                <div className="markdown-content">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={customMarkdownComponents}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 우측 SEO 타워 */}
        <div className="h-full overflow-y-auto custom-scrollbar flex flex-col gap-4 border-l border-zinc-800/80 bg-[#111216] p-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
                  SEO & Publishing
                </p>
                <h3 className="mt-1 text-base font-black text-zinc-100">
                  발행 정보
                </h3>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-black border ${seoHealthLabel === '준비 완료'
                  ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                  : seoHealthLabel === '보완 필요'
                    ? 'border-amber-500/20 bg-amber-500/10 text-amber-300'
                    : 'border-zinc-700 bg-zinc-800/80 text-zinc-400'
                }`}>
                {seoHealthLabel}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-3">
                <p className="text-[10px] font-black uppercase text-zinc-500">META</p>
                <p className="mt-2 text-lg font-black text-amber-400">{metaDescriptionLength}</p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-3">
                <p className="text-[10px] font-black uppercase text-zinc-500">SLUG</p>
                <p className="mt-2 text-lg font-black text-blue-400">{slugLength}</p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-3">
                <p className="text-[10px] font-black uppercase text-zinc-500">TAG</p>
                <p className="mt-2 text-lg font-black text-fuchsia-400">{seoTags.length}</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <SeoInput label="슬러그" value={slug} onChange={setSlug} placeholder="ai-content-strategy-2026" />
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="block text-zinc-400 font-bold text-[12px]">Meta Description</label>
                  <span className="text-[11px] font-black text-zinc-500">{metaDescriptionLength}/155</span>
                </div>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="검색 결과에 보여줄 요약 설명"
                  rows={3}
                  className="w-full px-3 py-2.5 text-[14px] rounded-xl border border-zinc-700 bg-zinc-950 text-zinc-100 font-bold focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
              <SeoInput label="Focus Keyword" value={focusKeyword} onChange={setFocusKeyword} placeholder="핵심 포커스 키워드" />
              <SeoInput label="Canonical URL" value={canonicalUrl} onChange={setCanonicalUrl} placeholder="https://creaibox.blog/..." />

              <div>
                <label className="block text-zinc-400 font-bold mb-1.5 text-[12px]">SEO Tags</label>
                <input
                  type="text"
                  value={seoTags.join(', ')}
                  onChange={(e) => setSeoTags(e.target.value.split(',').map((tag) => tag.trim()).filter(Boolean))}
                  placeholder="ai, seo, content, blog"
                  className="w-full px-3 py-2.5 text-[14px] rounded-xl border border-zinc-700 bg-zinc-950 text-zinc-100 font-bold focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <CreaiboxAnalysisTower
            seoScore={analysisMetrics.seoScore}
            seoChecks={analysisMetrics.seoChecks}
            posRatio={posRatio}
            frequencies={analysisMetrics.frequencies}
            content={content}
            crawlabilityScore={analysisMetrics.crawlabilityScore}
            isDensitySafe={analysisMetrics.isDensitySafe}
          />
        </div>
      </div>

      {isPreviewOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[85vh] relative text-left animate-fade-in">
            <div className="bg-[#00c73c] px-6 py-4 flex justify-between items-center text-white shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight bg-white text-[#00c73c] px-2 py-0.5 rounded-md">C</span>
                <span className="font-black text-sm">Creaibox 블로그 프리뷰</span>
              </div>
              <button onClick={() => setIsPreviewOpen(false)} className="p-1 hover:bg-black/10 rounded-full transition-all">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar bg-white p-6 text-zinc-900 font-sans">
              <div className="flex items-center gap-3 border-b border-zinc-100 pb-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#00c73c]/10 text-[#00c73c] flex items-center justify-center font-black text-xs shrink-0 border border-[#00c73c]/20">
                  N
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-zinc-900 text-[13px]">{userNickname || "Creaibox 에디터"}</span>
                  <span className="text-[11px] text-zinc-400">방금 전 · Creaibox 아카이브 미리보기</span>
                </div>
              </div>

              <div className="space-y-4">
                {title && (
                  <h2 className="text-xl font-bold text-zinc-900 leading-snug border-b border-zinc-100 pb-3 mb-4">
                    {title}
                  </h2>
                )}

                <div className="markdown-content">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={customMarkdownComponents}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex justify-end shrink-0">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-[11px] font-black text-zinc-300 hover:text-white transition-all"
              >
                미리보기 닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SeoInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-zinc-400 font-bold mb-1.5 text-[12px]">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 text-[14px] rounded-xl border border-zinc-700 bg-zinc-950 text-zinc-100 font-bold focus:outline-none focus:border-blue-500"
      />
    </div>
  );
}