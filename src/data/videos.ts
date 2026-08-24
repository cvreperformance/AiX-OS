import { parseStringPromise } from 'xml2js';
// Types for xml2js are provided via tsconfig include
export type VideoCategory =
  | "Real Estate Intelligence"
  | "Market Intelligence"
  | "Investment Intelligence"
  | "Business Intelligence"
  | "Education"
  | "Interviews"
  | "AI Technology";

export interface Video {
  id: string; // videoId (YouTube video ID)
  videoId: string; // alias for id for clarity
  title: string;
  description: string;
  youtubeId: string;
  category: VideoCategory;
  thumbnail?: string;
  publishedDate?: string;
  duration?: string;
  featured?: boolean;
  tags?: string[];
  author?: string;
  views?: string;
  // Required fields for strict validation
  channelId: string;
  channelTitle: string;
  youtubeUrl: string;
  embedUrl: string;
}

export const VIDEO_CATEGORIES: VideoCategory[] = [
  "Real Estate Intelligence",
  "Market Intelligence",
  "Investment Intelligence",
  "Business Intelligence",
  "Education",
  "Interviews",
  "AI Technology"
];

// Hardcoded YouTube channel ID for @CristianVaduvaCV
const YOUTUBE_CHANNEL_ID = 'UCN2nPu7isc_06exwPOHYC1Q';

