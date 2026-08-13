# Music Lyrics Idea Hub - Design Specification

## 1. Architectural Decisions

### Static Data Architecture
* **Decision**: We store category and template definition files locally under `src/lib/music-lyrics-planner/` rather than querying them from a database.
* **Rationale**: 
  * Over 50+ rich templates containing large descriptions can trigger high database read charges.
  * Storing them in the client bundle ensures zero-latency search queries, instant client-side filtering, and eliminates database connection overhead during navigation.
  * The file segmentation pattern (`idea-series/ballad.ts`, `idea-series/citypop.ts`, etc.) prevents file bloating and allows clean git branch merging.

---

## 2. API & Parameter Integration

### Stateless Navigation (Query Parameters)
* **Decision**: We use Next.js routing query parameters instead of global state (Zustand/Redux) or context to transfer selected template properties.
* **Rationale**:
  * Users can bookmark direct links (e.g. sharing a specific preset layout link with a colleague).
  * Simplifies page responsibility and decouples the Idea Hub page entirely from the planning and lyrics engines.
  * Parameter translation/mapping is handled in `music-lyrics-planner/utils.ts` to keep page files lightweight.

---

## 3. Suspense Refactor Rationale

* **Problem**: Next.js client components using `useSearchParams()` de-optimize static rendering during build time, converting the entire page path to client-side rendering.
* **Decision**: In both `/studio/music/planning/page.tsx` and the new `/studio/music/lyrics/idea-hub/page.tsx`, the main layout must be moved into a subcomponent (e.g., `MusicPlanningPageContent`) and the page component must export a `<Suspense>` wrapper.
* **Rationale**: Keeps Next.js compile-time features intact, prevents build warnings, and improves initial page load metrics.

---

## 4. UI/UX Decisions

* **Category Light-Up Effect**: Clicking a main category group (e.g. 테마) highlights only the sub-categories belonging to that group, while dimming others. This matches the interactive visual feedback established in the Content Planner.
* **Action CTAs**: 
  * **앨범 기획하기**: Takes the template name, genre, and mood, and automatically registers them into the active preset input field on the Album Planning page.
  * **가사 바로 생성**: Populates the 1-song generation form and initializes direct AI writing.

---

## 5. Technical Considerations
* **Next.js Route Structure**: The path `/studio/music/lyrics/idea-hub` keeps files logically grouped inside the existing `lyrics` folder.
* **Icon Library**: All icons must use `lucide-react` (e.g. `Lightbulb`, `Music`, `Heart`, `Sparkles`, `Search`, `ArrowRight`).
