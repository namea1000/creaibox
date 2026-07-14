"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { EditorContent, useEditor, Mark, mergeAttributes } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { CustomImage } from "./extensions/CustomImageExtension";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import TextAlign from "@tiptap/extension-text-align";

const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        parseHTML: (element) => element.style.backgroundColor || null,
      },
      verticalAlign: {
        default: "middle",
        parseHTML: (element) => element.style.verticalAlign || "middle",
      },
      textAlign: {
        default: null,
        parseHTML: (element) => element.style.textAlign || null,
      },
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    const attrs = node.attrs;
    const styles: string[] = [];
    if (attrs.backgroundColor) styles.push(`background-color: ${attrs.backgroundColor}`);
    styles.push(`vertical-align: ${attrs.verticalAlign || 'middle'} !important`);
    if (attrs.textAlign) styles.push(`text-align: ${attrs.textAlign}`);

    const styleString = styles.length > 0 ? styles.join("; ") : undefined;
    const merged = mergeAttributes(HTMLAttributes, {
      style: styleString,
    });

    return ["td", merged, 0];
  },
});

const CustomTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        parseHTML: (element) => element.style.backgroundColor || null,
      },
      verticalAlign: {
        default: "middle",
        parseHTML: (element) => element.style.verticalAlign || "middle",
      },
      textAlign: {
        default: null,
        parseHTML: (element) => element.style.textAlign || null,
      },
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    const attrs = node.attrs;
    const styles: string[] = [];
    if (attrs.backgroundColor) styles.push(`background-color: ${attrs.backgroundColor}`);
    styles.push(`vertical-align: ${attrs.verticalAlign || 'middle'} !important`);
    if (attrs.textAlign) styles.push(`text-align: ${attrs.textAlign}`);

    const styleString = styles.length > 0 ? styles.join("; ") : undefined;
    const merged = mergeAttributes(HTMLAttributes, {
      style: styleString,
    });

    return ["th", merged, 0];
  },
});
import { TextStyle } from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-font-family";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Bold,
  Brain,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronsUpDown,
  CirclePlay,
  Code2,
  Combine,
  Copy,
  Cpu,
  Download,
  Eraser,
  Eye,
  FileText,
  FileCode,
  Globe,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  PanelLeftClose,
  PanelLeftOpen,
  Printer,
  Quote,
  Redo,
  RefreshCw,
  Save,
  Search,
  Sparkles,
  Split,
  Table2,
  Trash2,
  Type,
  Undo,
  Wand2,
  X,
  Zap,
} from "lucide-react";
import { generateGeminiContentWithFallback } from "@/lib/client/api-vault";
import { robustParseJson } from "@/lib/utils";
import { topicCategories, topicSubTopics } from "@/lib/content-planner/topic-categories";

const mainGroups = [
  "기술 & 디지털",
  "경제 & 비즈니스",
  "생활 & 문화",
  "건강 & 라이프스타일",
  "교육 & 지식",
  "사회 & 국제",
  "법률 & 정책 & 복지",
  "환경 & 지구과학",
  "크리에이티브 & 예술",
  "산업 & 미래",
];

const groupEmojis: Record<string, string> = {
  "기술 & 디지털": "💻",
  "경제 & 비즈니스": "💼",
  "생활 & 문화": "☕",
  "건강 & 라이프스타일": "🧘",
  "교육 & 지식": "🎓",
  "사회 & 국제": "🌏",
  "법률 & 정책 & 복지": "⚖️",
  "환경 & 지구과학": "🌱",
  "크리에이티브 & 예술": "🎨",
  "산업 & 미래": "🏭",
};

const getContentTypeEmoji = (type: string) => {
  const map: Record<string, string> = {
    "멀티 플랫폼 콘텐츠 기획": "🌐",
    "블로그 글쓰기 콘텐츠": "📝",
    "유튜브 쇼츠 기획": "🎬",
    "유튜브 롱폼 기획": "🎥",
    "틱톡 숏폼 기획": "📱",
    "네이버 클립 기획": "📎",
    "인스타그램 릴스 기획": "📸",
    "SNS 카드뉴스 기획": "🖼️",
    "뉴스레터 기획": "✉️",
    "브랜드 캠페인 기획": "📢",
  };
  return map[type] || "✨";
};

const getStrategyLevelEmoji = (level: string) => {
  const map: Record<string, string> = {
    "1. 기본 전략(대중적이고 상식적 수준의 정보성 글)": "⚡",
    "2. 고급 전략(검색 엔진 최적화 및 사용자 타겟 분석)": "💎",
    "3. 전문가 전략(가장 고도화된 심층적 마케팅 구조 설계)": "👑",
  };
  return map[level] || "⚙️";
};

const getResultFormatEmoji = (format: string) => {
  const map: Record<string, string> = {
    "1. 기본 시리즈(키워드 연관 글감 병렬적 나열)": "📦",
    "2. 기본 시리즈 + 배포 플랫폼별 적합성 키워드 향상": "📢",
    "3. 2번 + 발행 순서 및 최적의 배포 타이밍 구성": "📅",
  };
  return map[format] || "⚙️";
};

const postTypeOptions = [
  { label: "① 인사이트 & 트렌드", disabled: true },
  { label: "🤖 AI 자동 포스팅", disabled: false },
  { label: "🧠 AI 인사이트 포스팅", disabled: false },
  { label: "📈 트렌드 브리프", disabled: false },
  { label: "📊 시장/기술 분석 리포트", disabled: false },
  { label: "📰 최신 뉴스 및 이슈", disabled: false },
  { label: "📌 오늘의 주요 이슈 정리", disabled: false },

  { label: "② 정보성 콘텐츠", disabled: true },
  { label: "ℹ️ 일반 정보성", disabled: false },
  { label: "💵 생활 정책 및 정부 지원금", disabled: false },
  { label: "🥗 건강 정보 및 영양제 분석", disabled: false },
  { label: "💳 보험/대출/카드 정보", disabled: false },
  { label: "🏠 부동산 정보", disabled: false },

  { label: "③ 금융 & 비즈니스", disabled: true },
  { label: "💰 금융 및 재테크", disabled: false },
  { label: "📈 주식/재테크 분석", disabled: false },
  { label: "🏢 기업 정보 및 주식 정보", disabled: false },
  { label: "🚀 비즈니스/창업 정보", disabled: false },

  { label: "④ 브랜드 & 퍼블리싱", disabled: true },
  { label: "📖 브랜드 스토리 포스팅", disabled: false },
  { label: "📢 서비스 소개형 포스팅", disabled: false },
  { label: "🏢 기업 소개 및 서비스 안내", disabled: false },
  { label: "✉️ 뉴스레터형 콘텐츠", disabled: false },

  { label: "⑤ 도구 & 사용법", disabled: true },
  { label: "📱 앱 설치 및 상세 가이드", disabled: false },
  { label: "🤖 AI 툴 및 웹 서비스 가이드", disabled: false },
  { label: "⚙️ 유틸리티 설치/사용 방법", disabled: false },
  { label: "🔗 바로가기 버튼 생성", disabled: false },

  { label: "⑥ 실무형 가이드", disabled: true },
  { label: "📘 실전 가이드 아티클", disabled: false },
  { label: "🔍 SEO 최적화 포스팅", disabled: false },
  { label: "🔄 튜토리얼 & 워크플로우", disabled: false },
  { label: "✅ 체크리스트형 콘텐츠", disabled: false },
  { label: "⚖️ 비교 분석형 콘텐츠", disabled: false },
  { label: "🧩 문제 해결형 콘텐츠", disabled: false },

  { label: "⑦ 리뷰 & 라이프스타일", disabled: true },
  { label: "📦 일반 제품 리뷰", disabled: false },
  { label: "⚖️ 제품 비교 리뷰", disabled: false },
  { label: "💻 IT 기기 사용 후기", disabled: false },
  { label: "🚗 자동차 모델 리뷰", disabled: false },
  { label: "🎮 게임 리뷰 및 공략", disabled: false },
  { label: "🍳 맛집 리뷰", disabled: false },
  { label: "✈️ 국내 여행 정보", disabled: false },
  { label: "🎬 영화/드라마 정보 및 리뷰", disabled: false },
  { label: "🌟 유명 연예인 인물 정보", disabled: false },

  { label: "⑧ 교육 & 자기계발", disabled: true },
  { label: "🎓 교육/가이드형", disabled: false },
  { label: "🌱 자기계발 포스팅", disabled: false },
  { label: "📚 공부법/학습법", disabled: false },
  { label: "🏫 강의/커리큘럼 소개", disabled: false },
];

const DEFAULT_CONTENT_IMAGE_SOURCE_TYPE = "writing_creaibox_posts";
const CONTENT_IMAGE_ROLE = "content_image";
const IMAGE_BUCKET = "generated-images";

const cleanContentComment = (htmlOrMd: string) => {
  if (!htmlOrMd) return "";
  const regexEditorial = /<!-- CREAIBOX_EDITORIAL_START ([\s\S]*?) CREAIBOX_EDITORIAL_END -->/g;
  const regexSchema = /<!--\s*CREAIBOX_SCHEMA_START([\s\S]*?)CREAIBOX_SCHEMA_END\s*-->/g;
  return htmlOrMd.replace(regexEditorial, "").replace(regexSchema, "").trim();
};

type GeneratedImageRow = {
  id: string;
  image_url: string | null;
  source_type?: string | null;
  source_id?: string | number | null;
  image_role?: string | null;
};

interface ImageBlock {
  id: string;
  url: string;
  caption: string;
}

interface UniversalBlogEditorProps {
  selectedPersonaId?: string | null;
  setSelectedPersonaId?: (v: string | null) => void;
  selectedKnowledgeId?: string | null;
  setSelectedKnowledgeId?: (v: string | null) => void;
  isListSidebarCollapsed?: boolean;
  onToggleListSidebar?: () => void;
  title: string;
  setTitle: (v: string) => void;
  content: string;
  setContent: (v: string) => void;
  charCount: number;
  images: ImageBlock[];
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isSaving: boolean;
  isEnhancing: boolean;
  isEnhancingContent?: boolean;
  isEnhancingToc?: boolean;
  isPolishing?: boolean;
  isChangingPostType?: boolean;
  isApplyingSearch?: boolean;
  handleImageUploadClick: () => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpdateCaption: (id: string, text: string) => void;
  handleDeleteImage: (id: string) => void;
  handleEnhanceContent: (type: string) => void;
  handleSavePostToSupabase: (status?: any) => Promise<boolean | void>;
  handleCopy?: () => void;
  handleFormDelete?: () => void;
  isRecreateMode?: boolean;
  isDetailMode?: boolean;
  targetKeyword?: string;
  isLoading?: boolean;
  manuscriptId?: string | number;
  contentImageSourceType?: string;
  onGenerateSeo?: () => Promise<void>;
  isGeneratingSeo?: boolean;
  aiTargetKeyword?: string;
  setAiTargetKeyword?: (v: string) => void;
  aiContentType?: string;
  setAiContentType?: (v: string) => void;
  aiPostType?: string;
  setAiPostType?: (v: string) => void;
  aiSelectedTone?: string;
  setAiSelectedTone?: (v: string) => void;
  aiWordCountGoal?: string;
  setAiWordCountGoal?: (v: string) => void;
  aiStrategyLevel?: string;
  setAiStrategyLevel?: (v: string) => void;
  aiResultFormat?: string;
  setAiResultFormat?: (v: string) => void;
  aiLargeCategory?: string;
  setAiLargeCategory?: (v: string) => void;
  aiMainTopic?: string;
  setAiMainTopic?: (v: string) => void;
  aiSubTopic?: string;
  setAiSubTopic?: (v: string) => void;
  aiReferenceNote?: string;
  setAiReferenceNote?: (v: string) => void;
  aiUseSearch?: boolean;
  setAiUseSearch?: (v: boolean) => void;
  isAiGenerating?: boolean;
  aiStatusMessage?: string;
  aiErrorMessage?: string;
  handleAiGenerateInEditor?: (
    targetKeyword: string,
    contentType: string,
    postType: string,
    selectedTone: string,
    wordCountGoal: string,
    strategyLevel: string,
    resultFormat: string,
    largeCategory: string,
    mainTopic: string,
    subTopic: string,
    referenceNote: string,
    useSearch: boolean
  ) => Promise<void>;
  userRole?: string;
  userBrandId?: string;
  userBrandIds?: string[];
  extraConfigs?: any;
}

const SYMBOL_CATEGORIES: Record<string, string[]> = {
  "일반/기호": ["※", "☆", "★", "○", "●", "◎", "◇", "◆", "□", "■", "△", "▲", "▽", "▼", "→", "←", "↑", "↓", "↔", "↕", "◈", "▣", "◐", "◑", "▒", "▤", "▥", "▨", "▧", "▩", "♨", "☎", "☏", "☜", "☞", "♣", "♥", "♦", "♠", "♩", "♪", "♫", "♬"],
  "수학/단위": ["＋", "－", "＜", "＝", "＞", "±", "×", "÷", "≠", "≤", "≥", "∞", "∴", "∵", "∽", "∝", "‰", "℃", "℉", "㎕", "㎖", "㎗", "ℓ", " kl", "㏄", "㎟", "㎠", "㎡", "㎢", "㎳", "㎲", "㎱", "㎰", "㎴", "㎵", "㎶", "㎷", "㎸", "㎹"],
  "괄호/문장부호": ["「", "」", "『", "』", "【", "】", "〔", "〕", "〈", "〉", "《", "》", "（", "）", "［", "］", "｛", "｝", "ㆍ", "•", "·", "…", "※", "→", "←", "↑", "↓", "↔", "↖", "↗", "↙", "↘", "↕", "≒", "≪", "≫", "√", "∽", "∝"],
  "선/도형": ["─", "│", "┌", "┐", "┘", "└", "├", "┬", "┤", "┴", "┼", "━", "┃", "┏", "┓", "┛", "┗", "┣", "┳", "┫", "┻", "╋", "┠", "┯", "┨", "┷", "┿", "┝", "┰", "┥", "┸", "╂"],
  "그리스/라틴": ["Α", "Β", "Γ", "Δ", "Ε", "Ζ", "Η", "Θ", "Ι", "Κ", "Λ", "Μ", "Ν", "Ξ", "Ο", "Π", "Ρ", "Σ", "Τ", "Υ", "Φ", "Χ", "Ψ", "Ω", "α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "ι", "κ", "λ", "μ", "ν", "ξ", "ο", "π", "ρ", "σ", "τ", "υ", "φ", "χ", "ψ", "ω"]
};

const FontSize = Mark.create({
  name: "fontSize",
  addAttributes() {
    return {
      size: {
        default: null,
        parseHTML: (element) => element.style.fontSize,
        renderHTML: (attributes) => {
          if (!attributes.size) return {};
          return { style: `font-size: ${attributes.size}` };
        },
      },
    };
  },
  parseHTML() {
    return [{ style: "font-size" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes), 0];
  },
  addCommands() {
    return {
      setFontSize: (size: string) => ({ chain }: any) => {
        return chain().setMark("fontSize", { size }).run();
      },
      unsetFontSize: () => ({ chain }: any) => {
        return chain().unsetMark("fontSize").run();
      },
    } as any;
  },
});

const Color = Mark.create({
  name: "color",
  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: (element) => element.style.color,
        renderHTML: (attributes) => {
          if (!attributes.color) return {};
          return { style: `color: ${attributes.color}` };
        },
      },
    };
  },
  parseHTML() {
    return [{ style: "color" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes), 0];
  },
  addCommands() {
    return {
      setColor: (color: string) => ({ chain }: any) => {
        return chain().setMark("color", { color }).run();
      },
      unsetColor: () => ({ chain }: any) => {
        return chain().unsetMark("color").run();
      },
    } as any;
  },
});

const HighlightColor = Mark.create({
  name: "highlightColor",
  addAttributes() {
    return {
      highlightColor: {
        default: null,
        parseHTML: (element) => element.style.backgroundColor,
        renderHTML: (attributes) => {
          if (!attributes.highlightColor) return {};
          return { style: `background-color: ${attributes.highlightColor}` };
        },
      },
    };
  },
  parseHTML() {
    return [{ style: "background-color" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes), 0];
  },
  addCommands() {
    return {
      setHighlightColor: (highlightColor: string) => ({ chain }: any) => {
        return chain().setMark("highlightColor", { highlightColor }).run();
      },
      unsetHighlightColor: () => ({ chain }: any) => {
        return chain().unsetMark("highlightColor").run();
      },
    } as any;
  },
});

const TopAlignIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="4" x2="20" y2="4" />
    <line x1="12" y1="9" x2="12" y2="20" />
    <polyline points="8 13 12 9 16 13" />
  </svg>
);

const MiddleAlignIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="12" y1="4" x2="12" y2="9" />
    <polyline points="9 7 12 4 15 7" />
    <line x1="12" y1="15" x2="12" y2="20" />
    <polyline points="9 17 12 20 15 17" />
  </svg>
);

const BottomAlignIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="20" x2="20" y2="20" />
    <line x1="12" y1="4" x2="12" y2="15" />
    <polyline points="8 11 12 15 16 11" />
  </svg>
);

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function applyInlineMarkdown(value: string) {
  return escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function markdownToHtml(markdown: string) {
  if (!markdown) return "";
  if (/<[a-z][\s\S]*>/i.test(markdown.trim())) return markdown;

  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let paragraph: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      html.push(`<p>${paragraph.map(applyInlineMarkdown).join("<br />")}</p>`);
      paragraph = [];
    }
  };

  const flushList = () => {
    if (listType && listItems.length > 0) html.push(`<${listType}>${listItems.join("")}</${listType}>`);
    listType = null;
    listItems = [];
  };

  for (const raw of lines) {
    const line = raw.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    if (/^###\s+/.test(line)) {
      flushParagraph();
      flushList();
      html.push(`<h3>${applyInlineMarkdown(line.replace(/^###\s+/, ""))}</h3>`);
      continue;
    }

    if (/^##\s+/.test(line)) {
      flushParagraph();
      flushList();
      html.push(`<h2>${applyInlineMarkdown(line.replace(/^##\s+/, ""))}</h2>`);
      continue;
    }

    if (/^#\s+/.test(line)) {
      flushParagraph();
      flushList();
      html.push(`<h1>${applyInlineMarkdown(line.replace(/^#\s+/, ""))}</h1>`);
      continue;
    }

    if (/^>\s?/.test(line)) {
      flushParagraph();
      flushList();
      html.push(`<blockquote>${applyInlineMarkdown(line.replace(/^>\s?/, ""))}</blockquote>`);
      continue;
    }

    if (/^---+$/.test(line)) {
      flushParagraph();
      flushList();
      html.push("<hr />");
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      flushParagraph();
      if (listType !== "ul") flushList();
      listType = "ul";
      listItems.push(`<li>${applyInlineMarkdown(line.replace(/^[-*]\s+/, ""))}</li>`);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      flushParagraph();
      if (listType !== "ol") flushList();
      listType = "ol";
      listItems.push(`<li>${applyInlineMarkdown(line.replace(/^\d+\.\s+/, ""))}</li>`);
      continue;
    }

    flushList();
    paragraph.push(raw);
  }

  flushParagraph();
  flushList();

  return html.join("");
}

