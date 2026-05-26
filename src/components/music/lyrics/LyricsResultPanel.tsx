"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Copy, Save, Download } from "lucide-react";
import type { MusicResultState, SongItem } from "./types";

function makeDownloadText(song: SongItem) {
  return `
제목
${song.title || ""}

곡의 소재 설명
${song.conceptDescription || ""}

Suno 스타일 프롬프트
${song.sunoPrompt || ""}

가사
${song.lyrics || ""}

Visual Description / Image Prompt
${song.visualDescription || ""}

Video Description / 영상 Prompt
${song.videoDescription || ""}

유튜브 제목 후보
${(song.youtubeTitles || []).map((t, i) => `${i + 1}. ${t}`).join("\n")}

유튜브 설명문
${song.youtubeDescription || ""}

해시태그
${(song.hashtags || []).join(" ")}
`.trim();
}

function makeAllDownloadText(songs: SongItem[]) {
  return songs
    .map(
      (song, index) => `
==============================
${index + 1}번째 곡
==============================

${makeDownloadText(song)}
`.trim()
    )
    .join("\n\n\n");
}

function makeSafeFilename(title: string) {
  return (title || "music-result")
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 80);
}

function downloadTextFile(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

function createFallbackSong(result: MusicResultState): SongItem {
  return {
    title: result.title || "",
    lyrics: result.lyrics || "",
    sunoPrompt: result.sunoPrompt || "",
    youtubeTitles: result.youtubeTitles || [],
    youtubeDescription: result.youtubeDescription || "",
    hashtags: result.hashtags || [],
    conceptDescription: result.conceptDescription || "",
    visualDescription: result.visualDescription || "",
    videoDescription: result.videoDescription || "",
  };
}

export default function LyricsResultPanel({
  result,
  setResult,
  isSaving,
  onSaveSong,
  onCopy,
}: {
  result: MusicResultState;
  setResult: React.Dispatch<React.SetStateAction<MusicResultState>>;
  isSaving: boolean;
  onSaveSong: (song: SongItem, songIndex: number) => Promise<boolean>;
  onCopy: (value: string) => void;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [savedSongIndexes, setSavedSongIndexes] = useState<number[]>([]);
  const manualSaveInProgressRef = useRef(false);

  const songs = useMemo<SongItem[]>(() => {
    if (result.songs && result.songs.length > 0) return result.songs;
    if (result.lyrics || result.sunoPrompt || result.title) {
      return [createFallbackSong(result)];
    }
    return [];
  }, [result]);

  useEffect(() => {
    if (selectedIndex > Math.max(songs.length - 1, 0)) {
      setSelectedIndex(0);
    }
  }, [songs.length, selectedIndex]);

  useEffect(() => {
    if (songs.length === 0) {
      setSavedSongIndexes([]);
      return;
    }

    if (manualSaveInProgressRef.current) return;

    if (result.batchId || result.savedId) {
      setSavedSongIndexes(Array.from({ length: songs.length }, (_, i) => i));
    }
  }, [result.batchId, result.savedId, songs.length]);

  const selectedSong = songs[selectedIndex];
  const isSelectedSaved = savedSongIndexes.includes(selectedIndex);

  const updateSelectedSong = (patch: Partial<SongItem>) => {
    if (!selectedSong) return;

    setResult((prev: MusicResultState) => {
      const baseSongs =
        prev.songs && prev.songs.length > 0
          ? [...prev.songs]
          : [createFallbackSong(prev)];

      const currentSong = baseSongs[selectedIndex] || createFallbackSong(prev);

      baseSongs[selectedIndex] = {
        ...currentSong,
        ...patch,
      };

      const first = baseSongs[0];

      return {
        ...prev,
        songs: baseSongs,
        title: first.title || "",
        lyrics: first.lyrics || "",
        sunoPrompt: first.sunoPrompt || "",
        youtubeTitles: first.youtubeTitles || [],
        youtubeDescription: first.youtubeDescription || "",
        hashtags: first.hashtags || [],
        conceptDescription: first.conceptDescription || "",
        visualDescription: first.visualDescription || "",
        videoDescription: first.videoDescription || "",
      };
    });
  };

  const handleDownloadSelected = () => {
    if (!selectedSong) return;

    downloadTextFile(
      `${makeSafeFilename(selectedSong.title)}.txt`,
      makeDownloadText(selectedSong)
    );
  };

  const handleDownloadAll = () => {
    if (!songs || songs.length === 0) return;

    downloadTextFile(
      `creaibox_music_songs_${songs.length}곡.txt`,
      makeAllDownloadText(songs)
    );
  };

  const handleLibrarySave = async () => {
    if (!selectedSong) return;

    if (isSelectedSaved) return;

    manualSaveInProgressRef.current = true;

    try {
      const success = await onSaveSong(selectedSong, selectedIndex + 1);

      if (!success) return;

      setSavedSongIndexes((prev) => {
        if (prev.includes(selectedIndex)) return prev;
        return [...prev, selectedIndex];
      });
    } finally {
      setTimeout(() => {
        manualSaveInProgressRef.current = false;
      }, 0);
    }
  };

  const hasSelectedSong = Boolean(selectedSong);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-zinc-800 bg-[#101014] p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-white">생성 결과</h3>
            <p className="mt-1 text-xs text-zinc-500">
              생성된 곡을 선택해서 확인하고 저장하세요.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleLibrarySave}
              disabled={isSaving || !hasSelectedSong || isSelectedSaved}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-black text-black hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Save size={14} />
              {isSelectedSaved ? "저장완료 ✓" : "라이브러리 저장"}
            </button>

            <button
              type="button"
              onClick={handleDownloadSelected}
              disabled={!hasSelectedSong}
              className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={14} />
              선택 곡 PC 다운로드
            </button>

            <button
              type="button"
              onClick={handleDownloadAll}
              disabled={!songs || songs.length === 0}
              className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={14} />
              곡 전체 다운로드
            </button>
          </div>
        </div>

        {songs.length > 0 && (
          <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
            {songs.map((song, index) => (
              <button
                key={`${song.title || "song"}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-black transition ${selectedIndex === index
                  ? "border-amber-400 bg-amber-400 text-black"
                  : "border-zinc-800 bg-black/40 text-zinc-400 hover:border-amber-400 hover:text-white"
                  }`}
              >
                {index + 1}번째 곡
              </button>
            ))}
          </div>
        )}

        {!selectedSong ? (
          <div className="rounded-2xl border border-dashed border-zinc-800 bg-black/30 p-6 text-sm leading-7 text-zinc-500">
            아직 생성된 결과가 없습니다. 중앙 레이어에서 생성 버튼을 눌러주세요.
          </div>
        ) : (
          <div className="space-y-5">
            <input
              value={selectedSong.title || ""}
              onChange={(e) => updateSelectedSong({ title: e.target.value })}
              placeholder="곡 제목"
              className="w-full rounded-2xl border border-zinc-800 bg-black/40 p-4 text-sm text-white outline-none focus:border-amber-400"
            />

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">
                곡의 소재 설명
              </label>
              <textarea
                value={selectedSong.conceptDescription || ""}
                onChange={(e) =>
                  updateSelectedSong({ conceptDescription: e.target.value })
                }
                placeholder="소재, 컨셉, 느낌, 분위기 설명"
                className="min-h-28 w-full rounded-2xl border border-zinc-800 bg-black/40 p-4 text-sm leading-7 text-white outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <div className="mb-2 flex justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Suno 프롬프트
                </label>
                <button
                  type="button"
                  onClick={() => onCopy(selectedSong.sunoPrompt || "")}
                  className="flex items-center gap-1 text-xs font-bold text-amber-400"
                >
                  <Copy size={13} /> 복사
                </button>
              </div>

              <textarea
                value={selectedSong.sunoPrompt || ""}
                onChange={(e) =>
                  updateSelectedSong({ sunoPrompt: e.target.value })
                }
                className="min-h-32 w-full rounded-2xl border border-zinc-800 bg-black/40 p-4 text-sm leading-7 text-white outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <div className="mb-2 flex justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  가사
                </label>
                <button
                  type="button"
                  onClick={() => onCopy(selectedSong.lyrics || "")}
                  className="flex items-center gap-1 text-xs font-bold text-amber-400"
                >
                  <Copy size={13} /> 복사
                </button>
              </div>

              <textarea
                value={selectedSong.lyrics || ""}
                onChange={(e) => updateSelectedSong({ lyrics: e.target.value })}
                className="min-h-[360px] w-full rounded-2xl border border-zinc-800 bg-black/40 p-4 text-sm leading-7 text-white outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <div className="mb-2 flex justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Visual Description / Image Prompt
                </label>
                <button
                  type="button"
                  onClick={() => onCopy(selectedSong.visualDescription || "")}
                  className="flex items-center gap-1 text-xs font-bold text-amber-400"
                >
                  <Copy size={13} /> 복사
                </button>
              </div>

              <textarea
                value={selectedSong.visualDescription || ""}
                onChange={(e) =>
                  updateSelectedSong({ visualDescription: e.target.value })
                }
                className="min-h-32 w-full rounded-2xl border border-zinc-800 bg-black/40 p-4 text-sm leading-7 text-white outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <div className="mb-2 flex justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Video Description / 영상 만들기 Prompt
                </label>
                <button
                  type="button"
                  onClick={() => onCopy(selectedSong.videoDescription || "")}
                  className="flex items-center gap-1 text-xs font-bold text-amber-400"
                >
                  <Copy size={13} /> 복사
                </button>
              </div>

              <textarea
                value={selectedSong.videoDescription || ""}
                onChange={(e) =>
                  updateSelectedSong({ videoDescription: e.target.value })
                }
                className="min-h-32 w-full rounded-2xl border border-zinc-800 bg-black/40 p-4 text-sm leading-7 text-white outline-none focus:border-amber-400"
              />
            </div>
          </div>
        )}
      </div>

      {selectedSong && (
        <div className="rounded-3xl border border-zinc-800 bg-[#101014] p-6">
          <h3 className="mb-4 text-lg font-black text-white">유튜브 최적화</h3>

          <div className="space-y-5">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
                제목 후보
              </p>

              <div className="space-y-2">
                {(selectedSong.youtubeTitles || []).map((item, index) => (
                  <button
                    key={`${item}-${index}`}
                    type="button"
                    onClick={() => onCopy(item)}
                    className="w-full rounded-xl border border-zinc-800 bg-black/30 p-3 text-left text-xs text-zinc-300 hover:border-amber-400"
                  >
                    {index + 1}. {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  설명문
                </p>
                <button
                  type="button"
                  onClick={() => onCopy(selectedSong.youtubeDescription || "")}
                  className="text-xs font-bold text-amber-400"
                >
                  복사
                </button>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-black/30 p-3 text-xs leading-6 text-zinc-300">
                {selectedSong.youtubeDescription || ""}
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  해시태그
                </p>
                <button
                  type="button"
                  onClick={() => onCopy((selectedSong.hashtags || []).join(" "))}
                  className="text-xs font-bold text-amber-400"
                >
                  복사
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {(selectedSong.hashtags || []).map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="rounded-full bg-zinc-900 px-3 py-2 text-xs text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}