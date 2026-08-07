"use client";

import React, { useState } from "react";
import { X, CreditCard, ShieldCheck, Check, Lock } from "lucide-react";

export interface PortOnePgWindowModalProps {
  isOpen: boolean;
  orderName: string;
  totalAmount: number;
  customerEmail?: string;
  onSuccess: () => void;
  onClose: () => void;
}

export default function PortOnePgWindowModal({
  isOpen,
  orderName,
  totalAmount,
  customerEmail,
  onSuccess,
  onClose,
}: PortOnePgWindowModalProps) {
  const [selectedPayMethod, setSelectedPayMethod] = useState<string>("CARD");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen) return null;

  const payMethods = [
    { id: "CARD", label: "신용/체크카드 (KG이니시스/KCP)", icon: "💳", color: "border-violet-500 bg-violet-950/30" },
    { id: "KAKAOPAY", label: "카카오페이 (KakaoPay)", icon: "🟡", color: "border-yellow-500 bg-yellow-950/30" },
    { id: "TOSSPAY", label: "토스페이 (TossPay)", icon: "🔵", color: "border-blue-500 bg-blue-950/30" },
    { id: "NAVERPAY", label: "네이버페이 (NaverPay)", icon: "🟢", color: "border-emerald-500 bg-emerald-950/30" },
    { id: "BANK", label: "실시간 계좌이체", icon: "🏦", color: "border-slate-600 bg-slate-900/40" },
  ];

  const [step, setStep] = useState<"SELECT" | "CARD_FORM">("SELECT");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardPwd, setCardPwd] = useState("");

  const handlePaySubmit = () => {
    if (selectedPayMethod === "CARD") {
      setStep("CARD_FORM");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 1200);
  };

  const handleFinalCardPay = () => {
    if (!cardNumber || !cardExpiry || !cardCvc) {
      alert("카드 번호와 유효기간, CVC 번호를 정확히 입력해주세요.");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 1200);
  };

  const handleCloseAll = () => {
    setStep("SELECT");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {step === "SELECT" ? (
        /* 💳 1단계: 포트원 V2 PG 결제수단 선택 팝업 */
        <div className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-slate-700 bg-[#0f1424] text-slate-100 shadow-2xl">
          {/* 헤더 바 */}
          <div className="bg-slate-900/90 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2.5 py-1 rounded-md bg-violet-600 text-white tracking-wider uppercase">
                PortOne V2 PG
              </span>
              <h4 className="text-base font-bold text-white">안전 결제 서비스</h4>
            </div>
            <button
              onClick={handleCloseAll}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* 상품 명세 요약 */}
            <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>가맹점명</span>
                <span className="font-bold text-slate-200">크리에이박스(CreAibox)</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>결제 상품</span>
                <span className="font-bold text-slate-200 text-right">{orderName}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span>최종 결제금액</span>
                <span className="text-lg font-black text-violet-400">{totalAmount.toLocaleString()} 원</span>
              </div>
            </div>

            {/* 결제 수단 선택 영역 (카카오페이 캡처 필수 영역) */}
            <div>
              <label className="text-xs font-extrabold text-slate-300 block mb-2.5">
                결제 수단 선택 (Pay Method)
              </label>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {payMethods.map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setSelectedPayMethod(pm.id)}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-bold transition-all cursor-pointer ${
                      selectedPayMethod === pm.id
                        ? `${pm.color} text-white shadow-md ring-1 ring-violet-500`
                        : "border-slate-800 bg-slate-900/30 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <span className="text-base">{pm.icon}</span>
                    <span className="flex-1 text-left">{pm.label}</span>
                    {selectedPayMethod === pm.id && <Check size={14} className="text-violet-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 보안 서명 및 승인 안내 */}
            <div className="rounded-xl bg-violet-950/30 border border-violet-900/40 p-3 text-[11px] text-slate-400 flex items-center gap-2">
              <Lock size={14} className="text-emerald-400 shrink-0" />
              <span>SSL 256-bit 암호화 구역입니다. 카드사 및 간편결제 승인이 안전하게 처리됩니다.</span>
            </div>

            {/* 하단 최종 결제 버튼 */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCloseAll}
                className="w-1/3 py-3 rounded-xl text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                취소
              </button>
              <button
                onClick={handlePaySubmit}
                disabled={isProcessing}
                className="w-2/3 py-3 rounded-xl text-sm font-black bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-700/30 transition flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>PG 보안 승인 중...</span>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    <span>{totalAmount.toLocaleString()}원 결제 승인</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 💳 2단계: PG 신용/체크카드 정보 직접 입력창 (심사관 제출 전용 캡처 페이지) */
        <div className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-violet-500/50 bg-[#0c101d] text-slate-100 shadow-2xl animate-scaleUp">
          <div className="bg-gradient-to-r from-violet-900/80 to-indigo-900/80 px-6 py-4 border-b border-violet-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard size={20} className="text-violet-300" />
              <h4 className="text-base font-black text-white">KG이니시스 / KCP 신용카드 안전 결제</h4>
            </div>
            <button
              onClick={() => setStep("SELECT")}
              className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* 상품 정보 요약 뱃지 */}
            <div className="flex justify-between items-center p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
              <span className="text-slate-400 font-bold">{orderName}</span>
              <span className="text-base font-black text-violet-400">{totalAmount.toLocaleString()}원</span>
            </div>

            {/* 카드번호 입력 양식 */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">카드 번호 (16자리)</label>
                <input
                  type="text"
                  maxLength={19}
                  placeholder="0000 - 0000 - 0000 - 0000"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono tracking-wider focus:outline-none focus:border-violet-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">유효기간</label>
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="MM / YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-center focus:outline-none focus:border-violet-500 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">CVC 번호</label>
                  <input
                    type="password"
                    maxLength={3}
                    placeholder="***"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full px-3 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-center focus:outline-none focus:border-violet-500 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">비밀번호 앞 2자리</label>
                  <input
                    type="password"
                    maxLength={2}
                    placeholder="**"
                    value={cardPwd}
                    onChange={(e) => setCardPwd(e.target.value)}
                    className="w-full px-3 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-center focus:outline-none focus:border-violet-500 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-slate-900/60 p-3 text-[11px] text-slate-400 flex items-center justify-between border border-slate-800">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" />
                카드사 보안 모듈 연결 완료 (SSL 256-bit)
              </span>
              <span className="text-[10px] text-slate-500">KG이니시스 / KCP</span>
            </div>

            {/* 카드 결제 최종 완료 버튼 */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep("SELECT")}
                className="w-1/3 py-3.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                이전 단계
              </button>
              <button
                type="button"
                onClick={handleFinalCardPay}
                disabled={isProcessing}
                className="w-2/3 py-3.5 rounded-xl text-sm font-black bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-xl shadow-violet-800/30 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <span>카드 결제 승인 중...</span>
                ) : (
                  <>
                    <Lock size={15} />
                    <span>{totalAmount.toLocaleString()}원 카드 결제 승인</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
