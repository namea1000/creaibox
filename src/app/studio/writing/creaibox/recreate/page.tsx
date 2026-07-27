"use client";

import React, { Suspense } from "react";
import CreaiboxRecreateTab from "@/components/writing/creaibox/tabs/CreaiboxRecreateTab";

export default function RecreatePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs font-bold text-zinc-400">원고 데이터 로딩 중...</div>}>
      <CreaiboxRecreateTab />
    </Suspense>
  );
}
