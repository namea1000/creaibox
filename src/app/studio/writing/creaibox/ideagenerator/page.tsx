'use client';

import React, { useState } from 'react';
import { Lightbulb, Sparkles, RefreshCw, Copy, Save, Trash2, Clock, CheckCircle } from 'lucide-react';

/**
 * Gemini API가 연동된 아이디어 생성기 페이지
 * 환경 변수 GEMINI_API_KEY가 필요합니다.
 */
export default function Page() {
  const [idea, setIdea] = useState("버튼을 눌러 AI가 제안하는 아이디어를 확인해보세요.");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("기술");
  const [savedIdeas, setSavedIdeas] = useState<string[]>([]);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const categories = ["기술", "환경", "비즈니스", "예술", "생활"];

  const generateIdea = async () => {
    setLoading(true);
    try {
      // 실제 Gemini API 호출
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview-09-2025:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${category} 분야의 혁신적이고 창의적인 사업 아이디어를 한 문장으로 제안해줘.` }] }]
          })
        }
      );

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "아이디어 생성에 실패했습니다.";
      setIdea(generatedText.trim());
    } catch (error) {
      setIdea("오류가 발생했습니다. API 키를 확인해주세요.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const saveIdea = () => {
    if (!savedIdeas.includes(idea) && !idea.includes("버튼을 눌러")) {
      setSavedIdeas([idea, ...savedIdeas]);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(idea);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <Lightbulb className="text-amber-500" /> AI 아이디어 허브
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <section className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex gap-2 mt-3 mb-6 overflow-x-auto pb-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${category === c ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 min-h-[200px] flex items-center justify-center text-center mb-6">
                {loading ? <RefreshCw className="animate-spin text-amber-500" size={32} /> : <h2 className="text-xl font-bold text-gray-800">"{idea}"</h2>}
              </div>

              <div className="flex gap-3">
                <button onClick={generateIdea} className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                  <Sparkles size={18} /> 아이디어 생성
                </button>
                <button onClick={saveIdea} className="bg-amber-100 p-3 rounded-xl"><Save size={20} /></button>
                <button onClick={copyToClipboard} className="bg-gray-100 p-3 rounded-xl">
                  {copyFeedback ? <CheckCircle size={20} className="text-green-500"/> : <Copy size={20} />}
                </button>
              </div>
            </div>
          </section>

          <aside className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="font-bold mb-4 flex items-center gap-2"><Clock size={18} /> 저장된 목록</div>
            <div className="space-y-3">
              {savedIdeas.map((item, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg text-sm flex justify-between items-center">
                  <span className="truncate mr-2">{item}</span>
                  <button onClick={() => setSavedIdeas(savedIdeas.filter((_, i) => i !== idx))} className="text-red-400 shrink-0"><Trash2 size={14}/></button>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}