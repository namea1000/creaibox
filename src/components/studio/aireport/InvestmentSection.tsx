"use client";

import React, { useState } from "react";
import { LineChart, DollarSign, ArrowUpRight, TrendingUp, BarChart2, Shield } from "lucide-react";

interface StockItem {
  ticker: string;
  name: string;
  price: number;
  change: string;
  changePercent: number;
  peRatio: number;
  marketCap: string;
  recommendation: string;
  color: string;
}

export default function InvestmentSection() {
  const stocks: StockItem[] = [
    {
      ticker: "NVDA",
      name: "엔비디아 (NVIDIA)",
      price: 135.58,
      change: "+4.12",
      changePercent: 3.14,
      peRatio: 72.4,
      marketCap: "$3.34T",
      recommendation: "Strong Buy (강력 매수)",
      color: "text-emerald-400",
    },
    {
      ticker: "TSM",
      name: "TSMC",
      price: 178.11,
      change: "+2.85",
      changePercent: 1.63,
      peRatio: 31.8,
      marketCap: "$920.4B",
      recommendation: "Buy (매수)",
      color: "text-emerald-400",
    },
    {
      ticker: "MSFT",
      name: "마이크로소프트",
      price: 442.25,
      change: "-1.15",
      changePercent: -0.26,
      peRatio: 36.2,
      marketCap: "$3.28T",
      recommendation: "Hold (보유)",
      color: "text-red-400",
    },
    {
      ticker: "AVGO",
      name: "브로드컴 (Broadcom)",
      price: 1650.8,
      change: "+34.5",
      changePercent: 2.13,
      peRatio: 54.1,
      marketCap: "$768.2B",
      recommendation: "Buy (매수)",
      color: "text-emerald-400",
    },
  ];

  const [selectedTicker, setSelectedTicker] = useState("NVDA");
  const activeStock = stocks.find((s) => s.ticker === selectedTicker) || stocks[0];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <LineChart size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white">AI 투자 분석 (Investment)</h2>
            <p className="text-xs font-bold text-zinc-500 mt-0.5">
              주요 글로벌 빅테크 및 반도체 밸류체인 기업들의 주가 흐름, 재무 건전성 및 AI 투자 등급을 종합 평가합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 주식 목록 카드 */}
        <div className="lg:col-span-1 space-y-3">
          {stocks.map((stock) => {
            const isSelected = stock.ticker === selectedTicker;

            return (
              <button
                key={stock.ticker}
                type="button"
                onClick={() => setSelectedTicker(stock.ticker)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  isSelected
                    ? "border-cyan-500/60 bg-cyan-500/10 text-white"
                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 text-zinc-400 hover:border-cyan-500/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <span className={`text-base font-black ${isSelected ? "text-cyan-400" : "text-zinc-900 dark:text-zinc-150"}`}>
                      {stock.ticker}
                    </span>
                    <p className="text-[10px] font-bold text-zinc-500 mt-0.5 truncate">{stock.name}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-zinc-900 dark:text-white">${stock.price.toFixed(2)}</span>
                    <p className={`text-[10px] font-bold mt-0.5 ${stock.changePercent >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {stock.change} ({stock.changePercent >= 0 ? "+" : ""}{stock.changePercent}%)
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* 선택한 종목 투자 지표 */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white">{activeStock.name}</h3>
              <p className="text-xs font-bold text-zinc-500 mt-1">심볼: {activeStock.ticker} | 마켓: NASDAQ</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400">
              <Shield size={13} />
              AI 등급: {activeStock.recommendation}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/40 p-4">
              <span className="text-[10px] font-bold text-zinc-500 block">시가 총액 (Market Cap)</span>
              <span className="mt-1 text-lg font-black text-zinc-900 dark:text-white">{activeStock.marketCap}</span>
            </div>
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/40 p-4">
              <span className="text-[10px] font-bold text-zinc-500 block">PER (P/E Ratio)</span>
              <span className="mt-1 text-lg font-black text-zinc-900 dark:text-white">{activeStock.peRatio}배</span>
            </div>
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/40 p-4">
              <span className="text-[10px] font-bold text-zinc-500 block">추천의견 비율</span>
              <span className="mt-1 text-lg font-black text-emerald-400">적극매수 82%</span>
            </div>
          </div>

          {/* 차트 시뮬레이션 */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <BarChart2 size={14} className="text-cyan-400" />
              최근 5영업일 주가 흐름
            </h4>
            <div className="flex h-36 w-full items-end justify-between px-4 pb-2 border-b border-zinc-800 pt-8 bg-zinc-950/20 rounded-xl p-3">
              {[
                { day: "월", price: activeStock.price * 0.96, height: "40%" },
                { day: "화", price: activeStock.price * 0.98, height: "60%" },
                { day: "수", price: activeStock.price * 0.97, height: "50%" },
                { day: "목", price: activeStock.price * 0.99, height: "80%" },
                { day: "금", price: activeStock.price, height: "100%" },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5 w-16">
                  <span className="text-[9px] font-bold text-zinc-500">${item.price.toFixed(1)}</span>
                  <div
                    className="w-4 rounded-t bg-cyan-500 transition-all duration-700"
                    style={{ height: item.height }}
                  />
                  <span className="text-[10px] font-black text-zinc-650">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
