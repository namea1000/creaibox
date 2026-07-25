# Implementation Plan - Multiple Category Selection for Blog Posts

We will enhance the CreAibox blog post category configuration to support selecting multiple categories per post instead of just one. Posts will appear under all of their selected categories on the brand blog.

---

## User Action Required (Prerequisite)

Before starting the implementation, please execute the following SQL migration in your **Supabase Dashboard SQL Editor** to add a `category_ids` UUID array column:

```sql
ALTER TABLE public.writing_creaibox_posts
ADD COLUMN IF NOT EXISTS category_ids uuid[];
```

---

## Proposed Changes

### Database Query Mapping

#### [MODIFY] [manuscripts.ts](file:///Users/a1234/Local%20Sites/creaibox/src/lib/queries/manuscripts.ts)
- Extend the `StudioManuscriptRecord` interface to include `categoryIds?: string[];`.
- Extend the `WritingCreaiboxPostRecord` interface to include `category_ids?: string[] | null;`.
- Map `category_ids` in `mapCreaiboxRecord`:
  ```typescript
  categoryIds: Array.isArray(record.category_ids) ? record.category_ids : (record.category_id ? [record.category_id] : []),
  ```

#### [MODIFY] [list/[id]/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/list/%5Bid%5D/page.tsx)
- Map `published_snapshot` and `category_ids` in `normalizeCreaiboxRecord`.
- Update `handleSave` payload:
  - Save `category_ids: safeData.categoryIds || []`.
  - Maintain backwards compatibility for legacy modules by saving `category_id: safeData.categoryIds?.[0] || null`.
  - Include `category_ids` and `category_id` in the `published_snapshot` object payload when status is `"published"`.

---

### Editor UI Component Updates

#### [MODIFY] [CreaiboxSeoOptimizationPanel.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/creaibox/tabs/CreaiboxSeoOptimizationPanel.tsx)
- Change selection logic:
  - Check checkbox if `data.categoryIds?.includes(cat.id)` or `data.categoryId === cat.id`.
  - In `handleSelectCategory`:
    - Toggle checked state: if checked, remove ID from array; if unchecked, add ID to array.
    - Call `updateLocalData` updating `categoryIds` with the new array, and `categoryId` set to `categoryIds[0]` (for backwards compatibility).

---

### Public Blog Page Filter Updates

#### [MODIFY] [[slug]/page.tsx](file:///Users/a1234/Local%2520Sites/creaibox/src/app/brand/%255Bbrand_id%255D/category/%255Bslug%255D/page.tsx)
- Remove `.eq("category_id", category.id)` database filter constraint from query to retrieve all published posts.
- Perform filtering in memory using both `published_snapshot.category_ids` (and legacy fallback `category_id` / `category_ids` database columns) to support drafts and multiple categories.

---

## Verification Plan

### Automated Tests
- Run `npx tsc --noEmit` to verify type safety and ensure no compilation errors are introduced.

### Manual Verification
1. Open the post editor, expand "포스팅 기본 설정".
2. Select multiple categories (e.g. `골프 레슨` and `골프 스토리`).
3. Press **"블로그 재발행"** (or let it auto-save).
4. Verify that the post is visible under both categories on the public blog.
