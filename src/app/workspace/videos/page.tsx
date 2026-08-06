import React from 'react';
import type { Metadata } from 'next';
import { VideoContainer } from '@/components/videos/VideoContainer';
import { INITIAL_VIDEOS, getYouTubeThumbnail } from '@/data/videos';

export const metadata: Metadata = {
  title: 'Video Intelligence | AiX OS Media Center',
  description: 'Standalone media intelligence module providing curated video insights on Real Estate, Market Analysis, Investment, Business Intelligence, and AI Technology.',
  alternates: {
    canonical: '/workspace/videos',
  },
  openGraph: {
    title: 'Video Intelligence | AiX OS Media Center',
    description: 'Curated video briefings and investment analysis powered by Cristian Vaduva content ecosystem.',
    type: 'website',
    url: '/workspace/videos',
  },
};

export default function WorkspaceVideosPage() {
  // Generate complete Schema.org JSON-LD graph (WebPage, BreadcrumbList, VideoObjects)
  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://aix-os.com/workspace/videos',
        url: 'https://aix-os.com/workspace/videos',
        name: 'Video Intelligence | AiX OS Media Center',
        description: 'Standalone media intelligence module providing curated video insights on Real Estate, Market Analysis, Investment, Business Intelligence, and AI Technology.',
        isPartOf: {
          '@type': 'WebSite',
          name: 'AiX OS',
          url: 'https://aix-os.com',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Workspace',
            item: 'https://aix-os.com/workspace',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Video Intelligence',
            item: 'https://aix-os.com/workspace/videos',
          },
        ],
      },
      ...INITIAL_VIDEOS.map((video) => ({
        '@type': 'VideoObject',
        name: video.title,
        description: video.description,
        thumbnailUrl: [getYouTubeThumbnail(video.youtubeId, 'maxres')],
        uploadDate: video.publishedDate ? `${video.publishedDate}T08:00:00+00:00` : '2026-08-01T08:00:00+00:00',
        duration: video.duration ? `PT${video.duration.replace(':', 'M')}S` : 'PT15M00S',
        embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
        author: {
          '@type': 'Person',
          name: video.author || 'Cristian Vaduva',
        },
      })),
    ],
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Inject Schema.org JSON-LD Graph for SEO / GEO & AI Search Discovery */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonStringify(jsonLdGraph),
        }}
      />

      {/* Hero Header */}
      <header className="space-y-3 border-b border-zinc-850 pb-8">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-mono tracking-widest text-amber-400 uppercase">
            AiX Media Intelligence
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold font-display text-transparent bg-clip-text gradient-gold tracking-tight">
          Intelligence Through Vision
        </h1>

        <p className="text-base md:text-lg text-zinc-400 max-w-2xl font-light">
          Market insights, investment analysis, and strategic knowledge curated for institutional and private investors.
        </p>
      </header>

      {/* Main Interactive Video Section */}
      <VideoContainer />
    </div>
  );
}

function safeJsonStringify(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}
