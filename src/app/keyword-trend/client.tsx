"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PublicKeywordTrendClient() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/studio/keyword/realtime");
  }, [router]);

  return (
    <div className="p-8 text-center text-zinc-400 text-sm font-bold">
      실시간 급상승 키워드 센터로 이동 중입니다...
    </div>
  );
}
