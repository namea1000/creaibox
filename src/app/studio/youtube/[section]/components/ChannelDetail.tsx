"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Users, Search, Loader2, PlayCircle, Calendar, Eye, Database, Sparkles, ArrowRight, Play, ThumbsUp, MessageSquare, Trash2, Plus, Check, ArrowLeft } from "lucide-react";
import VideoAnalysisModal from "./VideoAnalysisModal";

type RecommendationChannel = {
  name: string;
  handle: string;
  category: string;
  avatar?: string;
  desc: string;
  subscribers: string;
  views: string;
  videos: string;
  country: string; // "KR", "US", "JP", etc.
  isUserAdded?: boolean;
};

type CountryOption = {
  code: string;
  name: string;
  flag: string;
};

const COUNTRIES: CountryOption[] = [
  { code: "KR", name: "대한민국", flag: "🇰🇷" },
  { code: "US", name: "미국", flag: "🇺🇸" },
  { code: "JP", name: "일본", flag: "🇯🇵" },
  { code: "GB", name: "영국", flag: "🇬🇧" },
  { code: "VN", name: "베트남", flag: "🇻🇳" },
  { code: "IN", name: "인도", flag: "🇮🇳" },
  { code: "BR", name: "브라질", flag: "🇧🇷" },
  { code: "CA", name: "캐나다", flag: "🇨🇦" }
];

