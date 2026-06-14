"use client";

import React, { useState } from "react";
import { Eye, Loader2, Upload, Copy, Check, FileText } from "lucide-react";

export default function OcrExtractor() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setResultText("");
    };
    reader.readAsDataURL(file);
  };

  const handleOcr = () => {
    if (!image) return;
    setLoading(true);

    setTimeout(() => {
      setResultText(
        `[추출된 문자 정보]\n크리에이박스는 누구나 손쉽게 비디오 쇼츠와 음원을 결합해 1인 지식 창업을 달성할 수 있도록 돕는 인공지능 콘텐츠 플래너 및 리서치 플랫폼입니다.\n\n일정표 스케줄링 및 가사 소재 아이디어 허브, 키워드 순위 분석 등 성장 지향적인 도구를 결합했습니다.`
      );
      setLoading(false);
    }, 1100);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
        <h2 className="flex items-center gap-2 text-lg font-black text-white mb-2">
          <Eye className="text-emerald-400" size={20} />
          AI OCR 문자 추출 (Optical Character Recognition)
        </h2>
        <p className="text-xs text-zinc-555 mb-4 leading-relaxed">
          책, 영수증, 기획안, 캡처 화면 이미지를 업로드하면 인쇄 및 자필 한국어/영어 문자를 정밀 판독해 디지털 텍스트로 전환합니다.
        </p>

        {!image ? (
          <div className="border-2 border-dashed border-zinc-800 hover:border-emerald-500/40 rounded-2xl bg-zinc-950/40 p-10 text-center transition relative flex flex-col items-center justify-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Upload size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">이미지 파일을 여기에 드래그하거나 클릭하세요</p>
              <p className="text-[10px] text-zinc-650 mt-1 font-bold">지원 포맷: JPG, PNG, WebP (최대 15MB)</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Left Preview */}
              <div className="rounded-xl border border-zinc-850 bg-zinc-950/60 p-4 text-center relative overflow-hidden">
                <p className="text-[10px] font-bold text-zinc-500 mb-2">업로드 이미지</p>
                <div className="aspect-square max-h-60 mx-auto overflow-hidden rounded-lg border border-zinc-850 flex items-center justify-center bg-zinc-900 relative">
                  <img src={image} alt="Upload" className="max-h-full max-w-full object-contain" />
                  {loading && (
                    <div className="absolute inset-x-0 h-1 bg-emerald-500/80 shadow-[0_0_10px_#10b981] animate-bounce top-0 bottom-0" />
                  )}
                </div>
              </div>

              {/* Right Result Textarea */}
              <div className="rounded-xl border border-zinc-850 bg-zinc-950/60 p-4 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 mb-2">텍스트 추출 결과</p>
                  
                  {loading ? (
                    <div className="h-56 flex flex-col items-center justify-center gap-2">
                      <Loader2 className="animate-spin text-emerald-400" size={24} />
                      <p className="text-[10px] font-bold text-zinc-500">이미지에서 폰트 노출을 판독 중...</p>
                    </div>
                  ) : resultText ? (
                    <textarea
                      rows={10}
                      value={resultText}
                      onChange={(e) => setResultText(e.target.value)}
                      className="w-full h-56 rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs font-semibold text-white outline-none focus:border-emerald-500/50 resize-none leading-relaxed"
                    />
                  ) : (
                    <div className="h-56 flex items-center justify-center text-[10px] text-zinc-650 font-bold">
                      문자 추출 버튼을 누르면 이 영역에 텍스트가 표시됩니다.
                    </div>
                  )}
                </div>

                {resultText && !loading && (
                  <div className="flex justify-end pt-3">
                    <button
                      onClick={handleCopy}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 px-4 text-xs font-bold text-zinc-200 transition"
                    >
                      {copied ? (
                        <>
                          <Check size={13} className="text-emerald-400" />
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
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setImage(null);
                  setResultText("");
                }}
                disabled={loading}
                className="h-10 rounded-xl border border-zinc-800 bg-zinc-900/30 px-5 text-xs font-bold text-zinc-400 hover:text-white hover:border-zinc-700 transition"
              >
                새 이미지 업로드
              </button>

              {!resultText && (
                <button
                  onClick={handleOcr}
                  disabled={loading}
                  className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-emerald-650 px-6 text-xs font-black text-white hover:bg-emerald-600 disabled:opacity-50 transition shadow-lg shadow-emerald-600/10"
                >
                  <FileText size={14} />
                  문자 추출 시작
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
