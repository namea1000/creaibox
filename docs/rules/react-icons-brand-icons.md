# React Icons 브랜드 아이콘 사용 규칙

## 목적

CreAibox 프로젝트에서는 Google, YouTube, Instagram, TikTok 등 외부 서비스의 브랜드 아이콘을 표시할 때 `lucide-react` 대신 `react-icons`를 사용한다.

브랜드 아이콘은 공식 로고와 최대한 유사한 형태를 유지해야 하므로 `react-icons/si`(Simple Icons)를 기본 표준으로 사용한다.

---

# 설치

```bash
npm install react-icons
```

---

# 기본 원칙

## 브랜드 아이콘

사용

```tsx
import { SiYoutube } from "react-icons/si";
```

사용 예

```tsx
<SiYoutube size={20} />
```

---

## 일반 UI 아이콘

사용

```tsx
import { Search } from "lucide-react";
```

사용 예

```tsx
<Search size={20} />
```

---

# 사용 기준

## react-icons/si 사용

브랜드 및 외부 서비스

* Google

* YouTube

* Instagram

* TikTok

* Naver

* Facebook

* Threads

* LinkedIn

* Pinterest

* Reddit

* OpenAI

* Claude

* Gemini

* Perplexity

* GitHub

* Supabase

* Vercel

* Google Cloud

* Spotify

* Vimeo

* Discord

* Telegram

* WhatsApp

* n8n

---

## lucide-react 사용

일반 UI

* Search
* Settings
* Users
* FileText
* Folder
* Database
* CreditCard
* ShieldCheck
* Video
* Music
* Image
* Calendar
* Bell
* Mail

---

# Google 서비스

```tsx
import {
  SiGoogle,
  SiGoogleanalytics,
  SiGooglesearchconsole,
  SiGooglecalendar,
  SiGoogledrive,
  SiGoogledocs,
  SiGooglesheets,
} from "react-icons/si";
```

사용처

* Google 연동
* Google Analytics
* Search Console
* Google Calendar
* Google Drive
* Google Docs
* Google Sheets

---

# 콘텐츠 플랫폼

```tsx
import {
  SiYoutube,
  SiInstagram,
  SiTiktok,
  SiNaver,
  SiFacebook,
  SiThreads,
  SiLinkedin,
  SiPinterest,
  SiReddit,
} from "react-icons/si";
```

사용처

* Content Planner
* Video Studio
* Social Studio
* Trend Studio

---

# AI 서비스

```tsx
import {
  SiOpenai,
  SiClaude,
  SiGooglegemini,
  SiPerplexity,
} from "react-icons/si";
```

사용처

* API Vault
* AI Model Selector
* AI Provider Settings

---

# 개발 서비스

```tsx
import {
  SiGithub,
  SiSupabase,
  SiVercel,
  SiGooglecloud,
  SiN8N,
} from "react-icons/si";
```

사용처

* 관리자 페이지
* 개발자 도구
* 연동 설정

---

# 플랫폼 배열 예시

```tsx
const platforms = [
  { label: "Creaibox 블로그", icon: FileText },
  { label: "네이버 블로그", icon: SiNaver },
  { label: "YouTube Shorts", icon: SiYoutube },
  { label: "YouTube 롱폼", icon: SiYoutube },
  { label: "TikTok", icon: SiTiktok },
  { label: "Instagram Reels", icon: SiInstagram },
];
```

---

# 최종 규칙

```txt
브랜드 아이콘
→ react-icons/si

일반 UI 아이콘
→ lucide-react
```

이 규칙은 CreAibox 전체 프로젝트의 기본 아이콘 정책으로 적용한다.
