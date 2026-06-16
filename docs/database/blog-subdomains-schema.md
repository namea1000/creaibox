# Brand Subdomain Blog Database Schema

## 1. Purpose
This database schema extension supports user-specific subdomain blogs (e.g. `car.creaibox.com`), category classification, sitemaps, analytics keys, and administrative reservation/blacklist controls.

---

## 2. Table Modifications

### 2-1. `profiles` Table (Extensions)
We store user-specific subdomain requests and approval statuses inside the core profile table, and use the `extra_configs` JSONB field to map independent custom domains for backward compatibility.

| Column | Type | Constraints | Purpose |
| --- | --- | --- | --- |
| `brand_id` | `text` | `UNIQUE` | Approved primary brand subdomain (e.g. `blog`) |
| `requested_brand_id` | `text` | `UNIQUE`, check regex `^[a-z0-9]{2,15}$` | Subdomain requested by the user |
| `brand_id_status` | `text` | default `'NONE'`, check IN `('NONE', 'PENDING', 'APPROVED', 'REJECTED')` | Approval status for the brand ID request |
| `brand_id_rejection_reason` | `text` | | Admin feedback notes if brand ID is rejected |
| `extra_configs` | `jsonb` | | Stores theme customizer values and custom domain mapping details |

#### properties inside `profiles.extra_configs`
* **`custom_domain`** (`text` / null): Approved independent custom domain (e.g., `mybrand.com`).
* **`requested_custom_domain`** (`text` / null): Pending independent custom domain mapping requested by the user.
* **`custom_domain_status`** (`text`): default `'NONE'`. Active status values: `('NONE', 'PENDING', 'APPROVED', 'REJECTED')`.
* **`custom_domain_rejection_reason`** (`text` / null): Admin feedback notes if domain mapping is rejected.
* **`brand_ids`** (`array`): List of additional secondary brand IDs approved for this user.

---

### 2-2. `writing_creaibox_posts` Table (Extensions)
Links published posts to custom user blog categories.

| Column | Type | Constraints | Purpose |
| --- | --- | --- | --- |
| `category_id` | `uuid` | `REFERENCES blog_categories(id) ON DELETE SET NULL` | Linked blog category |

* **Composite Search Index**:
  * `idx_unique_user_post_slug` on `(user_id, slug)` to accelerate subdomain and post URL mappings.

---

## 3. New Tables

### 3-1. `blog_categories` Table
Stores user-defined categories for blog header navigation.

| Column | Type | Constraints | Purpose |
| --- | --- | --- | --- |
| `id` | `uuid` | `PRIMARY KEY`, default `gen_random_uuid()` | Unique category identifier |
| `user_id` | `uuid` | `REFERENCES profiles(id) ON DELETE CASCADE` | Category owner |
| `name` | `text` | | Category name displayed in UI |
| `slug` | `text` | | Category URL slug |
| `created_at` | `timestamptz` | default `now()` | Creation timestamp |

* **Composite Unique Constraint**: `unique_user_category_slug` on `(user_id, slug)` to prevent duplicate slugs for the same user.

---

### 3-2. `reserved_brand_ids` Table
Stores blacklisted/reserved subdomain keywords managed by admins.

| Column | Type | Constraints | Purpose |
| --- | --- | --- | --- |
| `id` | `uuid` | `PRIMARY KEY`, default `gen_random_uuid()` | Unique reservation identifier |
| `brand_id` | `text` | `UNIQUE` | Reserved subdomain name (e.g., apple, admin) |
| `reason` | `text` | | Optional description (e.g., Trademark protection) |
| `created_at` | `timestamptz` | default `now()` | Creation timestamp |

---

## 4. Row Level Security (RLS) Policies

### `blog_categories`
* **Insert/Update/Delete/Select (Owner)**: `auth.uid() = user_id` (Allows logged-in owners to manage their categories).
* **Select (Public)**: `true` (Allows general visitors to load the header categories).

### `reserved_brand_ids`
* **All (Admins)**: Checks if `auth.uid()` has `role = 'ADMIN'` in `profiles`.
* **Select (Public)**: `true` (Allows general public to check domain availability during sign-up/settings).

### `writing_creaibox_posts` (Select policy added)
* **Select (Public)**: `status = 'published'` (Allows any guest user to view published articles on subdomains or the official blog).

---

## 5. RPC Database Functions

### `get_brand_id_by_custom_domain(domain_name TEXT)`
- **Purpose**: Maps a custom domain host name to its matching brand subdomain (Brand ID).
- **Behavior**: Scans `extra_configs` dynamically for keys starting with `custom_domain_` matching the requested host and having status `APPROVED`. Returns the corresponding brand ID or `NULL` if not found.

