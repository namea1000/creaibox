# Implementation Plan - Draft Editing & Re-Publish / Update Flow for Published Posts

Currently, edits to a published post are saved and go live immediately on the public blog because the public blog reads directly from the database columns that are auto-saved.
We will separate the **draft/working copy** from the **live published copy** using a JSON snapshot field. Edits will auto-save to the database columns in the background but will NOT go live on the public blog until the user explicitly clicks the **"블로그 재발행"** (Re-publish to Blog) or **"업데이트"** (Update) button.

---

## User Action Required (Prerequisite)

Before starting the implementation, please execute the following SQL migration in your **Supabase Dashboard SQL Editor** to add a `published_snapshot` JSON column:

```sql
ALTER TABLE public.writing_creaibox_posts
ADD COLUMN IF NOT EXISTS published_snapshot jsonb;
```

---

## Proposed Changes

### Database Query Mapping

#### [MODIFY] [manuscripts.ts](file:///Users/a1234/Local%20Sites/creaibox/src/lib/queries/manuscripts.ts)
- Extend the `StudioManuscriptRecord` interface to include `publishedSnapshot?: any;`.
- Map the new `published_snapshot` column in `mapCreaiboxRecord`:
  ```typescript
  publishedSnapshot: record.published_snapshot || undefined,
  ```

---

### Public Blog Page Updates

We will update all public blog routes to read from the `published_snapshot` JSON data if it exists. If it does not exist (e.g. for existing published posts), they will fall back to reading the main table columns for backwards compatibility.

#### [MODIFY] [[slug]/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/brand/%5Bbrand_id%5D/%5Bslug%5D/page.tsx)
- Select `published_snapshot` in the query of `fetchPost`.
- Reconstruct the `post` detail fields with values from `published_snapshot` if present.

#### [MODIFY] [page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/brand/%5Bbrand_id%5D/page.tsx)
- Select `published_snapshot` in the query of `postsData`.
- Reconstruct the `posts` card fields with values from `published_snapshot` if present.

#### [MODIFY] [[slug]/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/brand/%5Bbrand_id%5D/category/%5Bslug%5D/page.tsx)
- Select `published_snapshot` in the query of `postsData` in Category.
- Reconstruct the `posts` card fields with values from `published_snapshot` if present.

---

### Editor Workspace & Re-Publish Flow

#### [MODIFY] [list/[id]/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/list/%5Bid%5D/page.tsx)
- In the SQL select query for loading the manuscript (line 585), select `published_snapshot`.
- Add a helper state/check to see if the current draft has unsaved changes compared to the published snapshot:
  - Check if `data.status === "published"`.
  - Compare `title`, `content`, `slug`, `metaDescription`, `focusKeyword`, `categoryId`, `tocEnabled`, and `seoTags` of `data` against `data.publishedSnapshot`.
- In `handlePublish` (Re-publish / Update):
  - When the user clicks the publish button:
    - Create a JSON snapshot object containing all current draft fields.
    - Call `handleSave("published")` but pass the snapshot object as an update payload to write to the `published_snapshot` column.
- In `handleCancelPublish`:
  - Reset `published_snapshot` to `null` to clear the snapshot.
- Update the UI Header buttons:
  - If `data.status === "published"`:
    - Change button label from **"블로그 발행"** to **"블로그 재발행"** (or **"업데이트"**).
    - Render a status badge next to the save indicator:
      - If there are differences between the draft and the published snapshot: show **"수정 중 (미반영)"** (yellow warning badge).
      - If they match: show **"발행 완료 (최신)"** (green check badge).
