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

export default function SectionEditor({ siteId }: SectionEditorProps) {
  const [sections, setSections] = useState<SiteSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<SiteSection | null>(null);
  const [saving, setSaving] = useState(false);
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
      console.error("Failed to load sections:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, [siteId]);

  const handleUpdateField = (key: string, value: any) => {
    if (!selectedSection) return;
    setSelectedSection({
      ...selectedSection,
      [key]: value
    });
  };

  const handleUpdateContentData = (key: string, value: any) => {
    if (!selectedSection) return;
    setSelectedSection({
      ...selectedSection,
      content_data: {
        ...(selectedSection.content_data || {}),
        [key]: value
      }
    });
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

  const handleSaveSection = async () => {
    if (!selectedSection) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("site_sections")
        .update({
          title: selectedSection.title,
          subtitle: selectedSection.subtitle,
          content_data: selectedSection.content_data
        })
        .eq("id", selectedSection.id);

      if (error) throw error;

      // Sync local list
      setSections(sections.map(s => s.id === selectedSection.id ? selectedSection : s));
      alert("섹션 수정 내용이 실시간 반영되었습니다!");
    } catch (err) {
      console.error("Save section failed:", err);
      alert("변경 사항 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
      {/* Sections List */}
      <div className="lg:col-span-4 bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4">섹션 레이아웃 목록</h2>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-emerald-500" size={24} />
          </div>
        ) : (
          <div className="space-y-2">
            {sections.map((sect) => {
              const isSelected = selectedSection?.id === sect.id;
              return (
                <button
                  key={sect.id}
                  onClick={() => setSelectedSection(sect)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl text-left font-bold transition-all border ${
                    isSelected
                      ? "bg-[var(--primary)] text-white border-transparent shadow-md"
                      : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="text-xs uppercase">{sect.section_type} 섹션</span>
                  <Edit size={14} className="opacity-60" />
                </button>
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

            {/* Standard inputs: Title & Subtitle */}
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
              onClick={handleSaveSection}
              disabled={saving}
              className="w-full flex items-center justify-center gap-1.5 py-4 text-sm font-extrabold text-white bg-slate-950 hover:bg-slate-900 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>저장 중...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>섹션 레이아웃 변경 사항 실시간 적용</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-emerald-500 mb-3" size={32} />
            <span className="text-xs font-bold">섹션 정보를 분석 중입니다...</span>
          </div>
        )}
      </div>
    </div>
  );
}
