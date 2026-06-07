"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Disc3,
  Edit3,
  Plus,
  Search,
  Trash2,
  X,
  Music,
  Sparkles,
  Library,
  Save,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type MusicAlbum = {
  id: string;
  created_at: string | null;
  updated_at: string | null;
  user_id: string;
  user_email: string | null;
  user_nicename: string | null;
  title: string;
  description: string | null;
  genre: string | null;
  mood: string | null;
  cover_image_url: string | null;
  status: string | null;
  is_favorite: boolean | null;
};

type MusicSong = {
  id: string;
  title: string | null;
  genre: string | null;
  mood: string | null;
  vocal: string | null;
  tempo: string | null;
  instrument: string | null;
  language: string | null;
  album_id: string | null;
  album_name: string | null;
};

function formatDisplayDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

export default function MusicAlbumsPage() {
  const supabase = useMemo(() => createClient(), []);

  const [albums, setAlbums] = useState<MusicAlbum[]>([]);
  const [songs, setSongs] = useState<MusicSong[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<MusicAlbum | null>(null);
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    genre: "",
    mood: "",
    coverImageUrl: "",
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const [albumsResult, songsResult] = await Promise.all([
      supabase.from("music_albums").select("*").order("created_at", { ascending: false }),
      supabase
        .from("music_lyrics_projects")
        .select("id,title,genre,mood,vocal,tempo,instrument,language,album_id,album_name")
        .order("created_at", { ascending: false }),
    ]);

    setIsLoading(false);

    if (albumsResult.error) {
      setErrorMessage(albumsResult.error.message);
      return;
    }

    if (songsResult.error) {
      setErrorMessage(songsResult.error.message);
      return;
    }

    setAlbums((albumsResult.data ?? []) as MusicAlbum[]);
    setSongs((songsResult.data ?? []) as MusicSong[]);
  }, [supabase]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const filteredAlbums = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return albums.filter((album) => {
      if (album.status === "trash") return false;
      if (!keyword) return true;

      return (
        album.title.toLowerCase().includes(keyword) ||
        (album.description || "").toLowerCase().includes(keyword) ||
        (album.genre || "").toLowerCase().includes(keyword) ||
        (album.mood || "").toLowerCase().includes(keyword)
      );
    });
  }, [albums, searchTerm]);

  const albumSongMap = useMemo(() => {
    const map = new Map<string, MusicSong[]>();

    songs.forEach((song) => {
      if (!song.album_id) return;
      const current = map.get(song.album_id) || [];
      current.push(song);
      map.set(song.album_id, current);
    });

    return map;
  }, [songs]);

  const resetCreateForm = () => {
    setForm({
      title: "",
      description: "",
      genre: "",
      mood: "",
      coverImageUrl: "",
    });
  };

  const handleCreateAlbum = async () => {
    if (!form.title.trim()) {
      window.alert("앨범 제목을 입력해주세요.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.alert("로그인 정보를 확인할 수 없습니다.");
      return;
    }

    const payload = {
      user_id: user.id,
      user_email: user.email,
      user_nicename:
        user.user_metadata?.name ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "Unknown",
      title: form.title.trim(),
      description: form.description.trim() || null,
      genre: form.genre.trim() || null,
      mood: form.mood.trim() || null,
      cover_image_url: form.coverImageUrl.trim() || null,
      status: "saved",
      is_favorite: false,
    };

    const { data, error } = await supabase
      .from("music_albums")
      .insert([payload])
      .select("*")
      .single();

    if (error) {
      window.alert(`앨범 생성 실패: ${error.message}`);
      return;
    }

    setAlbums((prev) => [data as MusicAlbum, ...prev]);
    setIsCreateOpen(false);
    resetCreateForm();
  };

  const handleMoveAlbumToTrash = async (album: MusicAlbum) => {
    if (!window.confirm("이 앨범을 삭제할까요? 곡은 삭제되지 않습니다.")) return;

    const { error } = await supabase
      .from("music_albums")
      .update({ status: "trash" })
      .eq("id", album.id);

    if (error) {
      window.alert(`앨범 삭제 실패: ${error.message}`);
      return;
    }

    setAlbums((prev) =>
      prev.map((item) => (item.id === album.id ? { ...item, status: "trash" } : item))
    );
  };

  const handleOpenAlbum = (album: MusicAlbum) => {
    setSelectedAlbum(album);
    setSelectedSongIds(songs.filter((song) => song.album_id === album.id).map((song) => song.id));
  };

  const handleToggleSong = (songId: string) => {
    setSelectedSongIds((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]
    );
  };

  const handleSaveAlbumSongs = async () => {
    if (!selectedAlbum) return;

    const previousSongIds = songs
      .filter((song) => song.album_id === selectedAlbum.id)
      .map((song) => song.id);

    const toAttach = selectedSongIds.filter((id) => !previousSongIds.includes(id));
    const toDetach = previousSongIds.filter((id) => !selectedSongIds.includes(id));

    if (toAttach.length > 0) {
      const { error } = await supabase
        .from("music_lyrics_projects")
        .update({
          album_id: selectedAlbum.id,
          album_name: selectedAlbum.title,
        })
        .in("id", toAttach);

      if (error) {
        window.alert(`곡 연결 실패: ${error.message}`);
        return;
      }
    }

    if (toDetach.length > 0) {
      const { error } = await supabase
        .from("music_lyrics_projects")
        .update({
          album_id: null,
          album_name: null,
        })
        .in("id", toDetach);

      if (error) {
        window.alert(`곡 연결 해제 실패: ${error.message}`);
        return;
      }
    }

    setSongs((prev) =>
      prev.map((song) => {
        if (toAttach.includes(song.id)) {
          return { ...song, album_id: selectedAlbum.id, album_name: selectedAlbum.title };
        }

        if (toDetach.includes(song.id)) {
          return { ...song, album_id: null, album_name: null };
        }

        return song;
      })
    );

    window.alert("앨범 곡 구성이 저장되었습니다.");
  };

  return (
    <div className="min-h-screen bg-[#050507] px-6 py-8 text-white">
      <div className="mx-auto max-w-[1500px] space-y-8">
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-950 via-[#120812] to-black p-8 shadow-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-fuchsia-300">
                <Disc3 size={15} />
                Album Collection
              </div>

              <h1 className="text-4xl font-black tracking-tight md:text-6xl">
                앨범 관리
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400">
                생성한 곡들을 앨범 단위로 묶고, 장르·감성·커버 이미지를 함께 관리합니다.
                곡 라이브러리가 많아질수록 앨범 단위 관리가 중요해집니다.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="앨범명, 장르, 감성 검색"
                  className="h-12 w-full min-w-[280px] rounded-2xl border border-white/10 bg-black/40 pl-11 pr-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-fuchsia-400"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-fuchsia-600 px-5 text-sm font-black text-white hover:bg-fuchsia-500"
              >
                <Plus size={17} />
                새 앨범 만들기
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <Library className="mb-4 text-fuchsia-300" />
            <div className="text-3xl font-black">{filteredAlbums.length}</div>
            <div className="mt-1 text-xs font-bold text-zinc-500">앨범 수</div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <Music className="mb-4 text-cyan-300" />
            <div className="text-3xl font-black">{songs.length}</div>
            <div className="mt-1 text-xs font-bold text-zinc-500">전체 곡</div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <Sparkles className="mb-4 text-amber-300" />
            <div className="text-3xl font-black">
              {songs.filter((song) => song.album_id).length}
            </div>
            <div className="mt-1 text-xs font-bold text-zinc-500">앨범 연결 곡</div>
          </div>
        </section>

        {errorMessage && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            <AlertCircle className="h-5 w-5" />
            {errorMessage}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-5 py-16 text-center text-zinc-500">
            앨범 정보를 불러오는 중입니다.
          </div>
        ) : filteredAlbums.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-5 py-16 text-center text-zinc-500">
            아직 생성된 앨범이 없습니다.
          </div>
        ) : (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredAlbums.map((album, index) => {
              const albumSongs = albumSongMap.get(album.id) || [];

              return (
                <article
                  key={album.id}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d12] shadow-xl transition hover:-translate-y-1 hover:border-fuchsia-400/40"
                >
                  <div className="relative h-60 overflow-hidden bg-gradient-to-br from-fuchsia-700 via-purple-900 to-black">
                    {album.cover_image_url ? (
                      <img
                        src={album.cover_image_url}
                        alt={album.title}
                        className="h-full w-full object-cover opacity-90 transition group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Disc3 className="h-24 w-24 text-white/20" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                    <div className="absolute bottom-5 left-5 right-5">
                      <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-fuchsia-200">
                        Album #{String(index + 1).padStart(2, "0")}
                      </div>
                      <h2 className="line-clamp-2 text-2xl font-black leading-tight">
                        {album.title}
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-5 p-5">
                    <p className="line-clamp-2 min-h-12 text-sm leading-6 text-zinc-400">
                      {album.description || "앨범 설명이 없습니다."}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-fuchsia-400/10 px-3 py-1 text-xs font-bold text-fuchsia-200">
                        {album.genre || "Genre"}
                      </span>
                      <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-200">
                        {album.mood || "Mood"}
                      </span>
                      <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-200">
                        {albumSongs.length}곡
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs text-zinc-500">
                      <span>{formatDisplayDate(album.created_at)}</span>
                      <span>{album.user_nicename || "Creator"}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenAlbum(album)}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white text-sm font-black text-black hover:bg-zinc-200"
                      >
                        <Edit3 size={15} />
                        곡 구성
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMoveAlbumToTrash(album)}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/30 text-sm font-bold text-zinc-300 hover:border-red-400 hover:text-red-300"
                      >
                        <Trash2 size={15} />
                        삭제
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 py-8 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#101014] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <h2 className="text-2xl font-black">새 앨범 만들기</h2>

              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-xl border border-white/10 bg-black/30 p-2 text-zinc-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 px-6 py-6">
              <input
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="앨범 제목"
                className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-white outline-none focus:border-fuchsia-400"
              />

              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, description: event.target.value }))
                }
                placeholder="앨범 설명"
                className="min-h-32 w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-white outline-none focus:border-fuchsia-400"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  value={form.genre}
                  onChange={(event) => setForm((prev) => ({ ...prev, genre: event.target.value }))}
                  placeholder="대표 장르"
                  className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-white outline-none focus:border-fuchsia-400"
                />

                <input
                  value={form.mood}
                  onChange={(event) => setForm((prev) => ({ ...prev, mood: event.target.value }))}
                  placeholder="대표 감성"
                  className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-white outline-none focus:border-fuchsia-400"
                />
              </div>

              <input
                value={form.coverImageUrl}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, coverImageUrl: event.target.value }))
                }
                placeholder="커버 이미지 URL"
                className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-white outline-none focus:border-fuchsia-400"
              />

              {form.coverImageUrl.trim() && (
                <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
                  <img
                    src={form.coverImageUrl}
                    alt="앨범 커버 미리보기"
                    className="h-56 w-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-white/10 px-6 py-5">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-xl border border-white/10 px-5 py-3 font-bold text-zinc-300 hover:text-white"
              >
                취소
              </button>

              <button
                type="button"
                onClick={() => void handleCreateAlbum()}
                className="rounded-xl bg-fuchsia-600 px-5 py-3 font-black text-white hover:bg-fuchsia-500"
              >
                앨범 생성
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedAlbum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 py-8 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#101014] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <h2 className="text-2xl font-black">{selectedAlbum.title}</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  앨범에 포함할 곡을 선택하세요.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAlbum(null)}
                className="rounded-xl border border-white/10 bg-black/30 p-2 text-zinc-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[calc(90vh-155px)] overflow-y-auto px-6 py-5">
              <div className="grid grid-cols-1 gap-3">
                {songs.map((song) => {
                  const checked = selectedSongIds.includes(song.id);

                  return (
                    <label
                      key={song.id}
                      className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition ${checked
                        ? "border-fuchsia-400 bg-fuchsia-400/10"
                        : "border-white/10 bg-black/30 hover:border-fuchsia-400/50"
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleToggleSong(song.id)}
                          className="h-4 w-4"
                        />

                        <div>
                          <div className="font-black text-white">
                            {song.title || "제목 없음"}
                          </div>
                          <div className="mt-1 text-xs text-zinc-500">
                            {song.genre || "-"} · {song.mood || "-"} ·{" "}
                            {song.vocal || "-"} · {song.tempo || "-"}
                          </div>
                        </div>
                      </div>

                      <Music className="h-4 w-4 text-zinc-500" />
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-white/10 px-6 py-5">
              <button
                type="button"
                onClick={() => setSelectedAlbum(null)}
                className="rounded-xl border border-white/10 px-5 py-3 font-bold text-zinc-300 hover:text-white"
              >
                닫기
              </button>

              <button
                type="button"
                onClick={() => void handleSaveAlbumSongs()}
                className="inline-flex items-center gap-2 rounded-xl bg-fuchsia-600 px-5 py-3 font-black text-white hover:bg-fuchsia-500"
              >
                <Save size={16} />
                곡 구성 저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}