import React from 'react';
import type { Metadata } from 'next';
import { VideoContainer } from '@/components/videos/VideoContainer';
import { getYouTubeThumbnail, fetchChannelVideos } from '@/data/videos';

export const metadata: Metadata = {
  title: 'AiX OS Intelligence Media | Videos',
  description: 'Market intelligence, real estate analysis, investment insights, business intelligence and AI perspectives from AiX OS.',
  alternates: {
    canonical: 'https://os.cristianvaduva.com/videos',
  },
  openGraph: {
    title: 'AiX OS Intelligence Media | Videos',
    description: 'Market intelligence, real estate analysis, investment insights, business intelligence and AI perspectives from AiX OS.',
    type: 'website',
    url: 'https://os.cristianvaduva.com/videos',
    siteName: 'AiX OS™',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AiX OS Intelligence Media | Videos',
    description: 'Market intelligence, real estate analysis, investment insights, business intelligence and AI perspectives from AiX OS.',
  },
};

export default async function PublicVideosPage() {
  // Fetch videos for schema generation
  const videos = await fetchChannelVideos();
  // Generate Schema.org JSON-LD graph (WebPage, CollectionPage, BreadcrumbList, VideoObjects)
  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://os.cristianvaduva.com/videos',
        url: 'https://os.cristianvaduva.com/videos',
        name: 'AiX OS Intelligence Media | Videos',
        description: 'Market intelligence, real estate analysis, investment insights, business intelligence and AI perspectives from AiX OS.',
        isPartOf: {
          '@type': 'WebSite',
          name: 'AiX OS™',
          url: 'https://os.cristianvaduva.com',
        },
      },
      {
        '@type': 'CollectionPage',
        '@id': 'https://os.cristianvaduva.com/videos#collection',
        url: 'https://os.cristianvaduva.com/videos',
        name: 'AiX OS Intelligence Video Collection',
        description: 'Curated video intelligence library for real estate, markets, private equity, and AI technology.',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://os.cristianvaduva.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Videos',
            item: 'https://os.cristianvaduva.com/videos',
          },
        ],
      },
      ...videos.map((video) => ({
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
    
    <main className="min-h-screen w-full min-w-0 max-w-full box-border bg-black text-zinc-100 py-12 px-0 sm:px-4 lg:px-8">
      {/* Inject Schema.org JSON-LD Graph for Google Search, AI Overviews, Gemini & Perplexity */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonStringify(jsonLdGraph),
        }}
      />

      <div className="w-full max-w-full min-w-0 box-border mx-auto px-0 sm:px-4 lg:max-w-screen-xl lg:px-8 space-y-10 flex flex-col items-start overflow-x-hidden">
        {/* Public Hero Header */}
        <header className="space-y-4 border-b border-zinc-800/80 pb-10">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-amber-400 uppercase">
              AiX OS Public Intelligence Media
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold font-display text-transparent bg-clip-text gradient-gold tracking-tight leading-none text-center break-words">
            AiX OS Intelligence Media
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-zinc-300 max-w-3xl font-light leading-relaxed">
            Market intelligence, real estate analysis, investment insights, business intelligence and AI perspectives.
          </p>
        </header>

        {/* Main Video Intelligence Component */}
        <VideoContainer videos={videos} />
      </div>
    </main>
  );
}

function safeJsonStringify(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}