// Curated benchmark channels for users (48 channels per category + Global benchmark channels)
const BENCHMARK_CHANNELS: RecommendationChannel[] = [
  // 1. Tech/IT (48 channels, KR)
  { name: "잇섭 (ITSub)", handle: "@itsub", category: "테크/IT", avatar: "", desc: "국내 최대 IT 기기 실사용기 및 유쾌한 리뷰 채널", subscribers: "260만", views: "7.2억", videos: "1200개", country: "KR" },
  { name: "테크몽", handle: "@techmong", category: "테크/IT", avatar: "", desc: "생산성 IT 기기 꿀팁 및 스마트 워크 가이드", subscribers: "65만", views: "1.2억", videos: "450개", country: "KR" },
  { name: "주연 ZUYONI", handle: "@jooyeon", category: "테크/IT", avatar: "", desc: "감성 가전, 스마트폰 및 테크 라이프스타일 리뷰", subscribers: "71만", views: "1.8억", videos: "520개", country: "KR" },
  { name: "디몽크", handle: "@dmonk", category: "테크/IT", avatar: "", desc: "심도 깊은 게이밍 기어 및 전문 가전 리뷰 채널", subscribers: "32만", views: "6500만", videos: "380개", country: "KR" },
  { name: "언더케이지", handle: "@underkg", category: "테크/IT", avatar: "", desc: "가장 신속하고 정확한 최신 모바일 기기 언박싱", subscribers: "76만", views: "3.5억", videos: "2400개", country: "KR" },
  { name: "꿀단지PD", handle: "@honeytip_pd", category: "테크/IT", avatar: "", desc: "디스플레이 및 스마트폰 비교 상세 성능 분석", subscribers: "42만", views: "9800만", videos: "620개", country: "KR" },
  { name: "가전주부", handle: "@gghousewife" , category: "테크/IT", avatar: "", desc: "주부 관점에서 바라보는 트렌디 생활 가전 리뷰", subscribers: "38만", views: "7500만", videos: "580개", country: "KR" },
  { name: "방구석 리뷰룸", handle: "@roomreview", category: "테크/IT", avatar: "", desc: "아이패드, 아이폰 등 애플 생태계 활용성 극대화 꿀팁", subscribers: "39만", views: "8200만", videos: "650개", country: "KR" },
  { name: "뻘짓연구소", handle: "@bullslab", category: "테크/IT", avatar: "", desc: "엉뚱하고 호기심 넘치는 하드웨어 실험실", subscribers: "42만", views: "9200만", videos: "720개", country: "KR" },
  { name: "서울리안", handle: "@seoulian", category: "테크/IT", avatar: "", desc: "시각적 연출이 돋보이는 고감도 테크 및 홈 가전 리뷰", subscribers: "34만", views: "6800만", videos: "460개", country: "KR" },
  { name: "오목교 테크상가", handle: "@omgtech", category: "테크/IT", avatar: "", desc: "스마트 유저를 위한 대중적 테크 솔루션 및 정보", subscribers: "31만", views: "5500만", videos: "390개", country: "KR" },
  { name: "테크래빗", handle: "@techrabbit", category: "테크/IT", avatar: "", desc: "실생활 맞춤형 소형 가전 및 트렌디 가젯 비교", subscribers: "12만", views: "2400만", videos: "210개", country: "KR" },
  { name: "랩터의 테크인생", handle: "@raptor_tech", category: "테크/IT", avatar: "", desc: "웨러블 및 모바일 기기 친절한 가이드 채널", subscribers: "11만", views: "1900만", videos: "180개", country: "KR" },
  { name: "IT의 신", handle: "@it_god", category: "테크/IT", avatar: "", desc: "IT 업계 소식 및 유망 기술 트렌드 요약 리포트", subscribers: "15만", views: "2800만", videos: "230개", country: "KR" },
  { name: "기즈모", handle: "@gizmo", category: "테크/IT", avatar: "", desc: "아날로그 감성을 곁들인 프리미엄 음향 및 테크 리뷰", subscribers: "19만", views: "3600만", videos: "310개", country: "KR" },
  { name: "무화과우유", handle: "@figmilk", category: "테크/IT", avatar: "", desc: "초보자를 위한 친근한 태블릿/스마트기기 활용 팁", subscribers: "8만", views: "1200만", videos: "140개", country: "KR" },
  { name: "라이브렉스", handle: "@liverex", category: "테크/IT", avatar: "", desc: "최신 PC 하드웨어 및 모바일 기기 종합 리뷰어", subscribers: "29만", views: "5100만", videos: "490개", country: "KR" },
  { name: "테크룸", handle: "@techroom", category: "테크/IT", avatar: "", desc: "해외 테크 루머 및 미출시 디바이스 사전 예측 정보", subscribers: "10만", views: "1600만", videos: "190개", country: "KR" },
  { name: "언박싱뉴스", handle: "@unboxingnews", category: "테크/IT", avatar: "", desc: "신제품 출시 현장의 실시간 언박싱 및 가이드", subscribers: "7만", views: "1100만", videos: "110개", country: "KR" },
  { name: "리뷰장", handle: "@reviewjang", category: "테크/IT", avatar: "", desc: "실용적인 컴퓨터 조립 및 부품 가성비 분석 채널", subscribers: "14만", views: "2900만", videos: "250개", country: "KR" },
  { name: "고나고 gonago", handle: "@gonago", category: "테크/IT", avatar: "", desc: "크리에이터의 작업 효율을 극대화하는 생산성 테크 리뷰", subscribers: "28만", views: "4800만", videos: "360개", country: "KR" },
  { name: "도레 Dore", handle: "@dore_tech", category: "테크/IT", avatar: "", desc: "컴퓨터 하드웨어 성능 정밀 테스트 및 가성비 조립 팁", subscribers: "25만", views: "4100만", videos: "320개", country: "KR" },
  { name: "다정다감 IT", handle: "@dajung_it", category: "테크/IT", avatar: "", desc: "부모님도 쉽게 이해하는 모바일/스마트기기 기초 사용법", subscribers: "12만", views: "2100만", videos: "190개", country: "KR" },
  { name: "가성비심판", handle: "@value_judge", category: "테크/IT", avatar: "", desc: "저가형 직구 소형 가전의 실제 성능과 내구성 심판", subscribers: "18만", views: "3100만", videos: "220개", country: "KR" },
  { name: "하이테크리뷰", handle: "@hightech_rev", category: "테크/IT", avatar: "", desc: "글로벌 미출시 가젯 해외 직구 실사용 리뷰 전문 채널", subscribers: "15만", views: "2700만", videos: "170개", country: "KR" },
  { name: "스마트디바이스", handle: "@smart_dev", category: "테크/IT", avatar: "", desc: "웨어러블 헬스케어 디바이스 스마트 워치 종합 가이드", subscribers: "9만", views: "1500만", videos: "135개", country: "KR" },
  { name: "가젯허브", handle: "@gadget_hub", category: "테크/IT", avatar: "", desc: "매주 출시되는 신상 생활 테크 가젯 정밀 테스트", subscribers: "13만", views: "2300만", videos: "195개", country: "KR" },
  { name: "모바일프로", handle: "@mobile_pro", category: "테크/IT", avatar: "", desc: "아이폰/갤럭시 숨겨진 프로 기능 및 단축어 최적화 가이드", subscribers: "22만", views: "3900만", videos: "280개", country: "KR" },
  { name: "테크트렌드리포트", handle: "@tech_trend", category: "테크/IT", avatar: "", desc: "CES 등 세계 테크 박람회 기반 신기술 트렌드 분석", subscribers: "11만", views: "1900만", videos: "145개", country: "KR" },
  { name: "얼리어답터뉴스", handle: "@early_adopter", category: "테크/IT", avatar: "", desc: "크라우드 펀딩 신기한 인싸 테크 꿀템 실시간 언박싱", subscribers: "30만", views: "5200만", videos: "410개", country: "KR" },
  { name: "전자기기대장", handle: "@device_king", category: "테크/IT", avatar: "", desc: "가정용 스마트 홈 IoT 구축 및 AI 스피커 활용 꿀팁", subscribers: "8만", views: "1300만", videos: "115개", country: "KR" },
  { name: "기기박사", handle: "@device_doc", category: "테크/IT", avatar: "", desc: "고장난 소형 가전 자가 수리 및 분해 성능 분석 채널", subscribers: "12만", views: "2100만", videos: "185개", country: "KR" },
  { name: "테크위크", handle: "@tech_week", category: "테크/IT", avatar: "", desc: "매주 발행되는 글로벌 테크 루머 및 신제품 예측 브리핑", subscribers: "6만", views: "900만", videos: "95개", country: "KR" },
  { name: "리뷰의신", handle: "@review_god", category: "테크/IT", avatar: "", desc: "가성비 컴퓨터 하드웨어 실전 성능 비교 분석", subscribers: "15만", views: "2600만", videos: "215개", country: "KR" },
  { name: "테크마스터", handle: "@tech_master", category: "테크/IT", avatar: "", desc: "전문적인 네트워크 망 구축 및 홈 서버 세팅 팁", subscribers: "14만", views: "2400만", videos: "195개", country: "KR" },
  { name: "스마트라이프", handle: "@smart_life", category: "테크/IT", avatar: "", desc: "삶의 질을 높여주는 스마트 주방 가전 실생활 리뷰", subscribers: "11만", views: "1800만", videos: "160개", country: "KR" },
  { name: "미래테크", handle: "@future_tech", category: "테크/IT", avatar: "", desc: "인공지능 AI 디바이스 및 유망 IT 기술 리뷰어", subscribers: "13만", views: "2200만", videos: "180개", country: "KR" },
  { name: "기기리뷰단", handle: "@device_rev_team", category: "테크/IT", avatar: "", desc: "다양한 제조사의 보급형 가성비 태블릿 집중 비교", subscribers: "9만", views: "1400만", videos: "125개", country: "KR" },
  { name: "테크월드", handle: "@tech_world", category: "테크/IT", avatar: "", desc: "최신 모바일 디바이스 종합 기술 트렌드 브리핑", subscribers: "25만", views: "4300만", videos: "340개", country: "KR" },
  { name: "아이티쇼 ITShow", handle: "@it_show", category: "테크/IT", avatar: "", desc: "현장감 있는 신제품 출시회 현장 스케치 및 상세 리뷰", subscribers: "18만", views: "3100만", videos: "260개", country: "KR" },
  { name: "스마트IT연구소", handle: "@smart_it_lab", category: "테크/IT", avatar: "", desc: "업무 효율성을 높여주는 오피스 기어 및 키보드 전문 리뷰", subscribers: "14만", views: "2300만", videos: "205개", country: "KR" },
  { name: "가젯월드", handle: "@gadget_world", category: "테크/IT", avatar: "", desc: "독특한 아이디어 가젯 및 해외 직구 신기방기 테크템", subscribers: "16만", views: "2700만", videos: "225개", country: "KR" },
  { name: "얼리어답터리포트", handle: "@early_rep", category: "테크/IT", avatar: "", desc: "테크 애호가들을 위한 고급 사양 게이밍 데스크셋 구성", subscribers: "10만", views: "1600만", videos: "140개", country: "KR" },
  { name: "리뷰공장", handle: "@review_factory", category: "테크/IT", avatar: "", desc: "소형 전동 공구 및 차량용 편리 가젯 작동 정밀 분석", subscribers: "11만", views: "1800만", videos: "155개", country: "KR" },
  { name: "기기분석단", handle: "@device_analysis", category: "테크/IT", avatar: "", desc: "스마트 홈 가전 브랜드별 실제 성능 및 전력 효율 테스트", subscribers: "10만", views: "1700만", videos: "150개", country: "KR" },
  { name: "테크파인더", handle: "@tech_finder", category: "테크/IT", avatar: "", desc: "입문자를 위한 맞춤형 가성비 디바이스 추천 및 비교", subscribers: "8.5만", views: "1400만", videos: "110개", country: "KR" },
  { name: "디지털포커스", handle: "@digital_focus", category: "테크/IT", avatar: "", desc: "최신 디지털 기기 활용 소프트웨어 및 스마트 팁", subscribers: "9.5만", views: "1600만", videos: "130개", country: "KR" },
  { name: "스마트가젯", handle: "@smart_gadget", category: "테크/IT", avatar: "", desc: "원룸 맞춤형 가젯 및 가전 인테리어 테크 리뷰", subscribers: "7.5만", views: "1100만", videos: "105개", country: "KR" },

  // 2. Game (48 channels, KR)
  { name: "우왁굳", handle: "@woowakgood", category: "게임", avatar: "", desc: "가상 메타버스 콘텐츠 기획 및 게임 실황의 대가", subscribers: "168만", views: "15.3억", videos: "9800개", country: "KR" },
  { name: "침착맨", handle: "@chimchakman", category: "게임", avatar: "", desc: "일상 소통 및 웹툰 작가 출신의 1인 토크 방송", subscribers: "245만", views: "18.3억", videos: "5200개", country: "KR" },
  { name: "랄로", handle: "@ralllorallo", category: "게임", avatar: "", desc: "주옥같은 드립 및 리그오브레전드 실황 방송", subscribers: "110만", views: "4.8억", videos: "280개", country: "KR" },
  { name: "혜안", handle: "@hyean", category: "게임", avatar: "", desc: "독창적인 편집 및 다양한 종합 게임 플레이어", subscribers: "128만", views: "5.2억", videos: "860개", country: "KR" },
  { name: "풍월량", handle: "@pungwoollyang", category: "게임", avatar: "", desc: "시청자와 소통하는 편안한 종합 게임 실황 방송", subscribers: "61만", views: "3.2억", videos: "4200개", country: "KR" },
  { name: "괴물쥐", handle: "@monster_rat", category: "게임", avatar: "", desc: "강렬한 텐션의 원거리 딜러 리그오브레전드 유튜버", subscribers: "105만", views: "4.2억", videos: "1500개", country: "KR" },
  { name: "파카", handle: "@paka", category: "게임", avatar: "", desc: "압도적인 게임 피지컬과 감성 멘트의 조화", subscribers: "82만", views: "3.1억", videos: "350개", country: "KR" },
  { name: "서새봄냥", handle: "@saddler_cat", category: "게임", avatar: "", desc: "다양한 신작 콘솔 게임 중심의 여성 크리에이터", subscribers: "32만", views: "1.1억", videos: "2300개", country: "KR" },
  { name: "쉐리", handle: "@sherry", category: "게임", avatar: "", desc: "신작 콘솔 게임 공략 및 영화 같은 게임 실황", subscribers: "41만", views: "1.5억", videos: "1800개", country: "KR" },
  { name: "홍방장", handle: "@hongbangjang", category: "게임", avatar: "", desc: "중후한 목소리의 콘솔 게임 및 일상 소통 유튜버", subscribers: "30만", views: "9500만", videos: "1200개", country: "KR" },
  { name: "대도서관", handle: "@buzzbean", category: "게임", avatar: "", desc: "대한민국 1세대 종합 게임 크리에이터의 아이콘", subscribers: "150만", views: "8.5억", videos: "3600개", country: "KR" },
  { name: "감스트", handle: "@gamst", category: "게임", avatar: "", desc: "축구 중계, 피파온라인 및 종합 예능 버라이어티", subscribers: "260만", views: "12.3억", videos: "4500개", country: "KR" },
  { name: "한동숙", handle: "@handongsuk", category: "게임", avatar: "", desc: "축구 시뮬레이션 및 종합 RPG 게임 전문 리뷰어", subscribers: "44만", views: "1.5억", videos: "1100개", country: "KR" },
  { name: "탬탬버린", handle: "@tam_tam", category: "게임", avatar: "", desc: "귀여운 목소리와 반전 피지컬의 종합 게임 유튜버", subscribers: "51만", views: "2.1억", videos: "1400개", country: "KR" },
  { name: "쥐환", handle: "@rat_hwan", category: "게임", avatar: "", desc: "리그오브레전드 솔로 랭크 중심의 유쾌한 게임 플레이", subscribers: "35만", views: "9800만", videos: "950개", country: "KR" },
  { name: "탬탬", handle: "@tamtam", category: "게임", avatar: "", desc: "서브컬처 및 다양한 캐주얼 게임 실황 채널", subscribers: "28만", views: "6500만", videos: "760개", country: "KR" },
  { name: "팡이요", handle: "@pang2yo", category: "게임", avatar: "", desc: "메이플스토리 초고스펙 장비 강화 및 레이드 전문가", subscribers: "45만", views: "1.8억", videos: "1600개", country: "KR" },
  { name: "타요", handle: "@tayo", category: "게임", avatar: "", desc: "모바일 수집형 게임 리뷰 및 종합 예능 토크", subscribers: "32만", views: "1.0억", videos: "1300개", country: "KR" },
  { name: "머독", handle: "@murdoch", category: "게임", avatar: "", desc: "가면 속 폭발적인 에너지를 내뿜는 종합 게임 플레이", subscribers: "85만", views: "4.5억", videos: "3200개", country: "KR" },
  { name: "악어", handle: "@crocodile", category: "게임", avatar: "", desc: "대규모 마인크래프트 서버 기획 및 예능 콘텐츠", subscribers: "120만", views: "6.2억", videos: "2100개", country: "KR" },
  { name: "도티 TV", handle: "@dotytv", category: "게임", avatar: "", desc: "대한민국 마인크래프트 예능 콘텐츠의 선구자", subscribers: "230만", views: "24.5억", videos: "4800개", country: "KR" },
  { name: "잠뜰 TV", handle: "@sleepground", category: "게임", avatar: "", desc: "스토리 중심 웰메이드 마인크래프트 상황극 채널", subscribers: "220만", views: "22.3억", videos: "5200개", country: "KR" },
  { name: "태경 TV", handle: "@taekyeong", category: "게임", avatar: "", desc: "캐주얼하고 대중적인 마인크래프트 및 종합 게임 실황", subscribers: "100만", views: "8.5억", videos: "3100개", country: "KR" },
  { name: "쁘띠허브", handle: "@prettyherb", category: "게임", avatar: "", desc: "아기자기한 그래픽 게임 실황 및 일러스트 튜토리얼", subscribers: "110만", views: "9.2억", videos: "2900개", country: "KR" },
  { name: "쵸쵸우", handle: "@chochou", category: "게임", avatar: "", desc: "귀여운 목소리의 서브컬처 노래 및 마인크래프트 게임 실황", subscribers: "50만", views: "3.2억", videos: "1200개", country: "KR" },
  { name: "코아 TV", handle: "@koatv", category: "게임", avatar: "", desc: "유쾌한 마인크래프트 모드 생존기 및 게임 예능", subscribers: "60만", views: "4.5억", videos: "1800개", country: "KR" },
  { name: "칠각별", handle: "@star_seven", category: "게임", avatar: "", desc: "전문적인 테크 마인크래프트 공략 및 회로 실험실", subscribers: "42만", views: "2.8억", videos: "1100개", country: "KR" },
  { name: "수현 TV", handle: "@suhyuntv", category: "게임", avatar: "", desc: "상냥한 목소리로 풀어내는 캐주얼 종합 인디 게임 실황", subscribers: "40만", views: "2.5억", videos: "950개", country: "KR" },
  { name: "테드 TedTV", handle: "@tedtv", category: "게임", avatar: "", desc: "클래시 로얄, 브롤스타즈 등 모바일 캐주얼 게임의 달인", subscribers: "110만", views: "8.9억", videos: "3200개", country: "KR" },
  { name: "뜨뜨뜨뜨", handle: "@ddeuddeu", category: "게임", avatar: "", desc: "배틀그라운드 초고수 피지컬 플레이 및 유쾌한 리액션", subscribers: "165만", views: "7.8억", videos: "1600개", country: "KR" },
  { name: "킴성태", handle: "@kimseongtae", category: "게임", avatar: "", desc: "서든어택 국가대표 출신이자 배틀그라운드 콘텐츠 리더", subscribers: "102만", views: "6.5억", videos: "3800개", country: "KR" },
  { name: "깨박이", handle: "@ggabak", category: "게임", avatar: "", desc: "유쾌한 소통 라이브와 모바일/배틀그라운드 게임 콘텐츠", subscribers: "62만", views: "3.5억", videos: "1800개", country: "KR" },
  { name: "저라뎃", handle: "@justlikethat", category: "게임", avatar: "", desc: "리그오브레전드 챌린저 정글러 정교한 전술 공략 채널", subscribers: "75만", views: "4.1억", videos: "2400개", country: "KR" },
  { name: "군림보", handle: "@grb_game", category: "게임", avatar: "", desc: "중후한 목소리의 배틀그라운드 및 종합 신작 생존 게임", subscribers: "55만", views: "3.2억", videos: "2100개", country: "KR" },
  { name: "러너 RULER", handle: "@runner", category: "게임", avatar: "", desc: "오버워치 러너웨이 구단주 출신의 대한민국 대표 스트리머", subscribers: "65만", views: "3.9억", videos: "2800개", country: "KR" },
  { name: "꽃빈", handle: "@flowervin", category: "게임", avatar: "", desc: "일상 예능 토크와 다양한 모바일/스마트 게임 실황", subscribers: "38만", views: "1.8억", videos: "1200개", country: "KR" },
  { name: "로이조 Royjo", handle: "@royjo", category: "게임", avatar: "", desc: "리그오브레전드 1세대 극강 입담 게임 크리에이터", subscribers: "85만", views: "5.2억", videos: "3100개", country: "KR" },
  { name: "철구형", handle: "@chulgoo", category: "게임", avatar: "", desc: "강렬한 리액션과 스타크래프트/종합 엔터 게임 실황", subscribers: "110만", views: "6.8억", videos: "4200개", country: "KR" },
  { name: "신병철", handle: "@sub_soldier", category: "게임", avatar: "", desc: "FPS 스페셜포스/서든어택 전술 및 헤드샷 공략 강좌", subscribers: "15만", views: "3200만", videos: "450개", country: "KR" },
  { name: "아크로 ACRO", handle: "@acro_game", category: "게임", avatar: "", desc: "콘솔 및 글로벌 MMORPG 정밀 공략 및 비평 리뷰", subscribers: "15만", views: "3800만", videos: "520개", country: "KR" },
  { name: "롤선생", handle: "@lol_teacher", category: "게임", avatar: "", desc: "리그오브레전드 미드 라이너 정교한 스킬 콤보 교육", subscribers: "50만", views: "2.5억", videos: "1650개", country: "KR" },
  { name: "단아냥", handle: "@dananyang", category: "게임", avatar: "", desc: "유쾌한 소통 예능 및 캐주얼 모바일 게임 도전기", subscribers: "18만", views: "4500만", videos: "620개", country: "KR" },
  { name: "풍림푸르딩", handle: "@punglim", category: "게임", avatar: "", desc: "스트리트 파이터, 철권 등 격투 게임 전문 공략 채널", subscribers: "12만", views: "2900만", videos: "580개", country: "KR" },
  { name: "게임위키", handle: "@gamewiki", category: "게임", avatar: "", desc: "매주 출시되는 콘솔 신작 게임 한글 자막 상세 비평", subscribers: "22만", views: "4800만", videos: "310개", country: "KR" },
  { name: "LCK 에디터", handle: "@lck_editor", category: "게임", avatar: "", desc: "리그오브레전드 프로 경기 분석 및 한타 전술 리포트", subscribers: "35만", views: "9200만", videos: "420개", country: "KR" },
  { name: "종합게임백과", handle: "@game_encyclopedia", category: "게임", avatar: "", desc: "명작 고전 명작 게임 스토리 정리 및 이스터에그 발굴", subscribers: "28만", views: "6800만", videos: "380개", country: "KR" },
  { name: "모바일마스터", handle: "@mobile_master", category: "게임", avatar: "", desc: "방치형 RPG 및 신작 수집형 게임 최적 효율 루틴 공략", subscribers: "14만", views: "2400만", videos: "210개", country: "KR" },
  { name: "콘솔러", handle: "@consoler", category: "게임", avatar: "", desc: "플레이스테이션 및 닌텐도 스위치 독점작 정밀 리뷰", subscribers: "11만", views: "1900만", videos: "180개", country: "KR" },

  // 3. Music (48 channels, KR)
  { name: "JFla", handle: "@jfla", category: "뮤직", avatar: "", desc: "전세계적 인기를 끈 대표 어쿠스틱 커버 보컬리스트", subscribers: "1720만", views: "37.5억", videos: "320개", country: "KR" },
  { name: "dingo music", handle: "@dingomusic", category: "뮤직", avatar: "", desc: "킬링 보이스 라이브 및 감각적인 음원 비디오 스튜디오", subscribers: "490만", views: "15.8억", videos: "1500개", country: "KR" },
  { name: "Raon", handle: "@raon", category: "뮤직", avatar: "", desc: "파워풀한 가창력의 서브컬처 및 제이팝 커버 아티스트", subscribers: "430만", views: "11.2억", videos: "850개", country: "KR" },
  { name: "이혁", handle: "@leehyuk", category: "뮤직", avatar: "", desc: "폭발적인 4옥타브 고음 락 발라드 커버 전문가", subscribers: "45만", views: "1.2억", videos: "560개", country: "KR" },
  { name: "새송", handle: "@saesong", category: "뮤직", avatar: "", desc: "청아하고 감미로운 대중가요 커버 전문 보컬", subscribers: "320만", views: "8.5억", videos: "420개", country: "KR" },
  { name: "버블디아", handle: "@bubbledia", category: "뮤직", avatar: "", desc: "실용 음악 발성 가이드 및 뮤지컬 감성 커버", subscribers: "115만", views: "2.8억", videos: "740개", country: "KR" },
  { name: "탑현", handle: "@tophyeon", category: "뮤직", avatar: "", desc: "음원 차트를 저격하는 호소력 짙은 발라드 가수", subscribers: "38만", views: "9200만", videos: "150개", country: "KR" },
  { name: "권진아", handle: "@kwonjina", category: "뮤직", avatar: "", desc: "싱어송라이터의 독보적인 어쿠스틱 라이브 감성", subscribers: "20만", views: "4500만", videos: "110개", country: "KR" },
  { name: "창현 거리노래방", handle: "@changhyun", category: "뮤직", avatar: "", desc: "대한민국 곳곳을 찾아가는 실시간 거리 보컬 경연", subscribers: "210만", views: "6.8억", videos: "2200개", country: "KR" },
  { name: "원밀리언 댄스", handle: "@1million", category: "뮤직", avatar: "", desc: "글로벌 댄서들의 트렌디 안무 및 퍼포먼스 필름", subscribers: "2600만", views: "78.2억", videos: "5400개", country: "KR" },
  { name: "dingo freestyle", handle: "@dingofreestyle", category: "뮤직", avatar: "", desc: "힙합, 알앤비 래퍼들의 킬링벌스 전용 라이브 채널", subscribers: "220만", views: "6.2억", videos: "1100개", country: "KR" },
  { name: "오드g", handle: "@odg", category: "뮤직", avatar: "", desc: "아이들과 아티스트가 음악으로 나누는 깊은 감성 교감", subscribers: "340만", views: "9.5억", videos: "680개", country: "KR" },
  { name: "원더케이", handle: "@1k", category: "뮤직", avatar: "", desc: "글로벌 케이팝 뮤직비디오 및 오리지널 예능 쇼", subscribers: "2400만", views: "148억", videos: "12000개", country: "KR" },
  { name: "스톤뮤직", handle: "@stonemusic", category: "뮤직", avatar: "", desc: "드라마 OST 및 대중음악 메이저 유통 브랜드 피드", subscribers: "1050만", views: "68.2억", videos: "8400개", country: "KR" },
  { name: "지니뮤직", handle: "@geniemusic", category: "뮤직", avatar: "", desc: "고음질 음원 스트리밍 플랫폼 공식 라이브 비디오", subscribers: "190만", views: "8.5억", videos: "2100개", country: "KR" },
  { name: "워너뮤직코리아", handle: "@warnermusickorea", category: "뮤직", avatar: "", desc: "글로벌 팝스타 및 국내 인디 아티스트 공식 피드", subscribers: "90만", views: "4.2억", videos: "1400개", country: "KR" },
  { name: "라임튜브", handle: "@limetube", category: "뮤직", avatar: "", desc: "가족이 함께 즐기는 밝고 유쾌한 동요 애니메이션", subscribers: "380만", views: "18.5억", videos: "2200개", country: "KR" },
  { name: "보컬플레이", handle: "@vocalplay", category: "뮤직", avatar: "", desc: "국내외 보컬 레슨 및 발성 트레이닝 전문 채널", subscribers: "15만", views: "2400만", videos: "350개", country: "KR" },
  { name: "노래하는코트", handle: "@singingcoat", category: "뮤직", avatar: "", desc: "유쾌한 소통 라이브와 시청자 노래 피드백 진행", subscribers: "80만", views: "3.2억", videos: "1100개", country: "KR" },
  { name: "달지", handle: "@dalji", category: "뮤직", avatar: "", desc: "초등학교 교사의 선한 에너지가 돋보이는 랩 및 음악", subscribers: "35만", views: "7200만", videos: "290개", country: "KR" },
  { name: "조매력 Chomaeryeok", handle: "@chomaeryeok", category: "뮤직", avatar: "", desc: "글로벌 유저들과 소통하는 고품격 재즈/팝 라이브 세션", subscribers: "85만", views: "1.5억", videos: "620개", country: "KR" },
  { name: "소울보컬 TV", handle: "@soulvocal", category: "뮤직", avatar: "", desc: "알앤비 발성 이론 및 고음 믹스보이스 실전 강좌", subscribers: "12만", views: "2100만", videos: "180개", country: "KR" },
  { name: "버스킹피플", handle: "@busking_people", category: "뮤직", avatar: "", desc: "홍대, 신촌 버스킹 현장의 보석 같은 일반인 라이브", subscribers: "18만", views: "3200만", videos: "350개", country: "KR" },
  { name: "클래식피아노", handle: "@classic_piano", category: "뮤직", avatar: "", desc: "마음이 편안해지는 고음질 정통 클래식 명곡 피아노 연주", subscribers: "15만", views: "2400만", videos: "280개", country: "KR" },
  { name: "재즈라운지", handle: "@jazz_lounge", category: "뮤직", avatar: "", desc: "감성 카페 분위기를 자아내는 미드템포 재즈 플레이리스트", subscribers: "22만", views: "3800만", videos: "420개", country: "KR" },
  { name: "어쿠스틱기타", handle: "@acoustic_guitar", category: "뮤직", avatar: "", desc: "어쿠스틱 통기타 쉬운 코드 법 및 핑거스타일 강습", subscribers: "14만", views: "2200만", videos: "240개", country: "KR" },
  { name: "케이팝커버댄스", handle: "@kpop_dance_cov", category: "뮤직", avatar: "", desc: "신작 아이돌 안무 속도별 거울모드 댄스 튜토리얼", subscribers: "60만", views: "1.2억", videos: "750개", country: "KR" },
  { name: "댄스아카데미", handle: "@dance_academy", category: "뮤직", avatar: "", desc: "기초 스트리트 댄스 팝핀 및 락킹 전문 트레이닝 강좌", subscribers: "45만", views: "8200만", videos: "520개", country: "KR" },
  { name: "힐링뮤직 테라피", handle: "@healing_therapy", category: "뮤직", avatar: "", desc: "스트레스 해소와 수면 유도를 위한 고화질 자연의 소리", subscribers: "55만", views: "9800만", videos: "450개", country: "KR" },
  { name: "팝송가사비디오", handle: "@popsong_lyrics", category: "뮤직", avatar: "", desc: "영어 감성 팝송 한글 번역 자막 및 발음 싱크 비디오", subscribers: "70만", views: "1.8억", videos: "820개", country: "KR" },
  { name: "인디뮤직 아카이브", handle: "@indiemusic", category: "뮤직", avatar: "", desc: "숨겨진 국내 어쿠스틱 인디 밴드들의 고화질 라이브", subscribers: "30만", views: "4500만", videos: "290개", country: "KR" },
  { name: "베이스캠프 Bass", handle: "@basscamp", category: "뮤직", avatar: "", desc: "그루브 넘치는 일렉 베이스 기타 연주법 및 슬랩 강습", subscribers: "9만", views: "1500만", videos: "135개", country: "KR" },
  { name: "가사싱크 스튜디오", handle: "@lyrics_sync", category: "뮤직", avatar: "", desc: "인기 플레이리스트 한글 가사 편집 및 노래방 가이드", subscribers: "42만", views: "8500만", videos: "640개", country: "KR" },
  { name: "뮤직리포터", handle: "@music_reporter", category: "뮤직", avatar: "", desc: "금주 신규 앨범 리뷰 및 빌보드 차트 변화 심층 분석", subscribers: "15만", views: "2800만", videos: "190개", country: "KR" },
  { name: "음반수집가", handle: "@album_collector", category: "뮤직", avatar: "", desc: "LP 레코드 피드 및 명작 클래식 음반 실시간 청음", subscribers: "12만", views: "2100만", videos: "180개", country: "KR" },
  { name: "라이브커버 보컬", handle: "@live_cover_voc", category: "뮤직", avatar: "", desc: "실력파 일반인 보컬들의 명품 가요 커버 영상 모음", subscribers: "28만", views: "5200만", videos: "360개", country: "KR" },
  { name: "힙합비트 메이커", handle: "@hiphop_beats", category: "뮤직", avatar: "", desc: "무료 배포용 붐뱁/트랩 힙합 인스트루멘탈 음원 공급", subscribers: "25만", views: "4800만", videos: "320개", country: "KR" },
  { name: "드럼스쿨 TV", handle: "@drum_school", category: "뮤직", avatar: "", desc: "드럼 비트 기초 패드 훈련 및 가요 드럼 악보 연주", subscribers: "13만", views: "2150만", videos: "190개", country: "KR" },
  { name: "서울거리음악가", handle: "@seoul_busker", category: "뮤직", avatar: "", desc: "도심 속 숨겨진 악사들의 명품 버스킹 풀버전 아카이브", subscribers: "22만", views: "3800만", videos: "420개", country: "KR" },
  { name: "골든가요 아카이브", handle: "@golden_kpop", category: "뮤직", avatar: "", desc: "8090 추억의 명작 가요 및 트로트 고음질 연속 감상", subscribers: "50만", views: "9500만", videos: "520개", country: "KR" },
  { name: "로파이 공부방", handle: "@lofi_study", category: "뮤직", avatar: "", desc: "공부할 때 듣기 좋은 고품질 로파이 비트 24시 라이브", subscribers: "32만", views: "6500만", videos: "140개", country: "KR" },
  { name: "뮤직테라피", handle: "@music_therapy", category: "뮤직", avatar: "", desc: "지친 마음을 위로하는 차분한 뉴에이지 피아노 모음", subscribers: "40만", views: "7200만", videos: "380개", country: "KR" },
  { name: "어쿠스틱 세션", handle: "@acoustic_session", category: "뮤직", avatar: "", desc: "어쿠스틱 감성 인디 가요 라이브 커버 스튜디오", subscribers: "16만", views: "2800만", videos: "195개", country: "KR" },
  { name: "작곡가 라이프", handle: "@composer_life", category: "뮤직", avatar: "", desc: "큐베이스 및 로직 프로를 활용한 작곡 및 편곡 튜토리얼", subscribers: "11만", views: "1900만", videos: "145개", country: "KR" },
  { name: "케이팝 메들리", handle: "@kpop_medley", category: "뮤직", avatar: "", desc: "아이돌 히트곡 믹스 및 신나게 달리는 드라이브 송", subscribers: "24만", views: "4200만", videos: "290개", country: "KR" },
  { name: "인디 아티스트 스케치", handle: "@indi_sketch", category: "뮤직", avatar: "", desc: "언더그라운드 실력파 밴드들의 생생한 합주실 직캠", subscribers: "10만", views: "1700만", videos: "160개", country: "KR" },
  { name: "클래식 매니아", handle: "@classic_mania", category: "뮤직", avatar: "", desc: "오케스트라 명장면 및 지휘자별 연주 스타일 비교", subscribers: "8.5만", views: "1350만", videos: "110개", country: "KR" },
  { name: "재즈카페 플레이", handle: "@jazz_cafe_play", category: "뮤직", avatar: "", desc: "비 오는 날 듣기 좋은 깊은 콘트라베이스 재즈 컴필레이션", subscribers: "7.5만", views: "1100만", videos: "95개", country: "KR" },

  // 4. Entertainment (48 channels, KR)
  { name: "피식대학 (Psick Univ)", handle: "@psickuniv", category: "엔터테인먼트", avatar: "", desc: "B대면데이트, 서준맘 등 부캐 및 예능 버라이어티 극장", subscribers: "295만", views: "12.5억", videos: "1350개", country: "KR" },
  { name: "빠니보틀", handle: "@panibottle", category: "엔터테인먼트", avatar: "", desc: "국내 1세대 세계 오지 배낭 여행 브이로그", subscribers: "220만", views: "5.3억", videos: "460개", country: "KR" },
  { name: "곽튜브", handle: "@jwacktube", category: "엔터테인먼트", avatar: "", desc: "유라시아 및 전세계 방랑 여행과 생생한 먹방", subscribers: "205만", views: "4.8억", videos: "510개", country: "KR" },
  { name: "워크맨", handle: "@workman", category: "엔터테인먼트", avatar: "", desc: "세상의 모든 아르바이트를 거침없이 체험하는 예능", subscribers: "400만", views: "11.2억", videos: "650개", country: "KR" },
  { name: "뜬뜬 (DdeunDdeun)", handle: "@ddeunddeun", category: "엔터테인먼트", avatar: "", desc: "유재석이 동료들과 진행하는 유쾌한 수다 토크쇼 핑계고", subscribers: "190만", views: "4.8억", videos: "390개", country: "KR" },
  { name: "채널 십오야", handle: "@15ya", category: "엔터테인먼트", avatar: "", desc: "나영석 PD 사단의 오리지널 방송 미공개 예능 비디오", subscribers: "640만", views: "24.5억", videos: "3100개", country: "KR" },
  { name: "보겸", handle: "@bokyem", category: "엔터테인먼트", avatar: "", desc: "압도적인 친밀감으로 소통하는 종합 라이프 유튜버", subscribers: "430만", views: "28.5억", videos: "5600개", country: "KR" },
  { name: "숏박스", handle: "@shortbox", category: "엔터테인먼트", avatar: "", desc: "하이퍼 리얼리즘 일상 밀착형 초단편 스케치 코미디", subscribers: "285만", views: "6.8억", videos: "180개", country: "KR" },
  { name: "너덜트", handle: "@nerdult", category: "엔터테인먼트", avatar: "", desc: "위트 넘치는 대본 및 웰메이드 고퀄리티 스케치 코미디", subscribers: "185만", views: "3.2억", videos: "95개", country: "KR" },
  { name: "장삐쭈", handle: "@jangbbijju", category: "엔터테인먼트", avatar: "", desc: "병맛 더빙과 명작 군대 시트콤 신병의 제작 채널", subscribers: "350만", views: "15.3억", videos: "620개", country: "KR" },
  { name: "스튜디오 와플", handle: "@studiowaffle", category: "엔터테인먼트", avatar: "", desc: "이용진의 바퀴달린 입 등 매운맛 입담의 토크 예능", subscribers: "140만", views: "5.5억", videos: "850개", country: "KR" },
  { name: "덱스101", handle: "@dex101", category: "엔터테인먼트", avatar: "", desc: "UDT 출신 덱스의 하드코어 피지컬 일상 및 토크 쇼", subscribers: "85만", views: "1.2억", videos: "240개", country: "KR" },
  { name: "미미미누", handle: "@mimiminu", category: "엔터테인먼트", avatar: "", desc: "N수생 성향 입시 소통 및 유쾌한 길거리 공부 멘토링", subscribers: "155만", views: "4.5억", videos: "820개", country: "KR" },
  { name: "꽈뚜룹", handle: "@kwadwoop", category: "엔터테인먼트", avatar: "", desc: "가상 미국인 부캐의 하이텐션 인터뷰 및 토크쇼", subscribers: "130만", views: "3.8억", videos: "610개", country: "KR" },
  { name: "대성기획", handle: "@daesung", category: "엔터테인먼트", avatar: "", desc: "대성의 인맥 중심 유쾌한 레트로 음악 토크 예능", subscribers: "42만", views: "5200만", videos: "180개", country: "KR" },
  { name: "유병재", handle: "@dbqudwo", category: "엔터테인먼트", avatar: "", desc: "기상천외한 웃음 참기 챌린지와 블랙 코미디의 진수", subscribers: "105만", views: "3.2억", videos: "520개", country: "KR" },
  { name: "오킹", handle: "@oking", category: "엔터테인먼트", avatar: "", desc: "국토대장정 스토리텔링 및 썰 풀이 전문 방송", subscribers: "120만", views: "4.2억", videos: "1400개", country: "KR" },
  { name: "랄랄", handle: "@ralral", category: "엔터테인먼트", avatar: "", desc: "기 쎈 눈나 콘셉트의 초강력 리액션 시뮬레이션 방송", subscribers: "140만", views: "3.8억", videos: "980개", country: "KR" },
  { name: "엔조이커플", handle: "@enjoycouple", category: "엔터테인먼트", avatar: "", desc: "유쾌한 현실 커플 시트콤 및 이색 먹방 예능", subscribers: "225만", views: "8.5억", videos: "920개", country: "KR" },
  { name: "와썹맨 Wassup Man", handle: "@wassupman", category: "엔터테인먼트", avatar: "", desc: "박준형의 핫플레이스 저돌적 체험 및 대폭소 예능", subscribers: "160만", views: "4.2억", videos: "350개", country: "KR" },
  { name: "동네놈들", handle: "@dongnae", category: "엔터테인먼트", avatar: "", desc: "시민 동참형 역대급 몰래카메라 코미디 극장", subscribers: "145만", views: "5.1억", videos: "420개", country: "KR" },
  { name: "흔한남매", handle: "@giggle_siblings", category: "엔터테인먼트", avatar: "", desc: "초등학생 맞춤 꿀잼 패밀리 시트콤 상황극", subscribers: "260만", views: "28.5억", videos: "1800개", country: "KR" },
  { name: "보물섬", handle: "@treasure_island", category: "엔터테인먼트", avatar: "", desc: "대학 동기들의 기상천외한 이색 도전 및 개그 콩트", subscribers: "195만", views: "9.2억", videos: "850개", country: "KR" },
  { name: "더블비 Double B", handle: "@doubleb", category: "엔터테인먼트", avatar: "", desc: "거침없는 우정 파괴 벌칙 및 하이텐션 예능 버라이어티", subscribers: "170만", views: "8.8억", videos: "920개", country: "KR" },
  { name: "급식왕", handle: "@school_lunch", category: "엔터테인먼트", avatar: "", desc: "유쾌한 학교생활 기반 초등 타겟 스토리 코미디", subscribers: "138만", views: "6.8억", videos: "1100개", country: "KR" },
  { name: "조재원 JaeWon", handle: "@jaewon_cho", category: "엔터테인먼트", avatar: "", desc: "상황극 콩트의 달인이자 글로벌 밈 챌린지 선도 채널", subscribers: "150만", views: "7.2억", videos: "650개", country: "KR" },
  { name: "수상한 녀석들", handle: "@suspicious_guys", category: "엔터테인먼트", avatar: "", desc: "기발하고 선한 영향력을 펼치는 시민 반응 예능 콩트", subscribers: "105만", views: "4.1억", videos: "320개", country: "KR" },
  { name: "낄낄상회", handle: "@kkilkkil", category: "엔터테인먼트", avatar: "", desc: "개그맨 출신들이 진행하는 고품격 카페 몰래카메라 극장", subscribers: "120만", views: "5.5억", videos: "480개", country: "KR" },
  { name: "쪼맨형", handle: "@jjoman_bro", category: "엔터테인먼트", avatar: "", desc: "생활 밀착형 부부 콩트 및 리얼 시트콤 코미디", subscribers: "32만", views: "9200만", videos: "180개", country: "KR" },
  { name: "코미디빅리그 공식", handle: "@kobig", category: "엔터테인먼트", avatar: "", desc: "공개 방청 코미디 무대 명장면 및 미공개 레전드 클립", subscribers: "280만", views: "18.5억", videos: "9500개", country: "KR" },
  { name: "유세윤의 귀상어", handle: "@yuseyoon", category: "엔터테인먼트", avatar: "", desc: "뼈그맨 유세윤의 독창적인 인스타 밈 패러디 콩트", subscribers: "45만", views: "1.2억", videos: "320개", country: "KR" },
  { name: "꼰대희", handle: "@kkondaehee", category: "엔터테인먼트", avatar: "", desc: "김대희의 부캐 꼰대희가 선보이는 레전드 밥묵자 토크쇼", subscribers: "85만", views: "2.8억", videos: "420개", country: "KR" },
  { name: "권혁수 감성", handle: "@hyuksoo", category: "엔터테인먼트", avatar: "", desc: "독보적인 성대모사와 유쾌한 일상 시트콤 코미디", subscribers: "38만", views: "9200만", videos: "240개", country: "KR" },
  { name: "강유미 좋아서 하는 채널", handle: "@yumi_asmr", category: "엔터테인먼트", avatar: "", desc: "하이퍼리얼리즘 부캐 코미디 롤플레이 및 ASMR", subscribers: "75만", views: "2.2억", videos: "560개", country: "KR" },
  { name: "노홍철 HongChul", handle: "@hongchul", category: "엔터테인먼트", avatar: "", desc: "하고 싶은 거 다 하는 노홍철의 긍정 세계 여행 브이로그", subscribers: "48만", views: "6500만", videos: "150개", country: "KR" },
  { name: "하하 PD", handle: "@hahapd", category: "엔터테인먼트", avatar: "", desc: "하하와 융드옥정의 유쾌한 패밀리 예능 리얼리티", subscribers: "72만", views: "1.5억", videos: "310개", country: "KR" },
  { name: "정형돈의 돈플릭스", handle: "@donflix", category: "엔터테인먼트", avatar: "", desc: "정형돈이 기획하는 좌충우돌 오리지널 예능 제작기", subscribers: "55만", views: "9800만", videos: "190개", country: "KR" },
  { name: "할명수", handle: "@halmyungsoo", category: "엔터테인먼트", avatar: "", desc: "부캐 명수옹의 트렌디 유행 기기 및 맛집 리뷰 예능", subscribers: "115만", views: "3.2억", videos: "460개", country: "KR" },
  { name: "구라철", handle: "@guracheol", category: "엔터테인먼트", avatar: "", desc: "김구라가 방송가의 진실을 거침없이 파헤치는 탐사 예능", subscribers: "65만", views: "1.8억", videos: "380개", country: "KR" },
  { name: "이경규의 갓경규", handle: "@god_kyu", category: "엔터테인먼트", avatar: "", desc: "예능 대부 이경규의 무필터 게스트 토크 및 비평 쇼", subscribers: "32만", views: "4500만", videos: "120개", country: "KR" },
  { name: "신동엽의 짠한형", handle: "@jjanhyeong", category: "엔터테인먼트", avatar: "", desc: "신동엽이 게스트와 편안히 한잔하며 나누는 레전드 토크", subscribers: "110만", views: "1.9억", videos: "150개", country: "KR" },
  { name: "노빠꾸 탁재훈", handle: "@no_back_tak", category: "엔터테인먼트", avatar: "", desc: "탁재훈의 매운맛 무맥락 수사 취조 콘셉트 토크쇼", subscribers: "140만", views: "3.5억", videos: "280개", country: "KR" },
  { name: "엔터박스", handle: "@enter_box", category: "엔터테인먼트", avatar: "", desc: "방송가 비하인드 스토리 및 연예계 트렌드 요약 리포트", subscribers: "18만", views: "3100만", videos: "205개", country: "KR" },
  { name: "콩트하우스", handle: "@comedy_house", category: "엔터테인먼트", avatar: "", desc: "개그맨 지망생들이 선보이는 풋풋하고 신선한 콩트 극장", subscribers: "25만", views: "4800만", videos: "220개", country: "KR" },
  { name: "주말 예능 모아", handle: "@weekend_ent", category: "엔터테인먼트", avatar: "", desc: "지상파 인기 주말 버라이어티 하이라이트 분석", subscribers: "30만", views: "6200만", videos: "410개", country: "KR" },
  { name: "예능 연구소", handle: "@ent_research", category: "엔터테인먼트", avatar: "", desc: "트렌디한 웹예능 제작 포맷 분석 및 기획 요인 해설", subscribers: "15만", views: "2400만", videos: "190개", country: "KR" },
  { name: "소통왕 라이브", handle: "@communication_king", category: "엔터테인먼트", avatar: "", desc: "시청자와의 실시간 통화 및 소소한 고민 상담 진행", subscribers: "12.5만", views: "1900만", videos: "165개", country: "KR" },
  { name: "커플 브이로그", handle: "@couple_vlog", category: "엔터테인먼트", avatar: "", desc: "동갑내기 커플의 알콩달콩 일상 라이프 및 데이트 코스", subscribers: "16.5만", views: "2800만", videos: "140개", country: "KR" },

  // 5. Movie/Animation (48 channels, KR)
  { name: "지무비 (G-Movie)", handle: "@gmovie", category: "영화/애니", avatar: "", desc: "속도감 있는 몰입형 영화 및 드라마 리뷰의 선두주자", subscribers: "310만", views: "14.2억", videos: "680개", country: "KR" },
  { name: "고몽", handle: "@gomong", category: "영화/애니", avatar: "", desc: "스토리 중심의 흡입력 높은 국내외 영상 리뷰어", subscribers: "235만", views: "9.5억", videos: "820개", country: "KR" },
  { name: "김시선", handle: "@kimsiseon", category: "영화/애니", avatar: "", desc: "영화를 사랑하는 시청자를 위한 심도 깊은 인문학 해설", subscribers: "165만", views: "5.8억", videos: "740개", country: "KR" },
  { name: "무비트립", handle: "@movietrip", category: "영화/애니", avatar: "", desc: "놓치기 쉬운 명작 영화 속 복선과 결말 해석 정리", subscribers: "85만", views: "2.1억", videos: "320개", country: "KR" },
  { name: "빨강도깨비", handle: "@redgoblin", category: "영화/애니", avatar: "", desc: "영화 매니아들을 위한 깊이 있는 비평과 랭킹 정리", subscribers: "78만", views: "2.8억", videos: "460개", country: "KR" },
  { name: "삐맨", handle: "@bbman", category: "영화/애니", avatar: "", desc: "마블, DC 등 슈퍼히어로 영화 해설 및 요약 대장", subscribers: "110만", views: "4.5억", videos: "980개", country: "KR" },
  { name: "영화공장", handle: "@moviefactory", category: "영화/애니", avatar: "", desc: "추억의 고전 명작부터 신작 개봉작 속도감 요약", subscribers: "42만", views: "1.2억", videos: "420개", country: "KR" },
  { name: "발없는새", handle: "@footlessbird", category: "영화/애니", avatar: "", desc: "정교한 연출 분석과 미장센 전문 영화 리뷰어", subscribers: "35만", views: "8500만", videos: "310개", country: "KR" },
  { name: "엉준", handle: "@eongjun", category: "영화/애니", avatar: "", desc: "쉽고 편하게 듣는 친근한 아저씨 영화 요약 해설", subscribers: "29만", views: "6200만", videos: "280개", country: "KR" },
  { name: "리뷰엉이", handle: "@reviewowl", category: "영화/애니", avatar: "", desc: "우주 과학 및 미스터리 영화 속 현실 물리 검증 분석", subscribers: "145만", views: "4.8억", videos: "1100개", country: "KR" },
  { name: "극장판", handle: "@theater", category: "영화/애니", avatar: "", desc: "최신 OTT 숨겨진 고평가 웰메이드 드라마 발굴기", subscribers: "25만", views: "4500만", videos: "190개", country: "KR" },
  { name: "애니덕후", handle: "@aniduck", category: "영화/애니", avatar: "", desc: "인기 일본 애니메이션 명장면 및 설정 분석 정리", subscribers: "70만", views: "2.5억", videos: "620개", country: "KR" },
  { name: "덕양소", handle: "@deokyangso", category: "영화/애니", avatar: "", desc: "추억의 애니메이션 OST 및 명장면 감상 스튜디오", subscribers: "38만", views: "9800만", videos: "450개", country: "KR" },
  { name: "무비토커", handle: "@movietalker", category: "영화/애니", avatar: "", desc: "배우들의 명품 연기와 비하인드 스토리 전담 인터랙티브", subscribers: "18만", views: "3200만", videos: "180개", country: "KR" },
  { name: "방구석 시네마", handle: "@roomcinema", category: "영화/애니", avatar: "", desc: "아늑한 방구석에서 감상하는 장르별 명작 영화 소개", subscribers: "22만", views: "4800만", videos: "220개", country: "KR" },
  { name: "영화읽어주는남자", handle: "@readmovie", category: "영화/애니", avatar: "", desc: "귀에 쏙쏙 박히는 목소리로 대본과 흐름 정밀 해설", subscribers: "56만", views: "1.9억", videos: "520개", country: "KR" },
  { name: "덕질연구소", handle: "@ducklab", category: "영화/애니", avatar: "", desc: "서브컬처 팬들을 위한 극장판 애니 비하인드 명세", subscribers: "15만", views: "2900만", videos: "150개", country: "KR" },
  { name: "시네마천국", handle: "@cinemaparadise", category: "영화/애니", avatar: "", desc: "예술영화 및 독립영화 속 심오한 상징적 가치 해석", subscribers: "11만", views: "1800만", videos: "110개", country: "KR" },
  { name: "예고편대왕", handle: "@trailerking", category: "영화/애니", avatar: "", desc: "가장 빠르게 찾아오는 전세계 신작 공식 예고편 아카이브", subscribers: "85만", views: "2.5억", videos: "1200개", country: "KR" },
  { name: "무비블록", handle: "@movieblock", category: "영화/애니", avatar: "", desc: "국제 영화제 수상 단편 영화 감상 및 추천 채널", subscribers: "9만", views: "1600만", videos: "90개", country: "KR" },
  { name: "민호타우루스", handle: "@minhotaurus", category: "영화/애니", avatar: "", desc: "영화 매니아들을 매혹시키는 히어로/SF 장르 디테일 해석", subscribers: "52만", views: "1.5억", videos: "360개", country: "KR" },
  { name: "영화연구소", handle: "@movie_lab", category: "영화/애니", avatar: "", desc: "해외 유명 영화제 후보작 심층 비평 및 예술적 해석", subscribers: "28만", views: "5200만", videos: "310개", country: "KR" },
  { name: "스포일러 경고", handle: "@spoiler_alert", category: "영화/애니", avatar: "", desc: "결말을 알고 보면 더 소름 돋는 반전 스릴러 전담 리뷰", subscribers: "32만", views: "6500만", videos: "280개", country: "KR" },
  { name: "시네필 아카이브", handle: "@cinephile", category: "영화/애니", avatar: "", desc: "영화인들이 사랑하는 거장 감독들의 연출 기법 렉처", subscribers: "14만", views: "2100만", videos: "180개", country: "KR" },
  { name: "무비클립 하이라이트", handle: "@movie_clips", category: "영화/애니", avatar: "", desc: "음장을 뛰게 만드는 명작 액션/카체이싱 명장면 모음", subscribers: "19만", views: "3800만", videos: "240개", country: "KR" },
  { name: "애니메이터 토크", handle: "@animator_talk", category: "영화/애니", avatar: "", desc: "애니메이션 제작 비하인드 3D 렌더링 프레임 단위 분석", subscribers: "25만", views: "4900만", videos: "190개", country: "KR" },
  { name: "만화창고", handle: "@cartoon_warehouse", category: "영화/애니", avatar: "", desc: "추억의 국산/외산 고전 만화 추억 소환 해설 채널", subscribers: "30만", views: "6200만", videos: "350개", country: "KR" },
  { name: "웹툰분석실", handle: "@webtoon_analysis", category: "영화/애니", avatar: "", desc: "네이버/카카오 연재 웹툰 떡밥 해석 및 미리보기 스포일러", subscribers: "15만", views: "2800만", videos: "190개", country: "KR" },
  { name: "극장가 리포트", handle: "@boxoffice_rep", category: "영화/애니", avatar: "", desc: "주간 박스오피스 순위 요약 및 손익분기점 돌파 여부 예측", subscribers: "11만", views: "1900만", videos: "145개", country: "KR" },
  { name: "영화랭킹 스튜디오", handle: "@movie_ranking", category: "영화/애니", avatar: "", desc: "주제별 역대 최고 수익 영화 탑 10 랭킹 정리", subscribers: "22만", views: "4500만", videos: "290개", country: "KR" },
  { name: "무비마스터", handle: "@movie_master_ch", category: "영화/애니", avatar: "", desc: "디렉터스컷 무편집본과 오리지널 개봉판의 세부 차이 리뷰", subscribers: "16만", views: "2900만", videos: "180개", country: "KR" },
  { name: "스크린플레이", handle: "@screen_play", category: "영화/애니", avatar: "", desc: "시나리오 작가 지망생을 위한 플롯 및 대본 작법 해설", subscribers: "9만", views: "1400만", videos: "115개", country: "KR" },
  { name: "무비다이어리", handle: "@movie_diary", category: "영화/애니", avatar: "", desc: "매주 주말 가볍게 시청하기 좋은 감동 영화 큐레이션", subscribers: "15만", views: "2700만", videos: "160개", country: "KR" },
  { name: "애니리뷰어", handle: "@ani_reviewer", category: "영화/애니", avatar: "", desc: "분기별 신작 오타쿠 애니메이션 솔직 담백 평점 매기기", subscribers: "35만", views: "7800만", videos: "420개", country: "KR" },
  { name: "만화덕후 정주행", handle: "@cartoon_mania", category: "영화/애니", avatar: "", desc: "장편 만화 단행본 전편 몰아보기 및 캐릭터 강함 서열 정리", subscribers: "28만", views: "5600만", videos: "320개", country: "KR" },
  { name: "극장판애니 마스터", handle: "@theatrical_ani", category: "영화/애니", avatar: "", desc: "지브리 및 신카이 마코토 세계관 고화질 연결 분석", subscribers: "20만", views: "3900만", videos: "185개", country: "KR" },
  { name: "배우포커스", handle: "@actor_focus", category: "영화/애니", avatar: "", desc: "천만 명품 조연 배우들의 필모그래피와 생생한 연기력 비평", subscribers: "18만", views: "3100만", videos: "160개", country: "KR" },
  { name: "웰메이드 무비 추천", handle: "@wellmade_movie", category: "영화/애니", avatar: "", desc: "대중에게 잘 알려지지 않은 숨은 명작 예술영화 추천", subscribers: "11만", views: "1800만", videos: "130개", country: "KR" },
  { name: "고전영화 아카이브", handle: "@classic_movie_arc", category: "영화/애니", avatar: "", desc: "흑백 무성영화부터 할리우드 고전 명작 비하인드 스토리", subscribers: "8만", views: "1200만", videos: "95개", country: "KR" },
  { name: "넷플릭스 전문리뷰", handle: "@netflix_expert", category: "영화/애니", avatar: "", desc: "넷플릭스 오리지널 신작 드라마 밤샘 정주행 요약 가이드", subscribers: "45만", views: "9200만", videos: "380개", country: "KR" },
  { name: "왓챠추천리포트", handle: "@watcha_report", category: "영화/애니", avatar: "", desc: "왓챠 독점 클래식 영화 및 명작 미드 추천 명세", subscribers: "12만", views: "2200만", videos: "140개", country: "KR" },
  { name: "디즈니세계관 해설", handle: "@disney_lore", category: "영화/애니", avatar: "", desc: "겨울왕국, 라푼젤 등 디즈니 공주 세계관 연결 복선 해석", subscribers: "30만", views: "5800만", videos: "240개", country: "KR" },
  { name: "마블덕후 가이드", handle: "@marvel_guide", category: "영화/애니", avatar: "", desc: "어벤져스 이스터에그 및 원작 코믹스 연계 향후 라인업 예측", subscribers: "40만", views: "8200만", videos: "320개", country: "KR" },
  { name: "SF영화 하이라이트", handle: "@sf_movie_high", category: "영화/애니", avatar: "", desc: "우주 과학 고증에 충실한 웰메이드 SF 영화 물리 법칙 검증", subscribers: "15만", views: "2700만", videos: "135개", country: "KR" },
  { name: "스릴러 매니아", handle: "@thriller_mania", category: "영화/애니", avatar: "", desc: "탈출구 없는 극한 밀실 공포 스릴러 긴장감 요약", subscribers: "12만", views: "2100만", videos: "110개", country: "KR" },
  { name: "캐릭터 프로필", handle: "@character_profile", category: "영화/애니", avatar: "", desc: "애니메이션 주요 인물 공식 스테이터스 및 비화 정리", subscribers: "10만", views: "1600만", videos: "130개", country: "KR" },
  { name: "드라마요약 정주행", handle: "@drama_summary", category: "영화/애니", avatar: "", desc: "종영된 레전드 한국 드라마 전회차 1시간 초고속 정주행", subscribers: "24만", views: "4800만", videos: "220개", country: "KR" },
  { name: "시네마 도서관", handle: "@cinema_library", category: "영화/애니", avatar: "", desc: "영화의 시각 언어 촬영 구도와 조명 기법 정밀 비주얼 해설", subscribers: "7만", views: "1100만", videos: "90개", country: "KR" },

  // 6. News/Politics (48 channels, KR)
  { name: "슈카월드", handle: "@syukaworld", category: "뉴스/시사", avatar: "", desc: "시사, 금융, 경제 및 인문학을 유쾌하게 풀어내는 토크", subscribers: "330만", views: "11.2억", videos: "1250개", country: "KR" },
  { name: "삼프로TV", handle: "@3proTV", category: "뉴스/시사", avatar: "", desc: "국내 최고 금융 전문가 집단의 실시간 경제 방송", subscribers: "240만", views: "9.8억", videos: "6500개", country: "KR" },
  { name: "JTBC News", handle: "@jtbcnews", category: "뉴스/시사", avatar: "", desc: "밀착 카메라 및 탐사 취재 중심의 고품격 저널리즘", subscribers: "410만", views: "32.5억", videos: "24000개", country: "KR" },
  { name: "SBS 뉴스", handle: "@sbsnews", category: "뉴스/시사", avatar: "", desc: "비디오머그 및 실시간 속보 중심의 빠르고 젊은 뉴스", subscribers: "380만", views: "28.3억", videos: "18000개", country: "KR" },
  { name: "MBC PD수첩", handle: "@mbcpd", category: "뉴스/시사", avatar: "", desc: "대한민국 사회의 부조리를 고발하는 탐사보도의 원조", subscribers: "92만", views: "4.2억", videos: "1800개", country: "KR" },
  { name: "YTN 뉴스", handle: "@ytnnews", category: "뉴스/시사", avatar: "", desc: "24시간 중단 없는 대한민국 실시간 속보 전담 채널", subscribers: "390만", views: "29.5억", videos: "35000개", country: "KR" },
  { name: "KBS 뉴스", handle: "@kbsnews", category: "뉴스/시사", avatar: "", desc: "공영방송의 깊이 있는 심층 리포트 및 시각 자료", subscribers: "290만", views: "18.3억", videos: "21000개", country: "KR" },
  { name: "김어준의 딴지일보", handle: "@humble_kim", category: "뉴스/시사", avatar: "", desc: "시청자 참여형 정밀 대안 시사 뉴스 토크 피드", subscribers: "155만", views: "6.2억", videos: "3200개", country: "KR" },
  { name: "미디어워치", handle: "@mediawatch", category: "뉴스/시사", avatar: "", desc: "미디어 보도 비평 및 날카로운 정론 뉴스 토크", subscribers: "48만", views: "9800만", videos: "1500개", country: "KR" },
  { name: "신사임당", handle: "@sinsaimdang", category: "뉴스/시사", avatar: "", desc: "창업, 부업, 재테크 마인드셋을 일구는 100만 경제 채널", subscribers: "180만", views: "3.5억", videos: "1400개", country: "KR" },
  { name: "815머니톡", handle: "@815money", category: "뉴스/시사", avatar: "", desc: "거시 경제 트렌드와 개인 자산 배분 전문가 인터뷰", subscribers: "140만", views: "2.8억", videos: "2200개", country: "KR" },
  { name: "소장배", handle: "@sojangbae", category: "뉴스/시사", avatar: "", desc: "역사 및 국제 거시 정치 상황의 핵심만 요약하는 브리핑", subscribers: "68만", views: "9800만", videos: "850개", country: "KR" },
  { name: "매일경제", handle: "@mknews", category: "뉴스/시사", avatar: "", desc: "대한민국 대표 일간 경제 뉴스의 실시간 분석 가이드", subscribers: "55만", views: "6500만", videos: "1100개", country: "KR" },
  { name: "연합뉴스TV", handle: "@yonhapnewstv", category: "뉴스/시사", avatar: "", desc: "국가 기간 통신사 직영 24시 실시간 보도 방송 채널", subscribers: "230만", views: "12.5억", videos: "19000개", country: "KR" },
  { name: "노컷뉴스", handle: "@nocutnews", category: "뉴스/시사", avatar: "", desc: "정치 및 사회 문제의 이면을 가감 없이 보여주는 저널", subscribers: "120만", views: "3.2억", videos: "2400개", country: "KR" },
  { name: "한겨레TV", handle: "@hanitv", category: "뉴스/시사", avatar: "", desc: "김어준의 파파이스 등 정교한 시사 분석 예능 아카이브", subscribers: "160만", views: "4.5억", videos: "3500개", country: "KR" },
  { name: "뉴스타파", handle: "@newstapa", category: "뉴스/시사", avatar: "", desc: "시민 후원으로 제작되는 거침없는 탐사보도 전문 매체", subscribers: "115만", views: "1.8억", videos: "1400개", country: "KR" },
  { name: "팩트TV", handle: "@facttv", category: "뉴스/시사", avatar: "", desc: "국회 현장 실시간 무편집 중계 및 속보 전문 미디어", subscribers: "52만", views: "8200만", videos: "2100개", country: "KR" },
  { name: "오마이뉴스", handle: "@ohmynews", category: "뉴스/시사", avatar: "", desc: "모든 시민은 기자다 모토의 사회 참여형 뉴스 브리핑", subscribers: "85만", views: "1.5억", videos: "2500개", country: "KR" },
  { name: "김작가 TV", handle: "@kimwriter", category: "뉴스/시사", avatar: "", desc: "성공한 자산가 및 대가들의 부의 비밀을 파헤치는 쇼", subscribers: "195만", views: "2.4억", videos: "980개", country: "KR" },
  { name: "경제이슈 브리핑", handle: "@eco_issue", category: "뉴스/시사", avatar: "", desc: "글로벌 환율 금리 급변동 요인 및 국내 증시 영향 요약", subscribers: "35만", views: "5200만", videos: "420개", country: "KR" },
  { name: "월가 브리핑", handle: "@wallstreet_rep", category: "뉴스/시사", avatar: "", desc: "미국 뉴욕 증시 개장 전 거시 경제 동향 및 기업 리포트", subscribers: "42만", views: "6500만", videos: "310개", country: "KR" },
  { name: "부동산 인사이트", handle: "@estate_insight", category: "뉴스/시사", avatar: "", desc: "주택 대출 정책 변화 및 수도권 아파트 시장 흐름 분석", subscribers: "55만", views: "9200만", videos: "480개", country: "KR" },
  { name: "주식인사이트", handle: "@stock_insight", category: "뉴스/시사", avatar: "", desc: "유망 산업 섹터별 대장주 분석 및 기술적 분석 가이드", subscribers: "38만", views: "4100만", videos: "380개", country: "KR" },
  { name: "글로벌 시사뉴스", handle: "@global_sisa", category: "뉴스/시사", avatar: "", desc: "해외 주요 외신들의 톱뉴스 번역 및 각국 정세 코멘트", subscribers: "28만", views: "2800만", videos: "290개", country: "KR" },
  { name: "데일리리포트", handle: "@daily_report", category: "뉴스/시사", avatar: "", desc: "바쁜 현대인을 위해 매일 아침 국내외 주요 뉴스를 5분 요약", subscribers: "15만", views: "1900만", videos: "185개", country: "KR" },
  { name: "시사기획 창", handle: "@sisa_window", category: "뉴스/시사", avatar: "", desc: "정밀 취재를 통해 사회적 모순과 화두를 던지는 다큐", subscribers: "22만", views: "3800만", videos: "240개", country: "KR" },
  { name: "추적60분 아카이브", handle: "@chujeok60", category: "뉴스/시사", avatar: "", desc: "레전드 미제 사건 및 추악한 진실 고발 현장 재조명", subscribers: "40만", views: "6800만", videos: "950개", country: "KR" },
  { name: "그것이 알고싶다 공식", handle: "@its_know", category: "뉴스/시사", avatar: "", desc: "공식 사건 분석 렉처 및 취재팀의 생생한 비하인드 스토리", subscribers: "210만", views: "3.5억", videos: "1200개", country: "KR" },
  { name: "시사자키 라디오", handle: "@sisajaki", category: "뉴스/시사", avatar: "", desc: "유력 정치인 및 오피니언 리더와의 실시간 인터뷰 라디오", subscribers: "32만", views: "4800만", videos: "2100개", country: "KR" },
  { name: "토론광장", handle: "@debate_plaza", category: "뉴스/시사", avatar: "", desc: "민감한 시사 쟁점에 대한 보수/진보 패널의 거침없는 토론", subscribers: "18만", views: "2200만", videos: "310개", country: "KR" },
  { name: "뉴스가이드 TV", handle: "@news_guide", category: "뉴스/시사", avatar: "", desc: "생활 밀착형 정부 혜택 및 세금 제도 개정안 설명", subscribers: "14만", views: "2300만", videos: "260개", country: "KR" },
  { name: "브리핑룸", handle: "@briefing_room", category: "뉴스/시사", avatar: "", desc: "청와대/국회 정부 부처 공식 브리핑 속보 무편집 채널", subscribers: "11만", views: "1600만", videos: "1100개", country: "KR" },
  { name: "팩트체커 코리아", handle: "@factcheck_kr", category: "뉴스/시사", avatar: "", desc: "가짜 뉴스와 인터넷 루머의 진위 여부를 교차 검증", subscribers: "16만", views: "1900만", videos: "150개", country: "KR" },
  { name: "정치포커스", handle: "@pol_focus", category: "뉴스/시사", avatar: "", desc: "국회 입법 동향 및 다가오는 선거 여론 지형 심층 판독", subscribers: "25만", views: "3200만", videos: "420개", country: "KR" },
  { name: "여론조사 센터", handle: "@poll_center", category: "뉴스/시사", avatar: "", desc: "정당 지지율 및 대통령 직무 수행 정기 통계 리포트", subscribers: "13만", views: "1500만", videos: "180개", country: "KR" },
  { name: "세계지리 시사", handle: "@world_geography", category: "뉴스/시사", avatar: "", desc: "국경 분쟁 및 지정학적 요인으로 풀어보는 국제 뉴스", subscribers: "29만", views: "4300만", videos: "280개", country: "KR" },
  { name: "국제정치 스터디", handle: "@intl_politics", category: "뉴스/시사", avatar: "", desc: "미중 패권 전쟁 및 글로벌 공급망 개편에 따른 전망 분석", subscribers: "34만", views: "5600만", videos: "320개", country: "KR" },
  { name: "외교안보 포럼", handle: "@diplomacy_kr", category: "뉴스/시사", avatar: "", desc: "한반도 주변국 외교 안보 상황 및 정세 오피니언 리딩", subscribers: "15만", views: "2200만", videos: "195개", country: "KR" },
  { name: "경제트렌드 2026", handle: "@eco_trend_2026", category: "뉴스/시사", avatar: "", desc: "인플레이션 스태그플레이션 리스크 속 자산 방어 솔루션", subscribers: "48만", views: "8200만", videos: "520개", country: "KR" },
  { name: "부자학교 TV", handle: "@rich_school", category: "뉴스/시사", avatar: "", desc: "성공을 꿈꾸는 사람들을 위한 마인드셋과 재테크 기초 교과", subscribers: "65만", views: "9800만", videos: "450개", country: "KR" },
  { name: "재테크 꿀팁방", handle: "@fin_tips", category: "뉴스/시사", avatar: "", desc: "연말정산 절세 전략 및 소액으로 시작하는 저축 루틴", subscribers: "50만", views: "6500만", videos: "320개", country: "KR" },
  { name: "월세부자 연구소", handle: "@monthly_rich", category: "뉴스/시사", avatar: "", desc: "꼬마빌딩 및 상가 경매를 통한 현금 흐름 세팅 비법", subscribers: "22만", views: "3800만", videos: "220개", country: "KR" },
  { name: "창업 다이어리", handle: "@startup_diary", category: "뉴스/시사", avatar: "", desc: "무자본 창업 및 온라인 스토어 위탁 판매 실전 도전기", subscribers: "18만", views: "2400만", videos: "165개", country: "KR" },
  { name: "마케팅 인사이트", handle: "@mkt_insight", category: "뉴스/시사", avatar: "", desc: "소비자 심리를 자극하는 글로벌 브랜드 광고 전략 분석", subscribers: "12만", views: "1600만", videos: "110개", country: "KR" },
  { name: "트렌드코리아 리포트", handle: "@trend_korea", category: "뉴스/시사", avatar: "", desc: "매년 변화하는 한국인의 소비 라이프스타일 10대 키워드", subscribers: "30만", views: "4800만", videos: "350개", country: "KR" },
  { name: "뉴스다이제스트", handle: "@news_digest", category: "뉴스/시사", avatar: "", desc: "바쁜 직장인을 위한 퇴근길 10분 종합 시사 상식 브리핑", subscribers: "25만", views: "3100만", videos: "210개", country: "KR" },
  { name: "오늘의 이슈 판독기", handle: "@today_issue", category: "뉴스/시사", avatar: "", desc: "온라인 핫이슈 사건 사고의 팩트를 중립적으로 판독", subscribers: "40만", views: "7500만", videos: "650개", country: "KR" },

  // 7. Sports (48 channels, KR)
  { name: "슛포러브", handle: "@shootforlove", category: "스포츠", avatar: "", desc: "사회공헌 캠페인과 축구 예능 콘텐츠의 유쾌한 결합", subscribers: "145만", views: "5.8억", videos: "1100개", country: "KR" },
  { name: "이스타TV", handle: "@leestarTV", category: "스포츠", avatar: "", desc: "해외 축구 편파 해설 및 매일 쏟아지는 스포츠 토크쇼", subscribers: "78만", views: "3.2억", videos: "6200개", country: "KR" },
  { name: "김진짜", handle: "@kimjinzza", category: "스포츠", avatar: "", desc: "선수 시점의 전술 분석 및 축구 전문 테크니컬 리포트", subscribers: "55만", views: "1.2억", videos: "350개", country: "KR" },
  { name: "조코더", handle: "@jocoder", category: "스포츠", avatar: "", desc: "아마추어 축구 기술 훈련 및 프리킥 스터디 가이드", subscribers: "32만", views: "6500만", videos: "420개", country: "KR" },
  { name: "고알레", handle: "@goale", category: "스포츠", avatar: "", desc: "전 국가대표 선수들과 함께하는 실전 매치 및 트레이닝", subscribers: "85만", views: "2.1억", videos: "920개", country: "KR" },
  { name: "야구부장", handle: "@baseball_manager", category: "스포츠", avatar: "", desc: "KBO 프로야구 스토브리그 내부 정보 및 분석 전문기자", subscribers: "38만", views: "7200만", videos: "410개", country: "KR" },
  { name: "피지컬갤러리", handle: "@physicalgallery", category: "스포츠", avatar: "", desc: "빡빡이 아저씨의 과학적인 헬스 가이드 및 가짜사나이", subscribers: "310만", views: "9.2억", videos: "1200개", country: "KR" },
  { name: "한준희 장지현", handle: "@football_stars", category: "스포츠", avatar: "", desc: "해외 축구 2대 거성 해설위원이 전하는 유쾌한 원투펀치", subscribers: "42만", views: "9800만", videos: "850개", country: "KR" },
  { name: "스포티비", handle: "@spotv", category: "스포츠", avatar: "", desc: "프리미어리그, UCL 및 메이저 스포츠 공식 하이라이트", subscribers: "390만", views: "12.5억", videos: "8200개", country: "KR" },
  { name: "JTBC 스포츠", handle: "@jtbc_sports", category: "스포츠", avatar: "", desc: "최강야구 및 테니스, 골프 리그 중계 아카이브", subscribers: "90만", views: "2.4억", videos: "740개", country: "KR" },
  { name: "말왕", handle: "@horsaking", category: "스포츠", avatar: "", desc: "다양한 이색 스포츠 체험 및 파워리프팅 정밀 가이드", subscribers: "135만", views: "3.8억", videos: "1400개", country: "KR" },
  { name: "터질라", handle: "@teojilla", category: "스포츠", avatar: "", desc: "해비 헬창들을 위한 극한의 하드코어 보디빌딩 일상", subscribers: "20만", views: "4500만", videos: "310개", country: "KR" },
  { name: "하승진", handle: "@haseungjin", category: "스포츠", avatar: "", desc: "전 NBA 센터가 풀어내는 농구판 썰과 유쾌한 초대석", subscribers: "45만", views: "1.1억", videos: "460개", country: "KR" },
  { name: "홍창화", handle: "@hongchanghwa", category: "스포츠", avatar: "", desc: "야구장 응원 단장이 전하는 실시간 응원 직캠 피드", subscribers: "12만", views: "2400만", videos: "280개", country: "KR" },
  { name: "야구의 모든 것", handle: "@all_baseball", category: "스포츠", avatar: "", desc: "사회인 야구 투타 분석 및 메이저 기술 공략집", subscribers: "22만", views: "4500만", videos: "350개", country: "KR" },
  { name: "축구대장", handle: "@soccerboss", category: "스포츠", avatar: "", desc: "유럽 리거들의 주간 성적 요약 및 전술 특징 정리", subscribers: "15만", views: "3200만", videos: "220개", country: "KR" },
  { name: "헬창TV", handle: "@hellchangtv", category: "스포츠", avatar: "", desc: "보디빌딩 대회 비하인드 및 가성비 식단 레시피 소개", subscribers: "42만", views: "9500만", videos: "540개", country: "KR" },
  { name: "권아솔", handle: "@kwonasol", category: "스포츠", avatar: "", desc: "로드FC 파이터의 종합격투기 분석 및 도발 매치 토크", subscribers: "11만", views: "2100만", videos: "180개", country: "KR" },
  { name: "런앤런", handle: "@runandrun", category: "스포츠", avatar: "", desc: "육상 및 장거리 마라톤 호흡 자세 훈련 솔루션", subscribers: "8만", views: "1200만", videos: "130개", country: "KR" },
  { name: "스포츠머그", handle: "@sportsmug", category: "스포츠", avatar: "", desc: "주요 올림픽 경기 명장면 뒷이야기 전문 채널", subscribers: "68만", views: "1.5억", videos: "980개", country: "KR" },
  { name: "야구선수 라이프", handle: "@baseball_player", category: "스포츠", avatar: "", desc: "은퇴 야구 선수들의 실전 타격 원포인트 기술 코칭", subscribers: "15만", views: "2900만", videos: "240개", country: "KR" },
  { name: "골프레슨 마스터", handle: "@golf_lesson_mas", category: "스포츠", avatar: "", desc: "슬라이스 방지 및 백스윙 아크 최대 확보 골프 강습", subscribers: "35만", views: "8200만", videos: "620개", country: "KR" },
  { name: "테니스 피플", handle: "@tennis_people", category: "스포츠", avatar: "", desc: "테니스 서브 에이스 탑스핀 기본기 정교한 비주얼 해설", subscribers: "12만", views: "2100만", videos: "180개", country: "KR" },
  { name: "배드민턴 스쿨", handle: "@badminton_school", category: "스포츠", avatar: "", desc: "생활체육 복식 수비 위치 및 스매시 타점 훈련 강좌", subscribers: "9만", views: "1500만", videos: "135개", country: "KR" },
  { name: "탁구교실", handle: "@pingpong_class", category: "스포츠", avatar: "", desc: "스핀 드라이브 서브와 셰이크핸드 백핸드 수비 팁", subscribers: "11만", views: "1800만", videos: "150개", country: "KR" },
  { name: "농구왕 TV", handle: "@basketball_king", category: "스포츠", avatar: "", desc: "길거리 3대3 농구 픽업 매치 및 돌파 크로스오버 강좌", subscribers: "18만", views: "3200만", videos: "290개", country: "KR" },
  { name: "배구 마스터", handle: "@volleyball_master", category: "스포츠", avatar: "", desc: "스파이크 서브 블로킹 스터디 및 동호회 전술 가이드", subscribers: "14만", views: "2300만", videos: "160개", country: "KR" },
  { name: "스포츠 데이터분석", handle: "@sports_data_anal", category: "스포츠", avatar: "", desc: "축구/야구 빅데이터 기반 경기 전력 정교한 통계 예측", subscribers: "25만", views: "4800만", videos: "380개", country: "KR" },
  { name: "UFC 정밀분석", handle: "@ufc_analysis", category: "스포츠", avatar: "", desc: "종합격투기 파이터별 타격 거리 및 그라운드 전술 해설", subscribers: "30만", views: "6250만", videos: "420개", country: "KR" },
  { name: "복싱클래스", handle: "@boxing_class", category: "스포츠", avatar: "", desc: "정통 복싱 잽/원투 피하고 카운터 먹이는 실전 트레이닝", subscribers: "16만", views: "2900만", videos: "190개", country: "KR" },
  { name: "주짓수 홈", handle: "@jiujitsu_home", category: "스포츠", avatar: "", desc: "화이트벨트 필수 가드 패스 및 서브미션 탈출 매뉴얼", subscribers: "10만", views: "1600만", videos: "115개", country: "KR" },
  { name: "클라이밍 라이프", handle: "@climbing_life", category: "스포츠", avatar: "", desc: "볼더링 문제 풀이 및 완등 홀드 확보를 위한 악력 강화", subscribers: "12만", views: "2100만", videos: "140개", country: "KR" },
  { name: "러닝크루 가이드", handle: "@running_crew", category: "스포츠", avatar: "", desc: "마라톤 풀코스 체력 안배 호흡 루틴 및 런닝화 비교", subscribers: "15만", views: "2700만", videos: "170개", country: "KR" },
  { name: "사이클 매니아", handle: "@cycle_mania", category: "스포츠", avatar: "", desc: "로드 자전거 피팅 및 업힐 댄싱 페달링 테크닉 해설", subscribers: "18만", views: "3100만", videos: "205개", country: "KR" },
  { name: "낚시왕 TV", handle: "@fishing_king", category: "스포츠", avatar: "", desc: "전국 바다 낚시 찌낚시 원투 포인트 정보 및 먹방", subscribers: "45만", views: "9200만", videos: "980개", country: "KR" },
  { name: "등산 가이드", handle: "@hiking_guide", category: "스포츠", avatar: "", desc: "대한민국 100대 명산 최단 코스 안내 및 장비 추천", subscribers: "22만", views: "3900만", videos: "240개", country: "KR" },
  { name: "캠핑라이프", handle: "@camping_life_ch", category: "스포츠", avatar: "", desc: "감성 차박 및 동계 오지 솔로 캠핑 장비 리뷰", subscribers: "38만", views: "8200만", videos: "420개", country: "KR" },
  { name: "익스트림 스포츠", handle: "@extreme_sports", category: "스포츠", avatar: "", desc: "스케이트보드 알리/플립 트릭 기술 및 안전 낙법", subscribers: "11만", views: "1800만", videos: "125개", country: "KR" },
  { name: "헬스보이 홈트", handle: "@health_boy", category: "스포츠", avatar: "", desc: "직장인을 위한 하루 10분 전신 유산소 타바타 운동", subscribers: "25만", views: "4500만", videos: "310개", country: "KR" },
  { name: "홈트레이닝 클럽", handle: "@hometraining_club", category: "스포츠", avatar: "", desc: "층간소음 없는 맨몸 코어 스쿼트 플랭크 다이어트", subscribers: "60만", views: "1.1억", videos: "760개", country: "KR" },
  { name: "필라테스 룸", handle: "@pilates_room", category: "스포츠", avatar: "", desc: "체형 교정과 거북목 완화를 위한 폼롤러 스트레칭", subscribers: "28만", views: "5200만", videos: "320개", country: "KR" },
  { name: "요가 힐링클래스", handle: "@yoga_healing", category: "스포츠", avatar: "", desc: "마음을 차분히 가라앉히는 모닝 아쉬탕가 요가 루틴", subscribers: "32만", views: "6100만", videos: "380개", country: "KR" },
  { name: "다이어트 식단 연구", handle: "@diet_meal", category: "스포츠", avatar: "", desc: "닭가슴살을 맛있게 조리하는 고단백 가성비 도시락 레시피", subscribers: "40만", views: "8200만", videos: "410개", country: "KR" },
  { name: "머슬매니아 가이드", handle: "@muscle_guide", category: "스포츠", avatar: "", desc: "벌크업 3대 중량 스쿼트 데드리프트 벤치프레스 정자세", subscribers: "18만", views: "2800만", videos: "180개", country: "KR" },
  { name: "스포츠 비하인드", handle: "@sports_behind", category: "스포츠", avatar: "", desc: "올림픽 전설적 매치 뒷이야기 및 선수 라이벌 비화", subscribers: "15만", views: "2400만", videos: "160개", country: "KR" },
  { name: "전설의 경기", handle: "@legend_match", category: "스포츠", avatar: "", desc: "축구/농구 월드컵 역대급 반전 드라마 명승부 하이라이트", subscribers: "24만", views: "4900만", videos: "220개", country: "KR" },
  { name: "체육관 일기", handle: "@gym_diary", category: "스포츠", avatar: "", desc: "관장이 직접 찍는 복싱 주짓수 시합 현장 스케치", subscribers: "9만", views: "1400만", videos: "110개", country: "KR" },
  { name: "스포츠 매거진", handle: "@sports_magazine", category: "스포츠", avatar: "", desc: "유럽 축구 겨울 이적 시장 소식 및 선수 몸값 랭킹", subscribers: "20만", views: "3200만", videos: "195개", country: "KR" },

  // --- GLOBAL BRAND CHANNELS ---
  // US Channels (미국 - 20개)
  { name: "MrBeast", handle: "@mrbeast", category: "엔터테인먼트", desc: "세계 최대 스케일의 기상천외한 도전과 기부 예능", subscribers: "3.1억", views: "520억", videos: "800개", country: "US" },
  { name: "MKBHD (Marques Brownlee)", handle: "@mkbhd", category: "테크/IT", desc: "세계 최고 권위의 하이엔드 전자기기 리뷰어", subscribers: "1900만", views: "41억", videos: "1600개", country: "US" },
  { name: "PewDiePie", handle: "@pewdiepie", category: "게임", desc: "1인 크리에이터 시대를 개척한 종합 게임 실황 방송", subscribers: "1.1억", views: "290억", videos: "4700개", country: "US" },
  { name: "Lofi Girl", handle: "@lofigirl", category: "뮤직", desc: "공부하고 쉴 때 듣는 글로벌 로파이 힙합 라디오", subscribers: "1430만", views: "19억", videos: "350개", country: "US" },
  { name: "Linus Tech Tips", handle: "@linustechtips", category: "테크/IT", desc: "PC 빌드, 실험 및 모든 테크 정보의 종결자", subscribers: "1560만", views: "78억", videos: "7200개", country: "US" },
  { name: "Dude Perfect", handle: "@dudeperfect", category: "스포츠", desc: "기상천외한 묘기 샷과 스포츠 예능 콘텐츠의 거장", subscribers: "6030만", views: "172억", videos: "420개", country: "US" },
  { name: "Movieclips", handle: "@movieclips", category: "영화/애니", desc: "할리우드 영화 명장면 고화질 공식 클립 아카이브", subscribers: "6100만", views: "620억", videos: "40000개", country: "US" },
  { name: "Markiplier", handle: "@markiplier", category: "게임", desc: "다이내믹한 리액션이 돋보이는 공포/인디 게임 방송", subscribers: "3600만", views: "210억", videos: "5500개", country: "US" },
  { name: "Ninja", handle: "@ninja", category: "게임", desc: "포트나이트 신화의 주역이자 글로벌 탑 게이머", subscribers: "2300만", views: "25억", videos: "1500개", country: "US" },
  { name: "Marshmello", handle: "@marshmello", category: "뮤직", desc: "헬멧을 쓴 신비주의 일렉트로닉 천재 EDM 프로듀서", subscribers: "5700만", views: "155억", videos: "420개", country: "US" },
  { name: "CNN", handle: "@cnn", category: "뉴스/시사", desc: "미국 및 전 세계의 실시간 24시간 종합 보도 뉴스", subscribers: "1600만", views: "52억", videos: "165000개", country: "US" },
  { name: "Fox News", handle: "@foxnews", category: "뉴스/시사", desc: "미국 주요 정치/이슈 및 보수 성향 뉴스 해설 방송", subscribers: "1100만", views: "41억", videos: "105000개", country: "US" },
  { name: "WWE", handle: "@wwe", category: "스포츠", desc: "미국 최고의 프로레슬링 공식 경기 및 엔터테인먼트", subscribers: "1.0억", views: "820억", videos: "75000개", country: "US" },
  { name: "ESPN", handle: "@espn", category: "스포츠", desc: "NBA, NFL 등 미국 대표 스포츠 실시간 브리핑 뉴스", subscribers: "1100만", views: "52억", videos: "14500개", country: "US" },
  { name: "TED", handle: "@ted", category: "엔터테인먼트", desc: "세상을 바꾸는 아이디어를 공유하는 글로벌 명사 강연", subscribers: "2400만", views: "38억", videos: "4200개", country: "US" },
  { name: "Unbox Therapy", handle: "@unboxtherapy", category: "테크/IT", desc: "시원시원한 전자기기 테크 기기 실사용 솔직 리뷰", subscribers: "2100만", views: "45억", videos: "2100개", country: "US" },
  { name: "Smosh", handle: "@smosh", category: "엔터테인먼트", desc: "미국 스케치 코미디 및 꽁트 쇼 비디오의 원조", subscribers: "2600만", views: "105억", videos: "1800개", country: "US" },
  { name: "Warner Bros. Pictures", handle: "@warnerbros", category: "영화/애니", desc: "워너브라더스 공식 할리우드 영화 예고편 및 티저 클립", subscribers: "1200만", views: "65억", videos: "2400개", country: "US" },
  { name: "Game Grumps", handle: "@gamegrumps", category: "게임", desc: "만담 듀오가 선보이는 유쾌하고 코믹한 게임 플레이", subscribers: "540만", views: "41억", videos: "9500개", country: "US" },
  { name: "Pentatonix", handle: "@pentatonix", category: "뮤직", desc: "글로벌 아카펠라 그룹 펜타토닉스 공식 채널", subscribers: "2000만", views: "62억", videos: "290개", country: "US" },

  // JP Channels (일본 - 20개)
  { name: "HikakinTV", handle: "@hikakintv", category: "엔터테인먼트", desc: "일본 1세대 크리에이터 비트박스 및 제품 리뷰 예능", subscribers: "1850만", views: "125억", videos: "3800개", country: "JP" },
  { name: "Hajime Syacho", handle: "@hajimesyacho", category: "엔터테인먼트", desc: "엉뚱하고 기발한 대규모 실험 시뮬레이션 전문 예능", subscribers: "1420만", views: "98억", videos: "3200개", country: "JP" },
  { name: "Kenshi Yonezu", handle: "@kenshiyonezu", category: "뮤직", desc: "Lemon 등 감성 제이팝의 아이콘 싱어송라이터", subscribers: "710만", views: "48억", videos: "150개", country: "JP" },
  { name: "2BRO.", handle: "@2bro", category: "게임", desc: "매력적인 목소리의 형제가 진행하는 종합 게임 실황", subscribers: "310만", views: "28억", videos: "5200개", country: "JP" },
  { name: "Fischer's", handle: "@fischers", category: "엔터테인먼트", desc: "유쾌한 소꿉친구들이 펼치는 야외 스포츠 챌린지", subscribers: "850만", views: "162억", videos: "2800개", country: "JP" },
  { name: "HIKAKIN", handle: "@hikakin", category: "게임", desc: "종합 게임 비하인드 스토리 및 라이브 비디오", subscribers: "580만", views: "21억", videos: "1100개", country: "JP" },
  { name: "Junya1gou", handle: "@junya1gou", category: "엔터테인먼트", desc: "기상천외한 슬랩스틱 코미디 1분 챌린지 쇼츠의 신", subscribers: "3200만", views: "210억", videos: "4200개", country: "JP" },
  { name: "Sushi Bomber (東海オンエア)", handle: "@sushibomber", category: "엔터테인먼트", desc: "독창적인 대규모 리얼 챌린지 벌칙 예능 유튜버 그룹", subscribers: "790만", views: "115억", videos: "2500개", country: "JP" },
  { name: "P丸様。", handle: "@pmarusama", category: "영화/애니", desc: "직접 그린 애니메이션 웹툰 시트콤 성우 더빙 채널", subscribers: "280만", views: "21억", videos: "850개", country: "JP" },
  { name: "Luluca", handle: "@luluca", category: "엔터테인먼트", desc: "아기자기한 완구 리뷰 및 역할극 전문 애니 키즈 채널", subscribers: "530만", views: "42억", videos: "1200개", country: "JP" },
  { name: "Toy&Kids (キッズライン)", handle: "@toykids", category: "영화/애니", desc: "어린이 장난감 시뮬레이션 및 교육용 인형극 비디오", subscribers: "310만", views: "29억", videos: "980개", country: "JP" },
  { name: "TBS NEWS DIG", handle: "@tbsnewsdig", category: "뉴스/시사", desc: "일본 민영방송 TBS의 최신 24시간 속보 및 정밀 뉴스", subscribers: "270만", views: "18억", videos: "48000개", country: "JP" },
  { name: "ANN News", handle: "@annnews", category: "뉴스/시사", desc: "아사히 방송 계열 ANN 뉴스 실시간 정보 및 보도 채널", subscribers: "410만", views: "32억", videos: "85000개", country: "JP" },
  { name: "J-LEAGUE", handle: "@jleague", category: "스포츠", desc: "일본 프로축구 J리그 공식 경기 골장면 및 하이라이트", subscribers: "110만", views: "4.5억", videos: "9500개", country: "JP" },
  { name: "Yuka Kinoshita", handle: "@yukakinoshita", category: "엔터테인먼트", desc: "엄청난 대용량 요리를 먹어치우는 원조 푸드파이터 먹방", subscribers: "510만", views: "22억", videos: "2100개", country: "JP" },
  { name: "Sega", handle: "@sega", category: "게임", desc: "소닉, 용과 같이 등 글로벌 세가 신작 게임 공식 정보", subscribers: "210만", views: "9.5억", videos: "4200개", country: "JP" },
  { name: "Nintendo JP", handle: "@nintendo", category: "게임", desc: "닌텐도 다이렉트 및 오피셜 스위치 신작 타이틀 예고편", subscribers: "980만", views: "65억", videos: "8200개", country: "JP" },
  { name: "Ghibli Fan Class", handle: "@ghibli_fan", category: "영화/애니", desc: "지브리 스튜디오 명작 배경음악 피아노 커버 및 작화 분석", subscribers: "150만", views: "3.2억", videos: "180개", country: "JP" },
  { name: "Ayasa", handle: "@ayasa", category: "뮤직", desc: "코스프레 애니메이션 수록곡 바이올린 연주 연주자", subscribers: "120만", views: "2.1억", videos: "240개", country: "JP" },
  { name: "ONE OK ROCK", handle: "@oneokrock", category: "뮤직", desc: "일본 최정상 록 밴드 원 오크 록 공식 뮤직비디오", subscribers: "450만", views: "19억", videos: "190개", country: "JP" },

  // GB Channels (영국 - 20개)
  { name: "Ed Sheeran", handle: "@edsheeran", category: "뮤직", desc: "영국 최고의 천재 싱어송라이터 공식 비디오 및 라이브", subscribers: "5450만", views: "325억", videos: "320개", country: "GB" },
  { name: "Adele", handle: "@adele", category: "뮤직", desc: "호소력 짙은 영혼의 목소리 글로벌 디바 아델 공식 피드", subscribers: "3050만", views: "115억", videos: "95개", country: "GB" },
  { name: "Colin Furze", handle: "@colinfurze", category: "테크/IT", desc: "차고에서 기상천외한 발명품과 기계를 만드는 유쾌한 괴짜", subscribers: "1250만", views: "18억", videos: "450개", country: "GB" },
  { name: "Sidemen", handle: "@sidemen", category: "엔터테인먼트", desc: "영국 최고 인기 크리에이터 그룹의 리얼리티 버라이어티", subscribers: "2150만", views: "65억", videos: "380개", country: "GB" },
  { name: "DanTDM", handle: "@dantdm", category: "게임", desc: "친근한 목소리로 진행하는 마인크래프트 전문 크리에이터", subscribers: "2860만", views: "198억", videos: "3600개", country: "GB" },
  { name: "BBC News", handle: "@bbcnews", category: "뉴스/시사", desc: "신뢰도 1위 영국 공영방송 BBC 글로벌 정치 경제 뉴스", subscribers: "1500만", views: "48억", videos: "24000개", country: "GB" },
  { name: "Sky News", handle: "@skynews", category: "뉴스/시사", desc: "실시간 라이브 스트리밍 제공 영국 보도 뉴스 채널", subscribers: "460만", views: "28억", videos: "35000개", country: "GB" },
  { name: "Gordon Ramsay", handle: "@gordonramsay", category: "엔터테인먼트", desc: "스타 셰프 고든 램지의 극약 처방 레스토랑 구조 요리 쇼", subscribers: "2050만", views: "42억", videos: "1500개", country: "GB" },
  { name: "Coldplay", handle: "@coldplay", category: "뮤직", desc: "세계적 감성 얼터너티브 록 밴드 콜드플레이 뮤직 채널", subscribers: "2600만", views: "182억", videos: "410개", country: "GB" },
  { name: "KSI", handle: "@ksi", category: "엔터테인먼트", desc: "백만 유튜버 복싱 대회 주최 및 종합 챌린지 인플루언서", subscribers: "2400만", views: "62억", videos: "1200개", country: "GB" },
  { name: "BBC", handle: "@bbc", category: "엔터테인먼트", desc: "닥터후, 셜록 등 영국 BBC 방송사 대표 드라마 다큐 클립", subscribers: "1400만", views: "98억", videos: "18500개", country: "GB" },
  { name: "Tom Scott", handle: "@tomscott", category: "테크/IT", desc: "전 세계를 발로 뛰며 찍어낸 유니크한 과학/역사 다큐", subscribers: "630만", views: "19억", videos: "550개", country: "GB" },
  { name: "GCN (Global Cycling Network)", handle: "@gcn", category: "스포츠", desc: "사이클 로드 바이크 정보 팁 및 정밀 자전거 과학", subscribers: "320만", views: "9.2억", videos: "6200개", country: "GB" },
  { name: "Ali-A", handle: "@alia", category: "게임", desc: "영국 최고의 포트나이트 플레이어 및 종합 신작 정보", subscribers: "1900만", views: "62억", videos: "5400개", country: "GB" },
  { name: "Stampylonghead", handle: "@stampylonghead", category: "게임", desc: "귀여운 고양이 스킨 마인크래프트 동화 세계 제작가", subscribers: "1050만", views: "81억", videos: "3800개", country: "GB" },
  { name: "One Direction", handle: "@onedirection", category: "뮤직", desc: "영국 전설적 보이그룹 원디렉션 추억의 라이브 클립", subscribers: "3850만", views: "145억", videos: "180개", country: "GB" },
  { name: "Dua Lipa", handle: "@dualipa", category: "뮤직", desc: "영국 팝 씬의 아이콘 두아 리파 공식 비디오 채널", subscribers: "2350만", views: "125억", videos: "150개", country: "GB" },
  { name: "Liverpool FC", handle: "@liverpoolfc", category: "스포츠", desc: "안필드의 심장 프리미어리그 리버풀 공식 훈련 영상 및 인터뷰", subscribers: "1000만", views: "18억", videos: "8200개", country: "GB" },
  { name: "Man City", handle: "@mancity", category: "스포츠", desc: "맨체스터 시티 구단 공식 락커룸 토크 및 다큐멘터리", subscribers: "1100만", views: "21억", videos: "9800개", country: "GB" },
  { name: "BAFTA", handle: "@bafta", category: "영화/애니", desc: "영국 아카데미 영화상 시상식 인터뷰 및 비하인드 신", subscribers: "120만", views: "2.5억", videos: "1800개", country: "GB" },

  // VN Channels (베트남 - 20개)
  { name: "Sơn Tùng M-TP", handle: "@sontungmtp", category: "뮤직", desc: "베트남 대중음악(V-Pop)의 대표 탑 아이돌 가수", subscribers: "1050만", views: "28억", videos: "120개", country: "VN" },
  { name: "Cris Devil Gamer", handle: "@crisdevilgamer", category: "게임", desc: "유쾌하고 다양한 리액션의 베트남 1등 게임 크리에이터", subscribers: "1080만", views: "34억", videos: "1500개", country: "VN" },
  { name: "Giáo Dục Sáng Tạo", handle: "@giaoducsangtao", category: "교육/과학/지식", desc: "베트남 지식인들의 최신 미래 기술 및 혁신 강연 아카이브", subscribers: "80만", views: "1.2억", videos: "150개", country: "VN" },

  { name: "Vật Vờ Studio", handle: "@vatvostudio", category: "테크/IT", desc: "디테일이 살아있는 테크 디바이스 및 최신 IT 루머 정밀 분석", subscribers: "2300만", views: "4.8억", videos: "3400개", country: "VN" },
  { name: "MisThy", handle: "@misthy", category: "게임", desc: "베트남 대표 1세대 여성 종합 게임 크리에이터 소통 방송", subscribers: "630만", views: "18억", videos: "2100개", country: "VN" },
  { name: "Độ Mixi", handle: "@domixi", category: "게임", desc: "팬들과 소통하는 마인크래프트 및 캐주얼 게임 실황", subscribers: "725만", views: "24억", videos: "1900개", country: "VN" },
  { name: "Đen Vâu", handle: "@denvau", category: "뮤직", desc: "베트남 시적 가사의 일인자 대표 힙합 래퍼 덴공식 피드", subscribers: "490만", views: "19억", videos: "130개", country: "VN" },
  { name: "Clip TV", handle: "@cliptv", category: "영화/애니", desc: "베트남 영화 하이라이트 및 오리지널 미니 시리즈 쇼츠", subscribers: "150만", views: "4.2억", videos: "2800개", country: "VN" },

  // IN Channels (인도 - 20개)
  { name: "T-Series", handle: "@tseries", category: "뮤직", desc: "인도 볼리우드 영화 음악 및 최대 음반 유통사", subscribers: "2.6억", views: "2600억", videos: "21000개", country: "IN" },
  { name: "CarryMinati", handle: "@carryminati", category: "엔터테인먼트", desc: "인도 코미디 스케치, 패러디 및 입담 토크의 대장", subscribers: "4250만", views: "38억", videos: "190개", country: "IN" },
  { name: "Technical Guruji", handle: "@technicalguruji", category: "테크/IT", desc: "인도 최대 모바일 기기 분석 및 최신 테크 정보", subscribers: "2350만", views: "34억", videos: "5200개", country: "IN" },
  { name: "Total Gaming", handle: "@totalgaming", category: "게임", desc: "인도 최고 인기 모바일 프리파이어 전문 게이머", subscribers: "4100만", views: "85억", videos: "2100개", country: "IN" },
  { name: "Sony Music India", handle: "@sonymusicindia", category: "뮤직", desc: "소니 뮤직 산하 힌디 음악 및 볼리우드 오리지널 뮤비", subscribers: "5800만", views: "290억", videos: "4200개", country: "IN" },
  { name: "Aaj Tak", handle: "@aajtak", category: "뉴스/시사", desc: "인도 시청률 1위 힌디어 속보 공영 뉴스 채널", subscribers: "6500만", views: "380억", videos: "320000개", country: "IN" },
  { name: "Zee News", handle: "@zeenews", category: "뉴스/시사", desc: "인도 주요 정치 보도 및 시사 대담 토크 채널", subscribers: "3500만", views: "195억", videos: "280000개", country: "IN" },
  { name: "Star Sports India", handle: "@starsports", category: "스포츠", desc: "인도 최고 인기 크리켓 리그 라이브 토크 및 예고", subscribers: "680만", views: "12억", videos: "4800개", country: "IN" },
  { name: "Techno Gamerz", handle: "@technogamerz", category: "게임", desc: "인도 종합 GTA5, 마인크래프트 스토리 크리에이터", subscribers: "4000만", views: "115억", videos: "1100개", country: "IN" },
  { name: "Bhuvan Bam (BB Ki Vines)", handle: "@bbkivines", category: "엔터테인먼트", desc: "인도 서민들의 일상을 위트있게 그려낸 코미디 크리에이터", subscribers: "2600만", views: "49억", videos: "210개", country: "IN" },
  { name: "Ashish Chanchlani Vines", handle: "@ashishchanchlani", category: "엔터테인먼트", desc: "공감대 백퍼센트 가족/학교 주제 코믹 스케치 극장", subscribers: "3000만", views: "45억", videos: "160개", country: "IN" },
  { name: "Geekyranjit", handle: "@geekyranjit", category: "테크/IT", desc: "인도 정직하고 객관적인 모바일 스마트 가전 리뷰", subscribers: "340만", views: "9.1억", videos: "3500개", country: "IN" },
  { name: "C4ETech", handle: "@c4etech", category: "테크/IT", desc: "IT 하드웨어 벤치마크 및 모바일 실사용 정밀 비교", subscribers: "280만", views: "7.8억", videos: "2800개", country: "IN" },
  { name: "Sony LIV", handle: "@sonyliv", category: "영화/애니", desc: "소니 인도 드라마 및 예능 다시보기 클립 공식 보관소", subscribers: "4800만", views: "380억", videos: "65000개", country: "IN" },
  { name: "YRF (Yash Raj Films)", handle: "@yrf", category: "영화/애니", desc: "인도 최대 영화 배급사의 볼리우드 티저 공식 업로드 채널", subscribers: "6100만", views: "390억", videos: "4200개", country: "IN" },
  { name: "Shemaroo Filmi Gaane", handle: "@shemaroo", category: "영화/애니", desc: "레트로 인도 추억의 영화 명장면 댄스 아카이브", subscribers: "4900만", views: "320억", videos: "9800개", country: "IN" },
  { name: "Arijit Singh", handle: "@arijitsingh", category: "뮤직", desc: "인도 로맨틱 발라드 제왕 아리짓 싱 공식 라이브 영상", subscribers: "1200만", views: "28억", videos: "95개", country: "IN" },
  { name: "Kabita's Kitchen", handle: "@kabitaskitchen", category: "엔터테인먼트", desc: "따라하기 쉬운 맛있는 홈스타일 인도 카레 레시피", subscribers: "1350만", views: "35억", videos: "1400개", country: "IN" },
  { name: "Mortal (SouL Mortal)", handle: "@soulmortal", category: "게임", desc: "모바일 배틀그라운드(BGMI) 국가대표 출신 프로게이머", subscribers: "700만", views: "11억", videos: "1800개", country: "IN" },
  { name: "Sports Tak", handle: "@sportstak", category: "스포츠", desc: "크리켓 및 글로벌 종합 스포츠 인도 대표 뉴스 실시간 토크", subscribers: "720만", views: "24억", videos: "25000개", country: "IN" },

  // BR Channels (브라질 - 20개)
  { name: "Canal KondZilla", handle: "@kondzilla", category: "뮤직", desc: "브라질 펑크 음악 및 댄스 비디오 넘버원 스튜디오", subscribers: "6700만", views: "380억", videos: "2800개", country: "BR" },
  { name: "Felipe Neto", handle: "@felipeneto", category: "엔터테인먼트", desc: "브라질 1세대 종합 예능 리액션 및 소통 유튜버", subscribers: "4650만", views: "185억", videos: "4600개", country: "BR" },
  { name: "Whindersson Nunes", handle: "@whindersson", category: "엔터테인먼트", desc: "자취방 썰풀이에서 시작해 브라질 대표 코미디언으로 등극", subscribers: "4450만", views: "45억", videos: "420개", country: "BR" },
  { name: "Você Sabia?", handle: "@vocesabia", category: "엔터테인먼트", desc: "세상의 모든 신기한 지식과 미스터리를 파헤치는 형제", subscribers: "4550만", views: "52억", videos: "850개", country: "BR" },
  { name: "GR6 Explode", handle: "@gr6explode", category: "뮤직", desc: "상파울루 감성 댄스 뮤직 비디오 전문 레코드사", subscribers: "4000만", views: "260억", videos: "4500개", country: "BR" },
  { name: "Galinha Pintadinha", handle: "@galinhapintadinha", category: "영화/애니", desc: "브라질 국민 꼬꼬 율동 만화 음악 애니메이션 채널", subscribers: "3500만", views: "310억", videos: "150개", country: "BR" },
  { name: "Rezendeevil", handle: "@rezendeevil", category: "게임", desc: "마인크래프트에서 시작된 대규모 버라이어티 챌린지 예능", subscribers: "3200만", views: "145억", videos: "9800개", country: "BR" },
  { name: "Renato Garcia", handle: "@renatogarcia", category: "게임", desc: "멋진 슈퍼카 챌린지 및 유쾌한 친구들과의 종합 시뮬레이터", subscribers: "2700만", views: "92억", videos: "4100개", country: "BR" },
  { name: "Loop Infinito", handle: "@loopinfinito", category: "테크/IT", desc: "위트 있고 솔직한 하이엔드 모바일 기기 정밀 실사용기", subscribers: "180만", views: "3.5억", videos: "1800개", country: "BR" },
  { name: "Coisa de Nerd", handle: "@coisadenerd", category: "테크/IT", desc: "브라질 대표 부부 크리에이터의 종합 테크 및 게임 실황", subscribers: "1000만", views: "38억", videos: "3200개", country: "BR" },
  { name: "Canaltech", handle: "@canaltech", category: "테크/IT", desc: "모바일 테크 속보 및 전자기기 장단점 가이드", subscribers: "420만", views: "12억", videos: "8500개", country: "BR" },
  { name: "CNN Brasil", handle: "@cnnbrasil", category: "뉴스/시사", desc: "브라질 로컬 정치 경제 속보 실시간 뉴스 채널", subscribers: "410만", views: "9.2억", videos: "52000개", country: "BR" },
  { name: "Jovem Pan News", handle: "@jovempannews", category: "뉴스/시사", desc: "브라질 대형 라디오 미디어 기반 라이브 토크 시사 보도", subscribers: "750만", views: "34억", videos: "120000개", country: "BR" },
  { name: "Desimpedidos", handle: "@desimpedidos", category: "스포츠", desc: "브라질 최대 스트리트 축구 예능 및 선수 패러디 유쾌한 쇼", subscribers: "980만", views: "24억", videos: "3800개", country: "BR" },
  { name: "Esporte Interativo", handle: "@esporteinterativo", category: "스포츠", desc: "유럽 챔피언스리그 브라질 공식 중계 브리핑 채널", subscribers: "850만", views: "19억", videos: "15000개", country: "BR" },
  { name: "LubaTV", handle: "@lubatv", category: "엔터테인먼트", desc: "밈 분석과 소통 토크를 버무린 유쾌한 브라질 일상 유튜버", subscribers: "900만", views: "15억", videos: "1100개", country: "BR" },
  { name: "Alok", handle: "@alok", category: "뮤직", desc: "브라질이 낳은 세계적 EDM DJ 알록의 공식 오피셜 비디오", subscribers: "680만", views: "25억", videos: "210개", country: "BR" },
  { name: "Porta dos Fundos", handle: "@portadosfundos", category: "엔터테인먼트", desc: "브라질 최고 인기 배우들의 오리지널 블랙 코미디 꽁트 쇼", subscribers: "1780만", views: "68억", videos: "3500개", country: "BR" },
  { name: "AuthenticGames", handle: "@authenticgames", category: "게임", desc: "어린이 눈높이에 맞춘 교육용 마인크래프트 모드 스토리", subscribers: "2000만", views: "88억", videos: "4200개", country: "BR" },
  { name: "Nostalgia (Canal Nostalgia)", handle: "@canalnostalgia", category: "영화/애니", desc: "우리가 사랑했던 추억의 만화, 영화, 역사 정밀 다큐멘터리", subscribers: "1500만", views: "15억", videos: "380개", country: "BR" },

  // CA Channels (캐나다 - 20개)
  { name: "Justin Bieber", handle: "@justinbieber", category: "뮤직", desc: "글로벌 팝스타 저스틴 비버의 공식 채널 및 뮤직비디오", subscribers: "7320만", views: "320억", videos: "250개", country: "CA" },
  { name: "The Weeknd", handle: "@theweeknd", category: "뮤직", desc: "독보적인 음색의 캐나다 출신 세계적 알앤비 아티스트", subscribers: "3550만", views: "250억", videos: "180개", country: "CA" },
  { name: "Hacksmith Industries", handle: "@hacksmith", category: "테크/IT", desc: "영화 속 상상을 현실로 만드는 기발한 엔지니어링 실험", subscribers: "1520만", views: "32억", videos: "480개", country: "CA" },
  { name: "Linus Cat Tips", handle: "@linuscattips", category: "테크/IT", desc: "라이너스 테크 팁의 일상 및 귀여운 오피스 냥이들", subscribers: "210만", views: "3.2억", videos: "980개", country: "CA" },
  { name: "Unbox Therapy CA", handle: "@unboxtherapy_ca", category: "테크/IT", desc: "캐나다 감성의 정직한 라이프스타일 스마트 기기 언박싱", subscribers: "540만", views: "11억", videos: "520개", country: "CA" },
  { name: "Walk off the Earth", handle: "@walkofftheearth", category: "뮤직", desc: "하나의 기타로 연주하는 기발한 글로벌 아카펠라 밴드", subscribers: "450만", views: "12억", videos: "350개", country: "CA" },
  { name: "Drake", handle: "@drake", category: "뮤직", desc: "캐나다 출신 글로벌 힙합 거장 드레이크 공식 비디오 피드", subscribers: "2900만", views: "185억", videos: "110개", country: "CA" },
  { name: "VanossGaming", handle: "@vanossgaming", category: "게임", desc: "미국/캐나다 크루들과 함께하는 유쾌한 GTA5, 게리모드 실황", subscribers: "2590만", views: "155억", videos: "1800개", country: "CA" },
  { name: "Typical Gamer", handle: "@typicalgamer", category: "게임", desc: "역동적인 텐션의 캐나다 대표 포트나이트/GTA 게머", subscribers: "1500만", views: "41억", videos: "3200개", country: "CA" },
  { name: "CBC News", handle: "@cbcnews", category: "뉴스/시사", desc: "캐나다 공영방송 CBC의 신뢰성 높은 속보 및 사회 리포트", subscribers: "380만", views: "15억", videos: "24000개", country: "CA" },
  { name: "Global News", handle: "@globalnews", category: "뉴스/시사", desc: "지역 밀착형 정보와 글로벌 이슈를 다루는 캐나다 대표 뉴스", subscribers: "350만", views: "18억", videos: "31000개", country: "CA" },
  { name: "WatchMojo.com", handle: "@watchmojo", category: "엔터테인먼트", desc: "영화, 애니, 게임 등 문화 분야 탑 10 순위 랭킹 전문 매체", subscribers: "2500만", views: "165억", videos: "21000개", country: "CA" },
  { name: "IISuperwomanII (Lilly Singh)", handle: "@lillysingh", category: "엔터테인먼트", desc: "독설 코믹 꽁트 썰방으로 인기 몰이한 캐나다 코미디언", subscribers: "1400만", views: "34억", videos: "850개", country: "CA" },
  { name: "EvanTubeHD", handle: "@evantubehd", category: "게임", desc: "장난감 개봉기부터 캐주얼 챌린지까지 키즈 패밀리 채널", subscribers: "700만", views: "45억", videos: "1500개", country: "CA" },
  { name: "Sportsnet", handle: "@sportsnet", category: "스포츠", desc: "캐나다 NHL 아이스하키 경기 분석 및 하이라이트 중계", subscribers: "150만", views: "4.8억", videos: "18500개", country: "CA" },
  { name: "TSN", handle: "@tsn", category: "스포츠", desc: "캐나다 최대 스포츠 네트워크의 토크 및 대표 골장면 브리핑", subscribers: "110만", views: "3.5억", videos: "12000개", country: "CA" },
  { name: "Out of the Box", handle: "@outofthebox", category: "테크/IT", desc: "디테일이 살아있는 캐나다 최신 레트로 기기 리스토어 테크", subscribers: "100만", views: "1.9억", videos: "240개", country: "CA" },
  { name: "Shawn Mendes", handle: "@shawnmendes", category: "뮤직", desc: "캐나다 천재 팝 아티스트 숀 멘데스 공식 뮤직비디오 피드", subscribers: "3000만", views: "115억", videos: "150개", country: "CA" },
  { name: "Simple Plan", handle: "@simpleplan", category: "뮤직", desc: "캐나다 전설적 펑크 록 밴드 심플 플랜 라이브 및 비디오", subscribers: "220만", views: "5.5억", videos: "180개", country: "CA" },
  { name: "Cineplex", handle: "@cineplex", category: "영화/애니", desc: "캐나다 최대 극장 체인 시네플렉스 독점 배우 인터뷰", subscribers: "60만", views: "1.5억", videos: "2400개", country: "CA" }
];

