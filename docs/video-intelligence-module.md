# AiX OS YouTube Video Intelligence Library Module

## Overview

The **Video Intelligence Module** (`/workspace/videos`) provides authenticated AiX OS users with a dark luxury media center featuring curated intelligence briefings across Real Estate, Markets, Investments, Business Intelligence, Education, Executive Interviews, and AI Technology.

---

## Architecture & Data Layer

- **Route**: `/workspace/videos` (Protected under existing `/workspace` authentication via `src/proxy.ts`).
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

- **Metadata**: Standard Next.js `metadata` title, description, canonical link (`/workspace/videos`), and OpenGraph tags.
- **Structured Data**: Injects `VideoObject` JSON-LD schema for search engines and AI engines (ChatGPT, Perplexity, Gemini, Google AI Overview).

---

## Security & Route Rules

- Access restricted to authenticated workspace sessions via `src/proxy.ts`.
- No sensitive client data sent in iframe parameters; uses `youtube-nocookie.com` embed domains with strict sandbox permissions (`accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture`).

---

## Future Roadmap (Database & AI Expansion)

1. **Supabase Migration**: Replace `INITIAL_VIDEOS` with a Supabase `videos` table or DataHub table.
2. **AI Video Intelligence Pipeline**: Automated speech-to-text transcription via Whisper, auto-generating summary bullet points, key takeaways, and vector embeddings for semantic search in AiX Agent Center.
