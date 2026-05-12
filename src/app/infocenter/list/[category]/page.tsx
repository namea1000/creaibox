"use client";

import React from 'react';
import { useParams } from 'next/navigation'; // 👈 주소창 읽어오는 도구
import InfoCenterLayout from "@/components/layout/infocenter/InfoCenterLayout";
import InfoListTab from "@/components/infocenter/tabs/InfoListTab"; // 👈 기존에 만든 파일

export default function CategoryListPage() {
  const params = useParams();
  const category = params.category as string; // 'notice'나 'free' 같은 글자를 읽음

  return (
    <InfoCenterLayout isDarkMode={true}>
      {/* 🌟 기존 컴포넌트에 'activeTab'으로 주소창에서 읽은 카테고리를 넘겨줍니다! */}
      <InfoListTab isDarkMode={true} activeTab={category} />
    </InfoCenterLayout>
  );
}