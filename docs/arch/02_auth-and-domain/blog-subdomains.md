# Brand Subdomain & Custom Domain Blog Architecture

## 1. Purpose

The Brand Subdomain & Custom Domain Blog system enables CreAibox users to launch their personal branding blogs under customized subdomains (e.g., `brand-id.creaibox.com`) or completely independent custom domains (e.g., `mybrand.com`). It bridges AI content generation and direct publication, allowing creators to manage their categories, SEO keys, templates, and analytics under a unified console.

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
