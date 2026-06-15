"use client";

import { useEffect, useRef } from "react";
import { useVideoEditor } from "./VideoEditorContext";

const UI_UPDATE_INTERVAL = 0.12; // 약 초당 8~10회만 React 업데이트

export default function VideoEditorPlaybackController() {
  const {
    isPlaying,
    currentTime,
    totalDuration,
    selectedClipId,
    clips,
    setCurrentTime,
    setIsPlaying,
    selectClip,
    removeClip,
    duplicateClip,
    copyClip,
    pasteClip,
    splitClip,
    undo,
    redo,
  } = useVideoEditor();

  const frameRef = useRef<number | null>(null);
  const playbackTimeRef = useRef(currentTime);
  const lastTimestampRef = useRef<number | null>(null);
  const lastUiPublishRef = useRef(currentTime);
  const lastAutoSelectedClipIdRef = useRef<string | null>(null);
  const prevIsPlayingRef = useRef(isPlaying);

  useEffect(() => {
    const wasPlaying = prevIsPlayingRef.current;
    prevIsPlayingRef.current = isPlaying;

    if (!isPlaying && wasPlaying) {
      const pausedTime = Math.min(totalDuration, Math.max(0, playbackTimeRef.current));
      lastUiPublishRef.current = pausedTime;
      setCurrentTime(Number(pausedTime.toFixed(2)));
      window.dispatchEvent(
        new CustomEvent("creaibox-video-editor-playback-frame", {
          detail: {
            currentTime: pausedTime,
            totalDuration,
            isSeek: true,
          },
        })
      );
    }

    if (isPlaying && !wasPlaying && selectedClipId) {
      const selectedClip = clips.find((c) => c.id === selectedClipId);
      if (selectedClip && selectedClip.type === "visualizer") {
        selectClip(null);
      }
    }
  }, [isPlaying, totalDuration, selectedClipId, clips, setCurrentTime, selectClip]);

  useEffect(() => {
    const timeDiff = Math.abs(currentTime - playbackTimeRef.current);
    const isManualSeek = timeDiff > 0.3;

    if (isPlaying && !isManualSeek) {
      lastUiPublishRef.current = currentTime;
      return;
    }

    playbackTimeRef.current = currentTime;
    lastUiPublishRef.current = currentTime;

    // 자동으로 흐르는 재생 틱이 아니라, 사용자가 실제로 클릭하거나 조작하여 0.3초 이상 급격한 타임점프가 일어났을 때만 강제 싱크 신호를 쏨
    if (isManualSeek) {
      window.dispatchEvent(
        new CustomEvent("creaibox-video-editor-playback-frame", {
          detail: {
            currentTime,
            totalDuration,
            isSeek: true,
          },
        })
      );
    }
  }, [currentTime, totalDuration, isPlaying]);

  useEffect(() => {
    if (!isPlaying) {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      lastTimestampRef.current = null;
      return;
    }

    const tick = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const delta = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      const nextTime = playbackTimeRef.current + delta;

      if (nextTime >= totalDuration) {
        playbackTimeRef.current = totalDuration;
        setCurrentTime(totalDuration);
        setIsPlaying(false);
        return;
      }

      playbackTimeRef.current = nextTime;

      window.dispatchEvent(
        new CustomEvent("creaibox-video-editor-playback-frame", {
          detail: {
            currentTime: nextTime,
            totalDuration,
          },
        })
      );

      const visibleClip = clips.find(
        (clip) =>
          nextTime >= clip.startTime &&
          nextTime <= clip.startTime + clip.duration
      );

      if (
        visibleClip &&
        visibleClip.id !== selectedClipId &&
        visibleClip.id !== lastAutoSelectedClipIdRef.current
      ) {
        lastAutoSelectedClipIdRef.current = visibleClip.id;
        selectClip(visibleClip.id);
      }

      if (Math.abs(nextTime - lastUiPublishRef.current) >= UI_UPDATE_INTERVAL) {
        lastUiPublishRef.current = nextTime;
        setCurrentTime(Number(nextTime.toFixed(2)));
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      lastTimestampRef.current = null;
    };
  }, [
    isPlaying,
    totalDuration,
    clips,
    selectedClipId,
    setCurrentTime,
    setIsPlaying,
    selectClip,
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (isTyping) return;

      const isCommandKey = event.metaKey || event.ctrlKey;
      const key = event.key.toLowerCase();

      if (isCommandKey && key === "z") {
        event.preventDefault();
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }

      if (isCommandKey && key === "y") {
        event.preventDefault();
        redo();
        return;
      }

      if (isCommandKey && key === "c" && selectedClipId) {
        event.preventDefault();
        copyClip(selectedClipId);
        return;
      }

      if (isCommandKey && key === "v") {
        event.preventDefault();
        pasteClip(playbackTimeRef.current);
        return;
      }

      if (event.code === "Space") {
        event.preventDefault();
        setIsPlaying(!isPlaying);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        const nextTime = Math.min(totalDuration, Number((playbackTimeRef.current + 0.1).toFixed(2)));
        playbackTimeRef.current = nextTime;
        setCurrentTime(nextTime);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        const nextTime = Math.max(0, Number((playbackTimeRef.current - 0.1).toFixed(2)));
        playbackTimeRef.current = nextTime;
        setCurrentTime(nextTime);
      }

      if (event.key === "Home") {
        event.preventDefault();
        playbackTimeRef.current = 0;
        setCurrentTime(0);
      }

      if (event.key === "End") {
        event.preventDefault();
        playbackTimeRef.current = totalDuration;
        setCurrentTime(totalDuration);
      }

      if ((event.key === "Backspace" || event.key === "Delete") && selectedClipId) {
        event.preventDefault();
        removeClip(selectedClipId);
      }

      if (isCommandKey && key === "d" && selectedClipId) {
        event.preventDefault();
        duplicateClip(selectedClipId);
      }

      if (isCommandKey && key === "b" && selectedClipId) {
        event.preventDefault();
        splitClip(selectedClipId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isPlaying,
    totalDuration,
    selectedClipId,
    setIsPlaying,
    setCurrentTime,
    removeClip,
    duplicateClip,
    copyClip,
    pasteClip,
    splitClip,
    undo,
    redo,
  ]);

  return null;
}
