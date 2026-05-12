"use client";

import React, { useState } from 'react';
import StudioLayout from "@/components/layout/StudioLayout";
import CreateTab from "@/components/writing/wp/tabs/CreateTab";

export default function WPCreatePage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // StudioLayout 안에 CreateTab을 알맹이로 넣어서 조립합니다.
  return (
    <StudioLayout activeMenu="Writing" isDarkMode={isDarkMode}>
      <CreateTab isDarkMode={isDarkMode} />
    </StudioLayout>
  );
}