"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PublicAiWriterPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/writing/creaibox/new-post");
  }, [router]);

  return null;
}
