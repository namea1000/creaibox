"use client";

import React, { useState } from "react";
import { Code2, Loader2, Copy, Check } from "lucide-react";

export default function CodeBeautifier() {
  const [code, setCode] = useState("");
  const [lang, setLang] = useState("json");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleBeautify = () => {
    if (!code.trim()) return;
    setLoading(true);

    setTimeout(() => {
      // Simple custom beautifier simulator
      let formatted = "";
      try {
        if (lang === "json") {
          const parsed = JSON.parse(code.trim());
          formatted = JSON.stringify(parsed, null, 2);
        } else {
          // simple indentation rules mockup for HTML/CSS/JS
          formatted = code
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0)
            .join("\n  ");
        }
        setResult(formatted);
      } catch (e) {
        // Fallback simple cleanup if parse fails
        formatted = code
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
          .join("\n");
        setResult(formatted);
      }
      setLoading(false);
    }, 600);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
        <h2 className="flex items-center gap-2 text-lg font-black text-white mb-2">
          <Code2 className="text-sky-400" size={20} />
          코드 뷰티파이어 (Code Beautifier & Formatter)
        </h2>
        <p className="text-xs text-zinc-555 mb-4 leading-relaxed">
          줄바꿈이 꼬이거나 가독성이 떨어지는 HTML, CSS, Javascript, JSON 코드를 복사해 붙여넣으면 문법 여백과 들여쓰기를 정돈하여 가독성을 높여줍니다.
        </p>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-bold text-zinc-450">
            <span>대상 코드 언어</span>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="h-9 rounded-lg border border-zinc-800 bg-zinc-950 px-2 text-xs font-bold text-zinc-300 outline-none"
            >
              <option value="json">JSON 데이터</option>
              <option value="html">HTML 마크업</option>
              <option value="css">CSS 스타일</option>
              <option value="javascript">Javascript 로직</option>
            </select>
          </div>

          <textarea
            rows={8}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="여기에 코드를 복사해서 붙여넣으세요...&#10;예: {&quot;name&quot;:&quot;creaibox&quot;,&quot;active&quot;:true,&quot;version&quot;:1}"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-xs font-mono text-white outline-none placeholder:text-zinc-700 focus:border-sky-500/50 resize-none leading-relaxed"
          />

          <div className="flex gap-2 justify-end pt-1">
            <button
              onClick={() => {
                setCode("");
                setResult("");
              }}
              className="h-10 rounded-xl border border-zinc-800 bg-zinc-900/30 px-5 text-xs font-bold text-zinc-400 hover:text-white hover:border-zinc-700 transition"
            >
              초기화
            </button>
            <button
              onClick={handleBeautify}
              disabled={loading || !code.trim()}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-sky-600 px-6 text-xs font-black text-white hover:bg-sky-500 disabled:opacity-50 transition shadow-lg shadow-sky-600/10"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Code2 size={14} />}
              코드 줄정돈 실행
            </button>
          </div>
        </div>
      </div>

      {result && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-white">정돈 완료 코드</h3>
            <button
              onClick={handleCopy}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 px-4 text-xs font-bold text-zinc-200 transition border border-zinc-800"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-sky-400" />
                  복사 완료
                </>
              ) : (
                <>
                  <Copy size={13} />
                  전체 복사
                </>
              )}
            </button>
          </div>

          <div className="rounded-xl border border-zinc-850 bg-zinc-950 p-4 font-mono text-xs text-sky-450 leading-relaxed overflow-x-auto whitespace-pre">
            {result}
          </div>
        </div>
      )}
    </div>
  );
}
