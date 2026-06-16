# Brand Subdomain Blog Design Specification

## 1. Technical Rationale & Decisions

### Multi-Tenant Routing
We utilize Next.js Middleware to rewrite incoming subdomain host requests internally:
```typescript
const hostname = request.headers.get("host") || "";
const currentHost = hostname
  .replace(".localhost:3000", "")
  .replace(".creaibox.com", "");

if (currentHost && !["www", "studio", "admin"].includes(currentHost)) {
  return NextResponse.rewrite(
    new URL(`/brand/${currentHost}${request.nextUrl.pathname}`, request.url)
  );
}
```
* **DNS Wildcard (`*.creaibox.com`)**: Required on production DNS zones so that random subdomains hit the main App Server.
* **Server Wildcard Domain Configuration**: Vercel/hosting server settings must support wildcard domain routing for the domain.

---

## 2. Database Schema Details

### profiles Extensions
To track subdomain claims directly inside the unified profile table:
```sql
ALTER TABLE profiles 
ADD COLUMN requested_brand_id TEXT UNIQUE,
ADD COLUMN brand_id_status TEXT DEFAULT 'NONE' CHECK (brand_id_status IN ('NONE', 'PENDING', 'APPROVED', 'REJECTED')),
ADD COLUMN brand_id_rejection_reason TEXT;
```

### blog_categories Table
Stores custom blog sub-divisions for user header bars:
```sql
CREATE TABLE blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, slug)
);

ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own categories" ON blog_categories
  FOR ALL USING (auth.uid() = user_id);
```

### reserved_brand_ids Table
Stores blacklist/reserved keywords for subdomains registered by admins:
```sql
CREATE TABLE reserved_brand_ids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id TEXT UNIQUE NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE reserved_brand_ids ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage reserved domains" ON reserved_brand_ids
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'
    )
  );
CREATE POLICY "Public can view reserved domains" ON reserved_brand_ids
  FOR SELECT USING (true);
```

### writing_creaibox_posts Extensions
Connects articles to the specific blog section and updates RLS rules:
```sql
ALTER TABLE writing_creaibox_posts
ADD COLUMN category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL;

-- Create composite index for efficient queries on user-specific slugs
CREATE INDEX IF NOT EXISTS idx_unique_user_post_slug ON public.writing_creaibox_posts (user_id, slug);

-- Allow public read access to published posts
CREATE POLICY "Allow public select access on published posts" 
ON public.writing_creaibox_posts
FOR SELECT USING (status = 'published');
```

---

## 3. SEO & Analytics Configurations

### Google Analytics & Naver Search Advisor
Stored inside `profiles.extra_configs` via:
```json
{
  "seo_configs": {
    "google_analytics_id": "G-XXXXXXXXXX",
    "naver_verification_code": "code...",
    "meta_title_template": "{title} | {blog_title}"
  }
}
```
These values are injected into the public blog container's `<head>` during server/client rendering.

### Sitemap Generation
A dynamic `/sitemap.xml` route under the rewritten domain returns:
```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://car.creaibox.com/</loc>
  </url>
  <!-- Loop through published posts -->
  <url>
    <loc>https://car.creaibox.com/post-slug</loc>
    <lastmod>2026-06-16</lastmod>
  </url>
</urlset>
```

---

## 4. Theme & Layout Customization

For the frontend templates, we implement a visual template configuration model stored in profile configs:
```json
{
  "theme_settings": {
    "layout_style": "grid",
    "accent_color": "#3b82f6",
    "hero_title": "Car Enthusiasts Hub",
    "hero_banner_url": "https://..."
  }
}
```
Three visual layout styles are predefined in the components library:
1. **Grid Layout**: Focuses on rich visuals, thumbnail grids, and metadata info bars.
2. **List Layout**: Elegant title-first typography, ideal for news briefing lists.
3. **Magazine Layout**: Highlights a large featured post at the top, followed by card summaries below.

---

## 5. Independent Custom Domain Mapping & Routing

### Technical Design Rationale
Independent custom domain mapping is supported for premium tiers. It maps custom domains directly to user subdomains (Brand IDs) on the Vercel-hosted CreAibox app instance.

### DNS & Vercel CNAME Routing Model
1. **User Setup**: The user configures a `CNAME` record in their domain name service provider (GoDaddy, Cloudflare, etc.) pointing to their allocated brand subdomain:
    * **Host**: `@` (apex) or sub (e.g. `blog`)
    * **Target**: `{brand_id}.creaibox.com`
2. **Dynamic SSL Handshake**: When the domain points to `{brand_id}.creaibox.com`, Vercel intercepts the request and issues a dynamic Let's Encrypt SSL/TLS certificate.
3. **Internal Rewrite in Middleware**:
   Next.js edge middleware parses the host header. If it matches a non-system domain (excluding `creaibox.com`, `localhost`, etc.), it queries the Supabase `profiles` table to resolve the matching `brand_id`:
   ```typescript
   const { data: profile } = await supabase
     .from("profiles")
     .select("brand_id")
     .eq("extra_configs->>custom_domain", cleanHost)
     .eq("extra_configs->>custom_domain_status", "APPROVED")
     .maybeSingle();
   ```
   If a profile is resolved, it transparently rewrites paths internally to `/brand/${brand_id}${path}` while retaining session cookies.

### Admin Real-time Diagnostics Check
The Admin console validates configuration status on demand by:
* **DNS CNAME lookup**: Queries Cloudflare's JSON-over-HTTPS (DoH) API (`https://cloudflare-dns.com/dns-query?name={custom_domain}&type=CNAME`) to verify it targets `{brand_id}.creaibox.com` or `creaibox.com`.
* **SSL & Routing Verification**: Fetches the diagnostic endpoint `https://{custom_domain}/.well-known/creaibox-diagnostics`. If the middleware returns a successful JSON body containing `brandId` matching the user's mapped subdomain, it confirms 100% operational DNS, SSL, and routing.
* **CORS Safe fallback**: If direct fetch is blocked, falls back to `{ mode: 'no-cors' }` request testing to verify basic network visibility.
