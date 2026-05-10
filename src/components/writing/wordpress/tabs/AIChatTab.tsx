import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, ChevronDown, RefreshCw, Trash2 } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatTabProps {
  sharedContent?: string;
}

export default function AIChatTab({ sharedContent = "" }: AIChatTabProps) {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('creaibox_chat_history');
      return saved ? (JSON.parse(saved) as Message[]) : [
        { role: 'assistant', content: '안녕하세요 사장님!\nCreAIbox AI 어시스턴트입니다.\n무엇을 도와드릴까요?' } as Message
      ];
    }
    return [{ role: 'assistant', content: '안녕하세요 사장님!' } as Message];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("models/gemini-3-flash-preview"); // 최신 모델 권장
  const [vaultKey, setVaultKey] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const modelOptions = [
    { id: 'models/gemini-3-flash-preview', label: '3 Flash Preview (최신, 실시간 정보 반영)' }, // 🌟 새로 추가!
    { id: 'models/gemini-1.5-flash', label: '1.5 Flash (실시간 검색 지원 / 초고속)' },
    { id: 'models/gemini-1.5-pro', label: '1.5 Pro (고급 분석 및 추론)' },
  ];

  useEffect(() => {
    localStorage.setItem('creaibox_chat_history', JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    setVaultKey(savedKey);
  }, []);

  const clearChat = () => {
    if (window.confirm("대화 내용을 모두 삭제하고 초기화할까요?")) {
      const initialMsg: Message[] = [{ role: 'assistant', content: '대화가 초기화되었습니다. 무엇을 도와드릴까요?' }];
      setMessages(initialMsg);
      localStorage.removeItem('creaibox_chat_history');
    }
  };

  const handleSend = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();

    const messageText = customText || input;
    if (!messageText.trim() || isLoading) return;

    const currentKey = localStorage.getItem('gemini_api_key');
    if (!currentKey) {
      alert("사장님! API Vault 메뉴에서 Gemini API 키를 먼저 입력해주세요.");
      return;
    }

    const userMessage: Message = { role: 'user', content: messageText };
    setMessages((prev: Message[]) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(currentKey);
      // 🌟 실시간 검색(Google Search Tool)을 활성화하여 모델 로드
      const model = genAI.getGenerativeModel({ 
        model: selectedModel,
        tools: [{ googleSearch: {} }] as any, 
        systemInstruction: `당신은 'CreAIbox 어시스턴트'입니다. 
        규칙:
        1. 첫 인사(사장님, 안녕하십니까 등)는 대화 시작 시 한 번만 하며, 이후 답변부터는 인사 없이 바로 답변만 합니다.
        2. '**' 같은 강조 기호는 절대 사용하지 마세요.
        3. 매 줄마다 줄바꿈하지 말고, 의미 있는 단락 단위로만 끊어서 답변하세요. 
        4. 실시간 정보가 필요하면 반드시 구글 검색 기능을 활용하세요.`
      });

      const prompt = sharedContent 
        ? `[현재 작업 중인 글]:\n${sharedContent}\n\n[요청]:\n${messageText}`
        : messageText;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      // 마크다운 강조 기호 사후 제거
      text = text.replace(/\*\*/g, "").replace(/\*/g, "");

      const assistantMessage: Message = { role: 'assistant', content: text };
      setMessages((prev: Message[]) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI 호출 에러:", error);
      setMessages((prev: Message[]) => [...prev, { 
        role: 'assistant', 
        content: "사장님, 연결에 문제가 발생했습니다. API 키가 유효한지 다시 확인해주세요." 
      } as Message]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeContext = () => {
    if (!sharedContent.trim()) {
      alert("분석할 글 내용이 없습니다.");
      return;
    }
    handleSend(undefined, "현재 작성 중인 이 글을 분석하고 개선 제안을 해줘.");
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-[#05070a] overflow-hidden font-sans">
      {/* 🌟 헤더 섹션: sticky와 z-index를 사용하여 고정 */}
      <div className="sticky top-0 z-10 p-6 border-b border-zinc-800 flex items-center justify-between bg-[#05070a]/95 backdrop-blur-md">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-black text-white italic uppercase flex items-center gap-2 tracking-tighter">
            <Sparkles className="w-5 h-5 text-yellow-400" /> CreAIbox AI Assistant
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-zinc-500 uppercase">AI 모델 선택</span>
            <div className="relative">
              <select 
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="appearance-none bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px] px-3 py-1.5 pr-8 rounded-lg focus:outline-none focus:border-yellow-500 cursor-pointer font-bold"
              >
                {modelOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-2 items-center">
            <button onClick={clearChat} className="p-2 text-zinc-500 hover:text-red-500 transition-colors" title="대화 초기화">
              <Trash2 size={16} />
            </button>
            <div className={`text-[10px] font-black px-2 py-1 rounded border uppercase ${vaultKey ? 'text-green-400 border-green-900 bg-green-950/30' : 'text-red-500 border-red-900 bg-red-950/30'}`}>
              ● {vaultKey ? 'Key Linked' : 'Key Missing'}
            </div>
          </div>
          <button 
            onClick={handleAnalyzeContext}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-yellow-400 text-[11px] font-black py-2 px-4 rounded-xl border border-zinc-700 transition-all active:scale-95 shadow-lg"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            글 분석 제안
          </button>
        </div>
      </div>

      {/* 메시지 리스트 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md ${msg.role === 'user' ? 'bg-blue-600' : 'bg-zinc-800'}`}>
                {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-yellow-400" />}
              </div>
              <div className={`p-4 rounded-2xl text-[13.5px] leading-relaxed shadow-xl whitespace-pre-wrap ${
                msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-zinc-900 text-zinc-300 rounded-tl-none border border-zinc-800'
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce" />
              <span className="text-zinc-500 text-[11px] font-bold uppercase italic tracking-widest">Searching with Google...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-6 bg-zinc-900/50 border-t border-zinc-800">
        <div className="relative max-w-5xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={vaultKey ? "무엇이든 물어보세요..." : "API 키를 먼저 입력해주세요"}
            disabled={!vaultKey || isLoading}
            className="w-full bg-zinc-800 border border-zinc-700 text-white pl-6 pr-16 py-4 rounded-2xl focus:outline-none focus:border-yellow-500 transition-all disabled:opacity-30"
          />
          <button type="submit" disabled={!vaultKey || isLoading} className="absolute right-3 top-1/2 -translate-y-1/2 bg-yellow-500 p-2.5 rounded-xl text-black shadow-lg">
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}