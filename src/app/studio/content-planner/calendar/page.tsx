"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Globe,
  ArrowLeft,
  Loader2,
  Sparkles,
  Info,
  Calendar,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type CalendarEvent = {
  id: string;
  title: string;
  type: string;
  dateStr: string;
  platform: string;
  status: string;
  targetRoute?: string;
  externalUrl?: string;
  mainKeyword?: string;
};

export default function ContentCalendarPage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const supabase = useMemo(() => createClient(), []);

  // 해당 월의 첫 날과 마지막 날 계산
  const { year, month, daysInMonth, firstDayIndex, calendarRows } = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth(); // 0 ~ 11

    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 0);

    const days = lastDay.getDate();
    const firstDayIdx = firstDay.getDay(); // 0(일) ~ 6(토)

    // 달력 그리드를 채울 이전 달의 일수와 다음 달의 일수를 42칸(6행 7열) 구조로 계산
    const rows: { date: Date; isCurrentMonth: boolean }[] = [];
    const prevMonthLast = new Date(y, m, 0).getDate();

    // 1. 이전 달 일수 채우기
    for (let i = firstDayIdx - 1; i >= 0; i--) {
      rows.push({
        date: new Date(y, m - 1, prevMonthLast - i),
        isCurrentMonth: false,
      });
    }

    // 2. 현재 달 일수 채우기
    for (let i = 1; i <= days; i++) {
      rows.push({
        date: new Date(y, m, i),
        isCurrentMonth: true,
      });
    }

    // 3. 다음 달 일수 채우기 (42칸 맞추기)
    const nextDaysNeeded = 42 - rows.length;
    for (let i = 1; i <= nextDaysNeeded; i++) {
      rows.push({
        date: new Date(y, m + 1, i),
        isCurrentMonth: false,
      });
    }

    return {
      year: y,
      month: m + 1,
      daysInMonth: days,
      firstDayIndex: firstDayIdx,
      calendarRows: rows,
    };
  }, [currentDate]);

  // Supabase 데이터 로드
  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setIsLoading(true);
        // 1. 기획 캠페인 로드
        const { data: campaigns, error: campaignError } = await supabase
          .from("content_planner_campaigns")
          .select("id, title, created_at, content_type, primary_platform, main_keyword")
          .neq("status", "trash");

        if (campaignError) throw campaignError;

        // 2. 발행 아웃풋 로드
        const { data: outputs, error: outputError } = await supabase
          .from("content_planner_outputs")
          .select("id, title, created_at, output_type, platform, status, target_route, external_url")
          .neq("status", "trash");

        if (outputError) throw outputError;

        if (!mounted) return;

        const loadedEvents: CalendarEvent[] = [];

        // 기획서 이벤트 매핑
        (campaigns ?? []).forEach((c: any) => {
          if (c.created_at) {
            loadedEvents.push({
              id: `campaign-${c.id}`,
              title: c.title,
              type: "기획 완료",
              dateStr: c.created_at.substring(0, 10),
              platform: c.primary_platform || "멀티",
              status: "planned",
              mainKeyword: c.main_keyword || undefined,
            });
          }
        });

        // 발행 이력 이벤트 매핑
        (outputs ?? []).forEach((o: any) => {
          if (o.created_at) {
            loadedEvents.push({
              id: `output-${o.id}`,
              title: o.title,
              type: "콘텐츠 발행",
              dateStr: o.created_at.substring(0, 10),
              platform: o.platform || o.output_type || "발행",
              status: o.status || "generated",
              targetRoute: o.target_route || undefined,
              externalUrl: o.external_url || undefined,
            });
          }
        });

        setEvents(loadedEvents);
      } catch (err) {
        console.error("캘린더 데이터 로딩 실패:", err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  // 해당 일자의 이벤트 필터링
  const getEventsForDate = (date: Date) => {
    const ystr = date.getFullYear();
    const mstr = String(date.getMonth() + 1).padStart(2, "0");
    const dstr = String(date.getDate()).padStart(2, "0");
    const formatted = `${ystr}-${mstr}-${dstr}`;

    return events.filter((e) => e.dateStr === formatted);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year - 1, month - 2, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year - 1, month, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 p-6 md:p-10 space-y-6">
      {/* 상단 네비게이션 헤더 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-cyan-400">
            <CalendarDays size={18} />
            <span className="text-xs font-black tracking-wider uppercase">Content Planner</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
            콘텐츠 캘린더
          </h1>
          <p className="text-sm text-slate-400">
            기획된 캠페인 발행 흐름과 외부 플랫폼 배포 이력을 시각적으로 관리합니다.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/studio/content-planner"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs font-bold text-slate-200 hover:border-cyan-300/50 transition"
          >
            <ArrowLeft size={14} />
            플래너로 돌아가기
          </Link>
        </div>
      </div>

      {/* 캘린더 컨트롤 및 지표 바 */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-black text-white min-w-[140px]">
            {year}년 {month}월
          </h2>
          <div className="flex items-center gap-1 border border-white/10 rounded-lg p-0.5 bg-black/40">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/5 transition"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={handleToday}
              className="px-2.5 py-1 text-[11px] font-bold text-slate-300 hover:text-white rounded hover:bg-white/5 transition"
            >
              오늘
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/5 transition"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>

        {/* 범례 및 통계 */}
        <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400"></span>
            <span>기획 완료 {events.filter((e) => e.type === "기획 완료").length}건</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
            <span>블로그/네이버 발행 {events.filter((e) => e.type === "콘텐츠 발행" && e.platform.includes("블로그")).length}건</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400"></span>
            <span>동영상/SNS {events.filter((e) => e.type === "콘텐츠 발행" && !e.platform.includes("블로그")).length}건</span>
          </div>
        </div>
      </div>

      {/* 캘린더 그리드 영역 */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 rounded-3xl border border-white/10 bg-white/[0.04]">
          <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
          <p className="mt-4 text-sm text-slate-400 font-bold">캘린더 데이터를 불러오는 중입니다.</p>
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden shadow-2xl">
          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 border-b border-white/10 bg-black/40 text-center text-xs font-bold text-slate-400 py-3">
            <div className="text-rose-450">일</div>
            <div>월</div>
            <div>화</div>
            <div>수</div>
            <div>목</div>
            <div>금</div>
            <div className="text-cyan-450">토</div>
          </div>

          {/* 달력 본체 */}
          <div className="grid grid-cols-7 grid-rows-6 divide-x divide-y divide-white/10 bg-black/25">
            {calendarRows.map((row, idx) => {
              const dayEvents = getEventsForDate(row.date);
              const isToday =
                new Date().toDateString() === row.date.toDateString();

              return (
                <div
                  key={idx}
                  className={`min-h-[120px] p-2 flex flex-col justify-between transition-colors ${
                    row.isCurrentMonth
                      ? "hover:bg-white/[0.02]"
                      : "opacity-25 pointer-events-none"
                  } ${isToday ? "bg-cyan-950/10 border-cyan-500/20" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center ${
                        isToday
                          ? "bg-cyan-400 text-black font-black"
                          : row.date.getDay() === 0
                          ? "text-rose-450"
                          : row.date.getDay() === 6
                          ? "text-cyan-400"
                          : "text-slate-400"
                      }`}
                    >
                      {row.date.getDate()}
                    </span>
                  </div>

                  {/* 일자별 이벤트 목록 */}
                  <div className="mt-2 space-y-1 overflow-y-auto flex-1 max-h-[90px] scrollbar-thin">
                    {dayEvents.map((evt) => (
                      <button
                        key={evt.id}
                        onClick={() => setSelectedEvent(evt)}
                        className={`w-full text-left truncate rounded px-1.5 py-0.5 text-[10px] font-bold transition flex items-center gap-1 ${
                          evt.type === "기획 완료"
                            ? "bg-cyan-400/10 text-cyan-300 border border-cyan-400/20 hover:bg-cyan-400/20"
                            : evt.platform.includes("블로그")
                            ? "bg-emerald-400/10 text-emerald-300 border border-emerald-400/20 hover:bg-emerald-400/20"
                            : "bg-rose-400/10 text-rose-300 border border-rose-400/20 hover:bg-rose-400/20"
                        }`}
                      >
                        <span className="shrink-0 text-[8px] uppercase">
                          {evt.platform.substring(0, 3)}
                        </span>
                        <span className="truncate">{evt.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 이벤트 상세 보기 모달 */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-2xl relative">
            <div className="flex items-center gap-2 text-cyan-400 mb-4">
              <Sparkles size={16} />
              <span className="text-[10px] font-black uppercase tracking-wider">
                {selectedEvent.type}
              </span>
            </div>

            <h3 className="text-lg font-black text-white leading-snug">
              {selectedEvent.title}
            </h3>

            <div className="mt-4 space-y-3.5 border-t border-white/5 pt-4 text-sm text-slate-350">
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">일정 날짜</span>
                <span className="text-slate-200 font-bold">{selectedEvent.dateStr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">플랫폼</span>
                <span className="text-slate-200 font-bold">{selectedEvent.platform}</span>
              </div>
              {selectedEvent.mainKeyword && (
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">메인 키워드</span>
                  <span className="text-cyan-300 font-bold">#{selectedEvent.mainKeyword}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">상태</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-black uppercase ${
                  selectedEvent.status === "planned"
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-400/20"
                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-400/20"
                }`}>
                  {selectedEvent.status === "planned" ? "기획됨" : "발행 완료"}
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              {selectedEvent.externalUrl && (
                <a
                  href={selectedEvent.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-cyan-400 text-xs font-black text-black hover:bg-cyan-300 transition"
                >
                  <Globe size={13} />
                  발행 본문 보기
                </a>
              )}
              <button
                onClick={() => setSelectedEvent(null)}
                className="flex-1 inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xs font-bold text-slate-300 hover:bg-white/[0.08] transition"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
