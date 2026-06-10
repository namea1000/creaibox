"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Bot, MoveHorizontal, X, Minus } from "lucide-react";
import AiAssistantPanel from "./ai-assistant/AiAssistantPanel";

export default function AiAssistantWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [width, setWidth] = useState(720);
  const [isResizing, setIsResizing] = useState(false);

  const panelWidth = useMemo(() => {
    if (minimized) return 72;
    return Math.min(Math.max(width, 560), 980);
  }, [minimized, width]);

  useEffect(() => {
    const handleOpen = () => {
      setOpen(true);
      setMinimized(false);
    };

    window.addEventListener("open-ai-assistant", handleOpen);

    return () => {
      window.removeEventListener("open-ai-assistant", handleOpen);
    };
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (event: MouseEvent) => {
      const nextWidth = window.innerWidth - event.clientX;
      setWidth(Math.min(Math.max(nextWidth, 560), 980));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  if (!open) return null;

  return (
    <div
      className="fixed bottom-0 right-0 top-0 z-[80] border-l border-cyan-400/20 bg-[#05080c]/95 shadow-2xl shadow-black/70 backdrop-blur-xl"
      style={{ width: panelWidth }}
    >
      <button
        onMouseDown={() => {
          if (!minimized) setIsResizing(true);
        }}
        className="absolute left-0 top-0 z-20 flex h-full w-3 -translate-x-1/2 cursor-col-resize items-center justify-center border-l border-cyan-400/10 bg-transparent text-cyan-300/40 transition hover:bg-cyan-400/10 hover:text-cyan-200"
        aria-label="AI Assistant 패널 크기 조절"
      >
        {!minimized && <MoveHorizontal size={14} />}
      </button>

      {minimized ? (
        <div className="flex h-full flex-col items-center gap-4 border-l border-white/5 bg-[#071018] px-3 py-4">
          <button
            onClick={() => setMinimized(false)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-500/10 text-cyan-300 transition hover:bg-cyan-500/20"
            title="AI Assistant 열기"
          >
            <Bot size={22} />
          </button>

          <div className="h-px w-8 bg-white/10" />

          <button
            onClick={() => setOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition hover:bg-red-500/10 hover:text-red-300"
            title="닫기"
          >
            <X size={17} />
          </button>
        </div>
      ) : (
        <div className="flex h-full min-h-0 flex-col">
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-[#071018]/95 px-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/20">
                <Bot size={19} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-black text-white">
                  AI Assistant
                </p>
                <p className="truncate text-[11px] font-semibold text-cyan-200/60">
                  Multi Agent Hub
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMinimized(true)}
                className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white"
              >
                <Minus size={14} />
              </button>

              <button
                onClick={() => setOpen(false)}
                className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-bold text-zinc-300 transition hover:bg-red-500/10 hover:text-red-300"
              >
                닫기
              </button>
            </div>
          </div>

          <AiAssistantPanel />
        </div>
      )}
    </div>
  );
}