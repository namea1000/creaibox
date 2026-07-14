# Web Accessibility Guidelines: Textless Icon Button Rules

## 1. Overview & Goal

Google PageSpeed Insights (Lighthouse) audits accessibility under strict web standards (W3C WCAG). One of the most common issues that drops the Accessibility score from **100%** to **92%** (or lower) is:

> ❌ **"Buttons must have discernible text"** (버튼은 식별 가능한 텍스트를 제공해야 합니다)

This guideline documents the rules for textless icon buttons (such as search magnifying glasses, dark mode switchers, close buttons, and mobile hamburger menus) to prevent this regression in future site developments.

---

## 2. The Issue: Why It Fails

Interactive elements like `<button>` or custom components wrapping only an SVG icon (e.g., Lucide React icons) contain no plain text. Screen readers (used by visually impaired users) cannot describe the purpose of the button, leading to a direct accessibility penalty.

### ❌ Incorrect Pattern (Fails Lighthouse Audit)
```tsx
import { Search } from "lucide-react";

// Google PageSpeed will fail because the button has no visible text nor text alternatives.
<button
  onClick={onSearchOpen}
  className="p-2 rounded-lg text-zinc-500 hover:text-black"
>
  <Search size={18} />
</button>
```

---

## 3. The Solution: Best Practices

There are two primary methods to pass the accessibility audit successfully.

### Option A: Using `aria-label` (Recommended)
Add a descriptive `aria-label` attribute directly to the button element describing the exact action.

```tsx
import { Search } from "lucide-react";

// ✅ Correct Pattern (Passes Lighthouse Audit)
<button
  onClick={onSearchOpen}
  aria-label="검색창 열기"
  className="p-2 rounded-lg text-zinc-500 hover:text-black"
>
  <Search size={18} />
</button>
```

### Option B: Using Screen-Reader-Only Text (`sr-only`)
Use a hidden `<span>` tag wrapped inside the button with Tailwind CSS's `.sr-only` class. This hides the text visually but keeps it readable by assistive technologies.

```tsx
import { Search } from "lucide-react";

// ✅ Correct Pattern (Passes Lighthouse Audit)
<button
  onClick={onSearchOpen}
  className="p-2 rounded-lg text-zinc-500 hover:text-black"
>
  <Search size={18} />
  <span className="sr-only">검색창 열기</span>
</button>
```

---

## 4. Standard Code Snippets for Copy-Paste

When building new headers, navigation blocks, or custom layouts, use these pre-approved patterns:

### 🔍 Search Toggle Button
```tsx
import { Search, X } from "lucide-react";

// Search Open Toggle
<button aria-label="검색창 열기" onClick={() => setIsSearchOpen(true)}>
  <Search size={18} />
</button>

// Search Close Button
<button aria-label="검색창 닫기" onClick={() => setIsSearchOpen(false)}>
  <X size={16} />
</button>
```

### 🌙 Dark/Light Mode Theme Toggle
```tsx
import { Sun, Moon } from "lucide-react";

<button
  aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
  onClick={toggleTheme}
>
  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
</button>
```

### 🍔 Mobile Menu (Hamburger) Button
```tsx
import { Menu, X } from "lucide-react";

// Menu Open Trigger
<button aria-label="네비게이션 메뉴 열기" onClick={toggleSidebar}>
  <Menu size={20} />
</button>

// Menu Close Trigger
<button aria-label="네비게이션 메뉴 닫기" onClick={closeSidebar}>
  <X size={20} />
</button>
```

---

## 5. Verification Checklist

Before publishing any new header or interactive UI component, verify the following:
- [ ] Every `<button>` tag wrapping only an icon has a valid `aria-label`.
- [ ] Every custom trigger `<div role="button">` has an associated `aria-label`.
- [ ] Ensure that labels are descriptive and localize them (Korean/English) depending on the target site language setting.
