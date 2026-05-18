"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Link2, FileText, BarChart3, HelpCircle, 
  RefreshCw, Copy, Save, AlertCircle, CheckCircle2, 
  Heading1, Heading2, Bold, Italic, Image as ImageIcon, 
  Check, Wand2, Type, Trash2, ArrowDownToLine, Zap, Layers, Cpu, ShieldAlert, PieChart, AlignLeft
} from 'lucide-react';

// 멀티미디어 이미지 블록 인터페이스 (기존 기능 규격 100% 보존)
interface ImageBlock {
  id: string;
  url: string;
  caption: string;
}

// 형태소 테이블 데이터 규격 보존
interface KeywordFrequency {
  word: string;
  count: number;
  density: number;
  status: 'good' | 'warning' | 'danger';
}

export default function NaverRecreatePage() {
  // 🌟 입력 모드 상태 관리 (원본 보존)
  const [sourceMode, setSourceMode] = useState<'url' | 'text'>('url');
  
  // 🌟 입력 필드 상태 (원본 보존)
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceText, setSourceText] = useState("");
  
  // 🌟 결과 에디터 상태 (원본 보존)
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("");
  const [images, setImages] = useState<ImageBlock[]>([]);
  
  // 🌟 로딩 및 고도화 엔진 상태 (원본 보존)
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🌟 실시간 원고 분석 매트릭스 상태 (원본 보존)
  const [similarityScore, setSimilarityScore] = useState(100); 
  const [seoScore, setSeoScore] = useState(0);
  const [seoChecks, setSeoChecks] = useState({
    titleKeyword: false,
    contentDensity: false,
    duplicateSafe: false, 
    structureCheck: false
  });

  // 🌟 [3면 올인원 확장] 형태소 및 아뷰징 디펜더 실시간 연결 상태 엔진
  const [isDensitySafe, setIsDensitySafe] = useState(true);
  const [nounRatio, setNounRatio] = useState(0);
  const [keywordCount, setKeywordCount] = useState(0);
  const [frequencies, setFrequencies] = useState<KeywordFrequency[]>([]);
  const [naverBotScore, setNaverBotScore] = useState(0);

  // 글자 수 및 단어 수 체크 연산 (기존 인프라 완전 보전)
  const imageCaptionsLength = images.reduce((acc, img) => acc + img.caption.length, 0);
  const charCount = content.length + imageCaptionsLength;

  // 🤖 실시간 AI 문서 유사도 및 블로그 SEO 엔진 시뮬레이션 이펙트 (원본 보존 및 5단 연산 싱크)
  useEffect(() => {
    if (title === "" && content === "") {
      setSeoScore(0);
      setSimilarityScore(100);
      setSeoChecks({ titleKeyword: false, contentDensity: false, duplicateSafe: false, structureCheck: false });
      setFrequencies([]);
      setNounRatio(0);
      setNaverBotScore(0);
      setKeywordCount(0);
      setIsDensitySafe(true);
      return;
    }

    const hasTitleKeyword = targetKeyword ? title.toLowerCase().includes(targetKeyword.toLowerCase()) : false;
    const count = targetKeyword ? (content.match(new RegExp(targetKeyword, 'gi')) || []).length : 0;
    const hasGoodDensity = count >= 3 && count <= 7;
    const hasSubHeadings = content.includes('##') || content.includes('###');
    
    // 재창조 알고리즘 유사도 연산 (보존)
    const calculatedSimilarity = Math.max(12, 95 - Math.floor(content.length / 25));
    const isSafeFromDuplicate = calculatedSimilarity < 45; 

    setSimilarityScore(calculatedSimilarity);
    setSeoChecks({
      titleKeyword: hasTitleKeyword,
      contentDensity: hasGoodDensity,
      duplicateSafe: isSafeFromDuplicate,
      structureCheck: hasSubHeadings
    });

    let score = 10;
    if (hasTitleKeyword) score += 30;
    if (hasGoodDensity) score += 25;
    if (isSafeFromDuplicate) score += 25;
    if (hasSubHeadings) score += 10;
    setSeoScore(score);

    // 🤖 [싱크로 주입] 3면 계량판 하드웨어용 데이터 가동
    setKeywordCount(count);
    const densitySafety = count <= 5;
    setIsDensitySafe(densitySafety);

    const activeKeyword = targetKeyword || "추출 단어";
    setFrequencies([
      { word: activeKeyword, count: count, density: Math.min(100, count * 6.5), status: count >= 3 && count <= 5 ? 'good' : count > 5 ? 'danger' : 'warning' },
      { word: "재창조", count: content.includes("재창조") ? 3 : 0, density: content.includes("재창조") ? 3.5 : 0, status: 'good' },
      { word: "알고리즘", count: content.includes("알고리즘") ? 2 : 0, density: content.includes("알고리즘") ? 2.5 : 0, status: 'good' },
      { word: "인프라", count: content.includes("인프라") ? 2 : 0, density: content.includes("인프라") ? 2.1 : 0, status: 'good' },
      { word: "문맥", count: content.includes("문맥") ? 2 : 0, density: content.includes("문맥") ? 2.1 : 0, status: 'good' }
    ]);

    const calculatedNoun = Math.min(65, 52 + (content.length % 11));
    setNounRatio(calculatedNoun);

    let naverScore = 15;
    if (count >= 3 && count <= 5) naverScore += 35;
    if (calculatedNoun >= 55 && calculatedNoun <= 65) naverScore += 25;
    if (hasSubHeadings) naverScore += 25;
    setNaverBotScore(naverScore);

  }, [title, content, targetKeyword, images]);

  // 형태소 프로그레스 연산용 개체
  const posRatio = {
    noun: nounRatio,
    verb: nounRatio > 0 ? Math.max(15, 32 - (content.length % 4)) : 0,
    get other() { return this.noun === 0 ? 0 : 100 - this.noun - this.verb; }
  };

  // 🤖 AI 글 재창조 실행기 (원본 백프로 보존)
  const handleRecreateAction = () => {
    if (sourceMode === 'url' && !sourceUrl) return alert("분석할 네이버 블로그 글 주소를 입력해 주세요!");
    if (sourceMode === 'text' && !sourceText) return alert("재창조할 소스 텍스트 내용을 입력해 주세요!");

    setIsAnalyzing(true);

    setTimeout(() => {
      if (sourceMode === 'url') {
        setTargetKeyword("지속 가능한 재테크");
        setTitle("모르면 평생 손해 보는 2026년식 지속 가능한 재테크 황금 규칙");
        setContent(`## 1. 서론: 왜 과거의 재테크 방식이 통하지 않는가?\n기존에 널리 퍼져있던 단순 저축이나 단기 유행성 투자 방식은 급변하는 인플레이션 시대에 발맞추기 어렵습니다. 지금 우리에게 가장 절실한 것은 바로 안전성과 성장성을 동시에 움켜쥐는 '지속 가능한 재테크'의 확립입니다.\n\n## 2. 네이버 분석을 통해 드러난 핵심 매커니즘\n타사 성공 사례들을 정밀 추적해 본 결과, 상위 노출 및 고수익을 올린 자산가들은 무작정 시드머니를 쪼개기보다 자산의 방어벽을 먼저 구축했습니다. \n* 첫째, 고정 지출의 스마트 리밸런싱\n* 둘째, 리스크 분산을 위한 다중 인컴 파이프라인 생성\n* 셋째, 정기적인 자산 밀도 검사\n\n## 3. 결론 및 실천 방법\n결국 리스크를 기회로 바꾸는 핵심 키는 흔들리지 않는 가이드라인을 세우고, 트렌드 키워드에 맞춰 매일 조금씩 나의 자산 포트폴리오를 우상향시키는 일입니다. 오늘부터 당장 실천해 보시기 바랍니다.`);
      } else {
        setTargetKeyword("인공지능 자동화");
        setTitle("업무 효율을 10배 끌어올리는 인공지능 자동화 시스템 구축 가이드");
        setContent(`## 1. 들어가는 글\n단순히 반복되는 문서 작업과 텍스트 수집에 소중한 비즈니스 리소스를 낭비하고 계신가요? 현대 비즈니스 생태계에서 '인공지능 자동화'는 선택이 아닌 생존을 위한 필수 인프라로 급부상했습니다.\n\n## 2. 완벽하게 재창조된 차세대 워크플로우\n복사해서 붙여넣는 구시대적 방식은 네이버 검색엔진이 먼저 알아채고 누락 필터를 작동시킵니다. 하지만 문맥의 핵심 뼈대만 추출하여 구조를 완전히 분해한 뒤 재생성하는 자동화 공정을 거치면, 중복 문서 규제를 완벽하게 빗겨 나가는 고품질 원고가 즉각 빌드됩니다.\n\n## 3. 요약 및 제언\n기계가 할 수 있는 영역은 고도화된 엔진에 과감히 위임하고, 인간은 기획과 마케팅의 방향성 설정에만 집중하는 구조를 완성해 보세요.`);
      }
      setIsAnalyzing(false);
    }, 2000);
  };

  // 기존 에디터 액션 기능들 (보존)
  const handleEnhanceContent = (type: 'expand' | 'tone' | 'correct') => {
    if (!content) return alert("교정할 본문 내용을 먼저 입력해 주세요!");
    setIsEnhancing(true);
    setTimeout(() => {
      if (type === 'expand') {
        setContent(prev => prev + `\n\n[AI 문장 확장] 본 시스템이 자체 가동하는 스마트블록 디펜스 알고리즘은 타사 원고와의 형태소 중복 검사를 분초 단위로 수행하여, 원작자가 보아도 감탄할 수준의 독창적 서사를 추가 부여합니다.`);
      } else if (type === 'tone') {
        setContent(prev => prev + `\n\n[AI 톤 변환] 격식과 정보성을 고루 갖춘 인플루언서 전문 에디션 문체로 내부 파싱 튜닝이 고도화 완료되었습니다.`);
      } else if (type === 'correct') {
        alert("네이버 수준의 맞춤법 및 유사 문장 우회 띄어쓰기 교정이 완료되었습니다!");
      }
      setIsEnhancing(false);
    }, 1000);
  };

  const handleImageUploadClick = () => fileInputRef.current?.click();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage: ImageBlock = {
          id: Date.now().toString(),
          url: reader.result as string,
          caption: "여기에 노출용 이미지 캡션(Alt 태그 키워드)을 입력하세요."
        };
        setImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateCaption = (id: string, text: string) => {
    setImages(prev => prev.map(img => img.id === id ? { ...img, caption: text } : img));
  };

  const handleDeleteImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleCopy = () => {
    const imageText = images.map((img, i) => `[이미지 ${i+1} 캡션: ${img.caption}]`).join('\n');
    navigator.clipboard.writeText(`제목: ${title}\n\n본문:\n${content}\n\n[포함된 이미지 데이터]\n${imageText}`);
    alert("재창조된 제목과 본문이 클립보드에 복사되었습니다!");
  };

  return (
    <div className="p-4 lg:p-6 max-w-[1700px] mx-auto h-[calc(100vh-140px)] grid grid-cols-1 lg:grid-cols-5 gap-4 text-zinc-100 overflow-hidden">
      
      {/* 👈 1번째 면: 제일 왼쪽 [AI 소스 믹서 컨트롤러 엔진] (원본 보존) */}
      <div className="lg:col-span-1 flex flex-col gap-4 h-full overflow-y-auto pr-0.5 custom-scrollbar">
        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-md space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-1.5">
            <Cpu size={14} /> AI Recreate Control
          </h3>

          <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-950 rounded-xl border border-zinc-850">
            <button onClick={() => setSourceMode('url')} className={`py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 ${sourceMode === 'url' ? 'bg-zinc-800 text-emerald-400 border border-zinc-700/60' : 'text-zinc-500 hover:text-zinc-300'}`}><Link2 size={13} /> URL 주소 추출</button>
            <button onClick={() => setSourceMode('text')} className={`py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 ${sourceMode === 'text' ? 'bg-zinc-800 text-blue-400 border border-zinc-700/60' : 'text-zinc-500 hover:text-zinc-300'}`}><FileText size={13} /> 원본 글 본문 입력</button>
          </div>

          <div className="space-y-3 text-xs">
            {sourceMode === 'url' ? (
              <div className="space-y-1.5">
                <label className="block text-zinc-400 font-bold flex items-center gap-1"><span className="w-1 h-1 bg-emerald-400 rounded-full" /> 타겟 글 주소</label>
                <input type="text" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="https://blog.naver.com/..." className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-200 font-medium focus:outline-none" />
                <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">💡 네이버의 스크랩 방지 스크립트를 프록시 터널로 무력화하여 문맥만 강제로 긁어모읍니다.</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="block text-zinc-400 font-bold flex items-center gap-1"><span className="w-1 h-1 bg-blue-400 rounded-full" /> 텍스트 소스 입력 영역</label>
                <textarea value={sourceText} onChange={(e) => setSourceText(e.target.value)} placeholder="재구성하고 싶은 원고 내용을 이곳에 넓게 복사-붙여넣기 하세요..." className="w-full h-44 p-3 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 placeholder-zinc-700 focus:outline-none resize-none font-medium leading-relaxed text-[11px]" />
              </div>
            )}
            <div className="pt-1">
              <label className="block text-zinc-400 font-bold mb-1.5">재창조 목적 타겟 키워드 (선택)</label>
              <input type="text" value={targetKeyword} onChange={(e) => setTargetKeyword(e.target.value)} placeholder="공란 시 AI가 원본에서 자동 추출" className="w-full px-3 py-2 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-200 font-bold focus:outline-none" />
            </div>
          </div>

          <button onClick={handleRecreateAction} disabled={isAnalyzing} className="w-full py-3 bg-gradient-to-tr from-emerald-600 to-teal-600 text-white text-xs font-black rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
            {isAnalyzing ? <><RefreshCw size={14} className="animate-spin" /> 스핀 리라이팅 중...</> : <><Sparkles size={14} className="text-yellow-300" /> AI 글 재창조 가동</>}
          </button>
        </div>

        <div className="p-4 rounded-2xl border border-zinc-800/60 bg-zinc-950/40 space-y-2">
          <h4 className="text-[11px] font-black uppercase text-zinc-500 tracking-wider flex items-center gap-1"><Zap size={11} className="text-amber-400" /> Spin-Rewriting Engine</h4>
          <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">글의 핵심 논리 전개 방식을 완벽하게 수학적 매트릭스로 변환하여 아예 처음부터 새로 작성한 형태의 독립적 원고를 직조해 냅니다.</p>
        </div>
      </div>

      {/* 💻 2번째 면: 가운데 (2칸 차지) [스마트 에디터 메인 창] (원본 보존) */}
      <div className="lg:col-span-2 flex flex-col bg-zinc-900/40 border border-emerald-500/20 rounded-2xl overflow-hidden backdrop-blur-md h-full shadow-2xl">
        <div className="h-14 border-b border-zinc-800 bg-zinc-950/60 px-4 flex items-center justify-between overflow-x-auto shrink-0">
          <div className="flex items-center gap-1.5 text-zinc-400 shrink-0">
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
            <button onClick={handleImageUploadClick} className="p-2 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-xl transition-all text-xs font-bold border border-zinc-800 bg-zinc-900/50 flex items-center gap-1"><ImageIcon size={14} /> 사진 추가</button>
            <div className="w-px h-5 bg-zinc-800 mx-1" />
            <button className="p-2 hover:bg-zinc-800 hover:text-white rounded-xl"><Heading1 size={15} /></button>
            <button className="p-2 hover:bg-zinc-800 hover:text-white rounded-xl"><Heading2 size={15} /></button>
            <div className="w-px h-4 bg-zinc-800 mx-1" />
            <button className="p-2 hover:bg-zinc-800 hover:text-white rounded-xl font-bold"><Bold size={15} /></button>
            <button className="p-2 hover:bg-zinc-800 hover:text-white rounded-xl italic"><Italic size={15} /></button>
            <div className="w-px h-4 bg-zinc-800 mx-1" />
            <button className="p-2 hover:bg-zinc-800 hover:text-white rounded-xl"><Link2 size={15} /></button>
            <div className="w-px h-5 bg-zinc-800 mx-1" />
            <button onClick={() => handleEnhanceContent('correct')} disabled={isEnhancing} className="p-2 hover:bg-zinc-800 hover:text-white rounded-xl text-xs font-medium text-zinc-300"><Type size={14} /> 맞춤법 검사</button>
            <button onClick={() => handleEnhanceContent('expand')} disabled={isEnhancing} className="p-2 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-xl text-xs font-black text-emerald-400 flex items-center gap-1"><Wand2 size={14} /> AI 문장 확장</button>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-zinc-500 shrink-0 pl-4">
            <span className="bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-800">Chars: <strong className="text-emerald-400">{charCount}</strong></span>
          </div>
        </div>

        <div className="flex-1 p-5 md:p-6 flex flex-col space-y-5 overflow-y-auto custom-scrollbar bg-zinc-950/40">
          <input type="text" placeholder="AI 글 재창조를 가동하시면 중복 필터를 완전히 회피하는 제목이 빌드됩니다." value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-transparent text-xl font-black text-white placeholder-zinc-700 focus:outline-none border-b border-zinc-800 pb-4 tracking-tight" />
          
          {images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-zinc-800/50 pb-4">
              {images.map((img) => (
                <div key={img.id} className="group relative rounded-xl border border-zinc-800 bg-zinc-950 p-2 space-y-2 overflow-hidden shadow-md">
                  <div className="relative w-full h-28 rounded-lg overflow-hidden bg-zinc-900">
                    <img src={img.url} alt="Uploaded block" className="w-full h-full object-cover" />
                    <button onClick={() => handleDeleteImage(img.id)} className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={11} /></button>
                  </div>
                  <input type="text" value={img.caption} onChange={(e) => handleUpdateCaption(img.id, e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-[10px] font-medium text-zinc-400 focus:outline-none" />
                </div>
              ))}
            </div>
          )}

          <textarea placeholder="재창조 본문 결과 영역..." value={content} onChange={(e) => setContent(e.target.value)} className="w-full flex-1 bg-transparent text-sm text-zinc-300 focus:outline-none resize-none leading-relaxed font-medium min-h-[220px]" />
        </div>

        <div className="h-16 border-t border-zinc-800 bg-zinc-950/60 px-6 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-zinc-500 font-medium">AI 재창조 원고 검증 파이프라인 대기 중</span>
          <div className="flex items-center gap-3">
            <button onClick={handleCopy} className="px-4 py-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 text-xs font-bold hover:bg-zinc-800"><Copy size={13} /> 결과 복사</button>
            <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black shadow-lg shadow-emerald-600/20">원고 최종 저장</button>
          </div>
        </div>
      </div>

      {/* 👉 3면 (우측 2칸 병합): 🌟 [사장님 기획 스펙 완벽 가동] 5단 융합 철통 관제 탑 */}
      <div className="lg:col-span-2 flex flex-col gap-4 h-full overflow-y-auto pl-0.5 custom-scrollbar">
        
        {/* 🥇 1단: Anti-Plagiarism Guard */}
        <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0d0e12]/80 backdrop-blur-md space-y-4 shadow-2xl">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-1.5">
            <BarChart3 size={14} /> Anti-Plagiarism Guard
          </h3>
          <div className="flex items-center gap-4 border-b border-zinc-800 pb-3">
            <div className="relative w-14 h-14 rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center shrink-0">
              <span className={`text-sm font-black ${similarityScore < 45 ? 'text-emerald-400' : similarityScore < 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                {similarityScore}%
              </span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-200">원본 문서 유사도</h4>
              <p className="text-[10px] text-zinc-500 font-medium mt-0.5">35% 미만일 때 안심 노출 최적 등급 판정</p>
            </div>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 flex items-center gap-1.5 font-medium">
                {seoChecks.duplicateSafe ? <CheckCircle2 size={14} className="text-emerald-400" /> : <AlertCircle size={14} className="text-zinc-600" />}
                중복 문서 저품질 필터 우회
              </span>
              <span className={`text-[10px] font-bold ${seoChecks.duplicateSafe ? 'text-emerald-400' : 'text-zinc-600'}`}>25점</span>
            </div>
          </div>
        </div>

        {/* 🥈 2단: Wordpress SEO Analyzer */}
        <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0d0e12]/80 backdrop-blur-md space-y-4 shadow-2xl">
          <div className="flex justify-between items-center border-b border-zinc-800/80 pb-3">
            <h3 className="text-xs font-black uppercase tracking-[0.15em] text-blue-400 flex items-center gap-1.5">
              <FileText size={13} /> Wordpress SEO Analyzer
            </h3>
            <div className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono font-black">
              SCORE: {seoScore}/100
            </div>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 flex items-center gap-2">
                {seoChecks.titleKeyword ? <Check size={14} className="text-blue-400" /> : <AlertCircle size={14} className="text-zinc-600" />}
                제목 내 핵심 키워드 유무 체크
              </span>
              <span className="text-[10px] font-mono text-zinc-500">30점</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 flex items-center gap-2">
                {seoChecks.contentDensity ? <Check size={14} className="text-blue-400" /> : <AlertCircle size={14} className="text-zinc-600" />}
                본문 적정 키워드 밀도 (3~7회)
              </span>
              <span className="text-[10px] font-mono text-zinc-500">25점</span>
            </div>
          </div>
        </div>

        {/* 🥉 3단: Naver Anti-Abusing Defender */}
        <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0d0e12]/80 backdrop-blur-md space-y-4 shadow-2xl">
          <h3 className="text-xs font-black uppercase tracking-[0.15em] text-amber-500 flex items-center gap-1.5">
            <ShieldAlert size={13} /> Naver Anti-Abusing Defender
          </h3>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/60">
              <span className="text-[10px] text-zinc-500 font-bold block mb-1">복사 붙여넣기 의심</span>
              <span className="text-xs font-black text-emerald-400">0.0% (안전)</span>
            </div>
            <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/60">
              <span className="text-[10px] text-zinc-500 font-bold block mb-1">기계적 생성 속도</span>
              <span className="text-xs font-black text-emerald-400">정상 트래킹</span>
            </div>
          </div>
        </div>

        {/* 🏅 4단: 한국어 형태소 의존성 수집 계량판 */}
        <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0d0e12]/80 backdrop-blur-md space-y-5 shadow-2xl">
          <div className="flex justify-between items-center border-b border-zinc-800/80 pb-3">
            <h3 className="text-xs font-black text-zinc-200 flex items-center gap-2">
              <Cpu size={14} className="text-emerald-400" /> 한국어 형태소 의존성 수집 계량판
            </h3>
            <span className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-500 px-2 py-0.5 rounded font-mono">PARSER: MECAB-LIVE</span>
          </div>

          <div className="space-y-2.5">
            <span className="text-[10px] text-zinc-400 font-medium flex items-center gap-1">
              <PieChart size={12} className="text-blue-400" /> 네이버 검색 봇 인식 형태소 구성 비율
            </span>
            <div className="w-full h-3.5 rounded-full bg-zinc-950 overflow-hidden flex border border-zinc-900">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 h-full transition-all duration-300" style={{ width: `${posRatio.noun}%` }} />
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 h-full transition-all duration-300" style={{ width: `${posRatio.verb}%` }} />
              <div className="bg-zinc-800 h-full transition-all duration-300" style={{ width: `${posRatio.other}%` }} />
            </div>
            <div className="flex items-center gap-4 text-[9px] font-bold text-zinc-500 pl-0.5">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> 명사 (체언) <strong className="text-zinc-300">{posRatio.noun}%</strong></span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 동사/형용사 (용언) <strong className="text-zinc-300">{posRatio.verb}%</strong></span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-zinc-700" /> 기타 수식/조사 <strong className="text-zinc-300">{posRatio.other}%</strong></span>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <h4 className="text-[10px] font-black uppercase text-zinc-400 flex items-center gap-1"><AlignLeft size={12} className="text-emerald-400" /> 단어별 정밀 출현 빈도 톱 매트릭스</h4>
            <div className="border border-zinc-850 rounded-xl overflow-hidden bg-zinc-950/40">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="bg-zinc-950/80 border-b border-zinc-850 text-zinc-500 font-bold">
                    <th className="p-3 pl-4">형태소 핵심 어휘</th>
                    <th className="p-3">등장 빈도</th>
                    <th className="p-3">문맥 밀도 비율</th>
                    <th className="p-3 text-right pr-4">엔진 안전 진단</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850/40 text-zinc-300">
                  {frequencies.map((f, i) => (
                    <tr key={i} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="p-3 pl-4 font-black text-white">{f.word}</td>
                      <td className="p-3 font-mono font-bold text-zinc-500">{f.count}회 카운트</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-zinc-900 h-1 rounded-full overflow-hidden border border-zinc-850">
                            <div className={`h-full ${f.status === 'danger' ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${f.density}%` }} />
                          </div>
                          <span className="font-mono text-[10px] text-zinc-500">{f.density.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="p-3 text-right pr-4">
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${f.status === 'good' ? 'bg-emerald-500/10 text-emerald-400' : f.status === 'warning' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-400'}`}>
                          {f.status === 'good' ? '안전 비율' : f.status === 'warning' ? '대기 중' : '도배 경고'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 🏆 5단: Naver SEO Crawler Score */}
        <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0d0e12]/80 backdrop-blur-md space-y-4 shadow-2xl">
          <h3 className="text-xs font-black uppercase tracking-[0.15em] text-emerald-400 flex items-center gap-1.5">
            <BarChart3 size={13} /> Naver SEO Crawler Score
          </h3>
          <div className="flex items-center gap-4 border-b border-zinc-800/80 pb-3.5">
            <div className="w-12 h-12 rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center font-black text-sm text-emerald-400 ring-4 ring-emerald-500/10">
              {naverBotScore}%
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-200">형태소 매칭 최적화 지수</h4>
              <p className="text-[10px] text-zinc-500 font-medium">네이버 DIA+ 인공지능 검색 로봇 수집 선호도</p>
            </div>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 flex items-center gap-2 font-medium">
                {isDensitySafe ? <CheckCircle2 size={14} className="text-emerald-400" /> : <ShieldAlert size={14} className="text-red-500 animate-pulse" />}
                타겟 키워드 도배 방어 레이어 (3~5회 안쪽)
              </span>
              <span className="text-[10px] font-bold text-emerald-400">35점</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 flex items-center gap-2 font-medium">
                {posRatio.noun >= 55 && posRatio.noun <= 65 ? <CheckCircle2 size={14} className="text-emerald-400" /> : <AlertCircle size={14} className="text-zinc-600" />}
                명사(체언) 황금 비율 구간 안착 (55~65%)
              </span>
              <span className="text-[10px] font-bold text-emerald-400">25점</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 flex items-center gap-2 font-medium">
                {seoChecks.structureCheck ? <CheckCircle2 size={14} className="text-emerald-400" /> : <AlertCircle size={14} className="text-zinc-600" />}
                스마트블록 마크다운 소스 카테고리 규격
              </span>
              <span className="text-[10px] font-bold text-emerald-400">25점</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-850 text-[11px] leading-relaxed">
            <div className="text-[10px] uppercase font-bold text-zinc-500 flex items-center gap-1 mb-1"><HelpCircle size={12} className="text-blue-500" /> 검색 로봇 전용 소견 리포트</div>
            {!isDensitySafe ? (
              <p className="text-red-400 font-medium">🚨 위험: 특정 단어가 너무 빈번하게 도배 검출되었습니다. C-Rank 알고리즘 필터에 의해 패널티 누락 위험이 있으니 본문을 교정하십시오.</p>
            ) : (
              <p className="text-zinc-400 font-medium">✅ 매우 안전: 형태소 배치 밀도와 단어 빈도 밸런스가 네이버 검색 스파이더 봇이 가장 좋아하는 구조입니다. 상위 노출 승인 준비가 완료되었습니다.</p>
            )}
          </div>
        </div>

        {/* 풋터 팁 박스 */}
        <div className="p-4 rounded-xl border border-zinc-850 bg-zinc-950/20 text-[10px] text-zinc-500 font-medium leading-relaxed shadow-inner">
          <span className="text-zinc-400 font-black tracking-wider block mb-1">C-RANK INSIGHT</span>
          본 계량 관제판을 안전 통과한 원고들은 네이버 스마트블록 검색 엔진에 의해 고품질 정보성 오리지널 문서로 분류되어 최상단 섹션 우선 배정 가중치를 수집합니다.
        </div>

      </div>

    </div>
  );
}