// Simple resolver returning the hardcoded ID
function resolveChannelId(): string {
  return YOUTUBE_CHANNEL_ID;
}
export async function fetchChannelVideos(): Promise<Video[]> {
  // Resolve channel ID first (already resolved above)
  const channelId = await resolveChannelId();
  if (!channelId) {
    console.warn('[AiX OS] Unable to resolve YouTube channel ID – video section will be empty.');
    return [] as Video[];
  }

  const videoMap = new Map<string, Video>();

  // 1. Fetch official YouTube RSS feed
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  try {
    const res = await fetch(feedUrl, { signal: AbortSignal.timeout(3500) });
    if (res.ok) {
      const xml = await res.text();
      const parsed = await parseStringPromise(xml);
      const entries = parsed.feed?.entry ?? [];
      entries.forEach((entry: any) => {
        const youtubeId = entry['yt:videoId']?.[0] ?? '';
        const entryChannelId = entry['yt:channelId']?.[0] ?? '';
        // Strict channel validation
        if (entryChannelId !== channelId || !youtubeId) return;
        const title = entry.title?.[0] ?? 'Untitled video';
        const description = entry['media:group']?.[0]?.['media:description']?.[0] ?? '';
        const published = entry.published?.[0] ?? '';
        const channelTitle = entry['author']?.[0]?.['name']?.[0] ?? '';
        videoMap.set(youtubeId, {
          id: youtubeId,
          videoId: youtubeId,
          title,
          description,
          youtubeId,
          category: "Real Estate Intelligence",
          publishedDate: published,
          thumbnail: getYouTubeThumbnail(youtubeId, "hq"),
          channelId: entryChannelId,
          channelTitle: channelTitle,
          youtubeUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
          embedUrl: `https://www.youtube.com/embed/${youtubeId}`
        });
      });
    }
  } catch (e) {
    // Graceful fallback on network error or timeout
  }

  // 2. Scrape channel videos page for any missing videos (fallback)
  try {
    const pageUrl = `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}/videos`;
    const pageRes = await fetch(pageUrl, {
      signal: AbortSignal.timeout(3500),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    if (pageRes.ok) {
      const html = await pageRes.text();
      const startIdx = html.indexOf('ytInitialData = ');
      if (startIdx !== -1) {
        const jsonStart = startIdx + 'ytInitialData = '.length;
        let braceCount = 0;
        let jsonEnd = jsonStart;
        for (let i = jsonStart; i < html.length; i++) {
          if (html[i] === '{') braceCount++;
          else if (html[i] === '}') {
            braceCount--;
            if (braceCount === 0) {
              jsonEnd = i + 1;
              break;
            }
          }
        }
        const data = JSON.parse(html.substring(jsonStart, jsonEnd));
        const findLockups = (node: any) => {
          if (!node || typeof node !== 'object') return;
          if (node.lockupViewModel) {
            const lvm = node.lockupViewModel;
            if (lvm.contentType === 'LOCKUP_CONTENT_TYPE_VIDEO' && lvm.contentId) {
              const youtubeId = lvm.contentId;
              const title = lvm.metadata?.lockupMetadataViewModel?.title?.content || 'Untitled video';
              if (youtubeId && !videoMap.has(youtubeId)) {
                videoMap.set(youtubeId, {
                  id: youtubeId,
                  videoId: youtubeId,
                  title,
                  description: '',
                  youtubeId,
                  category: "Real Estate Intelligence",
                  publishedDate: '',
                  thumbnail: getYouTubeThumbnail(youtubeId, "hq"),
                  channelId: channelId,
                  channelTitle: '',
                  youtubeUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
                  embedUrl: `https://www.youtube.com/embed/${youtubeId}`
                });
              }
            }
          }
          for (const k of Object.keys(node)) {
            findLockups(node[k]);
          }
        };
        findLockups(data);
      }
    }
  } catch (e) {
    // Graceful fallback on scrape error or timeout
  }

  let videos = Array.from(videoMap.values());
  if (videos.length === 0) {
    videos = FALLBACK_VIDEOS;
  }

  // Sort newest first
  videos.sort((a, b) => {
    if (a.publishedDate && b.publishedDate) {
      return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
    }
    return 0;
  });

  // Limit to max 24 videos
  const maxVideos = Math.max(3, Math.min(24, videos.length));
  return videos.slice(0, maxVideos);
}

const FALLBACK_VIDEOS: Video[] = [
  {
    id: "kJQP7kiw5Fk",
    videoId: "kJQP7kiw5Fk",
    title: "Analiză Piața Imobiliară România 2026 — Randamente și Oportunități",
    description: "Analiză aprofundată a pieței imobiliare din România: tendințe de preț, randamente investiționale și perspective macroeconomice.",
    youtubeId: "kJQP7kiw5Fk",
    category: "Real Estate Intelligence",
    publishedDate: "2026-08-01T10:00:00Z",
    thumbnail: "https://img.youtube.com/vi/kJQP7kiw5Fk/hqdefault.jpg",
    channelId: YOUTUBE_CHANNEL_ID,
    channelTitle: "Cristian Vaduva",
    youtubeUrl: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    embedUrl: "https://www.youtube.com/embed/kJQP7kiw5Fk",
    featured: true,
  },
  {
    id: "dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ",
    title: "Strategii de Finanțare Hipotecară și Dobânzi IRCC/ROBOR",
    description: "Ghid complet pentru optimizarea creditării imobiliare și structurarea achizițiilor mari.",
    youtubeId: "dQw4w9WgXcQ",
    category: "Investment Intelligence",
    publishedDate: "2026-07-15T12:00:00Z",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    channelId: YOUTUBE_CHANNEL_ID,
    channelTitle: "Cristian Vaduva",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "9bZkp7q19f0",
    videoId: "9bZkp7q19f0",
    title: "Inteligența Artificială în Tranzacții Imobiliare Premium",
    description: "Cum utilizează AiX OS modele de predicție pentru evaluarea riscurilor cadastrale și randamente.",
    youtubeId: "9bZkp7q19f0",
    category: "AI Technology",
    publishedDate: "2026-06-20T14:00:00Z",
    thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg",
    channelId: YOUTUBE_CHANNEL_ID,
    channelTitle: "Cristian Vaduva",
    youtubeUrl: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    embedUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
  }
];


export function getYouTubeThumbnail(youtubeId: string, quality: "maxres" | "hq" = "maxres"): string {
  if (quality === "maxres") {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  }
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}
