"use client";

import React, { useState } from "react";
import { Megaphone, ToggleLeft, ToggleRight, CheckCircle2, AlertCircle, Clock } from "lucide-react";

export default function PublishSection() {
  const [channels, setChannels] = useState([
    { id: "naver", name: "네이버 블로그 API", connected: true, autoPublish: true },
    { id: "wordpress", name: "워드프레스 REST API", connected: false, autoPublish: false },
    { id: "tistory", name: "티스토리 API", connected: true, autoPublish: false },
  ]);

  const [queue, setQueue] = useState([
    { title: "자가 학습 에이전트의 충격적 성능 분석", channel: "네이버 블로그", time: "내일 09:00", status: "대기 중" },
    { title: "EU AI Act 공식 발효 핵심 정리", channel: "티스토리", time: "내일 14:00", status: "대기 중" },
  ]);

  const toggleAutoPublish = (id: string) => {
    setChannels((prev) =>
      prev.map((ch) => (ch.id === id ? { ...ch, autoPublish: !ch.autoPublish } : ch))
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <Megaphone size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white">뉴스 콘텐츠 자동 발행 (Publish)</h2>
            <p className="text-xs font-bold text-zinc-500 mt-0.5">
              외부 오픈 API 연동을 통해 작성된 요약본/원고 콘텐츠를 지정한 시간에 채널별로 자동 유포/포스팅합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 채널 연동 현황 */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-5 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400">발행 채널 연결 현황</h3>

            <div className="space-y-3">
              {channels.map((ch) => (
                <div
                  key={ch.id}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950/20 p-3.5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-zinc-900 dark:text-zinc-150">{ch.name}</span>
                    <span className={`text-[10px] font-bold ${ch.connected ? "text-emerald-400" : "text-zinc-650"}`}>
                      {ch.connected ? "연결 완료" : "연결 필요"}
                    </span>
                  </div>

                  {ch.connected && (
                    <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-zinc-850">
                      <span className="text-zinc-500">생성 즉시 자동 발행</span>
                      <button type="button" onClick={() => toggleAutoPublish(ch.id)} className="text-amber-400">
                        {ch.autoPublish ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 발행 예정 큐 */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 space-y-4">
          <h3 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <Clock size={16} className="text-amber-400" />
            콘텐츠 발행 예약 대기열
          </h3>

          <div className="overflow-hidden border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <table className="w-full border-collapse text-left text-xs font-bold">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 text-zinc-500">
                  <th className="px-4 py-3">발행 예정 제목</th>
                  <th className="px-4 py-3">채널</th>
                  <th className="px-4 py-3">예정 시각</th>
                  <th className="px-4 py-3">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-300">
                {queue.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3.5 truncate max-w-xs">{item.title}</td>
                    <td className="px-4 py-3.5">{item.channel}</td>
                    <td className="px-4 py-3.5 text-zinc-500">{item.time}</td>
                    <td className="px-4 py-3.5 text-amber-400">{item.status}</td>
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
