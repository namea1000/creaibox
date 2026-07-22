"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  StickyNote,
  Save,
  Plus,
  Search,
  Trash2,
  Star,
  StarOff,
  MoveHorizontal,
  Pin,
  PinOff,
  ChevronDown,
  ChevronRight,
  Folder as FolderIcon,
  Pencil,
  RotateCcw,
  Maximize2,
  Minimize2,
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

type ViewMode = "folder" | "favorite" | "pinned" | "trash";

export default function CreNoteWidget() {
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [folderId, setFolderId] = useState<string | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [expandedFolderIds, setExpandedFolderIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("folder");
  const [openSpecialSection, setOpenSpecialSection] = useState<
    "favorite" | "pinned" | "trash" | null
  >(null);

  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const [panelWidth, setPanelWidth] = useState(560);
  const [minimized, setMinimized] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const resizingRef = useRef(false);
  const saveTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isMac = navigator.platform.toLowerCase().includes("mac");
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      if (!open) return;
      if (!modKey) return;

      if (e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (activeNote) {
          saveNote(title, content);
        }
      }

      if (e.key.toLowerCase() === "f") {
        e.preventDefault();

        const input = document.getElementById(
          "cre-note-search"
        ) as HTMLInputElement | null;

        input?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, activeNote, title, content, userId, folderId]);

  // Escape key event listener to close full screen or Cre Note widget
  useEffect(() => {
    const handleEscapeClose = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        if (isFullScreen) {
          setIsFullScreen(false);
        } else {
          closeWidget();
        }
      }
    };
    window.addEventListener("keydown", handleEscapeClose);
    return () => {
      window.removeEventListener("keydown", handleEscapeClose);
    };
  }, [open, isFullScreen]);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!resizingRef.current) return;
      e.preventDefault();
      const nextWidth = window.innerWidth - e.clientX;
      const clampedWidth = Math.min(Math.max(nextWidth, 420), 900);
      setPanelWidth(clampedWidth);
    }

    async function handleMouseUp() {
      if (!resizingRef.current) return;
      resizingRef.current = false;
      setIsResizing(false);

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
  }, [userId, panelWidth, minimized, supabase]);

  useEffect(() => {
    if (!isResizing) return;

    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    return () => {
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
    };
  }, [isResizing]);

  useEffect(() => {
    const handler = () => openWidget();
    window.addEventListener("open-cre-note", handler);
    return () => window.removeEventListener("open-cre-note", handler);
  }, [userId, supabase]);

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
    const nextFolders = loadedFolders.length > 0 ? loadedFolders : [folder];

    setFolders(nextFolders);
    setActiveFolderId(folder.id);
    setFolderId(folder.id);
    setExpandedFolderIds([folder.id]);

    const loadedNotes = await loadNotes(user.id);
    const firstVisibleNote = loadedNotes.find(
      (note) => !note.is_deleted && !note.is_archived
    );

    if (firstVisibleNote) {
      selectNote(firstVisibleNote);
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
      .select("id,is_open,position")
      .eq("user_id", uid)
      .eq("widget_type", "cre_note")
      .maybeSingle();

    if (data) {
      setOpen(data.is_open ?? false);

      const position = data.position as
        | { width?: number; minimized?: boolean }
        | null
        | undefined;

      if (position?.width) setPanelWidth(position.width);
      if (typeof position?.minimized === "boolean") {
        setMinimized(position.minimized);
      }

      return;
    }

    await supabase.from("studio_widgets").insert({
      user_id: uid,
      widget_type: "cre_note",
      title: "Cre Note",
      content: "",
      is_open: false,
      metadata: {},
      position: { side: "right", width: 560, minimized: false },
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
        is_archived: false,
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
    const targetFolderId = fid ?? activeFolderId ?? folderId ?? folders[0]?.id ?? null;

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

    setViewMode("folder");
    setActiveFolderId(targetFolderId);
    setFolderId(targetFolderId);
    if (targetFolderId) expandFolder(targetFolderId);

    setNotes((prev) => [newNote, ...prev]);
    selectNote(newNote);

    return newNote;
  }

  async function createFolder() {
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
    setViewMode("folder");
    setActiveFolderId(newFolder.id);
    setFolderId(newFolder.id);
    expandFolder(newFolder.id);
  }

  async function renameFolder(folder: Folder) {
    const nextName = prompt("폴더 이름을 수정하세요.", folder.name);
    if (!nextName?.trim()) return;

    const { data, error } = await supabase
      .from("cre_note_folders")
      .update({
        name: nextName.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", folder.id)
      .select("id,user_id,name")
      .single();

    if (error || !data) return;

    const updated = data as Folder;

    setFolders((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  }

  async function deleteFolder(folder: Folder) {
    const fallbackFolder = folders.find((item) => item.id !== folder.id);

    if (!fallbackFolder) {
      alert("마지막 폴더는 삭제할 수 없습니다.");
      return;
    }

    const ok = confirm(
      `"${folder.name}" 폴더를 삭제할까요?\n폴더 안의 노트는 "${fallbackFolder.name}" 폴더로 이동됩니다.`
    );

    if (!ok) return;

    const noteIds = notes
      .filter((note) => note.folder_id === folder.id)
      .map((note) => note.id);

    if (noteIds.length > 0) {
      await supabase
        .from("cre_notes")
        .update({
          folder_id: fallbackFolder.id,
          updated_at: new Date().toISOString(),
        })
        .in("id", noteIds);
    }

    const { error } = await supabase
      .from("cre_note_folders")
      .update({
        is_archived: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", folder.id);

    if (error) return;

    setFolders((prev) => prev.filter((item) => item.id !== folder.id));
    setNotes((prev) =>
      prev.map((note) =>
        note.folder_id === folder.id
          ? { ...note, folder_id: fallbackFolder.id }
          : note
      )
    );

    setActiveFolderId(fallbackFolder.id);
    setFolderId(fallbackFolder.id);
    expandFolder(fallbackFolder.id);
  }

  function selectNote(note: Note) {
    setActiveNote(note);
    setTitle(note.title ?? "제목 없음");
    setContent(note.content ?? "");
  }

  function expandFolder(targetFolderId: string) {
    setExpandedFolderIds((prev) =>
      prev.includes(targetFolderId) ? prev : [...prev, targetFolderId]
    );
  }

  function toggleFolder(folder: Folder) {
    setViewMode("folder");
    setActiveFolderId(folder.id);
    setFolderId(folder.id);

    setExpandedFolderIds((prev) =>
      prev.includes(folder.id)
        ? prev.filter((id) => id !== folder.id)
        : [...prev, folder.id]
    );
  }

  function handleTitleChange(value: string) {
    setTitle(value);
    queueSave(value, content);
  }

  function handleContentChange(value: string) {
    setContent(value);
    queueSave(title, value);
  }

  function insertCheckbox() {
    const textarea = document.getElementById(
      "cre-note-editor"
    ) as HTMLTextAreaElement | null;

    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const before = content.slice(0, start);
    const selected = content.slice(start, end);
    const after = content.slice(end);

    const checkboxText = selected ? `⬜ ${selected}` : "⬜ ";
    const nextContent = before + checkboxText + after;

    setContent(nextContent);
    queueSave(title, nextContent);

    setTimeout(() => {
      textarea.focus();
      const cursor = start + checkboxText.length;
      textarea.setSelectionRange(cursor, cursor);
    }, 0);
  }

  function toggleCheckboxOnCurrentLine() {
    const textarea = document.getElementById(
      "cre-note-editor"
    ) as HTMLTextAreaElement | null;

    if (!textarea) return;

    const cursor = textarea.selectionStart;

    const lineStart = content.lastIndexOf("\n", cursor - 1) + 1;
    const lineEndIndex = content.indexOf("\n", cursor);
    const lineEnd = lineEndIndex === -1 ? content.length : lineEndIndex;

    const line = content.slice(lineStart, lineEnd);

    let nextLine = line;

    if (line.includes("⬜")) {
      nextLine = line.replace("⬜", "✅");
    } else if (line.includes("✅")) {
      nextLine = line.replace("✅", "⬜");
    } else {
      return;
    }

    const nextContent =
      content.slice(0, lineStart) +
      nextLine +
      content.slice(lineEnd);

    setContent(nextContent);
    queueSave(title, nextContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(cursor, cursor);
    }, 0);
  }

  function handleEditorKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Enter") return;

    const textarea = e.currentTarget;
    const cursor = textarea.selectionStart;

    const lineStart = content.lastIndexOf("\n", cursor - 1) + 1;
    const lineEndIndex = content.indexOf("\n", cursor);
    const lineEnd = lineEndIndex === -1 ? content.length : lineEndIndex;
    const currentLine = content.slice(lineStart, lineEnd);

    const trimmedLine = currentLine.trimStart();

    const shouldContinueCheckbox =
      trimmedLine.startsWith("⬜") || trimmedLine.startsWith("✅");

    if (!shouldContinueCheckbox) return;

    e.preventDefault();

    const before = content.slice(0, cursor);
    const after = content.slice(cursor);

    const nextInsert = "\n⬜ ";
    const nextContent = before + nextInsert + after;

    setContent(nextContent);
    queueSave(title, nextContent);

    setTimeout(() => {
      textarea.focus();
      const nextCursor = cursor + nextInsert.length;
      textarea.setSelectionRange(nextCursor, nextCursor);
    }, 0);
  }

  function moveCompletedTodosToBottom() {
    const lines = content.split("\n");

    const activeLines: string[] = [];
    const doneLines: string[] = [];
    const otherLines: string[] = [];

    lines.forEach((line) => {
      const trimmed = line.trimStart();

      if (trimmed === "완료한 일") {
        return;
      }

      if (trimmed.startsWith("✅")) {
        doneLines.push(line);
      } else if (trimmed.startsWith("⬜")) {
        activeLines.push(line);
      } else {
        otherLines.push(line);
      }
    });

    const nextLines = [
      ...otherLines,
      ...(otherLines.length && activeLines.length ? [""] : []),
      ...activeLines,
      ...(doneLines.length ? ["", "완료한 일", ...doneLines] : []),
    ];

    const nextContent = nextLines.join("\n");

    setContent(nextContent);
    queueSave(title, nextContent);
  }

  function insertDate() {
    const textarea = document.getElementById(
      "cre-note-editor"
    ) as HTMLTextAreaElement | null;

    if (!textarea) return;

    const now = new Date();

    const dateText =
      now.getFullYear() +
      "-" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(now.getDate()).padStart(2, "0");

    const start = textarea.selectionStart;

    const nextContent =
      content.slice(0, start) +
      dateText +
      content.slice(start);

    setContent(nextContent);
    queueSave(title, nextContent);
  }

  function insertDivider() {
    const textarea = document.getElementById(
      "cre-note-editor"
    ) as HTMLTextAreaElement | null;

    if (!textarea) return;

    const start = textarea.selectionStart;

    const divider =
      "\n────────────────────\n";

    const nextContent =
      content.slice(0, start) +
      divider +
      content.slice(start);

    setContent(nextContent);
    queueSave(title, nextContent);
  }

  function insertNumberList() {
    const textarea = document.getElementById(
      "cre-note-editor"
    ) as HTMLTextAreaElement | null;

    if (!textarea) return;

    const start = textarea.selectionStart;

    const nextContent =
      content.slice(0, start) +
      "\n1. " +
      content.slice(start);

    setContent(nextContent);
    queueSave(title, nextContent);
  }

  function insertBullet() {
    const textarea = document.getElementById(
      "cre-note-editor"
    ) as HTMLTextAreaElement | null;

    if (!textarea) return;

    const start = textarea.selectionStart;

    const nextContent =
      content.slice(0, start) +
      "\n• " +
      content.slice(start);

    setContent(nextContent);
    queueSave(title, nextContent);
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
          .sort(sortNotes)
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
      prev.map((item) => (item.id === updated.id ? updated : item)).sort(sortNotes)
    );

    if (activeNote?.id === updated.id) selectNote(updated);
  }

  async function togglePinned(note: Note) {
    const { data, error } = await supabase
      .from("cre_notes")
      .update({
        is_pinned: !note.is_pinned,
        updated_at: new Date().toISOString(),
      })
      .eq("id", note.id)
      .select("*")
      .single();

    if (error || !data) return;

    const updated = data as Note;

    setNotes((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item)).sort(sortNotes)
    );

    if (activeNote?.id === updated.id) selectNote(updated);
  }

  async function moveNoteToFolder(note: Note, targetFolderId: string | null) {
    const { data, error } = await supabase
      .from("cre_notes")
      .update({
        folder_id: targetFolderId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", note.id)
      .select("*")
      .single();

    if (error || !data) return;

    const moved = data as Note;

    setNotes((prev) =>
      prev.map((item) => (item.id === moved.id ? moved : item)).sort(sortNotes)
    );

    setActiveFolderId(targetFolderId);
    setFolderId(targetFolderId);
    setViewMode("folder");
    if (targetFolderId) expandFolder(targetFolderId);

    if (activeNote?.id === moved.id) selectNote(moved);
  }

  async function deleteNote(note: Note) {
    const ok = confirm("이 노트를 휴지통으로 이동할까요?");
    if (!ok) return;

    const { data, error } = await supabase
      .from("cre_notes")
      .update({
        is_deleted: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", note.id)
      .select("*")
      .single();

    if (error || !data) return;

    const deleted = data as Note;

    setNotes((prev) =>
      prev.map((item) => (item.id === deleted.id ? deleted : item))
    );

    const nextVisibleNote = notes.find(
      (item) =>
        item.id !== note.id &&
        !item.is_deleted &&
        !item.is_archived &&
        (viewMode !== "folder" ||
          !activeFolderId ||
          item.folder_id === activeFolderId)
    );

    if (nextVisibleNote) {
      selectNote(nextVisibleNote);
    } else {
      setActiveNote(null);
      setTitle("");
      setContent("");
    }
  }

  async function restoreNote(note: Note) {
    const { data, error } = await supabase
      .from("cre_notes")
      .update({
        is_deleted: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", note.id)
      .select("*")
      .single();

    if (error || !data) return;

    const restored = data as Note;

    setNotes((prev) =>
      prev.map((item) => (item.id === restored.id ? restored : item))
    );

    selectNote(restored);
    setViewMode("folder");
    setActiveFolderId(restored.folder_id);
    setFolderId(restored.folder_id);
    if (restored.folder_id) expandFolder(restored.folder_id);
  }

  async function permanentlyDeleteNote(note: Note) {
    const ok = confirm("이 노트를 완전히 삭제할까요?\n복구할 수 없습니다.");
    if (!ok) return;

    const { error } = await supabase.from("cre_notes").delete().eq("id", note.id);
    if (error) return;

    const nextNotes = notes.filter((item) => item.id !== note.id);
    setNotes(nextNotes);

    const nextVisibleNote = nextNotes.find((item) => item.is_deleted);
    if (nextVisibleNote && viewMode === "trash") {
      selectNote(nextVisibleNote);
    } else {
      setActiveNote(null);
      setTitle("");
      setContent("");
    }
  }

  async function emptyTrash() {
    const trashedNotes = notes.filter((note) => note.is_deleted);
    if (trashedNotes.length === 0) return;

    const ok = confirm(`휴지통의 노트 ${trashedNotes.length}개를 모두 완전히 삭제할까요?`);
    if (!ok) return;

    const ids = trashedNotes.map((note) => note.id);

    const { error } = await supabase.from("cre_notes").delete().in("id", ids);
    if (error) return;

    setNotes((prev) => prev.filter((note) => !ids.includes(note.id)));
    setActiveNote(null);
    setTitle("");
    setContent("");
  }

  async function closeWidget() {
    setOpen(false);

    if (!userId) return;

    await supabase
      .from("studio_widgets")
      .update({ is_open: false, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("widget_type", "cre_note");
  }

  async function openWidget() {
    setOpen(true);

    if (!userId) return;

    await supabase
      .from("studio_widgets")
      .update({ is_open: true, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("widget_type", "cre_note");
  }

  function sortNotes(a: Note, b: Note) {
    return (
      Number(b.is_pinned) - Number(a.is_pinned) ||
      Number(b.is_favorite) - Number(a.is_favorite) ||
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  }

  const keyword = search.trim().toLowerCase();

  const visibleFolders = useMemo(() => folders, [folders]);

  const notesByFolder = useMemo(() => {
    const map = new Map<string, Note[]>();

    visibleFolders.forEach((folder) => {
      map.set(folder.id, []);
    });

    notes
      .filter((note) => !note.is_deleted && !note.is_archived)
      .filter((note) => {
        if (!keyword) return true;

        return (
          note.title?.toLowerCase().includes(keyword) ||
          note.content?.toLowerCase().includes(keyword) ||
          note.excerpt?.toLowerCase().includes(keyword)
        );
      })
      .sort(sortNotes)
      .forEach((note) => {
        const key = note.folder_id ?? visibleFolders[0]?.id ?? "none";
        const list = map.get(key) ?? [];
        list.push(note);
        map.set(key, list);
      });

    return map;
  }, [notes, visibleFolders, keyword]);

  const specialNotes = useMemo(() => {
    if (!openSpecialSection) return [];

    return notes
      .filter((note) => {
        if (openSpecialSection === "trash") return note.is_deleted;
        if (note.is_deleted || note.is_archived) return false;
        if (openSpecialSection === "favorite") return note.is_favorite;
        if (openSpecialSection === "pinned") return note.is_pinned;
        return false;
      })
      .filter((note) => {
        if (!keyword) return true;

        return (
          note.title?.toLowerCase().includes(keyword) ||
          note.content?.toLowerCase().includes(keyword) ||
          note.excerpt?.toLowerCase().includes(keyword)
        );
      })
      .sort(sortNotes);
  }, [notes, openSpecialSection, keyword]);

  const toolbarButtonClass =
    "flex h-9 shrink-0 items-center gap-1 rounded-[6px] border border-white/10 bg-[#151a1d] px-3 text-[12px] font-bold text-zinc-300 whitespace-nowrap transition hover:border-emerald-500/35 hover:bg-emerald-500/10 hover:text-emerald-300";

  if (!open) return null;

  return (
    <aside
      style={isFullScreen ? undefined : { width: minimized ? 72 : panelWidth }}
      className={`fixed right-0 top-16 z-[85] h-[calc(100vh-64px)] border-l border-white/10 bg-[#080d10] shadow-2xl transition-all duration-300 ${
        isFullScreen ? "left-0 lg:left-[220px] w-auto" : ""
      }`}
    >
      {isResizing && !isFullScreen && (
        <div className="fixed inset-0 z-[-1] cursor-col-resize select-none" />
      )}

      {!minimized && !isFullScreen && (
        <div
          onMouseDown={() => {
            resizingRef.current = true;
            setIsResizing(true);
          }}
          className="group absolute left-0 top-0 h-full w-4 cursor-col-resize"
        >
          <div className="absolute left-1/2 top-20 -translate-x-1/2 opacity-0 transition group-hover:opacity-100">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-500/30 bg-[#0b1117] shadow-lg">
              <MoveHorizontal size={14} className="text-emerald-400" />
            </div>
          </div>

          <div className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-transparent transition group-hover:bg-emerald-500/70" />
        </div>
      )}

      <div
        className={`flex h-14 items-center border-b border-zinc-800 bg-[#071018]/95 ${
          minimized ? "justify-center px-0" : "justify-between px-4"
        }`}
      >
        {minimized ? (
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
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
            title="Cre Note 펼치기"
          >
            <StickyNote size={20} />
          </button>
        ) : (
          <>
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                <StickyNote size={18} />
              </div>

              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-white flex items-center gap-2">
                  <span>Cre Note</span>
                  {isFullScreen && (
                    <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-[10px] font-black text-emerald-400 border border-emerald-500/20">
                      FULL SCREEN
                    </span>
                  )}
                </div>
                <div className="truncate text-xs text-zinc-500">Global Quick Note</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* 🚀 전체 화면 / 복원 토글 버튼 */}
              <button
                onClick={() => setIsFullScreen((prev) => !prev)}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-extrabold text-zinc-300 transition hover:bg-white/10 hover:text-white cursor-pointer"
                title={isFullScreen ? "이전 크기로 복원" : "전체 화면으로 열기"}
              >
                {isFullScreen ? (
                  <>
                    <Minimize2 size={13} className="text-emerald-400" />
                    <span>복원</span>
                  </>
                ) : (
                  <>
                    <Maximize2 size={13} className="text-emerald-400" />
                    <span>전체 화면</span>
                  </>
                )}
              </button>

              <button
                onClick={closeWidget}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-black text-zinc-300 transition hover:bg-white/10 hover:text-white cursor-pointer"
                title="Cre Note 닫기"
              >
                닫기
              </button>
            </div>
          </>
        )}
      </div>

      {minimized ? (
        <div className="h-[calc(100vh-120px)]" />
      ) : (
        <div className={`grid h-[calc(100vh-120px)] ${isFullScreen ? "grid-cols-[280px_1fr]" : "grid-cols-[230px_1fr]"}`}>
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
                  placeholder="전체 노트 검색"
                  id="cre-note-search"
                  className="h-9 w-full rounded-xl border border-white/10 bg-black/40 pl-9 pr-3 text-xs text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-emerald-500/50"
                />
              </div>

              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() =>
                    setOpenSpecialSection(
                      openSpecialSection === "favorite" ? null : "favorite"
                    )
                  }
                  className={`rounded-md border px-2 py-2 text-[11px] transition ${openSpecialSection === "favorite"
                    ? "border-yellow-400/40 bg-yellow-400/10 text-yellow-300"
                    : "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  ⭐ 즐겨
                </button>

                <button
                  onClick={() =>
                    setOpenSpecialSection(
                      openSpecialSection === "pinned" ? null : "pinned"
                    )
                  }
                  className={`rounded-md border px-2 py-2 text-[11px] transition ${openSpecialSection === "pinned"
                    ? "border-sky-400/40 bg-sky-400/10 text-sky-300"
                    : "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  📌 고정
                </button>

                <button
                  onClick={() =>
                    setOpenSpecialSection(
                      openSpecialSection === "trash" ? null : "trash"
                    )
                  }
                  className={`rounded-md border px-2 py-2 text-[11px] transition ${openSpecialSection === "trash"
                    ? "border-red-400/40 bg-red-400/10 text-red-300"
                    : "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  🗑 휴지통
                </button>
              </div>

            </div>

            <div className="h-[calc(100vh-190px)] overflow-y-auto p-2">
              <div className="space-y-2">
                <div className="mb-2 flex items-center justify-between px-1">
                  <div className="text-[11px] font-semibold text-zinc-500">
                    📁 폴더
                  </div>

                  <button
                    onClick={createFolder}
                    className="rounded-md px-2 py-1 text-[11px] text-emerald-400 hover:bg-emerald-500/10"
                  >
                    + 폴더
                  </button>
                </div>

                {visibleFolders.map((folder) => {
                  const expanded = expandedFolderIds.includes(folder.id);
                  const folderNotes = notesByFolder.get(folder.id) ?? [];
                  const activeFolder = activeFolderId === folder.id;

                  return (
                    <div
                      key={folder.id}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        const noteId = e.dataTransfer.getData("text/plain");
                        const note = notes.find((item) => item.id === noteId);
                        if (note) moveNoteToFolder(note, folder.id);
                      }}
                      className={`rounded-lg border ${activeFolder
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : "border-white/10 bg-white/[0.03]"
                        }`}
                    >
                      <div className="flex items-center gap-1 px-2 py-2">
                        <button
                          onClick={() => toggleFolder(folder)}
                          className="flex min-w-0 flex-1 items-center gap-1 text-left text-xs text-zinc-300"
                        >
                          {expanded ? (
                            <ChevronDown size={14} />
                          ) : (
                            <ChevronRight size={14} />
                          )}
                          <FolderIcon size={14} className="text-emerald-400" />
                          <span className="truncate">{folder.name}</span>
                          <span className="ml-auto text-[10px] text-zinc-600">
                            {folderNotes.length}
                          </span>
                        </button>

                        <button
                          onClick={() => renameFolder(folder)}
                          className="rounded p-1 text-zinc-500 hover:bg-white/10 hover:text-white"
                          title="폴더 이름 변경"
                        >
                          <Pencil size={12} />
                        </button>

                        <button
                          onClick={() => deleteFolder(folder)}
                          className="rounded p-1 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
                          title="폴더 삭제"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      {expanded && (
                        <div className="space-y-1 border-t border-white/10 p-1">
                          {folderNotes.length === 0 ? (
                            <div className="px-3 py-2 text-[11px] text-zinc-600">
                              노트 없음
                            </div>
                          ) : (
                            folderNotes.map((note) => (
                              <NoteListItem
                                key={note.id}
                                note={note}
                                active={activeNote?.id === note.id}
                                onSelect={() => selectNote(note)}
                              />
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {openSpecialSection && (
                  <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.03] p-2">
                    <div className="mb-2 flex items-center justify-between px-1">
                      <div className="text-[11px] font-semibold text-zinc-400">
                        {openSpecialSection === "favorite" && "⭐ 즐겨찾기"}
                        {openSpecialSection === "pinned" && "📌 고정노트"}
                        {openSpecialSection === "trash" && "🗑 휴지통"}
                      </div>

                      {openSpecialSection === "trash" && (
                        <button
                          onClick={emptyTrash}
                          className="rounded-md px-2 py-1 text-[11px] text-red-300 hover:bg-red-500/10"
                        >
                          비우기
                        </button>
                      )}
                    </div>

                    <div className="space-y-1">
                      {specialNotes.length === 0 ? (
                        <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-4 text-center text-xs text-zinc-600">
                          표시할 노트가 없습니다.
                        </div>
                      ) : (
                        specialNotes.map((note) => (
                          <NoteListItem
                            key={note.id}
                            note={note}
                            active={activeNote?.id === note.id}
                            onSelect={() => selectNote(note)}
                          />
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="flex min-w-0 flex-col">
            {activeNote ? (
              <>
                <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                  <span className="shrink-0 text-sm font-black text-zinc-300">
                    제목 :
                  </span>

                  <input
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="제목 없음"
                    className="min-w-0 flex-1 bg-transparent text-lg font-bold text-white outline-none placeholder:text-zinc-600"
                    disabled={activeNote.is_deleted}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 border-b border-white/10 px-4 py-2">
                  {!activeNote.is_deleted && (
                    <select
                      value={activeNote.folder_id ?? ""}
                      onChange={(e) =>
                        moveNoteToFolder(activeNote, e.target.value || null)
                      }
                      className="h-9 max-w-[170px] rounded-[6px] border border-emerald-500/55 bg-black/40 px-3 text-xs font-black text-emerald-100 outline-none transition focus:border-emerald-400"
                      title="폴더 이동"
                    >
                      {folders.map((folder) => (
                        <option key={folder.id} value={folder.id}>
                          {folder.name}
                        </option>
                      ))}
                    </select>
                  )}

                  {!activeNote.is_deleted && (
                    <>
                      <button
                        onClick={() => togglePinned(activeNote)}
                        className="rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-sky-400"
                        title="상단 고정"
                      >
                        {activeNote.is_pinned ? (
                          <Pin size={17} className="fill-sky-400 text-sky-400" />
                        ) : (
                          <PinOff size={17} />
                        )}
                      </button>

                      <button
                        onClick={() => toggleFavorite(activeNote)}
                        className="rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-yellow-400"
                        title="즐겨찾기"
                      >
                        {activeNote.is_favorite ? (
                          <Star
                            size={17}
                            className="fill-yellow-400 text-yellow-400"
                          />
                        ) : (
                          <StarOff size={17} />
                        )}
                      </button>
                    </>
                  )}

                  {activeNote.is_deleted || viewMode === "trash" ? (
                    <>
                      <button
                        onClick={() => restoreNote(activeNote)}
                        className="rounded-lg p-2 text-zinc-400 hover:bg-emerald-500/10 hover:text-emerald-400"
                        title="복구"
                      >
                        <RotateCcw size={17} />
                      </button>

                      <button
                        onClick={() => permanentlyDeleteNote(activeNote)}
                        className="rounded-lg p-2 text-zinc-400 hover:bg-red-500/10 hover:text-red-400"
                        title="완전삭제"
                      >
                        <Trash2 size={17} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => deleteNote(activeNote)}
                      className="rounded-lg p-2 text-zinc-400 hover:bg-red-500/10 hover:text-red-400"
                      title="삭제"
                    >
                      <Trash2 size={17} />
                    </button>
                  )}
                </div>

                <div className="flex min-w-0 flex-wrap items-center gap-2 border-b border-white/10 px-4 py-2">
                  <button
                    onClick={insertCheckbox}
                    className={toolbarButtonClass}
                    title="체크박스 삽입"
                  >
                    ⬜ 체크박스
                  </button>

                  <button
                    onClick={toggleCheckboxOnCurrentLine}
                    className={toolbarButtonClass}
                    title="현재 줄 체크/해제"
                  >
                    ✅ 완료
                  </button>

                  <button
                    onClick={moveCompletedTodosToBottom}
                    className={toolbarButtonClass}
                    title="완료 아래로"
                  >
                    ↓ 완료 아래로
                  </button>

                  <button
                    onClick={insertDate}
                    className={toolbarButtonClass}
                  >
                    📅 날짜
                  </button>

                  <button
                    onClick={insertDivider}
                    className={toolbarButtonClass}
                  >
                    ➖ 구분선
                  </button>

                  <button
                    onClick={insertNumberList}
                    className={toolbarButtonClass}
                  >
                    번호추가 1.
                  </button>

                  <button
                    onClick={insertBullet}
                    className={toolbarButtonClass}
                  >
                    항목추가 •
                  </button>

                </div>

                <textarea
                  id="cre-note-editor"
                  value={content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  onKeyDown={handleEditorKeyDown}
                  placeholder="작업하면서 떠오른 아이디어, 할 일, 임시 문장을 적어두세요..."
                  className="min-h-0 flex-1 resize-none bg-transparent p-4 text-sm leading-7 text-zinc-200 outline-none placeholder:text-zinc-600 disabled:opacity-60"
                  disabled={activeNote.is_deleted}
                />

                <div className="flex h-11 items-center justify-between border-t border-white/10 px-4 text-xs text-zinc-500">
                  <span>{content.length.toLocaleString()}자</span>

                  <div className="flex items-center gap-1">
                    <Save size={13} />
                    <span>
                      {activeNote.is_deleted
                        ? "휴지통 노트"
                        : saving
                          ? "저장 중..."
                          : "자동 저장됨"}
                    </span>
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

function NoteListItem({
  note,
  active,
  onSelect,
}: {
  note: Note;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      draggable={!note.is_deleted}
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", note.id);
      }}
      onClick={onSelect}
      className={`group w-full rounded-md px-3 py-2 text-left transition ${active
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

        <div className="flex shrink-0 items-center gap-1">
          {note.is_pinned && <Pin size={12} className="fill-sky-400 text-sky-400" />}
          {note.is_favorite && (
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
          )}
        </div>
      </div>
    </button>
  );
}
