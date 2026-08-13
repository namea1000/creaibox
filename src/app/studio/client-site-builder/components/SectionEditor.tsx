"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Edit, Image as ImageIcon, Save, Loader2, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";

interface SectionEditorProps {
  siteId: string;
}

interface SiteSection {
  id: string;
  section_type: string;
  sort_order: number;
  title: string;
  subtitle: string;
  content_data: any;
}

export default function SectionEditor({ siteId }: { siteId: string }) {
  const [sections, setSections] = useState<any[]>([]);
  const [selectedSection, setSelectedSection] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"main" | "sub">("main");
  const [deletedSectionIds, setDeletedSectionIds] = useState<string[]>([]);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  const supabase = createClient();

  const fetchSections = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("site_sections")
        .select("*")
        .eq("site_id", siteId)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setSections(data || []);
      if (data && data.length > 0) {
        setSelectedSection(data[0]);
      }

    } catch (err) {
      console.error("Failed to load sections/menus:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, [siteId]);

  const handleUpdateField = (key: string, value: any) => {
    if (!selectedSection) return;
    const updated = {
      ...selectedSection,
      [key]: value
    };
    setSelectedSection(updated);
    setSections(prev => prev.map(s => s.id === selectedSection.id ? updated : s));
  };

  const handleUpdateContentData = (key: string, value: any) => {
    if (!selectedSection) return;
    const updated = {
      ...selectedSection,
      content_data: {
        ...(selectedSection.content_data || {}),
        [key]: value
      }
    };
    setSelectedSection(updated);
    setSections(prev => prev.map(s => s.id === selectedSection.id ? updated : s));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, itemIndex: number | null = null) => {
    const file = e.target.files?.[0];
    if (!file || !selectedSection) return;

    const idxKey = itemIndex !== null ? itemIndex : -99;
    setUploadingIdx(idxKey);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("sourceId", siteId);

    try {
      const res = await fetch("/api/client-site-builder/upload", {
        method: "POST",
        body: formData
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "이미지 업로드에 실패했습니다.");
      }

      const imageUrl = resData.url;

      if (itemIndex !== null) {
        // Update nested list item image
        const items = [...(selectedSection.content_data.items || [])];
        items[itemIndex] = {
          ...items[itemIndex],
          image: imageUrl
        };
        handleUpdateContentData("items", items);
      } else {
        // Update main hero background image
        handleUpdateContentData("backgroundImage", imageUrl);
      }
    } catch (err: any) {
      alert(err.message || "업로드 오류가 발생했습니다.");
    } finally {
      setUploadingIdx(null);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      // 1. Delete removed sections
      if (deletedSectionIds.length > 0) {
        const { error: deleteError } = await supabase
          .from("site_sections")
          .delete()
          .in("id", deletedSectionIds);
        if (deleteError) throw deleteError;
      }

      // 2. Save Section Changes (Upsert)
      // Filter out any sections that are locally marked as deleted just in case
      const sectionsToSave = sections.filter(s => !deletedSectionIds.includes(s.id));
      
      const existingSections = sectionsToSave
        .filter(s => !s.id.startsWith("temp_"))
        .map(sect => ({
          id: sect.id,
          site_id: siteId,
          section_type: sect.section_type,
          sort_order: sect.sort_order,
          title: sect.title || "",
          subtitle: sect.subtitle || "",
          content_data: sect.content_data || {}
        }));

      const newSections = sectionsToSave
        .filter(s => s.id.startsWith("temp_"))
        .map(sect => ({
          site_id: siteId,
          section_type: sect.section_type,
          sort_order: sect.sort_order,
          title: sect.title || "",
          subtitle: sect.subtitle || "",
          content_data: sect.content_data || {}
        }));

      if (existingSections.length > 0) {
        const { error } = await supabase.from("site_sections").upsert(existingSections);
        if (error) throw error;
      }
      
      if (newSections.length > 0) {
        const { error } = await supabase.from("site_sections").insert(newSections);
        if (error) throw error;
      }

      alert("모든 변경사항이 안전하게 저장되었습니다.");
      
      // Reload sections to get actual UUIDs for new sections
      fetchSections();
      setDeletedSectionIds([]);
    } catch (err) {
      console.error("Save failed:", err);
      alert("변경 사항 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
      {/* Sections List */}
      <div className="lg:col-span-4 bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider">섹션 레이아웃 목록</h2>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab("main")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === "main"
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400"
            }`}
          >
            메인 랜딩페이지
          </button>
          <button
            onClick={() => setActiveTab("sub")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === "sub"
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400"
            }`}
          >
            서브 페이지
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-emerald-500" size={24} />
          </div>
        ) : (
          <div className="space-y-2">
            {activeTab === "sub" && (
              <button 
                onClick={() => {
                  const newSlug = `new_${Date.now()}`;
                  const newSection = {
                    id: `temp_${Date.now()}`,
                    site_id: siteId,
                    section_type: `subpage_${newSlug}`,
                    sort_order: sections.length,
                    title: "새 페이지",
                    content_data: { html: "<div class='py-20 text-center text-slate-500'>새로운 서브페이지 내용입니다. 내용을 자유롭게 편집하세요.</div>" }
                  };
                  setSections([...sections, newSection]);
                  setSelectedSection(newSection);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 mb-4 text-xs font-extrabold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all"
              >
                <Plus size={14} /> 새 페이지 추가
              </button>
            )}
            {sections
              .filter(sect => 
                activeTab === "main" 
                  ? !sect.section_type.startsWith("subpage_") 
                  : sect.section_type.startsWith("subpage_")
              )
              .map((sect, index) => {
              const isSelected = selectedSection?.id === sect.id;
              return (
                <div key={sect.id} className="flex gap-2 w-full">
                  <button
                    onClick={() => setSelectedSection(sect)}
                    className={`flex-1 flex items-center justify-between p-4 rounded-xl text-left font-bold transition-all border ${
                      isSelected
                        ? "bg-emerald-600 text-white border-transparent shadow-md"
                        : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span className="text-xs uppercase truncate pr-4">{sect.title || `${sect.section_type}`} #{index + 1}</span>
                    <Edit size={14} className={isSelected ? "text-white" : "opacity-60"} />
                  </button>
                  {activeTab === "sub" && (
                    <button
                      onClick={() => {
                        if (confirm(`'${sect.title || sect.section_type}' 페이지를 정말 삭제하시겠습니까?`)) {
                          if (!sect.id.startsWith("temp_")) {
                            setDeletedSectionIds([...deletedSectionIds, sect.id]);
                          }
                          setSections(sections.filter(s => s.id !== sect.id));
                          if (selectedSection?.id === sect.id) {
                            setSelectedSection(null);
                          }
                        }
                      }}
                      className="p-4 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl border border-slate-200 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Editor Details Panel */}
      <div className="lg:col-span-8 bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
        {selectedSection ? (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400">편집 중인 영역</span>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                  {selectedSection.section_type.toUpperCase()} Section
                </h3>
              </div>
            </div>

            {/* Subpage specific inputs: Menu Title & URL Path */}
            {selectedSection.section_type.startsWith("subpage_") && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">메뉴 이름 (헤더에 표시됨)</label>
                  <input
                    type="text"
                    value={selectedSection.title || ""}
                    onChange={(e) => handleUpdateField("title", e.target.value)}
                    className="w-full text-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 focus:outline-none"
                    placeholder="예: 회사 소개, 공지사항"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">URL 경로 (영문 소문자 권장)</label>
                  <div className="flex items-center gap-2 w-full text-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 focus-within:border-emerald-500 transition-colors">
                    <span className="text-slate-400 font-mono">/</span>
                    <input
                      type="text"
                      value={selectedSection.section_type.replace("subpage_", "")}
                      onChange={(e) => {
                        const newSlug = e.target.value.toLowerCase().replace(/\s+/g, "-");
                        handleUpdateField("section_type", `subpage_${newSlug}`);
                      }}
                      className="w-full bg-transparent focus:outline-none font-mono"
                      placeholder="about, notice"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 ml-1">입력하신 경로가 실제 접속 주소가 됩니다. (예: domain.com/<strong>about</strong>)</span>
                </div>
              </>
            )}

            {/* Standard inputs: Title & Subtitle (Only for main page sections) */}
            {!selectedSection.section_type.startsWith("subpage_") && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">섹션 큰 제목</label>
                  <input
                    type="text"
                    value={selectedSection.title || ""}
                    onChange={(e) => handleUpdateField("title", e.target.value)}
                    className="w-full text-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">섹션 부제목/상세설명</label>
                  <input
                    type="text"
                    value={selectedSection.subtitle || ""}
                    onChange={(e) => handleUpdateField("subtitle", e.target.value)}
                    className="w-full text-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 focus:outline-none"
                  />
                </div>
              </>
            )}

            <div className="flex flex-col gap-1.5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">섹션 배경 색상 (선택)</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={selectedSection.content_data?.bg_color || "#ffffff"}
                  onChange={(e) => handleUpdateContentData("bg_color", e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                />
                <input
                  type="text"
                  placeholder="#FFFFFF 또는 투명(비워두기)"
                  value={selectedSection.content_data?.bg_color || ""}
                  onChange={(e) => handleUpdateContentData("bg_color", e.target.value)}
                  className="flex-1 text-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-2 focus:outline-none uppercase"
                />
                <button
                  onClick={() => handleUpdateContentData("bg_color", "")}
                  className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  초기화
                </button>
              </div>
            </div>

            {/* Dynamic fields based on section type */}
            {selectedSection.section_type === "hero" && (
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">히어로 섹션 이미지 세팅</h4>
                <div className="flex items-center gap-4">
                  {selectedSection.content_data.backgroundImage ? (
                    <img
                      src={selectedSection.content_data.backgroundImage}
                      alt="Hero Bg"
                      className="w-20 h-20 object-cover border border-slate-200 rounded-lg shadow-sm"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                      <ImageIcon size={24} />
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <label className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer">
                      {uploadingIdx === -99 ? (
                        <>
                          <Loader2 className="animate-spin mr-1" size={14} />
                          <span>업로드 중...</span>
                        </>
                      ) : (
                        <span>클라우드 업로드</span>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e)}
                        className="hidden"
                        disabled={uploadingIdx !== null}
                      />
                    </label>
                    <span className="text-[10px] text-slate-400 mt-1">* 클라이언트 격리 저장소로 자동 업로드됩니다.</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">CTA 버튼 글자</label>
                    <input
                      type="text"
                      value={selectedSection.content_data.ctaText || ""}
                      onChange={(e) => handleUpdateContentData("ctaText", e.target.value)}
                      className="text-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl px-3 py-2"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">CTA 연결 링크</label>
                    <input
                      type="text"
                      value={selectedSection.content_data.ctaLink || ""}
                      onChange={(e) => handleUpdateContentData("ctaLink", e.target.value)}
                      className="text-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl px-3 py-2"
                    />
                  </div>
                </div>
              </div>
            )}

            {["services", "portfolio"].includes(selectedSection.section_type) && (
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">세부 아이템 리스트 (카드 그리드)</h4>
                <div className="space-y-4">
                  {selectedSection.content_data.items?.map((item: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-400">아이템 #{idx + 1}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-500">카드 타이틀</label>
                          <input
                            type="text"
                            value={item.title || ""}
                            onChange={(e) => {
                              const list = [...selectedSection.content_data.items];
                              list[idx] = { ...list[idx], title: e.target.value };
                              handleUpdateContentData("items", list);
                            }}
                            className="text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19] rounded-lg px-3 py-2"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-500">
                            {selectedSection.section_type === "services" ? "아이콘명 (Lucide)" : "카드 썸네일"}
                          </label>
                          {selectedSection.section_type === "services" ? (
                            <input
                              type="text"
                              value={item.icon || ""}
                              onChange={(e) => {
                                const list = [...selectedSection.content_data.items];
                                list[idx] = { ...list[idx], icon: e.target.value };
                                handleUpdateContentData("items", list);
                              }}
                              className="text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19] rounded-lg px-3 py-2"
                            />
                          ) : (
                            <div className="flex items-center gap-3">
                              {item.image && (
                                <img src={item.image} className="w-10 h-10 object-cover rounded-lg border" />
                              )}
                              <label className="inline-flex items-center justify-center px-3 py-1.5 text-[10px] font-bold text-slate-700 bg-white dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer">
                                {uploadingIdx === idx ? (
                                  <Loader2 className="animate-spin" size={12} />
                                ) : (
                                  <span>드라이브 이미지 선택</span>
                                )}
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, idx)}
                                  className="hidden"
                                  disabled={uploadingIdx !== null}
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-500">상세 설명</label>
                        <textarea
                          rows={2}
                          value={item.description || ""}
                          onChange={(e) => {
                            const list = [...selectedSection.content_data.items];
                            list[idx] = { ...list[idx], description: e.target.value };
                            handleUpdateContentData("items", list);
                          }}
                          className="text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19] rounded-lg px-3 py-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedSection.section_type === "about" && (
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">회사/브랜드 통계 지표(Stats)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {selectedSection.content_data.stats?.map((stat: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 space-y-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-500">라벨명 (예: 만족도)</label>
                        <input
                          type="text"
                          value={stat.label || ""}
                          onChange={(e) => {
                            const stats = [...selectedSection.content_data.stats];
                            stats[idx] = { ...stats[idx], label: e.target.value };
                            handleUpdateContentData("stats", stats);
                          }}
                          className="text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19] rounded-lg px-3 py-2"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-500">수치 (예: 99.4%)</label>
                        <input
                          type="text"
                          value={stat.value || ""}
                          onChange={(e) => {
                            const stats = [...selectedSection.content_data.stats];
                            stats[idx] = { ...stats[idx], value: e.target.value };
                            handleUpdateContentData("stats", stats);
                          }}
                          className="text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19] rounded-lg px-3 py-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Commit save button */}
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="w-full flex items-center justify-center gap-1.5 py-4 text-sm font-extrabold text-white bg-slate-950 hover:bg-slate-900 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer mt-8"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              <span>전체 섹션 변경 사항 일괄 적용</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 py-20">
            <span className="text-xs font-bold">섹션 정보를 선택해주세요.</span>
          </div>
        )}
      </div>
    </div>
  );
}