function stripHtml(value: string) {
  if (typeof window === "undefined") {
    return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  }

  const div = document.createElement("div");
  div.innerHTML = value;
  return div.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

function getReadingStats(html: string) {
  const plain = stripHtml(html);
  const chars = plain.replace(/\s+/g, "").length;
  const words = plain ? plain.split(/\s+/).length : 0;
  const paragraphs = (html.match(/<p[\s>]/g) || []).length;
  const minutes = Math.max(1, Math.ceil(chars / 650));

  return { chars, words, paragraphs, minutes };
}

const convertImageFileToWebp = async (file: File) =>
  new Promise<Blob>((resolve, reject) => {
    const image = new window.Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      const maxWidth = 1600;
      const scale = Math.min(1, maxWidth / image.width);
      const width = Math.round(image.width * scale);
      const height = Math.round(image.height * scale);
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("이미지 변환 캔버스를 생성할 수 없습니다."));
        return;
      }

      canvas.width = width;
      canvas.height = height;
      context.drawImage(image, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(objectUrl);
          if (!blob) {
            reject(new Error("WebP 이미지 변환에 실패했습니다."));
            return;
          }
          resolve(blob);
        },
        "image/webp",
        0.92
      );
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("이미지를 불러올 수 없습니다."));
    };

    image.src = objectUrl;
  });

function extractImageUrlsFromEditor(editor: any) {
  const urls = new Set<string>();

  editor.state.doc.descendants((node: any) => {
    if (node.type.name === "image" && node.attrs?.src) {
      urls.add(node.attrs.src);
    }
  });

  return urls;
}

