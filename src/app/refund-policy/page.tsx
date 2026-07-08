import React from "react";
import { Metadata } from "next";
import RefundPolicyClient from "./client";

export const metadata: Metadata = {
  title: "환불 정책 | 크리에이박스 CreAibox",
  description: "크리에이박스(CreAibox) 스튜디오 멤버십 결제 및 크레딧 구매 건에 대한 환불 규정, 신청 절차와 환불 예외 사항 안내 페이지입니다.",
  keywords: ["크리에이박스", "creaibox", "크리에이박스 환불", "환불 정책", "멤버십 취소"],
};

export default function RefundPolicyPage() {
  return <RefundPolicyClient />;
}
