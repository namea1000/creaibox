"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import {
  Search,
  UploadCloud,
  Download,
  Eye,
  Music,
  Image as ImageIcon,
  Video,
  Play,
  Pause,
  X,
  Loader2,
  Share2,
  Heart,
  Tag,
  ArrowLeft,
  Volume2,
  FileText,
  HelpCircle,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Edit,
  Trash2,
  ImagePlus,
  SlidersHorizontal,
} from "lucide-react";

interface FreeAsset {
  id: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  mimeType: string;
  size: number;
  createdAt: string;
  title: string;
  tags: string[];
  mediaType: "photo" | "illustration" | "video" | "music" | "gif" | string;
  uploader: string;
  uploaderEmail: string;
  downloads: number;
  views: number;
  aspectRatio?: string;
  generationType?: "ai" | "real" | string;
  width?: number;
  height?: number;
  camera?: string;
  prompt?: string;
  aiTool?: string;
  isOfficialThemeAsset?: boolean;
  themeCategory?: string;
  isBusinessOnly?: boolean;
}

interface AutoplayVideoProps {
  src: string;
  className?: string;
}

const AutoplayVideo: React.FC<AutoplayVideoProps> = ({ src, className }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {
                // Safe catch for browser abort exceptions
              });
            }
          } else {
            video.pause();
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(video);

    return () => {
      if (video) {
        observer.unobserve(video);
      }
      observer.disconnect();
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      loop
      playsInline
      className={className}
    />
  );
};

interface GenreCollectionItem {
  id: string;
  label: string;
  desc: string;
  img: string;
  genreGroup: string;
}