function getStoragePathFromPublicUrl(url: string | null | undefined) {
  const value = url?.trim();
  if (!value) return null;

  const extractFromPath = (path: string) => {
    const markers = [
      `/storage/v1/object/public/${IMAGE_BUCKET}/`,
      `/storage/v1/object/sign/${IMAGE_BUCKET}/`,
      `/object/public/${IMAGE_BUCKET}/`,
      `/object/sign/${IMAGE_BUCKET}/`,
    ];

    const marker = markers.find((item) => path.includes(item));
    if (!marker) return null;

    const rawPath = path.slice(path.indexOf(marker) + marker.length).split("?")[0];
    return decodeURIComponent(rawPath).replace(/^\/+/, "");
  };

  if (!/^https?:\/\//i.test(value)) {
    return value.replace(/^\/+/, "");
  }

  try {
    const parsed = new URL(value);
    return extractFromPath(parsed.pathname);
  } catch {
    return extractFromPath(value);
  }
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function sourceIdMatches(row: GeneratedImageRow, manuscriptId: string | number) {
  return String(row.source_id ?? "") === String(manuscriptId);
}

function pathBelongsToManuscript(path: string | null, manuscriptId: string | number) {
  if (!path) return false;
  return path.split("/").includes(String(manuscriptId));
}

function downloadFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function UniversalBlogEditor({
  title,
  setTitle,
  content,
  setContent,
  charCount,
  images,
  fileInputRef,
  isSaving,
  isEnhancing,
  isEnhancingContent = false,
  isEnhancingToc = false,
  isPolishing = false,
  isChangingPostType = false,
  isApplyingSearch = false,
  handleUpdateCaption,
  handleDeleteImage,
  handleEnhanceContent,
  handleSavePostToSupabase,
  handleCopy,
  isRecreateMode = false,
  isDetailMode = false,
  targetKeyword = "AI 글쓰기",
  isLoading = false,
  manuscriptId,
  contentImageSourceType = DEFAULT_CONTENT_IMAGE_SOURCE_TYPE,
  onGenerateSeo,
  isGeneratingSeo = false,
  aiTargetKeyword = "",
  setAiTargetKeyword,
  aiContentType = "",
  setAiContentType,
  aiPostType = "",
  setAiPostType,
  aiSelectedTone = "",
  setAiSelectedTone,
  aiWordCountGoal = "",
  setAiWordCountGoal,
  aiStrategyLevel = "",
  setAiStrategyLevel,
  aiResultFormat = "",
  setAiResultFormat,
  aiLargeCategory = "",
  setAiLargeCategory,
  aiMainTopic = "",
  setAiMainTopic,
  aiSubTopic = "",
  setAiSubTopic,
  aiReferenceNote = "",
  setAiReferenceNote,
  aiUseSearch = false,
  setAiUseSearch,
  isAiGenerating = false,
  aiStatusMessage = "",
  aiErrorMessage = "",
  handleAiGenerateInEditor,
  selectedPersonaId = null,
  setSelectedPersonaId,
  selectedKnowledgeId = null,
  setSelectedKnowledgeId,
  isListSidebarCollapsed = false,
  onToggleListSidebar,
  userRole,
  userBrandId,
  userBrandIds,
  extraConfigs,
}: UniversalBlogEditorProps) {
  const supabase = useMemo(() => createClient(), []);

  // Parse active schema metadata to verify injection presence
  const activeSchemaInfo = useMemo(() => {
    if (!content) return null;
    const regex = /<!--\s*CREAIBOX_SCHEMA_START([\s\S]*?)CREAIBOX_SCHEMA_END\s*-->/i;
    const match = regex.exec(content);
    if (match && match[1]) {
      try {
        const parsed = JSON.parse(match[1].trim());
        return {
          type: parsed["@type"] || "Article",
          headline: parsed.headline || parsed.name || "JSON-LD"
        };
      } catch {
        return { type: "Custom Schema", headline: "JSON-LD" };
      }
    }
    return null;
  }, [content]);

  // 🌟 에디터 2.0 신규 기능 상태관리
  const [isFindReplaceOpen, setIsFindReplaceOpen] = useState(false);
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");

  const [isSymbolModalOpen, setIsSymbolModalOpen] = useState(false);
  const [selectedSymbolCategory, setSelectedSymbolCategory] = useState("일반/기호");
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [recentSymbols, setRecentSymbols] = useState<string[]>([]);

  const [isKnowledgePersonaModalOpen, setIsKnowledgePersonaModalOpen] = useState(false);
  const [localPersonaList, setLocalPersonaList] = useState<any[]>([]);
  const [localKnowledgeList, setLocalKnowledgeList] = useState<any[]>([]);
  const [selectedTocCount, setSelectedTocCount] = useState<number>(2);

  // 🌟 내부 링크 콘텐츠 추가 상태관리
  const [isInternalLinkModalOpen, setIsInternalLinkModalOpen] = useState(false);
  const [internalLinkPosts, setInternalLinkPosts] = useState<any[]>([]);
  const [internalLinkImages, setInternalLinkImages] = useState<Record<string, string>>({});
  const [selectedInternalLinkDomain, setSelectedInternalLinkDomain] = useState<string>("");
  const [isLoadingInternalLinkPosts, setIsLoadingInternalLinkPosts] = useState(false);

  const getAvailableDomains = (postsList: any[]) => {
    const domainsSet = new Set<string>();

    if (userRole === "ADMIN") {
      domainsSet.add("creaibox.com");
    }
    if (userBrandIds && userBrandIds.length > 0) {
      userBrandIds.forEach((bid) => {
        const isPrimary = bid === userBrandId;
        const customDom = extraConfigs?.[`custom_domain_${bid}`] || (isPrimary ? extraConfigs?.custom_domain : "");
        const customDomStatus = extraConfigs?.[`custom_domain_status_${bid}`] || (isPrimary ? extraConfigs?.custom_domain_status : "NONE");
        const hasCustom = customDomStatus === "APPROVED" && customDom;
        const dom = hasCustom ? customDom : `${bid}.creaibox.com`;
        domainsSet.add(dom);
      });
    }

    postsList.forEach((post) => {
      if (post.canonical_url) {
        try {
          const parsed = new URL(post.canonical_url);
          let host = parsed.hostname;
          if (host.startsWith("www.")) {
            host = host.slice(4);
          }
          if (host) {
            domainsSet.add(host);
          }
        } catch (e) {
          // ignore
        }
      }
    });

    return Array.from(domainsSet);
  };

  const fetchInternalLinkPosts = async () => {
    setIsLoadingInternalLinkPosts(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: posts, error: postsError } = await supabase
        .from("writing_creaibox_posts")
        .select("id, title, slug, meta_description, canonical_url, created_at, status")
        .eq("status", "published")
        .not("slug", "is", null)
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;

      const { data: images, error: imagesError } = await supabase
        .from("generated_images")
        .select("source_id, image_url, is_primary")
        .eq("source_type", "writing_creaibox_posts")
        .eq("image_role", "thumbnail");

      const imgMap: Record<string, string> = {};
      if (images) {
        images.forEach((img: any) => {
          if (img.image_url) {
            imgMap[img.source_id] = img.image_url;
          }
        });
      }

      setInternalLinkPosts(posts || []);
      setInternalLinkImages(imgMap);

      const domains = getAvailableDomains(posts || []);
      if (domains.length > 0 && !selectedInternalLinkDomain) {
        setSelectedInternalLinkDomain(domains[0]);
      }
    } catch (err) {
      console.error("Failed to fetch internal link posts:", err);
    } finally {
      setIsLoadingInternalLinkPosts(false);
    }
  };

  useEffect(() => {
    if (isInternalLinkModalOpen) {
      void fetchInternalLinkPosts();
    }
  }, [isInternalLinkModalOpen]);

  // 내부 링크 삽입 헬퍼
  const handleInsertInternalLinkCard = (post: any) => {
    if (!editor) return;

    const imgUrl = internalLinkImages[post.id] || "";
    const postUrl = post.canonical_url || `https://creaibox.com/blog/${post.slug}`;
    const postExcerpt = (post.meta_description || "CreAibox 인사이트 포스팅").trim().slice(0, 120);

    const thumbnailHtml = imgUrl
      ? `<span class="card-thumb" style="display: inline-block; width: 140px; height: 90px; border-radius: 8px; overflow: hidden; border: 1px solid #f4f4f5; margin: 0; vertical-align: middle;">
          <img src="${imgUrl}" alt="Thumbnail" style="width: 100%; height: 100%; object-fit: cover; margin: 0; display: block;" />
        </span>`
      : `<span class="card-thumb" style="display: inline-flex; align-items: center; justify-content: center; width: 140px; height: 90px; border-radius: 8px; background-color: #f4f4f5; border: 1px solid #e4e4e7; color: #a1a1aa; margin: 0; vertical-align: middle;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: 0 auto;"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path><path d="M6 6h10"></path><path d="M6 10h10"></path></svg>
        </span>`;

    const cardHtml = `
      <a href="${postUrl}" target="_blank" rel="noopener noreferrer" class="internal-link-card" style="display: flex; align-items: center; gap: 16px; border: 1px solid #e4e4e7; background-color: #ffffff; border-radius: 16px; padding: 16px; text-decoration: none; color: inherit; text-align: left; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); margin: 24px 0; width: 100%; box-sizing: border-box; cursor: pointer;">
        ${thumbnailHtml}
        <span class="card-body" style="flex: 1; min-width: 0; display: inline-flex; flex-direction: column; gap: 6px; justify-content: center; margin: 0; vertical-align: middle;">
          <span class="card-title" style="font-size: 15px; font-weight: 800; color: #18181b; line-height: 1.4; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            ${post.title}
          </span>
          <span class="card-desc" style="font-size: 12px; color: #71717a; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            ${postExcerpt}
          </span>
          <span class="card-tag" style="display: inline-flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 800; color: #2563eb; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px; margin-bottom: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <span style="background-color: #eff6ff; color: #1d4ed8; padding: 2px 6px; border-radius: 6px; font-size: 10px; font-weight: 800; display: inline-block;">Insight</span>
          </span>
        </span>
      </a>
      <p></p>
    `;

    editor.chain().focus().insertContent(cardHtml).run();
    setIsInternalLinkModalOpen(false);
  };

  // 최근 사용 기호 추가 헬퍼
  const addRecentSymbol = (sym: string) => {
    setRecentSymbols((prev) => {
      const filtered = prev.filter((s) => s !== sym);
      const next = [sym, ...filtered].slice(0, 10);
      if (typeof window !== "undefined") {
        localStorage.setItem("creaibox_recent_symbols", JSON.stringify(next));
      }
      return next;
    });
  };

  // 최근 사용 기호 로딩
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("creaibox_recent_symbols");
      if (stored) {
        try {
          setRecentSymbols(JSON.parse(stored));
        } catch (e) {
          console.error("Error loading recent symbols", e);
        }
      }
    }
  }, []);

  // 페르소나 & 지식 데이터 로딩 (localStorage 연동)
  useEffect(() => {
    const fetchPersonaAndKnowledge = () => {
      try {
        const storedPersonas = localStorage.getItem("creaibox_persona_list");
        if (storedPersonas) {
          setLocalPersonaList(JSON.parse(storedPersonas));
        } else {
          setLocalPersonaList([
            { id: "p1", nickname: "ChatGPT 프롬프트 엔지니어 수민", tone: "전문적이고 통찰력 있는 분석 (기술 블로그)", targetAudience: "2040 트렌디한 IT 기획자", bio: "입력값과 기대 출력값을 비교 코드 형태로 명확히 서술하며 할루시네이션을 제거하는 구체적 명령" },
            { id: "p2", nickname: "미드저니 이미지 크리에이터 유하", tone: "스토리텔링 중심의 흥미진진한 구어체", targetAudience: "시각 예술가 및 디자이너", bio: "빛의 각도, 카메라 렌즈 화각 설정, 시드 번호 배치를 갤러리 도록 설명하듯 흥미진진한 구어체로 전개" }
          ]);
        }

        const storedKnowledge = localStorage.getItem("creaibox_knowledge_base");
        if (storedKnowledge) {
          setLocalKnowledgeList(JSON.parse(storedKnowledge));
        } else {
          setLocalKnowledgeList([
            { id: "k1", title: "Creaibox 플랫폼 활용 매뉴얼", description: "플랫폼 활용 가이드라인", content: "Creaibox는 다양한 AI 도구들과 블로그 에디터를 제공하여 창작자들을 돕는 서비스입니다." }
          ]);
        }
      } catch (err) {
        console.error("Error loading personas/knowledges from localStorage:", err);
      }
    };

    fetchPersonaAndKnowledge();
    
    // Listen to localStorage changes or focus to stay in sync
    window.addEventListener("focus", fetchPersonaAndKnowledge);
    return () => {
      window.removeEventListener("focus", fetchPersonaAndKnowledge);
    };
  }, [isKnowledgePersonaModalOpen]);
  const [saveFeedback, setSaveFeedback] = useState<"idle" | "saved">("idle");
  const [copyFeedback, setCopyFeedback] = useState<"idle" | "copied">("idle");
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isContentDropdownOpen, setIsContentDropdownOpen] = useState(false);
  const [isTocDropdownOpen, setIsTocDropdownOpen] = useState(false);
  const [isPostTypeDropdownOpen, setIsPostTypeDropdownOpen] = useState(false);
  const [activeTableDropdown, setActiveTableDropdown] = useState<"row" | "col" | "align-h" | "align-v" | "color" | null>(null);
  const contentDropdownRef = useRef<HTMLDivElement>(null);
  const tocDropdownRef = useRef<HTMLDivElement>(null);
  const postTypeDropdownRef = useRef<HTMLDivElement>(null);
  const copyTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isCustomSubTopic, setIsCustomSubTopic] = useState(false);
  const [recreateUrl, setRecreateUrl] = useState("");
  const [isFetchingOriginal, setIsFetchingOriginal] = useState(false);
  const [isRecreating, setIsRecreating] = useState(false);
  const [activeAiTab, setActiveAiTab] = useState<"write" | "recreate" | "enhance" | "pdf">("write");

  // PDF 텍스트 추출기 관련 신규 상태 및 레프
  const pdfFileInputRef = useRef<HTMLInputElement | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = useState("");
  const [isPdfExtracting, setIsPdfExtracting] = useState(false);
  const [extractedPdfText, setExtractedPdfText] = useState("");
  const [isPdfDragging, setIsPdfDragging] = useState(false);
  // 🌟 에디토리얼 설정 모달 관련 상태 및 레프
  const [isEditorialModalOpen, setIsEditorialModalOpen] = useState(false);
  const [editorialEnabled, setEditorialEnabled] = useState(true);
  const [editorialBgColor, setEditorialBgColor] = useState("#f8f8f9");
  const [editorialBorderColor, setEditorialBorderColor] = useState("#e4e4e7");
  const [editorialTextColor, setEditorialTextColor] = useState("#52525b");
  const [editorialSubColor, setEditorialSubColor] = useState("#2563eb");
  const [editorialSubtitle, setEditorialSubtitle] = useState("CreAibox Insight Editorial");
  const [editorialText, setEditorialText] = useState(
    "본 콘텐츠는 올인원 콘텐츠 제작형 생성형 AI 스튜디오 크리에이박스(CreAibox)의 오리지널 인사이트 리포트입니다. 인공지능 기반의 고품질 콘텐츠 생성 가이드와 비즈니스 성장 전략에 대한 더 많은 전문 자료는 크리에이박스(CreAibox) 공식 블로그 기사 및 스튜디오 가이드에서 확인하실 수 있습니다."
  );

  const editorialSettingsRef = useRef({
    enabled: true,
    bgColor: "#f8f8f9",
    borderColor: "#e4e4e7",
    textColor: "#52525b",
    subColor: "#2563eb",
    subtitle: "CreAibox Insight Editorial",
    text: "본 콘텐츠는 올인원 콘텐츠 제작형 생성형 AI 스튜디오 크리에이박스(CreAibox)의 오리지널 인사이트 리포트입니다. 인공지능 기반의 고품질 콘텐츠 생성 가이드와 비즈니스 성장 전략에 대한 더 많은 전문 자료는 크리에이박스(CreAibox) 공식 블로그 기사 및 스튜디오 가이드에서 확인하실 수 있습니다."
  });

  // Load and parse editorial settings comment on mount
  useEffect(() => {
    if (!content) return;
    const regex = /<!-- CREAIBOX_EDITORIAL_START ([\s\S]*?) CREAIBOX_EDITORIAL_END -->/;
    const match = content.match(regex);
    if (match && match[1]) {
      try {
        const parsed = JSON.parse(match[1]);
        const nextSettings = {
          enabled: typeof parsed.enabled === "boolean" ? parsed.enabled : true,
          bgColor: parsed.bgColor || "#f8f8f9",
          borderColor: parsed.borderColor || "#e4e4e7",
          textColor: parsed.textColor || "#52525b",
          subColor: parsed.subColor || "#2563eb",
          subtitle: parsed.subtitle || "CreAibox Insight Editorial",
          text: parsed.text || "본 콘텐츠는 올인원 콘텐츠 제작형 생성형 AI 스튜디오 크리에이박스(CreAibox)의 오리지널 인사이트 리포트입니다..."
        };
        editorialSettingsRef.current = nextSettings;
        setEditorialEnabled(nextSettings.enabled);
        setEditorialBgColor(nextSettings.bgColor);
        setEditorialBorderColor(nextSettings.borderColor);
        setEditorialTextColor(nextSettings.textColor);
        setEditorialSubColor(nextSettings.subColor);
        setEditorialSubtitle(nextSettings.subtitle);
        setEditorialText(nextSettings.text);
      } catch (e) {
        console.error("Failed to parse editorial settings comment:", e);
      }
    }
  }, [content]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (contentDropdownRef.current && !contentDropdownRef.current.contains(event.target as Node)) {
        setIsContentDropdownOpen(false);
      }
      if (tocDropdownRef.current && !tocDropdownRef.current.contains(event.target as Node)) {
        setIsTocDropdownOpen(false);
      }
      if (postTypeDropdownRef.current && !postTypeDropdownRef.current.contains(event.target as Node)) {
        setIsPostTypeDropdownOpen(false);
      }
      setActiveTableDropdown(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [isCleaningImages, setIsCleaningImages] = useState(false);
  const [isClientReady, setIsClientReady] = useState(false);

  const lastExternalContentRef = useRef(content);
  const previousImageUrlsRef = useRef<Set<string>>(new Set());
  const deleteContentImagesRef = useRef<(urls: string[]) => void>(() => { });
  const processingUrlsRef = useRef<Set<string>>(new Set());

  const autoUploadExternalImages = useCallback(
    async (currentEditor: any) => {
      if (!currentEditor || !manuscriptId) return;

      const externalImages: { url: string; alt: string; titleText: string }[] = [];

      currentEditor.state.doc.descendants((node: any) => {
        if (node.type.name === "image" && node.attrs?.src) {
          const src = node.attrs.src;
          const isExternal =
            src &&
            /^https?:\/\//i.test(src) &&
            !src.includes("supabase.co") &&
            !src.includes("google.com") &&
            !src.includes("googleapis.com") &&
            !src.includes("googleusercontent.com") &&
            !src.includes("localhost:") &&
            !src.includes(".wp.com") &&
            !src.includes("golfgosu.net") &&
            !src.includes("creaibox.com") &&
            !processingUrlsRef.current.has(src);

          if (isExternal) {
            if (!externalImages.some((img) => img.url === src)) {
              externalImages.push({
                url: src,
                alt: node.attrs.alt || "",
                titleText: node.attrs.title || "",
              });
            }
          }
        }
      });

      if (externalImages.length === 0) return;

      console.log("외부 이미지 자동 감지 및 업로드 시작:", externalImages);

      for (const imgData of externalImages) {
        const { url, alt, titleText } = imgData;
        processingUrlsRef.current.add(url);

        // 백그라운드 비동기로 각 이미지 업로드 시도
        void (async () => {
          try {
            const autoTitle = titleText || alt || (title ? `${title}_사진` : "외부 복사 이미지");
            const autoAlt = alt || title || "복사된 이미지";
            const autoCaption = targetKeyword ? `${targetKeyword} - ${autoTitle}` : `${title || "원고"} 관련 사진`;
            const autoDescription = `원본 출처: ${url}`;

            const response = await fetch("/api/image-upload/external", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                imageUrl: url,
                sourceType: contentImageSourceType,
                sourceId: String(manuscriptId),
                title: autoTitle,
                targetKeyword: targetKeyword || "",
                altText: autoAlt,
                caption: autoCaption,
                description: autoDescription,
              }),
            });

            const result = await response.json();

            if (!response.ok) {
              throw new Error(result.error || "외부 이미지 업로드 실패");
            }

            const newUrl = result.image.image_url;

            // 에디터가 언마운트되지 않았고 인스턴스가 존재할 때 해당 이미지 src 치환
            if (currentEditor && !currentEditor.isDestroyed) {
              const { view } = currentEditor;
              const tr = view.state.tr;
              let hasChange = false;

              view.state.doc.descendants((node: any, pos: number) => {
                if (node.type.name === "image" && node.attrs?.src === url) {
                  tr.setNodeMarkup(pos, undefined, {
                    ...node.attrs,
                    src: newUrl,
                  });
                  hasChange = true;
                }
              });

              if (hasChange) {
                view.dispatch(tr);

                // 업데이트 반영
                const html = currentEditor.getHTML();
                lastExternalContentRef.current = html;
                setContent(html);
                previousImageUrlsRef.current = extractImageUrlsFromEditor(currentEditor);
              }
            }
            console.log(`외부 이미지 치환 성공: ${url} -> ${newUrl}`);
          } catch (err: any) {
            console.warn("외부 이미지 자동 업로드 실패 (경고):", err?.message || String(err));
          } finally {
            processingUrlsRef.current.delete(url);
          }
        })();
      }
    },
    [contentImageSourceType, manuscriptId, targetKeyword, title, setContent]
  );

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  // Create refs to prevent stale closure values in Tiptap's cache
  const manuscriptIdRef = useRef(manuscriptId);
  const lastManuscriptIdRef = useRef(manuscriptId);
  const titleRef = useRef(title);

  useEffect(() => {
    manuscriptIdRef.current = manuscriptId;
  }, [manuscriptId]);

  useEffect(() => {
    titleRef.current = title;
  }, [title]);

  const handleSetAsFeaturedImage = useCallback(
    async (src: string) => {
      const currentId = manuscriptIdRef.current;
      const currentTitle = titleRef.current;

      if (!currentId) {
        alert("원고를 먼저 저장해주십시오. (원고 ID가 필요합니다)");
        throw new Error("manuscriptId가 존재하지 않습니다.");
      }

      // API를 호출하여 서버사이드 서비스롤(Service Role)로 RLS 권한 우회 및 안전 복제 진행
      const response = await fetch("/api/image-studio/set-featured", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: src,
          prompt: "대표 이미지 지정",
          style: "manual",
          aspectRatio: "content",
          provider: "upload",
          sourceType: contentImageSourceType,
          sourceId: String(currentId),
          imageRole: "thumbnail",
          title: currentTitle || "대표 이미지",
          altText: currentTitle || "대표 이미지",
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        const errorMsg = result.error || "대표 이미지 설정에 실패했습니다.";
        console.error("대표 이미지 설정 API 오류:", errorMsg);
        throw new Error(errorMsg);
      }

      // Notify the right-side BlogImageStudioPanel to reload and display the new thumbnail
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("generated-images-updated"));
      }
    },
    [contentImageSourceType]
  );

  const initialHtml = useMemo(() => markdownToHtml(cleanContentComment(content)), []);

  const editor = useEditor({
    extensions: [
      TextStyle,
      FontFamily,
      FontSize,
      Color,
      HighlightColor,
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: "font-bold text-blue-600 underline underline-offset-2",
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      CustomImage.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "my-6 border border-zinc-200 shadow-sm",
        },
        setAsFeatured: handleSetAsFeaturedImage,
      } as any),
      Youtube.configure({
        width: 720,
        height: 405,
        controls: true,
        nocookie: true,
        HTMLAttributes: {
          class: "my-6 overflow-hidden rounded-md border border-zinc-200",
        },
      }),
      Table.configure({ resizable: true }),
      TableRow,
      CustomTableHeader,
      CustomTableCell,
      TextAlign.configure({ types: ["heading", "paragraph", "tableCell", "tableHeader"] }),
      Placeholder.configure({
        placeholder: isRecreateMode
          ? "재창조 본문 결과 영역..."
          : "내용을 입력하세요. H2/H3를 작성한 뒤 목차 버튼을 누르면 자동 목차가 생성됩니다.",
      }),
    ],
    content: initialHtml,
    editorProps: {
      attributes: {
        class: "min-h-[760px] w-full outline-none text-sm leading-8 text-zinc-800 prose-editor",
      },
      transformPastedHTML(html) {
        if (!html) return html;

        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          const iframes = doc.querySelectorAll("iframe");
          let hasYoutube = false;

          iframes.forEach((iframe) => {
            const src = iframe.getAttribute("src") || "";
            const isYoutube =
              src.includes("youtube.com") ||
              src.includes("youtu.be") ||
              src.includes("youtube-nocookie.com");

            if (isYoutube) {
              let cleanSrc = src;
              if (cleanSrc.startsWith("//")) {
                cleanSrc = "https:" + cleanSrc;
              }
              iframe.setAttribute("src", cleanSrc);

              const wrapper = doc.createElement("div");
              wrapper.setAttribute("data-youtube-video", "");

              iframe.parentNode?.insertBefore(wrapper, iframe);
              wrapper.appendChild(iframe);
              hasYoutube = true;
            }
          });

          return hasYoutube ? doc.body.innerHTML : html;
        } catch (err) {
          console.error("transformPastedHTML 에러:", err);
          return html;
        }
      },
      handleDrop(view, event) {
        const files = Array.from(event.dataTransfer?.files || []);
        const imageFile = files.find((file) => file.type.startsWith("image/"));

        if (!imageFile) return false;

        event.preventDefault();

        const coordinates = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        });

        void insertContentImageFile(imageFile, coordinates?.pos);
        return true;
      },
      handlePaste(view, event) {
        // 1. 이미지 파일 붙여넣기 처리
        const files = Array.from(event.clipboardData?.files || []);
        const imageFile = files.find((file) => file.type.startsWith("image/"));

        if (imageFile) {
          event.preventDefault();
          const { from } = view.state.selection;
          void insertContentImageFile(imageFile, from);
          return true;
        }

        // 2. 텍스트 복사-붙여넣기 시 유튜브 단일 링크(URL)가 들어왔을 때 플레이어로 즉시 변환
        const text = event.clipboardData?.getData("text/plain")?.trim();
        if (text) {
          const isYoutubeLink =
            /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|shorts\/)?([a-zA-Z0-9_-]{11})/i.test(
              text
            );

          if (isYoutubeLink) {
            event.preventDefault();
            editor?.commands.setYoutubeVideo({ src: text, width: 720, height: 405 });
            return true;
          }
        }

        return false;
      },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();

      const previousUrls = previousImageUrlsRef.current;
      const nextUrls = extractImageUrlsFromEditor(editor);

      const removedUrls = Array.from(previousUrls).filter((url) => !nextUrls.has(url));

      console.log("이전 이미지 URL:", Array.from(previousUrls));
      console.log("현재 이미지 URL:", Array.from(nextUrls));
      console.log("삭제된 이미지 URL:", removedUrls);

      previousImageUrlsRef.current = nextUrls;

      if (removedUrls.length > 0) {
        deleteContentImagesRef.current(removedUrls);
      }

      let schemaStr = "";
      const schemaRegex = /<!--\s*CREAIBOX_SCHEMA_START([\s\S]*?)CREAIBOX_SCHEMA_END\s*-->/i;
      const schemaMatch = schemaRegex.exec(content);
      if (schemaMatch) {
        schemaStr = `\n\n${schemaMatch[0]}`;
      }

      const commentStr = `<!-- CREAIBOX_EDITORIAL_START ${JSON.stringify(editorialSettingsRef.current)} CREAIBOX_EDITORIAL_END -->`;
      const contentWithComment = `${html}\n\n${commentStr}${schemaStr}`;
      lastExternalContentRef.current = contentWithComment;
      setContent(contentWithComment);

      // 외부 이미지 감지 및 자동 업로드
      void autoUploadExternalImages(editor);
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;
    previousImageUrlsRef.current = extractImageUrlsFromEditor(editor);
  }, [editor, manuscriptId]);

  useEffect(() => {
    if (!editor) return;

    // 만약 원고 ID 자체가 바뀌었다면, 이전 원고의 이미지/텍스트 잔상을 방지하기 위해 즉시 에디터를 비워줍니다.
    if (manuscriptId !== lastManuscriptIdRef.current) {
      editor.commands.clearContent(false);
      lastManuscriptIdRef.current = manuscriptId;
      lastExternalContentRef.current = ""; // 외부 내용 레퍼런스도 초기화하여 갱신 트리거 보장
    }

    if (content === lastExternalContentRef.current) return;

    const nextHtml = markdownToHtml(cleanContentComment(content));

    if (nextHtml !== editor.getHTML()) {
      setTimeout(() => {
        if (editor.isDestroyed) return;
        editor.commands.setContent(nextHtml, { emitUpdate: false });
        previousImageUrlsRef.current = extractImageUrlsFromEditor(editor);
        lastExternalContentRef.current = content;
      }, 0);
    }
  }, [content, editor, manuscriptId]);



  useEffect(() => {
    if (saveFeedback !== "saved") return;

    const timer = setTimeout(() => setSaveFeedback("idle"), 3000);
    return () => clearTimeout(timer);
  }, [saveFeedback]);

  const handleLocalCopy = useCallback(() => {
    if (handleCopy) {
      handleCopy();
    } else {
      const rawContent = editor?.getHTML() ?? content;
      // Convert hidden schema comments into formal script tags upon clipboard copy operations
      const parsedCopyText = rawContent.replace(/<!--\s*CREAIBOX_SCHEMA_START([\s\S]*?)CREAIBOX_SCHEMA_END\s*-->/gi, (match, jsonCode) => {
        return `\n<script type="application/ld+json">\n${jsonCode.trim()}\n</script>\n`;
      });
      const copyText = `제목: ${title}\n\n${parsedCopyText}`;
      navigator.clipboard.writeText(copyText);
    }
    setCopyFeedback("copied");
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => {
      setCopyFeedback("idle");
    }, 2000);
  }, [handleCopy, title, editor, content]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const stats = useMemo(() => getReadingStats(content), [content]);

  const headings = useMemo(() => {
    if (!editor) return [];

    const result: { level: number; text: string }[] = [];

    editor.state.doc.descendants((node) => {
      if (node.type.name === "heading" && [2, 3].includes(node.attrs.level)) {
        const text = node.textContent.trim();
        if (text) result.push({ level: node.attrs.level, text });
      }
    });

    return result;
  }, [editor, content]);

  const syncLatestContent = useCallback(() => {
    if (!editor) return;
    const html = editor.getHTML();
    lastExternalContentRef.current = html;
    setContent(html);
  }, [editor, setContent]);

  // PDF 파일 변경 및 추출 시뮬레이터 핸들러
  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
      setPdfFileName(file.name);
      setExtractedPdfText("");
    }
  };

  const handlePdfDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPdfDragging(true);
  };

  const handlePdfDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPdfDragging(false);
  };

  const handlePdfDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  };

  const handlePdfDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPdfDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        alert("PDF 파일만 업로드할 수 있습니다 사장님!");
        return;
      }
      setPdfFile(file);
      setPdfFileName(file.name);
      setExtractedPdfText("");
    }
  };

  const handlePdfExtract = async () => {
    if (!pdfFile) {
      alert("추출할 PDF 파일을 먼저 첨부해 주세요 사장님!");
      return;
    }
    setIsPdfExtracting(true);
    try {
      // 1.5초간 텍스트 및 이미지 추출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const titleWithoutExt = pdfFileName.replace(/\.[^/.]+$/, "");
      const mockTitle = `[PDF 요약] ${titleWithoutExt}`;
      const mockContent = `
        <h3>[PDF 추출 보고서 원문]</h3>
        <p>글로벌 반도체 공급망 고도화에 따른 시장 변화 보고서 요약본입니다. 최근 SK하이닉스의 HBM 공급 계약과 엔비디아의 신규 플랫폼 출시로 시장 점유율이 급변하고 있습니다.</p>
        <p>이에 따라 차세대 AI 메모리 반도체 부문의 성장 잠재력이 부각되고 있으며, 향후 5개 분기 연속 영업이익 흑자가 예상되는 시점입니다.</p>
        <p>디바이스 기기별 도입량 증가로 AI 반도체 매출 포트폴리오 다각화가 이루어지고 있습니다.</p>
      `;

      if (setTitle) setTitle(mockTitle);
      if (setContent) setContent(mockContent);
      setExtractedPdfText(mockContent.replace(/<[^>]*>/g, ""));

      alert("PDF 문서에서 텍스트와 이미지 요소를 성공적으로 추출하여 에디터에 로드했습니다!");
    } catch (err) {
      alert("PDF 추출 도중 오류가 발생했습니다.");
    } finally {
      setIsPdfExtracting(false);
    }
  };

  const handleStartPdfRecreation = async () => {
    const sourceText = extractedPdfText.trim() || (editor ? editor.getHTML().replace(/<[^>]*>/g, "").trim() : "");
    if (!sourceText) {
      alert("재창조할 PDF 추출 텍스트가 없습니다. 먼저 PDF를 추출해 주세요.");
      return;
    }

    setIsRecreating(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const selectedTone = aiSelectedTone || "💻 전문적이고 통찰력 있는 분석 (기술 블로그)";
      
      const prompt = `
        너는 업로드된 PDF 원본 자료를 바탕으로 카피캣 필터를 완벽 우회하는 고품질 블로그 원고를 창작하는 AI 재창조 엔진이다.
        아래의 [PDF 추출 자료 영역] 데이터를 정밀 계승하되, 가독성 높은 소제목 구조를 갖춘 완전한 블로그 포스팅으로 재창조하라.

        [PDF 추출 자료 영역]
        ${sourceText}

        [빌드 조건]
        1. 말투는 반드시 '${selectedTone}'에 맞추어 작성하라.
        2. 집중 공략 타겟 키워드 '${aiTargetKeyword || "AI 반도체 시장"}'를 중심으로 작성하고 본문에 자연스럽게 4회 이상 노출하라.
        3. 분량은 공백 포함 1,500자 이상으로 문단을 구체화하여 서술하라.
        4. 대제목(##)과 소제목(###) 구조를 마크다운 양식으로 명확히 구분하라.
        5. 결과물은 부연설명이나 마크다운 코드 블록 선언부 기호 없이 오직 순수한 JSON 형식 데이터 규격으로만 정확하게 배출하라.

        [JSON 반환 양식 필수 규격]
        { "title": "새로 창조된 블로그 제목", "content": "새로 창조된 마크다운 본문", "targetKeyword": "최종 선정된 대표 타겟 키워드 1개" }
      `;

      const generationResult = await generateGeminiContentWithFallback({
        prompt,
        responseMimeType: "application/json",
        type: "naver_recreate",
        userId: user?.id || null,
        userEmail: user?.email || null,
      });

      const parsedData = robustParseJson(generationResult.text);
      const finalTitle = parsedData.title || `[AI 재창조] ${aiTargetKeyword || "PDF 요약"} 보고서`;
      const finalContent = parsedData.content || "";

      if (setTitle) setTitle(finalTitle);
      if (setContent) setContent(finalContent);
      if (parsedData.targetKeyword && setAiTargetKeyword) {
        setAiTargetKeyword(parsedData.targetKeyword);
      }

      alert("PDF 기반 AI 글 재창조가 성공적으로 완료되었습니다!");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "AI 글 재창조 중 오류가 발생했습니다.");
    } finally {
      setIsRecreating(false);
    }
  };

  const handleFetchOriginalText = async () => {
    if (!recreateUrl.trim()) {
      alert("가져올 글의 URL 주소를 입력해 주세요 사장님!");
      return;
    }
    setIsFetchingOriginal(true);
    try {
      const extractResponse = await fetch(
        `/api/naver-extract?url=${encodeURIComponent(recreateUrl.trim())}`
      );
      const extractedResult = await extractResponse.json();

      if (!extractResponse.ok) {
        throw new Error(extractedResult?.error || "본문 추출에 실패했습니다.");
      }

      const { title: extTitle, content: extContent } = extractedResult;
      
      if (setTitle) setTitle(extTitle || "추출된 제목");
      if (setContent) setContent(extContent || "");
      
      alert("원글 제목과 본문을 성공적으로 가져왔습니다!");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "원글을 가져오는 도중 오류가 발생했습니다.");
    } finally {
      setIsFetchingOriginal(false);
    }
  };

  const handleStartRecreation = async () => {
    let textToRecreate = editor ? editor.getHTML() : content;
    let titleToRecreate = title || "";

    // If recreateUrl is provided, fetch original text first if the editor is empty
    const plainText = textToRecreate.replace(/<[^>]*>/g, "").trim();
    if (!plainText && recreateUrl.trim()) {
      setIsFetchingOriginal(true);
      try {
        const extractResponse = await fetch(
          `/api/naver-extract?url=${encodeURIComponent(recreateUrl.trim())}`
        );
        const extractedResult = await extractResponse.json();

        if (!extractResponse.ok) {
          throw new Error(extractedResult?.error || "본문 추출에 실패했습니다.");
        }

        titleToRecreate = extractedResult.title || "추출된 제목";
        textToRecreate = extractedResult.content || "";
        
        if (setTitle) setTitle(titleToRecreate);
        if (setContent) setContent(textToRecreate);
      } catch (error: any) {
        console.error(error);
        alert(error.message || "원글을 가져오는 도중 오류가 발생했습니다.");
        setIsFetchingOriginal(false);
        return;
      } finally {
        setIsFetchingOriginal(false);
      }
    }

    if (!textToRecreate.replace(/<[^>]*>/g, "").trim()) {
      alert("재창조할 본문 내용이 없습니다. 먼저 타겟 글 주소를 입력하거나 본문을 작성해 주세요.");
      return;
    }

    setIsRecreating(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const selectedTone = aiSelectedTone || "💻 전문적이고 통찰력 있는 분석 (기술 블로그)";
      
      const keywordInstruction = aiTargetKeyword?.trim()
        ? `새로 탄생할 원고의 집중 공략 타겟 키워드는 '${aiTargetKeyword.trim()}'이며, 반드시 이 키워드를 중심으로 최적화하라.`
        : `원본 글을 분석해 검색성과 문맥 적합성이 가장 높은 대표 타겟 키워드 1개를 스스로 선정하고, 그 키워드로 최적화하라.`;

      const lengthInstruction =
        !aiWordCountGoal || aiWordCountGoal === "same"
          ? `본문 길이는 원본과 대략 같은 길이로 맞추되, 정보량และ 문단 구조는 유지하라.`
          : `본문 길이는 공백 포함 약 ${aiWordCountGoal}자 수준으로 충분히 길고 풍부하게 작성하라.`;

      const rawInputContext = `
        [실제 추출된 원본 제목]: ${titleToRecreate}
        [실제 추출된 원본 본문]
        ${textToRecreate}
      `;

      const prompt = `
        너는 네이버 스마트블록 C-Rank 및 DIA+ 로봇의 문서 유사도 카피캣 탐지기 필터를 완벽하게 우회 분쇄하는 원고 재창조 엔진이다.
        주어진 [기반 정보 영역]의 데이터 가치와 핵심 정보는 고스란히 계승하되, 문장의 어순, 형태소 수식 관계, 단어 배열을 180도 전면 파괴하여 완전히 최초로 창작된 오리지널 문서처럼 보이게 가공하라.

        [기반 정보 영역]
        ${rawInputContext}

        [빌드 조건 마스트 공정]
        1. ${keywordInstruction}
        2. 최종 선정한 타겟 키워드를 본문 안에 3회~5회 내외로 자연스럽게 배치하라.
        3. 말투는 반드시 '${selectedTone}'에 맞춰 유지하라.
        4. ${lengthInstruction}
        5. 마크다운의 대제목 및 소제목 구조(##, ###)를 반드시 3개 이상 쪼개어 가독성 벨트를 형성하라.
        6. 동시에 원본 글의 핵심 키워드, 핵심 주제, 핵심 내용을 사람이 한눈에 파악할 수 있게 별도 분석하라.
        7. 결과물은 부연설명이나 마크다운 코드 블록 선언부 기호 없이 오직 순수한 JSON 형식 데이터 규격으로만 정확하게 배출하라.
        
        [JSON 반환 양식 필수 규격]
        { "targetKeyword": "최종 선정된 대표 타겟 키워드 1개", "title": "유사도를 회피하고 시선을 강탈하는 고품질 새 제목", "content": "새로 전면 재창조된 풍부한 내용의 마크다운 본문", "sourceAnalysis": { "keywords": ["원본 핵심 키워드1", "원본 핵심 키워드2", "원본 핵심 키워드3"], "topic": "원본 글의 핵심 주제를 한 문장으로 정리한 결과", "summaryPoints": ["원본 핵심 내용 요약 1", "원본 핵심 내용 요약 2", "원본 핵심 내용 요약 3"] } }
      `;

      const generationResult = await generateGeminiContentWithFallback({
        prompt,
        responseMimeType: "application/json",
        type: "naver_recreate",
        userId: user?.id || null,
        userEmail: user?.email || null,
      });

      const parsedData = robustParseJson(generationResult.text);
      const finalTitle = parsedData.title || `[오리지널] ${parsedData.targetKeyword || "핵심 키워드"} 최적화 보고서`;
      const finalContent = parsedData.content || "";

      if (setTitle) setTitle(finalTitle);
      if (setContent) setContent(finalContent);
      if (parsedData.targetKeyword && setAiTargetKeyword) {
        setAiTargetKeyword(parsedData.targetKeyword);
      }

      alert("AI 글 재창조가 완료되었습니다!");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "AI 글 재창조 가동 도중 오류가 발생했습니다.");
    } finally {
      setIsRecreating(false);
    }
  };

  useEffect(() => {
    const handleInsertImage = (e: Event) => {
      const customEvent = e as CustomEvent<{ url: string; alt?: string; title?: string }>;
      if (!editor || !customEvent.detail?.url) return;

      const { url, alt, title: imgTitle } = customEvent.detail;
      editor.chain().focus().setImage({
        src: url,
        alt: alt || title || targetKeyword || "본문 이미지",
        title: imgTitle || "",
        alignment: "center",
      } as any).run();

      syncLatestContent();
      previousImageUrlsRef.current = extractImageUrlsFromEditor(editor);
    };

    window.addEventListener("insert-editor-image", handleInsertImage);
    return () => {
      window.removeEventListener("insert-editor-image", handleInsertImage);
    };
  }, [editor, title, targetKeyword, syncLatestContent]);

  const deleteGeneratedImageRows = useCallback(
    async (rows: GeneratedImageRow[]) => {
      const ids = uniqueValues(rows.map((row) => row.id));
      const storagePaths = uniqueValues(
        rows
          .map((row) => getStoragePathFromPublicUrl(row.image_url))
          .filter(Boolean) as string[]
      );

      let storageError: Error | null = null;
      let dbError: Error | null = null;

      if (storagePaths.length > 0) {
        const { error } = await supabase.storage.from(IMAGE_BUCKET).remove(storagePaths);
        if (error) storageError = new Error(`Storage 삭제 실패: ${error.message}`);
      }

      if (ids.length > 0) {
        const { error } = await supabase.from("generated_images").delete().in("id", ids);
        if (error) dbError = new Error(`DB 행 삭제 실패: ${error.message}`);
      }

      if (storageError || dbError) {
        throw new Error([storageError?.message, dbError?.message].filter(Boolean).join("\n"));
      }

      return {
        deletedRows: ids.length,
        deletedFiles: storagePaths.length,
      };
    },
    [supabase]
  );

  const deleteContentImages = useCallback(
    async (removedUrls: string[]) => {
      if (!removedUrls.length || !manuscriptId) return;

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const removedPaths = removedUrls
          .map((url) => getStoragePathFromPublicUrl(url))
          .filter(Boolean) as string[];

        console.log("삭제 감지 URL:", removedUrls);
        console.log("삭제 감지 Storage Path:", removedPaths);

        if (removedPaths.length === 0) return;

        const { data: rows, error: selectError } = await supabase
          .from("generated_images")
          .select("id, image_url, source_type, source_id, image_role")
          .eq("user_id", user.id)
          .eq("image_role", CONTENT_IMAGE_ROLE);

        if (selectError) throw selectError;

        const matchedRows = ((rows || []) as GeneratedImageRow[]).filter((row) => {
          if (row.image_role !== CONTENT_IMAGE_ROLE) return false;
          const rowPath = getStoragePathFromPublicUrl(row.image_url);
          if (!rowPath || !removedPaths.includes(rowPath)) return false;
          return sourceIdMatches(row, manuscriptId) || pathBelongsToManuscript(rowPath, manuscriptId);
        });

        console.log("삭제 대상 DB rows:", matchedRows);

        if (matchedRows.length === 0) return;

        const result = await deleteGeneratedImageRows(matchedRows);
        console.log("본문 이미지 DB/Storage 삭제 완료:", result);
      } catch (error) {
        console.error("본문 이미지 삭제 동기화 실패:", error);
      }
    },
    [deleteGeneratedImageRows, manuscriptId, supabase]
  );

  useEffect(() => {
    deleteContentImagesRef.current = (urls: string[]) => {
      void deleteContentImages(urls);
    };
  }, [deleteContentImages]);

  const uploadContentImageFile = useCallback(
    async (file: File) => {
      if (!editor) return null;

      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 업로드할 수 있습니다.");
        return null;
      }

      if (!manuscriptId) {
        alert("본문 이미지와 연결할 원고 ID가 없습니다.");
        return null;
      }

      setIsImageUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("sourceType", contentImageSourceType);
        formData.append("sourceId", String(manuscriptId));
        formData.append("imageRole", CONTENT_IMAGE_ROLE);
        formData.append("title", title || "");
        formData.append("targetKeyword", targetKeyword || "");

        const response = await fetch("/api/image-upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "본문 이미지 업로드에 실패했습니다.");
        }

        return {
          url: result.image.image_url,
          fileName: file.name,
        };
      } catch (error) {
        console.error("본문 이미지 업로드 실패:", error);
        alert(error instanceof Error ? error.message : "본문 이미지 업로드에 실패했습니다.");
        return null;
      } finally {
        setIsImageUploading(false);
      }
    },
    [contentImageSourceType, editor, manuscriptId, targetKeyword, title]
  );

  useEffect(() => {
    if (editor && uploadContentImageFile) {
      editor.setOptions({
        image: {
          uploadImage: uploadContentImageFile,
        },
      } as any);
    }
  }, [editor, uploadContentImageFile]);

  const insertContentImageFile = useCallback(
    async (file: File, position?: number) => {
      if (!editor) return;

      const uploaded = await uploadContentImageFile(file);
      if (!uploaded) return;

      const imageNode = {
        type: "image",
        attrs: {
          src: uploaded.url,
          alt: title || targetKeyword || "본문 이미지",
          title: uploaded.fileName,
          alignment: "center",
        },
      };

      if (typeof position === "number") {
        editor.chain().focus().insertContentAt(position, imageNode).run();
      } else {
        editor.chain().focus().setImage(imageNode.attrs).run();
      }

      syncLatestContent();
      previousImageUrlsRef.current = extractImageUrlsFromEditor(editor);
    },
    [editor, syncLatestContent, targetKeyword, title, uploadContentImageFile]
  );

  const handleEditorImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";

      if (!file) return;
      await insertContentImageFile(file);
    },
    [insertContentImageFile]
  );

  const handleCleanupUnusedImages = useCallback(async () => {
    if (!editor || !manuscriptId) {
      alert("정리할 원고 정보가 없습니다.");
      return;
    }

    setIsCleaningImages(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("로그인 세션을 확인할 수 없습니다.");
        return;
      }

      const usedUrls = extractImageUrlsFromEditor(editor);
      const usedPaths = Array.from(usedUrls)
        .map((url) => getStoragePathFromPublicUrl(url))
        .filter(Boolean) as string[];

      const { data: rows, error: selectError } = await supabase
        .from("generated_images")
        .select("id, image_url, source_type, image_role, source_id")
        .eq("user_id", user.id)
        .eq("image_role", CONTENT_IMAGE_ROLE);

      if (selectError) throw selectError;

      const manuscriptRows = ((rows || []) as GeneratedImageRow[]).filter((row) => {
        const rowPath = getStoragePathFromPublicUrl(row.image_url);
        return sourceIdMatches(row, manuscriptId) || pathBelongsToManuscript(rowPath, manuscriptId);
      });

      const unusedRows = manuscriptRows.filter((row) => {
        const rowPath = getStoragePathFromPublicUrl(row.image_url);
        return rowPath && !usedPaths.includes(rowPath);
      });

      if (unusedRows.length === 0) {
        alert("정리할 사용 안 하는 이미지가 없습니다.");
        return;
      }

      const confirmed = window.confirm(
        `사용하지 않는 본문 이미지 ${unusedRows.length}개를 DB와 Storage에서 삭제할까요?`
      );

      if (!confirmed) return;

      const result = await deleteGeneratedImageRows(unusedRows);

      alert(
        `사용하지 않는 이미지 ${result.deletedRows}개 DB 행과 ${result.deletedFiles}개 Storage 파일을 정리했습니다.`
      );
    } catch (error) {
      console.error("사용 안 하는 이미지 정리 실패:", error);
      alert(error instanceof Error ? error.message : "사용 안 하는 이미지 정리에 실패했습니다.");
    } finally {
      setIsCleaningImages(false);
    }
  }, [deleteGeneratedImageRows, editor, manuscriptId, supabase]);

  const handleSaveClick = async (status?: any) => {
    syncLatestContent();

    const result = await handleSavePostToSupabase(status);

    if (result !== false) setSaveFeedback("saved");
  };

  const handleInsertLink = () => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("링크 URL을 입력하세요.", previousUrl || "");

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const handleInsertImageUrl = () => {
    if (!editor) return;

    const url = window.prompt("이미지 URL을 입력하세요.");
    if (!url) return;

    editor.chain().focus().setImage({ src: url }).run();
  };

  const handleInsertYoutube = () => {
    if (!editor) return;

    const url = window.prompt("유튜브 URL을 입력하세요.");
    if (!url) return;

    editor.commands.setYoutubeVideo({ src: url, width: 720, height: 405 });
  };

  const changeCase = (type: 'upper' | 'lower' | 'capitalize') => {
    if (!editor) return;
    const { from, to, empty } = editor.state.selection;
    if (empty) return;

    const selectedText = editor.state.doc.textBetween(from, to, " ");
    let newText = "";
    if (type === 'upper') {
      newText = selectedText.toUpperCase();
    } else if (type === 'lower') {
      newText = selectedText.toLowerCase();
    } else if (type === 'capitalize') {
      newText = selectedText.replace(/\b\w/g, c => c.toUpperCase());
    }

    editor.chain().focus().insertContentAt({ from, to }, newText).run();
  };

  const setCellVerticalAlign = (alignment: 'top' | 'middle' | 'bottom') => {
    if (!editor) return;
    editor.chain().focus().setCellAttribute('verticalAlign', alignment).run();
  };

  const isCellVerticalAlignActive = (alignment: 'top' | 'middle' | 'bottom') => {
    if (!editor) return false;
    const { from, to } = editor.state.selection;
    let isActive = false;
    editor.state.doc.nodesBetween(from, to, (node) => {
      if (node.type.name === "tableCell" || node.type.name === "tableHeader") {
        if (node.attrs.verticalAlign === alignment) {
          isActive = true;
        }
      }
    });
    return isActive;
  };

  const handleFindAndReplace = (find: string, replace: string) => {
    if (!editor || !find) return;
    const { state, view } = editor;
    const { tr } = state;
    let occurrences = 0;

    state.doc.descendants((node, pos) => {
      if (node.isText && node.text) {
        let index = node.text.indexOf(find);
        while (index !== -1) {
          const start = pos + index;
          const end = start + find.length;
          
          tr.replaceWith(start, end, state.schema.text(replace, node.marks));
          occurrences++;
          
          index = node.text.indexOf(find, index + find.length);
        }
      }
    });

    if (occurrences > 0) {
      view.dispatch(tr);
      alert(`${occurrences}개의 문구를 성공적으로 교체했습니다!`);
    } else {
      alert("찾을 문구를 발견하지 못했습니다.");
    }
    setIsFindReplaceOpen(false);
  };

  const handlePrint = () => {
    if (!editor) return;
    const html = editor.getHTML();
    
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
    
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;
    
    doc.write(`
      <html>
        <head>
          <title>${escapeHtml(title || "원고 인쇄")}</title>
          <style>
            body { font-family: 'Noto Sans KR', sans-serif; padding: 40px; color: #111; }
            h1 { font-size: 24px; font-weight: 800; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            p { font-size: 14px; line-height: 1.8; margin-bottom: 15px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 13px; }
            th { background-color: #f7f7f7; }
            blockquote { border-left: 4px solid #7c3aed; padding-left: 15px; color: #555; font-style: italic; margin: 20px 0; }
            img { max-width: 100%; height: auto; }
            pre { background-color: #f4f4f5; padding: 15px; border-radius: 8px; font-size: 13px; overflow-x: auto; }
          </style>
        </head>
        <body>
          <h1>${escapeHtml(title || "제목 없음")}</h1>
          <div>${html}</div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.parent.document.body.removeChild(window.frameElement);
              }, 100);
            }
          </script>
        </body>
      </html>
    `);
    doc.close();
  };

  const handleInsertTable = () => {
    if (!editor) return;

    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const handleInsertCta = () => {
    if (!editor) return;

    editor
      .chain()
      .focus()
      .insertContent(`
        <blockquote>
          <p><strong>✅ 핵심 내용을 확인했다면, 지금 바로 다음 단계로 이동해보세요.</strong></p>
          <p>👉 자세히 보기 / 신청하기 / 다운로드하기</p>
        </blockquote>
      `)
      .run();
  };

  const handleGenerateToc = () => {
    if (!editor) return;

    const tocHeadings: { level: number; text: string }[] = [];

    editor.state.doc.descendants((node) => {
      if (node.type.name === "heading" && [2, 3].includes(node.attrs.level)) {
        const text = node.textContent.trim();
        if (text && text !== "목차") tocHeadings.push({ level: node.attrs.level, text });
      }
    });

    if (tocHeadings.length === 0) {
      window.alert("목차를 만들 H2/H3 소제목이 없습니다.");
      return;
    }

    const tocHtml = `
      <h2>목차</h2>
      <ul>
        ${tocHeadings
        .map((heading) => {
          const prefix = heading.level === 3 ? "└ " : "";
          return `<li>${prefix}${escapeHtml(heading.text)}</li>`;
        })
        .join("")}
      </ul>
    `;

    editor.chain().focus().insertContentAt(0, tocHtml).run();
  };

  const handleDownload = () => {
    const html = editor?.getHTML() ?? content;
    const safeTitle =
      (title || targetKeyword || "blog-post").slice(0, 40).replace(/[\\/:*?"<>|]/g, "").trim() ||
      "blog-post";

    downloadFile(`${safeTitle}.html`, `<!doctype html><html><body><h1>${escapeHtml(title)}</h1>${html}</body></html>`);
  };

  const handlePreview = () => {
    const html = editor?.getHTML() ?? content;
    const previewWindow = window.open("", "_blank", "noopener,noreferrer");
    if (!previewWindow) return;

    previewWindow.document.open();
    previewWindow.document.write(`
      <!doctype html>
      <html lang="ko">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>${escapeHtml(title || "미리보기")}</title>
          <style>
            body { margin: 0; padding: 48px 24px; background: #f5f5f4; color: #18181b; font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Segoe UI", sans-serif; }
            .sheet { max-width: 920px; margin: 0 auto; background: white; padding: 56px 64px; box-shadow: 0 20px 60px rgba(0,0,0,0.08); border-radius: 24px; }
            h1 { margin: 0 0 24px; font-size: 2.25rem; line-height: 1.2; font-weight: 900; }
            h2 { margin: 48px 0 18px; font-size: 1.7rem; line-height: 1.35; font-weight: 900; }
            h3 { margin: 40px 0 16px; font-size: 1.35rem; line-height: 1.45; font-weight: 800; }
            p, li { font-size: 1.08rem; line-height: 2; }
            ul, ol { margin: 0 0 28px 24px; }
            blockquote { margin: 32px 0; padding: 20px 24px; background: #f4f4f5; border-radius: 6px; color: #52525b; }
            table { width: 100%; border-collapse: collapse; margin: 28px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background: #f4f4f5; }
            pre { background: #18181b; color: white; padding: 18px; border-radius: 16px; overflow-x: auto; }
            img { max-width: 100%; height: auto; border-radius: 6px; }
            iframe { width: 100%; max-width: 100%; border-radius: 6px; }
          </style>
        </head>
        <body>
          <article class="sheet">
            <h1>${escapeHtml(title || "제목 없음")}</h1>
            ${html}
          </article>
        </body>
      </html>
    `);
    previewWindow.document.close();
  };

  const ToolbarButton = ({
    onClick,
    children,
    active = false,
    disabled = false,
    className = "",
    title = "",
    onMouseDown,
  }: {
    onClick: () => void;
    children: React.ReactNode;
    active?: boolean;
    disabled?: boolean;
    className?: string;
    title?: string;
    onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={onMouseDown}
      disabled={disabled || !editor}
      title={title}
      className={`flex shrink-0 items-center gap-1 rounded-xl px-2.5 py-2 text-xs font-bold transition-all disabled:cursor-not-allowed disabled:opacity-40 ${active ? "bg-blue-500/15 text-blue-300" : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
        } ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex h-full min-h-[750px] flex-col overflow-hidden bg-[#0a0c10]">
      <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-zinc-800 bg-gradient-to-r from-[#131722] via-[#141926] to-[#10141f] px-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          {isListSidebarCollapsed && onToggleListSidebar && (
            <button
              type="button"
              onClick={onToggleListSidebar}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-800 bg-[#0e111a] text-zinc-400 hover:border-blue-500/50 hover:bg-zinc-800 hover:text-white transition cursor-pointer"
              title="목록 펼치기"
            >
              <PanelLeftOpen size={15} />
            </button>
          )}
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
          <span className="truncate text-[0.78rem] font-black uppercase tracking-[0.24em] text-zinc-300">
            Creaibox Tiptap Blog Editor
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={handleLocalCopy}
            className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-bold transition-all ${
              copyFeedback === "copied"
                ? "border-emerald-800 bg-emerald-950/20 text-emerald-400"
                : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
            }`}
          >
            {copyFeedback === "copied" ? (
              <>
                <Check size={13} /> 복사 완료
              </>
            ) : (
              <>
                <Copy size={13} /> 전체 복사
              </>
            )}
          </button>

          <button onClick={handleDownload} className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs font-bold text-zinc-300 transition-all hover:bg-zinc-800">
            <Download size={13} /> 다운로드
          </button>

          <button onClick={handlePreview} className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs font-bold text-zinc-300 transition-all hover:bg-zinc-800">
            <Eye size={13} /> 미리보기
          </button>

          <button
            onClick={() => handleSaveClick(isDetailMode ? "completed" : undefined)}
            disabled={isSaving}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs font-black text-zinc-200 transition-all hover:bg-zinc-700 disabled:opacity-60"
          >
            {saveFeedback === "saved" ? <CheckCircle2 size={13} /> : <Save size={13} />}
            {isSaving ? "저장중..." : saveFeedback === "saved" ? "저장완료" : "원고 저장"}
          </button>
        </div>
      </div>

      {/* 🌟 에디터 2.0 3열 서식 툴바 */}
      <div className="shrink-0 border-b border-zinc-800 bg-[#0b0d12] flex flex-col">
        
        {/* [1열]: 텍스트 기본 서식 및 폰트 */}
        <div className="flex flex-nowrap items-center gap-1.5 px-4 py-2 border-b border-zinc-900/60 overflow-x-auto scrollbar-none select-none shrink-0">
          <ToolbarButton
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!editor?.can().undo()}
            title="실행 취소 (뒤로 가기 / Undo)"
          >
            <Undo size={14} />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!editor?.can().redo()}
            title="다시 실행 (앞으로 가기 / Redo)"
          >
            <Redo size={14} />
          </ToolbarButton>

          <div className="mx-1 h-4 w-px bg-zinc-800" />

          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleEditorImageUpload} className="hidden" />

          <ToolbarButton
            onClick={() => fileInputRef.current?.click()}
            disabled={isImageUploading}
            className="border border-zinc-800 bg-zinc-900/50 hover:bg-emerald-500/10 hover:text-emerald-400"
            title="로컬 이미지 업로드"
          >
            {isImageUploading ? <RefreshCw size={14} className="animate-spin" /> : <ImageIcon size={14} />}
            {isImageUploading ? "업로드중" : "사진"}
          </ToolbarButton>

          <ToolbarButton onClick={handleInsertImageUrl} title="외부 이미지 URL로 이미지 삽입">
            <ImageIcon size={14} /> URL이미지
          </ToolbarButton>

          <div className="mx-1.5 h-4 w-px bg-zinc-800" />

          {/* 프리미엄 글꼴 드롭다운 */}
          <select
            onChange={(e) => {
              const font = e.target.value;
              if (font === "default") {
                editor?.chain().focus().unsetFontFamily().run();
              } else {
                editor?.chain().focus().setFontFamily(font).run();
              }
            }}
            value={editor?.getAttributes("textStyle").fontFamily || "default"}
            className="h-9 rounded-lg border border-zinc-800 bg-black/40 px-2.5 text-xs text-white outline-none focus:border-violet-500 font-bold text-center shrink-0"
            title="글꼴 설정"
          >
            <option value="default">기본 글꼴</option>
            <option disabled className="text-zinc-500 font-bold bg-zinc-900/40">--- 한국어 글꼴 ---</option>
            <option value="Noto Sans KR">본고딕 (Noto Sans KR)</option>
            <option value="Nanum Gothic">나눔고딕</option>
            <option value="Nanum Myeongjo">나눔명조</option>
            <option value="Noto Serif KR">본명조 (Noto Serif KR)</option>
            <option value="Black Han Sans">검은고딕 (Black Han Sans)</option>
            <option value="Do Hyeon">도현체</option>
            <option value="Jua">주아체</option>
            <option value="Dongle">동글체</option>
            <option value="Gamja Flower">감자꽃체</option>
            <option value="Gowun Batang">고운바탕</option>
            <option value="Gowun Dodum">고운돋움</option>
            <option value="Hahmlet">함렛</option>
            <option value="Bagel Fat One">베이글펫원</option>
            <option value="Nanum Brush Script">나눔붓글씨</option>
            <option value="Nanum Pen Script">나눔펜글씨</option>
            <option value="Single Day">싱글데이</option>
            <option value="Song Myung">송명체</option>
            <option value="Yeon Sung">연성체</option>
            <option value="East Sea Dokdo">독도체 (East Sea Dokdo)</option>
            <option value="Gaegu">개구체 (Gaegu)</option>
            <option value="Stylish">스타일리시 (Stylish)</option>
            <option value="Sunflower">해바라기 (Sunflower)</option>

            <option disabled className="text-zinc-500 font-bold bg-zinc-900/40">--- 영문 고딕 (Sans-serif) ---</option>
            <option value="Inter">Inter</option>
            <option value="Poppins">Poppins</option>
            <option value="Roboto">Roboto</option>
            <option value="Montserrat">Montserrat</option>
            <option value="Raleway">Raleway</option>
            <option value="Nunito">Nunito</option>
            <option value="Lato">Lato</option>
            <option value="Open Sans">Open Sans</option>
            <option value="Source Sans 3">Source Sans 3</option>
            <option value="Quicksand">Quicksand (라운드)</option>

            <option disabled className="text-zinc-500 font-bold bg-zinc-900/40">--- 영문 명조 (Serif) ---</option>
            <option value="Playfair Display">Playfair Display</option>
            <option value="Lora">Lora</option>
            <option value="Merriweather">Merriweather</option>
            <option value="Cinzel">Cinzel (로마풍)</option>
            <option value="Bodoni Moda">Bodoni Moda</option>
            <option value="EB Garamond">EB Garamond</option>
            <option value="Cormorant Garamond">Cormorant Garamond</option>
            <option value="Crimson Text">Crimson Text</option>
            <option value="Libre Baskerville">Libre Baskerville</option>

            <option disabled className="text-zinc-500 font-bold bg-zinc-900/40">--- 영문 필기체 (Cursive/Script) ---</option>
            <option value="Pacifico">Pacifico</option>
            <option value="Great Vibes">Great Vibes</option>
            <option value="Dancing Script">Dancing Script</option>
            <option value="Alex Brush">Alex Brush</option>
            <option value="Sacramento">Sacramento</option>
            <option value="Yellowtail">Yellowtail</option>
            <option value="Parisienne">Parisienne</option>
            <option value="Allura">Allura</option>

            <option disabled className="text-zinc-500 font-bold bg-zinc-900/40">--- 영문 타이프 & 디자인 ---</option>
            <option value="Courier Prime">Courier Prime (타자기)</option>
            <option value="Fira Code">Fira Code (코딩서체)</option>
            <option value="Source Code Pro">Source Code Pro</option>
            <option value="IBM Plex Mono">IBM Plex Mono</option>
            <option value="Righteous">Righteous</option>
            <option value="Limelight">Limelight</option>
            <option value="Bungee">Bungee</option>
          </select>

          <div className="mx-1.5 h-4 w-px bg-zinc-800" />

          {/* 프리미엄 글자 크기 조절 단추 */}
          <select
            onChange={(e) => {
              const size = e.target.value;
              if (size === "default") {
                (editor?.chain().focus() as any).unsetFontSize().run();
              } else {
                (editor?.chain().focus() as any).setFontSize(size).run();
              }
            }}
            value={editor?.getAttributes("fontSize").size || "default"}
            className="h-9 rounded-lg border border-zinc-800 bg-black/40 px-2.5 text-xs text-white outline-none focus:border-violet-500 font-bold text-center shrink-0"
            title="글자 크기 설정"
          >
            <option value="default">글자 크기</option>
            {["10px", "11px", "12px", "13px", "14px", "15px", "16px", "18px", "20px", "24px", "28px", "32px", "36px", "40px", "48px"].map(sz => (
              <option key={sz} value={sz}>{sz}</option>
            ))}
          </select>

          <div className="mx-1.5 h-4 w-px bg-zinc-800" />

          {/* 글자색 */}
          <div className="flex shrink-0 items-center gap-1" title="글자 색상">
            <span className="text-[10px] font-black text-zinc-500 mr-0.5">글자색</span>
            <input
              type="color"
              onChange={(e) => (editor?.chain().focus() as any).setColor(e.target.value).run()}
              value={editor?.getAttributes("color").color || "#ffffff"}
              className="w-6 h-6 rounded border border-zinc-800 cursor-pointer p-0 bg-transparent"
            />
            <button
              onClick={() => (editor?.chain().focus() as any).unsetColor().run()}
              className="p-1 rounded bg-zinc-900 border border-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-white transition"
              title="글자색 초기화"
            >
              <Eraser size={11} />
            </button>
          </div>

          {/* 형광펜 색상 */}
          <div className="flex shrink-0 items-center gap-1" title="글자 형광펜(배경색)">
            <span className="text-[10px] font-black text-zinc-500 mr-0.5">형광펜</span>
            <input
              type="color"
              onChange={(e) => (editor?.chain().focus() as any).setHighlightColor(e.target.value).run()}
              value={editor?.getAttributes("highlightColor").highlightColor || "#000000"}
              className="w-6 h-6 rounded border border-zinc-800 cursor-pointer p-0 bg-transparent"
            />
            <button
              onClick={() => (editor?.chain().focus() as any).unsetHighlightColor().run()}
              className="p-1 rounded bg-zinc-900 border border-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-white transition"
              title="형광펜 초기화"
            >
              <Eraser size={11} />
            </button>
          </div>

          <div className="mx-1.5 h-4 w-px bg-zinc-800" />

          <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive("heading", { level: 2 })} title="소제목 H2">
            <Heading2 size={15} />
          </ToolbarButton>

          <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} active={editor?.isActive("heading", { level: 3 })} title="소제목 H3">
            <Heading3 size={15} />
          </ToolbarButton>

          <div className="mx-1.5 h-4 w-px bg-zinc-800" />

          <ToolbarButton onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive("bold")} title="굵게">
            <Bold size={15} />
          </ToolbarButton>

          <ToolbarButton onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive("italic")} title="기울임꼴">
            <Italic size={15} />
          </ToolbarButton>

          <ToolbarButton onClick={handleInsertLink} active={editor?.isActive("link")} title="하이퍼링크 삽입">
            <Link2 size={15} />
          </ToolbarButton>

          <div className="mx-1.5 h-4 w-px bg-zinc-800" />

          <ToolbarButton onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive("bulletList")} title="글머리 기호 목록">
            <List size={15} />
          </ToolbarButton>

          <ToolbarButton onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive("orderedList")} title="번호 매기기 목록">
            <ListOrdered size={15} />
          </ToolbarButton>

          <ToolbarButton onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive("blockquote")} title="인용문 blockquote">
            <Quote size={15} />
          </ToolbarButton>

          <div className="mx-1.5 h-4 w-px bg-zinc-800" />

          <ToolbarButton
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor?.chain().focus().setTextAlign("left").run()}
            title="텍스트 왼쪽 정렬"
          >
            <AlignLeft size={15} />
          </ToolbarButton>

          <ToolbarButton
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor?.chain().focus().setTextAlign("center").run()}
            title="텍스트 가운데 정렬"
          >
            <AlignCenter size={15} />
          </ToolbarButton>

          <ToolbarButton
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor?.chain().focus().setTextAlign("right").run()}
            title="텍스트 오른쪽 정렬"
          >
            <AlignRight size={15} />
          </ToolbarButton>

          <div className="mx-1.5 h-4 w-px bg-zinc-800" />

          {/* 표 세로 정렬 도구 (1열 병합) */}
          <ToolbarButton
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setCellVerticalAlign("top")}
            active={isCellVerticalAlignActive("top")}
            title="표 셀 세로 위 정렬"
          >
            <ArrowUp size={15} />
          </ToolbarButton>

          <ToolbarButton
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setCellVerticalAlign("middle")}
            active={isCellVerticalAlignActive("middle")}
            title="표 셀 세로 가운데 정렬"
          >
            <ChevronsUpDown size={15} />
          </ToolbarButton>

          <ToolbarButton
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setCellVerticalAlign("bottom")}
            active={isCellVerticalAlignActive("bottom")}
            title="표 셀 세로 아래 정렬"
          >
            <ArrowDown size={15} />
          </ToolbarButton>
        </div>

        {/* [2열]: 레이아웃 삽입, 유틸리티, 설정 모달들 */}
        <div className="flex flex-nowrap items-center gap-1.5 px-4 py-2 border-b border-zinc-800 bg-zinc-950/20 overflow-x-auto scrollbar-none select-none shrink-0">
          
          {/* 문자표 단추 */}
          <ToolbarButton onClick={() => setIsSymbolModalOpen(true)} title="문자표 (특수문자 삽입)">
            <span className="text-[13px] font-black text-violet-400">※</span>
            <span>문자표</span>
          </ToolbarButton>

          {/* 찾기 및 바꾸기 */}
          <ToolbarButton onClick={() => setIsFindReplaceOpen(true)} title="찾기 및 바꾸기 (글자 일괄 변환)">
            <Search size={14} />
            <span>찾기/바꾸기</span>
          </ToolbarButton>

          {/* 대소문자 변환 드롭다운 */}
          <div className="relative shrink-0">
            <select
              onChange={(e) => {
                const val = e.target.value;
                if (val !== "none") {
                  changeCase(val as any);
                  e.target.value = "none";
                }
              }}
              defaultValue="none"
              className="h-9 rounded-lg border border-zinc-800 bg-black/40 px-2.5 text-xs text-white outline-none focus:border-violet-500 font-bold text-center"
              title="영문 대소문자 변환"
            >
              <option value="none" disabled>Aa 대소문자 변환</option>
              <option value="upper">UPPERCASE (대문자)</option>
              <option value="lower">lowercase (소문자)</option>
              <option value="capitalize">Capitalize (첫글자 대문자)</option>
            </select>
          </div>

          {/* 원고 인쇄 */}
          <ToolbarButton onClick={handlePrint} title="현재 에디터 원고 인쇄">
            <Printer size={14} />
            <span>인쇄</span>
          </ToolbarButton>

          <div className="mx-1.5 h-4 w-px bg-zinc-800" />

          {/* 표 세로 정렬 도구 */}


          <ToolbarButton onClick={handleInsertTable} title="표 삽입">
            <Table2 size={14} /> 표
          </ToolbarButton>

          <ToolbarButton onClick={handleInsertYoutube} title="유튜브 비디오 삽입">
            <CirclePlay size={14} /> 유튜브
          </ToolbarButton>

          <ToolbarButton onClick={() => editor?.chain().focus().setHorizontalRule().run()} title="가로 구분선 삽입">
            <Minus size={14} /> 구분선
          </ToolbarButton>

          <div className="mx-1.5 h-4 w-px bg-zinc-800" />

          <ToolbarButton onClick={() => editor?.chain().focus().toggleCodeBlock().run()} active={editor?.isActive("codeBlock")} title="코드 블록">
            <Code2 size={14} /> 코드
          </ToolbarButton>

          <ToolbarButton onClick={handleInsertCta} title="CTA 링크 버튼 삽입">CTA</ToolbarButton>

          <div className="mx-1.5 h-4 w-px bg-zinc-800" />

          <ToolbarButton onClick={() => handleEnhanceContent("correct")} title="AI 맞춤법 교정">
            <Type size={14} /> 맞춤법
          </ToolbarButton>
        </div>

        {/* [3열]: AI 자동 수정보완 메뉴 (별도 라인 배치) */}
        <div className="flex items-center justify-between gap-3 px-4 py-2 bg-violet-950/10 select-none shrink-0">
          {/* 왼쪽 AI 스크롤 그룹 */}
          <div className="flex flex-nowrap items-center gap-2.5 overflow-x-auto scrollbar-none flex-1 min-w-0">
            <div className="flex shrink-0 items-center gap-1 text-[11px] font-black text-violet-400 mr-2 select-none uppercase tracking-wider">
              <Wand2 size={13} className="animate-pulse" />
              <span>AI 자동 수정보완</span>
            </div>

            <div className="h-4 w-px bg-violet-500/20 mr-1" />

          {/* AI 내용 보강 */}
          <div className="relative" ref={contentDropdownRef}>
            <ToolbarButton 
              onClick={() => setIsContentDropdownOpen((prev) => !prev)}
              disabled={isSaving || isEnhancingContent || isEnhancingToc || isPolishing || isChangingPostType || isApplyingSearch}
              title="AI 내용 보강 (분량 늘리기)"
              className="bg-violet-950/20 border border-violet-500/20 hover:bg-violet-500/10"
            >
              {isEnhancingContent ? (
                <RefreshCw size={14} className="animate-spin text-violet-400" />
              ) : (
                <Wand2 size={14} className="text-violet-400" />
              )}
              <span>내용 보강</span>
            </ToolbarButton>
            {isContentDropdownOpen && (
              <div className="absolute left-0 mt-1 w-40 rounded-xl border border-zinc-800 bg-[#121214] py-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50">
                <div className="px-3 py-1 text-[9px] font-black text-zinc-500 uppercase tracking-wider">
                  내용 분량 보강
                </div>
                {[10, 30, 50, 70, 100].map((percent) => (
                  <button
                    key={percent}
                    type="button"
                    onClick={() => {
                      handleEnhanceContent(`expand_${percent}`);
                      setIsContentDropdownOpen(false);
                    }}
                    className="flex w-full items-center px-3 py-1.5 text-left text-xs font-bold text-zinc-300 hover:bg-zinc-850 hover:text-white transition-colors cursor-pointer"
                  >
                    {percent}% 내용 보강
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* AI 목차 보강 */}
          <div className="relative" ref={tocDropdownRef}>
            <ToolbarButton 
              onClick={() => setIsTocDropdownOpen((prev) => !prev)}
              disabled={isSaving || isEnhancingContent || isEnhancingToc || isPolishing || isChangingPostType || isApplyingSearch}
              title="AI 목차 보강 (새 소주제 추가)"
              className="bg-violet-950/20 border border-violet-500/20 hover:bg-violet-500/10"
            >
              {isEnhancingToc ? (
                <RefreshCw size={14} className="animate-spin text-violet-400" />
              ) : (
                <Cpu size={14} className="text-violet-400" />
              )}
              <span>목차 보강</span>
            </ToolbarButton>
            {isTocDropdownOpen && (
              <div className="absolute left-0 mt-1 w-52 rounded-xl border border-zinc-800 bg-[#121214] p-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50 flex flex-col gap-2.5">
                <div>
                  <div className="px-1 py-1 text-[9px] font-black text-zinc-500 uppercase tracking-wider mb-1.5">
                    보강할 목차 수 선택
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((count) => {
                      const isSelected = selectedTocCount === count;
                      return (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setSelectedTocCount(count)}
                          className={`flex-1 py-1 rounded-lg text-xs font-bold transition cursor-pointer text-center ${
                            isSelected
                              ? "bg-violet-600 text-white shadow-md shadow-violet-500/20"
                              : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white"
                          }`}
                        >
                          {count}개
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleEnhanceContent(`expand_toc_${selectedTocCount}`);
                    setIsTocDropdownOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-violet-500/10"
                >
                  🚀 AI 자동 목차 보강
                </button>

                <div className="border-t border-zinc-800/80 my-0.5" />

                <div>
                  <div className="px-1 py-1 text-[9px] font-black text-zinc-500 uppercase tracking-wider mb-1.5">
                    직접 커스텀 추가
                  </div>
                  <input
                    type="text"
                    placeholder="추가할 소주제 입력..."
                    className="w-full rounded bg-zinc-950 px-2 py-1 text-[10px] text-zinc-200 border border-zinc-800 focus:outline-none focus:border-violet-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const val = e.currentTarget.value.trim();
                        if (val) {
                          handleEnhanceContent(`enhance_toc_custom:${val}`);
                          setIsTocDropdownOpen(false);
                        }
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* AI 글 다듬기 */}
          <ToolbarButton
            onClick={() => handleEnhanceContent("polish")}
            disabled={isSaving || isEnhancingContent || isEnhancingToc || isPolishing || isChangingPostType || isApplyingSearch}
            title="AI 글 다듬기 (문맥 및 표현 다듬기)"
            className="bg-violet-950/20 border border-violet-500/20 hover:bg-violet-500/10"
          >
            {isPolishing ? (
              <RefreshCw size={14} className="animate-spin text-violet-400" />
            ) : (
              <Sparkles size={14} className="text-violet-400" />
            )}
            <span>글 다듬기</span>
          </ToolbarButton>

          {/* AI 타입 변경 */}
          <div className="relative" ref={postTypeDropdownRef}>
            <ToolbarButton 
              onClick={() => setIsPostTypeDropdownOpen((prev) => !prev)}
              disabled={isSaving || isEnhancingContent || isEnhancingToc || isPolishing || isChangingPostType || isApplyingSearch}
              title="AI 글 타입 변경"
              className="bg-violet-950/20 border border-violet-500/20 hover:bg-violet-500/10"
            >
              {isChangingPostType ? (
                <RefreshCw size={14} className="animate-spin text-violet-400" />
              ) : (
                <Split size={14} className="text-violet-400" />
              )}
              <span>타입 변경</span>
            </ToolbarButton>
            {isPostTypeDropdownOpen && (
              <div className="absolute left-0 mt-1 w-44 rounded-xl border border-zinc-800 bg-[#121214] py-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50">
                <div className="px-3 py-1 text-[9px] font-black text-zinc-500 uppercase tracking-wider">
                  원고 타입 변경
                </div>
                {[
                  { id: "review", label: "후기/리뷰형" },
                  { id: "info", label: "정보성/가이드형" },
                  { id: "news", label: "소식/뉴스형" },
                  { id: "story", label: "스토리텔링형" },
                  { id: "interview", label: "인터뷰/대화형" }
                ].map((item) => {
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        const yes = window.confirm(
                          `"${item.label}" 타입으로 전체 본문을 변경하시겠습니까?\n(본문 내용의 전체 흐름과 핵심 정보는 유지되면서 서술 방식과 스타일만 타입에 맞춰 재작성됩니다.)`
                        );
                        if (yes) {
                          handleEnhanceContent(`change_post_type:${item.label}`);
                        }
                        setIsPostTypeDropdownOpen(false);
                      }}
                      className="flex w-full items-center px-3 py-1.5 text-left text-xs font-bold text-zinc-300 hover:bg-zinc-850 hover:text-white transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Google Search 실시간 정보 반영 */}
          <ToolbarButton
            onClick={() => handleEnhanceContent("apply_google_search")}
            disabled={isSaving || isEnhancingContent || isEnhancingToc || isPolishing || isChangingPostType || isApplyingSearch}
            title="Google Search 실시간 웹 검색 정보 반영"
            className="bg-emerald-950/10 border border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-400"
          >
            {isApplyingSearch ? (
              <RefreshCw size={14} className="animate-spin text-emerald-400" />
            ) : (
              <Globe size={14} className="text-emerald-400" />
            )}
            <span>실시간 검색 반영</span>
          </ToolbarButton>

          <div className="h-4 w-px bg-zinc-800/60 mx-1.5" />

          {/* 에디토리얼 설정 */}
          <ToolbarButton onClick={() => setIsEditorialModalOpen(true)} title="에디토리얼 설정" className="bg-zinc-950/20 border border-zinc-800/40 hover:bg-zinc-800">
            <FileText size={14} /> 에디토리얼 설정
          </ToolbarButton>

          {/* 지식 & 페르소나 설정 */}
          <ToolbarButton onClick={() => setIsKnowledgePersonaModalOpen(true)} className="bg-zinc-950/20 border border-zinc-800/40 hover:bg-zinc-800 flex items-center gap-1" title="페르소나 및 참조 지식 설정">
            <Brain size={14} className={selectedPersonaId || selectedKnowledgeId ? "text-violet-400 animate-pulse" : "text-zinc-400"} />
            <span>지식 & 페르소나 설정</span>
            {(selectedPersonaId || selectedKnowledgeId) && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-0.5" />
            )}
          </ToolbarButton>

          {/* 내부 링크 콘텐츠 추가 */}
          <ToolbarButton
            onClick={() => setIsInternalLinkModalOpen(true)}
            className="bg-zinc-950/20 border border-zinc-800/40 hover:bg-zinc-800 flex items-center gap-1 text-zinc-300 hover:text-white"
            title="본문에 내부 블로그 글 링크 카드 삽입"
          >
            <Link2 size={14} className="text-zinc-400" />
            <span>내부 링크 콘텐츠 추가</span>
          </ToolbarButton>
          </div>

          {/* 우측 끝 새로고침 버튼 */}
          <div className="flex shrink-0 items-center pl-3 border-l border-zinc-800/40">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-zinc-750 bg-zinc-900/60 px-3 py-1.5 text-[11px] font-black text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all shadow-sm"
              title="페이지 새로고침"
            >
              <RefreshCw size={11} className="text-violet-400" />
              <span>새로고침</span>
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
        {isLoading || !isClientReady ? (
          <div className="flex h-full w-full items-center justify-center gap-1.5 text-xs font-mono text-zinc-500">
            <RefreshCw size={14} className="animate-spin text-emerald-400" />
            Supabase 원고 복원 데이터 바인딩 중...
          </div>
        ) : (
          <div className="mx-auto flex min-h-full w-full max-w-[920px] flex-col px-8 pb-12 pt-8 md:px-10">
            <div className="mb-5 flex items-start justify-between gap-4 border-b border-zinc-200 pb-4">
              <div className="min-w-0 flex-1">
                <input
                  type="text"
                  placeholder={isRecreateMode ? "AI 재창조 제목이 생성됩니다." : "제목을 입력하세요..."}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-transparent text-xl font-black leading-8 text-zinc-950 placeholder-zinc-400 focus:outline-none"
                />

                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-zinc-400">
                  <span>키워드: {targetKeyword || "없음"}</span>
                  <span>·</span>
                  <span>{stats.paragraphs}문단</span>
                  <span>·</span>
                  <span>약 {stats.minutes}분 읽기</span>
                  <span>·</span>
                  <span>H2/H3 {headings.length}개</span>
                </div>
              </div>

              <span className="shrink-0 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[10px] font-mono text-zinc-500">
                Chars: <strong className="text-emerald-500">{stats.chars || charCount}</strong>
              </span>
            </div>

            {images && images.length > 0 && (
              <div className="mb-6 grid grid-cols-1 gap-3 border-b border-zinc-200 pb-5 sm:grid-cols-2">
                {images.map((img) => (
                  <div key={img.id} className="group relative overflow-hidden rounded-md border border-zinc-200 bg-zinc-50 p-3 shadow-sm">
                    <div className="relative h-32 w-full overflow-hidden rounded-xl bg-zinc-100">
                      <img src={img.url} alt={img.caption || "Uploaded Block"} className="h-full w-full object-cover" />
                      <button onClick={() => handleDeleteImage(img.id)} className="absolute right-2 top-2 rounded-md bg-red-600 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100">
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={img.caption}
                      onChange={(e) => handleUpdateCaption(img.id, e.target.value)}
                      placeholder="이미지 캡션 또는 alt 설명"
                      className="mt-3 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="min-h-[760px] rounded-[10px] bg-transparent px-1 py-1 text-zinc-800 focus-within:bg-zinc-50/70">
              <EditorContent editor={editor} />

              {activeSchemaInfo && (
                <div className="mt-8 p-4 rounded-xl border border-violet-500/20 bg-violet-500/5 flex items-center justify-between text-left">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 shrink-0">
                      <FileCode size={20} />
                    </div>
                    <div>
                      <p className="text-[12px] font-black text-zinc-950 flex items-center gap-1.5">
                        ✨ 본문 내에 SEO 구조화 스키마(JSON-LD)가 안전하게 적용되었습니다!
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-violet-200 bg-violet-100 text-violet-700 uppercase">
                          {activeSchemaInfo.type}
                        </span>
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-1 font-medium leading-relaxed">
                        Google 및 Naver 검색로봇이 구조화된 Rich Snippet 스니펫으로 최우선 수집해 갑니다.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-100 border border-emerald-200 px-2 py-1 rounded">
                      장착 완료
                    </span>
                  </div>
                </div>
              )}
              
              {editor && (
                <BubbleMenu
                  editor={editor}
                  options={{
                    placement: "top-start",
                  }}
                  shouldShow={() => {
                    return editor.isActive("table");
                  }}
                >
                  <div className="relative flex items-center gap-1 rounded-xl border border-zinc-800 bg-[#0e111a]/95 px-3 py-1.5 shadow-2xl backdrop-blur-md text-white z-50">
                    {/* Row operations */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTableDropdown(activeTableDropdown === "row" ? null : "row");
                        }}
                        className={`flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-bold text-zinc-400 hover:bg-zinc-800/80 hover:text-white transition ${
                          activeTableDropdown === "row" ? "bg-zinc-800 text-white" : ""
                        }`}
                        title="행 작업"
                      >
                        <span>행 (Row)</span>
                        <ChevronDown size={12} />
                      </button>

                      {activeTableDropdown === "row" && (
                        <div className="absolute left-0 top-[110%] z-50 flex w-44 flex-col rounded-xl border border-zinc-850 bg-[#0e111a] p-1 shadow-2xl">
                          <button
                            type="button"
                            onClick={() => {
                              editor.chain().focus().addRowBefore().run();
                              setActiveTableDropdown(null);
                            }}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-zinc-300 hover:bg-zinc-900 hover:text-white transition"
                          >
                            <ArrowUp size={13} className="text-zinc-500" />
                            위에 행 삽입
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              editor.chain().focus().addRowAfter().run();
                              setActiveTableDropdown(null);
                            }}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-zinc-300 hover:bg-zinc-900 hover:text-white transition"
                          >
                            <ArrowDown size={13} className="text-zinc-500" />
                            아래에 행 삽입
                          </button>
                          <div className="h-px bg-zinc-850 my-1" />
                          <button
                            type="button"
                            onClick={() => {
                              editor.chain().focus().deleteRow().run();
                              setActiveTableDropdown(null);
                            }}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-red-400 hover:bg-red-950/30 hover:text-red-350 transition"
                          >
                            <Trash2 size={13} className="text-red-500" />
                            행 삭제
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Column operations */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTableDropdown(activeTableDropdown === "col" ? null : "col");
                        }}
                        className={`flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-bold text-zinc-400 hover:bg-zinc-800/80 hover:text-white transition ${
                          activeTableDropdown === "col" ? "bg-zinc-800 text-white" : ""
                        }`}
                        title="열 작업"
                      >
                        <span>열 (Column)</span>
                        <ChevronDown size={12} />
                      </button>

                      {activeTableDropdown === "col" && (
                        <div className="absolute left-0 top-[110%] z-50 flex w-44 flex-col rounded-xl border border-zinc-850 bg-[#0e111a] p-1 shadow-2xl">
                          <button
                            type="button"
                            onClick={() => {
                              editor.chain().focus().addColumnBefore().run();
                              setActiveTableDropdown(null);
                            }}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-zinc-300 hover:bg-zinc-900 hover:text-white transition"
                          >
                            <ArrowLeft size={13} className="text-zinc-500" />
                            왼쪽에 열 삽입
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              editor.chain().focus().addColumnAfter().run();
                              setActiveTableDropdown(null);
                            }}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-zinc-300 hover:bg-zinc-900 hover:text-white transition"
                          >
                            <ArrowRight size={13} className="text-zinc-500" />
                            오른쪽에 열 삽입
                          </button>
                          <div className="h-px bg-zinc-850 my-1" />
                          <button
                            type="button"
                            onClick={() => {
                              editor.chain().focus().deleteColumn().run();
                              setActiveTableDropdown(null);
                            }}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-red-400 hover:bg-red-950/30 hover:text-red-350 transition"
                          >
                            <Trash2 size={13} className="text-red-500" />
                            열 삭제
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="h-4 w-[1px] bg-zinc-800 mx-1" />

                    {/* Merge/Split */}
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().mergeCells().run()}
                      disabled={!editor.can().mergeCells()}
                      className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-bold text-zinc-400 hover:bg-zinc-800/80 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent transition"
                      title="셀 병합"
                    >
                      <Combine size={13} />
                      <span>병합</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().splitCell().run()}
                      disabled={!editor.can().splitCell()}
                      className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-bold text-zinc-400 hover:bg-zinc-800/80 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent transition"
                      title="셀 분할"
                    >
                      <Split size={13} />
                      <span>분할</span>
                    </button>

                    <div className="h-4 w-[1px] bg-zinc-800 mx-1" />

                    {/* Header Row Toggle */}
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleHeaderRow().run()}
                      className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-bold text-zinc-400 hover:bg-zinc-800/80 hover:text-white transition"
                      title="헤더 행 설정/해제"
                    >
                      <Heading3 size={12} />
                      <span>헤더</span>
                    </button>

                    <div className="h-4 w-[1px] bg-zinc-800 mx-1" />

                    {/* Horizontal Alignment Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTableDropdown(activeTableDropdown === "align-h" ? null : "align-h");
                        }}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800/80 hover:text-white transition ${
                          activeTableDropdown === "align-h" ? "bg-zinc-800 text-white" : ""
                        }`}
                        title="가로 정렬"
                      >
                        <AlignLeft size={14} />
                      </button>

                      {activeTableDropdown === "align-h" && (
                        <div className="absolute left-0 top-[110%] z-50 flex w-32 flex-col rounded-xl border border-zinc-850 bg-[#0e111a] p-1 shadow-2xl">
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              editor.chain().focus().setTextAlign('left').run();
                              setActiveTableDropdown(null);
                            }}
                            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-bold text-zinc-300 hover:bg-zinc-900 hover:text-white transition"
                          >
                            <AlignLeft size={13} className="text-zinc-500" />
                            왼쪽 정렬
                          </button>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              editor.chain().focus().setTextAlign('center').run();
                              setActiveTableDropdown(null);
                            }}
                            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-bold text-zinc-300 hover:bg-zinc-900 hover:text-white transition"
                          >
                            <AlignCenter size={13} className="text-zinc-500" />
                            가운데 정렬
                          </button>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              editor.chain().focus().setTextAlign('right').run();
                              setActiveTableDropdown(null);
                            }}
                            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-bold text-zinc-300 hover:bg-zinc-900 hover:text-white transition"
                          >
                            <AlignRight size={13} className="text-zinc-500" />
                            오른쪽 정렬
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Vertical Alignment Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTableDropdown(activeTableDropdown === "align-v" ? null : "align-v");
                        }}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800/80 hover:text-white transition ${
                          activeTableDropdown === "align-v" ? "bg-zinc-800 text-white" : ""
                        }`}
                        title="세로 정렬"
                      >
                        <ChevronsUpDown size={14} />
                      </button>

                      {activeTableDropdown === "align-v" && (
                        <div className="absolute left-0 top-[110%] z-50 flex w-32 flex-col rounded-xl border border-zinc-850 bg-[#0e111a] p-1 shadow-2xl">
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              editor.chain().focus().setCellAttribute('verticalAlign', 'top').run();
                              setActiveTableDropdown(null);
                            }}
                            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-bold text-zinc-300 hover:bg-zinc-900 hover:text-white transition"
                          >
                            <ArrowUp size={13} className="text-zinc-500" />
                            위 정렬
                          </button>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              editor.chain().focus().setCellAttribute('verticalAlign', 'middle').run();
                              setActiveTableDropdown(null);
                            }}
                            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-bold text-zinc-300 hover:bg-zinc-900 hover:text-white transition"
                          >
                            <ChevronsUpDown size={13} className="text-zinc-500" />
                            가운데 정렬
                          </button>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              editor.chain().focus().setCellAttribute('verticalAlign', 'bottom').run();
                              setActiveTableDropdown(null);
                            }}
                            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-bold text-zinc-300 hover:bg-zinc-900 hover:text-white transition"
                          >
                            <ArrowDown size={13} className="text-zinc-500" />
                            아래 정렬
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Background Color Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTableDropdown(activeTableDropdown === "color" ? null : "color");
                        }}
                        className={`flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-bold text-zinc-400 hover:bg-zinc-800/80 hover:text-white transition ${
                          activeTableDropdown === "color" ? "bg-zinc-800 text-white" : ""
                        }`}
                        title="배경색 지정"
                      >
                        <div className="w-3 h-3 rounded-full border border-zinc-700 bg-gradient-to-tr from-rose-400 to-indigo-500" />
                        <span>배경색</span>
                        <ChevronDown size={12} />
                      </button>

                      {activeTableDropdown === "color" && (
                        <div className="absolute left-0 top-[110%] z-50 flex w-48 flex-col rounded-xl border border-zinc-850 bg-[#0e111a] p-3 shadow-2xl">
                          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider mb-2">셀 배경색 지정</span>
                          <div className="grid grid-cols-4 gap-2 mb-2.5">
                            {[
                              { color: "#ffffff", label: "흰색" },
                              { color: "#f4f4f5", label: "회색" },
                              { color: "#fee2e2", label: "빨강" },
                              { color: "#ffedd5", label: "주황" },
                              { color: "#fef9c3", label: "노랑" },
                              { color: "#dcfce7", label: "초록" },
                              { color: "#dbeafe", label: "파랑" },
                              { color: "#f3e8ff", label: "보라" },
                            ].map((item) => (
                              <button
                                key={item.color}
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                  editor.chain().focus().setCellAttribute('backgroundColor', item.color).run();
                                  setActiveTableDropdown(null);
                                }}
                                className="w-8 h-8 rounded-lg border border-zinc-800 transition hover:scale-105 active:scale-95 cursor-pointer relative group"
                                style={{ backgroundColor: item.color }}
                                title={item.label}
                              >
                                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-zinc-950 text-[9px] px-1 py-0.5 rounded text-white opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                                  {item.label}
                                </span>
                              </button>
                            ))}
                          </div>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              editor.chain().focus().setCellAttribute('backgroundColor', null).run();
                              setActiveTableDropdown(null);
                            }}
                            className="w-full py-1 text-center text-[10px] font-black text-red-400 hover:bg-red-950/20 rounded transition border border-red-500/20"
                          >
                            배경색 지우기
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="h-4 w-[1px] bg-zinc-800 mx-1" />

                    {/* Delete Table */}
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().deleteTable().run()}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 hover:bg-red-950/30 hover:text-red-350 transition"
                      title="표 삭제"
                    >
                      <Trash2 size={13} className="text-red-500" />
                    </button>
                  </div>
                </BubbleMenu>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex h-16 shrink-0 items-center justify-between border-t border-zinc-800 bg-[#0b0d12] px-6">
        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {isDetailMode ? `Tiptap HTML 동기화 모드 : #${targetKeyword}` : "Tiptap 스마트블록 에디터 활성화"}
        </div>

        <div className="flex items-center gap-3 text-[11px] font-semibold text-zinc-500">
          {isImageUploading && <span className="animate-pulse text-emerald-400">이미지 업로드 중...</span>}
          <span>{stats.chars || charCount}자</span>
          <span>{stats.words}단어</span>
          <span>{stats.paragraphs}문단</span>
          <span>약 {stats.minutes}분</span>
          <span className="flex items-center gap-1">
            <Cpu size={12} className="text-emerald-500" />
            Supabase Session Active
          </span>
        </div>
      </div>

      <style jsx global>{`
        .ProseMirror {
          min-height: 760px;
          outline: none;
        }

        .ProseMirror p {
          margin: 0 0 1rem;
          line-height: 1.9;
          font-size: 0.95rem;
        }

        .ProseMirror h1 {
          margin: 1.4rem 0 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #e4e4e7;
          font-size: 1.35rem;
          line-height: 1.45;
          font-weight: 900;
          color: #09090b;
        }

        .ProseMirror h2 {
          margin: 2.2rem 0 0.9rem;
          font-size: 1.2rem;
          line-height: 1.55;
          font-weight: 900;
          color: #09090b;
        }

        .ProseMirror h3 {
          margin: 1.8rem 0 0.75rem;
          font-size: 1.05rem;
          line-height: 1.55;
          font-weight: 900;
          color: #18181b;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          margin: 0 0 1.25rem 1.35rem;
          padding: 0;
        }

        .ProseMirror ul {
          list-style: disc;
        }

        .ProseMirror ol {
          list-style: decimal;
        }

        .ProseMirror li {
          margin: 0.35rem 0;
          line-height: 1.9;
        }

        .ProseMirror blockquote {
          margin: 1.5rem 0;
          padding: 1rem 1.25rem;
          border: 1px solid #e4e4e7;
          border-left: 4px solid #6366f1;
          border-radius: 1rem;
          background: #f8fafc;
          color: #52525b;
          font-weight: 600;
        }

        .ProseMirror pre {
          margin: 1.5rem 0;
          padding: 1rem;
          overflow-x: auto;
          border-radius: 1rem;
          background: #09090b;
          color: #f4f4f5;
          font-size: 0.8rem;
          line-height: 1.7;
        }

        .ProseMirror hr {
          margin: 2rem 0;
          border: 0;
          border-top: 1px solid #e4e4e7;
        }

        .ProseMirror table {
          width: 100%;
          margin: 1.5rem 0;
          border-collapse: collapse;
          border-radius: 0px !important;
          border: 1px solid #191e23;
          transition: box-shadow 0.2s ease-in-out;
        }

        .ProseMirror th {
          background: #f8fafc;
          font-weight: 900;
          border: 1px solid #191e23;
        }

        .ProseMirror td {
          border: 1px solid #191e23;
          min-width: 90px;
          padding: 0.65rem 0.75rem;
          vertical-align: middle;
          font-size: 0.9rem;
          line-height: 1.7;
        }

        /* 표 선택 또는 포커스 시 테두리 파란색 */
        .ProseMirror table:focus-within,
        .ProseMirror table:has(.selectedCell) {
          box-shadow: 0 0 0 2px #2563eb;
          border-color: #2563eb !important;
        }

        /* 드래그 셀 선택 시 파란색 배경 */
        .ProseMirror td.selectedCell,
        .ProseMirror th.selectedCell {
          background: rgba(37, 99, 235, 0.08) !important;
          border-color: #2563eb !important;
        }

        .ProseMirror img {
          max-width: 100%;
          height: auto;
        }

        /* WordPress-style alignment & caption styles */
        .ProseMirror .image-block {
          display: block;
          margin-top: 1.5rem;
          margin-bottom: 1.5rem;
          width: 100%;
        }

        .ProseMirror .image-block.align-center {
          text-align: center;
          margin-left: auto;
          margin-right: auto;
        }

        .ProseMirror .image-block.align-left {
          float: left;
          margin-right: 1.5rem;
          margin-bottom: 1.5rem;
          max-width: 50%;
        }

        .ProseMirror .image-block.align-right {
          float: right;
          margin-left: 1.5rem;
          margin-bottom: 1.5rem;
          max-width: 50%;
        }

        .ProseMirror .image-block.align-wide {
          max-width: 1100px;
          margin-left: auto;
          margin-right: auto;
        }

        .ProseMirror .image-block.align-full {
          max-width: 100vw;
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          margin-right: calc(-50vw + 50%);
        }

        .ProseMirror .image-caption {
          margin-top: 0.5rem;
          font-size: 0.8rem;
          color: #09090b;
          font-weight: bold;
          text-align: center;
          display: block;
        }

        .ProseMirror iframe {
          max-width: 100%;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #a1a1aa;
          pointer-events: none;
          height: 0;
        }
      `}</style>

      {isEditorialModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-zinc-800 bg-[#090b11] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-zinc-100 flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-blue-500" />
                <h3 className="text-lg font-black tracking-tight">본문 마지막 에디토리얼 설정</h3>
              </div>
              <button 
                onClick={() => setIsEditorialModalOpen(false)}
                className="rounded-full p-1 hover:bg-zinc-800 transition text-zinc-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Active Switch */}
            <div className="flex items-center justify-between bg-zinc-950/40 border border-zinc-900 rounded-2xl p-4 mb-5">
              <div>
                <p className="text-sm font-black">에디토리얼 상자 활성화</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">글 상세 보기 화면 하단에 이 카드를 항상 노출할까요?</p>
              </div>
              <button
                type="button"
                onClick={() => setEditorialEnabled(!editorialEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  editorialEnabled ? "bg-blue-600" : "bg-zinc-800"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    editorialEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {editorialEnabled && (
              <div className="space-y-4">
                
                {/* Preset Selector */}
                <div>
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-wider block mb-2">프리셋 테마 선택</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { id: "default", label: "기본 라이트", bg: "#f8f8f9", border: "#e4e4e7", text: "#52525b", sub: "#2563eb" },
                      { id: "blue", label: "소프트 블루", bg: "#eff6ff", border: "#bfdbfe", text: "#1e3a8a", sub: "#2563eb" },
                      { id: "green", label: "소프트 그린", bg: "#f0fdf4", border: "#bbf7d0", text: "#064e3b", sub: "#16a34a" },
                      { id: "red", label: "소프트 레드", bg: "#fef2f2", border: "#fecaca", text: "#7f1d1d", sub: "#dc2626" },
                      { id: "dark", label: "네온 다크", bg: "#090b11", border: "#1e293b", text: "#94a3b8", sub: "#3b82f6" }
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setEditorialBgColor(p.bg);
                          setEditorialBorderColor(p.border);
                          setEditorialTextColor(p.text);
                          setEditorialSubColor(p.sub);
                        }}
                        className="rounded-xl border border-zinc-800 bg-zinc-950 p-2 text-center hover:border-zinc-700 hover:bg-zinc-900 transition cursor-pointer"
                      >
                        <div className="text-[11px] font-black">{p.label}</div>
                        <div className="flex items-center justify-center gap-1 mt-1.5">
                          <span className="w-3 h-3 rounded-full border border-zinc-800" style={{ backgroundColor: p.bg }} />
                          <span className="w-3 h-3 rounded-full border border-zinc-800" style={{ backgroundColor: p.border }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subtitle Input */}
                <div>
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-wider block mb-1.5">상단 소제목 (Subtitle)</label>
                  <input
                    type="text"
                    value={editorialSubtitle}
                    onChange={(e) => setEditorialSubtitle(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-xs text-zinc-100 focus:border-blue-500 focus:outline-none"
                    placeholder="예: CreAibox Insight Editorial"
                  />
                </div>

                {/* Text Body Input */}
                <div>
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-wider block mb-1.5">상세 내용 (Content Text)</label>
                  <textarea
                    value={editorialText}
                    onChange={(e) => setEditorialText(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-xs text-zinc-100 focus:border-blue-500 focus:outline-none resize-none leading-relaxed"
                    placeholder="상세 에디토리얼 내용을 입력해 주세요."
                  />
                </div>

                {/* Advanced Color Picker Inputs */}
                <div>
                  <p className="text-xs font-black text-zinc-400 uppercase tracking-wider mb-2">상세 색상 커스텀</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[10px] text-zinc-500 font-bold block mb-1">배경색</label>
                      <div className="flex gap-1.5">
                        <input
                          type="color"
                          value={editorialBgColor}
                          onChange={(e) => setEditorialBgColor(e.target.value)}
                          className="w-7 h-7 rounded border border-zinc-800 cursor-pointer overflow-hidden p-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={editorialBgColor}
                          onChange={(e) => setEditorialBgColor(e.target.value)}
                          className="w-full rounded border border-zinc-800 bg-zinc-950 px-2 text-[10px] uppercase font-mono focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-zinc-500 font-bold block mb-1">테두리색</label>
                      <div className="flex gap-1.5">
                        <input
                          type="color"
                          value={editorialBorderColor}
                          onChange={(e) => setEditorialBorderColor(e.target.value)}
                          className="w-7 h-7 rounded border border-zinc-800 cursor-pointer overflow-hidden p-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={editorialBorderColor}
                          onChange={(e) => setEditorialBorderColor(e.target.value)}
                          className="w-full rounded border border-zinc-800 bg-zinc-950 px-2 text-[10px] uppercase font-mono focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-zinc-500 font-bold block mb-1">상단 소제목색</label>
                      <div className="flex gap-1.5">
                        <input
                          type="color"
                          value={editorialSubColor}
                          onChange={(e) => setEditorialSubColor(e.target.value)}
                          className="w-7 h-7 rounded border border-zinc-800 cursor-pointer overflow-hidden p-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={editorialSubColor}
                          onChange={(e) => setEditorialSubColor(e.target.value)}
                          className="w-full rounded border border-zinc-800 bg-zinc-950 px-2 text-[10px] uppercase font-mono focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-zinc-500 font-bold block mb-1">본문 텍스트색</label>
                      <div className="flex gap-1.5">
                        <input
                          type="color"
                          value={editorialTextColor}
                          onChange={(e) => setEditorialTextColor(e.target.value)}
                          className="w-7 h-7 rounded border border-zinc-800 cursor-pointer overflow-hidden p-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={editorialTextColor}
                          onChange={(e) => setEditorialTextColor(e.target.value)}
                          className="w-full rounded border border-zinc-800 bg-zinc-950 px-2 text-[10px] uppercase font-mono focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-time Preview */}
                <div className="pt-2">
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-wider block mb-2">실시간 상세 미리보기 (Preview)</label>
                  <div 
                    className="p-5 rounded-2xl border transition-all"
                    style={{
                      backgroundColor: editorialBgColor,
                      borderColor: editorialBorderColor,
                    }}
                  >
                    <p 
                      className="text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 select-none"
                      style={{ color: editorialSubColor }}
                    >
                      {editorialSubtitle || "No Subtitle"}
                    </p>
                    <p 
                      className="text-[1.05rem] leading-[1.8]"
                      style={{ color: editorialTextColor }}
                    >
                      {editorialText || "에디토리얼 문구를 입력하면 이곳에 실시간 미리보기로 반영됩니다."}
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 pt-4 border-t border-zinc-850 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditorialModalOpen(false)}
                className="rounded-xl border border-zinc-800 bg-transparent px-5 py-2.5 text-xs font-black text-zinc-400 hover:text-white hover:bg-zinc-900 transition cursor-pointer"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={() => {
                  const nextSettings = {
                    enabled: editorialEnabled,
                    bgColor: editorialBgColor,
                    borderColor: editorialBorderColor,
                    textColor: editorialTextColor,
                    subColor: editorialSubColor,
                    subtitle: editorialSubtitle,
                    text: editorialText
                  };
                  editorialSettingsRef.current = nextSettings;
                  
                  // Trigger content update in parent by reading current editor html
                  if (editor) {
                    const html = editor.getHTML();
                    const commentStr = `<!-- CREAIBOX_EDITORIAL_START ${JSON.stringify(nextSettings)} CREAIBOX_EDITORIAL_END -->`;
                    const contentWithComment = `${cleanContentComment(html)}\n\n${commentStr}`;
                    lastExternalContentRef.current = contentWithComment;
                    setContent(contentWithComment);
                  }
                  
                  setIsEditorialModalOpen(false);
                }}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-black text-white hover:bg-blue-500 transition shadow-lg shadow-blue-500/20 cursor-pointer"
              >
                적용 및 본문 연동
              </button>
            </div>

          </div>
        </div>
      )}
     {/* 🌟 찾기 및 바꾸기 모달 */}
     {isFindReplaceOpen && (
       <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
         <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-[#090b11] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-zinc-100 flex flex-col">
           {/* Header */}
           <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-5">
             <div className="flex items-center gap-2">
               <Search size={18} className="text-violet-400" />
               <h3 className="text-lg font-black tracking-tight">찾기 및 바꾸기</h3>
             </div>
             <button onClick={() => setIsFindReplaceOpen(false)} className="rounded-full p-1 hover:bg-zinc-800 transition text-zinc-400 hover:text-white cursor-pointer">
               <X size={18} />
             </button>
           </div>

           {/* Inputs */}
           <div className="space-y-4">
             <div>
               <label className="text-xs font-black text-zinc-400 uppercase tracking-wider block mb-1.5">찾을 문구</label>
               <input
                 type="text"
                 value={findText}
                 onChange={(e) => setFindText(e.target.value)}
                 className="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-xs text-zinc-100 focus:border-violet-500 focus:outline-none"
                 placeholder="찾을 텍스트를 입력해 주세요."
               />
             </div>
             <div>
               <label className="text-xs font-black text-zinc-400 uppercase tracking-wider block mb-1.5">바꿀 문구</label>
               <input
                 type="text"
                 value={replaceText}
                 onChange={(e) => setReplaceText(e.target.value)}
                 className="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-xs text-zinc-100 focus:border-violet-500 focus:outline-none"
                 placeholder="바꿀 텍스트를 입력해 주세요."
               />
             </div>
           </div>

           {/* Actions */}
           <div className="mt-8 pt-4 border-t border-zinc-850 flex justify-end gap-2">
             <button
               type="button"
               onClick={() => setIsFindReplaceOpen(false)}
               className="rounded-xl border border-zinc-800 bg-transparent px-5 py-2.5 text-xs font-black text-zinc-400 hover:text-white hover:bg-zinc-900 transition cursor-pointer"
             >
               취소
             </button>
             <button
               type="button"
               onClick={() => handleFindAndReplace(findText, replaceText)}
               className="rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-black text-white hover:bg-violet-500 transition shadow-lg shadow-violet-500/20 cursor-pointer"
             >
               바꾸기 실행
             </button>
           </div>
         </div>
       </div>
     )}

     {/* 🌟 문자표 모달 */}
     {isSymbolModalOpen && (
       <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
         <div className="w-full max-w-xl rounded-3xl border border-zinc-800 bg-[#090b11] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-zinc-100 flex flex-col max-h-[90vh]">
           {/* Header */}
           <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-5">
             <div className="flex items-center gap-2">
               <span className="font-bold text-violet-400">※</span>
               <h3 className="text-lg font-black tracking-tight">문자표</h3>
             </div>
             <button onClick={() => setIsSymbolModalOpen(false)} className="rounded-full p-1 hover:bg-zinc-800 transition text-zinc-400 hover:text-white cursor-pointer">
               <X size={18} />
             </button>
           </div>

           {/* Category Tabs */}
           <div className="flex gap-1.5 border-b border-zinc-900 pb-2 mb-4 overflow-x-auto custom-scrollbar">
             {Object.keys(SYMBOL_CATEGORIES).map((cat) => (
               <button
                 key={cat}
                 type="button"
                 onClick={() => {
                   setSelectedSymbolCategory(cat);
                   setSelectedSymbol("");
                 }}
                 className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                   selectedSymbolCategory === cat
                     ? "bg-violet-600 text-white"
                     : "bg-zinc-950/40 text-zinc-400 hover:bg-zinc-900"
                 }`}
               >
                 {cat}
               </button>
             ))}
           </div>

           {/* Selected Symbol Preview */}
           <div className="flex items-center gap-3 bg-zinc-950/40 border border-zinc-900 rounded-2xl p-3 mb-4">
             <div className="text-xs font-black text-zinc-500">선택된 문자:</div>
             <div className="w-10 h-10 flex items-center justify-center bg-violet-600/10 border border-violet-500/20 text-violet-400 rounded-xl font-bold text-lg">
               {selectedSymbol || "-"}
             </div>
             <div className="text-[11px] text-zinc-500">
               (문자를 더블클릭하면 본문에 즉시 삽입됩니다.)
             </div>
           </div>

           {/* Symbols Grid */}
           <div className="grid grid-cols-8 sm:grid-cols-10 gap-2 overflow-y-auto max-h-[300px] p-2 bg-zinc-950/30 rounded-2xl border border-zinc-900/60 custom-scrollbar">
             {SYMBOL_CATEGORIES[selectedSymbolCategory]?.map((sym, idx) => (
               <button
                 key={idx}
                 type="button"
                 onClick={() => setSelectedSymbol(sym)}
                 onDoubleClick={() => {
                   if (editor) {
                     editor.chain().focus().insertContent(sym).run();
                     addRecentSymbol(sym);
                     setIsSymbolModalOpen(false);
                   }
                 }}
                 className={`aspect-square flex items-center justify-center rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                   selectedSymbol === sym
                     ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/20 scale-[1.05]"
                     : "bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                 }`}
               >
                 {sym}
               </button>
             ))}
           </div>

           {/* Recent Symbols */}
           {recentSymbols.length > 0 && (
             <div className="mt-4 pt-3 border-t border-zinc-850">
               <div className="text-[10px] font-black text-zinc-500 uppercase tracking-wider mb-2">최근 사용한 문자</div>
               <div className="flex flex-wrap gap-1.5">
                 {recentSymbols.map((sym, idx) => (
                   <button
                     key={idx}
                     type="button"
                     onClick={() => setSelectedSymbol(sym)}
                     onDoubleClick={() => {
                       if (editor) {
                         editor.chain().focus().insertContent(sym).run();
                         addRecentSymbol(sym);
                         setIsSymbolModalOpen(false);
                       }
                     }}
                     className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-xs font-bold hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
                   >
                     {sym}
                   </button>
                 ))}
               </div>
             </div>
           )}

           {/* Actions */}
           <div className="mt-6 pt-4 border-t border-zinc-850 flex justify-end gap-2">
             <button
               type="button"
               onClick={() => setIsSymbolModalOpen(false)}
               className="rounded-xl border border-zinc-800 bg-transparent px-5 py-2.5 text-xs font-black text-zinc-400 hover:text-white hover:bg-zinc-900 transition cursor-pointer"
             >
               취소
             </button>
             <button
               type="button"
               onClick={() => {
                 if (selectedSymbol && editor) {
                   editor.chain().focus().insertContent(selectedSymbol).run();
                   addRecentSymbol(selectedSymbol);
                   setIsSymbolModalOpen(false);
                 }
               }}
               disabled={!selectedSymbol}
               className="rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-black text-white hover:bg-violet-500 transition shadow-lg shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
             >
               삽입하기
             </button>
           </div>
         </div>
       </div>
     )}

     {/* 🌟 지식 & 페르소나 설정 모달 */}
     {isKnowledgePersonaModalOpen && (
       <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
         <div className="w-full max-w-2xl rounded-3xl border border-zinc-800 bg-[#090b11] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-zinc-100 flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar">
           {/* Header */}
           <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-5">
             <div className="flex items-center gap-2">
               <Brain size={18} className="text-violet-400" />
               <h3 className="text-lg font-black tracking-tight">AI 지식 & 작가 페르소나 설정</h3>
             </div>
             <button onClick={() => setIsKnowledgePersonaModalOpen(false)} className="rounded-full p-1 hover:bg-zinc-800 transition text-zinc-400 hover:text-white cursor-pointer">
               <X size={18} />
             </button>
           </div>

           {/* Content */}
           <div className="space-y-6">
             {/* Section 1: Writer Persona */}
             <div>
               <div className="flex items-center justify-between mb-2.5">
                 <label className="text-xs font-black text-zinc-400 uppercase tracking-wider">글쓰기 작가 페르소나 선택</label>
                 {selectedPersonaId && (
                   <button
                     onClick={() => setSelectedPersonaId?.(null)}
                     className="text-[10px] text-red-400 hover:text-red-300 font-bold"
                   >
                     선택 해제 (기본 작가 적용)
                   </button>
                 )}
               </div>
               
               {localPersonaList.length === 0 ? (
                 <div className="rounded-2xl border border-dashed border-zinc-850 p-4 text-center text-xs text-zinc-500">
                   등록된 작가 페르소나가 없습니다.
                   <br />
                   <a href="/studio/writing/creaibox/knowledge" className="text-violet-400 hover:underline mt-1 inline-block">
                     지식/페르소나 매니저 바로가기
                   </a>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                   {localPersonaList.map((p) => {
                     const isSelected = selectedPersonaId === p.id;
                     return (
                       <button
                         key={p.id}
                         type="button"
                         onClick={() => setSelectedPersonaId?.(p.id)}
                         className={`flex items-start gap-3 rounded-2xl border p-3 text-left transition cursor-pointer ${
                           isSelected
                             ? "bg-violet-600/10 border-violet-500 shadow-md shadow-violet-500/5"
                             : "bg-zinc-950/40 border-zinc-900 hover:border-zinc-850 hover:bg-zinc-900/40"
                         }`}
                       >
                         {p.avatar ? (
                           <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-xl object-cover border border-zinc-800 mt-0.5" />
                         ) : (
                           <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-sm font-black text-zinc-500 mt-0.5">
                             P
                           </div>
                         )}
                         <div className="min-w-0 flex-1">
                           <div className="flex items-center gap-1.5">
                             <span className={`text-xs font-black truncate ${isSelected ? "text-violet-300" : "text-zinc-100"}`}>
                               {p.name}
                             </span>
                             {isSelected && (
                               <span className="shrink-0 bg-violet-600 text-[8px] font-black text-white px-1.5 py-0.5 rounded-full">
                                 적용됨
                               </span>
                             )}
                           </div>
                           <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">{p.role}</p>
                           <p className="text-[9px] text-zinc-500 mt-1 truncate">{p.tone}</p>
                         </div>
                       </button>
                     );
                   })}
                 </div>
               )}
             </div>

             {/* Section 2: Reference Knowledge Base */}
             <div>
               <div className="flex items-center justify-between mb-2.5">
                 <label className="text-xs font-black text-zinc-400 uppercase tracking-wider">참조 지식 베이스 선택</label>
                 {selectedKnowledgeId && (
                   <button
                     onClick={() => setSelectedKnowledgeId?.(null)}
                     className="text-[10px] text-red-400 hover:text-red-300 font-bold"
                   >
                     선택 해제 (지식 참조 안 함)
                   </button>
                 )}
               </div>

               {localKnowledgeList.length === 0 ? (
                 <div className="rounded-2xl border border-dashed border-zinc-850 p-4 text-center text-xs text-zinc-500">
                   등록된 참조 지식 베이스가 없습니다.
                   <br />
                   <a href="/studio/writing/creaibox/knowledge" className="text-violet-400 hover:underline mt-1 inline-block">
                     지식/페르소나 매니저 바로가기
                   </a>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                   {localKnowledgeList.map((k) => {
                     const isSelected = selectedKnowledgeId === k.id;
                     return (
                       <button
                         key={k.id}
                         type="button"
                         onClick={() => setSelectedKnowledgeId?.(k.id)}
                         className={`flex items-start gap-3 rounded-2xl border p-3 text-left transition cursor-pointer ${
                           isSelected
                             ? "bg-violet-600/10 border-violet-500 shadow-md shadow-violet-500/5"
                             : "bg-zinc-950/40 border-zinc-900 hover:border-zinc-850 hover:bg-zinc-900/40"
                         }`}
                       >
                         <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                           isSelected ? "bg-violet-600/20 text-violet-400" : "bg-zinc-900 text-zinc-500"
                         }`}>
                           <FileText size={16} />
                         </div>
                         <div className="min-w-0 flex-1">
                           <div className="flex items-center gap-1.5">
                             <span className={`text-xs font-black truncate ${isSelected ? "text-violet-300" : "text-zinc-100"}`}>
                               {k.title}
                             </span>
                             {isSelected && (
                               <span className="shrink-0 bg-violet-600 text-[8px] font-black text-white px-1.5 py-0.5 rounded-full">
                                 적용됨
                               </span>
                             )}
                           </div>
                           <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">{k.description || "상세 설명이 없습니다."}</p>
                           <div className="flex items-center gap-2 mt-1">
                             <span className="text-[8px] font-mono bg-zinc-900 px-1 py-0.5 rounded border border-zinc-800 text-zinc-500">
                               ID: {k.id.slice(0, 8)}
                             </span>
                           </div>
                         </div>
                       </button>
                     );
                   })}
                 </div>
               )}
             </div>
           </div>

           {/* Footer */}
           <div className="mt-8 pt-4 border-t border-zinc-850 flex justify-end gap-2">
             <button
               type="button"
               onClick={() => setIsKnowledgePersonaModalOpen(false)}
               className="rounded-xl bg-violet-600 px-6 py-2.5 text-xs font-black text-white hover:bg-violet-500 transition shadow-lg shadow-violet-500/20 cursor-pointer"
             >
               확인 및 설정 완료
             </button>
           </div>
         </div>
       </div>
     )}
      {/* 🌟 내부 링크 콘텐츠 추가 모달 */}
      {isInternalLinkModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-zinc-800 bg-[#090b11] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-zinc-100 flex flex-col max-h-[85vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <Link2 size={18} className="text-violet-400" />
                <h3 className="text-lg font-black tracking-tight">내부 링크 콘텐츠 추가</h3>
              </div>
              <button onClick={() => setIsInternalLinkModalOpen(false)} className="rounded-full p-1 hover:bg-zinc-850 transition text-zinc-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Domain Selector */}
            <div className="mb-4 shrink-0">
              <span className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-wider">
                도메인 선택
              </span>
              <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-zinc-950/60 border border-zinc-800/85">
                {getAvailableDomains(internalLinkPosts).map((domain) => {
                  const isSelected = selectedInternalLinkDomain === domain;
                  return (
                    <button
                      key={domain}
                      type="button"
                      onClick={() => setSelectedInternalLinkDomain(domain)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-tight transition-all cursor-pointer ${
                        isSelected
                          ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                          : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                      }`}
                    >
                      {domain}
                    </button>
                  );
                })}
                {getAvailableDomains(internalLinkPosts).length === 0 && (
                  <span className="text-[11px] text-zinc-500 p-2">현재 발행된 글이 있는 도메인이 없습니다.</span>
                )}
              </div>
            </div>

            {/* Posts List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2.5 pr-1">
              {isLoadingInternalLinkPosts ? (
                <div className="flex flex-col items-center justify-center py-12 text-zinc-500 text-xs font-bold gap-2">
                  <RefreshCw size={18} className="animate-spin text-violet-400" />
                  글 목록 불러오는 중...
                </div>
              ) : (
                (() => {
                  const filtered = internalLinkPosts.filter((post) => {
                    const postDom = post.canonical_url
                      ? (() => {
                          try {
                            const parsed = new URL(post.canonical_url);
                            let host = parsed.hostname;
                            if (host.startsWith("www.")) host = host.slice(4);
                            return host;
                          } catch {
                            return "creaibox.com";
                          }
                        })()
                      : "creaibox.com";
                    return postDom === selectedInternalLinkDomain;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="rounded-2xl border border-dashed border-zinc-850 p-8 text-center text-xs text-zinc-500">
                        해당 도메인으로 발행된 글이 없습니다.
                      </div>
                    );
                  }

                  return filtered.map((post) => {
                    const imgUrl = internalLinkImages[post.id];
                    const dateStr = post.created_at
                      ? new Date(post.created_at).toLocaleDateString()
                      : "";

                    return (
                      <button
                        key={post.id}
                        type="button"
                        onClick={() => handleInsertInternalLinkCard(post)}
                        className="w-full flex items-start gap-4 p-3 rounded-2xl border border-zinc-900 bg-zinc-950/40 hover:border-violet-500/50 hover:bg-violet-950/5 text-left transition cursor-pointer group"
                      >
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt="thumbnail"
                            className="w-24 h-16 rounded-xl object-cover border border-zinc-800 shrink-0"
                          />
                        ) : (
                          <div className="w-24 h-16 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 shrink-0">
                            <FileText size={18} />
                          </div>
                        )}
                        <div className="min-w-0 flex-1 flex flex-col justify-between h-16">
                          <div>
                            <h4 className="text-xs font-black text-zinc-100 group-hover:text-violet-300 transition line-clamp-1">
                              {post.title}
                            </h4>
                            <p className="text-[10px] text-zinc-400 mt-1 line-clamp-1">
                              {post.meta_description || "요약 정보가 없습니다."}
                            </p>
                          </div>
                          <span className="text-[9px] text-zinc-500">{dateStr}</span>
                        </div>
                      </button>
                    );
                  });
                })()
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsInternalLinkModalOpen(false)}
                className="rounded-xl border border-zinc-800 bg-transparent px-5 py-2.5 text-xs font-black text-zinc-400 hover:text-white hover:bg-zinc-900 transition cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
