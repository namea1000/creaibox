"use client";

import { useEffect, useRef } from "react";

interface PostViewTrackerProps {
  postId: string;
}

/**
 * 0.01초 광속 서빙을 위한 비차단(Non-blocking) 클라이언트 조회수 트래커
 * - SSR 렌더링 시 DB Write Lock을 발생시키지 않고, 화면이 뜬 후 백그라운드에서 1회 카운트
 */
export default function PostViewTracker({ postId }: PostViewTrackerProps) {
  const isTracked = useRef(false);

  useEffect(() => {
    if (!postId || isTracked.current) return;
    isTracked.current = true;

    // View increment API call or Supabase client rpc
    try {
      fetch(`/api/blog/view?id=${encodeURIComponent(postId)}`, {
        method: "POST",
      }).catch(() => {});
    } catch {
      // Silent fail
    }
  }, [postId]);

  return null;
}
