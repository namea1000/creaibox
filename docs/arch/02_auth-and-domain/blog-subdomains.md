# Brand Subdomain & Custom Domain Blog Architecture

> **문서 분류**: 아키텍처 기술 명세서 (Architecture Spec)
> **연관 실무 매뉴얼**: `docs/project/manual/02_auth-and-domain/domain-transfer-guide.md`
> **연관 DB 스키마**: `docs/database/blog-subdomains-schema.md`
> **연관 실행 SQL**: `docs/database/sql/blog-subdomains.sql`

---

## 1. Purpose

The Brand Subdomain & Custom Domain Blog system enables CreaiBox users to launch their personal branding blogs under customized subdomains (e.g., `brand-id.creaibox.com`) or completely independent custom domains (e.g., `mybrand.com`). It bridges AI content generation and direct publication, allowing creators to manage their categories, SEO keys, templates, and analytics under a unified console.

---

## 2. Main Features

* **Brand ID (Subdomain) Allocation**: Request, review, and approval flow for securing custom subdomains.
* **Independent Custom Domain Mapping**: Enables Pro users to link their own domains (CNAME record pointing to `{brandId}.creaibox.com`).
* **SSL/TLS Dynamic Provisioning**: Automatically requests and provisions SSL certificates (Let's Encrypt) via Vercel's edge network.
* **Next.js Subdomain/Domain Rewriting**: Middleware intercepts incoming hostname requests (both subdomains and custom domains) and transparently rewrites paths internally.
* **Admin Connection Diagnostics**: Real-time validation panel in the admin console to check DNS CNAME resolution, HTTPS SSL handshake, and Next.js middleware routing.
* **Category & Navigation Management**: Add, update, and remove categories that populate the header navigation dynamically.
* **Blog Templates & Visual Customizer**: Simple theme presets with hero image and primary color accent controls.
* **Rank Math & Analytics Integration**: SEO meta tags, canonical link generation, Google Analytics 4 tracking, and Naver Search Advisor integrations.
* **Dynamic Sitemap Generation**: Automated `/sitemap.xml` listing all published posts for search indexing.
* **Traffic stats dashboard**: Visual charts for page views, unique visitors, and popular articles.

---

## 3. UI Structure

* **Domain Settings Panel (`/mypage`)**: Interface to check availability and submit subdomain requests.
* **Admin Brand Dashboard (`/admin/brands`)**: Backoffice dashboard for administrators to:
  * View, approve, or reject brand subdomain requests.
  * View, approve, reject, and run live connection diagnostics for custom domain request mappings.
  * Manage reserved/blacklist keywords.
* **User Blog Console (`/studio/writing/creaibox/blog-management`)**:
  * Category Manager tab.
  * Theme Customizer tab.
  * Analytics & SEO Verification tab.
  * Independent Custom Domain Mapping tab (DNS guides and request status console).
  * Traffic Stats tab.
* **Public Tenant Page Container (`/brand/[brand_id]`)**: Renders custom-branded homepage and post reading templates.

---

## 4. Component Structure

```txt
src/
├── app/
│   ├── brand/
│   │   └── [brand_id]/
│   │       ├── page.tsx               # Blog Home
│   │       ├── [slug]/
│   │       │   └── page.tsx           # Post Detail Page (/[slug])
│   │       └── category/
│   │           └── [slug]/
│   │               └── page.tsx       # Category List Page (/category/[slug])
│   ├── mypage/
│   │   └── page.tsx                   # Subdomain request UI
│   ├── admin/
│   │   └── brands/
│   │       └── page.tsx               # Admin approve/reject & blacklist console with Diagnostics
│   └── studio/
│       └── writing/
│           └── creaibox/
│               └── blog-management/
│                   └── page.tsx       # User blog control dashboard with Custom Domain tab
├── components/
│   └── brand/                         # Common blog theme components
└── middleware.ts                      # Subdomain/Domain rewrite interceptor
```

---

## 5. Database Structure

* **`profiles` (Modified)**:
  * `brand_id`: Approved custom subdomain.
  * `requested_brand_id`: Requested subdomain name.
  * `brand_id_status`: Verification status (`NONE`, `PENDING`, `APPROVED`, `REJECTED`).
  * `brand_id_rejection_reason`: Rejection notes.
  * `extra_configs` (JSONB):
    * `custom_domain`: Approved independent domain mapping.
    * `requested_custom_domain`: Pending custom domain request.
    * `custom_domain_status`: Connection mapping status (`NONE`, `PENDING`, `APPROVED`, `REJECTED`).
    * `custom_domain_rejection_reason`: Rejection feedback.
* **`blog_categories` (New)**:
  * `id`: UUID Primary Key.
  * `user_id`: Owner link.
  * `name`: Display name.
  * `slug`: URL slug.
* **`reserved_brand_ids` (New)**:
  * `id`: UUID Primary Key.
  * `brand_id`: Reserved subdomain keyword (e.g. apple, admin).
  * `category`: Reservation taxonomy such as `SYSTEM`, `TRADEMARK`, `PAYMENT_SECURITY`, `COMMON_SERVICE`.
  * `reason`: Text reasoning.
  * Large seed source and import guidance: `docs/database/reserved-brand-ids.md`.
* **`writing_creaibox_posts` (Modified)**:
  * `category_id`: Links posts to user blog categories.

---

## 6. Responsive UI & Mobile Full-Width Standard

To maximize reading comfort across mobile and desktop devices:
* **Mobile (< 640px)**: The article container uses full-width layout without outer border boxing (`border-0`, `rounded-none`, `shadow-none`, `px-3.5`), ensuring zero wasted horizontal space and seamless reading flow.
* **Desktop (≥ 640px)**: The container maintains an elegant card boundary (`border`, `rounded-xl`, `shadow-sm`, `bg-[#f4f6fa]`, `px-8`) with right-side sticky widgets.

