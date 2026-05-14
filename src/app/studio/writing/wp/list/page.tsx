"use client";

import React from 'react';
import PostListTab from "@/components/writing/wp/tabs/PostListTab";

/**
 * 🌟 [레이아웃 긴급 수선 보고]
 * 1. flex flex-col: 내부 요소를 세로로 정렬
 * 2. w-full h-full: 가로와 세로를 부모 레이아웃 끝까지 꽉 채움
 * 3. overflow-hidden: 내부에서 자체 스크롤을 쓰도록 겉박스는 고정
 */
export default function WpPostlistPage() {
  return (
    <div className="flex flex-col w-full h-full min-h-[calc(100vh-200px)] overflow-hidden"> 
      <PostListTab />
    </div>
  );
}