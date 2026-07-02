/**
 * AiX OS — Loading Skeletons
 * Reusable skeleton components matching the luxury dark design system.
 */

export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
      <div className="aspect-video bg-zinc-800" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-20 rounded bg-zinc-800" />
        <div className="h-5 w-3/4 rounded bg-zinc-800" />
        <div className="h-4 w-full rounded bg-zinc-800" />
        <div className="h-4 w-2/3 rounded bg-zinc-800" />
        <div className="flex justify-between pt-2">
          <div className="h-6 w-28 rounded bg-zinc-800" />
          <div className="h-6 w-16 rounded bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonPageHeader() {
  return (
    <div className="mb-12 space-y-4 animate-pulse">
      <div className="h-3 w-24 rounded bg-zinc-800" />
      <div className="h-12 w-80 rounded bg-zinc-800" />
      <div className="h-5 w-96 rounded bg-zinc-800" />
    </div>
  );
}

export function SkeletonAgencyCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-4">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-xl bg-zinc-800" />
        <div className="space-y-2 flex-1">
          <div className="h-5 w-40 rounded bg-zinc-800" />
          <div className="h-3 w-24 rounded bg-zinc-800" />
        </div>
        <div className="h-8 w-16 rounded-full bg-zinc-800" />
      </div>
      <div className="h-4 w-full rounded bg-zinc-800" />
      <div className="h-4 w-5/6 rounded bg-zinc-800" />
      <div className="flex gap-2 pt-2">
        <div className="h-9 flex-1 rounded-full bg-zinc-800" />
        <div className="h-9 w-24 rounded-full bg-zinc-800" />
      </div>
    </div>
  );
}

export function SkeletonNewsCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
      <div className="aspect-video bg-zinc-800" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between">
          <div className="h-3 w-20 rounded bg-zinc-800" />
          <div className="h-3 w-16 rounded bg-zinc-800" />
        </div>
        <div className="h-5 w-full rounded bg-zinc-800" />
        <div className="h-4 w-5/6 rounded bg-zinc-800" />
        <div className="h-4 w-3/4 rounded bg-zinc-800" />
        <div className="h-6 w-20 rounded-full bg-zinc-800" />
      </div>
    </div>
  );
}

export function SkeletonIndicatorRow({ count = 4 }: { count?: number }) {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse flex-shrink-0 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 space-y-2 min-w-[140px]">
          <div className="h-3 w-20 rounded bg-zinc-800" />
          <div className="h-6 w-16 rounded bg-zinc-800" />
          <div className="h-3 w-12 rounded bg-zinc-800" />
        </div>
      ))}
    </div>
  );
}
