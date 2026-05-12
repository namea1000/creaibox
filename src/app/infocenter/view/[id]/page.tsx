"use client";

import React from 'react';
import { useParams } from 'next/navigation'; // 주소창의 [category]를 읽어오는 녀석
import InfoCenterLayout from "@/components/layout/infocenter/InfoCenterLayout";
import BoardListTab from "@/components/infocenter/tabs/InfoListTab";

export default function CategoryListPage() {
  const params = useParams();
  const category = params.category as string; // 'notice', 'free' 등이 담깁니다.
  const isDarkMode = true; // 나중에 상태 관리로 연결

  return (
    <InfoCenterLayout isDarkMode={isDarkMode}>
      {/* 🌟 핵심: BoardListTab에게 '너는 지금 무슨 게시판이야'라고 주소창 값을 던져줍니다. */}
      <BoardListTab isDarkMode={isDarkMode} activeTab={category} />
    </InfoCenterLayout>
  );
}