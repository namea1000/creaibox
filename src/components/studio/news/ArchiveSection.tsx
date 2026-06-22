"use client";

import React, { useState } from "react";
import { Archive, Folder, Search, FileText, Download, Trash2, Calendar } from "lucide-react";

export default function ArchiveSection() {
  const [activeFolder, setActiveFolder] = useState("all");

  const folders = [
    { id: "all", name: "전체 보관 문서", count: 18 },
    { id: "summaries", name: "AI 뉴스 요약본", count: 8 },
    { id: "blogs", name: "블로그 원고 초안", count: 6 },
    { id: "scripts", name: "유튜브/앵커 대본", count: 4 },
  ];

  const files = [
    { name: "자가 학습 에이전트 뉴스 요약본", folder: "summaries", date: "2026-06-21", size: "12 KB" },
    { name: "EU AI 법안 블로그 원고 초안", folder: "blogs", date: "2026-06-21", size: "24 KB" },
    { name: "엔비디아 FP4 칩 검증 비디오 대본", folder: "scripts", date: "2026-06-20", size: "18 KB" },
    { name: "초장문 컨텍스트 AI 뉴스 요약본", folder: "summaries", date: "2026-06-20", size: "10 KB" },
  ];

  const filteredFiles = activeFolder === "all" ? files : files.filter((f) => f.folder === activeFolder);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-500/10 text-zinc-400">
            <Archive size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white">뉴스 아카이브 (Archive)</h2>
            <p className="text-xs font-bold text-zinc-500 mt-0.5">
              지금까지 수집된 뉴스 원본들과 AI를 이용해 생성한 요약, 대본 및 카드뉴스 산출물들을 보관하고 일괄 다운로드/관리합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 폴더 구조 */}
        <div className="lg:col-span-1 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-5 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400">문서 디렉토리</h3>
          <div className="space-y-1">
            {folders.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFolder(f.id)}
                className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition ${
                  activeFolder === f.id
                    ? "bg-zinc-800 text-white font-black"
                    : "text-zinc-500 hover:bg-zinc-950/20"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Folder size={15} className={activeFolder === f.id ? "text-amber-400" : "text-zinc-500"} />
                  {f.name}
                </span>
                <span className="text-[10px] opacity-70 bg-zinc-850 px-1.5 py-0.5 rounded">{f.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 파일 테이블 */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-zinc-900 dark:text-white">보관된 아카이브 파일 목록 ({filteredFiles.length}건)</h3>
            <div className="flex gap-2">
              <button className="flex items-center gap-1 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 px-3 py-1.5 text-[10px] font-bold text-zinc-700 dark:text-zinc-300">
                <Download size={12} />
                선택 내보내기
              </button>
              <button className="flex items-center gap-1 border border-red-300 rounded-lg bg-white dark:bg-zinc-900 px-3 py-1.5 text-[10px] font-bold text-red-600">
                <Trash2 size={12} />
                선택 삭제
              </button>
            </div>
          </div>

          <div className="overflow-hidden border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <table className="w-full border-collapse text-left text-xs font-bold">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 text-zinc-500">
                  <th className="px-4 py-3">파일명</th>
                  <th className="px-4 py-3">저장일자</th>
                  <th className="px-4 py-3">크기</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-300">
                {filteredFiles.map((file, idx) => (
                  <tr key={idx} className="hover:bg-zinc-950/10 cursor-pointer">
                    <td className="px-4 py-3.5 flex items-center gap-2">
                      <FileText size={14} className="text-zinc-500 shrink-0" />
                      <span className="truncate max-w-xs">{file.name}</span>
                    </td>
                    <td className="px-4 py-3.5 text-zinc-500 flex items-center gap-1">
                      <Calendar size={12} />
                      {file.date}
                    </td>
                    <td className="px-4 py-3.5 text-zinc-500">{file.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