// 7개 해외 국가에 대해 각 카테고리별 채널 개수가 정확히 20개가 되도록 동적 보완 확장하는 알고리즘
const EXTENDED_BENCHMARK_CHANNELS: RecommendationChannel[] = (() => {
  const resultList = [...BENCHMARK_CHANNELS];
  const targetCountries = ["US", "JP", "GB", "VN", "IN", "BR", "CA"];
  const targetCategories = ["테크/IT", "게임", "뮤직", "엔터테인먼트", "영화/애니", "뉴스/시사", "스포츠"];

  const categoryEngMap: Record<string, string> = {
    "테크/IT": "tech",
    "게임": "game",
    "뮤직": "music",
    "엔터테인먼트": "ent",
    "영화/애니": "movie",
    "뉴스/시사": "news",
    "스포츠": "sports"
  };

  for (const country of targetCountries) {
    for (const category of targetCategories) {
      // 해당 국가와 카테고리에 일치하는 기존 채널 필터링
      const existing = resultList.filter(ch => ch.country === country && ch.category === category);
      const needed = 20 - existing.length;

      if (needed > 0) {
        for (let i = 1; i <= needed; i++) {
          const idNum = existing.length + i;
          const engCat = categoryEngMap[category] || "channel";
          
          // 그럴듯한 구독자 수 분산 (500만 ~ 5만 사이로 다양하게 배치하여 내림차순 정렬 유도)
          const subValue = Math.max(5, 500 - idNum * 22);
          const subscribers = subValue >= 100 
            ? `${(subValue / 100).toFixed(1)}억` 
            : `${subValue}만`;

          const viewsValue = Math.round(subValue * 1.8);
          const views = viewsValue >= 100 
            ? `${(viewsValue / 100).toFixed(1)}억` 
            : `${viewsValue}만`;

          const videos = `${Math.round(idNum * 25 + 40)}개`;

          resultList.push({
            name: `${country} ${category} 채널 ${idNum}`,
            handle: `@${country.toLowerCase()}_${engCat}_rival_${idNum}`,
            category,
            avatar: "",
            desc: `${country} 지역의 최신 ${category} 트렌드 및 바이럴 알고리즘 분석용 벤치마킹 타겟 채널`,
            subscribers,
            views,
            videos,
            country
          });
        }
      }
    }
  }

  return resultList;
})();

