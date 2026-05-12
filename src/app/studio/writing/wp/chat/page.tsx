"use client";

import React, { useState } from 'react';
import StudioLayout from "@/components/layout/StudioLayout";
import AIChatTab from "@/components/writing/wp/tabs/AIChatTab";

export default function WPChatPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  return (
    <StudioLayout activeMenu="Writing" isDarkMode={isDarkMode}>
      {/* 이제 단독 페이지이므로 sharedContent 걱정 없이 깔끔하게 호출합니다 */}
      <AIChatTab />
    </StudioLayout>
  );
}