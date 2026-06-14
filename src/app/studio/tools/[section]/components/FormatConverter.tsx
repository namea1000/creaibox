"use client";

import React, { useState } from "react";
import { RefreshCw, Loader2, Upload, Download } from "lucide-react";

export default function FormatConverter() {
  const [file, setFile] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [targetFormat, setTargetFormat] = useState("webp");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFileName(uploadedFile.name);
    setFileSize(`${(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB`);
    setFile(uploadedFile.name);
    setResult(null);
    setProgress(0);
  };

  const handleConvert = () => {
    if (!file) return;
    setLoading(true);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setResult(`${fileName.substring(0, fileName.lastIndexOf("."))}._converted_.${targetFormat}`);
          setLoading(false);
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
        <h2 className="flex items-center gap-2 text-lg font-black text-white mb-2">
          <RefreshCw className="text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} size={20} />
          다목적 파일 포맷 변환기 (Format Converter)
        </h2>
        <p className="text-xs text-zinc-555 mb-4 leading-relaxed">
          다양한 비디오, 오디오, 이미지, 문서 파일을 업로드해 원하는 확장자 포맷(예: JPG to WebP, PDF to Word)으로 즉각 변환하여 최적화합니다.
        </p>

        {!file ? (
          <div className="border-2 border-dashed border-zinc-800 hover:border-emerald-500/40 rounded-2xl bg-zinc-950/40 p-10 text-center transition relative flex flex-col items-center justify-center gap-3">
            <input
              type="file"
              onChange={handleUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Upload size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">변환할 파일을 여기에 드래그하거나 클릭하세요</p>
              <p className="text-[10px] text-zinc-650 mt-1 font-bold">지원 포맷: JPG, PNG, PDF, DOCX, MP3, MP4 (최대 50MB)</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-zinc-850 bg-zinc-950/40 p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <RefreshCw size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{fileName}</p>
                  <p className="text-[9px] text-zinc-600 mt-0.5">{fileSize}</p>
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <span className="text-[10px] font-bold text-zinc-400">대상 포맷</span>
                <select
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value)}
                  className="h-9 rounded-lg border border-zinc-800 bg-zinc-950 px-2 text-xs font-bold text-zinc-300 outline-none"
                >
                  <option value="webp">WebP (고효율 이미지)</option>
                  <option value="png">PNG (무손실 이미지)</option>
                  <option value="pdf">PDF (문서 포맷)</option>
                  <option value="mp3">MP3 (오디오 압축)</option>
                </select>

                <button
                  onClick={() => {
                    setFile(null);
                    setResult(null);
                  }}
                  disabled={loading}
                  className="h-9 rounded-lg border border-zinc-850 bg-zinc-900/30 px-3 text-xs font-bold text-zinc-450 hover:text-white"
                >
                  취소
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              {!result ? (
                <button
                  onClick={handleConvert}
                  disabled={loading}
                  className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-emerald-650 px-6 text-xs font-black text-white hover:bg-emerald-600 disabled:opacity-50 transition shadow-lg shadow-emerald-600/10"
                >
                  {loading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      변환 중... {progress}%
                    </>
                  ) : (
                    <>
                      <RefreshCw size={14} />
                      변환 시작
                    </>
                  )}
                </button>
              ) : (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("변환 파일 다운로드를 개시합니다.");
                  }}
                  className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-emerald-650 px-6 text-xs font-black text-white hover:bg-emerald-600 transition shadow-lg shadow-emerald-600/10"
                >
                  <Download size={14} />
                  변환 완료 파일 다운로드 ({targetFormat.toUpperCase()})
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