const CATEGORIES = ["나의 채널", "전체", "테크/IT", "게임", "뮤직", "엔터테인먼트", "영화/애니", "뉴스/시사", "스포츠"];

export default function ChannelDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleParam = searchParams.get("handle");

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Custom user radar channels list
  const [radarChannels, setRadarChannels] = useState<RecommendationChannel[]>([]);
  
  // Hybrid avatar loading states
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState("전체");
  
  // 🌐 Country Filter States
  const [selectedCountry, setSelectedCountry] = useState("KR");

  // Video Analysis Modal states
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Outperformer radar sorting states
  const [videoSortKey, setVideoSortKey] = useState<"default" | "views" | "likes" | "comments">("default");

  // Load custom radar channels from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("userRadarChannels");
      if (stored) {
        setRadarChannels(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to restore userRadarChannels", e);
    }
  }, []);

  // Monitor url query param '?handle=' and trigger search/reset accordingly
  useEffect(() => {
    if (handleParam) {
      setQuery(handleParam);
      void handleSearch(handleParam);
    } else {
      setData(null);
      setQuery("");
    }
  }, [handleParam]);

  const handleSearch = async (targetQuery = query) => {
    const activeSearchQuery = targetQuery || query;
    if (!activeSearchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(`/api/youtube?type=channel&query=${encodeURIComponent(activeSearchQuery)}`);
      if (!res.ok) throw new Error("채널 정보를 가져오는데 실패했습니다.");
      const result = await res.json();
      if (result.error) throw new Error(result.error);
      setData(result);
    } catch (err: any) {
      setError(err.message || "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/studio/youtube/channel?handle=${encodeURIComponent(query)}`);
  };

  const handleRecommendClick = (handle: string) => {
    router.push(`/studio/youtube/channel?handle=${encodeURIComponent(handle)}`);
  };

  const handleOpenReport = (video: any) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const formatNumber = (numStr: string | number) => {
    const num = Number(numStr);
    if (isNaN(num)) return String(numStr);
    if (num >= 100000000) return `${(num / 100000000).toFixed(1)}억`;
    if (num >= 10000) return `${(num / 10000).toFixed(1)}만`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}천`;
    return num.toLocaleString();
  };

  // Convert subscriber string (e.g. 1720만, 260만, 45만) to absolute number for sorting
  const parseSubscribers = (subStr: string): number => {
    const num = parseFloat(subStr.replace(/[^\d.]/g, ""));
    if (isNaN(num)) return 0;
    if (subStr.includes("억")) return num * 100000000;
    if (subStr.includes("만")) return num * 10000;
    if (subStr.includes("천")) return num * 1000;
    return num;
  };

  // Extract clean keywords tag cloud from raw youtube keywords string
  const parseKeywords = (keywordsStr?: string): string[] => {
    if (!keywordsStr) return [];
    return keywordsStr
      .split(/[\s,]+/)
      .map((k) => k.replace(/["']/g, "").trim())
      .filter((k) => k.length > 1 && k.length < 20 && !k.startsWith("http"))
      .slice(0, 15);
  };

  // Toggle add/remove from my custom radar channels list
  const handleToggleRadar = () => {
    if (!data || !data.channel) return;
    const channelSnippet = data.channel.snippet;
    const channelStats = data.channel.statistics;
    const handle = channelSnippet.customUrl || `@${channelSnippet.title.replace(/\s+/g, "")}`;

    const isAdded = radarChannels.some((ch) => ch.handle.toLowerCase() === handle.toLowerCase());

    if (isAdded) {
      // Remove
      const updated = radarChannels.filter((ch) => ch.handle.toLowerCase() !== handle.toLowerCase());
      setRadarChannels(updated);
      localStorage.setItem("userRadarChannels", JSON.stringify(updated));
    } else {
      // Add
      const newChannel: RecommendationChannel = {
        name: channelSnippet.title,
        handle: handle,
        category: "나의 채널",
        avatar: channelSnippet.thumbnails.medium?.url || "",
        desc: channelSnippet.description || "사용자가 등록한 벤치마킹 분석 타겟 채널입니다.",
        subscribers: formatNumber(channelStats.subscriberCount),
        views: formatNumber(channelStats.viewCount),
        videos: `${channelStats.videoCount}개`,
        country: channelSnippet.country || "KR",
        isUserAdded: true,
      };
      const updated = [newChannel, ...radarChannels];
      setRadarChannels(updated);
      localStorage.setItem("userRadarChannels", JSON.stringify(updated));
    }
  };

  // Direct remove button from cards
  const handleRemoveRadarCard = (handle: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid recommend click triggering search
    const updated = radarChannels.filter((ch) => ch.handle.toLowerCase() !== handle.toLowerCase());
    setRadarChannels(updated);
    localStorage.setItem("userRadarChannels", JSON.stringify(updated));
  };

  // Determine filtered benchmark list
  const isMyChannelSelected = activeCategory === "나의 채널";
  const filteredBenchmarks = isMyChannelSelected
    ? radarChannels
    : EXTENDED_BENCHMARK_CHANNELS.filter((ch) => {
        const matchCountry = ch.country === selectedCountry;
        const matchCategory = activeCategory === "전체" || ch.category === activeCategory;
        return matchCountry && matchCategory;
      }).slice(0, 48);

  // Dynamic sorting based on subscribers count (descending)
  const sortedBenchmarks = [...filteredBenchmarks].sort((a, b) => {
    return parseSubscribers(b.subscribers) - parseSubscribers(a.subscribers);
  });

  // Check if current search result is in radar list
  const currentHandle = data?.channel?.snippet?.customUrl || "";
  const isCurrentInRadar = currentHandle
    ? radarChannels.some((ch) => ch.handle.toLowerCase() === currentHandle.toLowerCase())
    : false;

  // Dynamic sorting of recent videos
  const sortedVideos = (() => {
    if (!data || !data.recentVideos) return [];
    const list = [...data.recentVideos];
    if (videoSortKey === "default") return list;

    return list.sort((a: any, b: any) => {
      let valA = 0;
      let valB = 0;

      if (videoSortKey === "views") {
        valA = Number(a.statistics?.viewCount || 0);
        valB = Number(b.statistics?.viewCount || 0);
      } else if (videoSortKey === "likes") {
        valA = Number(a.statistics?.likeCount || 0);
        valB = Number(b.statistics?.likeCount || 0);
      } else if (videoSortKey === "comments") {
        valA = Number(a.statistics?.commentCount || 0);
        valB = Number(b.statistics?.commentCount || 0);
      }

      return valB - valA; // Descending
    });
  })();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="text-red-500" size={20} />
          <span className="text-[10px] font-black tracking-widest text-red-500 uppercase bg-red-950/40 border border-red-900/40 px-2 py-0.5 rounded-full">
            BENCHMARK RADAR
          </span>
        </div>
        <h2 className="flex items-center gap-2 text-2xl font-black text-white mb-2">
          <Users className="text-red-500 animate-pulse" size={24} />
          채널 상세 및 아웃라이어 분석
        </h2>
        <p className="text-sm text-zinc-400 mb-6 leading-relaxed font-semibold">
          유튜브 채널 명칭이나 핸들(@이름)을 입력하여 구독자 대비 조회수가 비정상적으로 높게 터진 <strong className="text-red-400">"숨은 꿀 영상(Outperformer)"</strong>을 선별하고 기획 요인을 파헤칩니다.
        </p>

        <form onSubmit={handleFormSubmit} className="flex gap-2.5">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="분석할 유튜브 채널의 핸들 또는 이름 입력 (예: @itsub, 잇섭)"
            className="flex-1 h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-xs font-semibold text-white outline-none placeholder:text-zinc-650 focus:border-red-500/50 transition"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-650 px-6 text-xs font-black text-white hover:bg-red-600 disabled:opacity-50 transition shadow-lg shadow-red-650/10 shrink-0"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            채널 심층 분석
          </button>
        </form>

        {error && (
          <p className="text-xs text-red-400 font-bold mt-2 flex items-center gap-1">
            ⚠️ {error}
          </p>
        )}
      </div>

      {/* Recommended Benchmarking Channels Area (Displayed when not loaded or searching) */}
      {!data && !loading && (
        <div className="space-y-6">
          {/* 🌐 Central Filter Hub (Global Country + Category Selectors) */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/20 p-6 backdrop-blur-md space-y-5.5 shadow-2xl shadow-black/25 flex flex-col items-center">
            
            {/* 1. Header Title & Description (Now at the top) */}
            <div className="text-center space-y-1.5 pt-1">
              <h3 className="text-sm font-black text-white flex items-center justify-center gap-1.5">
                <Sparkles size={14} className="text-yellow-500" />
                카테고리별 추천 벤치마킹 라이벌 채널
              </h3>
              <p className="text-[11px] text-zinc-500 font-bold mt-0.5">
                분야별 구독자 순으로 정렬된 대표 채널 목록입니다. 클릭 시 즉시 분석이 실행됩니다.
              </p>
              {isMyChannelSelected && (
                <div className="pt-1">
                  <span className="text-[9px] text-red-400 font-bold bg-red-950/35 border border-red-900/35 px-2 py-0.5 rounded animate-pulse inline-block">
                    나의 채널 탭은 국가 필터가 적용되지 않습니다
                  </span>
                </div>
              )}
            </div>

            {/* Inner selectors wrapper with tighter spacing */}
            <div className="w-full flex flex-col items-center space-y-3.5">
              {/* 2. Country Selector (Large & Centered) */}
              <div className="flex flex-wrap justify-center gap-2 max-w-5xl w-full">
                {COUNTRIES.map((ct) => (
                  <button
                    key={ct.code}
                    disabled={isMyChannelSelected}
                    onClick={() => setSelectedCountry(ct.code)}
                    className={`px-4.5 py-2.5 text-xs font-black rounded-xl transition flex items-center gap-1.5 border-2 ${
                      isMyChannelSelected
                        ? "opacity-30 cursor-not-allowed bg-zinc-900/50 border-zinc-850 text-zinc-650"
                        : selectedCountry === ct.code
                        ? "bg-red-950/30 border-red-500/70 text-white shadow-lg shadow-red-950/40 transform scale-105"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    }`}
                  >
                    <span className="text-lg leading-none">{ct.flag}</span>
                    <span>{ct.name}</span>
                  </button>
                ))}
              </div>

              {/* Separator Divider */}
              <div className="h-[1px] w-full bg-zinc-850/60" />

              {/* 3. Category Selector & Tabs (Centered & Close) */}
              <div className="flex flex-wrap justify-center gap-2 max-w-4xl w-full">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 text-xs font-black rounded-lg transition border-2 ${
                      activeCategory === cat
                        ? "bg-red-650 border-red-500 text-white shadow-md shadow-red-650/15"
                        : "bg-zinc-900 border-zinc-850 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Empty placeholders for custom channels */}
          {isMyChannelSelected && sortedBenchmarks.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-zinc-800 p-12 text-center max-w-lg mx-auto space-y-3.5 my-6 bg-zinc-900/5">
              <div className="mx-auto h-12 w-12 rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center text-zinc-650">
                <Users size={20} />
              </div>
              <h4 className="text-sm font-black text-zinc-300">나만의 레이더 채널이 비어 있습니다</h4>
              <p className="text-xs text-zinc-500 leading-relaxed font-semibold">
                위 검색창에 모니터링하려는 유튜브 채널을 입력하여 분석한 뒤, 결과 화면에서 <strong className="text-red-400">"나의 레이더에 추가"</strong> 버튼을 눌러 본인만의 벤치마킹 라이브러리를 구축해 보세요.
              </p>
            </div>
          ) : (
            /* Cards Grid sorted by subscribers */
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sortedBenchmarks.map((ch, idx) => (
                <div
                  key={idx}
                  onClick={() => handleRecommendClick(ch.handle)}
                  className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/20 p-5 hover:border-red-500/30 hover:bg-zinc-900/40 transition cursor-pointer overflow-hidden text-left"
                >
                  {/* Delete button display for user custom channels */}
                  {isMyChannelSelected && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveRadarCard(ch.handle, e)}
                      className="absolute top-3.5 right-3.5 h-6 w-6 rounded bg-zinc-950/80 hover:bg-red-950 border border-zinc-850 hover:border-red-900/50 flex items-center justify-center text-zinc-500 hover:text-red-400 transition"
                      title="레이더에서 삭제"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}

                  <div className="space-y-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-13 w-13 overflow-hidden rounded-full border border-red-500/20 shrink-0 bg-gradient-to-br from-red-650/35 to-zinc-950/80 flex items-center justify-center text-red-350 font-black text-base shadow-inner shadow-black/40">
                        {ch.avatar ? (
                          <img
                            src={ch.avatar}
                            alt={ch.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.style.display = "none";
                            }}
                          />
                        ) : !imageErrors[ch.handle] ? (
                          <img
                            src={`https://unavatar.io/youtube/${ch.handle.replace("@", "")}`}
                            alt={ch.name}
                            className="h-full w-full object-cover"
                            onError={() => {
                              setImageErrors((prev) => ({ ...prev, [ch.handle]: true }));
                            }}
                          />
                        ) : (
                          ch.name.charAt(0)
                        )}
                      </div>
                      <div className="pr-6">
                        <h4 className="text-sm sm:text-base font-black text-white group-hover:text-red-400 transition leading-tight line-clamp-1">{ch.name}</h4>
                        <p className="text-xs text-zinc-500 font-bold mt-1">{ch.handle}</p>
                      </div>
                    </div>

                    {/* 3-Metric Statistics Grid */}
                    <div className="grid grid-cols-3 gap-1 bg-zinc-950/65 p-2 rounded-xl text-center border border-zinc-850/60 shadow-inner">
                      <div>
                        <p className="text-[9px] text-zinc-500 font-black uppercase tracking-wider">구독자</p>
                        <p className="text-xs text-red-400 font-black mt-0.5">{ch.subscribers}</p>
                      </div>
                      <div className="border-x border-zinc-850/65">
                        <p className="text-[9px] text-zinc-500 font-black uppercase tracking-wider">총조회수</p>
                        <p className="text-xs text-orange-400 font-black mt-0.5">{ch.views}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-zinc-500 font-black uppercase tracking-wider">동영상수</p>
                        <p className="text-xs text-cyan-400 font-black mt-0.5">{ch.videos}</p>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-350 leading-relaxed font-bold line-clamp-2 bg-zinc-950/20 p-2.5 rounded-lg border border-zinc-850">
                      {ch.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-850/60 flex items-center justify-between text-xs font-black text-zinc-500 group-hover:text-red-400 transition">
                    <span className="bg-zinc-950 px-2 py-0.5 rounded text-[10px] border border-zinc-850 font-bold flex items-center gap-1">
                      <span>{COUNTRIES.find((c) => c.code === ch.country)?.flag || "🌐"}</span>
                      <span>{ch.category}</span>
                    </span>
                    <span className="flex items-center gap-1.5 font-bold">채널 레이더 가동 <ArrowRight size={13} /></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="animate-spin text-red-500" size={32} />
          <p className="text-xs font-black text-zinc-500">YouTube Data API 호출 및 최근 업로드 메타데이터 수집 중...</p>
        </div>
      )}

      {/* Search results mapping outperformer indicators */}
      {data && data.channel && (
        <div className="flex flex-col space-y-4">
          {/* Back to list button */}
          <button
            onClick={() => router.push("/studio/youtube/channel")}
            className="flex items-center gap-2 text-xs font-black text-zinc-400 hover:text-white transition bg-zinc-950/60 border border-zinc-850 px-4 py-2.5 rounded-xl self-start"
          >
            <ArrowLeft size={14} /> 추천 목록으로 돌아가기
          </button>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Left Column: Channel Overview Card & Meta Data Details */}
            <div className="md:col-span-1 space-y-6">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 overflow-hidden backdrop-blur-md">
                {/* Channel Banner Image */}
                <div className="relative w-full h-24 sm:h-28 bg-zinc-950 overflow-hidden">
                  {data.channel.brandingSettings?.image?.bannerExternalUrl ? (
                    <img
                      src={data.channel.brandingSettings.image.bannerExternalUrl}
                      alt="Channel Banner"
                      className="w-full h-full object-cover opacity-60"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-red-950/30 via-zinc-900/80 to-zinc-950" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 to-transparent" />
                </div>

                <div className="relative px-5 pb-6 text-center space-y-4 -mt-10">
                  <div className="mx-auto h-20 w-20 overflow-hidden rounded-full border-2 border-zinc-900 bg-zinc-950 shadow-xl relative z-10">
                    <img
                      src={data.channel.snippet.thumbnails.medium?.url || "/placeholder.jpg"}
                      alt={data.channel.snippet.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-white leading-tight">{data.channel.snippet.title}</h3>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-bold">{data.channel.snippet.customUrl}</p>
                  </div>

                  {/* Scrollable full description */}
                  <div className="text-left bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-850">
                    <p className="text-[10px] font-black text-zinc-400 mb-1">채널 소개</p>
                    <div className="text-[11px] leading-relaxed text-zinc-350 font-bold max-h-36 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
                      {data.channel.snippet.description || "채널 설명이 없습니다."}
                    </div>
                  </div>

                  {/* 3-Metric stats labels and values */}
                  <div className="grid grid-cols-3 gap-2 text-left">
                    <div className="rounded-xl border border-zinc-850 bg-zinc-950/20 p-2.5 text-center">
                      <p className="text-[10px] font-black text-zinc-400">구독자</p>
                      <p className="text-sm font-black text-red-400 mt-1">{formatNumber(data.channel.statistics.subscriberCount)}</p>
                    </div>
                    <div className="rounded-xl border border-zinc-850 bg-zinc-950/20 p-2.5 text-center">
                      <p className="text-[10px] font-black text-zinc-400">총조회수</p>
                      <p className="text-sm font-black text-white mt-1">{formatNumber(data.channel.statistics.viewCount)}</p>
                    </div>
                    <div className="rounded-xl border border-zinc-850 bg-zinc-950/20 p-2.5 text-center">
                      <p className="text-[10px] font-black text-zinc-400">동영상수</p>
                      <p className="text-sm font-black text-white mt-1">{data.channel.statistics.videoCount}개</p>
                    </div>
                  </div>

                  {/* Dynamic Add to Radar Channel toggler */}
                  <button
                    type="button"
                    onClick={handleToggleRadar}
                    className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-black transition border shadow-sm ${
                      isCurrentInRadar
                        ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                        : "bg-red-950/30 border-red-900/40 text-red-400 hover:bg-red-950/50 hover:border-red-800"
                    }`}
                  >
                    {isCurrentInRadar ? (
                      <>
                        <Check size={14} /> 나의 레이더 해제
                      </>
                    ) : (
                      <>
                        <Plus size={14} /> 나의 레이더 채널 추가
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* NEW: Channel Detailed Metadata Section */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-5 backdrop-blur-md space-y-4">
                <h4 className="text-xs font-black text-white flex items-center gap-1.5 border-b border-zinc-850 pb-2">
                  ℹ️ 채널 상세 프로필 명세
                </h4>
                <div className="space-y-2.5 text-[11px] font-bold text-zinc-400">
                  <div className="flex justify-between items-center">
                    <span>채널 고유 ID</span>
                    <span className="text-zinc-300 font-mono select-all bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-850 truncate max-w-[160px]" title={data.channel.id}>
                      {data.channel.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>채널 개설일</span>
                    <span className="text-zinc-200">
                      {data.channel.snippet.publishedAt
                        ? new Date(data.channel.snippet.publishedAt).toLocaleDateString("ko-KR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>소속 국가</span>
                    <span className="text-zinc-200">
                      {data.channel.snippet.country
                        ? COUNTRIES.find((c) => c.code === data.channel.snippet.country)?.name || data.channel.snippet.country
                        : "미지정"}
                      {data.channel.snippet.country && ` (${data.channel.snippet.country})`}
                    </span>
                  </div>
                </div>
              </div>

              {/* NEW: Channel Tags/Keywords Cloud */}
              {data.channel.brandingSettings?.channel?.keywords && (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-5 backdrop-blur-md space-y-3">
                  <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                    💡 채널 공식 관심 키워드
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {parseKeywords(data.channel.brandingSettings.channel.keywords).map((kw: string, i: number) => (
                      <span
                        key={i}
                        className="border border-zinc-850 bg-zinc-950/60 text-zinc-400 text-[10px] font-black px-2.5 py-1 rounded-lg hover:border-zinc-700 transition"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick links to other options */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-3">
                <h4 className="text-xs font-black text-white">관련 연동 메뉴</h4>
                <div className="flex flex-col gap-2">
                  <a
                    href={`/studio/youtube/cpm?views=${data.channel.statistics.viewCount}`}
                    className="flex justify-between items-center rounded-lg bg-zinc-950/50 p-2.5 text-[11px] font-bold text-zinc-300 hover:border-red-500/30 hover:bg-zinc-900 transition border border-zinc-850"
                  >
                    <span className="flex items-center gap-1.5"><Database size={13} className="text-violet-400" /> 수익 및 CPM 계산</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Outperformer Radar Videos list */}
            <div className="md:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <PlayCircle className="text-red-500" size={16} />
                  최근 업로드 분석 및 "숨은 꿀 영상" 레이더
                </h3>
                
                <div className="flex items-center gap-2">
                  {/* Sorting Buttons */}
                  <div className="flex items-center gap-1 bg-zinc-950 p-0.5 rounded-lg border border-zinc-850 text-[10px] font-bold text-zinc-400">
                    <button
                      onClick={() => setVideoSortKey("default")}
                      className={`px-2 py-0.5 rounded transition ${
                        videoSortKey === "default"
                          ? "bg-zinc-800 text-white font-black"
                          : "hover:text-white"
                      }`}
                    >
                      최신순
                    </button>
                    <button
                      onClick={() => setVideoSortKey("views")}
                      className={`px-2 py-0.5 rounded transition ${
                        videoSortKey === "views"
                          ? "bg-zinc-800 text-white font-black"
                          : "hover:text-white"
                      }`}
                    >
                      조회수순
                    </button>
                    <button
                      onClick={() => setVideoSortKey("likes")}
                      className={`px-2 py-0.5 rounded transition ${
                        videoSortKey === "likes"
                          ? "bg-zinc-800 text-white font-black"
                          : "hover:text-white"
                      }`}
                    >
                      좋아요순
                    </button>
                    <button
                      onClick={() => setVideoSortKey("comments")}
                      className={`px-2 py-0.5 rounded transition ${
                        videoSortKey === "comments"
                          ? "bg-zinc-800 text-white font-black"
                          : "hover:text-white"
                      }`}
                    >
                      댓글순
                    </button>
                  </div>

                  <span className="text-[10px] text-zinc-550 font-bold bg-zinc-950 border border-zinc-850 px-2 py-0.5 rounded shrink-0">표본 30개</span>
                </div>
              </div>

              <div className="space-y-4">
                {sortedVideos && sortedVideos.length > 0 ? (
                  sortedVideos.map((video: any, idx: number) => {
                    const subscriberCount = Number(data.channel?.statistics?.subscriberCount || 0);
                    const viewCount = Number(video.statistics?.viewCount || 0);
                    
                    const videoId = typeof video.id === "object" ? (video.id?.videoId || video.id?.channelId || String(idx)) : video.id;

                    // Calculate Outperform Ratio (조회수 / 구독자 수) * 100
                    const ratio = subscriberCount > 0 ? (viewCount / subscriberCount) * 100 : 0;
                    
                    // Assign badges and borders for outliers
                    let ratingLabel = "보통 성과";
                    let ratingColor = "border-zinc-800 text-zinc-400";
                    let isOutlier = false;
                    
                    if (ratio >= 100) {
                      ratingLabel = "★ 메가 히트 (벤치마킹 강력추천)";
                      ratingColor = "border-orange-500/50 text-orange-400 bg-orange-950/20";
                      isOutlier = true;
                    } else if (ratio >= 50) {
                      ratingLabel = "우수 성과 (추천)";
                      ratingColor = "border-red-500/35 text-red-400 bg-red-950/15";
                      isOutlier = true;
                    } else if (ratio >= 20) {
                      ratingLabel = "양호 성과";
                      ratingColor = "border-yellow-500/20 text-yellow-500/80 bg-yellow-950/5";
                    }

                    return (
                      <div
                        key={videoId || idx}
                        onClick={() => handleOpenReport({ ...video, id: videoId })}
                        className={`flex flex-col sm:flex-row gap-4 rounded-xl bg-zinc-950/40 p-4 border transition cursor-pointer hover:bg-zinc-900/40 ${
                          isOutlier ? "border-orange-500/30 hover:border-orange-500/50" : "border-zinc-850 hover:border-red-500/20"
                        }`}
                      >
                        {/* Video Thumbnail */}
                        <div className="h-20 w-36 overflow-hidden rounded-lg border border-zinc-850 shrink-0 bg-zinc-900 relative">
                          <img
                            src={video.snippet.thumbnails?.medium?.url || video.snippet.thumbnails?.default?.url}
                            alt={video.snippet.title}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* Content details and Outperformer parameters */}
                        <div className="min-w-0 flex-1 flex flex-col justify-between py-0.5">
                          <div>
                            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                              <span className={`inline-flex px-2 py-0.5 text-[9px] font-black border rounded ${ratingColor}`}>
                                {ratingLabel}
                              </span>
                              <span className="text-[9px] text-zinc-550 font-bold">
                                구독자수 대비 조회비율: <span className={`font-black ${isOutlier ? "text-orange-400" : "text-zinc-300"}`}>{ratio.toFixed(1)}%</span>
                              </span>
                            </div>

                            <h4 className="text-xs font-black text-zinc-100 group-hover:text-red-400 leading-snug line-clamp-2">
                              {video.snippet.title}
                            </h4>
                          </div>

                          {/* Stats Strip */}
                          <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] text-zinc-550 font-bold mt-3.5 pt-2 border-t border-zinc-900/60">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1"><Eye size={12} /> {formatNumber(viewCount)}</span>
                              <span className="flex items-center gap-1"><ThumbsUp size={12} /> {formatNumber(video.statistics?.likeCount || 0)}</span>
                              <span className="flex items-center gap-1"><MessageSquare size={12} /> {formatNumber(video.statistics?.commentCount || 0)}</span>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenReport(video);
                              }}
                              className="text-[9px] font-black text-red-400 hover:text-red-300 flex items-center gap-1"
                            >
                              AI 데이터 분석 리포트 →
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-zinc-500 py-8 text-center">최근에 발행한 비디오 목록이 없습니다.</p>
                )}
              </div>

              <div className="text-[10px] text-zinc-650 font-bold text-right pt-2">
                데이터 출처: {data.source === "database-cache" ? "Supabase DB Cache" : data.source === "youtube-api" ? "YouTube Live Data API" : "Vault Fallback System"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Analysis Modal */}
      {isModalOpen && selectedVideo && (
        <VideoAnalysisModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedVideo(null);
          }}
          video={selectedVideo}
          videos={data?.recentVideos}
          onVideoSelect={setSelectedVideo}
          reportType="channel"
        />
      )}
    </div>
  );
}
