"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { EditorContent, useEditor } from "@tiptap/react";
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
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Bold,
  Check,
  CheckCircle2,
  ChevronDown,
  CirclePlay,
  Code2,
  Combine,
  Copy,
  Cpu,
  Download,
  Eye,
  FileText,
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
  Quote,
  RefreshCw,
  Save,
  Sparkles,
  Split,
  Table2,
  Trash2,
  Type,
  Wand2,
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
}

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
}: UniversalBlogEditorProps) {
  const supabase = useMemo(() => createClient(), []);
  const [saveFeedback, setSaveFeedback] = useState<"idle" | "saved">("idle");
  const [copyFeedback, setCopyFeedback] = useState<"idle" | "copied">("idle");
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isContentDropdownOpen, setIsContentDropdownOpen] = useState(false);
  const [isTocDropdownOpen, setIsTocDropdownOpen] = useState(false);
  const [isPostTypeDropdownOpen, setIsPostTypeDropdownOpen] = useState(false);
  const [activeTableDropdown, setActiveTableDropdown] = useState<"row" | "col" | null>(null);
  const contentDropdownRef = useRef<HTMLDivElement>(null);
  const tocDropdownRef = useRef<HTMLDivElement>(null);
  const postTypeDropdownRef = useRef<HTMLDivElement>(null);
  const copyTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isCustomSubTopic, setIsCustomSubTopic] = useState(false);
  const [recreateUrl, setRecreateUrl] = useState("");
  const [isFetchingOriginal, setIsFetchingOriginal] = useState(false);
  const [isRecreating, setIsRecreating] = useState(false);


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
          } catch (err) {
            console.error("외부 이미지 자동 업로드 실패:", err);
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

  const handleSetAsFeaturedImage = useCallback(
    async (src: string) => {
      if (!manuscriptId) {
        alert("원고를 먼저 저장해주십시오. (원고 ID가 필요합니다)");
        throw new Error("manuscriptId가 존재하지 않습니다.");
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("로그인이 필요합니다.");
        throw new Error("로그인 유저가 없습니다.");
      }

      // 1. 기존 이 포스트의 thumbnail들의 is_primary를 false로 일괄 업데이트
      const { error: updateOldError } = await supabase
        .from("generated_images")
        .update({ is_primary: false })
        .eq("user_id", user.id)
        .eq("source_type", contentImageSourceType)
        .eq("source_id", String(manuscriptId))
        .eq("image_role", "thumbnail")
        .eq("is_primary", true);

      if (updateOldError) {
        console.error("기존 대표 이미지 상태 변경 실패:", {
          message: updateOldError.message,
          code: updateOldError.code,
          details: updateOldError.details,
          hint: updateOldError.hint
        });
        throw updateOldError;
      }

      // 2. 현재 선택한 본문 이미지 url이 이미 generated_images에 이 포스트의 thumbnail로 존재하는지 확인
      const { data: existingRows, error: findError } = await supabase
        .from("generated_images")
        .select("id, image_url")
        .eq("user_id", user.id)
        .eq("source_type", contentImageSourceType)
        .eq("source_id", String(manuscriptId))
        .eq("image_role", "thumbnail")
        .eq("image_url", src);

      if (findError) {
        console.error("기존 대표 이미지 조회 실패:", {
          message: findError.message,
          code: findError.code,
          details: findError.details,
          hint: findError.hint
        });
        throw findError;
      }

      if (existingRows && existingRows.length > 0) {
        // 존재하면 해당 행의 is_primary만 true로 설정
        const targetId = existingRows[0].id;
        const { error: updateTargetError } = await supabase
          .from("generated_images")
          .update({ is_primary: true })
          .eq("id", targetId);

        if (updateTargetError) {
          console.error("대표 이미지 업데이트 실패:", {
            message: updateTargetError.message,
            code: updateTargetError.code,
            details: updateTargetError.details,
            hint: updateTargetError.hint
          });
          throw updateTargetError;
        }
      } else {
        // 존재하지 않으면 신규 썸네일 행 생성 (is_primary = true)
        const { error: insertError } = await supabase
          .from("generated_images")
          .insert({
            user_id: user.id,
            prompt: "대표 이미지 지정",
            image_url: src,
            source_type: contentImageSourceType,
            source_id: String(manuscriptId),
            image_role: "thumbnail",
            is_primary: true,
            title: title || "대표 이미지",
            alt_text: title || "대표 이미지",
          });

        if (insertError) {
          console.error("신규 대표 이미지 삽입 실패:", {
            message: insertError.message,
            code: insertError.code,
            details: insertError.details,
            hint: insertError.hint
          });
          throw insertError;
        }
      }

      // Notify the right-side BlogImageStudioPanel to reload and display the new thumbnail
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("generated-images-updated"));
      }
    },
    [manuscriptId, contentImageSourceType, supabase, title]
  );

  const initialHtml = useMemo(() => markdownToHtml(content), []);

  const editor = useEditor({
    extensions: [
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
      TableHeader,
      TableCell,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
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

      lastExternalContentRef.current = html;
      setContent(html);

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
    if (content === lastExternalContentRef.current) return;

    const nextHtml = markdownToHtml(content);

    if (nextHtml !== editor.getHTML()) {
      setTimeout(() => {
        if (editor.isDestroyed) return;
        editor.commands.setContent(nextHtml, { emitUpdate: false });
        previousImageUrlsRef.current = extractImageUrlsFromEditor(editor);
        lastExternalContentRef.current = content;
      }, 0);
    }
  }, [content, editor]);



  useEffect(() => {
    if (saveFeedback !== "saved") return;

    const timer = setTimeout(() => setSaveFeedback("idle"), 3000);
    return () => clearTimeout(timer);
  }, [saveFeedback]);

  const handleLocalCopy = useCallback(() => {
    if (handleCopy) {
      handleCopy();
    } else {
      const copyText = `제목: ${title}\n\n${editor?.getHTML() ?? content}`;
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

  const handleFetchOriginalText = async () => {
    if (!recreateUrl.trim()) {
      alert("가져올 네이버 블로그 글 주소를 입력해 주세요 사장님!");
      return;
    }
    setIsFetchingOriginal(true);
    try {
      const extractResponse = await fetch(
        `/api/naver-extract?url=${encodeURIComponent(recreateUrl.trim())}`
      );
      const extractedResult = await extractResponse.json();

      if (!extractResponse.ok) {
        throw new Error(extractedResult?.error || "네이버 블로그 본문 추출에 실패했습니다.");
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
          throw new Error(extractedResult?.error || "네이버 블로그 본문 추출에 실패했습니다.");
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
  }: {
    onClick: () => void;
    children: React.ReactNode;
    active?: boolean;
    disabled?: boolean;
    className?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || !editor}
      className={`flex items-center gap-1 rounded-xl px-2.5 py-2 text-xs font-bold transition-all disabled:cursor-not-allowed disabled:opacity-40 ${active ? "bg-blue-500/15 text-blue-300" : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
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

      <div className="shrink-0 border-b border-zinc-800 bg-[#0b0d12] px-4 py-2 flex flex-col gap-2">
        {/* 1번째 줄 */}
        <div className="flex flex-wrap items-center gap-1.5">
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleEditorImageUpload} className="hidden" />

          <ToolbarButton
            onClick={() => fileInputRef.current?.click()}
            disabled={isImageUploading}
            className="border border-zinc-800 bg-zinc-900/50 hover:bg-emerald-500/10 hover:text-emerald-400"
          >
            {isImageUploading ? <RefreshCw size={14} className="animate-spin" /> : <ImageIcon size={14} />}
            {isImageUploading ? "업로드중" : "사진"}
          </ToolbarButton>

          <ToolbarButton onClick={handleInsertImageUrl}>
            <ImageIcon size={14} /> URL이미지
          </ToolbarButton>

          <div className="mx-1 h-5 w-px bg-zinc-800" />

          <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} active={editor?.isActive("heading", { level: 1 })}>
            <Heading1 size={15} />
          </ToolbarButton>

          <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive("heading", { level: 2 })}>
            <Heading2 size={15} />
          </ToolbarButton>

          <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} active={editor?.isActive("heading", { level: 3 })}>
            <Heading3 size={15} />
          </ToolbarButton>

          <div className="mx-1 h-4 w-px bg-zinc-800" />

          <ToolbarButton onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive("bold")}>
            <Bold size={15} />
          </ToolbarButton>

          <ToolbarButton onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive("italic")}>
            <Italic size={15} />
          </ToolbarButton>

          <ToolbarButton onClick={handleInsertLink} active={editor?.isActive("link")}>
            <Link2 size={15} />
          </ToolbarButton>

          <div className="mx-1 h-4 w-px bg-zinc-800" />

          <ToolbarButton onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive("bulletList")}>
            <List size={15} />
          </ToolbarButton>

          <ToolbarButton onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive("orderedList")}>
            <ListOrdered size={15} />
          </ToolbarButton>

          <ToolbarButton onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive("blockquote")}>
            <Quote size={15} />
          </ToolbarButton>

          <div className="mx-1 h-4 w-px bg-zinc-800" />

          <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign("left").run()}>
            <AlignLeft size={15} />
          </ToolbarButton>

          <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign("center").run()}>
            <AlignCenter size={15} />
          </ToolbarButton>

          <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign("right").run()}>
            <AlignRight size={15} />
          </ToolbarButton>

          <div className="mx-1 h-4 w-px bg-zinc-800" />

          <ToolbarButton onClick={handleGenerateToc}>
            <FileText size={14} /> 목차
          </ToolbarButton>

          <ToolbarButton onClick={handleInsertTable}>
            <Table2 size={14} /> 표
          </ToolbarButton>

          <ToolbarButton onClick={handleInsertYoutube}>
            <CirclePlay size={14} /> 유튜브
          </ToolbarButton>

          <ToolbarButton onClick={() => editor?.chain().focus().setHorizontalRule().run()}>
            <Minus size={14} /> 구분선
          </ToolbarButton>
        </div>

        {/* 2번째 줄 */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-zinc-800/40 pt-1.5">
          <ToolbarButton onClick={() => editor?.chain().focus().toggleCodeBlock().run()} active={editor?.isActive("codeBlock")}>
            <Code2 size={14} /> 코드
          </ToolbarButton>

          <ToolbarButton onClick={handleInsertCta}>CTA</ToolbarButton>

          <div className="mx-1 h-4 w-px bg-zinc-800" />

          <ToolbarButton onClick={() => handleEnhanceContent("correct")}>
            <Type size={14} /> 맞춤법
          </ToolbarButton>
        </div>

      {/* AI 포스팅 글쓰기 가로 제어 바 */}
      <div className="shrink-0 border-b border-zinc-850 bg-[#0c101f] px-4 py-2 flex flex-col gap-2">
        {/* 1번째 줄 */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 shrink-0 text-cyan-300 text-xs font-black">
            <Sparkles size={14} className="animate-pulse" />
            <span>AI 포스팅 글쓰기</span>
          </div>

          <div className="h-4 w-px bg-zinc-800 shrink-0" />

          {/* 1. 콘텐츠 유형 */}
          <select
            value={aiContentType}
            onChange={(e) => setAiContentType?.(e.target.value)}
            disabled={isAiGenerating || isFetchingOriginal || isRecreating}
            className="h-9 w-44 rounded-lg border border-zinc-800 bg-black/40 px-2.5 text-xs text-white outline-none focus:border-violet-500 font-bold disabled:opacity-50 text-center"
          >
            <option value="" disabled hidden>콘텐츠 유형</option>
            {[
              "멀티 플랫폼 콘텐츠 기획",
              "블로그 글쓰기 콘텐츠",
              "유튜브 쇼츠 기획",
              "유튜브 롱폼 기획",
              "틱톡 숏폼 기획",
              "네이버 클립 기획",
              "인스타그램 릴스 기획",
              "SNS 카드뉴스 기획",
              "뉴스레터 기획",
              "브랜드 캠페인 기획"
            ].map((item) => (
              <option key={item} value={item} className="bg-slate-950">
                {getContentTypeEmoji(item)} {item}
              </option>
            ))}
          </select>

          {/* 2. 포스트 타입 */}
          <select
            value={aiPostType}
            onChange={(e) => setAiPostType?.(e.target.value)}
            disabled={isAiGenerating || isFetchingOriginal || isRecreating}
            className="h-9 w-48 rounded-lg border border-zinc-800 bg-black/40 px-2.5 text-xs text-white outline-none focus:border-violet-500 font-bold disabled:opacity-50 text-center"
          >
            <option value="" disabled hidden>포스트 타입</option>
            {postTypeOptions.map((item) => (
              <option
                key={item.label}
                value={item.label}
                disabled={item.disabled}
                className={item.disabled ? "text-zinc-500 font-bold bg-zinc-900" : "bg-slate-950"}
              >
                {item.label}
              </option>
            ))}
          </select>

          {/* 3. 말투 선택 */}
          <select
            value={aiSelectedTone}
            onChange={(e) => setAiSelectedTone?.(e.target.value)}
            disabled={isAiGenerating || isFetchingOriginal || isRecreating}
            className="h-9 w-60 rounded-lg border border-zinc-800 bg-black/40 px-2.5 text-xs text-white outline-none focus:border-violet-500 font-bold disabled:opacity-50 text-center"
          >
            <option value="" disabled hidden>말투 선택</option>
            {[
              "💻 전문적이고 통찰력 있는 분석 (기술 블로그)",
              "✍️ 친근하고 명확한 실무 설명 (가이드형 포스팅)",
              "📢 브랜드 중심의 신뢰형 설명 (서비스 소개형)",
              "📈 인사이트 리포트형 톤 (트렌드 분석)",
              "✉️ 가볍고 설득력 있는 뉴스레터형 톤"
            ].map((item) => (
              <option key={item} value={item} className="bg-slate-950">
                {item}
              </option>
            ))}
          </select>

          {/* 4. 목표 글자수 */}
          <select
            value={aiWordCountGoal}
            onChange={(e) => setAiWordCountGoal?.(e.target.value)}
            disabled={isAiGenerating || isFetchingOriginal || isRecreating}
            className="h-9 w-36 rounded-lg border border-zinc-800 bg-black/40 px-2.5 text-xs text-white outline-none focus:border-violet-500 font-bold disabled:opacity-50 text-center"
          >
            <option value="" disabled hidden>목표 글자수</option>
            <option value="800" className="bg-slate-950">📰 짧게 (약 800자)</option>
            <option value="1500" className="bg-slate-950">✍️ 보통 (약 1,500자)</option>
            <option value="3000" className="bg-slate-950">🚀 길게 (약 3,000자)</option>
            <option value="5000" className="bg-slate-950">📚 아주 길게 (약 5,000자)</option>
            <option value="8000" className="bg-slate-950">💰 초장문 (약 8,000자)</option>
          </select>

          {/* 5. 전략 수준 */}
          <select
            value={aiStrategyLevel}
            onChange={(e) => setAiStrategyLevel?.(e.target.value)}
            disabled={isAiGenerating || isFetchingOriginal || isRecreating}
            className="h-9 w-44 rounded-lg border border-zinc-800 bg-black/40 px-2.5 text-xs text-white outline-none focus:border-violet-500 font-bold disabled:opacity-50 text-center"
          >
            <option value="" disabled hidden>전략 수준</option>
            {[
              "1. 기본 전략(대중적이고 상식적 수준의 정보성 글)",
              "2. 고급 전략(검색 엔진 최적화 및 사용자 타겟 분석)",
              "3. 전문가 전략(가장 고도화된 심층적 마케팅 구조 설계)"
            ].map((item) => (
              <option key={item} value={item} className="bg-slate-950">
                {getStrategyLevelEmoji(item)} {item}
              </option>
            ))}
          </select>

          {/* 6. 결과 구성 */}
          <select
            value={aiResultFormat}
            onChange={(e) => setAiResultFormat?.(e.target.value)}
            disabled={isAiGenerating || isFetchingOriginal || isRecreating}
            className="h-9 w-60 rounded-lg border border-zinc-800 bg-black/40 px-2.5 text-xs text-white outline-none focus:border-violet-500 font-bold disabled:opacity-50 text-center"
          >
            <option value="" disabled hidden>결과 구성</option>
            {[
              "1. 기본 시리즈(키워드 연관 글감 병렬적 나열)",
              "2. 기본 시리즈 + 배포 플랫폼별 적합성 키워드 향상",
              "3. 2번 + 발행 순서 및 최적의 배포 타이밍 구성",
            ].map((item) => (
              <option key={item} value={item} className="bg-slate-950">
                {getResultFormatEmoji(item)} {item}
              </option>
            ))}
          </select>
        </div>

        {/* 2번째 줄 */}
        <div className="flex flex-wrap items-center gap-3 border-t border-zinc-800/20 pt-1.5">
          {/* 7. 대분류 */}
          <select
            value={aiLargeCategory}
            onChange={(e) => {
              const newGroup = e.target.value;
              setAiLargeCategory?.(newGroup);
              setIsCustomSubTopic(false);
              const firstCat = topicCategories.find((c) => c.group === newGroup);
              if (firstCat) {
                setAiMainTopic?.(firstCat.name);
                const firstSub = topicSubTopics.find((s) => s.categoryId === firstCat.id);
                if (firstSub) {
                  setAiSubTopic?.(firstSub.name);
                } else {
                  setAiSubTopic?.("");
                }
              } else {
                setAiMainTopic?.("");
                setAiSubTopic?.("");
              }
            }}
            disabled={isAiGenerating || isFetchingOriginal || isRecreating}
            className="h-9 w-36 rounded-lg border border-zinc-800 bg-black/40 px-2.5 text-xs text-white outline-none focus:border-violet-500 font-bold disabled:opacity-50 text-center"
          >
            <option value="" disabled hidden>대분류</option>
            <option value="" className="bg-slate-950">대분류 선택</option>
            {mainGroups.map((group) => (
              <option key={group} value={group} className="bg-slate-950">
                {groupEmojis[group] || "📁"} {group}
              </option>
            ))}
          </select>

          {/* 8. 상세 분야 */}
          <select
            value={aiMainTopic}
            onChange={(e) => {
              const newTopicName = e.target.value;
              setAiMainTopic?.(newTopicName);
              setIsCustomSubTopic(false);
              const cat = topicCategories.find((c) => c.name === newTopicName);
              if (cat) {
                const firstSub = topicSubTopics.find((s) => s.categoryId === cat.id);
                if (firstSub) {
                  setAiSubTopic?.(firstSub.name);
                } else {
                  setAiSubTopic?.("");
                }
              } else {
                setAiSubTopic?.("");
              }
            }}
            disabled={isAiGenerating || isFetchingOriginal || isRecreating || !aiLargeCategory}
            className="h-9 w-44 rounded-lg border border-zinc-800 bg-black/40 px-2.5 text-xs text-white outline-none focus:border-violet-500 font-bold disabled:opacity-50 disabled:cursor-not-allowed text-center"
          >
            <option value="" disabled hidden>상세 분야</option>
            <option value="" className="bg-slate-950">
              {aiLargeCategory ? "상세 분야 선택" : "대분류 필요"}
            </option>
            {topicCategories
              .filter((cat) => cat.group === aiLargeCategory)
              .map((cat) => (
                <option key={cat.id} value={cat.name} className="bg-slate-950">
                  {cat.emoji} {cat.name}
                </option>
              ))}
          </select>

          {/* 9. 추천 시리즈 */}
          {(() => {
            const currentCategory = topicCategories.find((c) => c.name === aiMainTopic);
            const filteredSubTopics = currentCategory
              ? topicSubTopics.filter((sub) => sub.categoryId === currentCategory.id)
              : [];

            const isPresetSubTopic = filteredSubTopics.some((sub) => sub.name === aiSubTopic);
            const showCustomSubTopic = isCustomSubTopic || (aiSubTopic !== "" && !isPresetSubTopic);

            if (showCustomSubTopic) {
              return (
                <div className="relative flex items-center h-9 w-44">
                  <input
                    value={aiSubTopic}
                    onChange={(e) => setAiSubTopic?.(e.target.value)}
                    placeholder="추천 시리즈 직접 입력"
                    className="h-9 w-full rounded-lg border border-zinc-800 bg-black/40 pl-3 pr-12 text-xs text-white outline-none placeholder-zinc-500 focus:border-violet-500 font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomSubTopic(false);
                      const firstSub = filteredSubTopics[0];
                      if (firstSub) {
                        setAiSubTopic?.(firstSub.name);
                      } else {
                        setAiSubTopic?.("");
                      }
                    }}
                    className="absolute right-2 text-cyan-400 hover:text-cyan-300 text-[10px] font-black"
                  >
                    선택 전환
                  </button>
                </div>
              );
            }

            return (
              <select
                value={aiSubTopic}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "__custom__") {
                    setIsCustomSubTopic(true);
                    setAiSubTopic?.("");
                  } else {
                    setAiSubTopic?.(val);
                  }
                }}
                disabled={isAiGenerating || isFetchingOriginal || isRecreating || !aiMainTopic}
                className="h-9 w-44 rounded-lg border border-zinc-800 bg-black/40 px-2.5 text-xs text-white outline-none focus:border-violet-500 font-bold disabled:opacity-50 disabled:cursor-not-allowed text-center"
              >
                <option value="" disabled hidden>추천 시리즈</option>
                <option value="" className="bg-slate-950">
                  {aiMainTopic ? "시리즈 선택" : "상세분야 필요"}
                </option>
                {filteredSubTopics.map((sub) => (
                  <option key={sub.id} value={sub.name} className="bg-slate-950">
                    ⚡ {sub.name}
                  </option>
                ))}
                {aiMainTopic && (
                  <option value="__custom__" className="bg-slate-950">
                    📝 직접 입력...
                  </option>
                )}
              </select>
            );
          })()}

          {/* 10. 메인 키워드 주제 */}
          <input
            type="text"
            placeholder="메인 키워드 주제 입력"
            value={aiTargetKeyword}
            onChange={(e) => setAiTargetKeyword?.(e.target.value)}
            disabled={isAiGenerating || isFetchingOriginal || isRecreating}
            className="h-9 w-64 rounded-lg border border-zinc-800 bg-black/40 px-3 text-xs text-white outline-none focus:border-violet-500 font-bold disabled:opacity-50 text-center"
          />

          {/* 11. 참고 사항 */}
          <input
            type="text"
            placeholder="참고 사항 입력 (선택)"
            value={aiReferenceNote}
            onChange={(e) => setAiReferenceNote?.(e.target.value)}
            disabled={isAiGenerating || isFetchingOriginal || isRecreating}
            className="h-9 w-64 rounded-lg border border-zinc-800 bg-black/40 px-3 text-xs text-white outline-none focus:border-violet-500 font-bold disabled:opacity-50 text-center"
          />

          {/* AI 생성 상태 알림 */}
          {isAiGenerating && (
            <div className="flex items-center gap-2 ml-2">
              <span className="text-[11px] text-zinc-400 animate-pulse font-medium">
                {aiStatusMessage || "생성 중..."}
              </span>
            </div>
          )}

          {/* 우측 정렬 영역: 최신 검색 + 시작 버튼 */}
          <div className="flex items-center gap-3 ml-auto shrink-0 justify-center">
            {/* Grounding 토글 (최신 검색) */}
            <label className="flex items-center gap-1.5 cursor-pointer select-none text-xs font-black text-zinc-300">
              <input
                type="checkbox"
                checked={aiUseSearch}
                onChange={(e) => setAiUseSearch?.(e.target.checked)}
                disabled={isAiGenerating || isFetchingOriginal || isRecreating}
                className="h-4.5 w-4.5 rounded border-zinc-800 bg-black/40 text-violet-600 focus:ring-violet-500 focus:ring-offset-0 disabled:opacity-50"
              />
              <span>최신 검색</span>
            </label>

            <button
              type="button"
              onClick={() => handleAiGenerateInEditor?.(
                aiTargetKeyword || targetKeyword,
                aiContentType,
                aiPostType,
                aiSelectedTone,
                aiWordCountGoal,
                aiStrategyLevel,
                aiResultFormat,
                aiLargeCategory,
                aiMainTopic,
                aiSubTopic,
                aiReferenceNote,
                aiUseSearch
              )}
              disabled={isAiGenerating || isFetchingOriginal || isRecreating || !!(content && content.replace(/<[^>]*>/g, "").trim().length > 100)}
              className="w-48 h-9 rounded-lg bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 text-white font-black text-xs hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-[0_8px_18px_rgba(124,58,237,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAiGenerating ? (
                <>
                  <RefreshCw size={12} className="animate-spin" />
                  <span>생성 중...</span>
                </>
              ) : (
                <>
                  <Sparkles size={12} />
                  <span>AI 콘텐츠 생성 시작</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* AI 포스팅 재창조 가로 제어 바 */}
      <div className="shrink-0 border-b border-zinc-850 bg-[#0c101f] px-4 py-2.5 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 shrink-0 text-fuchsia-400 text-xs font-black w-28">
          <Zap size={14} className="animate-pulse" />
          <span>AI 포스팅 재창조</span>
        </div>
        <div className="mx-1 h-4 w-px bg-zinc-850 shrink-0" />

        <input
          type="text"
          value={recreateUrl}
          onChange={(e) => setRecreateUrl(e.target.value)}
          disabled={isAiGenerating || isFetchingOriginal || isRecreating}
          placeholder="타겟 주소 입력 (https://blog.naver.com/...)"
          className="h-9 flex-1 max-w-[400px] rounded-lg border border-zinc-800 bg-black/40 px-3 text-xs text-white outline-none focus:border-violet-500 font-bold text-center placeholder-zinc-500 disabled:opacity-50"
        />

        <button
          type="button"
          onClick={handleFetchOriginalText}
          disabled={isAiGenerating || isFetchingOriginal || isRecreating}
          className="w-48 h-9 rounded-lg bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 text-white font-black text-xs hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-[0_8px_18px_rgba(124,58,237,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isFetchingOriginal ? (
            <>
              <RefreshCw size={12} className="animate-spin" />
              <span>가져오는 중...</span>
            </>
          ) : (
            <>
              <Download size={12} />
              <span>URL 원본 글 가져오기</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleStartRecreation}
          disabled={isAiGenerating || isFetchingOriginal || isRecreating}
          className="w-48 h-9 rounded-lg bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 text-white font-black text-xs hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-[0_8px_18px_rgba(124,58,237,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRecreating ? (
            <>
              <RefreshCw size={12} className="animate-spin" />
              <span>재창조 중...</span>
            </>
          ) : (
            <>
              <Zap size={12} />
              <span>AI 글 재창조 시작</span>
            </>
          )}
        </button>
      </div>

        {/* AI 수정보완 제어 바 */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-zinc-800/40 pt-1.5">
          <div className="flex items-center gap-1.5 shrink-0 text-emerald-400 text-xs font-black w-28">
            <Wand2 size={14} />
            <span>AI 수정보완</span>
          </div>
          <div className="mx-1 h-4 w-px bg-zinc-850 shrink-0" />

          {/* AI 내용 보강 */}
          <div className="relative" ref={contentDropdownRef}>
            <button
              type="button"
              onClick={() => setIsContentDropdownOpen((prev) => !prev)}
              disabled={isSaving || isEnhancingContent || isEnhancingToc || isPolishing || isChangingPostType || isApplyingSearch}
              className="flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-black transition-all text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isEnhancingContent ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Wand2 size={14} />
              )}
              {isEnhancingContent ? "보강 중..." : "AI 내용 보강"}
            </button>
            {isContentDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-44 rounded-xl border border-zinc-800 bg-[#121214] py-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50">
                <div className="px-3 py-1 text-[10px] font-black text-zinc-500 uppercase tracking-wider">
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
                    className="flex w-full items-center px-3 py-2 text-left text-xs font-bold text-zinc-300 hover:bg-zinc-800/80 hover:text-white transition-colors"
                  >
                    {percent}% 내용 보강
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* AI 목차 및 내용 보강 */}
          <div className="relative" ref={tocDropdownRef}>
            <button
              type="button"
              onClick={() => setIsTocDropdownOpen((prev) => !prev)}
              disabled={isSaving || isEnhancingContent || isEnhancingToc || isPolishing || isChangingPostType || isApplyingSearch}
              className="flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-black transition-all text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isEnhancingToc ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Wand2 size={14} />
              )}
              {isEnhancingToc ? "보강 중..." : "AI 목차 및 내용 보강"}
            </button>
            {isTocDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-44 max-h-[480px] overflow-y-auto custom-scrollbar rounded-xl border border-zinc-800 bg-[#121214] py-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50">
                <div className="px-3 py-1 text-[10px] font-black text-zinc-500 uppercase tracking-wider">
                  문맥 목차 보강
                </div>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => {
                      handleEnhanceContent(`expand_toc_${count}`);
                      setIsTocDropdownOpen(false);
                    }}
                    className="flex w-full items-center px-3 py-2 text-left text-xs font-bold text-zinc-300 hover:bg-zinc-800/80 hover:text-white transition-colors"
                  >
                    목차 {count}개 보강
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* AI 글 다듬기 */}
          <ToolbarButton
            onClick={() => handleEnhanceContent("polish")}
            disabled={isSaving || isEnhancingContent || isEnhancingToc || isPolishing || isChangingPostType || isApplyingSearch}
            className="text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
          >
            {isPolishing ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Sparkles size={14} />
            )}
            {isPolishing ? "다듬는 중..." : "AI 글 다듬기"}
          </ToolbarButton>

          {/* AI 포스트 타입 변경 */}
          <div className="relative" ref={postTypeDropdownRef}>
            <button
              type="button"
              onClick={() => setIsPostTypeDropdownOpen((prev) => !prev)}
              disabled={isSaving || isEnhancingContent || isEnhancingToc || isPolishing || isChangingPostType || isApplyingSearch}
              className="flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-black transition-all text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isChangingPostType ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Wand2 size={14} />
              )}
              {isChangingPostType ? "변경 중..." : "AI 포스트 타입 변경"}
            </button>
            {isPostTypeDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-60 max-h-[480px] overflow-y-auto custom-scrollbar rounded-xl border border-zinc-800 bg-[#121214] py-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50">
                {postTypeOptions.map((item) => {
                  if (item.disabled) {
                    return (
                      <div
                        key={item.label}
                        className="px-3 py-1.5 text-[10px] font-black text-cyan-400 border-b border-zinc-800 mt-2 first:mt-0 bg-zinc-900/40"
                      >
                        {item.label}
                      </div>
                    );
                  }
                  return (
                    <button
                      key={item.label}
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
                      className="flex w-full items-center px-4 py-2 text-left text-xs font-bold text-zinc-300 hover:bg-zinc-800/80 hover:text-white transition-colors"
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
            className="text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
          >
            {isApplyingSearch ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Globe size={14} />
            )}
            {isApplyingSearch ? "실시간 검색 반영 중..." : "Google Search 실시간 정보 반영"}
          </ToolbarButton>

          {onGenerateSeo && (
            <button
              type="button"
              onClick={onGenerateSeo}
              disabled={isGeneratingSeo || isSaving || !title}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-2 text-xs font-black text-emerald-300 transition-all hover:bg-emerald-500/20 disabled:opacity-40"
            >
              {isGeneratingSeo ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Wand2 size={14} />
              )}
              {isGeneratingSeo ? "SEO 생성 중..." : "AI SEO최적화 생성"}
            </button>
          )}
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
          vertical-align: top;
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
          color: #71717a;
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
    </div>
  );
}
