"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Music,
  Disc3,
  Search,
  ChevronLeft,
  Sliders,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Loader2,
} from "lucide-react";

interface Track {
  id: string;
  title: string;
  fileName: string;
  mimeType: string;
  size: number;
  createdAt: string;
  streamUrl: string;
}

const fallbackTracks: Track[] = [
  {
    id: "demo-1",
    title: "Awakening (Vocal Mix)",
    fileName: "Awakening_Vocal_Mix.mp3",
    mimeType: "audio/mp3",
    size: 6120400,
    createdAt: new Date().toISOString(),
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "demo-2",
    title: "Lost in Trance (Club Edit)",
    fileName: "Lost_in_Trance.mp3",
    mimeType: "audio/mp3",
    size: 7352000,
    createdAt: new Date().toISOString(),
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: "demo-3",
    title: "Ethereal Echoes",
    fileName: "Ethereal_Echoes.mp3",
    mimeType: "audio/mp3",
    size: 5840900,
    createdAt: new Date().toISOString(),
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
];

export default function CreMusicPlayerPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  // 1. 음원 목록 조회
  const fetchTracks = async () => {
    setIsSyncing(true);
    setError("");
    try {
      const res = await fetch("/api/music-studio/list");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "음악 목록 로드 실패");
      }

      if (data.tracks && data.tracks.length > 0) {
        setTracks(data.tracks);
      } else {
        // 구글 드라이브에 곡이 없는 경우 데모 곡으로 바인딩
        setTracks(fallbackTracks);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "서버 연동 오류. 데모 음원으로 연동합니다.");
      setTracks(fallbackTracks);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  // 2. 오디오 객체 이벤트 등록
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleAudioEnded = () => {
      handleNextTrack();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleAudioEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleAudioEnded);
    };
  }, [tracks, currentTrackIndex, isLooping, isShuffle]);

  // 3. 곡 재생 제어 효과
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((err) => {
        console.error("Audio play failed:", err);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  // 4. 볼륨 및 음소거 제어
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const currentTrack = tracks[currentTrackIndex];

  // 재생/일시정지 토글
  const handlePlayPause = () => {
    if (tracks.length === 0) return;
    setIsPlaying(!isPlaying);
  };

  // 특정 곡 선택 재생
  const handleSelectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  // 다음 곡 재생
  const handleNextTrack = () => {
    if (tracks.length === 0) return;
    if (isLooping) {
      // 한곡 반복인 경우 현재 위치 재설정 후 재생
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.error);
      }
      return;
    }

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * tracks.length);
      setCurrentTrackIndex(randomIndex);
    } else {
      setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
    }
    setIsPlaying(true);
    setCurrentTime(0);
  };

  // 이전 곡 재생
  const handlePrevTrack = () => {
    if (tracks.length === 0) return;
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * tracks.length);
      setCurrentTrackIndex(randomIndex);
    } else {
      setCurrentTrackIndex((prevIndex) =>
        prevIndex === 0 ? tracks.length - 1 : prevIndex - 1
      );
    }
    setIsPlaying(true);
    setCurrentTime(0);
  };

  // 시간 포맷 (mm:ss)
  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // 진행 상태바 클릭 이동 (Seeking)
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progress = progressRef.current;
    const audio = audioRef.current;
    if (!progress || !audio || duration === 0) return;

    const rect = progress.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickPercentage = clickX / width;
    const newTime = clickPercentage * duration;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // 바이트 포맷 변환
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0.0MB";
    return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
  };

  return (
    <div className="flex h-screen flex-col bg-[#070709] text-zinc-200">
      {/* 백그라운드 오디오 노드 */}
      {currentTrack && (
        <audio
          ref={audioRef}
          src={currentTrack.streamUrl}
          preload="auto"
        />
      )}

      {/* 메인 에어리어 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 왼쪽 스포티파이 스타일 사이드바 */}
        <aside className="hidden w-64 flex-col bg-black p-4 md:flex border-r border-zinc-900">
          <div className="space-y-6">
            {/* 뒤로가기 & 로고 */}
            <div className="flex items-center justify-between">
              <Link
                href="/studio/music"
                className="flex items-center gap-1.5 text-zinc-400 hover:text-white"
              >
                <ChevronLeft size={16} />
                <span className="text-xs font-bold">뮤직 스튜디오 홈</span>
              </Link>
            </div>

            <div className="flex items-center gap-2 px-2 py-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 text-white">
                <Disc3 size={18} className="animate-spin-slow" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                Cre Music
              </span>
            </div>

            {/* 네비게이션 */}
            <nav className="space-y-1">
              <Link
                href="/studio/music"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold text-zinc-400 hover:bg-zinc-900 hover:text-white"
              >
                <Music size={16} />
                홈 스튜디오
              </Link>
              <div className="flex items-center justify-between rounded-lg bg-zinc-900 px-3 py-2.5 text-sm font-bold text-cyan-200">
                <div className="flex items-center gap-3">
                  <Music size={16} />
                  보컬 트랜스 라이브러리
                </div>
                <span className="rounded-full bg-cyan-400/10 px-2 py-0.5 text-[10px] text-cyan-300">
                  Active
                </span>
              </div>
            </nav>

            {/* 내 플레이리스트/앨범 목록 */}
            <div className="pt-4 border-t border-zinc-900">
              <span className="px-3 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                Playlists
              </span>
              <div className="mt-2 space-y-1">
                <div className="group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-black text-white bg-zinc-900/50">
                  <div className="flex items-center gap-2 truncate">
                    <div className="h-6 w-6 rounded bg-gradient-to-tr from-purple-800 to-indigo-900 flex items-center justify-center text-[10px]">
                      VT
                    </div>
                    <span className="truncate">Awakening 앨범</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* 메인 상세 페이지 */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-gradient-to-b from-[#1c1328] via-[#070709] to-[#070709]">
          {/* 상단바 */}
          <header className="flex h-16 items-center justify-between px-6 lg:px-8 border-b border-white/5 shrink-0 bg-black/20 backdrop-blur">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-black text-white flex items-center gap-2">
                <Sparkles size={14} className="text-cyan-400" />
                Google Drive 20TB 연동 음악 플레이어
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchTracks}
                disabled={isSyncing}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-black text-zinc-300 hover:border-cyan-500/50 hover:text-cyan-200 disabled:opacity-50"
              >
                <RefreshCw size={12} className={isSyncing ? "animate-spin" : ""} />
                동기화
              </button>

              <a
                href="https://drive.google.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-black text-zinc-300 hover:border-cyan-500/50 hover:text-cyan-200"
              >
                드라이브 열기
                <ExternalLink size={12} />
              </a>
            </div>
          </header>

          {/* 메인 음반 배너 */}
          <div className="px-6 py-6 lg:px-8 flex flex-col gap-6 md:flex-row md:items-end bg-gradient-to-b from-purple-950/20 to-transparent">
            {/* 앨범 커버 */}
            <div className="relative h-44 w-44 shrink-0 rounded-2xl bg-gradient-to-tr from-purple-700 via-indigo-800 to-blue-900 p-6 flex flex-col justify-between shadow-2xl shadow-purple-950/50 border border-purple-500/20 group">
              <Disc3 className="h-12 w-12 text-purple-200 animate-spin-slow" />
              <div>
                <span className="text-[10px] font-black tracking-widest text-purple-300 uppercase">
                  Vocal Trance
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight mt-1">
                  Awakening
                </h3>
              </div>
              <div className="absolute right-3 bottom-3 flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 text-black shadow-lg opacity-0 group-hover:opacity-100 transition duration-300 transform translate-y-2 group-hover:translate-y-0 cursor-pointer">
                <Play size={16} fill="black" />
              </div>
            </div>

            {/* 앨범 설명 메타데이터 */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-cyan-400">
                ALBUM
              </span>
              <h1 className="text-3xl font-black md:text-5xl tracking-tight text-white">
                Awakening
              </h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-zinc-400 font-bold">
                <span className="text-white">CreAibox Studio</span>
                <span>•</span>
                <span>2026</span>
                <span>•</span>
                <span>총 {tracks.length}곡</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-cyan-300">
                  <Music size={12} />
                  vocal_trance 폴더 연동
                </span>
              </div>
            </div>
          </div>

          {/* 에러 또는 공지 배너 */}
          {error && (
            <div className="mx-6 lg:mx-8 mb-4 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3 text-xs leading-5 text-yellow-200">
              {error}
            </div>
          )}

          {/* 음악 재생 목록 테이블 */}
          <div className="flex-1 px-6 py-4 lg:px-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-black text-white">앨범 수록곡 목록</h3>
              {isSyncing && (
                <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-bold">
                  <Loader2 size={12} className="animate-spin" />
                  동기화 중...
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="flex h-48 items-center justify-center text-zinc-500 text-sm">
                <Loader2 size={24} className="animate-spin mr-2" />
                구글 드라이브 음원을 로드하고 있습니다...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                      <th className="py-3 w-12 text-center">#</th>
                      <th className="py-3">곡 제목</th>
                      <th className="py-3 hidden sm:table-cell">파일 크기</th>
                      <th className="py-3 hidden md:table-cell">생성일자</th>
                      <th className="py-3 w-16 text-center">재생</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tracks.map((track, index) => {
                      const isActive = currentTrackIndex === index;
                      return (
                        <tr
                          key={track.id}
                          onClick={() => handleSelectTrack(index)}
                          className={`group cursor-pointer border-b border-zinc-900/50 hover:bg-white/5 transition ${
                            isActive ? "bg-white/5 text-white" : "text-zinc-400"
                          }`}
                        >
                          <td className="py-3 text-center font-bold text-zinc-500">
                            {isActive && isPlaying ? (
                              <div className="flex items-end justify-center gap-[2px] h-3 w-3 mx-auto">
                                <div className="w-[2px] rounded-t bg-cyan-400 animate-[bounce_0.8s_infinite]"></div>
                                <div className="w-[2px] rounded-t bg-cyan-400 animate-[bounce_1.2s_infinite_0.2s]"></div>
                                <div className="w-[2px] rounded-t bg-cyan-400 animate-[bounce_1s_infinite_0.4s]"></div>
                              </div>
                            ) : (
                              index + 1
                            )}
                          </td>
                          <td className="py-3">
                            <div className="font-black group-hover:text-white truncate">
                              {track.title}
                            </div>
                            <div className="text-[10px] text-zinc-500 truncate mt-0.5">
                              {track.fileName}
                            </div>
                          </td>
                          <td className="py-3 hidden sm:table-cell font-bold">
                            {formatBytes(track.size)}
                          </td>
                          <td className="py-3 hidden md:table-cell font-bold text-zinc-500">
                            {new Date(track.createdAt).toLocaleDateString("ko-KR", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })}
                          </td>
                          <td className="py-3 text-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isActive) {
                                  handlePlayPause();
                                } else {
                                  handleSelectTrack(index);
                                }
                              }}
                              className={`flex h-7 w-7 items-center justify-center rounded-full transition ${
                                isActive
                                  ? "bg-cyan-400 text-black"
                                  : "bg-zinc-800 text-white group-hover:bg-cyan-400 group-hover:text-black"
                              }`}
                            >
                              {isActive && isPlaying ? (
                                <Pause size={12} fill="currentColor" />
                              ) : (
                                <Play size={12} fill="currentColor" className="ml-0.5" />
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 하단 글로벌 뮤직 컨트롤바 */}
      <footer className="h-20 shrink-0 bg-[#121216] border-t border-zinc-900 px-6 flex items-center justify-between gap-4 select-none">
        {/* 현재 곡 정보 */}
        <div className="flex items-center gap-3 w-1/4 min-w-0">
          {currentTrack ? (
            <>
              <div className="h-12 w-12 shrink-0 rounded-lg bg-gradient-to-tr from-purple-800 to-indigo-900 flex items-center justify-center border border-purple-500/20">
                <Disc3 size={20} className={isPlaying ? "animate-spin-slow" : ""} />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-black text-white">
                  {currentTrack.title}
                </div>
                <div className="truncate text-xs text-zinc-500 font-bold mt-0.5">
                  Awakening • Vocal Trance
                </div>
              </div>
            </>
          ) : (
            <div className="text-xs text-zinc-600 font-bold">재생 대기 중</div>
          )}
        </div>

        {/* 플레이어 컨트롤러 */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-xl">
          <div className="flex items-center gap-5 text-zinc-400">
            <button
              type="button"
              onClick={() => setIsShuffle(!isShuffle)}
              className={`hover:text-white transition ${isShuffle ? "text-cyan-400" : ""}`}
              title="셔플"
            >
              <Shuffle size={14} />
            </button>
            <button
              type="button"
              onClick={handlePrevTrack}
              className="hover:text-white transition"
              title="이전 곡"
            >
              <SkipBack size={16} fill="currentColor" />
            </button>
            <button
              type="button"
              onClick={handlePlayPause}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black hover:scale-105 transition"
              title={isPlaying ? "일시정지" : "재생"}
            >
              {isPlaying ? <Pause size={15} fill="black" /> : <Play size={15} fill="black" className="ml-0.5" />}
            </button>
            <button
              type="button"
              onClick={handleNextTrack}
              className="hover:text-white transition"
              title="다음 곡"
            >
              <SkipForward size={16} fill="currentColor" />
            </button>
            <button
              type="button"
              onClick={() => setIsLooping(!isLooping)}
              className={`hover:text-white transition ${isLooping ? "text-cyan-400" : ""}`}
              title="한곡 반복"
            >
              <Repeat size={14} />
            </button>
          </div>

          {/* 재생 시커 바 */}
          <div className="flex items-center gap-2.5 w-full text-[10px] font-bold text-zinc-500">
            <span>{formatTime(currentTime)}</span>
            <div
              ref={progressRef}
              onClick={handleProgressBarClick}
              className="flex-1 h-1 bg-zinc-800 rounded-full cursor-pointer relative overflow-hidden group/bar"
            >
              {/* 재생 진행 상태바 */}
              <div
                className="h-full bg-cyan-400 group-hover/bar:bg-cyan-300"
                style={{
                  width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                }}
              ></div>
            </div>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* 볼륨 및 부가 제어 */}
        <div className="flex items-center justify-end gap-3 w-1/4">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="text-zinc-400 hover:text-white transition"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => {
              setVolume(Number(e.target.value));
              setIsMuted(false);
            }}
            className="w-20 h-1 bg-zinc-800 accent-cyan-400 rounded-full outline-none cursor-pointer"
          />
        </div>
      </footer>
    </div>
  );
}
