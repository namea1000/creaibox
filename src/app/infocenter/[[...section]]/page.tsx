import React from "react";
import { Metadata } from "next";
import PublicInfocenterClient from "./client";

const sectionNames: Record<string, string> = {
  list: "고객 지원 공지사항 목록",
  view: "게시글 상세 열람실",
  writing: "문의글 작성 폼",
};

interface Props {
  params: Promise<{ section?: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  const segments = section || [];
  const path = segments.join("/");
  const sectionTitle = sectionNames[path] || "고객 서비스 인포센터";
  return {
    title: `${sectionTitle} | 크리에이박스 CreAibox`,
    description: `크리에이박스 CreAibox의 공식 ${sectionTitle} 공간입니다. 플랫폼 서비스 공지사항 및 자주 묻는 질문(FAQ)의 핵심 내용을 투명하게 안내해 드립니다.`,
    keywords: ["크리에이박스", "creaibox", sectionTitle, "고객센터 공지사항", "자주 묻는 질문"]
  };
}

export default function Page() {
  return <PublicInfocenterClient />;
}
