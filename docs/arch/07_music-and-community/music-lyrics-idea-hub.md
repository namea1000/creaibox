# Music Lyrics Idea Hub - Operational Documentation

## 1. Purpose
The **Music Lyrics Idea Hub** (가사 소재 아이디어 허브) provides users with a searchable, categorized library of lyric templates, storylines, settings, and keyword combinations. It helps songwriters and producers quickly select a premise, genre, and mood, then directly bridge into the AI Album Planner or the AI Lyrics Generation pipelines.

---

## 2. Main Features
1. **Multi-Dimension Filtering**:
   * Filter templates by **Genres** (시티팝, 발라드, R&B, EDM, 힙합, 어쿠스틱 등) or **Themes** (사랑, 이별, 위로, 청춘, 레트로, 우주/몽환 등).
2. **Descriptive Lyric Templates**:
   * Each template provides a title, setting/location, story background, vocal direction, instrument suggestions, tempo range, and key search tags.
3. **Smart Search**:
   * Instantly query templates, keywords, and settings.
4. **Direct Bridge Shortcuts (CTAs)**:
   * **앨범 기획하기 (Create Album Plan)**: Navigates to the planning form with pre-filled inputs.
   * **가사 바로 생성 (Generate Lyrics Directly)**: Navigates to the Suno/Lyrics generator with pre-filled parameters.

---

## 3. UI Structure
```
+-------------------------------------------------------------+
|                     Hero Search Banner                      |
|           "관심있는 장르나 분위기를 입력하세요..."          |
+-------------------------------------------------------------+
|    Category Tabs: [장르별 대분류] | [테마별 대분류]         |
+-------------------------------------------------------------+
|    Detailed Grid: [Ballad]  [City Pop]  [EDM/Dance]  ...    |
+-------------------------------------------------------------+
|  Planner Panel:                                             |
|  +--------------------+----------------------------------+  |
|  |  Recommended       |  Lyrics Topic Templates          |  |
|  |  Series:           |  1. Template Title (Keywords)    |  |
|  |  * 밤의 추억       |     [Description / Place / Story]|  |
|  |  * 우울한 새벽     |     [앨범 기획]  [1곡 가사 생성] |  |
|  |  * 비오는 거리     |  2. Template Title               |  |
|  +--------------------+----------------------------------+  |
+-------------------------------------------------------------+
```

---

## 4. Database Structure
* Currently utilizes a local read-only static schema in the client bundle (`src/lib/music-lyrics-planner/`) to ensure fast page loads, offline accessibility, and zero-latency searching.

---

## 5. API Structure
* **Query Parameter Integration**:
  * `/studio/music/planning?theme=...&genre=...&mood=...&vocal=...&instrument=...&tempo=...`
  * `/studio/music/lyrics?theme=...&genre=...&mood=...&vocal=...&instrument=...&tempo=...`

---

## 6. Component Structure
* Page Route: `src/app/studio/music/lyrics/idea-hub/page.tsx`
* Library Folder: `src/lib/music-lyrics-planner/`
  * `types.ts` (Core TypeScript types)
  * `topic-categories.ts` (Categories definitions)
  * `topic-series.ts` (Templates list mapping)
  * `utils.ts` (Url helpers and string formatting)
  * `idea-series/` (Segmented template files)

---

## 7. Future Expansion
* **User Custom Templates**: Allow creators to save custom themes to Supabase `music_lyric_custom_templates`.
* **Social Sharing**: Enable public sharing of lyric templates so other creators can write lyrics using shared presets.