const GENRE_COLLECTIONS: GenreCollectionItem[] = [
  // 록 / 서브컬처 스타일
  { id: "Punk", label: "Punk", desc: "반항적이고 날것의 매력을 뿜어내는 정통 펑크 록", img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "록 / 서브컬처 스타일" },
  { id: "Hard Rock", label: "Hard Rock", desc: "강렬한 기타 리프와 파워풀한 정통 하드 록", img: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "록 / 서브컬처 스타일" },
  { id: "Metal", label: "Metal", desc: "압도적인 드럼 비트와 디스토션의 메탈 사운드", img: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "록 / 서브컬처 스타일" },

  // 라틴 / 댄스 그루브
  { id: "Reggaeton", label: "Reggaeton", desc: "중독성 강한 라틴 얼반 댄스 레게톤 BGM", img: "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "라틴 / 댄스 그루브" },
  { id: "Salsa", label: "Salsa", desc: "정열적이고 화려한 브라스와 타악기의 살사", img: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "라틴 / 댄스 그루브" },
  { id: "Flamenco", label: "Flamenco", desc: "애절한 보컬과 현란한 어쿠스틱 플라멩코 기타", img: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "라틴 / 댄스 그루브" },
  { id: "Bachata", label: "Bachata", desc: "감성적이고 감미로운 도미니카 공화국 바차타", img: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "라틴 / 댄스 그루브" },
  { id: "Samba (Latin)", label: "Samba (Latin)", desc: "브라질 리우 카니발의 폭발적인 춤의 삼바", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "라틴 / 댄스 그루브" },
  { id: "Cha Cha (Latin)", label: "Cha Cha (Latin)", desc: "경쾌하고 절도 있는 리듬의 댄스스포츠 차차차", img: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "라틴 / 댄스 그루브" },
  { id: "Latin", label: "Latin", desc: "라틴 특유의 정열적이고 활기찬 댄스 그루브", img: "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "라틴 / 댄스 그루브" },
  { id: "Disco", label: "Disco", desc: "화려한 미러볼 아래 복고풍 디스코 비트", img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "라틴 / 댄스 그루브" },
  { id: "Dance", label: "Dance", desc: "클럽과 페스티벌을 장악하는 댄스 팝 BGM", img: "https://images.unsplash.com/photo-1508219803418-5f1f894a9b52?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "라틴 / 댄스 그루브" },

  // 전자 음악 (Electronic)
  { id: "Electronic", label: "Electronic", desc: "신디사이저로 직조한 몽환적인 전자 음악", img: "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "전자 음악 (Electronic)" },
  { id: "Synth Pop", label: "Synth Pop", desc: "대중적이고 레트로한 80년대 감성 신스팝", img: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "전자 음악 (Electronic)" },
  { id: "Synthwave", label: "Synthwave", desc: "80년대 아날로그 신디사이저 그리드 사운드", img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "전자 음악 (Electronic)" },
  { id: "Electro", label: "Electro", desc: "기계적이고 리드미컬한 일렉트로닉 댄스 BGM", img: "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "전자 음악 (Electronic)" },
  { id: "Future Bass", label: "Future Bass", desc: "트렌디한 코드 진행과 화려한 신스 사운드", img: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "전자 음악 (Electronic)" },
  { id: "Techno & Trance", label: "Techno & Trance", desc: "무한 반복의 몽환적이고 빠른 클럽 비트", img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "전자 음악 (Electronic)" },
  { id: "House", label: "House", desc: "그루브한 정박자 하우스 댄스 음악", img: "https://images.unsplash.com/photo-1563841930606-67e2b6c330df?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "전자 음악 (Electronic)" },
  { id: "Soft House", label: "Soft House", desc: "편안하고 부드러운 이지리스닝 하우스 비트", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "전자 음악 (Electronic)" },
  { id: "Deep House", label: "Deep House", desc: "깊고 울림이 묵직한 클럽 라운지 딥하우스", img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "전자 음악 (Electronic)" },
  { id: "Drum N Bass", label: "Drum N Bass", desc: "빠른 템포의 브레이크비트와 묵직한 베이스", img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "전자 음악 (Electronic)" },
  { id: "Dubstep", label: "Dubstep", desc: "폭발적인 와블 베이스와 공격적인 드롭 BGM", img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "전자 음악 (Electronic)" },
  { id: "Edm", label: "Edm", desc: "대형 페스티벌을 열광케 하는 일렉트로닉 댄스", img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "전자 음악 (Electronic)" },

  // 힙합 / 알앤비 / 재즈 / 블루스
  { id: "Alternative Hip Hop", label: "Alternative Hip Hop", desc: "새롭고 독창적인 비트의 대안 힙합", img: "https://images.unsplash.com/photo-1571171782249-c400e7702796?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "힙합 / 알앤비 / 재즈 / 블루스" },
  { id: "Old School Hip Hop", label: "Old School Hip Hop", desc: "붐뱁 드럼과 레트로한 90년대 힙합 그루브", img: "https://images.unsplash.com/photo-1564282697843-09404f697775?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "힙합 / 알앤비 / 재즈 / 블루스" },
  { id: "Mainstream Hip Hop", label: "Mainstream Hip Hop", desc: "차트를 장악하는 가장 트렌디한 힙합 비트", img: "https://images.unsplash.com/photo-1524567214243-0013ee31f78f?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "힙합 / 알앤비 / 재즈 / 블루스" },
  { id: "Rap", label: "Rap", desc: "라임과 래핑이 살아있는 클래식 랩 비트", img: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "힙합 / 알앤비 / 재즈 / 블루스" },
  { id: "Trap", label: "Trap", desc: "무거운 808 베이스와 정교한 하이햇 트랩 BGM", img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "힙합 / 알앤비 / 재즈 / 블루스" },
  { id: "Phonk", label: "Phonk", desc: "거칠고 어두운 로파이 분위기의 멤피스 폰크", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "힙합 / 알앤비 / 재즈 / 블루스" },
  { id: "Rnb", label: "Rnb", desc: "감미로운 보컬과 세련된 비트의 알앤비 BGM", img: "https://images.unsplash.com/photo-1563841930606-67e2b6c330df?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "힙합 / 알앤비 / 재즈 / 블루스" },
  { id: "Old School Rnb", label: "Old School Rnb", desc: "복고적인 90년대 슬로우잼 알앤비 그루브", img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "힙합 / 알앤비 / 재즈 / 블루스" },
  { id: "Motown & Old School Rnb", label: "Motown & Old School Rnb", desc: "클래식 모타운 레코드 소울과 레트로 알앤비", img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "힙합 / 알앤비 / 재즈 / 블루스" },
  { id: "Traditional Jazz", label: "Traditional Jazz", desc: "클래식하고 정통적인 뉴올리언스 재즈 스윙", img: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "힙합 / 알앤비 / 재즈 / 블루스" },
  { id: "Modern Jazz", label: "Modern Jazz", desc: "세련된 코드와 자유로운 즉흥 연주의 모던 재즈", img: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "힙합 / 알앤비 / 재즈 / 블루스" },
  { id: "Smooth Jazz", label: "Smooth Jazz", desc: "부드럽고 대중적인 이지리스닝 퓨전 재즈 BGM", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "힙합 / 알앤비 / 재즈 / 블루스" },
  { id: "Acid Jazz", label: "Acid Jazz", desc: "펑크, 소울, 힙합이 결합된 하이브리드 애시드 재즈", img: "https://images.unsplash.com/photo-1508219803418-5f1f894a9b52?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "힙합 / 알앤비 / 재즈 / 블루스" },
  { id: "Blues", label: "Blues", desc: "애절한 펜타토닉 기타와 영혼을 울리는 블루스", img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "힙합 / 알앤비 / 재즈 / 블루스" },
  { id: "Modern Blues", label: "Modern Blues", desc: "현대적인 편곡과 록 사운드가 결합된 모던 블루스", img: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "힙합 / 알앤비 / 재즈 / 블루스" },

  // 팝 / 포크 / 컨트리 / 전통악기
  { id: "Pop", label: "Pop", desc: "귀를 사로잡는 가장 대중적인 팝 음악 BGM", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "팝 / 포크 / 컨트리 / 전통악기" },
  { id: "Indie Pop", label: "Indie Pop", desc: "감성적이고 유니크한 멜로디의 인디 팝", img: "https://images.unsplash.com/photo-1508219803418-5f1f894a9b52?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "팝 / 포크 / 컨트리 / 전통악기" },
  { id: "Alternative", label: "Alternative", desc: "규격화되지 않은 매력적인 대안 팝/록 BGM", img: "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "팝 / 포크 / 컨트리 / 전통악기" },
  { id: "Post Rock", label: "Post Rock", desc: "보컬 없이 악기 연주로 공간을 메우는 포스트록", img: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "팝 / 포크 / 컨트리 / 전통악기" },
  { id: "Folk", label: "Folk", desc: "어쿠스틱 기타와 서정적인 멜로디의 포크 BGM", img: "https://images.unsplash.com/photo-1482440308425-276ad0f28b19?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "팝 / 포크 / 컨트리 / 전통악기" },
  { id: "Traditional Country", label: "Traditional Country", desc: "미국 정통 서부 감성의 컨트리 음악 BGM", img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "팝 / 포크 / 컨트리 / 전통악기" },
  { id: "Modern Country", label: "Modern Country", desc: "팝 음악 요소와 어우러진 현대적인 컨트리", img: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "팝 / 포크 / 컨트리 / 전통악기" },
  { id: "Ska", label: "Ska", desc: "경쾌한 금관악기와 레게 템포의 자메이카 스카", img: "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "팝 / 포크 / 컨트리 / 전통악기" },
  { id: "Funk", label: "Funk", desc: "톡톡 튀는 슬랩 베이스와 극강의 펑크 리듬 BGM", img: "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "팝 / 포크 / 컨트리 / 전통악기" },

  // 클래식 / 합주 / 월드뮤직
  { id: "Modern Classical", label: "Modern Classical", desc: "현대적인 감각으로 재탄생한 모던 클래식", img: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "클래식 / 합주 / 월드뮤직" },
  { id: "Orchestral", label: "Orchestral", desc: "대규모 관현악단의 품격 있고 웅장한 연주 BGM", img: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "클래식 / 합주 / 월드뮤직" },
  { id: "Cinematic", label: "Cinematic", desc: "한 편의 영화를 보는 듯한 영상 연출용 음악", img: "https://images.unsplash.com/photo-1487180142328-054b783fc471?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "클래식 / 합주 / 월드뮤직" },
  { id: "Epic Classical", label: "Epic Classical", desc: "블록버스터 영화에 쓰이는 스펙터클 클래식", img: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "클래식 / 합주 / 월드뮤직" },
  { id: "Chamber Music", label: "Chamber Music", desc: "소규모 실내악단의 단아하고 아름다운 하모니", img: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "클래식 / 합주 / 월드뮤직" },
  { id: "Dramatic Classical", label: "Dramatic Classical", desc: "격정적인 드라마와 연출을 극대화하는 클래식", img: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "클래식 / 합주 / 월드뮤직" },
  { id: "Choir", label: "Choir", desc: "인간의 목소리가 만들어내는 성스러운 성가대 BGM", img: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "클래식 / 합주 / 월드뮤직" },
  { id: "Gospel", label: "Gospel", desc: "영혼을 치유하는 밝고 넘치는 은혜의 가스펠", img: "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "클래식 / 합주 / 월드뮤직" },
  { id: "Instrumental", label: "Instrumental", desc: "보컬을 배제한 순수 기악 연주곡 BGM", img: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "클래식 / 합주 / 월드뮤직" },
  { id: "Ambient", label: "Ambient", desc: "공간을 가득 채우는 은은하고 평온한 환경음악", img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "클래식 / 합주 / 월드뮤직" },
  { id: "World", label: "World", desc: "세계 곳곳의 고유한 전통 에스닉 월드뮤직 BGM", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "클래식 / 합주 / 월드뮤직" },
  { id: "Arabic", label: "Arabic", desc: "이국적인 중동의 매력이 느껴지는 아라빅 음악", img: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "클래식 / 합주 / 월드뮤직" },
  { id: "Celtic", label: "Celtic", desc: "아일랜드의 자연과 전설이 담긴 서정적인 켈틱", img: "https://images.unsplash.com/photo-1487180142328-054b783fc471?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "클래식 / 합주 / 월드뮤직" },
  { id: "Ireland", label: "Ireland", desc: "아일랜드 전통 민요와 파이프 연주곡 BGM", img: "https://images.unsplash.com/photo-1482440308425-276ad0f28b19?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "클래식 / 합주 / 월드뮤직" },
  { id: "Scotland", label: "Scotland", desc: "백파이프가 울리는 스코틀랜드 전통 고원 음악", img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "클래식 / 합주 / 월드뮤직" },
  { id: "China", label: "China", desc: "동양적이고 고풍스러운 정취의 중국 대륙 음악", img: "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "클래식 / 합주 / 월드뮤직" },
  { id: "France", label: "France", desc: "아코디언 소리가 들려오는 낭만적인 프랑스 샹송", img: "https://images.unsplash.com/photo-1508219803418-5f1f894a9b52?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "클래식 / 합주 / 월드뮤직" },
  { id: "Greece", label: "Greece", desc: "지중해의 싱그러움이 깃든 그리스 전통 BGM", img: "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "클래식 / 합주 / 월드뮤직" },
  { id: "India", label: "India", desc: "시타르 연주와 신비로운 인도 전통 라가 BGM", img: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "클래식 / 합주 / 월드뮤직" },

  // 비디오 씬 / 영상 연출
  { id: "Upbeat", label: "Upbeat", desc: "비디오 템포를 끌어올리는 경쾌하고 밝은 비트 BGM", img: "https://images.unsplash.com/photo-1446057032654-9d8885b76c7a?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "비디오 씬 / 영상 연출" },
  { id: "Beats", label: "Beats", desc: "영상 편집을 다이나믹하게 도와주는 드럼 비트 BGM", img: "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "비디오 씬 / 영상 연출" },
  { id: "Main Title", label: "Main Title", desc: "프로그램이나 영상의 강렬한 인트로 오프닝 타이틀", img: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "비디오 씬 / 영상 연출" },
  { id: "Build Up Scenes", label: "Build Up Scenes", desc: "긴장과 텐션을 서서히 빌드업하는 드라마 연출용 BGM", img: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "비디오 씬 / 영상 연출" },
  { id: "Corporate", label: "Corporate", desc: "비즈니스 소개 및 회사 PT용 밝고 신뢰감 있는 음악", img: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "비디오 씬 / 영상 연출" },
  { id: "Action", label: "Action", desc: "박진감 넘치고 긴장감 폭발하는 액션 씬 BGM 연출", img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "비디오 씬 / 영상 연출" },
  { id: "Adventure", label: "Adventure", desc: "새로운 모험과 여정을 자극하는 웅장한 여정 BGM", img: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "비디오 씬 / 영상 연출" },
  { id: "Intro/Outro", label: "Intro/Outro", desc: "영상의 오프닝과 클로징에 알맞은 콤팩트 트랙 BGM", img: "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "비디오 씬 / 영상 연출" },
  { id: "Mystery", label: "Mystery", desc: "비밀을 풀어가거나 미스터리하고 묘한 씬 연출 BGM", img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "비디오 씬 / 영상 연출" },
  { id: "Chase Scene", label: "Chase Scene", desc: "박진감 넘치는 질주 및 체이스 씬에 딱 맞는 BGM", img: "https://images.unsplash.com/photo-1508219803418-5f1f894a9b52?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "비디오 씬 / 영상 연출" },
  { id: "Video Games", label: "Video Games", desc: "8비트 도트부터 최신 대작 게임 BGM 감성 트랙", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "비디오 씬 / 영상 연출" },
  { id: "Horror Scene", label: "Horror Scene", desc: "으스스하고 소름 돋는 공포 연출을 위한 호러 BGM", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "비디오 씬 / 영상 연출" },
  { id: "Crime Scene", label: "Crime Scene", desc: "수사물이나 어두운 범죄 현장, 느와르 씬 연출 BGM", img: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "비디오 씬 / 영상 연출" },
  { id: "Cartoons", label: "Cartoons", desc: "익살스럽고 톡톡 튀는 애니메이션 만화 BGM 트랙", img: "https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "비디오 씬 / 영상 연출" },
  { id: "Small Drama", label: "Small Drama", desc: "일상 소소한 에피소드나 일상 유튜버 일상 BGM", img: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "비디오 씬 / 영상 연출" },
  { id: "Drama Scene", label: "Drama Scene", desc: "갈등과 화해, 격정적인 서사를 표현하는 drama BGM", img: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "비디오 씬 / 영상 연출" },
  { id: "Jingles", label: "Jingles", desc: "광고 및 시그널 음악에 바로 꽂히는 짧은 징글 BGM", img: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "비디오 씬 / 영상 연출" },
  { id: "Vaudeville & Variety Show", label: "Vaudeville & Variety Show", desc: "버라이어티 예능이나 익살맞은 만담 쇼 분위기 BGM", img: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "비디오 씬 / 영상 연출" },
  { id: "Show Dance", label: "Show Dance", desc: "댄스 퍼포먼스나 뮤지컬 쇼의 화려한 쇼 댄스 BGM", img: "https://images.unsplash.com/photo-1508219803418-5f1f894a9b52?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "비디오 씬 / 영상 연출" },
  { id: "Tragedy", label: "Tragedy", desc: "깊은 비극과 감정이 무너져 내리는 슬픈 연출 BGM", img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "비디오 씬 / 영상 연출" },
  { id: "Bloopers", label: "Bloopers", desc: "NG 장면이나 유쾌하고 우스꽝스러운 일상 클립 BGM", img: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "비디오 씬 / 영상 연출" },

  // 감정 / 공간 / 이벤트
  { id: "Cafe", label: "Cafe", desc: "아늑한 조명 아래 스며드는 커피 향 가득한 음악 BGM", img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "감정 / 공간 / 이벤트" },
  { id: "Elevator Music", label: "Elevator Music", desc: "백화점이나 대기실의 평화로운 이지리스닝 배경음", img: "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "감정 / 공간 / 이벤트" },
  { id: "Vintage", label: "Vintage", desc: "빛바랜 필름 질감과 카세트테이프 감성 레트로 BGM", img: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "감정 / 공간 / 이벤트" },
  { id: "Meditation/Spiritual", label: "Meditation/Spiritual", desc: "마음을 차분히 가라앉히는 명상과 요가 BGM 트랙", img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "감정 / 공간 / 이벤트" },
  { id: "Small Emotions", label: "Small Emotions", desc: "소소하고 잔잔한 감성을 불러오는 일상 감성 BGM", img: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "감정 / 공간 / 이벤트" },
  { id: "Nostalgia", label: "Nostalgia", desc: "어린 시절의 추억과 과거를 회상케 하는 노스탤지어", img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "감정 / 공간 / 이벤트" },
  { id: "Supernatural", label: "Supernatural", desc: "초자연적이고 몽환적인 신비의 판타지 BGM", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "감정 / 공간 / 이벤트" },
  { id: "Special Occasions", label: "Special Occasions", desc: "특별한 파티나 기념일을 빛내주는 이벤트용 BGM", img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "감정 / 공간 / 이벤트" },
  { id: "Christmas", label: "Christmas", desc: "눈 내리는 화이트 크리스마스의 캐롤 감성 BGM", img: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "감정 / 공간 / 이벤트" },
  { id: "Eccentric & Quirky", label: "Eccentric & Quirky", desc: "엉뚱하고 재기발랄하며 묘한 중독성의 인디 BGM", img: "https://images.unsplash.com/photo-1508219803418-5f1f894a9b52?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "감정 / 공간 / 이벤트" },
  { id: "Funerals", label: "Funerals", desc: "고인을 추모하는 차분하고 진지한 장례 테마 BGM", img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "감정 / 공간 / 이벤트" },
  { id: "Wedding", label: "Wedding", desc: "신랑 신부의 축복과 사랑을 그리는 로맨틱 웨딩 송", img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "감정 / 공간 / 이벤트" },
  { id: "Religious Theme", label: "Religious Theme", desc: "성스럽고 차분한 영적 치유의 기독교/종교 테마", img: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "감정 / 공간 / 이벤트" },
  { id: "Amusement Park", label: "Amusement Park", desc: "놀이공원의 회전목마와 퍼레이드 같은 BGM 트랙", img: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "감정 / 공간 / 이벤트" },
  { id: "Scary Childrens Tunes", label: "Scary Childrens Tunes", desc: "으스스한 잔혹 동화와 호러 오르골 BGM 튠", img: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "감정 / 공간 / 이벤트" },
  { id: "Happy Childrens Tunes", label: "Happy Childrens Tunes", desc: "천진난만하고 아기자기한 어린이 교육용 동요 BGM", img: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "감정 / 공간 / 이벤트" },
  { id: "Fantasy & Dreamy Childrens'", label: "Fantasy & Dreamy Childrens'", desc: "별이 빛나는 밤하늘과 동심 가득한 판타지 동화", img: "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "감정 / 공간 / 이벤트" },
  { id: "Military & Historical", label: "Military & Historical", desc: "역사적인 다큐멘터리나 군대 행진곡 BGM 트랙", img: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "감정 / 공간 / 이벤트" },
  { id: "Usa", label: "Usa", desc: "미국 정통 서부 개척 시대와 로드 트립 BGM", img: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "감정 / 공간 / 이벤트" },

  // 악기 및 사운드 텍스처
  { id: "Beautiful Plays", label: "Beautiful Plays", desc: "아름답고 섬세한 터치와 멜로디의 앙상블 연주", img: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "악기 및 사운드 텍스처" },
  { id: "Acoustic Group", label: "Acoustic Group", desc: "어쿠스틱 악기들의 담백하고 아름다운 하모니 BGM", img: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "악기 및 사운드 텍스처" },
  { id: "Solo Piano", label: "Solo Piano", desc: "피아노 건반 단독이 만들어내는 잔잔한 피아노 BGM", img: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "악기 및 사운드 텍스처" },
  { id: "Solo Instruments", label: "Solo Instruments", desc: "첼로나 바이올린 등 독주 악기의 원본 매력 연주", img: "https://images.unsplash.com/photo-1487180142328-054b783fc471?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "악기 및 사운드 텍스처" },
  { id: "Solo Classical Instruments", label: "Solo Classical Instruments", desc: "클래식 악기 단 하나의 선율이 전하는 독주 BGM", img: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "악기 및 사운드 텍스처" },
  { id: "Marching Band", label: "Marching Band", desc: "화려한 타악기와 관악기의 웅장한 마칭밴드 연주", img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "악기 및 사운드 텍스처" },
  { id: "Solo Guitar", label: "Solo Guitar", desc: "기타 줄 하나의 울림이 전하는 담백한 솔로 기타", img: "https://images.unsplash.com/photo-1482440308425-276ad0f28b19?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "악기 및 사운드 텍스처" },
  { id: "Oompah Band", label: "Oompah Band", desc: "경쾌한 튜바와 트롬본 중심의 즐거운 요들송 BGM", img: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "악기 및 사운드 텍스처" },
  { id: "Classical String Quartet", label: "Classical String Quartet", desc: "바이올린2, 비올라, 첼로의 우아한 현악 4중주 BGM", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "악기 및 사운드 텍스처" },
  { id: "Big Band", label: "Big Band", desc: "웅장하고 신나는 정통 재즈 빅밴드 오케스트라 BGM", img: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "악기 및 사운드 텍스처" },
  { id: "High Drones", label: "High Drones", desc: "공간을 가득 채우는 은은한 고음역대 지속 사운드", img: "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "악기 및 사운드 텍스처" },
  { id: "Pulses", label: "Pulses", desc: "일정한 비트와 긴장감을 유도하는 펄스 비트 BGM", img: "https://images.unsplash.com/photo-1508219803418-5f1f894a9b52?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "악기 및 사운드 텍스처" },
  { id: "Low Drones", label: "Low Drones", desc: "무겁고 묵직하게 가라앉는 저음역 지속 드론 사운드", img: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "악기 및 사운드 텍스처" },
  { id: "High Rhythmic Drones", label: "High Rhythmic Drones", desc: "리드미컬하게 요동치는 고음 지속 사운드 텍스처", img: "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "악기 및 사운드 텍스처" },
  { id: "Low Rhythmic Drones", label: "Low Rhythmic Drones", desc: "박동하듯 뛰는 저음역 리드미컬 드론 사운드", img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "악기 및 사운드 텍스처" },
  { id: "High Non Rhythmic Drones", label: "High Non Rhythmic Drones", desc: "리듬 없이 몽환적으로 흐르는 고음 지속 텍스처", img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "악기 및 사운드 텍스처" },
  { id: "Low Non Rhythmic Drones", label: "Low Non Rhythmic Drones", desc: "리듬 없이 어둡게 깔리는 심해의 저음 지속 텍스처", img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "악기 및 사운드 텍스처" },
  { id: "Abstract", label: "Abstract", desc: "규정할 수 없는 독창적이고 난해한 예술적 소음 BGM", img: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "악기 및 사운드 텍스처" },
  { id: "Percussion", label: "Percussion", desc: "보컬과 화음 없이 오직 타악기로만 달리는 타악 BGM", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "악기 및 사운드 텍스처" },
  { id: "Oomph / Volume2", label: "Oomph / Volume2", desc: "웅장한 임팩트와 리듬감을 선사하는 강력한 사운드", img: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "악기 및 사운드 텍스처" },

  // 일렉트로닉 / 힙합 서브컬처
  { id: "Synthwave / Retrowave", label: "Synthwave / Retrowave", desc: "복고적인 80년대 신디사이저 감성 신스웨이브 BGM", img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "일렉트로닉 / 힙합 서브컬처" },
  { id: "Vaporwave", label: "Vaporwave", desc: "몽환적이고 왜곡된 레트로 PC 그래픽 감성 BGM", img: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "일렉트로닉 / 힙합 서브컬처" },
  { id: "Future Funk", label: "Future Funk", desc: "복고 디스코를 트렌디하게 믹싱한 신나는 일렉 비트", img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "일렉트로닉 / 힙합 서브컬처" },
  { id: "Melodic Dubstep", label: "Melodic Dubstep", desc: "아름다운 멜로디 위로 터지는 강력한 덥스텝 드롭", img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "일렉트로닉 / 힙합 서브컬처" },
  { id: "Emo Rap / Sad Boy Beats", label: "Emo Rap / Sad Boy Beats", desc: "어둡고 우울하며 감성적인 이모 힙합 사운드 BGM", img: "https://images.unsplash.com/photo-1524567214243-0013ee31f78f?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "일렉트로닉 / 힙합 서브컬처" },

  // 팝 / 인디 / 뉴에이지
  { id: "City Pop", label: "City Pop", desc: "복고풍의 청량하고 세련된 네온 감성 시티팝 BGM", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "팝 / 인디 / 뉴에이지" },
  { id: "Bedroom Pop", label: "Bedroom Pop", desc: "방 안에서 속삭이듯 연주하는 미니멀 감성 팝 BGM", img: "https://images.unsplash.com/photo-1508219803418-5f1f894a9b52?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "팝 / 인디 / 뉴에이지" },
  { id: "Neo-Classical", label: "Neo-Classical", desc: "피아노와 소규모 스트링의 서정적인 신클래식 BGM", img: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "팝 / 인디 / 뉴에이지" },
  { id: "Cinematic Post-Rock", label: "Cinematic Post-Rock", desc: "기타 선율이 서서히 웅장해지는 영화적 포스트록", img: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "팝 / 인디 / 뉴에이지" },

  // 아시아 / 월드 에스닉
  { id: "K-Pop (Modern)", label: "K-Pop (Modern)", desc: "전 세계를 매료시키는 핫하고 현대적인 케이팝 BGM", img: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "아시아 / 월드 에스닉" },
  { id: "J-Pop / Anime Rock", label: "J-Pop / Anime Rock", desc: "청량한 제이팝 멜로디와 스피디한 애니 록 BGM", img: "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "아시아 / 월드 에스닉" },
  { id: "Afrobeat (Amapiano)", label: "Afrobeat (Amapiano)", desc: "아프리카 전통 리듬과 하우스가 만난 아마피아노", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "아시아 / 월드 에스닉" },

  // 기능성 및 오디오 텍스처
  { id: "ASMR / Textural Soundscape", label: "ASMR / Textural Soundscape", desc: "뇌를 자극하는 포근하고 세밀한 화이트 노이즈", img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "기능성 및 오디오 텍스처" },
  { id: "Dark Ambient", label: "Dark Ambient", desc: "심해나 우주 속 고독하고 어두운 앰비언스 BGM", img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "기능성 및 오디오 텍스처" },
  { id: "Glitch Hop", label: "Glitch Hop", desc: "기계적 글리치 노이즈를 힙합 비트에 결합한 트랙", img: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=300&h=300&q=80", genreGroup: "기능성 및 오디오 텍스처" }
];

const GENRE_GROUPS_INFO = [
  { id: "록 / 서브컬처 스타일", label: "록 / 서브컬처", desc: "펑크, 메탈 등 강렬하고 반항적인 얼터너티브 록 그루브", img: "/images/genres/rock_subculture.webp" },
  { id: "라틴 / 댄스 그루브", label: "라틴 / 댄스", desc: "살사, 삼바, 차차차 등 열정적인 라틴 댄스 파티 리듬", img: "/images/genres/latin_dance.webp" },
  { id: "전자 음악 (Electronic)", label: "전자 음악", desc: "테크노, 하우스, EDM 등 신디사이저 기반의 트렌디 비트", img: "/images/genres/electronic.webp" },
  { id: "힙합 / 알앤비 / 재즈 / 블루스", label: "힙합 / R&B / 재즈", desc: "소울풀한 붐뱁 랩 비트부터 로맨틱한 스무스 재즈까지", img: "/images/genres/hiphop_rnb_jazz.webp" },
  { id: "팝 / 포크 / 컨트리 / 전통악기", label: "팝 / 포크 / 컨트리", desc: "대중적인 어쿠스틱 팝과 목가적인 전통 포크 멜로디", img: "/images/genres/pop_folk_country.webp" },
  { id: "클래식 / 합주 / 월드뮤직", label: "클래식 / 월드뮤직", desc: "웅장한 시네마틱 오케스트라와 이국적인 세계 민속 음악", img: "/images/genres/classical_world.webp" },
  { id: "비디오 씬 / 영상 연출", label: "비디오 / 영상 연출", desc: "액션, 추격전, 예능 등 비디오 장면에 완벽히 녹아드는 BGM", img: "/images/genres/video_scene.webp" },
  { id: "감정 / 공간 / 이벤트", label: "감정 / 공간 / 이벤트", desc: "비 내리는 카페, 명상, 크리스마스 등 특별한 이벤트 무드", img: "/images/genres/emotion_space.webp" },
  { id: "악기 및 사운드 텍스처", label: "악기 & 텍스처", desc: "피아노 독주, 마칭밴드, 공간감을 채우는 딥한 드론 사운드", img: "/images/genres/instrument_texture.webp" },
  { id: "일렉트로닉 / 힙합 서브컬처", label: "일렉 / 힙합 서브컬처", desc: "신스웨이브, 베이퍼웨이브 등 몽환적 아날로그 감성 비트", img: "/images/genres/electro_hiphop_sub.webp" },
  { id: "팝 / 인디 / 뉴에이지", label: "팝 / 인디 / 뉴에이지", desc: "청량한 시티팝과 방 안에서 속삭이는 미니멀 침실 팝", img: "/images/genres/pop_indie_newage.webp" },
  { id: "아시아 / 월드 에스닉", label: "아시아 / 에스닉", desc: "K-Pop, J-Pop 및 아시아 정통 에스닉 악기 컬렉션", img: "/images/genres/asia_world.webp" },
  { id: "기능성 및 오디오 텍스처", label: "기능성 오디오", desc: "ASMR, 다크 앰비언트 등 깊은 집중과 치유를 돕는 사운드", img: "/images/genres/audio_texture.webp" }
];

export default function FreeAssetsLibraryPage() {
  const [assets, setAssets] = useState<FreeAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [likedAssetIds, setLikedAssetIds] = useState<Set<string>>(new Set());
  const [bookmarkedAssetIds, setBookmarkedAssetIds] = useState<Set<string>>(new Set());
  const [activeFilterTab, setActiveFilterTab] = useState<"ratio" | "generation" | "style" | "postType" | "category" | null>(null);
  const [selectedMediaType, setSelectedMediaType] = useState<string>("all");
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>("all");
  const [selectedGenerationType, setSelectedGenerationType] = useState<string>("all");
  const [selectedThemeCategory, setSelectedThemeCategory] = useState<string>("all");
  const [selectedStyle, setSelectedStyle] = useState<string>("all");
  const [selectedPostType, setSelectedPostType] = useState<string>("all");

  // Music catalog states
  const [musicCategory, setMusicCategory] = useState<string | null>(null);
  const [selectedMusicGenre, setSelectedMusicGenre] = useState<string | null>(null);
  const [selectedMusicMood, setSelectedMusicMood] = useState<string | null>(null);
  const [selectedGenreGroup, setSelectedGenreGroup] = useState<string>("전체 장르");
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  
  // Sort states & references
  const [activeSortTab, setActiveSortTab] = useState<"for_you" | "recent" | "random" | "hot" | "top_day" | "top_week" | "top_month" | "likes">("recent");
  const [isTopDropdownOpen, setIsTopDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement | null>(null);
  const filterDropdownRef = useRef<HTMLDivElement | null>(null);

  // 로컬 스토리지 필터 값 복원 (SSR Hydration Mismatch 방지용 마운트 시 실행)
  useEffect(() => {
    try {
      const savedMediaType = localStorage.getItem("free_assets_media_type");
      if (savedMediaType) setSelectedMediaType(savedMediaType);

      const savedAspectRatio = localStorage.getItem("free_assets_aspect_ratio");
      if (savedAspectRatio) setSelectedAspectRatio(savedAspectRatio);

      const savedGenerationType = localStorage.getItem("free_assets_generation_type");
      if (savedGenerationType) setSelectedGenerationType(savedGenerationType);

      const savedThemeCategory = localStorage.getItem("free_assets_theme_category");
      if (savedThemeCategory) setSelectedThemeCategory(savedThemeCategory);

      const savedStyle = localStorage.getItem("free_assets_style");
      if (savedStyle) setSelectedStyle(savedStyle);

      const savedPostType = localStorage.getItem("free_assets_post_type");
      if (savedPostType) setSelectedPostType(savedPostType);

      const savedSortTab = localStorage.getItem("free_assets_sort_tab");
      if (savedSortTab) setActiveSortTab(savedSortTab as any);

      const savedFilterTab = localStorage.getItem("free_assets_filter_tab");
      if (savedFilterTab) setActiveFilterTab(savedFilterTab as any);
    } catch (e) {
      console.error("Failed to restore filter settings from localStorage:", e);
    }
  }, []);

  // 필터 값 변경 시 로컬 스토리지 저장
  useEffect(() => {
    localStorage.setItem("free_assets_media_type", selectedMediaType);
  }, [selectedMediaType]);

  useEffect(() => {
    localStorage.setItem("free_assets_aspect_ratio", selectedAspectRatio);
  }, [selectedAspectRatio]);

  useEffect(() => {
    localStorage.setItem("free_assets_generation_type", selectedGenerationType);
  }, [selectedGenerationType]);

  useEffect(() => {
    localStorage.setItem("free_assets_theme_category", selectedThemeCategory);
  }, [selectedThemeCategory]);

  useEffect(() => {
    localStorage.setItem("free_assets_style", selectedStyle);
  }, [selectedStyle]);

  useEffect(() => {
    localStorage.setItem("free_assets_post_type", selectedPostType);
  }, [selectedPostType]);

  useEffect(() => {
    localStorage.setItem("free_assets_sort_tab", activeSortTab);
  }, [activeSortTab]);

  useEffect(() => {
    if (activeFilterTab) {
      localStorage.setItem("free_assets_filter_tab", activeFilterTab);
    } else {
      localStorage.removeItem("free_assets_filter_tab");
    }
  }, [activeFilterTab]);
  
  // Modal states
  const [selectedAsset, setSelectedAsset] = useState<FreeAsset | null>(null);

  const currentAssetIndex = assets.findIndex((item) => item.id === selectedAsset?.id);

  const handlePrevAsset = () => {
    if (currentAssetIndex > 0) {
      setSelectedAsset(assets[currentAssetIndex - 1]);
    }
  };

  const handleNextAsset = () => {
    if (currentAssetIndex < assets.length - 1) {
      setSelectedAsset(assets[currentAssetIndex + 1]);
    }
  };

  // 에셋 변경 시(이전/다음 이동 시) 기존 사운드 중복 겹침 방지
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingAudioId(null);
    }
  }, [selectedAsset?.id]);

  // 키보드 단축키 바인딩 (ESC 닫기, 좌우 방향키 이동)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedAsset) return;

      if (e.key === "Escape") {
        setSelectedAsset(null);
        return;
      }

      // 텍스트 필드 타이핑 중에는 방향키 이동 예외 처리
      const activeEl = document.activeElement;
      const isTyping =
        activeEl &&
        (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA");
      if (isTyping) return;

      if (e.key === "ArrowLeft" || e.key === "Left") {
        handlePrevAsset();
      } else if (e.key === "ArrowRight" || e.key === "Right") {
        handleNextAsset();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedAsset, currentAssetIndex, assets]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // Request Form states
  const [requestMediaType, setRequestMediaType] = useState("이미지");
  const [requestDescription, setRequestDescription] = useState("");
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);

  // Admin Comment states
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // User session states
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [membershipLevel, setMembershipLevel] = useState<string>("free");

  // Upload Form states
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [fileAspectRatios, setFileAspectRatios] = useState<Record<string, string>>({});
  const [fileResolutions, setFileResolutions] = useState<Record<string, { width: number; height: number }>>({});
  const [uploadProgressText, setUploadProgressText] = useState("");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadTags, setUploadTags] = useState("");
  const [uploadMediaType, setUploadMediaType] = useState("photo");
  const [uploadGenerationType, setUploadGenerationType] = useState<"ai" | "real">("real");
  const [uploadPrompt, setUploadPrompt] = useState("");
  const [uploadAiTool, setUploadAiTool] = useState("미드져니");
  const [uploadCamera, setUploadCamera] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Edit Form states
  const [editAssetId, setEditAssetId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editMediaType, setEditMediaType] = useState("photo");
  const [editGenerationType, setEditGenerationType] = useState<"ai" | "real">("real");
  const [editPrompt, setEditPrompt] = useState("");
  const [editAiTool, setEditAiTool] = useState("");
  const [editAspectRatio, setEditAspectRatio] = useState("");
  const [editCamera, setEditCamera] = useState("");
  const [updatingAsset, setUpdatingAsset] = useState(false);
  const [deletingAsset, setDeletingAsset] = useState(false);

  // Advanced download and share dropdown states
  const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState(false);
  const [downloadTargetFormat, setDownloadTargetFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');
  const [downloadingFormatText, setDownloadingFormatText] = useState("");
  const [promptCopied, setPromptCopied] = useState(false);
  const [isShareDropdownOpen, setIsShareDropdownOpen] = useState(false);
  const [isSpecsExpanded, setIsSpecsExpanded] = useState(true);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(3);
  const [isEditAccordionOpen, setIsEditAccordionOpen] = useState(false);

  // Audio Playback states
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const downloadDropdownRef = useRef<HTMLDivElement | null>(null);
  const shareDropdownRef = useRef<HTMLDivElement | null>(null);

  // Click outside listener for sort & filter dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTopDropdownOpen(false);
      }
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setActiveFilterTab(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch Assets List
  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/free-assets/list");
      const data = await response.json();
      if (response.ok) {
        setAssets(data.files || []);
      } else {
        console.error("Failed to load free assets:", data.error);
      }
    } catch (err) {
      console.error("Error fetching free assets:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Requests List
  const fetchRequests = useCallback(async () => {
    setRequestsLoading(true);
    try {
      const response = await fetch("/api/free-assets/requests");
      const data = await response.json();
      if (response.ok && data.success) {
        setRequests(data.data || []);
      } else {
        console.error("Failed to load requests:", data.error);
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setRequestsLoading(false);
    }
  }, []);

  // Submit Request
  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserEmail) {
      if (confirm("이미지 제작 요청은 로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니까?")) {
        window.location.href = "/login?redirect=/studio/library/free-assets";
      }
      return;
    }
    if (!requestDescription || requestDescription.trim().length < 5) {
      alert("구체적인 요청 내용을 5자 이상 작성해주세요.");
      return;
    }

    setSubmittingRequest(true);
    try {
      const response = await fetch("/api/free-assets/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaType: requestMediaType,
          description: requestDescription.trim(),
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        alert("이미지 제작 요청이 정상적으로 등록되었습니다.");
        setRequestDescription("");
        setIsRequestOpen(false);
        void fetchRequests();
      } else {
        alert(data.error || "요청 등록에 실패했습니다.");
      }
    } catch (err: any) {
      alert(`오류가 발생했습니다: ${err.message}`);
    } finally {
      setSubmittingRequest(false);
    }
  };

  // Submit Admin Comment
  const handleCommentSubmit = async (requestId: string) => {
    if (!commentText.trim()) {
      alert("답변 댓글 내용을 입력해주세요.");
      return;
    }

    setSubmittingComment(true);
    try {
      const response = await fetch("/api/free-assets/requests/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          comment: commentText.trim(),
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        alert("코멘트 작성 및 완료 처리가 완료되었습니다.");
        setCommentText("");
        setActiveCommentId(null);
        void fetchRequests();
      } else {
        alert(data.error || "코멘트 등록에 실패했습니다.");
      }
    } catch (err: any) {
      alert(`오류가 발생했습니다: ${err.message}`);
    } finally {
      setSubmittingComment(false);
    }
  };

  useEffect(() => {
    void fetchAssets();
    void fetchRequests();
  }, [fetchAssets, fetchRequests]);

  // Load User Session
  useEffect(() => {
    const supabase = createClient();
    
    const loadUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setCurrentUserEmail(session.user.email || null);
          
          // Fetch admin role and membership_level from profiles table
          const { data: profile } = await supabase
            .from("profiles")
            .select("role, membership_level")
            .eq("id", session.user.id)
            .maybeSingle();
          
          if (profile) {
            setMembershipLevel(profile.membership_level || "free");
          }
          
          let isUserAdmin = profile?.role === "ADMIN" || profile?.role === "STAFF";

          // If not admin by profile, check admin_whitelist table
          if (!isUserAdmin && session.user.email) {
            const { data: whitelist } = await supabase
              .from("admin_whitelist")
              .select("email")
              .eq("email", session.user.email)
              .maybeSingle();
            if (whitelist) {
              isUserAdmin = true;
            }
          }
          
          setIsAdmin(isUserAdmin);
        }
      } catch (err) {
        console.error("Failed to load user session:", err);
      }
    };
    
    void loadUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
      if (session?.user) {
        setCurrentUserEmail(session.user.email || null);
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role, membership_level")
            .eq("id", session.user.id)
            .maybeSingle();
          
          if (profile) {
            setMembershipLevel(profile.membership_level || "free");
          }
          
          let isUserAdmin = profile?.role === "ADMIN" || profile?.role === "STAFF";

          if (!isUserAdmin && session.user.email) {
            const { data: whitelist } = await supabase
              .from("admin_whitelist")
              .select("email")
              .eq("email", session.user.email)
              .maybeSingle();
            if (whitelist) {
              isUserAdmin = true;
            }
          }

          setIsAdmin(isUserAdmin);
        } catch {
          setIsAdmin(false);
        }
      } else {
        setCurrentUserEmail(null);
        setIsAdmin(false);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Reset dropdown state when current selected asset changes or closes
  useEffect(() => {
    setIsDownloadDropdownOpen(false);
    setIsShareDropdownOpen(false);
    setIsEditAccordionOpen(false);
  }, [selectedAsset?.id]);

  // Handle outside click for both dropdowns
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        isDownloadDropdownOpen &&
        downloadDropdownRef.current &&
        !downloadDropdownRef.current.contains(target)
      ) {
        setIsDownloadDropdownOpen(false);
      }
      if (
        isShareDropdownOpen &&
        shareDropdownRef.current &&
        !shareDropdownRef.current.contains(target)
      ) {
        setIsShareDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isDownloadDropdownOpen, isShareDropdownOpen]);

  const handleOpenUpload = () => {
    if (!currentUserEmail) {
      if (confirm("나눔 에셋 업로드는 로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니까?")) {
        window.location.href = "/login?redirect=/studio/library/free-assets";
      }
      return;
    }
    setIsUploadOpen(true);
  };

  const handleDeleteAsset = async (fileId: string) => {
    if (!confirm("이 에셋을 영구 삭제하시겠습니까? 클라우드 저장소에서도 완전히 삭제되며 복구할 수 없습니다.")) return;
    
    setDeletingAsset(true);
    try {
      const response = await fetch("/api/free-assets/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId }),
      });
      
      if (response.ok) {
        alert("에셋이 성공적으로 삭제되었습니다.");
        setSelectedAsset(null);
        void fetchAssets();
      } else {
        const data = await response.json();
        alert(`삭제 실패: ${data.error || "알 수 없는 오류"}`);
      }
    } catch (err: any) {
      alert(`오류 발생: ${err.message}`);
    } finally {
      setDeletingAsset(false);
    }
  };

  const openEditModal = (asset: FreeAsset) => {
    setEditAssetId(asset.id);
    setEditTitle(asset.title);
    setEditTags(asset.tags.join(", "));
    setEditMediaType(asset.mediaType);
    setEditGenerationType((asset.generationType as "ai" | "real") || "real");
    setEditPrompt(asset.prompt || "");
    setEditAiTool(asset.aiTool || "미드져니");
    setEditAspectRatio(asset.aspectRatio || "");
    setEditCamera(asset.camera || "촬영 정보 없음");
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAssetId) return;
    
    setUpdatingAsset(true);
    
    const tagsArray = editTags
      ? editTags.split(",").map(t => t.trim()).filter(t => t.length > 0)
      : [];
      
    try {
      const response = await fetch("/api/free-assets/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileId: editAssetId,
          title: editTitle,
          tags: tagsArray,
          mediaType: editMediaType,
          generationType: editGenerationType,
          aspectRatio: editAspectRatio,
          camera: editCamera,
          prompt: editGenerationType === "ai" ? editPrompt : "",
          aiTool: editGenerationType === "ai" ? editAiTool : "",
        }),
      });
      
      if (response.ok) {
        alert("에셋 정보가 수정되었습니다.");
        setIsEditOpen(false);
        
        if (selectedAsset && selectedAsset.id === editAssetId) {
          setSelectedAsset({
            ...selectedAsset,
            title: editTitle,
            tags: tagsArray,
            mediaType: editMediaType,
            generationType: editGenerationType,
            aspectRatio: editAspectRatio,
            camera: editCamera,
            prompt: editGenerationType === "ai" ? editPrompt : "",
            aiTool: editGenerationType === "ai" ? editAiTool : "",
          });
        }
        
        void fetchAssets();
      } else {
        const data = await response.json();
        alert(`수정 실패: ${data.error || "알 수 없는 오류"}`);
      }
    } catch (err: any) {
      alert(`오류 발생: ${err.message}`);
    } finally {
      setUpdatingAsset(false);
    }
  };

  // Audio lifecycle handler
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.onended = () => {
        setPlayingAudioId(null);
      };
    }

    const audio = audioRef.current;

    return () => {
      audio.pause();
      setPlayingAudioId(null);
    };
  }, []);

  const toggleAudio = (asset: FreeAsset, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (playingAudioId === asset.id) {
      audioRef.current.pause();
      setPlayingAudioId(null);
    } else {
      const isGoogleUrl = asset.url.includes("googleusercontent.com") || asset.url.includes("drive.google.com");
      audioRef.current.src = isGoogleUrl ? `/api/free-assets/proxy?url=${encodeURIComponent(asset.url)}` : asset.url;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
      setPlayingAudioId(asset.id);
      
      // Increment view count when previewing audio
      void registerAction(asset.id, "views");
    }
  };

  // Register View or Download Action
  const registerAction = async (fileId: string, action: "downloads" | "views") => {
    try {
      const response = await fetch("/api/free-assets/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId, action }),
      });
      if (response.ok) {
        const data = await response.json();
        // Update local stats
        setAssets((prev) =>
          prev.map((item) =>
            item.id === fileId
              ? {
                  ...item,
                  downloads: data.metadata.downloads,
                  views: data.metadata.views,
                }
              : item
          )
        );
        if (selectedAsset && selectedAsset.id === fileId) {
          setSelectedAsset((prev) =>
            prev
              ? {
                  ...prev,
                  downloads: data.metadata.downloads,
                  views: data.metadata.views,
                }
              : null
          );
        }
      }
    } catch (err) {
      console.error("Failed to register asset action:", err);
    }
  };

  // Asset click handler (Detail Modal Open)
  const openDetailModal = (asset: FreeAsset) => {
    setSelectedAsset(asset);
    void registerAction(asset.id, "views");
  };

  const checkDownloadPermission = (asset: FreeAsset): boolean => {
    const isBusinessOrAbove = 
      membershipLevel === "business" || 
      membershipLevel === "enterprise" || 
      membershipLevel === "admin" || 
      isAdmin;

    if (asset.isBusinessOnly && !isBusinessOrAbove) {
      setIsUpgradeModalOpen(true);
      return false;
    }
    return true;
  };

  // File Download trigger
  const triggerDownload = (asset: FreeAsset) => {
    if (!checkDownloadPermission(asset)) return;
    void registerAction(asset.id, "downloads");
    
    // Create temporary link to trigger native browser download
    const link = document.createElement("a");
    const isGoogleUrl = asset.url.includes("googleusercontent.com") || asset.url.includes("drive.google.com");
    link.href = isGoogleUrl 
      ? `/api/free-assets/proxy?url=${encodeURIComponent(asset.url)}&download=true&filename=${encodeURIComponent(asset.name || "download")}` 
      : asset.url;
    link.download = asset.name;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Aspect Ratio Detectors
  const getClosestAspectRatio = (width: number, height: number): string => {
    const ratio = width / height;
    const targets = [
      { label: "16:9", val: 16 / 9 },
      { label: "9:16", val: 9 / 16 },
      { label: "4:3", val: 4 / 3 },
      { label: "3:4", val: 3 / 4 },
      { label: "1:1", val: 1 / 1 },
    ];
    
    let closest = targets[0];
    let minDiff = Math.abs(ratio - closest.val);
    
    for (let i = 1; i < targets.length; i++) {
      const diff = Math.abs(ratio - targets[i].val);
      if (diff < minDiff) {
        minDiff = diff;
        closest = targets[i];
      }
    }
    
    if (minDiff > 0.15) {
      return "기타";
    }
    
    return closest.label;
  };

  interface FileDimension {
    width: number;
    height: number;
    aspectRatio: string;
  }

  const detectFileDimension = (file: File): Promise<FileDimension> => {
    return new Promise((resolve) => {
      if (file.type.startsWith("image/")) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          URL.revokeObjectURL(img.src);
          const ratio = getClosestAspectRatio(img.width, img.height);
          resolve({ width: img.width, height: img.height, aspectRatio: ratio });
        };
        img.onerror = () => {
          resolve({ width: 0, height: 0, aspectRatio: "기타" });
        };
      } else if (file.type.startsWith("video/")) {
        const video = document.createElement("video");
        video.src = URL.createObjectURL(file);
        video.onloadedmetadata = () => {
          URL.revokeObjectURL(video.src);
          const ratio = getClosestAspectRatio(video.videoWidth, video.videoHeight);
          resolve({ width: video.videoWidth, height: video.videoHeight, aspectRatio: ratio });
        };
        video.onerror = () => {
          resolve({ width: 0, height: 0, aspectRatio: "기타" });
        };
      } else {
        resolve({ width: 0, height: 0, aspectRatio: "" });
      }
    });
  };

  const compressImageFile = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith("image/") || file.type === "image/gif") {
        resolve(file);
        return;
      }

      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        
        let width = img.width;
        let height = img.height;
        const maxLen = 2560;

        if (width > maxLen || height > maxLen) {
          if (width > height) {
            height = Math.round((height * maxLen) / width);
            width = maxLen;
          } else {
            width = Math.round((width * maxLen) / height);
            height = maxLen;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            
            const originalName = file.name.replace(/\.[^/.]+$/, "");
            const newFileName = `${originalName}.jpg`;
            
            const compressedFile = new File([blob], newFileName, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            
            resolve(compressedFile);
          },
          "image/jpeg",
          0.85
        );
      };
      img.onerror = () => {
        resolve(file);
      };
    });
  };

  const downloadResizedImage = async (imageUrl: string, fileName: string, targetWidth: number, targetHeight: number, targetFormat: 'jpeg' | 'png' | 'webp') => {
    if (selectedAsset && !checkDownloadPermission(selectedAsset)) return;
    setDownloadingFormatText("이미지 변환 중...");
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      // Smart CORS Proxy: To fully bypass canvas tainting, load through proxy
      const proxiedUrl = `/api/free-assets/proxy?url=${encodeURIComponent(imageUrl)}`;
      
      const imageLoadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(new Error("이미지 로드에 실패했습니다."));
        img.src = proxiedUrl;
      });
      
      const loadedImg = await imageLoadPromise;
      
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context creation failed");
      
      ctx.drawImage(loadedImg, 0, 0, targetWidth, targetHeight);
      
      let mimeType = "image/jpeg";
      let fileExt = "jpg";
      if (targetFormat === "png") {
        mimeType = "image/png";
        fileExt = "png";
      } else if (targetFormat === "webp") {
        mimeType = "image/webp";
        fileExt = "webp";
      }
      
      canvas.toBlob((blob) => {
        if (!blob) {
          alert("이미지 변환 중 오류가 발생했습니다.");
          setDownloadingFormatText("");
          return;
        }
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const baseName = fileName.replace(/\.[^/.]+$/, "");
        link.download = `${baseName}_${targetWidth}x${targetHeight}.${fileExt}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setDownloadingFormatText("");
      }, mimeType, 0.9);
      
    } catch (err: any) {
      console.error("Canvas conversion failed:", err);
      alert("다운로드 중 변환 오류가 발생했습니다. 원본 파일을 직접 다운로드합니다.");
      setDownloadingFormatText("");
      // Fallback: download original
      triggerDownload(selectedAsset!);
    }
  };

  // Drag and Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processNewFiles = async (newFiles: File[]) => {
    if (newFiles.length === 0) return;

    const mergedFiles = [...uploadFiles, ...newFiles];
    setUploadFiles(mergedFiles);

    if (mergedFiles.length >= 1 && !uploadTitle) {
      setUploadTitle(mergedFiles[0].name.replace(/\.[^/.]+$/, ""));
    }

    autoDetectMediaType(mergedFiles[0]);

    const dimensionPromises = newFiles.map(async (file) => {
      const dim = await detectFileDimension(file);
      return { name: file.name, ...dim };
    });

    const results = await Promise.all(dimensionPromises);
    
    setFileAspectRatios((prev) => {
      const updated = { ...prev };
      results.forEach(({ name, aspectRatio }) => {
        if (aspectRatio) {
          updated[name] = aspectRatio;
        }
      });
      return updated;
    });

    setFileResolutions((prev) => {
      const updated = { ...prev };
      results.forEach(({ name, width, height }) => {
        updated[name] = { width, height };
      });
      return updated;
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      void processNewFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      void processNewFiles(Array.from(e.target.files));
    }
  };

  const removeUploadFile = (indexToRemove: number) => {
    setUploadFiles((prev) => {
      const updated = prev.filter((_, idx) => idx !== indexToRemove);
      if (updated.length === 0) {
        setUploadTitle("");
      } else if (!uploadTitle) {
        // 이미 제목이 비어있다면 남은 첫 번째 파일의 이름을 디폴트로 채워줌
        setUploadTitle(updated[0].name.replace(/\.[^/.]+$/, ""));
      }
      return updated;
    });
  };

  const autoDetectMediaType = (file: File) => {
    const type = file.type;
    if (type.startsWith("image/")) {
      if (type.includes("gif")) {
        setUploadMediaType("gif");
      } else {
        setUploadMediaType("photo");
      }
    } else if (type.startsWith("video/")) {
      setUploadMediaType("video");
    } else if (type.startsWith("audio/")) {
      setUploadMediaType("music");
    }
  };

  const getMediaTypeForFile = (file: File, selectedGlobalType: string) => {
    const type = file.type;
    if (type.startsWith("image/")) {
      if (type.includes("gif")) return "gif";
      if (selectedGlobalType === "illustration") return "illustration";
      return "photo";
    } else if (type.startsWith("video/")) {
      return "video";
    } else if (type.startsWith("audio/")) {
      return "music";
    }
    return selectedGlobalType;
  };

  // Submit Asset Upload
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadFiles.length === 0) return alert("파일을 선택해 주세요.");

    setUploading(true);
    let successCount = 0;
    const failedFiles: string[] = [];

    for (let i = 0; i < uploadFiles.length; i++) {
      let file = uploadFiles[i];
      let width = 0;
      let height = 0;
      let aspect = "";

      // 이미지이고 GIF가 아닌 경우 자동 압축 및 리사이즈 처리
      if (file.type.startsWith("image/") && file.type !== "image/gif") {
        setUploadProgressText(`${i + 1} / ${uploadFiles.length}개 이미지 최적화 가공 중...`);
        try {
          file = await compressImageFile(file);
        } catch (compressErr) {
          console.error("Image compression failed, fallback to original:", compressErr);
        }
      }

      // 가공된 (또는 원본) 파일 기준 해상도 분석
      try {
        const dim = await detectFileDimension(file);
        width = dim.width;
        height = dim.height;
        aspect = dim.aspectRatio;
      } catch (dimErr) {
        console.error("Dimension detection failed:", dimErr);
      }

      setUploadProgressText(`${i + 1} / ${uploadFiles.length}개 파일 업로드 중...`);

      const formData = new FormData();
      formData.append("file", file);
      
      const fileTitle = uploadTitle.trim() !== ""
        ? uploadTitle.trim()
        : file.name.replace(/\.[^/.]+$/, "");
      
      formData.append("title", fileTitle);
      formData.append("tags", uploadTags);
      formData.append("mediaType", getMediaTypeForFile(file, uploadMediaType));
      formData.append("generationType", uploadGenerationType);

      if (aspect) {
        formData.append("aspectRatio", aspect);
      }
      if (width > 0 && height > 0) {
        formData.append("width", width.toString());
        formData.append("height", height.toString());
      }
      formData.append("camera", uploadCamera || "촬영 정보 없음");
      if (uploadGenerationType === "ai") {
        formData.append("prompt", uploadPrompt);
        formData.append("aiTool", uploadAiTool);
      }

      try {
        const response = await fetch("/api/free-assets/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          successCount++;
        } else {
          const result = await response.json();
          failedFiles.push(`${file.name} (${result.error || "실패"})`);
        }
      } catch (err: any) {
        failedFiles.push(`${file.name} (오류: ${err.message || "알 수 없음"})`);
      }
    }

    setUploading(false);
    setUploadProgressText("");

    if (failedFiles.length === 0) {
      alert("모든 파일의 업로드가 완료되었습니다!");
      setIsUploadOpen(false);
      setUploadFiles([]);
      setFileAspectRatios({});
      setFileResolutions({});
      setUploadTitle("");
      setUploadTags("");
      setUploadMediaType("photo");
      setUploadGenerationType("real");
      setUploadPrompt("");
      setUploadAiTool("미드져니");
      setUploadCamera("");
      void fetchAssets();
    } else {
      alert(
        `업로드 완료: 성공 ${successCount}개 / 실패 ${failedFiles.length}개\n\n[실패 목록]\n` +
        failedFiles.join("\n")
      );
      const remainingFiles = uploadFiles.filter(f => failedFiles.some(ff => ff.startsWith(f.name)));
      setUploadFiles(remainingFiles);
      void fetchAssets();
    }
  };

  // Filter Assets
  const filteredAssets = assets.filter((asset) => {
    if (selectedMediaType === "premium-theme") {
      if (!asset.isOfficialThemeAsset) return false;
      if (selectedThemeCategory !== "all" && asset.themeCategory !== selectedThemeCategory) {
        return false;
      }
    } else {
      if (asset.isOfficialThemeAsset) return false;
      const matchesType =
        selectedMediaType === "all"
          ? asset.mediaType !== "music"
          : (selectedMediaType === "photo"
            ? (asset.mediaType === "photo" || asset.mediaType === "image")
            : asset.mediaType === selectedMediaType);
      if (!matchesType) return false;
    }

    // 한/영 연관 검색어 매핑 정의
    const query = searchQuery.trim().toLowerCase();
    const relatedKeywords: string[] = [query];
    
    const tagTranslationMap: Record<string, string[]> = {
      "바다": ["beach", "sea", "ocean"],
      "beach": ["바다", "해변"],
      "sea": ["바다"],
      "ocean": ["바다", "대양"],
      "자연": ["nature"],
      "nature": ["자연"],
      "배경": ["background", "wallpaper"],
      "background": ["배경"],
      "하늘": ["sky"],
      "sky": ["하늘"],
      "여행": ["travel", "trip"],
      "travel": ["여행"],
      "힐링": ["healing", "relax"],
      "healing": ["힐링"],
      "음악": ["music", "sound", "audio"],
      "music": ["음악"],
      "감성": ["emotional", "mood"],
      "emotional": ["감성"],
      "우주": ["space", "universe", "cosmos"],
      "space": ["우주"],
      "비즈니스": ["business", "office"],
      "business": ["비즈니스"]
    };

    // 현재 검색어에 매핑되는 영문/한문 키워드가 있으면 검색 대상에 포함시킴
    Object.keys(tagTranslationMap).forEach((key) => {
      if (key.toLowerCase() === query) {
        tagTranslationMap[key].forEach((val) => {
          if (!relatedKeywords.includes(val.toLowerCase())) {
            relatedKeywords.push(val.toLowerCase());
          }
        });
      }
    });

    const matchesQuery =
      query === "" ||
      relatedKeywords.some((keyword) => 
        asset.title.toLowerCase().includes(keyword) ||
        asset.tags.some((t) => t.toLowerCase().includes(keyword)) ||
        asset.uploader.toLowerCase().includes(keyword)
      );

    const matchesAspectRatio =
      selectedAspectRatio === "all" || asset.aspectRatio === selectedAspectRatio;

    const matchesGenerationType =
      selectedGenerationType === "all" || asset.generationType === selectedGenerationType;

    const matchesStyle = (() => {
      if (selectedStyle === "all") return true;
      
      const styleKeywordsMap: Record<string, string[]> = {
        photorealistic: ["photorealistic", "실사", "촬영", "photo", "cinematic", "photography", "photograph", "camera", "시네마틱"],
        illustration: ["illustration", "일러스트", "watercolor illustration"],
        vector: ["vector", "벡터", "icon"],
        "3d_render": ["3d", "render", "isometric", "blender", "렌더"],
        anime: ["anime", "애니메이션", "scenery", "shinkai"],
        pixel_art: ["pixel", "픽셀"],
        watercolor: ["watercolor", "수채화"],
        line_art: ["line", "라인"],
        seamless_pattern: ["seamless", "pattern", "패턴"],
        retro_pop_art: ["retro", "pop", "vintage", "팝아트"]
      };

      const keywords = styleKeywordsMap[selectedStyle] || [];
      return keywords.some(kw => 
        asset.title.toLowerCase().includes(kw) ||
        asset.tags.some(t => t.toLowerCase().includes(kw))
      );
    })();

    const matchesPostType = (() => {
      if (selectedPostType === "all") return true;
      
      const postTypeKeywordsMap: Record<string, string[]> = {
        general: ["일반 정보성", "일반", "정보성", "general", "동기부여", "지식 정보"],
        subsidies: ["생활 정책", "정부 지원금", "지원금", "정책", "subsidies"],
        health: ["건강 정보", "영양제 분석", "건강", "영양제", "health", "fitness"],
        finance_loan: ["보험", "대출", "카드 정보", "카드", "finance_loan"],
        real_estate: ["부동산 정보", "부동산", "real_estate"],
        finance_investment: ["금융 및 재테크", "금융", "재테크", "wealth_money", "finance", "investment"],
        stock_analysis: ["주식/재테크 분석", "주식", "재테크 분석", "stock", "analysis"],
        corporate_info: ["기업 정보", "기업", "주식 정보", "corporate"],
        playlist_asmr: ["플레이리스트", "백색소음", "ASMR", "playlist", "rain", "cozy", "study", "loop"],
        music_video: ["뮤직 동영상", "뮤직비디오", "music video"],
        news_report: ["뉴스 리포트", "뉴스", "report"]
      };

      const keywords = postTypeKeywordsMap[selectedPostType] || [];
      return keywords.some(kw => 
        asset.title.toLowerCase().includes(kw.toLowerCase()) ||
        asset.tags.some(t => t.toLowerCase().includes(kw.toLowerCase()))
      );
    })();
    const matchesThemeCategory = (() => {
      if (selectedThemeCategory === "all") return true;
      
      const themeCategoryKeywordsMap: Record<string, string[]> = {
        art: ["art", "예술", "창작", "추상", "graphic", "illustration", "design"],
        tech: ["tech", "기술", "디지털", "hologram", "cyber", "digital"],
        food: ["food", "미식", "푸드", "음식", "요리", "burger", "beer", "fries"],
        nature: ["nature", "자연", "풍경", "forest", "mountain", "river", "train"],
        animal: ["animal", "동물", "야생", "lion", "cat", "dog"],
        texture: ["texture", "텍스처", "background", "배경"],
        people: ["people", "인물", "라이프", "person", "man", "woman"],
        architecture: ["architecture", "건축", "랜드마크", "building"],
        fashion: ["fashion", "패션", "뷰티", "beauty"],
        business: ["business", "비즈니스", "금융", "finance"],
        education: ["education", "교육", "지식", "book", "school"],
        health: ["health", "의료", "헬스케어", "medical", "hospital"]
      };

      const keywords = themeCategoryKeywordsMap[selectedThemeCategory] || [];
      return keywords.some(kw => 
        asset.title.toLowerCase().includes(kw.toLowerCase()) ||
        asset.tags.some(t => t.toLowerCase().includes(kw.toLowerCase()))
      );
    })();
    return matchesQuery && matchesAspectRatio && matchesGenerationType && matchesStyle && matchesPostType && matchesThemeCategory;
  });

  const sortedAssets = useMemo(() => {
    const list = [...filteredAssets];

    if (activeSortTab === "recent") {
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    if (activeSortTab === "random") {
      // Deterministic hash based shuffle so it doesn't reshuffle on every state change render,
      // but displays in a randomized order.
      const hashString = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          hash = (hash << 5) - hash + str.charCodeAt(i);
          hash |= 0;
        }
        return hash;
      };
      return list.sort((a, b) => hashString(a.id) - hashString(b.id));
    }
    
    if (activeSortTab === "hot") {
      return list.sort((a, b) => ((b.views || 0) + (b.downloads || 0)) - ((a.views || 0) + (a.downloads || 0)));
    }
    
    if (activeSortTab === "top_day") {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return list
        .filter(a => new Date(a.createdAt) >= oneDayAgo)
        .sort((a, b) => ((b.views || 0) + (b.downloads || 0)) - ((a.views || 0) + (a.downloads || 0)));
    }
    
    if (activeSortTab === "top_week") {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return list
        .filter(a => new Date(a.createdAt) >= oneWeekAgo)
        .sort((a, b) => ((b.views || 0) + (b.downloads || 0)) - ((a.views || 0) + (a.downloads || 0)));
    }
    
    if (activeSortTab === "top_month") {
      const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return list
        .filter(a => new Date(a.createdAt) >= oneMonthAgo)
        .sort((a, b) => ((b.views || 0) + (b.downloads || 0)) - ((a.views || 0) + (a.downloads || 0)));
    }
    
    if (activeSortTab === "likes") {
      return list.filter(a => likedAssetIds.has(a.id));
    }
    
    if (activeSortTab === "for_you") {
      return list.sort((a, b) => (b.views || 0) - (a.views || 0));
    }

    return list;
  }, [filteredAssets, activeSortTab, likedAssetIds]);

  const renderAssetsContent = () => {
    if (loading) {
      return (
        <div className="flex h-64 flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-blue-500" size={32} />
          <p className="text-xs font-bold text-zinc-500">라이브러리로부터 무료 에셋 로딩 중...</p>
        </div>
      );
    }

    if (selectedMediaType === "music") {
      if (!musicCategory) {
        // === 1단계: 음악 장르 및 무드 카테고리 선택 카드 뷰 ===
        return (
          <div className="w-full space-y-12 py-6">
            {/* 장르 컬렉션 */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white mb-2 flex items-center gap-2">
                  <Music size={18} className="text-blue-400" />
                  장르 컬렉션 검색
                </h2>
                <p className="text-xs text-zinc-500 mb-4 text-left">다양한 콘텐츠 제작을 위한 다양한 장르의 로열티 프리 음악</p>
              </div>

              {/* 대분류 가로형 스크롤 탭 버튼 */}
              <div className="flex w-full items-center gap-2 overflow-x-auto pb-3 border-b border-zinc-800 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                {[
                  "전체 장르",
                  "록 / 서브컬처 스타일",
                  "라틴 / 댄스 그루브",
                  "전자 음악 (Electronic)",
                  "힙합 / 알앤비 / 재즈 / 블루스",
                  "팝 / 포크 / 컨트리 / 전통악기",
                  "클래식 / 합주 / 월드뮤직",
                  "비디오 씬 / 영상 연출",
                  "감정 / 공간 / 이벤트",
                  "악기 및 사운드 텍스처",
                  "일렉트로닉 / 힙합 서브컬처",
                  "팝 / 인디 / 뉴에이지",
                  "아시아 / 월드 에스닉",
                  "기능성 및 오디오 텍스처"
                ].map((group) => {
                  const isActive = selectedGenreGroup === group;
                  return (
                    <button
                      key={group}
                      onClick={() => setSelectedGenreGroup(group)}
                      className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition-all cursor-pointer ${
                        isActive
                          ? "bg-blue-500 text-black shadow-lg shadow-blue-500/20"
                          : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      }`}
                    >
                      {group}
                    </button>
                  );
                })}
              </div>

              {/* 선택된 대분류의 세부 서브 장르 또는 대분류 카드 그리드 */}
              {selectedGenreGroup === "전체 장르" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {GENRE_GROUPS_INFO.map((group) => (
                    <div
                      key={group.id}
                      onClick={() => setSelectedGenreGroup(group.id)}
                      className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-850 bg-[#090c13] transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer"
                    >
                      <img
                        src={group.img}
                        alt={group.label}
                        className="h-full w-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-100 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-left">
                        <span className="inline-block text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1.5 bg-blue-500/10 px-2 py-0.5 rounded">
                          GENRE GROUP
                        </span>
                        <h3 className="text-sm font-black text-white tracking-tight leading-tight">{group.label}</h3>
                        <p className="mt-1 text-[10px] font-bold text-zinc-400 leading-normal line-clamp-2">{group.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedGenreGroup("전체 장르")}
                      className="flex items-center gap-1.5 text-xs font-black text-zinc-400 hover:text-white transition cursor-pointer"
                    >
                      <span>← 전체 장르 목록</span>
                    </button>
                    <span className="text-xs font-bold text-zinc-500">
                      {selectedGenreGroup} ({GENRE_COLLECTIONS.filter(g => g.genreGroup === selectedGenreGroup).length}개 장르)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                    {GENRE_COLLECTIONS.filter((g) => g.genreGroup === selectedGenreGroup).map((g) => {
                      const hasError = imgErrors[g.id];
                      const imgSrc = hasError
                        ? `https://picsum.photos/seed/${encodeURIComponent(g.id)}/300/300`
                        : `/images/genres/${encodeURIComponent(g.id.replace(/[^a-zA-Z0-9]/g, "_"))}.webp`;

                      return (
                        <div
                          key={g.id}
                          onClick={() => {
                            setMusicCategory(g.id);
                            setSelectedMusicGenre(g.id);
                            setSelectedMusicMood(null);
                          }}
                          className="group relative aspect-square overflow-hidden rounded-xl border border-zinc-850 bg-[#090c13] transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer"
                        >
                          <img
                            src={imgSrc}
                            alt={g.label}
                            onError={() => {
                              setImgErrors((prev) => ({ ...prev, [g.id]: true }));
                            }}
                            className="h-full w-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                          <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left">
                            <span className="inline-block text-[8px] font-black text-blue-400 uppercase tracking-wide mb-0.5 bg-blue-500/10 px-1.5 py-0.5 rounded">
                              {g.id}
                            </span>
                            <h3 className="text-[11px] font-black text-white tracking-tight leading-tight truncate">{g.label}</h3>
                            <p className="mt-0.5 text-[9px] font-bold text-zinc-400 leading-normal line-clamp-1 group-hover:line-clamp-none transition-all duration-200">{g.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 무드 컬렉션 */}
            <div>
              <h2 className="text-xl font-black text-white mb-2 flex items-center gap-2">
                <Sparkles size={18} className="text-emerald-400" />
                무드 컬렉션 검색
              </h2>
              <p className="text-xs text-zinc-500 mb-6 text-left">감정을 불어넣고 비디오를 돋보이게 하는 음악 무드</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {[
                  { id: "경쾌한", label: "경쾌한 (Upbeat)", desc: "vlog나 화사한 브랜딩에 어울리는 밝은 어쿠스틱", img: "/images/genres/Upbeat.webp" },
                  { id: "공포", label: "공포 (Horror)", desc: "스릴러와 공포 영화의 극단적인 탈출 씬 연출", img: "/images/genres/Horror.webp" },
                  { id: "귀여운", label: "귀여운 (Cute)", desc: "통통 튀는 어린이, 반려동물 및 장난스러운 상황", img: "/images/genres/Kids.webp" },
                  { id: "그루브", label: "그루브 (Groovy)", desc: "슬랩 베이스가 주도하는 세련된 펑크 그루브", img: "/images/genres/Funk.webp" },
                  { id: "긴장감", label: "긴장감 (Suspense)", desc: "현악 스타카토로 조여오는 범죄 추리물 텐션", img: "/images/genres/Tension.webp" },
                  { id: "단순한", label: "단순한 (Minimal)", desc: "화면을 방해하지 않는 담백한 비트와 멜로디", img: "/images/genres/Abstract.webp" },
                  { id: "드라마틱", label: "드라마틱 (Dramatic)", desc: "현악과 브라스로 그리는 서사와 장엄한 어드벤처", img: "/images/genres/Cinematic.webp" },
                  { id: "로맨틱", label: "로맨틱 (Romantic)", desc: "클래식 기타와 바이올린 앙상블의 낭만적 감성", img: "/images/genres/Wedding.webp" },
                  { id: "몽환적인", label: "몽환적인 (Dreamy)", desc: "공상과학, 신비로운 판타지 세계 묘사", img: "/images/genres/Fantasy.webp" },
                  { id: "밝은", label: "밝은 (Bright)", desc: "화사한 휴가, 커머셜 광고풍 긍정적 사운드", img: "/images/genres/Acoustic_Pop.webp" },
                  { id: "비장한", label: "비장한 (Solemn)", desc: "French horn과 타이코 드럼의 전장의 결의", img: "/images/genres/Heroic.webp" },
                  { id: "슬픈", label: "슬픈 (Sad)", desc: "지독한 슬픔, 상실과 이별 장면에 부합하는 곡", img: "/images/genres/Melodramatic.webp" },
                  { id: "신나는", label: "신나는 (Exciting)", desc: "Future bass와 레트로 80년대 밤거리 주행", img: "/images/genres/Dance.webp" },
                  { id: "신비로운", label: "신비로운 (Mysterious)", desc: "이국적인 민속 플루트 선율과 신비한 숲 속", img: "/images/genres/Supernatural.webp" },
                  { id: "아련한", label: "아련한 (Nostalgic)", desc: "나른한 Rhodes 건반과 아련한 회상 브이로그", img: "/images/genres/Nostalgia.webp" },
                  { id: "웅장한", label: "웅장한 (Epic)", desc: "대륙의 건국 서사, 웅장한 비즈니스 웅비", img: "/images/genres/Epic_Classical.webp" },
                  { id: "잔잔한", label: "잔잔한 (Calm)", desc: "나일론 기타와 보사노바 리듬의 따스한 오후", img: "/images/genres/Acoustic_Texture.webp" },
                  { id: "재밌는", label: "재밌는 (Fun)", desc: "만화 영화 속 재치 넘치는 비밀 미션 묘사", img: "/images/genres/Cartoons.webp" },
                  { id: "청량한", label: "청량한 (Refreshing)", desc: "맑은 봄비와 푸른 하늘 정취의 크리스탈 벨", img: "/images/genres/Happy_Childrens_Tunes.webp" },
                  { id: "코믹한", label: "코믹한 (Comical)", desc: "뒤뚱거리는 예능 NG 자막 모음 컷 특화", img: "/images/genres/Comical.webp" },
                  { id: "평온한", label: "평온한 (Peaceful)", desc: "정갈한 피아노와 스트링의 아침 명상/요가", img: "/images/genres/Meditation_Spiritual.webp" },
                  { id: "행복한", label: "행복한 (Happy)", desc: "우쿨렐레 피킹과 박수 소리의 단란한 소풍", img: "/images/genres/Happy_Childrens_Tunes.webp" },
                  { id: "희망찬", label: "희망찬 (Hopeful)", desc: "성공적인 도전을 그리는 피아노 빌드업", img: "/images/genres/Corporate.webp" },
                  { id: "무서운", label: "무서운 (Scary)", desc: "불협화음 긁는 소리로 유령의 집, 미스터리 위협", img: "/images/genres/Creepy.webp" }
                ].map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      setMusicCategory(m.id);
                      setSelectedMusicMood(m.id);
                      setSelectedMusicGenre(null);
                    }}
                    className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-850 bg-[#090c13] transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 cursor-pointer"
                  >
                    <img
                      src={m.img}
                      alt={m.label}
                      className="h-full w-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-left">
                      <span className="inline-block text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-1 bg-emerald-500/10 px-2 py-0.5 rounded">
                        MOOD
                      </span>
                      <h3 className="text-xs font-black text-white tracking-tight leading-tight">{m.label}</h3>
                      <p className="mt-0.5 text-[9px] font-bold text-zinc-400 leading-snug line-clamp-1">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      // === 2단계: 카테고리별 음악 트랙 플레이어 리스트 뷰 ===
      const filteredTracks = sortedAssets.filter(
        (asset) =>
          asset.mediaType === "music" &&
          (asset.tags.map(t => t.toLowerCase()).includes(musicCategory.toLowerCase()) ||
            asset.title.toLowerCase().includes(musicCategory.toLowerCase()) ||
            (asset.themeCategory && asset.themeCategory.toLowerCase() === musicCategory.toLowerCase()))
      );

      return (
        <div className="w-full py-6 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setMusicCategory(null);
                  setSelectedMusicGenre(null);
                  setSelectedMusicMood(null);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white transition cursor-pointer"
              >
                <ArrowLeft size={14} />
              </button>
              <div>
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest flex text-left">Category Library</span>
                <h2 className="text-xl font-black text-white tracking-tight mt-0.5 flex text-left">
                  {musicCategory} 음악 목록
                </h2>
              </div>
            </div>
            <span className="text-xs font-bold text-zinc-500">
              총 {filteredTracks.length}곡 검색됨
            </span>
          </div>

          <div className="space-y-3">
            {filteredTracks.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/10 text-zinc-500">
                <Music size={32} className="mb-3 text-zinc-700 animate-pulse" />
                <p className="text-xs font-bold">해당 카테고리에 등록된 무료 음원이 아직 없습니다.</p>
              </div>
            ) : (
              filteredTracks.map((asset) => {
                const isPlaying = playingAudioId === asset.id;
                return (
                  <div
                    key={asset.id}
                    className="flex flex-col md:flex-row md:items-center justify-between rounded-xl border border-zinc-800/80 bg-[#090b11] p-4 hover:border-zinc-700/80 transition duration-250 gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-[30%]">
                      <button
                        onClick={(e) => toggleAudio(asset, e)}
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition shadow-lg cursor-pointer ${
                          isPlaying
                            ? "bg-blue-500 text-black hover:bg-blue-400"
                            : "bg-zinc-800 text-white hover:bg-zinc-700"
                        }`}
                      >
                        {isPlaying ? <Pause size={14} fill="black" /> : <Play size={14} className="ml-0.5" />}
                      </button>
                      <div className="truncate text-left">
                        <h4
                          onClick={() => openDetailModal(asset)}
                          className="text-xs font-black text-white truncate hover:text-blue-400 cursor-pointer"
                        >
                          {asset.title}
                        </h4>
                        <p className="text-[10px] font-bold text-zinc-500 mt-1 flex items-center gap-1.5">
                          <span>by {asset.uploader.split("@")[0]}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5"><Eye size={10} /> {asset.views}</span>
                        </p>
                      </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center max-w-[40%] h-8 overflow-hidden select-none opacity-40 hover:opacity-80 transition">
                      {Array.from({ length: 42 }).map((_, i) => {
                        const h = 5 + Math.sin(i * 0.4) * 12 + Math.cos(i * 0.2) * 8;
                        return (
                          <div
                            key={i}
                            style={{
                              height: isPlaying ? `${Math.max(4, h + Math.random() * 8)}px` : `${Math.max(3, h * 0.4)}px`,
                              transition: "height 0.18s ease-in-out"
                            }}
                            className={`w-[3px] rounded-full ${isPlaying ? 'bg-blue-400 animate-pulse' : 'bg-zinc-800'}`}
                          />
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-5 font-bold text-xs text-zinc-400">
                      <div className="flex gap-2">
                        {asset.tags.slice(0, 3).map((t) => (
                          <span key={t} className="rounded-full bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-[9px] text-zinc-500">
                            #{t}
                          </span>
                        ))}
                      </div>
                      <span>{asset.createdAt.slice(0, 10).replace(/-/g, ".")}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerDownload(asset);
                        }}
                        className="flex h-8 items-center gap-1.5 rounded-lg bg-zinc-800 hover:bg-blue-600 hover:text-white transition px-3 text-[11px] font-black text-zinc-300 cursor-pointer"
                      >
                        <Download size={12} />
                        다운로드
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      );
    }

    // === 기존의 Masonry 그리드 뷰 (이미지, 비디오 등) ===
    if (sortedAssets.length === 0) {
      return (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/10 text-zinc-500">
          <ImageIcon size={42} className="mb-3 text-zinc-700" />
          <p className="text-sm font-black">검색 조건에 맞는 무료 에셋이 없습니다.</p>
          <p className="mt-1 text-xs text-zinc-600">첫 번째 기여자로 무료 나눔 파일 업로드를 해보세요!</p>
        </div>
      );
    }

    return (
      <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-2 w-full">
        {sortedAssets.map((asset) => {
          const isAudio = asset.mediaType === "music";
          const isVideo = asset.mediaType === "video";
          const isPlaying = playingAudioId === asset.id;
          const assetUrl = asset.url || "";
          
          const getAspectClass = (ratio: string) => {
            if (ratio === "16:9") return "aspect-[16/9]";
            if (ratio === "9:16") return "aspect-[9/16]";
            if (ratio === "4:3") return "aspect-[4/3]";
            if (ratio === "3:4") return "aspect-[3/4]";
            if (ratio === "1:1") return "aspect-square";
            return isVideo ? "aspect-[16/9]" : "aspect-square";
          };

          return (
            <div
              key={asset.id}
              onClick={() => openDetailModal(asset)}
              onPointerMove={isVideo ? (e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const pct = Math.max(0, Math.min(1, x / rect.width));
                const video = e.currentTarget.querySelector("video");
                if (video) {
                  const duration = video.duration || 5;
                  const targetTime = pct * duration;
                  if (!isNaN(targetTime)) {
                    video.currentTime = targetTime;
                  }
                  if (video.paused) {
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                      playPromise.catch(() => {});
                    }
                  }
                }
              } : undefined}
              onPointerLeave={isVideo ? (e) => {
                const video = e.currentTarget.querySelector("video");
                if (video) {
                  video.currentTime = 0;
                  if (video.paused) {
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                      playPromise.catch(() => {});
                    }
                  }
                }
              } : undefined}
              className={`break-inside-avoid mb-2 group relative w-full overflow-hidden rounded-lg border border-zinc-800/60 bg-zinc-950/80 transition hover:-translate-y-1 hover:border-zinc-700/80 hover:shadow-2xl hover:shadow-black/50 cursor-pointer ${getAspectClass(asset.aspectRatio || "")}`}
            >
              {asset.isBusinessOnly && (
                <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 px-2 py-1 text-[9px] font-black text-zinc-950 shadow-md uppercase tracking-wider select-none">
                  👑 Business
                </div>
              )}
              {isAudio ? (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-indigo-950/50 to-slate-900 px-4">
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 group-hover:scale-105 transition-transform">
                    <Music size={26} />
                    {isPlaying && (
                      <span className="absolute inset-0 animate-ping rounded-full bg-indigo-500/10" />
                    )}
                  </div>
                  <p className="mt-3 text-center text-xs font-bold text-zinc-400 truncate w-full px-2">
                    {asset.title}
                  </p>
                  <button
                    onClick={(e) => toggleAudio(asset, e)}
                    className="mt-3 flex items-center justify-center gap-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition px-3 py-1 text-[11px] font-black text-white cursor-pointer"
                  >
                    {isPlaying ? (
                      <>
                        <Pause size={10} /> 정지
                      </>
                    ) : (
                      <>
                        <Play size={10} /> 미리듣기
                      </>
                    )}
                  </button>
                </div>
              ) : isVideo ? (
                <div className="relative h-full w-full">
                  <AutoplayVideo
                    src={(assetUrl.includes("googleusercontent.com") || assetUrl.includes("drive.google.com")) ? `/api/free-assets/proxy?url=${encodeURIComponent(assetUrl)}` : assetUrl}
                    className="h-full w-full object-cover pointer-events-none"
                  />
                  <div className="absolute right-3 top-3 rounded-lg bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white tracking-widest uppercase">
                    Video
                  </div>
                </div>
              ) : (
                <img
                  src={(() => {
                    const displayUrl = asset.thumbnailUrl || assetUrl;
                    return (displayUrl.includes("googleusercontent.com") || displayUrl.includes("drive.google.com"))
                      ? `/api/free-assets/proxy?url=${encodeURIComponent(displayUrl)}`
                      : displayUrl;
                  })()}
                  alt={asset.title}
                  loading="lazy"
                  className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                    (asset.themeCategory === "people" || asset.title.includes("머스크")) ? "object-top" : ""
                  }`}
                />
              )}

              {/* 카드 호버 오버레이 (Pixabay style) */}
              <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/90 via-black/20 to-black/35 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex justify-between items-start w-full">
                  <div className="min-w-0 flex-1 text-left space-y-1">
                    <p className="truncate text-xs font-black text-white leading-tight">
                      {asset.title}
                    </p>
                    <p className="text-[10px] text-zinc-400 font-bold leading-none mb-1.5">
                      By {asset.uploader.split("@")[0]}
                    </p>
                    <div className="flex flex-wrap gap-1 items-center">
                      {asset.aspectRatio && (
                        <span className="rounded-full bg-blue-600/90 text-white px-2 py-0.5 text-[9px] font-black tracking-wider shadow select-none">
                          {asset.aspectRatio}
                        </span>
                      )}
                      {asset.generationType === "ai" ? (
                        <span className="rounded-full bg-purple-600/90 text-white px-2 py-0.5 text-[9px] font-black tracking-wider shadow select-none">
                          AI 제작
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-600/90 text-white px-2 py-0.5 text-[9px] font-black tracking-wider shadow select-none">
                          실제 사진
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {currentUserEmail && (currentUserEmail.toLowerCase() === (asset.uploaderEmail || "").toLowerCase() || isAdmin) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(asset);
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-zinc-300 hover:bg-black/90 hover:text-amber-400 transition cursor-pointer"
                        title="정보 수정"
                      >
                        <Edit size={13} />
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerDownload(asset);
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-zinc-300 hover:bg-black/90 hover:text-white transition cursor-pointer"
                      title="다운로드"
                    >
                      <Download size={13} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setBookmarkedAssetIds((prev) => {
                          const next = new Set(prev);
                          if (next.has(asset.id)) {
                            next.delete(asset.id);
                          } else {
                            next.add(asset.id);
                          }
                          return next;
                        });
                      }}
                      className={`flex h-7 w-7 items-center justify-center rounded-full bg-black/60 transition cursor-pointer ${
                        bookmarkedAssetIds.has(asset.id)
                          ? "text-blue-500 hover:bg-black/90"
                          : "text-zinc-300 hover:bg-black/90 hover:text-blue-400"
                      }`}
                      title="저장"
                    >
                      <Tag size={13} className={bookmarkedAssetIds.has(asset.id) ? "fill-blue-500 text-blue-500" : ""} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLikedAssetIds((prev) => {
                          const next = new Set(prev);
                          if (next.has(asset.id)) {
                            next.delete(asset.id);
                          } else {
                            next.add(asset.id);
                          }
                          return next;
                        });
                      }}
                      className={`flex h-7 w-7 items-center justify-center rounded-full bg-black/60 transition cursor-pointer ${
                        likedAssetIds.has(asset.id)
                          ? "text-red-500 hover:bg-black/90"
                          : "text-zinc-300 hover:bg-black/90 hover:text-red-400"
                      }`}
                      title="좋아요"
                    >
                      <Heart size={13} className={likedAssetIds.has(asset.id) ? "fill-red-500 text-red-500" : ""} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-end gap-3 w-full">
                  <div className="min-w-0 flex-1 space-y-1 text-left">
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {asset.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-bold text-zinc-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2.5 mt-1 text-[9px] text-zinc-500 font-bold">
                      <span className="flex items-center gap-0.5">
                        <Eye size={10} /> {asset.views}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Download size={10} /> {asset.downloads}
                      </span>
                    </div>
                  </div>

                  {asset.mediaType !== "music" && asset.mediaType !== "video" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const importUrl = encodeURIComponent(asset.url);
                        const title = encodeURIComponent(asset.title);
                        window.location.href = `/studio/image/workspace?imageUrl=${importUrl}&title=${title}`;
                      }}
                      className="flex items-center gap-1.5 shrink-0 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition px-3 py-2 text-[10px] font-black shadow-lg cursor-pointer"
                    >
                      <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white/20 text-white text-[8px] font-black font-mono">C</span>
                      이미지 편집
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const popularTags = ["자연", "배경", "바다", "하늘", "여행", "힐링", "음악", "감성", "우주", "비즈니스"];

  return (
    <div className="min-h-screen w-full bg-[#06080d] text-zinc-100 pb-20">
      
      {/* 픽사베이 스타일 히어로 배너 */}
      <section className="relative flex h-auto min-h-[220px] w-full flex-col items-center justify-center overflow-visible border-b border-zinc-800 bg-[#080b12] pt-8 pb-5 md:pt-10 md:pb-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-900/80 to-[#06080d]" />
        
        {/* 장식용 그리드 패턴 */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />

        <div className="relative z-10 flex w-full max-w-3xl flex-col items-center px-6 text-center space-y-4">
          <h1 className="text-3xl font-black md:text-5xl leading-tight tracking-tight text-white drop-shadow-md">
            크리에이박스 <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-amber-400 bg-clip-text text-transparent">무료 미디어</span> 라이브러리
          </h1>

          {/* 픽사베이 스타일 상단 미디어 분류 탭 */}
          <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1.5 mt-4 text-sm font-medium">
            {[
              { id: "all", label: "통합 에셋", icon: ImageIcon },
              { id: "photo", label: "이미지", icon: ImageIcon },
              { id: "video", label: "비디오", icon: Video },
              { id: "music", label: "음악/사운드", icon: Music },
              { id: "premium-theme", label: "👑 홈페이지 제작용 프리미엄 테마 갤러리" },
            ].map((tab) => {
              const isActive = selectedMediaType === tab.id;
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedMediaType(tab.id);
                    setSelectedThemeCategory("all"); // Reset theme category filter
                    setSelectedStyle("all"); // Reset style filter
                    if (audioRef.current) {
                      audioRef.current.pause();
                      setPlayingAudioId(null);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? tab.id === "premium-theme"
                        ? "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-zinc-950 shadow-lg shadow-yellow-500/25 font-black"
                        : "bg-white text-zinc-950 shadow-lg shadow-white/10"
                      : tab.id === "premium-theme"
                        ? "text-amber-400 border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/15"
                        : "text-zinc-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {TabIcon && <TabIcon size={12} />}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {selectedMediaType === "premium-theme" ? (
            /* 프리미엄 테마 카테고리 필터바 */
            <div className="flex flex-col items-center w-full max-w-4xl space-y-3.5 mt-6 pt-6 border-t border-zinc-800/60">
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-[0.25em] select-none">
                15대 비즈니스 테마 카테고리 필터
              </span>
              <div className="flex flex-wrap justify-center gap-2.5 max-w-3xl">
                {[
                  { id: "all", label: "전체 테마" },
                  { id: "Restaurant", label: "Restaurant (음식점)" },
                  { id: "Music", label: "Music (음악)" },
                  { id: "Travel & Lifestyle", label: "Travel (여행)" },
                  { id: "Fashion & Beauty", label: "Fashion (뷰티)" },
                  { id: "Community & Non-Profit", label: "Community (비영리)" },
                  { id: "Magazine", label: "Magazine (잡지)" },
                  { id: "Art & Design", label: "Art & Design (미술)" },
                  { id: "Business", label: "Business (기업)" },
                  { id: "Store", label: "Store (쇼핑몰)" },
                  { id: "Real Estate", label: "Real Estate (부동산)" },
                  { id: "Health & Wellness", label: "Health (웰빙)" },
                  { id: "Education", label: "Education (교육)" },
                  { id: "Entertainment", label: "Entertainment (문화)" },
                  { id: "Portfolio", label: "Portfolio (작가)" },
                  { id: "Blog", label: "Blog (블로그)" },
                ].map((cat) => {
                  const isCatActive = selectedThemeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedThemeCategory(cat.id)}
                      className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                        isCatActive
                          ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 shadow-md shadow-yellow-500/15"
                          : "border border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-white"
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* 기존 일반 나눔 관 검색 및 필터링 영역 */
            <>
              {/* 중앙 통합 검색 바 */}
              <div className="relative w-full max-w-2xl mt-2">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="무료 이미지, 비디오, 음악 등 키워드 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-800/80 bg-zinc-950/80 py-4 pl-12 pr-6 text-sm text-white shadow-2xl backdrop-blur-md outline-none focus:border-blue-500/50"
                />
              </div>

              {/* 인기 태그 해시 */}
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="rounded-full border border-zinc-900 bg-zinc-900/40 px-3 py-1 text-xs font-bold text-zinc-400 hover:border-zinc-700 hover:text-white transition cursor-pointer"
                  >
                    #{tag}
                  </button>
                ))}
              </div>

               <div className="flex flex-wrap justify-center gap-3 mt-2.5 pt-0.5 w-full max-w-3xl" ref={filterDropdownRef}>
                {/* 비율 필터 버튼 */}
                <div className="relative">
                  <button
                    onClick={() => setActiveFilterTab(activeFilterTab === "ratio" ? null : "ratio")}
                    className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
                      activeFilterTab === "ratio"
                        ? "border-blue-500 bg-blue-600/10 text-blue-400"
                        : selectedAspectRatio !== "all"
                          ? "border-blue-500 bg-blue-600 text-white shadow-md shadow-blue-500/20"
                          : "border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-white"
                    }`}
                  >
                    <SlidersHorizontal size={12} />
                    <span>
                      비율 필터
                      {selectedAspectRatio !== "all" && (
                        <span className="ml-1 text-[11px] font-black opacity-90">
                          ({selectedAspectRatio})
                        </span>
                      )}
                    </span>
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${
                        activeFilterTab === "ratio" ? "rotate-180 text-blue-400" : "text-zinc-500"
                      }`}
                    />
                  </button>

                  {/* 비율 필터 아코디언 드롭다운 */}
                  <div
                    className={`absolute left-0 mt-2 z-50 rounded-2xl border border-zinc-800 bg-[#090b11]/95 backdrop-blur-md p-3 shadow-2xl w-72 max-w-[90vw] flex flex-col gap-2 overflow-hidden transition-all duration-200 ease-in-out origin-top-left ${
                      activeFilterTab === "ratio"
                        ? "max-h-[300px] opacity-100 scale-100"
                        : "max-h-0 opacity-0 scale-95 pointer-events-none border-transparent p-0"
                    }`}
                  >
                    <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1 select-none">비율 선택</div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { id: "all", label: "전체 비율" },
                        { id: "16:9", label: "16:9 가로" },
                        { id: "9:16", label: "9:16 세로" },
                        { id: "4:3", label: "4:3 표준" },
                        { id: "3:4", label: "3:4 세로" },
                        { id: "1:1", label: "1:1 정방향" },
                        { id: "기타", label: "기타 비율" },
                      ].map((ratio) => (
                        <button
                          key={ratio.id}
                          onClick={() => {
                            setSelectedAspectRatio(ratio.id);
                            setActiveFilterTab(null);
                          }}
                          className={`rounded-xl px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                            selectedAspectRatio === ratio.id
                              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                              : "border border-zinc-900 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-white"
                          }`}
                        >
                          {ratio.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 제작 방식 필터 버튼 */}
                <div className="relative">
                  <button
                    onClick={() => setActiveFilterTab(activeFilterTab === "generation" ? null : "generation")}
                    className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
                      activeFilterTab === "generation"
                        ? "border-blue-500 bg-blue-600/10 text-blue-400"
                        : selectedGenerationType !== "all"
                          ? "border-blue-500 bg-blue-600 text-white shadow-md shadow-blue-500/20"
                          : "border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-white"
                    }`}
                  >
                    <SlidersHorizontal size={12} />
                    <span>
                      제작 방식
                      {selectedGenerationType !== "all" && (
                        <span className="ml-1 text-[11px] font-black opacity-90">
                          ({selectedGenerationType === "ai" ? "AI 제작" : "실제 사진"})
                        </span>
                      )}
                    </span>
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${
                        activeFilterTab === "generation" ? "rotate-180 text-blue-400" : "text-zinc-500"
                      }`}
                    />
                  </button>

                  {/* 제작 방식 아코디언 드롭다운 */}
                  <div
                    className={`absolute left-0 mt-2 z-50 rounded-2xl border border-zinc-800 bg-[#090b11]/95 backdrop-blur-md p-3 shadow-2xl w-60 max-w-[90vw] flex flex-col gap-2 overflow-hidden transition-all duration-200 ease-in-out origin-top-left ${
                      activeFilterTab === "generation"
                        ? "max-h-[300px] opacity-100 scale-100"
                        : "max-h-0 opacity-0 scale-95 pointer-events-none border-transparent p-0"
                    }`}
                  >
                    <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1 select-none">제작 방식</div>
                    <div className="flex flex-col gap-1">
                      {[
                        { id: "all", label: "전체 이미지" },
                        { id: "ai", label: "AI 생성 이미지" },
                        { id: "real", label: "실제 사진 이미지" },
                      ].map((gen) => {
                        const isSelected = selectedGenerationType === gen.id;
                        return (
                          <button
                            key={gen.id}
                            onClick={() => {
                              setSelectedGenerationType(gen.id);
                              setActiveFilterTab(null);
                            }}
                            className={`w-full text-left rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer ${
                              isSelected
                                ? "bg-[#182030] text-blue-400 font-black border border-blue-500/20"
                                : "text-zinc-300 hover:bg-zinc-900/50 hover:text-white"
                            }`}
                          >
                            {gen.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 스타일 필터 버튼 */}
                <div className="relative">
                  <button
                    onClick={() => setActiveFilterTab(activeFilterTab === "style" ? null : "style")}
                    className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
                      activeFilterTab === "style"
                        ? "border-blue-500 bg-blue-600/10 text-blue-400"
                        : selectedStyle !== "all"
                          ? "border-blue-500 bg-blue-600 text-white shadow-md shadow-blue-500/20"
                          : "border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-white"
                    }`}
                  >
                    <SlidersHorizontal size={12} />
                    <span>
                      스타일 필터
                      {selectedStyle !== "all" && (
                        <span className="ml-1 text-[11px] font-black opacity-90">
                          ({
                            selectedStyle === "photorealistic" ? "실사" :
                            selectedStyle === "illustration" ? "일러스트" :
                            selectedStyle === "vector" ? "벡터" :
                            selectedStyle === "3d_render" ? "3D 렌더" :
                            selectedStyle === "anime" ? "애니" :
                            selectedStyle === "pixel_art" ? "픽셀" :
                            selectedStyle === "watercolor" ? "수채화" :
                            selectedStyle === "line_art" ? "라인" :
                            selectedStyle === "seamless_pattern" ? "패턴" :
                            selectedStyle === "retro_pop_art" ? "레트로" : selectedStyle
                          })
                        </span>
                      )}
                    </span>
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${
                        activeFilterTab === "style" ? "rotate-180 text-blue-400" : "text-zinc-500"
                      }`}
                    />
                  </button>

                  {/* 스타일 아코디언 드롭다운 */}
                  <div
                    className={`absolute left-0 mt-2 z-50 rounded-2xl border border-zinc-800 bg-[#090b11]/95 backdrop-blur-md p-3 shadow-2xl w-80 max-w-[90vw] flex flex-col gap-2 overflow-hidden transition-all duration-200 ease-in-out origin-top-left ${
                      activeFilterTab === "style"
                        ? "max-h-[300px] opacity-100 scale-100"
                        : "max-h-0 opacity-0 scale-95 pointer-events-none border-transparent p-0"
                    }`}
                  >
                    <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1 select-none">스타일 선택</div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { id: "all", label: "전체 스타일" },
                        { id: "photorealistic", label: "실사" },
                        { id: "illustration", label: "일러스트" },
                        { id: "vector", label: "벡터" },
                        { id: "3d_render", label: "3D 렌더" },
                        { id: "anime", label: "애니" },
                        { id: "pixel_art", label: "픽셀" },
                        { id: "watercolor", label: "수채화" },
                        { id: "line_art", label: "라인" },
                        { id: "seamless_pattern", label: "패턴" },
                        { id: "retro_pop_art", label: "레트로" },
                      ].map((style) => (
                        <button
                          key={style.id}
                          onClick={() => {
                            setSelectedStyle(style.id);
                            setActiveFilterTab(null);
                          }}
                          className={`rounded-xl px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                            selectedStyle === style.id
                              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                              : "border border-zinc-900 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-white"
                          }`}
                        >
                          {style.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 카테고리 필터 버튼 */}
                <div className="relative">
                  <button
                    onClick={() => setActiveFilterTab(activeFilterTab === "category" ? null : "category")}
                    className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
                      activeFilterTab === "category"
                        ? "border-blue-500 bg-blue-600/10 text-blue-400"
                        : selectedThemeCategory !== "all"
                          ? "border-blue-500 bg-blue-600 text-white shadow-md shadow-blue-500/20"
                          : "border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-white"
                    }`}
                  >
                    <SlidersHorizontal size={12} />
                    <span>
                      카테고리 필터
                      {selectedThemeCategory !== "all" && (
                        <span className="ml-1 text-[11px] font-black opacity-90">
                          ({
                            selectedThemeCategory === "art" ? "추상/그래픽" :
                            selectedThemeCategory === "tech" ? "기술/디지털" :
                            selectedThemeCategory === "food" ? "미식/푸드" :
                            selectedThemeCategory === "nature" ? "자연/풍경" :
                            selectedThemeCategory === "animal" ? "동물/야생" :
                            selectedThemeCategory === "texture" ? "배경/텍스처" :
                            selectedThemeCategory === "people" ? "인물/라이프" :
                            selectedThemeCategory === "architecture" ? "건축" :
                            selectedThemeCategory === "fashion" ? "패션/뷰티" :
                            selectedThemeCategory === "business" ? "비즈니스" :
                            selectedThemeCategory === "education" ? "교육" :
                            selectedThemeCategory === "health" ? "의료" : selectedThemeCategory
                          })
                        </span>
                      )}
                    </span>
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${
                        activeFilterTab === "category" ? "rotate-180 text-blue-400" : "text-zinc-500"
                      }`}
                    />
                  </button>

                  {/* 카테고리 아코디언 드롭다운 */}
                  <div
                    className={`absolute left-0 mt-2 z-50 rounded-2xl border border-zinc-800 bg-[#090b11]/95 backdrop-blur-md p-3 shadow-2xl w-80 max-w-[90vw] flex flex-col gap-2 overflow-hidden transition-all duration-200 ease-in-out origin-top-left ${
                      activeFilterTab === "category"
                        ? "max-h-[300px] opacity-100 scale-100"
                        : "max-h-0 opacity-0 scale-95 pointer-events-none border-transparent p-0"
                    }`}
                  >
                    <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1 select-none">카테고리 선택</div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { id: "all", label: "전체 카테고리" },
                        { id: "art", label: "추상 & 그래픽" },
                        { id: "tech", label: "기술 & 디지털" },
                        { id: "food", label: "미식 & 푸드" },
                        { id: "nature", label: "자연 & 풍경" },
                        { id: "animal", label: "동물 & 야생" },
                        { id: "texture", label: "배경 & 텍스처" },
                        { id: "people", label: "인물 & 라이프" },
                        { id: "architecture", label: "건축 & 랜드마크" },
                        { id: "fashion", label: "패션 & 뷰티" },
                        { id: "business", label: "비즈니스 & 금융" },
                        { id: "education", label: "교육 & 지식" },
                        { id: "health", label: "의료 & 헬스케어" },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedThemeCategory(cat.id);
                            setActiveFilterTab(null);
                          }}
                          className={`rounded-xl px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                            selectedThemeCategory === cat.id
                              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                              : "border border-zinc-900 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-white"
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 포스트 타입 (용도) 필터 버튼 */}
                <div className="relative">
                  <button
                    onClick={() => setActiveFilterTab(activeFilterTab === "postType" ? null : "postType")}
                    className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
                      activeFilterTab === "postType"
                        ? "border-blue-500 bg-blue-600/10 text-blue-400"
                        : selectedPostType !== "all"
                          ? "border-blue-500 bg-blue-600 text-white shadow-md shadow-blue-500/20"
                          : "border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-white"
                    }`}
                  >
                    <SlidersHorizontal size={12} />
                    <span>
                      포스트 타입(용도)
                      {selectedPostType !== "all" && (
                        <span className="ml-1 text-[11px] font-black opacity-90">
                          ({
                            selectedPostType === "general" ? "일반 정보" :
                            selectedPostType === "subsidies" ? "생활/지원금" :
                            selectedPostType === "health" ? "건강/영양제" :
                            selectedPostType === "finance_loan" ? "보험/대출" :
                            selectedPostType === "real_estate" ? "부동산" :
                            selectedPostType === "finance_investment" ? "금융/재테크" :
                            selectedPostType === "stock_analysis" ? "주식 분석" :
                            selectedPostType === "corporate_info" ? "기업 정보" :
                            selectedPostType === "playlist_asmr" ? "ASMR/플리" :
                            selectedPostType === "music_video" ? "뮤직비디오" :
                            selectedPostType === "news_report" ? "뉴스 리포트" : selectedPostType
                          })
                        </span>
                      )}
                    </span>
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${
                        activeFilterTab === "postType" ? "rotate-180 text-blue-400" : "text-zinc-500"
                      }`}
                    />
                  </button>

                  {/* 포스트 타입 아코디언 드롭다운 */}
                  <div
                    className={`absolute right-0 md:left-0 mt-2 z-50 rounded-2xl border border-zinc-800 bg-[#090b11]/95 backdrop-blur-md p-3 shadow-2xl w-[500px] max-w-[90vw] flex flex-col gap-2 overflow-hidden transition-all duration-200 ease-in-out origin-top-right md:origin-top-left ${
                      activeFilterTab === "postType"
                        ? "max-h-[480px] opacity-100 scale-100"
                        : "max-h-0 opacity-0 scale-95 pointer-events-none border-transparent p-0"
                    }`}
                  >
                    <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1 select-none">용도 선택</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {[
                        { id: "all", label: "🌐 전체 용도" },
                        { id: "general", label: "📝 일반 정보성/동기부여" },
                        { id: "subsidies", label: "💵 생활 정책/정부 지원금" },
                        { id: "health", label: "🩺 건강 정보/영양제 분석" },
                        { id: "finance_loan", label: "💳 보험/대출/카드 정보" },
                        { id: "real_estate", label: "🏠 부동산 정보" },
                        { id: "finance_investment", label: "💰 금융 및 재테크" },
                        { id: "stock_analysis", label: "📈 주식/재테크 분석" },
                        { id: "corporate_info", label: "🏢 기업 정보" },
                        { id: "playlist_asmr", label: "🎵 플레이리스트/ASMR" },
                        { id: "music_video", label: "🎥 뮤직 동영상" },
                        { id: "news_report", label: "📰 뉴스 리포트" }
                      ].map((type) => {
                        const isSelected = selectedPostType === type.id;
                        return (
                          <button
                            key={type.id}
                            onClick={() => {
                              setSelectedPostType(type.id);
                              setActiveFilterTab(null);
                            }}
                            className={`w-full text-left rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer ${
                              isSelected
                                ? "bg-[#182030] text-blue-400 font-black"
                                : "text-zinc-300 hover:bg-zinc-900/50 hover:text-white"
                            }`}
                          >
                            {type.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>

            </>
          )}
        </div>

        {/* Row 2: 미디어 카테고리 & 정렬 탭 (Hero 배너 영역 하단으로 이동하여 1px 라인 위에 깔끔하게 배치) */}
        <div className="relative z-10 w-full max-w-[96%] xl:max-w-[98%] px-5 lg:px-8 mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-1">
          {/* 미디어 유형 카테고리 탭 (배경 테두리 없이 깔끔하게 텍스트+아이콘만) */}
          <div className="flex flex-wrap gap-6 items-center shrink-0">
            {[
              { id: "all", label: "통합 에셋", icon: ImageIcon },
              { id: "photo", label: "이미지", icon: ImageIcon },
              { id: "video", label: "비디오", icon: Video },
              { id: "music", label: "음악/사운드", icon: Music },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = selectedMediaType === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedMediaType(tab.id);
                    if (audioRef.current) {
                      audioRef.current.pause();
                      setPlayingAudioId(null);
                    }
                  }}
                  className={`flex items-center gap-1.5 text-xs font-black transition cursor-pointer ${
                    isActive
                      ? "text-blue-500 font-black"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <TabIcon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* 정렬 탭 / 음악 장르&무드 필터 선택 옵션 */}
          <div className="relative flex flex-wrap items-center gap-4 text-xs sm:text-sm select-none" ref={sortDropdownRef}>
            {selectedMediaType === "music" ? (
              <div className="flex flex-wrap items-center gap-3">
                {/* 음악 장르 선택 옵션 */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setActiveFilterTab(activeFilterTab === "category" ? null : "category");
                    }}
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-black transition cursor-pointer ${
                      selectedMusicGenre
                        ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                        : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span>🎹 장르: {selectedMusicGenre || "전체"}</span>
                    <ChevronDown size={12} />
                  </button>
                  {activeFilterTab === "category" && (
                    <div className="absolute left-0 mt-2 z-50 w-44 rounded-xl border border-zinc-800 bg-[#0c101b] p-1.5 shadow-2xl">
                      {["전체", "일렉트로니카", "팝", "영화/드라마", "어쿠스틱"].map((genre) => (
                        <button
                          key={genre}
                          onClick={() => {
                            const val = genre === "전체" ? null : genre;
                            setSelectedMusicGenre(val);
                            setSelectedMusicMood(null); // Reset mood when choosing genre
                            setMusicCategory(val);
                            setActiveFilterTab(null);
                          }}
                          className={`w-full text-left rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                            (genre === "전체" && !selectedMusicGenre) || selectedMusicGenre === genre
                              ? "bg-[#182030] text-blue-400 font-black"
                              : "text-zinc-400 hover:bg-zinc-900/60 hover:text-white"
                          }`}
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 음악 무드 선택 옵션 */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setActiveFilterTab(activeFilterTab === "style" ? null : "style");
                    }}
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-black transition cursor-pointer ${
                      selectedMusicMood
                        ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                        : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span>✨ 무드: {selectedMusicMood || "전체"}</span>
                    <ChevronDown size={12} />
                  </button>
                  {activeFilterTab === "style" && (
                    <div className="absolute left-0 mt-2 z-50 w-44 rounded-xl border border-zinc-800 bg-[#0c101b] p-1.5 shadow-2xl">
                      {["전체", "그루비", "신나는", "부드러운", "로맨틱"].map((mood) => (
                        <button
                          key={mood}
                          onClick={() => {
                            const val = mood === "전체" ? null : mood;
                            setSelectedMusicMood(val);
                            setSelectedMusicGenre(null); // Reset genre when choosing mood
                            setMusicCategory(val);
                            setActiveFilterTab(null);
                          }}
                          className={`w-full text-left rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                            (mood === "전체" && !selectedMusicMood) || selectedMusicMood === mood
                              ? "bg-[#182030] text-emerald-400 font-black"
                              : "text-zinc-400 hover:bg-zinc-900/60 hover:text-white"
                          }`}
                        >
                          {mood}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                {[
                  { id: "for_you", label: "For You", emoji: "✨" },
                  { id: "recent", label: "Recent", emoji: "⏱️" },
                  { id: "random", label: "Random", emoji: "🎲" },
                  { id: "hot", label: "Hot", emoji: "🔥" }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveSortTab(t.id as any);
                      setIsTopDropdownOpen(false);
                    }}
                    className={`flex items-center gap-1 font-black cursor-pointer transition ${
                      activeSortTab === t.id ? "text-blue-500" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <span className="mr-0.5">{t.emoji}</span>
                    {t.label}
                  </button>
                ))}

                {/* Top Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsTopDropdownOpen(!isTopDropdownOpen)}
                    className={`flex items-center gap-1 font-black cursor-pointer transition ${
                      activeSortTab.startsWith("top_") ? "text-blue-500" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <span>
                      🏆 {activeSortTab === "top_day" ? "Top Day" :
                          activeSortTab === "top_week" ? "Top Week" : "Top Month"}
                    </span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isTopDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isTopDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-28 rounded-xl border border-zinc-800 bg-[#090b11] p-1 shadow-2xl z-50">
                      {[
                        { id: "top_day", label: "Top Day" },
                        { id: "top_week", label: "Top Week" },
                        { id: "top_month", label: "Top Month" }
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setActiveSortTab(opt.id as any);
                            setIsTopDropdownOpen(false);
                          }}
                          className="w-full text-left rounded-lg px-3 py-1.5 text-xs font-bold text-zinc-400 hover:bg-zinc-900 hover:text-white transition cursor-pointer"
                        >
                          🏆 {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setActiveSortTab("likes");
                    setIsTopDropdownOpen(false);
                  }}
                  className={`flex items-center gap-1 font-black cursor-pointer transition ${
                    activeSortTab === "likes" ? "text-blue-500" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <span className="mr-0.5">❤️</span>
                  Likes
                </button>
              </>
            )}

            {/* 무료 에셋 나눔하기 버튼 */}
            <button
              onClick={handleOpenUpload}
              className="flex items-center gap-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 text-xs font-bold transition shadow-md shadow-blue-500/20 cursor-pointer ml-2"
            >
              <UploadCloud size={12} />
              <span>무료 에셋 나눔하기</span>
            </button>
          </div>
        </div>
      </section>

      {/* 메인 콘텐츠 바디 */}
      <div className="mx-auto max-w-[96%] xl:max-w-[98%] px-5 lg:px-8 mt-3 space-y-8">

        {/* 메인 에셋 그리드 영역 (Masonry 스타일) */}
        <div className="w-full mt-2">
          {renderAssetsContent()}
          {false && (loading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-blue-500" size={32} />
              <p className="text-xs font-bold text-zinc-500">라이브러리로부터 무료 에셋 로딩 중...</p>
            </div>
          ) : sortedAssets.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/10 text-zinc-500">
              <ImageIcon size={42} className="mb-3 text-zinc-700" />
              <p className="text-sm font-black">검색 조건에 맞는 무료 에셋이 없습니다.</p>
              <p className="mt-1 text-xs text-zinc-600">첫 번째 기여자로 무료 나눔 파일 업로드를 해보세요!</p>
            </div>
          ) : (
            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-2 w-full">
              {sortedAssets.map((asset) => {
                  const isAudio = asset.mediaType === "music";
                  const isVideo = asset.mediaType === "video";
                  const isPlaying = playingAudioId === asset.id;
                  const assetUrl = asset.url || "";
                  
                  const getAspectClass = (ratio: string) => {
                    if (ratio === "16:9") return "aspect-[16/9]";
                    if (ratio === "9:16") return "aspect-[9/16]";
                    if (ratio === "4:3") return "aspect-[4/3]";
                    if (ratio === "3:4") return "aspect-[3/4]";
                    if (ratio === "1:1") return "aspect-square";
                    return isVideo ? "aspect-[16/9]" : "aspect-square";
                  };

                  return (
                    <div
                      key={asset.id}
                      onClick={() => openDetailModal(asset)}
                      onPointerMove={isVideo ? (e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const pct = Math.max(0, Math.min(1, x / rect.width));
                        const video = e.currentTarget.querySelector("video");
                        if (video) {
                          const duration = video.duration || 5;
                          const targetTime = pct * duration;
                          if (!isNaN(targetTime)) {
                            video.currentTime = targetTime;
                          }
                          if (video.paused) {
                            const playPromise = video.play();
                            if (playPromise !== undefined) {
                              playPromise.catch(() => {});
                            }
                          }
                        }
                      } : undefined}
                      onPointerLeave={isVideo ? (e) => {
                        const video = e.currentTarget.querySelector("video");
                        if (video) {
                          video.currentTime = 0;
                          if (video.paused) {
                            const playPromise = video.play();
                            if (playPromise !== undefined) {
                              playPromise.catch(() => {});
                            }
                          }
                        }
                      } : undefined}
                      className={`break-inside-avoid mb-2 group relative w-full overflow-hidden rounded-lg border border-zinc-800/60 bg-zinc-950/80 transition hover:-translate-y-1 hover:border-zinc-700/80 hover:shadow-2xl hover:shadow-black/50 cursor-pointer ${getAspectClass(asset.aspectRatio || "")}`}
                    >
                      {asset.isBusinessOnly && (
                        <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 px-2 py-1 text-[9px] font-black text-zinc-950 shadow-md uppercase tracking-wider select-none">
                          👑 Business
                        </div>
                      )}
                      {isAudio ? (
                        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-indigo-950/50 to-slate-900 px-4">
                          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 group-hover:scale-105 transition-transform">
                            <Music size={26} />
                            {isPlaying && (
                              <span className="absolute inset-0 animate-ping rounded-full bg-indigo-500/10" />
                            )}
                          </div>
                          <p className="mt-3 text-center text-xs font-bold text-zinc-400 truncate w-full px-2">
                            {asset.title}
                          </p>
                          <button
                            onClick={(e) => toggleAudio(asset, e)}
                            className="mt-3 flex items-center justify-center gap-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition px-3 py-1 text-[11px] font-black text-white cursor-pointer"
                          >
                            {isPlaying ? (
                              <>
                                <Pause size={10} /> 정지
                              </>
                            ) : (
                              <>
                                <Play size={10} /> 미리듣기
                              </>
                            )}
                          </button>
                        </div>
                      ) : isVideo ? (
                        <div className="relative h-full w-full">
                          <AutoplayVideo
                            src={(assetUrl.includes("googleusercontent.com") || assetUrl.includes("drive.google.com")) ? `/api/free-assets/proxy?url=${encodeURIComponent(assetUrl)}` : assetUrl}
                            className="h-full w-full object-cover pointer-events-none"
                          />
                          <div className="absolute right-3 top-3 rounded-lg bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white tracking-widest uppercase">
                            Video
                          </div>
                        </div>
                      ) : (
                        <img
                          src={(assetUrl.includes("googleusercontent.com") || assetUrl.includes("drive.google.com")) ? `/api/free-assets/proxy?url=${encodeURIComponent(assetUrl)}` : assetUrl}
                          alt={asset.title}
                          loading="lazy"
                          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                            (asset.themeCategory === "people" || asset.title.includes("머스크")) ? "object-top" : ""
                          }`}
                        />
                      )}

                      {/* 카드 호버 오버레이 (Pixabay style) */}
                      <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/90 via-black/20 to-black/35 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        
                        {/* 상단 텍스트 및 버튼 영역 */}
                        <div className="flex justify-between items-start w-full">
                          
                          {/* 상단 좌측: 제목 & 작가 & 비율 배지 */}
                          <div className="min-w-0 flex-1 text-left space-y-1">
                            <p className="truncate text-xs font-black text-white leading-tight">
                              {asset.title}
                            </p>
                            <p className="text-[10px] text-zinc-400 font-bold leading-none mb-1.5">
                              By {asset.uploader.split("@")[0]}
                            </p>
                            <div className="flex flex-wrap gap-1 items-center">
                              {asset.aspectRatio && (
                                <span className="rounded-full bg-blue-600/90 text-white px-2 py-0.5 text-[9px] font-black tracking-wider shadow select-none">
                                  {asset.aspectRatio}
                                </span>
                              )}
                              {asset.generationType === "ai" ? (
                                <span className="rounded-full bg-purple-600/90 text-white px-2 py-0.5 text-[9px] font-black tracking-wider shadow select-none">
                                  AI 제작
                                </span>
                              ) : (
                                <span className="rounded-full bg-emerald-600/90 text-white px-2 py-0.5 text-[9px] font-black tracking-wider shadow select-none">
                                  실제 사진
                                </span>
                              )}
                            </div>
                          </div>

                          {/* 상단 우측: 액션 버튼바 */}
                          <div className="flex items-center gap-1 shrink-0">
                            {currentUserEmail && (currentUserEmail.toLowerCase() === (asset.uploaderEmail || "").toLowerCase() || isAdmin) && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditModal(asset);
                                }}
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-zinc-300 hover:bg-black/90 hover:text-amber-400 transition cursor-pointer"
                                title="정보 수정"
                              >
                                <Edit size={13} />
                              </button>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                triggerDownload(asset);
                              }}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-zinc-300 hover:bg-black/90 hover:text-white transition cursor-pointer"
                              title="다운로드"
                            >
                              <Download size={13} />
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setBookmarkedAssetIds((prev) => {
                                  const next = new Set(prev);
                                  if (next.has(asset.id)) {
                                    next.delete(asset.id);
                                  } else {
                                    next.add(asset.id);
                                  }
                                  return next;
                                });
                              }}
                              className={`flex h-7 w-7 items-center justify-center rounded-full bg-black/60 transition cursor-pointer ${
                                bookmarkedAssetIds.has(asset.id)
                                  ? "text-blue-500 hover:bg-black/90"
                                  : "text-zinc-300 hover:bg-black/90 hover:text-blue-400"
                              }`}
                              title="저장"
                            >
                              <Tag size={13} className={bookmarkedAssetIds.has(asset.id) ? "fill-blue-500 text-blue-500" : ""} />
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setLikedAssetIds((prev) => {
                                  const next = new Set(prev);
                                  if (next.has(asset.id)) {
                                    next.delete(asset.id);
                                  } else {
                                    next.add(asset.id);
                                  }
                                  return next;
                                });
                              }}
                              className={`flex h-7 w-7 items-center justify-center rounded-full bg-black/60 transition cursor-pointer ${
                                likedAssetIds.has(asset.id)
                                  ? "text-red-500 hover:bg-black/90"
                                  : "text-zinc-300 hover:bg-black/90 hover:text-red-400"
                              }`}
                              title="좋아요"
                            >
                              <Heart size={13} className={likedAssetIds.has(asset.id) ? "fill-red-500 text-red-500" : ""} />
                            </button>
                          </div>
                        </div>

                        {/* 하단 태그 정보 & 이미지 편집 버튼 */}
                        <div className="flex justify-between items-end gap-3 w-full">
                          <div className="min-w-0 flex-1 space-y-1 text-left">
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {asset.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-bold text-zinc-300"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            {/* 조회수 & 다운로드 통계 */}
                            <div className="flex items-center gap-2.5 mt-1 text-[9px] text-zinc-500 font-bold">
                              <span className="flex items-center gap-0.5">
                                <Eye size={10} /> {asset.views}
                              </span>
                              <span className="flex items-center gap-0.5">
                                <Download size={10} /> {asset.downloads}
                              </span>
                            </div>
                          </div>

                          {/* 이미지 편집 바로가기 (사진/일러스트/움짤 등 이미지 타입만 노출) */}
                          {asset.mediaType !== "music" && asset.mediaType !== "video" && (
                            <button
                              onClick={(e) => {
                                  e.stopPropagation();
                                  const importUrl = encodeURIComponent(asset.url);
                                  const title = encodeURIComponent(asset.title);
                                  window.location.href = `/studio/image/workspace?imageUrl=${importUrl}&title=${title}`;
                              }}
                              className="flex items-center gap-1.5 shrink-0 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition px-3 py-2 text-[10px] font-black shadow-lg cursor-pointer"
                            >
                              <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white/20 text-white text-[8px] font-black font-mono">C</span>
                              이미지 편집
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>


      {/* 1. 상세보기 상세 모달 (Detail View Modal) */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
          <div className="relative flex h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-zinc-800 bg-[#0c0f17] text-zinc-100">
            
            <button
              onClick={() => {
                setSelectedAsset(null);
                if (audioRef.current) {
                  audioRef.current.pause();
                  setPlayingAudioId(null);
                }
              }}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950/80 border border-zinc-800 text-zinc-400 hover:text-white transition hover:scale-105 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
              
              <div className="relative flex flex-1 items-center justify-center bg-zinc-950 p-6 min-h-[300px] lg:min-h-0">
                {/* 이미지/미디어 영역 상단 네비게이션 바 */}
                {assets.length > 1 && currentAssetIndex !== -1 && (
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                    {/* 현재 인덱스 표시 */}
                    <span className="text-[11px] font-black text-zinc-400 bg-zinc-900/85 px-3 py-1.5 rounded-xl border border-zinc-800/80 backdrop-blur-sm shadow-md">
                      {currentAssetIndex + 1} / {assets.length}
                    </span>
                    
                    {/* 좌우 이동 버튼 */}
                    <div className="flex items-center gap-1.5 bg-zinc-900/85 p-1 rounded-xl border border-zinc-800/80 backdrop-blur-sm shadow-md">
                      <button
                        onClick={handlePrevAsset}
                        disabled={currentAssetIndex === 0}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-zinc-500 transition cursor-pointer disabled:cursor-not-allowed"
                        title="이전 미디어 (Left Arrow)"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <div className="w-[1px] h-3 bg-zinc-800" />
                      <button
                        onClick={handleNextAsset}
                        disabled={currentAssetIndex === assets.length - 1}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-zinc-500 transition cursor-pointer disabled:cursor-not-allowed"
                        title="다음 미디어 (Right Arrow)"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {selectedAsset.mediaType === "music" ? (
                  <div className="flex flex-col items-center gap-6 max-w-sm w-full">
                    <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
                      <Music size={52} />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-black text-white">{selectedAsset.title}</h3>
                      <p className="text-xs text-zinc-500 mt-1">{selectedAsset.name}</p>
                    </div>
                    <button
                      onClick={(e) => toggleAudio(selectedAsset, e)}
                      className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition px-6 py-3 text-sm font-black text-white shadow-lg shadow-indigo-600/20 cursor-pointer"
                    >
                      {playingAudioId === selectedAsset.id ? (
                        <>
                          <Pause size={16} /> 정지
                        </>
                      ) : (
                        <>
                          <Play size={16} /> 사운드 재생
                        </>
                      )}
                    </button>
                  </div>
                ) : selectedAsset.mediaType === "video" ? (
                  <video
                    src={(selectedAsset.url.includes("googleusercontent.com") || selectedAsset.url.includes("drive.google.com")) ? `/api/free-assets/proxy?url=${encodeURIComponent(selectedAsset.url)}` : selectedAsset.url}
                    controls
                    autoPlay
                    loop
                    className="max-h-full max-w-full rounded-none"
                  />
                ) : (
                  <img
                    src={(selectedAsset.url.includes("googleusercontent.com") || selectedAsset.url.includes("drive.google.com")) ? `/api/free-assets/proxy?url=${encodeURIComponent(selectedAsset.url)}` : selectedAsset.url}
                    alt={selectedAsset.title}
                    className="max-h-full max-w-full rounded-none object-contain shadow-2xl"
                  />
                )}
              </div>

              <div className="flex w-full flex-col border-t border-zinc-900 bg-zinc-900/20 p-6 lg:w-80 lg:border-l lg:border-t-0">
                <div className="flex-1 space-y-3.5 overflow-y-auto pr-1">
                  <div>
                    <h2 className="text-lg font-black text-white leading-tight">
                      {selectedAsset.title}
                    </h2>
                    <p className="mt-1.5 text-xs text-zinc-500 font-bold truncate">
                      {selectedAsset.name}
                    </p>
                  </div>

                  {currentUserEmail && (currentUserEmail.toLowerCase() === (selectedAsset.uploaderEmail || "").toLowerCase() || isAdmin) && (
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 py-2 px-3.5 flex items-center justify-between gap-4">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider shrink-0">에셋 관리</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(selectedAsset)}
                          className="flex items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 transition py-1 px-2.5 text-[10px] font-black text-zinc-300 hover:text-white cursor-pointer"
                        >
                          <Edit size={10} />
                          정보 수정
                        </button>
                        <button
                          onClick={() => handleDeleteAsset(selectedAsset.id)}
                          className="flex items-center justify-center gap-1.5 rounded-lg border border-red-950/50 bg-red-950/20 hover:bg-red-900/30 text-red-400 hover:text-red-300 transition py-1 px-2.5 text-[10px] font-black cursor-pointer"
                        >
                          <Trash2 size={10} />
                          에셋 삭제
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 py-2.5 px-3.5 flex items-center justify-between">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">나눔 기여자</span>
                    <span className="text-xs font-black text-zinc-200">
                      {selectedAsset.uploader}
                    </span>
                  </div>

                  <div className="relative flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/30 p-2 select-none">
                    <button
                      onClick={() => alert("좋아요가 반영되었습니다!")}
                      className="flex-1 flex flex-col items-center justify-center py-2 text-zinc-400 hover:text-red-400 transition cursor-pointer"
                    >
                      <Heart size={18} className="mb-1" />
                      <span className="text-[10px] font-bold">좋아요</span>
                    </button>
                    <span className="w-px h-6 bg-zinc-900" />
                    <button
                      onClick={() => alert("에셋이 북마크에 보관되었습니다.")}
                      className="flex-1 flex flex-col items-center justify-center py-2 text-zinc-400 hover:text-blue-400 transition cursor-pointer"
                    >
                      <Tag size={18} className="mb-1" />
                      <span className="text-[10px] font-bold">저장</span>
                    </button>
                    <span className="w-px h-6 bg-zinc-900" />
                    <button
                      onClick={() => setIsShareDropdownOpen(!isShareDropdownOpen)}
                      className="flex-1 flex flex-col items-center justify-center py-2 text-zinc-400 hover:text-white transition cursor-pointer"
                    >
                      <Share2 size={18} className="mb-1" />
                      <span className="text-[10px] font-bold">공유</span>
                    </button>

                    {isShareDropdownOpen && (
                      <div ref={shareDropdownRef} className="absolute right-2 top-14 z-30 w-44 rounded-xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl">
                        <div className="text-[9px] font-black text-zinc-500 uppercase px-2 py-1 select-none border-b border-zinc-900 mb-1">
                          소셜 공유하기
                        </div>
                        <button
                          onClick={() => {
                            const shareUrl = `${window.location.origin}/studio/library/free-assets?id=${selectedAsset.id}`;
                            window.open(`https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(selectedAsset.title)}`, "_blank");
                            setIsShareDropdownOpen(false);
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-white transition cursor-pointer"
                        >
                          <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full shrink-0" />
                          카카오톡 공유
                        </button>
                        <button
                          onClick={() => {
                            const shareUrl = `${window.location.origin}/studio/library/free-assets?id=${selectedAsset.id}`;
                            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
                            setIsShareDropdownOpen(false);
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-white transition cursor-pointer"
                        >
                          <span className="w-2.5 h-2.5 bg-blue-600 rounded-full shrink-0" />
                          페이스북 공유
                        </button>
                        <button
                          onClick={() => {
                            const shareUrl = `${window.location.origin}/studio/library/free-assets?id=${selectedAsset.id}`;
                            window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(selectedAsset.title)}`, "_blank");
                            setIsShareDropdownOpen(false);
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-white transition cursor-pointer"
                        >
                          <span className="w-2.5 h-2.5 bg-zinc-400 rounded-full shrink-0" />
                          트위터 (X) 공유
                        </button>
                        <button
                          onClick={() => {
                            const shareUrl = `${window.location.origin}/studio/library/free-assets?id=${selectedAsset.id}`;
                            navigator.clipboard.writeText(shareUrl);
                            alert("공유 링크가 클립보드에 복사되었습니다!");
                            setIsShareDropdownOpen(false);
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-white transition cursor-pointer"
                        >
                          <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full shrink-0" />
                          공유 링크 복사
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <div className="flex w-full">
                      <button
                        onClick={() => {
                          if (selectedAsset.mediaType === "music" || selectedAsset.mediaType === "video") {
                            triggerDownload(selectedAsset);
                          } else {
                            setIsDownloadDropdownOpen(!isDownloadDropdownOpen);
                          }
                        }}
                        disabled={!!downloadingFormatText}
                        className={`flex-1 flex items-center justify-center gap-2 rounded-l-xl transition py-3 text-xs font-black shadow-lg cursor-pointer disabled:opacity-50 ${
                          selectedAsset.isBusinessOnly && !(membershipLevel === "business" || membershipLevel === "enterprise" || membershipLevel === "admin" || isAdmin)
                            ? "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-zinc-950"
                            : "bg-emerald-600 hover:bg-emerald-500 text-white"
                        }`}
                      >
                        {downloadingFormatText ? (
                          <>
                            <Loader2 className="animate-spin" size={14} /> {downloadingFormatText}
                          </>
                        ) : selectedAsset.isBusinessOnly && !(membershipLevel === "business" || membershipLevel === "enterprise" || membershipLevel === "admin" || isAdmin) ? (
                          <>
                            <Download size={14} /> 👑 비즈니스 등급 다운로드
                          </>
                        ) : (
                          <>
                            <Download size={14} /> 무료 다운로드
                          </>
                        )}
                      </button>
                      {selectedAsset.mediaType !== "music" && selectedAsset.mediaType !== "video" && (
                        <button
                          onClick={() => setIsDownloadDropdownOpen(!isDownloadDropdownOpen)}
                          className={`px-3 border-l transition cursor-pointer rounded-r-xl ${
                            selectedAsset.isBusinessOnly && !(membershipLevel === "business" || membershipLevel === "enterprise" || membershipLevel === "admin" || isAdmin)
                              ? "border-amber-400 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-zinc-950"
                              : "border-emerald-500 bg-emerald-600 hover:bg-emerald-500 text-white"
                          }`}
                        >
                          <ChevronDown size={14} className={`transition-transform duration-200 ${isDownloadDropdownOpen ? "rotate-180" : ""}`} />
                        </button>
                      )}
                    </div>

                    {isDownloadDropdownOpen && selectedAsset.mediaType !== "music" && selectedAsset.mediaType !== "video" && (
                      <div ref={downloadDropdownRef} className="absolute left-0 right-0 mt-2.5 z-30 rounded-xl border border-zinc-800 bg-[#0a0d14] p-3.5 shadow-2xl space-y-3.5">
                        
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest select-none">다운로드 확장자</span>
                          <div className="flex gap-4 pt-1.5">
                            {(["jpeg", "png", "webp"] as const).map((fmt) => (
                              <label key={fmt} className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 cursor-pointer select-none">
                                <input
                                  type="radio"
                                  name="downloadFormat"
                                  value={fmt}
                                  checked={downloadTargetFormat === fmt}
                                  onChange={() => setDownloadTargetFormat(fmt)}
                                  className="accent-emerald-500 rounded-full cursor-pointer"
                                />
                                {fmt.toUpperCase()}
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest select-none">크기 조절 (해상도)</span>
                          <div className="space-y-1 rounded-xl border border-zinc-900 bg-zinc-950/40 p-1.5 max-h-48 overflow-y-auto">
                            {(() => {
                              const origW = selectedAsset.width || 1920;
                              const origH = selectedAsset.height || 1080;
                              const ratio = origH / origW;

                              const sizes = [
                                { label: "작은", w: 640, h: Math.round(640 * ratio) },
                                { label: "중간", w: 1280, h: Math.round(1280 * ratio) },
                                { label: "큰 파일", w: 1920, h: Math.round(1920 * ratio) },
                                { label: "원래의", w: origW, h: origH },
                              ];

                              return sizes.map((sz, idx) => (
                                <label
                                  key={idx}
                                  className="flex items-center justify-between rounded-lg hover:bg-zinc-900/60 px-2 py-1.5 text-xs font-bold text-zinc-300 cursor-pointer"
                                >
                                  <div className="flex items-center gap-2 select-none">
                                    <input
                                      type="radio"
                                      name="selectedSize"
                                      value={idx}
                                      checked={selectedSizeIndex === idx}
                                      onChange={() => setSelectedSizeIndex(idx)}
                                      className="accent-emerald-500 rounded-full cursor-pointer"
                                    />
                                    <span>{sz.label}</span>
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase">{downloadTargetFormat.toUpperCase()}</span>
                                  </div>
                                  <span className="text-[10px] text-zinc-500 font-bold select-none">{sz.w} x {sz.h}</span>
                                </label>
                              ));
                            })()}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const origW = selectedAsset.width || 1920;
                            const origH = selectedAsset.height || 1080;
                            const ratio = origH / origW;
                            const sizes = [
                              { w: 640, h: Math.round(640 * ratio) },
                              { w: 1280, h: Math.round(1280 * ratio) },
                              { w: 1920, h: Math.round(1920 * ratio) },
                              { w: origW, h: origH },
                            ];
                            const selectedSize = sizes[selectedSizeIndex];
                            void downloadResizedImage(
                              selectedAsset.url,
                              selectedAsset.name,
                              selectedSize.w,
                              selectedSize.h,
                              downloadTargetFormat
                            );
                            setIsDownloadDropdownOpen(false);
                          }}
                          className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition py-2 text-xs font-black text-white shadow-md cursor-pointer"
                        >
                          <Download size={13} /> 다운로드
                        </button>
                      </div>
                    )}
                  </div>

                  {selectedAsset.mediaType !== "music" && selectedAsset.mediaType !== "video" && (
                    <div className="relative mt-2">
                      <button
                        onClick={() => setIsEditAccordionOpen(!isEditAccordionOpen)}
                        className="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-[#090d16]/30 hover:bg-[#121824]/40 py-3 text-xs font-black text-zinc-300 hover:text-white transition cursor-pointer animate-pulse"
                      >
                        <span className="inline-flex h-4.5 w-4.5 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-black font-mono">C</span>
                        이미지 편집 {isEditAccordionOpen ? "▲" : "▼"}
                      </button>

                      {isEditAccordionOpen && (
                        <div className="absolute left-0 right-0 mt-1 z-30 rounded-xl border border-zinc-800 bg-[#0c0f17] p-2 shadow-2xl space-y-1">
                          {[
                            { mode: "bg-removal", label: "배경 제거하기", desc: "배경을 깔끔하게 지우기" },
                            { mode: "adjust", label: "보정하기", desc: "필터 및 특수 효과 적용" },
                            { mode: "crop", label: "이미지 자르기", desc: "원하는 크기/비율로 절단" },
                            { mode: "color", label: "색상 조정하기", desc: "밝기, 대비, 채도 세밀 조절" },
                            { mode: "social", label: "소셜 미디어 게시물 만들기", desc: "인스타, 페이스북 규격 변환" },
                          ].map((item) => (
                            <button
                              key={item.mode}
                              onClick={() => {
                                const importUrl = encodeURIComponent(selectedAsset.url);
                                const title = encodeURIComponent(selectedAsset.title);
                                window.location.href = `/studio/image/workspace?imageUrl=${importUrl}&title=${title}&mode=${item.mode}`;
                              }}
                              className="flex w-full flex-col text-left rounded-lg px-3 py-2 text-xs text-zinc-400 hover:bg-zinc-900/80 hover:text-white transition cursor-pointer"
                            >
                              <span className="font-black text-zinc-200">{item.label}</span>
                              <span className="text-[9px] text-zinc-500 font-bold mt-0.5">{item.desc}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="border-t border-zinc-900 pt-5 space-y-3.5">
                    <button
                      type="button"
                      onClick={() => setIsSpecsExpanded(!isSpecsExpanded)}
                      className="flex items-center justify-between w-full text-xs font-black text-zinc-400 hover:text-white transition cursor-pointer"
                    >
                      <span className="uppercase tracking-widest">에셋 세부 사항</span>
                      <span className="text-[10px] font-bold">{isSpecsExpanded ? "세부 사항 숨기기 ▲" : "세부 사항 더보기 ▼"}</span>
                    </button>
                    
                    {isSpecsExpanded && (
                      <div className="space-y-3 pt-1.5 text-xs border-b border-zinc-900/40 pb-4">
                        <div className="flex justify-between">
                          <span className="font-bold text-zinc-500">조회수 (뷰)</span>
                          <span className="font-bold text-zinc-300">{selectedAsset.views}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-bold text-zinc-500">다운로드</span>
                          <span className="font-bold text-zinc-300">{selectedAsset.downloads}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-bold text-zinc-500">카메라</span>
                          <span className="font-bold text-zinc-300 truncate max-w-[160px] text-right" title={selectedAsset.camera || "촬영 정보 없음"}>
                            {selectedAsset.camera || "촬영 정보 없음"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-bold text-zinc-500">미디어 종류</span>
                          <span className="font-bold text-zinc-300 uppercase">
                            {selectedAsset.mimeType ? selectedAsset.mimeType.split("/")[1] : selectedAsset.mediaType}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-bold text-zinc-500">해상도</span>
                          <span className="font-bold text-zinc-300">
                            {selectedAsset.width && selectedAsset.height ? `${selectedAsset.width} x ${selectedAsset.height}` : "정보 없음"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-bold text-zinc-500">제작 방식</span>
                          <span className="font-bold text-zinc-300">
                            {selectedAsset.generationType === "ai" ? "AI 제작 에셋" : "실제 사진/촬영물"}
                          </span>
                        </div>
                        {selectedAsset.aspectRatio && (
                          <div className="flex justify-between">
                            <span className="font-bold text-zinc-500">사진 비율</span>
                            <span className="font-bold text-zinc-300">{selectedAsset.aspectRatio}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="font-bold text-zinc-500">파일 용량</span>
                          <span className="font-bold text-zinc-300">
                            {(selectedAsset.size / (1024 * 1024)).toFixed(2)} MB
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-bold text-zinc-500">등록일</span>
                          <span className="font-bold text-zinc-300">
                            {new Date(selectedAsset.createdAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-zinc-900 pt-5 space-y-2">
                    <p className="text-xs font-black text-zinc-400">태그</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedAsset.tags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => {
                            setSearchQuery(tag);
                            setSelectedAsset(null);
                            if (audioRef.current) audioRef.current.pause();
                          }}
                          className="rounded-full border border-zinc-800 bg-zinc-950/40 px-2 py-1 text-[11px] font-bold text-zinc-400 hover:border-zinc-700 hover:text-white transition cursor-pointer"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedAsset.generationType === "ai" && selectedAsset.prompt && (
                    <div className="border-t border-zinc-900 pt-5 space-y-2">
                      <div className="flex justify-between items-center select-none">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-black text-zinc-400">이미지 프롬프트</p>
                          {selectedAsset.aiTool && (
                            <span className="rounded bg-purple-500/20 text-purple-400 px-2 py-0.5 text-[9px] font-black tracking-wider">
                              {selectedAsset.aiTool}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(selectedAsset.prompt || "");
                              setPromptCopied(true);
                              setTimeout(() => setPromptCopied(false), 2000);
                            } catch (err) {
                              alert("클립보드 복사에 실패했습니다.");
                            }
                          }}
                          className="flex items-center gap-1 rounded border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white transition px-2 py-0.5 text-[10px] font-black cursor-pointer"
                        >
                          <Copy size={10} />
                          {promptCopied ? "복사 완료!" : "복사"}
                        </button>
                      </div>
                      <div className="relative rounded-xl border border-zinc-800 bg-zinc-950/40 p-3">
                        <p className="text-[11.5px] font-mono text-zinc-350 whitespace-pre-wrap break-all leading-relaxed max-h-40 overflow-y-auto custom-scrollbar">
                          {selectedAsset.prompt}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-5 border-t border-zinc-900 pt-4 text-center">
                  <p className="text-[10px] font-bold text-zinc-600 leading-normal">
                    본 자료는 CCL0(공공누리형) 라이선스로 배포되어 상업적 목적이라도 저작권자의 허락 없이 자유롭게 사용 가능합니다.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 2. 에셋 무료 업로드 나눔 신청 모달 */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-3xl border border-zinc-800 bg-[#0c0f17] text-zinc-100 p-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <UploadCloud className="text-blue-400" size={18} />
                무료 미디어 에셋 나눔하기
              </h2>
              <button
                onClick={() => {
                  setIsUploadOpen(false);
                  setUploadFiles([]);
                  setFileAspectRatios({});
                }}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-zinc-400 hover:text-white transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="mt-6 space-y-4">
              
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => uploadInputRef.current?.click()}
                className={`flex h-28 flex-col items-center justify-center rounded-2xl border-2 border-dashed transition cursor-pointer p-4 text-center ${
                  dragActive
                    ? "border-blue-500 bg-blue-500/10 text-blue-300"
                    : uploadFiles.length > 0
                    ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-300"
                    : "border-zinc-800 bg-zinc-950/20 text-zinc-500 hover:border-zinc-700"
                }`}
              >
                <input
                  ref={uploadInputRef}
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleFileChange}
                />
                
                <UploadCloud className={uploadFiles.length > 0 ? "text-emerald-400 mb-1" : "text-zinc-600 mb-1"} size={26} />
                <p className="text-xs font-black text-zinc-400">나눔할 파일들을 드래그하여 놓거나 클릭하여 추가</p>
                <p className="text-[9px] text-zinc-600 mt-0.5 font-bold">이미지(PNG/JPG/WebP/GIF), 비디오(MP4), 사운드(MP3/WAV)</p>
              </div>

              {uploadFiles.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-black text-zinc-500 uppercase select-none">
                    <span>업로드 대기 큐 ({uploadFiles.length}개 파일)</span>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadFiles([]);
                        setFileAspectRatios({});
                        setUploadTitle("");
                      }}
                      className="text-red-400 hover:text-red-300 transition cursor-pointer"
                    >
                      전체 비우기
                    </button>
                  </div>
                  <div className="max-h-36 overflow-y-auto rounded-2xl border border-zinc-900 bg-zinc-950/40 p-2 space-y-1.5 custom-scrollbar">
                    {uploadFiles.map((file, idx) => {
                      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
                      const aspect = fileAspectRatios[file.name];
                      return (
                        <div
                          key={`${file.name}-${idx}`}
                          className="flex items-center justify-between rounded-xl bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-300"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="shrink-0 text-[10px] font-black bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-md select-none">
                              {idx + 1}
                            </span>
                            <span className="truncate font-medium text-zinc-200" title={file.name}>
                              {file.name}
                            </span>
                            {aspect && (
                              <span className="shrink-0 text-[9px] font-black bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded-md select-none">
                                {aspect}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-[10px] font-bold text-zinc-600 select-none">{sizeMB} MB</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeUploadFile(idx);
                              }}
                              className="text-zinc-500 hover:text-white transition p-0.5 cursor-pointer"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <div className="flex justify-between items-center select-none">
                  <label className="text-[11px] font-black text-zinc-500 uppercase">에셋 제목</label>
                  {uploadFiles.length > 1 && (
                    <span className="text-[10px] font-bold text-blue-400">다중 업로드 시 파일명이 자동으로 제목이 됩니다.</span>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="예: 조용하고 예쁜 제주도 모래사장 (미입력 시 파일명이 제목으로 사용됩니다)"
                  required={false}
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 py-2.5 px-4 text-xs text-white outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black text-zinc-500 uppercase">미디어 분류</label>
                <select
                  value={uploadMediaType}
                  onChange={(e) => setUploadMediaType(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 py-2.5 px-4 text-xs text-white outline-none focus:border-blue-500/50 cursor-pointer"
                >
                  <option value="photo">이미지 (Photos & Images)</option>
                  <option value="illustration">일러스트 (Illustrations)</option>
                  <option value="vector">벡터 (Vectors)</option>
                  <option value="video">비디오 (Videos)</option>
                  <option value="music">음악 / 효과음 (Music & Audio)</option>
                  <option value="gif">움짤 (GIF)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black text-zinc-500 uppercase">태그 해시 태그 (쉼표 구분)</label>
                <input
                  type="text"
                  placeholder="예: 제주도, 바다, 풍경, 하늘, 여름"
                  value={uploadTags}
                  onChange={(e) => setUploadTags(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 py-2.5 px-4 text-xs text-white outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-black text-zinc-500 uppercase select-none">제작 방식</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-xs font-bold text-zinc-300 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="generationType"
                      value="real"
                      checked={uploadGenerationType === "real"}
                      onChange={() => setUploadGenerationType("real")}
                      className="accent-blue-500 rounded-full cursor-pointer"
                    />
                    실제 사진 / 촬영물
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-zinc-300 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="generationType"
                      value="ai"
                      checked={uploadGenerationType === "ai"}
                      onChange={() => setUploadGenerationType("ai")}
                    />
                    AI 제작 에셋
                  </label>
                </div>
              </div>

              {/* 카메라 정보 또는 AI 정보 */}
              {uploadGenerationType === "real" ? (
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-zinc-500 uppercase">카메라 / 촬영 기기 정보 (선택)</label>
                  <input
                    type="text"
                    placeholder="예: Sony A7R V, iPhone 15 Pro, 또는 미입력 시 '촬영 정보 없음'"
                    value={uploadCamera}
                    onChange={(e) => setUploadCamera(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 py-2.5 px-4 text-xs text-white outline-none focus:border-blue-500/50"
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-[11px] font-black text-zinc-500 uppercase">AI 제작 툴</label>
                    <select
                      value={uploadAiTool}
                      onChange={(e) => setUploadAiTool(e.target.value)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 py-2.5 px-4 text-xs text-white outline-none focus:border-blue-500/50 cursor-pointer"
                    >
                      <option value="미드져니" className="bg-[#0c0f17]">미드져니 (Midjourney)</option>
                      <option value="나노바나나" className="bg-[#0c0f17]">나노바나나 (NanoBanana)</option>
                      <option value="ChatGPT" className="bg-[#0c0f17]">ChatGPT (DALL-E 3)</option>
                      <option value="Google Flow" className="bg-[#0c0f17]">Google Flow</option>
                      <option value="클링" className="bg-[#0c0f17]">클링 (Kling)</option>
                      <option value="Grok" className="bg-[#0c0f17]">Grok</option>
                      <option value="스테이블 디퓨전" className="bg-[#0c0f17]">스테이블 디퓨전 (Stable Diffusion)</option>
                      <option value="이매진 3" className="bg-[#0c0f17]">이매진 3 (Imagen 3)</option>
                      <option value="루마" className="bg-[#0c0f17]">루마 (Luma Dream Machine)</option>
                      <option value="소라" className="bg-[#0c0f17]">소라 (Sora)</option>
                      <option value="런웨이" className="bg-[#0c0f17]">런웨이 (Runway)</option>
                      <option value="파이어플라이" className="bg-[#0c0f17]">파이어플라이 (Adobe Firefly)</option>
                      <option value="기타" className="bg-[#0c0f17]">기타 (Other)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-black text-zinc-500 uppercase">이미지 프롬프트 (선택)</label>
                    <textarea
                      placeholder="이미지를 제작할 때 사용한 영문/국문 프롬프트를 입력해 주세요. 다른 사용자가 참고할 수 있습니다."
                      value={uploadPrompt}
                      onChange={(e) => setUploadPrompt(e.target.value)}
                      rows={3}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 py-2.5 px-4 text-xs text-white outline-none focus:border-blue-500/50 resize-none"
                    />
                  </div>
                </>
              )}

              {/* 제출 */}
              <div className="flex gap-3 pt-3 border-t border-zinc-900 mt-5">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => {
                    setIsUploadOpen(false);
                    setUploadFiles([]);
                    setFileAspectRatios({});
                    setUploadGenerationType("real");
                  }}
                  className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 py-3 text-xs font-black text-zinc-400 hover:text-white transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={uploading || uploadFiles.length === 0}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 transition py-3 text-xs font-black text-white shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="animate-spin" size={14} /> {uploadProgressText || "업로드 중..."}
                    </>
                  ) : (
                    <>
                      <UploadCloud size={14} /> 미디어 라이브러리 나눔 업로드
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 3. 에셋 수정 모달 */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-3xl border border-zinc-800 bg-[#0c0f17] text-zinc-100 p-6 shadow-2xl">
            
            {/* 헤더 */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Sparkles className="text-blue-400" size={18} />
                나눔 에셋 정보 수정
              </h2>
              <button
                onClick={() => setIsEditOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-zinc-400 hover:text-white transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* 수정 양식 */}
            <form onSubmit={handleEditSubmit} className="mt-6 space-y-4">
              
              {/* 제목 */}
              <div className="space-y-1">
                <label className="text-[11px] font-black text-zinc-500 uppercase">에셋 제목</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 py-2.5 px-4 text-xs text-white outline-none focus:border-blue-500/50"
                />
              </div>

              {/* 미디어 분류 */}
              <div className="space-y-1">
                <label className="text-[11px] font-black text-zinc-500 uppercase">미디어 분류</label>
                <select
                  value={editMediaType}
                  onChange={(e) => setEditMediaType(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 py-2.5 px-4 text-xs text-white outline-none focus:border-blue-500/50 cursor-pointer"
                >
                  <option value="photo">이미지 (Photos & Images)</option>
                  <option value="illustration">일러스트 (Illustrations)</option>
                  <option value="vector">벡터 (Vectors)</option>
                  <option value="video">비디오 (Videos)</option>
                  <option value="music">음악 / 효과음 (Music & Audio)</option>
                  <option value="gif">움짤 (GIF)</option>
                </select>
              </div>

              {/* 사진 비율 */}
              <div className="space-y-1">
                <label className="text-[11px] font-black text-zinc-500 uppercase">사진 비율</label>
                <select
                  value={editAspectRatio}
                  onChange={(e) => setEditAspectRatio(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 py-2.5 px-4 text-xs text-white outline-none focus:border-blue-500/50 cursor-pointer"
                >
                  <option value="">비율 없음 (또는 사운드)</option>
                  <option value="16:9">16:9 가로</option>
                  <option value="9:16">9:16 세로</option>
                  <option value="4:3">4:3 표준</option>
                  <option value="3:4">3:4 세로</option>
                  <option value="1:1">1:1 정방향</option>
                  <option value="기타">기타 비율</option>
                </select>
              </div>

              {/* 태그 해시 */}
              <div className="space-y-1">
                <label className="text-[11px] font-black text-zinc-500 uppercase">태그 해시 태그 (쉼표 구분)</label>
                <input
                  type="text"
                  placeholder="예: 제주도, 바다, 풍경, 여름"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 py-2.5 px-4 text-xs text-white outline-none focus:border-blue-500/50"
                />
              </div>

              {/* 제작 방식 */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-black text-zinc-500 uppercase select-none">제작 방식</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-xs font-bold text-zinc-300 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="editGenerationType"
                      value="real"
                      checked={editGenerationType === "real"}
                      onChange={() => setEditGenerationType("real")}
                      className="accent-blue-500 cursor-pointer"
                    />
                    실제 사진 / 촬영물
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-zinc-300 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="editGenerationType"
                      value="ai"
                      checked={editGenerationType === "ai"}
                      onChange={() => setEditGenerationType("ai")}
                      className="accent-blue-500 cursor-pointer"
                    />
                    AI 제작 에셋
                  </label>
                </div>
              </div>

              {/* 카메라 정보 또는 AI 정보 */}
              {editGenerationType === "real" ? (
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-zinc-500 uppercase">카메라 / 촬영 기기 정보 (선택)</label>
                  <input
                    type="text"
                    placeholder="예: Sony A7R V, iPhone 15 Pro, 또는 미입력 시 '촬영 정보 없음'"
                    value={editCamera}
                    onChange={(e) => setEditCamera(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 py-2.5 px-4 text-xs text-white outline-none focus:border-blue-500/50"
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-[11px] font-black text-zinc-500 uppercase">AI 제작 툴</label>
                    <select
                      value={editAiTool}
                      onChange={(e) => setEditAiTool(e.target.value)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 py-2.5 px-4 text-xs text-white outline-none focus:border-blue-500/50 cursor-pointer"
                    >
                      <option value="미드져니" className="bg-[#0c0f17]">미드져니 (Midjourney)</option>
                      <option value="나노바나나" className="bg-[#0c0f17]">나노바나나 (NanoBanana)</option>
                      <option value="ChatGPT" className="bg-[#0c0f17]">ChatGPT (DALL-E 3)</option>
                      <option value="Google Flow" className="bg-[#0c0f17]">Google Flow</option>
                      <option value="클링" className="bg-[#0c0f17]">클링 (Kling)</option>
                      <option value="Grok" className="bg-[#0c0f17]">Grok</option>
                      <option value="스테이블 디퓨전" className="bg-[#0c0f17]">스테이블 디퓨전 (Stable Diffusion)</option>
                      <option value="이매진 3" className="bg-[#0c0f17]">이매진 3 (Imagen 3)</option>
                      <option value="루마" className="bg-[#0c0f17]">루마 (Luma Dream Machine)</option>
                      <option value="소라" className="bg-[#0c0f17]">소라 (Sora)</option>
                      <option value="런웨이" className="bg-[#0c0f17]">런웨이 (Runway)</option>
                      <option value="파이어플라이" className="bg-[#0c0f17]">파이어플라이 (Adobe Firefly)</option>
                      <option value="기타" className="bg-[#0c0f17]">기타 (Other)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-black text-zinc-500 uppercase">이미지 프롬프트 (선택)</label>
                    <textarea
                      placeholder="이미지를 제작할 때 사용한 영문/국문 프롬프트를 입력해 주세요."
                      value={editPrompt}
                      onChange={(e) => setEditPrompt(e.target.value)}
                      rows={3}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 py-2.5 px-4 text-xs text-white outline-none focus:border-blue-500/50 resize-none"
                    />
                  </div>
                </>
              )}

              {/* 제출 */}
              <div className="flex gap-3 pt-3 border-t border-zinc-900 mt-5">
                <button
                  type="button"
                  disabled={updatingAsset}
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 py-3 text-xs font-black text-zinc-400 hover:text-white transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={updatingAsset}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 transition py-3 text-xs font-black text-white shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {updatingAsset ? (
                    <>
                      <Loader2 className="animate-spin" size={14} /> 수정 중...
                    </>
                  ) : (
                    <>
                      저장하기
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 프리미엄 요금제 업그레이드 제한 모달 */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl border border-amber-500/20 bg-[#0c0f17] text-zinc-100 p-6 shadow-2xl shadow-yellow-500/5">
            
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <h2 className="text-base font-black text-amber-400 flex items-center gap-2">
                <Sparkles size={18} />
                비즈니스 등급 전용 프리미엄 에셋
              </h2>
              <button
                onClick={() => setIsUpgradeModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-zinc-400 hover:text-white transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-5 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
                <Download size={28} />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-black text-white">무제한 다운로드 권한이 필요합니다</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  "홈페이지 제작용 프리미엄 테마 갤러리"의 고해상도 이미지는 <span className="text-amber-400 font-bold">비즈니스(Business) 등급 이상의 회원</span>만 다운로드할 수 있습니다.
                </p>
              </div>

              {/* 혜택 안내 */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4 text-left space-y-2.5 text-xs text-zinc-300">
                <p className="font-black text-zinc-400 border-b border-zinc-900 pb-1.5 select-none">비즈니스 등급 특별 혜택:</p>
                <div className="flex items-start gap-2">
                  <span className="text-amber-400">✓</span>
                  <span>15대 비즈니스 카테고리별 테마 맞춤형 미드저니 고화질 이미지 무제한 다운로드</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-400">✓</span>
                  <span>AI 기획안 수립 및 AI 홈페이지 빌더 무제한 연결/제작 권한</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-400">✓</span>
                  <span>독립 도메인 무제한 연결 및 페이지 & 글 관리 기능 탑재</span>
                </div>
              </div>

              <div className="flex gap-3 pt-3.5">
                <button
                  onClick={() => setIsUpgradeModalOpen(false)}
                  className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 py-3 text-xs font-black text-zinc-300 transition cursor-pointer"
                >
                  닫기
                </button>
                <Link
                  href="/mypage"
                  className="flex-1 flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 py-3 text-xs font-black text-zinc-950 shadow-lg shadow-yellow-500/10 transition"
                >
                  비즈니스 요금제 변경
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
