"use client";

import React, { useRef, useState } from "react";
import {
  UploadCloud,
  Globe,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  PlayCircle,
  PenLine,
  Database,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const tabs = [
  { id: "pdf", label: "PDF", icon: FileText, accept: ".pdf" },
  { id: "docx", label: "Word", icon: FileText, accept: ".docx" },
  { id: "pptx", label: "PPT", icon: FileText, accept: ".pptx" },
  { id: "xlsx", label: "Excel", icon: FileSpreadsheet, accept: ".xlsx,.csv" },
  { id: "image", label: "OCR", icon: ImageIcon, accept: "image/jpeg,image/png,image/webp" },
  { id: "youtube", label: "YouTube", icon: PlayCircle },
  { id: "text", label: "텍스트", icon: PenLine },
  { id: "url", label: "URL", icon: Globe },
];

function getSourceType(tab: string) {
  if (tab === "image") return "image";
  if (tab === "xlsx") return "spreadsheet";
  if (tab === "url") return "web_url";
  return tab;
}

function getFileExt(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() || "file";
}

export default function ResearchCreatePage() {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [activeTab, setActiveTab] = useState("url");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const active = tabs.find((tab) => tab.id === activeTab);

  async function getUserId() {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      throw new Error("로그인이 필요합니다.");
    }

    return data.user.id;
  }

  async function createProject(userId: string, fallbackTitle: string) {
    const title =
      projectTitle.trim() ||
      fallbackTitle ||
      `자료 분석 ${new Date().toLocaleString("ko-KR")}`;

    const { data, error } = await supabase
      .from("research_projects")
      .insert({
        user_id: userId,
        title,
        description: "자료 분석 스튜디오에서 생성한 프로젝트입니다.",
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  async function handleFileUpload(file: File) {
    try {
      setLoading(true);
      setMessage("");

      const userId = await getUserId();
      const project = await createProject(userId, file.name);

      const { data: source, error: sourceError } = await supabase
        .from("research_sources")
        .insert({
          project_id: project.id,
          user_id: userId,
          source_type: getSourceType(activeTab),
          title: file.name,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          status: "uploaded",
        })
        .select()
        .single();

      if (sourceError) throw sourceError;

      const ext = getFileExt(file.name);
      const safeName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9가-힣_-]/g, "-")
        .slice(0, 60);

      const storagePath = `${userId}/${project.id}/${source.id}/original/${Date.now()}-${safeName}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("research-assets")
        .upload(storagePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from("research_sources")
        .update({
          file_url: storagePath,
          status: "stored",
        })
        .eq("id", source.id);

      if (updateError) throw updateError;

      setMessage("파일 업로드와 DB 저장이 완료되었습니다.");
    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof Error ? error.message : "업로드 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleUrlSubmit() {
    try {
      setLoading(true);
      setMessage("");

      if (!url.trim()) {
        throw new Error("URL을 입력하세요.");
      }

      const userId = await getUserId();
      const project = await createProject(userId, url);

      const { data: source, error: sourceError } = await supabase
        .from("research_sources")
        .insert({
          project_id: project.id,
          user_id: userId,
          source_type: activeTab === "youtube" ? "youtube" : "web_url",
          title: url,
          original_url: url,
          status: "saved",
        })
        .select()
        .single();

      if (sourceError) throw sourceError;

      const { error: extractionError } = await supabase
        .from("research_extractions")
        .insert({
          source_id: source.id,
          user_id: userId,
          extracted_title: url,
          extracted_text: "",
          meta: {
            input_url: url,
            note: "URL 저장 완료. 실제 본문 추출 API는 다음 단계에서 연결합니다.",
          },
          images: [],
          char_count: 0,
          word_count: 0,
          language: "ko",
        });

      if (extractionError) throw extractionError;

      setMessage("URL이 프로젝트와 자료 보관함에 저장되었습니다.");
      setUrl("");
    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof Error ? error.message : "URL 저장 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleTextSubmit() {
    try {
      setLoading(true);
      setMessage("");

      if (!text.trim()) {
        throw new Error("텍스트를 입력하세요.");
      }

      const userId = await getUserId();
      const project = await createProject(userId, "텍스트 자료");

      const { data: source, error: sourceError } = await supabase
        .from("research_sources")
        .insert({
          project_id: project.id,
          user_id: userId,
          source_type: "text",
          title: projectTitle || "텍스트 자료",
          status: "extracted",
        })
        .select()
        .single();

      if (sourceError) throw sourceError;

      const { error: extractionError } = await supabase
        .from("research_extractions")
        .insert({
          source_id: source.id,
          user_id: userId,
          extracted_title: projectTitle || "텍스트 자료",
          extracted_text: text,
          summary: "",
          meta: {
            input_type: "manual_text",
          },
          images: [],
          char_count: text.length,
          word_count: text.trim().split(/\s+/).length,
          language: "ko",
        });

      if (extractionError) throw extractionError;

      setMessage("텍스트가 추출 결과로 저장되었습니다.");
      setText("");
    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof Error ? error.message : "텍스트 저장 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  }

  return (
    <div className="min-h-full bg-[#06080d] px-5 py-8 text-zinc-100 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-[#12091f] p-7 shadow-2xl">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-violet-400">
              <Database size={15} />
              Research Studio
            </div>

            <h1 className="text-3xl font-black md:text-5xl">새 자료 분석</h1>

            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400 md:text-base">
              PDF, 문서, 이미지, YouTube, 웹페이지 자료를 업로드하거나 URL을 입력하여
              프로젝트와 자료 보관함에 저장합니다.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
          <h2 className="mb-4 text-lg font-black">프로젝트 이름</h2>

          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            placeholder="예: 삼성전자 주가 분석 자료"
            className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-sm outline-none placeholder:text-zinc-600 focus:border-violet-500/50"
          />
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
          <h2 className="mb-4 text-lg font-black">분석 대상 선택</h2>

          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMessage("");
                  }}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-black transition ${activeTab === tab.id
                      ? "bg-violet-600 text-white"
                      : "border border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-violet-500/40"
                    }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </section>

        {(activeTab === "url" || activeTab === "youtube") && (
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <h2 className="text-lg font-black">
              {activeTab === "youtube" ? "YouTube 주소 입력" : "URL 입력"}
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              {activeTab === "youtube"
                ? "YouTube 영상 주소를 입력하면 자료로 저장합니다."
                : "블로그, 뉴스, 웹페이지 주소를 입력하면 자료로 저장합니다."}
            </p>

            <div className="mt-5 flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={
                  activeTab === "youtube"
                    ? "https://youtube.com/watch?v=..."
                    : "https://example.com/article"
                }
                className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-sm outline-none placeholder:text-zinc-600 focus:border-violet-500/50"
              />

              <button
                onClick={handleUrlSubmit}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-black text-white hover:bg-violet-500 disabled:opacity-50"
              >
                {loading ? <Loader2 size={17} className="animate-spin" /> : null}
                저장
              </button>
            </div>
          </section>
        )}

        {activeTab === "text" && (
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <h2 className="text-lg font-black">텍스트 붙여넣기</h2>

            <textarea
              rows={12}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="분석할 텍스트를 붙여넣으세요..."
              className="mt-4 w-full rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm outline-none placeholder:text-zinc-600 focus:border-violet-500/50"
            />

            <button
              onClick={handleTextSubmit}
              disabled={loading}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-black text-white hover:bg-violet-500 disabled:opacity-50"
            >
              {loading ? <Loader2 size={17} className="animate-spin" /> : null}
              저장
            </button>
          </section>
        )}

        {["pdf", "docx", "pptx", "xlsx", "image"].includes(activeTab) && (
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <h2 className="text-lg font-black">파일 업로드</h2>

            <p className="mt-2 text-sm text-zinc-500">
              파일 선택 또는 드래그 앤 드롭으로 업로드할 수 있습니다.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept={active?.accept}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`mt-5 flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed bg-zinc-950 transition ${isDragging
                  ? "border-violet-500 bg-violet-500/10"
                  : "border-zinc-700 hover:border-violet-500/50"
                }`}
            >
              <UploadCloud size={42} className="mb-3 text-violet-400" />

              <p className="font-black text-zinc-300">
                파일을 드래그하거나 클릭해서 선택
              </p>

              <p className="mt-2 text-xs text-zinc-600">
                PDF · DOCX · PPTX · XLSX · CSV · JPG · PNG · WEBP
              </p>

              <button
                type="button"
                className="mt-5 rounded-xl border border-zinc-700 px-4 py-2 text-sm font-black hover:border-violet-500/40"
              >
                파일 선택
              </button>
            </div>
          </section>
        )}

        {message && (
          <section
            className={`rounded-2xl border p-5 ${message.includes("완료") || message.includes("저장")
                ? "border-emerald-500/20 bg-emerald-500/5"
                : "border-red-500/20 bg-red-500/5"
              }`}
          >
            <div className="flex items-center gap-3">
              {message.includes("완료") || message.includes("저장") ? (
                <CheckCircle2 className="text-emerald-400" size={20} />
              ) : (
                <AlertCircle className="text-red-400" size={20} />
              )}

              <p className="text-sm font-bold text-zinc-300">{message}</p>
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
          <div className="flex items-center gap-3">
            <Sparkles className="text-violet-400" size={20} />
            <h2 className="text-lg font-black">현재 연결된 기능</h2>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {[
              "프로젝트 생성",
              "파일 Storage 저장",
              "research_sources 저장",
              "텍스트 research_extractions 저장",
              "URL 자료 저장",
              "드래그앤드롭 업로드",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-bold text-zinc-300"
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}