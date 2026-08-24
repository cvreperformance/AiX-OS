// src/lib/news-engine/summarizer.ts
// Production Factual Summarizer for AiX OS™ Real Estate News Engine

export function generateStructuredSummary(title: string, contentSnippet: string, category: string): string {
  const cleanSnippet = contentSnippet.trim();

  // Extract key sentences
  const sentences = cleanSnippet
    .split(/(?<=[.!?])\s+/)
    .filter(s => s.length > 15 && !/sursa:|foto:|video:|citește și/i.test(s));

  const fact1 = sentences[0] || title;
  const fact2 = sentences[1] || `Evoluția recentă reflectă dinamica pieței în categoria ${category}.`;
  const fact3 = sentences[2] || `Analiza datelor indică ajustări strategice pentru investitori și cumpărători.`;

  return [
    `📌 CE S-A ÎNTÂMPLAT: ${title}. ${fact1}`,
    `💡 DE CE CONTEAZĂ: ${fact2}`,
    `📊 IMPACT ASUPRA PIEȚEI: ${fact3} Această informație influențează deciziile de alocare de capital în segmentul ${category}.`
  ].join("\n\n");
}
