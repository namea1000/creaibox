"use client";

import { useEffect, useRef, useState } from "react";
import {
  X,
  StickyNote,
  Save,
  Plus,
  Search,
  Trash2,
  Star,
  StarOff,
  MoveHorizontal,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type Note = {
  id: string;
  user_id: string;
  folder_id: string | null;
  title: string;
  content: string | null;
  excerpt: string | null;
  is_favorite: boolean;
  is_pinned: boolean;
  is_archived: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
};

type Folder = {
  id: string;
  user_id: string;
  name: string;
};

export default function CreNoteWidget() {
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [folderId, setFolderId] = useState<string | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const [panelWidth, setPanelWidth] = useState(560);
  const [minimized, setMinimized] = useState(false);
  const resizingRef = useRef(false);

  const saveTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!resizingRef.current) return;

      const nextWidth = window.innerWidth - e.clientX;
      const clampedWidth = Math.min(Math.max(nextWidth, 420), 900);

      setPanelWidth(clampedWidth);
    }

    async function handleMouseUp() {
      if (!resizingRef.current) return;

      resizingRef.current = false;

      if (!userId) return;

      await supabase
        .from("studio_widgets")
        .update({
          position: {
            side: "right",
            width: panelWidth,
            minimized,
          },
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("widget_type", "cre_note");
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [userId, panelWidth, minimized]);

  async function init() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setUserId(user.id);

    await ensureWidgetSetting(user.id);

    const folder = await ensureDefaultFolder(user.id);
    if (!folder) return;

    const loadedFolders = await loadFolders(user.id);
    setFolders(loadedFolders.length > 0 ? loadedFolders : [folder]);

    setActiveFolderId(folder.id);
    setFolderId(folder.id);

    const loadedNotes = await loadNotes(user.id);

    if (loadedNotes.length > 0) {
      selectNote(loadedNotes[0]);
    } else {
      const firstNote = await createNote(user.id, folder.id);
      if (firstNote) {
        setNotes([firstNote]);
        selectNote(firstNote);
      }
    }
  }

  async function ensureWidgetSetting(uid: string) {
    const { data } = await supabase
      .from("studio_widgets")
      .select("id,is_open")
      .eq("user_id", uid)
      .eq("widget_type", "cre_note")
      .maybeSingle();

    if (data) {
      setOpen(data.is_open ?? false);
      return;
    }

    await supabase.from("studio_widgets").insert({
      user_id: uid,
      widget_type: "cre_note",
      title: "Cre Note",
      content: "",
      is_open: false,
      metadata: {},
      position: { side: "right", width: 520 },
    });
  }

  async function ensureDefaultFolder(uid: string): Promise<Folder | null> {
    const { data } = await supabase
      .from("cre_note_folders")
      .select("id,user_id,name")
      .eq("user_id", uid)
      .eq("name", "기본")
      .maybeSingle();

    if (data) return data;

    const { data: created, error } = await supabase
      .from("cre_note_folders")
      .insert({
        user_id: uid,
        name: "기본",
        color: "#10b981",
        icon: "folder",
        sort_order: 0,
      })
      .select("id,user_id,name")
      .single();

    if (error) {
      console.error(error);
      return null;
    }

    return created;
  }

  async function loadFolders(uid: string) {
    const { data, error } = await supabase
      .from("cre_note_folders")
      .select("id,user_id,name")
      .eq("user_id", uid)
      .eq("is_archived", false)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      return [];
    }

    return (data ?? []) as Folder[];
  }
  async function loadNotes(uid: string) {
    const { data, error } = await supabase
      .from("cre_notes")
      .select("*")
      .eq("user_id", uid)
      .eq("is_deleted", false)
      .eq("is_archived", false)
      .order("is_pinned", { ascending: false })
      .order("is_favorite", { ascending: false })
      .order("updated_at", { ascending: false });

    if (error) {
      console.error(error);
      return [];
    }

    const result = (data ?? []) as Note[];
    setNotes(result);
    return result;
  }

  async function createNote(uid?: string, fid?: string | null) {
    const targetUserId = uid ?? userId;
    const targetFolderId = fid ?? folderId;

    if (!targetUserId) return null;

    const { data, error } = await supabase
      .from("cre_notes")
      .insert({
        user_id: targetUserId,
        folder_id: targetFolderId,
        title: "제목 없음",
        content: "",
        excerpt: "",
        note_type: "text",
        source_app: "studio",
        is_favorite: false,
        is_pinned: false,
        is_archived: false,
        is_deleted: false,
        metadata: {},
      })
      .select("*")
      .single();

    if (error) {
      console.error(error);
      return null;
    }

    const newNote = data as Note;
    setNotes((prev) => [newNote, ...prev]);
    selectNote(newNote);
    return newNote;
  }

  function selectNote(note: Note) {
    setActiveNote(note);
    setTitle(note.title ?? "제목 없음");
    setContent(note.content ?? "");
  }

  function handleTitleChange(value: string) {
    setTitle(value);
    queueSave(value, content);
  }

  function handleContentChange(value: string) {
    setContent(value);
    queueSave(title, value);
  }

  function queueSave(nextTitle: string, nextContent: string) {
    if (!activeNote) return;

    if (saveTimer.current) clearTimeout(saveTimer.current);

    saveTimer.current = setTimeout(() => {
      saveNote(nextTitle, nextContent);
    }, 700);
  }

  async function saveNote(nextTitle: string, nextContent: string) {
    if (!activeNote) return;

    setSaving(true);

    const safeTitle = nextTitle.trim() || "제목 없음";
    const excerpt = nextContent.replace(/\s+/g, " ").trim().slice(0, 80);

    const { data, error } = await supabase
      .from("cre_notes")
      .update({
        title: safeTitle,
        content: nextContent,
        excerpt,
        updated_at: new Date().toISOString(),
      })
      .eq("id", activeNote.id)
      .select("*")
      .single();

    if (!error && data) {
      const updated = data as Note;

      setActiveNote(updated);
      setNotes((prev) =>
        prev
          .map((note) => (note.id === updated.id ? updated : note))
          .sort(
            (a, b) =>
              Number(b.is_pinned) - Number(a.is_pinned) ||
              Number(b.is_favorite) - Number(a.is_favorite) ||
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
          )
      );
    }

    setSaving(false);
  }

  async function toggleFavorite(note: Note) {
    const { data, error } = await supabase
      .from("cre_notes")
      .update({
        is_favorite: !note.is_favorite,
        updated_at: new Date().toISOString(),
      })
      .eq("id", note.id)
      .select("*")
      .single();

    if (error || !data) return;

    const updated = data as Note;

    setNotes((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );

    if (activeNote?.id === updated.id) {
      selectNote(updated);
    }
  }

  async function deleteNote(note: Note) {
    const ok = confirm("이 노트를 삭제할까요?");
    if (!ok) return;

    await supabase
      .from("cre_notes")
      .update({
        is_deleted: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", note.id);

    const nextNotes = notes.filter((item) => item.id !== note.id);
    setNotes(nextNotes);

    if (activeNote?.id === note.id) {
      if (nextNotes.length > 0) {
        selectNote(nextNotes[0]);
      } else if (userId) {
        const newNote = await createNote(userId, folderId);
        if (newNote) selectNote(newNote);
      }
    }
  }

  async function closeWidget() {
    setOpen(false);

    if (!userId) return;

    await supabase
      .from("studio_widgets")
      .update({ is_open: false })
      .eq("user_id", userId)
      .eq("widget_type", "cre_note");
  }

  async function openWidget() {
    setOpen(true);

    if (!userId) return;

    await supabase
      .from("studio_widgets")
      .update({ is_open: true })
      .eq("user_id", userId)
      .eq("widget_type", "cre_note");
  }

  useEffect(() => {
    const handler = () => openWidget();
    window.addEventListener("open-cre-note", handler);
    return () => window.removeEventListener("open-cre-note", handler);
  }, [userId]);

  const filteredNotes = notes.filter((note) => {
    if (activeFolderId && note.folder_id !== activeFolderId) return false;

    const keyword = search.trim().toLowerCase();
    if (!keyword) return true;

    return (
      note.title?.toLowerCase().includes(keyword) ||
      note.content?.toLowerCase().includes(keyword) ||
      note.excerpt?.toLowerCase().includes(keyword)
    );
  });

  if (!open) return null;

  return (
    <aside
      style={{ width: minimized ? 72 : panelWidth }}
      className="fixed right-0 top-0 z-[9999] h-screen border-l border-white/10 bg-[#080d10] shadow-2xl"
    >
      {!minimized && (
        <div
          onMouseDown={() => {
            resizingRef.current = true;
          }}
          className="group absolute left-0 top-0 h-full w-4 cursor-col-resize"
        >
          <div className="absolute left-1/2 top-20 -translate-x-1/2 opacity-0 transition group-hover:opacity-100">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-500/30 bg-[#0b1117] shadow-lg">
              <MoveHorizontal size={14} className="text-emerald-400" />
            </div>
          </div>

          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/10 transition group-hover:w-[2px] group-hover:bg-emerald-500/70" />
        </div>
      )}
      <div className="flex h-14 items-center justify-between border-b border-white/10 px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
            <StickyNote size={18} />
          </div>

          <div>
            <div className="text-sm font-bold text-white">Cre Note</div>
            <div className="text-xs text-zinc-500">Global Quick Note</div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={async () => {
              const next = !minimized;
              setMinimized(next);

              if (userId) {
                await supabase
                  .from("studio_widgets")
                  .update({
                    position: {
                      side: "right",
                      width: panelWidth,
                      minimized: next,
                    },
                    updated_at: new Date().toISOString(),
                  })
                  .eq("user_id", userId)
                  .eq("widget_type", "cre_note");
              }
            }}
            className="rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
            title="최소화"
          >
            －
          </button>

          <button
            onClick={closeWidget}
            className="rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {minimized ? (
        <div className="flex h-[calc(100vh-56px)] flex-col items-center pt-4">
          <button
            onClick={async () => {
              setMinimized(false);

              if (userId) {
                await supabase
                  .from("studio_widgets")
                  .update({
                    position: {
                      side: "right",
                      width: panelWidth,
                      minimized: false,
                    },
                    updated_at: new Date().toISOString(),
                  })
                  .eq("user_id", userId)
                  .eq("widget_type", "cre_note");
              }
            }}
            className="rounded-xl bg-emerald-500/15 p-3 text-emerald-400 hover:bg-emerald-500/25"
            title="Cre Note 펼치기"
          >
            <StickyNote size={22} />
          </button>
        </div>
      ) : (
        <div className="grid h-[calc(100vh-56px)] grid-cols-[190px_1fr]">
          <section className="border-r border-white/10 bg-black/20">
            <div className="space-y-2 border-b border-white/10 p-3">
              <button
                onClick={() => createNote()}
                className="flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-500"
              >
                <Plus size={16} />
                새 노트
              </button>

              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="노트 검색"
                  className="h-9 w-full rounded-xl border border-white/10 bg-black/40 pl-9 pr-3 text-xs text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-emerald-500/50"
                />
              </div>
            </div>

            <div className="mt-3 space-y-1">
              <button
                onClick={async () => {
                  if (!userId) return;

                  const name = prompt("새 폴더 이름을 입력하세요.");
                  if (!name?.trim()) return;

                  const { data, error } = await supabase
                    .from("cre_note_folders")
                    .insert({
                      user_id: userId,
                      name: name.trim(),
                      color: "#10b981",
                      icon: "folder",
                      sort_order: folders.length,
                      is_archived: false,
                    })
                    .select("id,user_id,name")
                    .single();

                  if (error || !data) return;

                  const newFolder = data as Folder;

                  setFolders((prev) => [...prev, newFolder]);
                  setActiveFolderId(newFolder.id);
                  setFolderId(newFolder.id);
                }}
                className="w-full rounded-md bg-white/5 px-3 py-1 text-[11px] text-zinc-400 hover:bg-emerald-500/15 hover:text-emerald-400"
              >
                + 폴더
              </button>
              {folders.map((folder) => {
                const active = activeFolderId === folder.id;

                return (
                  <button
                    key={folder.id}
                    onClick={() => {
                      setActiveFolderId(folder.id);
                      setFolderId(folder.id);
                    }}
                    className={`w-full rounded-md border px-3 py-2 text-left text-xs transition ${active
                        ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                        : "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                      }`}
                  >
                    📁 {folder.name}
                  </button>
                );
              })}
            </div>

            <div className="h-[calc(100vh-156px)] overflow-y-auto p-2">
              {filteredNotes.map((note) => {
                const active = activeNote?.id === note.id;

                return (
                  <button
                    key={note.id}
                    onClick={() => selectNote(note)}
                    className={`group mb-1 w-full rounded-xl p-3 text-left transition ${active
                      ? "bg-emerald-500/15 text-white"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-semibold">
                          {note.title || "제목 없음"}
                        </div>
                        <div className="mt-1 line-clamp-2 text-[11px] leading-4 text-zinc-500">
                          {note.excerpt || "내용 없음"}
                        </div>
                      </div>

                      {note.is_favorite && (
                        <Star
                          size={12}
                          className="shrink-0 fill-yellow-400 text-yellow-400"
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="flex min-w-0 flex-col">
            {activeNote ? (
              <>
                <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                  <input
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="제목 없음"
                    className="min-w-0 flex-1 bg-transparent text-lg font-bold text-white outline-none placeholder:text-zinc-600"
                  />

                  <button
                    onClick={() => toggleFavorite(activeNote)}
                    className="rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-yellow-400"
                    title="즐겨찾기"
                  >
                    {activeNote.is_favorite ? (
                      <Star size={17} className="fill-yellow-400 text-yellow-400" />
                    ) : (
                      <StarOff size={17} />
                    )}
                  </button>

                  <button
                    onClick={() => deleteNote(activeNote)}
                    className="rounded-lg p-2 text-zinc-400 hover:bg-red-500/10 hover:text-red-400"
                    title="삭제"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>

                <textarea
                  value={content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="작업하면서 떠오른 아이디어, 할 일, 임시 문장을 적어두세요..."
                  className="min-h-0 flex-1 resize-none bg-transparent p-4 text-sm leading-7 text-zinc-200 outline-none placeholder:text-zinc-600"
                />

                <div className="flex h-11 items-center justify-between border-t border-white/10 px-4 text-xs text-zinc-500">
                  <span>{content.length.toLocaleString()}자</span>

                  <div className="flex items-center gap-1">
                    <Save size={13} />
                    <span>{saving ? "저장 중..." : "자동 저장됨"}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                노트를 선택하세요.
              </div>
            )}
          </section>
        </div>
      )}
    </aside>
  );
}