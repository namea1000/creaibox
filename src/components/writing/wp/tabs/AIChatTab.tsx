"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, ChevronDown, Trash2 } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChatTab() {
  // 🌟 로컬 스토리지에서 대화 기록 불러오기 (원본 로직 보존)
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('creaibox_chat_history');
      return saved ? (JSON.parse(saved) as Message[]) : [
        { role: 'assistant', content: '안녕하세요 사장님!\nCreAibox AI 어시스턴트입니다.\n무엇을 도와드릴까요?' }
      ];
    }
    return [{ role: 'assistant', content: '안녕하세요 사장님!' }];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("models/gemini-3-flash-preview");
  const [vaultKey, setVaultKey] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const modelOptions = [
    { id: 'models/gemini-3-flash-preview', label: '3 Flash Preview (최신, 실시간 정보 반영)' },
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

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const currentKey = localStorage.getItem('gemini_api_key');
    if (!currentKey) {
      alert("사장님! API Vault 메뉴에서 Gemini API 키를 먼저 입력해주세요.");
      return;
    }

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(currentKey);
      const model = genAI.getGenerativeModel({ 
        model: selectedModel,
        tools: [{ googleSearch: {} }] as any, 
        systemInstruction: `당신은 'CreAibox 어시스턴트'입니다. 규칙: 강조 기호(**) 사용 금지, 단락 단위 답변.`
      });

      const result = await model.generateContent(input);
      const response = await result.response;
      let text = response.text();
      text = text.replace(/\*\*/g, "").replace(/\*/g, "");

      const assistantMessage: Message = { role: 'assistant', content: text };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: "사장님, 연결에 문제가 발생했습니다. API 키를 확인해주세요." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 🌟 배경색(#05070a)과 폰트 스타일 사장님 원본 그대로 다크 고정
    <div className="flex-1 h-full flex flex-col bg-[#05070a] overflow-hidden font-sans border-l border-zinc-800">
      
      {/* 헤더 섹션 (다크모드 고정) */}
      <div className="sticky top-0 z-10 p-6 border-b border-zinc-800 flex items-center justify-between bg-[#05070a]/95 backdrop-blur-md">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-black text-white italic uppercase flex items-center gap-2 tracking-tighter">
            <Sparkles className="w-5 h-5 text-yellow-400" /> CreAibox AI Assistant
          </h2>
          <div className="relative">
            <select 
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px] px-3 py-1.5 rounded-lg focus:outline-none focus:border-yellow-500 font-bold appearance-none pr-8"
            >
              {modelOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={clearChat} className="p-2 text-zinc-600 hover:text-red-500 transition-colors">
            <Trash2 size={18} />
          </button>
          <div className={`text-[10px] font-black px-3 py-1.5 rounded border uppercase flex items-center ${vaultKey ? 'text-green-400 border-green-900 bg-green-950/30' : 'text-red-500 border-red-900 bg-red-950/30'}`}>
            ● {vaultKey ? 'Key Linked' : 'Key Missing'}
          </div>
        </div>
      </div>

      {/* 메시지 리스트 (다크모드 고정) */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#05070a]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-blue-600 shadow-blue-900/20' : 'bg-zinc-800 shadow-black'}`}>
                {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-yellow-400" />}
              </div>
              <div className={`p-4 rounded-2xl text-[13.5px] leading-relaxed shadow-xl whitespace-pre-wrap transition-all ${
                msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-zinc-900 text-zinc-300 border border-zinc-800'
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                <Bot size={16} className="text-zinc-600" />
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl">
                <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest italic">AI Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 입력 영역 (다크모드 고정) */}
      <form onSubmit={handleSend} className="p-6 bg-zinc-900/50 border-t border-zinc-800 backdrop-blur-md">
        <div className="relative max-w-5xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={vaultKey ? "무엇이든 물어보세요..." : "API 키를 먼저 입력해주세요"}
            disabled={!vaultKey || isLoading}
            className="w-full bg-zinc-800 border border-zinc-700 text-white pl-6 pr-16 py-4 rounded-2xl focus:outline-none focus:border-yellow-500 font-bold placeholder:text-zinc-600 shadow-inner"
          />
          <button 
            type="submit" 
            disabled={!vaultKey || isLoading} 
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all shadow-lg ${
              !vaultKey || isLoading ? 'bg-zinc-700 text-zinc-800' : 'bg-yellow-500 text-black hover:scale-105 active:scale-95 shadow-yellow-900/20'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}