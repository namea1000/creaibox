"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import UnifiedInfoCenter from "@/components/infocenter/UnifiedInfoCenter";

export default function InfoDetailViewPage() {
  const params = useParams();
  const id = (params.id as string) || "";

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] w-full items-center justify-center bg-zinc-50 dark:bg-[#06080d] text-zinc-800 dark:text-zinc-100 transition-colors duration-300">
          <div className="text-blue-500 animate-pulse font-black italic uppercase tracking-widest text-xs">
            Loading Post...
          </div>
        </div>
      }
    >
      <div className="min-h-full w-full bg-zinc-50 dark:bg-[#06080d] px-5 py-8 text-zinc-800 dark:text-zinc-100 lg:px-8 transition-colors duration-300">
        <UnifiedInfoCenter initialView="view" initialPostId={id} />
      </div>
    </Suspense>
  );
}