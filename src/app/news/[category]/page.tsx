"use client";

import React from 'react';
import { useParams } from 'next/navigation';

// 🌟 10개 부품 한 방에 다 가져오기
import HeadlineContent from '@/components/news/HeadlineContent';
import PoliticsContent from '@/components/news/PoliticsContent';
import EconomyContent from '@/components/news/EconomyContent';
import SocietyContent from '@/components/news/SocietyContent';
import LifeContent from '@/components/news/LifeContent';
import ItContent from '@/components/news/ItContent';
import WorldContent from '@/components/news/WorldContent';
import RankingContent from '@/components/news/RankingContent';
import DiscoveryContent from '@/components/news/DiscoveryContent';
import OpinionContent from '@/components/news/OpinionContent';

export default function CategoryNewsPage() {
  const params = useParams();
  const category = params?.category as string; // 주소창의 카테고리 텍스트 추출 (e.g. 'politics')

  // 🌟 주소창 명령어에 맞춰서 알맞은 알맹이 부품을 꽂아주는 스위치 박스
  switch (category) {
    case 'press':
      return <HeadlineContent />;
    case 'politics':
      return <PoliticsContent />;
    case 'economy':
      return <EconomyContent />;
    case 'society':
      return <SocietyContent />;
    case 'life':
      return <LifeContent />;
    case 'it':
      return <ItContent />;
    case 'world':
      return <WorldContent />;
    case 'ranking':
      return <RankingContent />;
    case 'discovery':
      return <DiscoveryContent />;
    case 'opinion':
      return <OpinionContent />;
    default:
      // 잘못된 주소로 들어오면 가장 기본인 주요뉴스(Press)나 빈 화면 렌더링
      return <HeadlineContent />;
  }
}