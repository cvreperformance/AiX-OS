# AiX OS Public YouTube Video Intelligence Media Platform

## Overview

The **Public Video Intelligence Media Platform** (`/videos`) provides all public visitors of AiX OS with a dark luxury media center featuring curated intelligence briefings across Real Estate, Markets, Investments, Business Intelligence, Education, Executive Interviews, and AI Technology.

---

## Architecture & Data Layer

- **Public Route**: `/videos` (Accessible to all visitors without authentication requirement).
- **Data Source**: `src/data/videos.ts` (Local TypeScript object array; zero database table or Supabase storage dependencies).
- **Extensibility**: Standardized `Video` interface with `id`, `title`, `description`, `youtubeId`, `category`, `publishedDate`, `duration`, `featured`, `tags`, `author`, and `views`.

---

## Component Breakdown

1. **`VideoPlayer.tsx`**: Facade Youtube player component.
   - Initial state: High-resolution static YouTube thumbnail overlay (`img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`), dark gradient, and interactive play button.
   - On user click: Dynamically mounts `<iframe src="https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0" loading="lazy" />`.
   - Result: 0 YouTube scripts or tracking network calls on initial page load.

2. **`FeaturedVideo.tsx`**: Hero briefing banner featuring the primary video, executive summary, category tags, and private investment advisory CTA.

3. **`VideoCard.tsx`**: Preview card with hover magnification, duration pill, category badge, view counter, and author credit.

4. **`VideoGrid.tsx`**: Responsive grid wrapper with smooth entry transitions and empty state handling.

5. **`VideoCategoryFilter.tsx`**: Category pill selectors + instant keyword search input.

6. **`VideoContainer.tsx`**: Interactive Client Component managing search filtering, category selection, and modal player view.

---

## Performance Strategy

- **Core Web Vitals**: Zero YouTube iframe scripts are downloaded until explicit user interaction (click-to-play).
- **Bundle Footprint**: No third-party video libraries; relies purely on standard React and Lucide icons.
- **Targets**:
  - Desktop Performance: ≥ 95
  - Mobile Performance: ≥ 90
  - LCP < 2.5s | CLS < 0.1 | INP < 200ms

---

## SEO & GEO Optimization

- **Metadata**: Next.js `metadata` title (`AiX OS Intelligence Media | Videos`), description, canonical link (`https://os.cristianvaduva.com/videos`), and OpenGraph tags.
- **Structured Data**: Injects Schema.org JSON-LD graph (`WebPage`, `CollectionPage`, `BreadcrumbList`, `VideoObject`) for search engines and AI engines (ChatGPT, Perplexity, Gemini, Google AI Overview).

---

## Security & Privacy Rules

- Public route `/videos` is fully unauthenticated.
- Embed `<iframe>` parameters use `youtube-nocookie.com` domains with strict sandbox permissions (`accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture`).
- CSP headers in `next.config.ts` allow `img.youtube.com` and `youtube-nocookie.com`.
