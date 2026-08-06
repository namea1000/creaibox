"use client";

import React from "react";
import { Sparkles, CreditCard, X, ShieldCheck, CheckCircle2 } from "lucide-react";

export interface PaymentConfirmModalProps {
  isOpen: boolean;
  orderName: string;
  totalAmount: number;
  customerEmail?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function PaymentConfirmModal({
  isOpen,
  orderName,
  totalAmount,
  customerEmail,
  onConfirm,
  onClose,
}: PaymentConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      {/* 🌌 기품있는 오로라 오버레이 팝업 박스 */}
      <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-violet-500/30 bg-gradient-to-b from-slate-900/95 via-[#0c0f1d]/95 to-[#070913]/98 p-7 text-white shadow-2xl shadow-violet-950/60 transition-all duration-300">
        
        {/* 은은한 네온 앰비언트 광원 */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-44 w-44 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-44 w-44 rounded-full bg-fuchsia-600/15 blur-3xl pointer-events-none" />

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* 팝업 헤더 */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="p-2.5 rounded-2xl bg-violet-600/20 border border-violet-500/30 text-violet-400">
            <CreditCard size={22} />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-black text-violet-400 uppercase tracking-wider">
              <Sparkles size={12} className="animate-pulse" />
              CreAibox Secure Payment
            </div>
            <h3 className="text-xl font-extrabold tracking-tight text-white">
              전자결제 확인
            </h3>
          </div>
        </div>

        {/* 📋 결제 상품 및 금액 카드 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 mb-6 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <span className="text-xs font-semibold text-slate-400 shrink-0">주문 상품</span>
            <span className="text-sm font-bold text-slate-100 text-right break-keep">
              {orderName}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
            <span className="text-xs font-semibold text-slate-400">최종 결제 금액</span>
            <span className="text-xl font-black text-violet-400 tracking-tight">
              {totalAmount.toLocaleString()} <span className="text-xs font-medium text-slate-300">원</span>
            </span>
          </div>

          {customerEmail && (
            <div className="flex items-center justify-between border-t border-slate-800/80 pt-2.5 text-[11px] text-slate-400">
              <span>주문자 메일</span>
              <span className="font-mono text-slate-300">{customerEmail}</span>
            </div>
          )}
        </div>

        {/* 🔒 안전 결제 안내 텍스트 (1초 문구 완전 제거) */}
        <div className="flex items-start gap-2 text-xs font-medium text-slate-400 leading-relaxed mb-7 bg-violet-950/20 border border-violet-900/30 rounded-xl p-3">
          <ShieldCheck size={16} className="text-emerald-400 shrink-0 mt-0.5" />
          <p>
            포트원(PortOne V2) 안전 전자결제 모듈을 통해 보안 결제가 진행됩니다. 결제를 승인하고 서비스를 이용하시겠습니까?
          </p>
        </div>

        {/* 🔘 액션 버튼 바 */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer text-center"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex-2 py-3 px-5 rounded-xl text-sm font-black bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-700/30 transition-all cursor-pointer text-center flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={16} />
            <span>결제 진행하기</span>
          </button>
        </div>

      </div>
    </div>
  );
}
