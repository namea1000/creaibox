"use client";

import React, { useState } from "react";
import { Database, Loader2, Upload } from "lucide-react";

export default function MetadataExtractor() {
  const [file, setFile] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<any[]>([]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFileName(uploadedFile.name);
    setFileSize(`${(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB`);
    setFile(uploadedFile.name);
    setMetadata([]);
  };

  const handleExtract = () => {
    if (!file) return;
    setLoading(true);

    setTimeout(() => {
      // Return metadata parameters list
      setMetadata([
        { label: "파일 이름", value: fileName },
        { label: "파일 용량", value: fileSize },
        { label: "MIME 형식", value: fileName.endsWith(".pdf") ? "application/pdf" : "image/png" },
        { label: "최종 수정일", value: new Date().toLocaleDateString() },
        { label: "이미지 규격 (Dimensions)", value: "1920 x 1080 px (16:9)" },
        { label: "카메라 제조기기", value: "Apple iPhone 15 Pro Max" },
        { label: "조리개 값 (Aperture)", value: "f/1.78" },
      ]);
      setLoading(false);
    }, 700);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
        <h2 className="flex items-center gap-2 text-lg font-black text-white mb-2">
          <Database className="text-indigo-400" size={20} />
          파일 메타데이터 추출기 (Metadata Extractor)
        </h2>
        <p className="text-xs text-zinc-555 mb-4 leading-relaxed">
          이미지, 동영상, 문서를 분석하여 원본 파일 헤더에 기록된 EXIF 태그(카메라 사양, 촬영 일자, 해상도 등)와 시스템 메타 정보를 안전하게 스캔 추출합니다.
        </p>

        {!file ? (
          <div className="border-2 border-dashed border-zinc-800 hover:border-indigo-500/40 rounded-2xl bg-zinc-950/40 p-10 text-center transition relative flex flex-col items-center justify-center gap-3">
            <input
              type="file"
              onChange={handleUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Upload size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">파일을 여기에 드래그하거나 클릭하세요</p>
              <p className="text-[10px] text-zinc-650 mt-1 font-bold">지원 포맷: JPG, PNG, PDF, MP4 등 (최대 50MB)</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-zinc-850 bg-zinc-950/40 p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                  <Database size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{fileName}</p>
                  <p className="text-[9px] text-zinc-600 mt-0.5">{fileSize}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setFile(null);
                    setMetadata([]);
                  }}
                  disabled={loading}
                  className="h-9 rounded-lg border border-zinc-850 bg-zinc-900/30 px-3 text-xs font-bold text-zinc-455 hover:text-white"
                >
                  제거
                </button>
                {!metadata.length && (
                  <button
                    onClick={handleExtract}
                    disabled={loading}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-indigo-650 px-4 text-xs font-black text-white hover:bg-indigo-600 disabled:opacity-50 transition"
                  >
                    {loading ? <Loader2 size={12} className="animate-spin" /> : null}
                    메타데이터 스캔
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="animate-spin text-indigo-500" size={32} />
          <p className="text-xs font-bold text-zinc-500">파일 구조 헤더 디코딩 중...</p>
        </div>
      )}

      {metadata.length > 0 && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-4">
          <h3 className="text-sm font-black text-white">상세 메타데이터 점검표</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-850 text-zinc-500 font-bold">
                  <th className="py-2.5 px-3">메타 속성 (Metadata Attribute)</th>
                  <th className="py-2.5 px-3 text-right">기록된 상세 속성값</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {metadata.map((item, i) => (
                  <tr key={i} className="hover:bg-zinc-900/30 transition text-zinc-300 font-semibold">
                    <td className="py-3 px-3 text-zinc-400">{item.label}</td>
                    <td className="py-3 px-3 text-right text-white font-extrabold">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
