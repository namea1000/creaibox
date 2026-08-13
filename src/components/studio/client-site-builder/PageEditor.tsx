"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Save, Eye, EyeOff, Plus, Trash2, ArrowUp, ArrowDown,
  Loader2, CheckCircle2, X, Layers, ChevronRight, Image as ImageIcon,
  Upload, LayoutGrid, Type, CornerDownRight, AlertCircle
} from "lucide-react";
import { PAGE_EDITOR_BLOCKS, BLOCK_CATEGORIES, PageEditorBlock } from "@/constants/page-editor-blocks";

interface SiteSection {
  id: string;
  site_id: string;
  section_type: string;
  sort_order: number;
  title: string;
  subtitle: string;
  content_data: Record<string, any>;
}

interface PageEditorProps {
  siteId: string;
  brandId: string;
  slug: string; // "home" for main page, any slug for subpages
  companyName: string;
}

export default function PageEditor({ siteId, brandId, slug, companyName }: PageEditorProps) {
  const supabase = createClient();
  const previewRef = useRef<HTMLDivElement>(null);

  // ─── State ───────────────────────────────────────────────────────────────
  const [sections, setSections] = useState<SiteSection[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockCategory, setBlockCategory] = useState<string>("all");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // ─── Derived ─────────────────────────────────────────────────────────────
  const isMainPage = slug === "home";
  const targetSectionType = isMainPage ? null : `subpage_${slug}`;

  // For main page: all non-subpage sections; for subpage: only the target subpage section
  const pageSections = isMainPage
    ? sections.filter((s: SiteSection) => !s.section_type.startsWith("subpage_"))
    : sections.filter((s: SiteSection) => s.section_type === targetSectionType);

  const selectedSection = sections.find(s => s.id === selectedSectionId) || null;

  // ─── Load ─────────────────────────────────────────────────────────────────
  const fetchSections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await supabase
        .from("site_sections")
        .select("*")
        .eq("site_id", siteId)
        .order("sort_order", { ascending: true });

      if (fetchErr) throw fetchErr;
      const fetched = data || [];
      setSections(fetched);
      if (fetched.length > 0 && !selectedSectionId) {
        const first = isMainPage
          ? fetched.find((s: SiteSection) => !s.section_type.startsWith("subpage_"))
          : fetched.find((s: SiteSection) => s.section_type === targetSectionType);
        if (first) setSelectedSectionId(first.id);
      }
    } catch (e: any) {
      setError(e.message || "섹션을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [siteId, isMainPage, targetSectionType]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const updateSection = (id: string, updates: Partial<SiteSection>) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const updateContentData = (id: string, key: string, value: any) => {
    setSections(prev => prev.map(s =>
      s.id === id
        ? { ...s, content_data: { ...(s.content_data || {}), [key]: value } }
        : s
    ));
  };

  // ─── Save ─────────────────────────────────────────────────────────────────
  const handleSaveAll = async () => {
    setSaving(true);
    setSavedOk(false);
    try {
      // 1. Delete removed sections
      if (deletedIds.length > 0) {
        const realIds = deletedIds.filter(id => !id.startsWith("temp_"));
        if (realIds.length > 0) {
          const { error: delErr } = await supabase.from("site_sections").delete().in("id", realIds);
          if (delErr) throw delErr;
        }
      }

      // 2. Upsert existing (non-temp) sections
      const existing = sections
        .filter(s => !s.id.startsWith("temp_") && !deletedIds.includes(s.id))
        .map(s => ({
          id: s.id,
          site_id: siteId,
          section_type: s.section_type,
          sort_order: s.sort_order,
          title: s.title || "",
          subtitle: s.subtitle || "",
          content_data: s.content_data || {}
        }));

      if (existing.length > 0) {
        const { error: upErr } = await supabase.from("site_sections").upsert(existing);
        if (upErr) throw upErr;
      }

      // 3. Insert new (temp) sections
      const newSects = sections
        .filter(s => s.id.startsWith("temp_") && !deletedIds.includes(s.id))
        .map(s => ({
          site_id: siteId,
          section_type: s.section_type,
          sort_order: s.sort_order,
          title: s.title || "",
          subtitle: s.subtitle || "",
          content_data: s.content_data || {}
        }));

      if (newSects.length > 0) {
        const { error: insErr } = await supabase.from("site_sections").insert(newSects);
        if (insErr) throw insErr;
      }

      setDeletedIds([]);
      setSavedOk(true);
      setTimeout(() => setSavedOk(false), 3000);
      fetchSections();
    } catch (e: any) {
      alert("저장 실패: " + (e.message || "알 수 없는 오류"));
    } finally {
      setSaving(false);
    }
  };

  // ─── Add Block ────────────────────────────────────────────────────────────
  const handleAddBlock = (block: PageEditorBlock) => {
    const maxOrder = sections.reduce((m, s) => Math.max(m, s.sort_order || 0), 0);
    const sectionType = isMainPage
      ? `custom_${block.id}_${Date.now()}`
      : (targetSectionType || `subpage_new_${Date.now()}`);

    const newSection: SiteSection = {
      id: `temp_${Date.now()}`,
      site_id: siteId,
      section_type: sectionType,
      sort_order: maxOrder + 1,
      title: block.label,
      subtitle: "",
      content_data: { html: block.defaultHtml, ai_generated: false }
    };

    setSections(prev => [...prev, newSection]);
    setSelectedSectionId(newSection.id);
    setShowBlockModal(false);
  };

  // ─── Delete Section ───────────────────────────────────────────────────────
  const handleDeleteSection = (id: string) => {
    if (!confirm("이 섹션을 삭제하시겠습니까? 저장 후 실제 반영됩니다.")) return;
    setDeletedIds(prev => [...prev, id]);
    setSections(prev => prev.filter(s => s.id !== id));
    if (selectedSectionId === id) setSelectedSectionId(null);
  };

  // ─── Move Section ─────────────────────────────────────────────────────────
  const handleMoveSection = (id: string, dir: "up" | "down") => {
    const visible = pageSections.slice().sort((a, b) => a.sort_order - b.sort_order);
    const idx = visible.findIndex(s => s.id === id);
    if (dir === "up" && idx === 0) return;
    if (dir === "down" && idx === visible.length - 1) return;

    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    const aOrder = visible[idx].sort_order;
    const bOrder = visible[swapIdx].sort_order;

    setSections(prev => prev.map(s => {
      if (s.id === visible[idx].id) return { ...s, sort_order: bOrder };
      if (s.id === visible[swapIdx].id) return { ...s, sort_order: aOrder };
      return s;
    }));
  };

  // ─── Image Upload ─────────────────────────────────────────────────────────
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, sectionId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("sourceId", siteId);
      const res = await fetch("/api/client-site-builder/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "업로드 실패");
      updateContentData(sectionId, "backgroundImage", data.url);
    } catch (e: any) {
      alert("이미지 업로드 실패: " + e.message);
    } finally {
      setUploadingImage(false);
    }
  };

  // ─── Inline HTML edit ────────────────────────────────────────────────────
  const handleHtmlChange = (id: string, html: string) => {
    updateContentData(id, "html", html);
  };

  const sortedPageSections = [...pageSections].sort((a, b) => a.sort_order - b.sort_order);

  // ─── Render ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin text-emerald-500 mx-auto" size={36} />
          <p className="text-sm font-bold text-slate-500">페이지 에디터 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <AlertCircle className="text-red-400 mx-auto" size={32} />
          <p className="text-sm font-bold text-red-500">{error}</p>
          <button onClick={fetchSections} className="px-4 py-2 text-xs font-black text-white bg-slate-900 rounded-xl">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-screen bg-slate-950">
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 z-20 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <LayoutGrid size={16} className="text-emerald-400" />
            <span className="text-sm font-black text-white">
              {isMainPage ? `메인 홈페이지 (/)` : `서브페이지 (/${slug})`}
            </span>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-lg">
              {companyName}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewMode(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-black rounded-xl border transition-all ${
              previewMode
                ? "border-emerald-500 text-emerald-400 bg-emerald-500/10"
                : "border-slate-700 text-slate-400 hover:text-white hover:border-slate-500"
            }`}
          >
            {previewMode ? <EyeOff size={14} /> : <Eye size={14} />}
            {previewMode ? "편집 모드" : "미리보기 모드"}
          </button>
          <a
            href={`http://${brandId}.localhost:3000${isMainPage ? "" : `/${slug}`}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-black text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded-xl transition-all"
          >
            <Eye size={14} />
            실제 사이트
          </a>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-xl shadow-lg transition-all active:scale-95"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : savedOk ? <CheckCircle2 size={14} /> : <Save size={14} />}
            {saving ? "저장 중..." : savedOk ? "저장 완료!" : "저장하기"}
          </button>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left Panel: Section List ── */}
        {!previewMode && (
          <div className="w-64 shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col overflow-y-auto">
            <div className="p-4 border-b border-slate-800">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Layers size={12} />
                섹션 목록 ({sortedPageSections.length})
              </h3>
              <button
                onClick={() => setShowBlockModal(true)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-black text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/10 rounded-xl transition-all"
              >
                <Plus size={14} />
                새 블록 추가
              </button>
            </div>
            <div className="flex-1 p-3 space-y-1.5 overflow-y-auto">
              {sortedPageSections.length === 0 && (
                <div className="text-center py-10 space-y-3">
                  <LayoutGrid size={28} className="text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-500 font-semibold">섹션이 없습니다.<br/>새 블록을 추가해 보세요.</p>
                </div>
              )}
              {sortedPageSections.map((section, idx) => (
                <div
                  key={section.id}
                  onClick={() => setSelectedSectionId(section.id)}
                  className={`group relative rounded-xl p-3 cursor-pointer transition-all border ${
                    selectedSectionId === section.id
                      ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                      : "bg-slate-800/40 border-transparent hover:bg-slate-800 hover:border-slate-700 text-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black truncate">{section.title || section.section_type}</p>
                      <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">{section.section_type}</p>
                    </div>
                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        onClick={e => { e.stopPropagation(); handleMoveSection(section.id, "up"); }}
                        className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); handleMoveSection(section.id, "down"); }}
                        className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                      >
                        <ArrowDown size={12} />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); handleDeleteSection(section.id); }}
                        className="p-1 rounded hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Right: Preview + Edit Panel ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Edit panel for selected section */}
          {!previewMode && selectedSection && (
            <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
              <div className="flex items-center gap-2 mb-4">
                <ChevronRight size={14} className="text-emerald-400" />
                <h3 className="text-sm font-black text-white">
                  편집 중: <span className="text-emerald-400">{selectedSection.title || selectedSection.section_type}</span>
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Type size={11} /> 섹션 제목
                  </label>
                  <input
                    type="text"
                    value={selectedSection.title || ""}
                    onChange={e => updateSection(selectedSection.id, { title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-white font-semibold outline-none transition-colors"
                    placeholder="섹션 제목"
                  />
                </div>
                {/* Subtitle */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <CornerDownRight size={11} /> 부제목
                  </label>
                  <input
                    type="text"
                    value={selectedSection.subtitle || ""}
                    onChange={e => updateSection(selectedSection.id, { subtitle: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-white font-semibold outline-none transition-colors"
                    placeholder="부제목 (선택)"
                  />
                </div>
                {/* Image Upload */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <ImageIcon size={11} /> 배경/대표 이미지
                  </label>
                  <label className={`flex items-center gap-2 px-3 py-2 border rounded-xl cursor-pointer transition-all text-xs font-bold ${
                    uploadingImage
                      ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/5"
                      : "border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 bg-slate-900"
                  }`}>
                    {uploadingImage
                      ? <><Loader2 size={13} className="animate-spin" /> 업로드 중...</>
                      : <><Upload size={13} /> 이미지 업로드</>
                    }
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => handleImageUpload(e, selectedSection.id)}
                      disabled={uploadingImage}
                    />
                  </label>
                  {selectedSection.content_data?.backgroundImage && (
                    <p className="text-[10px] text-emerald-400 font-bold truncate">
                      ✓ 이미지 적용됨
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* HTML Preview & Inline Editor */}
          <div
            ref={previewRef}
            className="flex-1 overflow-y-auto bg-white"
          >
            {sortedPageSections.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[500px] bg-slate-50 space-y-4">
                <LayoutGrid size={48} className="text-slate-200" />
                <p className="text-sm text-slate-400 font-bold">아직 섹션이 없습니다.</p>
                <button
                  onClick={() => setShowBlockModal(true)}
                  className="flex items-center gap-2 px-6 py-3 text-sm font-black text-white bg-emerald-600 hover:bg-emerald-500 rounded-2xl shadow-lg transition-all"
                >
                  <Plus size={16} />
                  첫 블록 추가하기
                </button>
              </div>
            ) : (
              <div>
                {sortedPageSections.map(section => {
                  const html = section.content_data?.html || "";
                  const isSelected = selectedSectionId === section.id;
                  return (
                    <div
                      key={section.id}
                      onClick={() => !previewMode && setSelectedSectionId(section.id)}
                      className={`relative group transition-all ${
                        !previewMode ? "cursor-pointer" : ""
                      } ${
                        isSelected && !previewMode
                          ? "ring-2 ring-emerald-500 ring-offset-0"
                          : ""
                      }`}
                    >
                      {/* Section select overlay */}
                      {!previewMode && !isSelected && (
                        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors z-10 pointer-events-none" />
                      )}
                      {/* Selected indicator */}
                      {!previewMode && isSelected && (
                        <div className="absolute top-2 left-2 z-20 bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg flex items-center gap-1">
                          <ChevronRight size={10} />
                          편집 중
                        </div>
                      )}
                      {/* Inline HTML editor (contentEditable) */}
                      {isSelected && !previewMode ? (
                        <div
                          contentEditable
                          suppressContentEditableWarning
                          dangerouslySetInnerHTML={{ __html: html }}
                          onBlur={e => handleHtmlChange(section.id, e.currentTarget.innerHTML)}
                          className="outline-none"
                        />
                      ) : (
                        <div dangerouslySetInnerHTML={{ __html: html }} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Block Add Modal ── */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Plus size={18} className="text-emerald-400" />
                  새 블록 추가
                </h2>
                <p className="text-xs text-slate-400 font-semibold mt-1">원하는 섹션 블록을 선택하세요. 선택 후 직접 내용을 수정할 수 있습니다.</p>
              </div>
              <button
                onClick={() => setShowBlockModal(false)}
                className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            {/* Category filter */}
            <div className="flex gap-2 px-6 py-3 border-b border-slate-800 overflow-x-auto">
              {BLOCK_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setBlockCategory(cat.id)}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg whitespace-nowrap transition-all ${
                    blockCategory === cat.id
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            {/* Block grid */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PAGE_EDITOR_BLOCKS
                  .filter(b => blockCategory === "all" || b.category === blockCategory)
                  .map(block => (
                    <button
                      key={block.id}
                      onClick={() => handleAddBlock(block)}
                      className="flex flex-col items-center gap-2 p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500/50 rounded-2xl text-center transition-all group"
                    >
                      <span className="text-3xl group-hover:scale-110 transition-transform">{block.icon}</span>
                      <span className="text-xs font-black text-white">{block.label}</span>
                      <span className="text-[10px] text-slate-500 capitalize">{block.category}</span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
