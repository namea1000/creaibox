"use client";

import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Undo2, Coins, Clock, ShieldAlert, ArrowRight, CheckCircle2, MessageSquare } from "lucide-react";

export default function RefundPolicyClient() {
  const currentYear = new Date().getFullYear();

  const rules = [
    {
      icon: Undo2,
      title: "청약철회 및 전액 환불 기준",
      subtitle: "7일 이내 사용 이력이 없는 경우",
      badge: "전액 환불 보장",
      badgeColor: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-605 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20",
      description: "멤버십 결제일 또는 단독 크레딧 구매일로부터 7일 이내에 AI 글쓰기, 이미지/비디오 생성, 음악 생성 등 어떠한 서비스 이용 내역(크레딧 차감 내역)도 존재하지 않는 결제 건에 대해서는 100% 전액 결제 취소 및 환불이 보장됩니다."
    },
    {
      icon: Coins,
      title: "일부 사용에 따른 부분 환불 기준",
      subtitle: "일부 크레딧 또는 기간 이용 시",
      badge: "공제 후 환불",
      badgeColor: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20",
      description: "결제 후 7일을 경과하였거나 일부 크레딧을 사용한 상태에서 중도 해지할 경우, 사용한 일수에 준하는 멤버십 기본 이용료와 기사용 크레딧 차감액(원가 환산) 및 PG사 금융 수수료(정가의 10%)를 정산 공제한 후 잔여 금액을 환불해 드립니다."
    },
    {
      icon: ShieldAlert,
      title: "환불 제한 및 예외 규정",
      subtitle: "환불 신청이 불가능한 경우",
      badge: "환불 제한 대상",
      badgeColor: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-450 border border-rose-100 dark:border-rose-500/20",
      description: "이벤트 참여 또는 프로모션 제휴 등으로 지급된 무상 웰컴 크레딧 및 비매품 포인트는 환불 대상에 포함되지 않습니다. 또한, 악의적인 대량 계정 생성 및 API 오남용으로 인해 이용약관 위반 처분을 받은 영구 정지 계정의 잔여 잔액 역시 환불이 거부될 수 있습니다."
    },
    {
      icon: Clock,
      title: "신청 접수 및 환불 소요 기간",
      subtitle: "24시간 이내 신속 접수 및 처리",
      badge: "신속 처리 원칙",
      badgeColor: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20",
      description: "환불 접수는 로그인 후 [고객지원] 채널 또는 카카오톡 1:1 비즈니스 채널을 통해 언제든지 접수하실 수 있습니다. 영업일 기준 24시간 이내에 담당 상담사가 요건 충족 대조 후 취소 승인해 드리며, 카드사 환불은 승인 후 약 3~5 영업일이 소요됩니다."
    }
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 dark:bg-[#06080d] dark:text-slate-100 pt-20 overflow-hidden relative transition-colors duration-300">
      <Header />

      {/* 🌌 기품 있는 오로라 그라데이션 광원 */}
      <div className="absolute top-[-5%] left-[-5%] w-[600px] h-[600px] bg-rose-650/5 dark:bg-rose-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-orange-500/5 dark:bg-orange-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        
        {/* 📋 SECTION 1: HERO HEADER */}
        <div className="border-b border-slate-200 dark:border-slate-800/80 pb-10 mb-16 space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 text-slate-650 dark:text-slate-400 text-xs font-black tracking-widest uppercase shadow-sm">
            <Undo2 size={12} className="text-rose-500" /> Refund & Cancellation Policy
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-950 dark:text-white leading-tight">
            환불 정책 안내
          </h1>
          <p className="text-sm md:text-lg text-slate-600 dark:text-slate-400 font-bold leading-relaxed">
            크리에이박스(CreAibox)는 투명하고 합리적인 디지털 자산 및 구독 환불 정책을 운영하고 있습니다. <br />
            아래의 상세 환불 규정 및 정산 절차를 확인하여 주시기 바랍니다.
          </p>
        </div>

        {/* 🛡️ SECTION 2: 4대 핵심 환불 가이드라인 */}
        <div className="space-y-6 mb-20">
          {rules.map((rule, idx) => {
            const Icon = rule.icon;
            return (
              <div
                key={idx}
                className="p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/20 hover:border-rose-400 dark:hover:border-rose-550/30 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row items-start gap-6 shadow-sm group"
              >
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/45 text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300">
                  <Icon size={24} />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg md:text-xl font-black text-slate-950 dark:text-white">
                      {rule.title}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${rule.badgeColor}`}>
                      {rule.badge}
                    </span>
                  </div>
                  <h4 className="text-xs md:text-sm font-bold text-slate-450 dark:text-slate-500">
                    {rule.subtitle}
                  </h4>
                  <p className="text-slate-650 dark:text-slate-400 text-xs md:text-sm leading-relaxed pt-2">
                    {rule.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 📬 SECTION 3: 환불 접수 창구 가이드 */}
        <div className="rounded-3xl border border-slate-900 dark:border-slate-850 bg-slate-950 dark:bg-[#0b0f19]/80 p-8 text-white relative overflow-hidden shadow-xl mb-16">
          <div className="absolute right-[-10%] bottom-[-20%] w-[300px] h-[300px] bg-rose-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="space-y-4 relative z-10">
            <span className="text-xs font-black tracking-widest text-rose-400 uppercase">
              How to Apply for Refund
            </span>
            <h3 className="text-xl md:text-2xl font-black tracking-tight">
              환불 신청은 어떻게 진행하나요?
            </h3>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed max-w-2xl">
              정당한 환불 요건에 부합하는 경우, 크리에이박스 로그인 후 **[고객지원]** 1:1 게시판 문의 또는 하단 **[카카오톡 채널 추가]** 버튼을 통해 결제한 아이디(이메일), 결제일자, 구매 멤버십/크레딧 종류 및 환불 사유를 적어 보내주시면 담당 부서에서 즉각 확인 및 승인 통보를 이행해 드립니다.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="/help"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white text-slate-950 hover:bg-slate-100 text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-sm"
              >
                고객지원 1:1 접수 <ArrowRight size={12} />
              </a>
              <a
                href="https://pf.kakao.com/_RxdxmsX"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-yellow-400 text-slate-950 hover:bg-yellow-500 text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-sm"
              >
                <MessageSquare size={12} fill="currentColor" className="stroke-none" /> 카카오톡 1:1 챗 접수
              </a>
            </div>
          </div>
        </div>

        {/* 🏁 SECTION 4: COPYRIGHT */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 text-center text-xs text-slate-450 dark:text-slate-500 font-medium">
          © {currentYear} 크리에이박스(CreAibox). All rights reserved. 본 정책은 약관 개정 주기에 따라 예고 없이 변동될 수 있습니다.
        </div>

      </div>
      <Footer />
    </div>
  );
}
