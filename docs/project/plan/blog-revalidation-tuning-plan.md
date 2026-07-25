# Implementation Plan - Blog Caching & Revalidation Performance Tuning

We will optimize the blog page load speeds for production deployment by tuning Next.js page caching and setting up precise on-demand cache revalidation.

---

## Proposed Changes

### Revalidation API Optimization

#### [MODIFY] [route.ts](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/revalidate-blog/route.ts)
- Rewrite the `/api/revalidate-blog` API route to support:
  - Revalidating the brand home feed: `/brand/${brandId}` and `/`.
  - Revalidating the post detail: `/brand/${brandId}/${slug}` and `/${slug}`.
  - Querying categories from Supabase to fetch slugs for the array of `categoryIds`, and revalidating `/brand/${brandId}/category/${cat.slug}` and `/category/${cat.slug}`.
  - Maintaining backward compatibility for legacy calls.

---

### Editor Workspace Revalidation Triggers

#### [MODIFY] [list/[id]/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/list/%5Bid%5D/page.tsx)
- Define a reusable `triggerRevalidation` helper callback.
- Invoke it in `handlePublish` with the current post slug, brand ID, and selected category IDs.
- Invoke it in `handleCancelPublish` to clear the cache instantly when a post is unpublished.

---

## Verification Plan

### Automated Tests
- Run `npx tsc --noEmit` to verify type safety and ensure no compilation errors are introduced.

### Manual Verification
1. Publish/update a post in the studio workspace.
2. Verify that the post is updated instantly on the public brand homepage and category pages.
3. Unpublish the post and verify it disappears immediately from the public pages.
