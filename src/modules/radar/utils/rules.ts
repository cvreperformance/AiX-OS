export interface KeywordRule {
  keywords: string[];
  scoreImpact: number;
  category: 'strength' | 'weakness' | 'neutral';
  insight?: string;
}

export const radarRules: KeywordRule[] = [
  { keywords: ['owner', 'proprietar'], scoreImpact: 15, category: 'strength', insight: 'Direct owner contact implies higher margin.' },
  { keywords: ['urgent', 'negociabil', 'ocazie'], scoreImpact: 10, category: 'strength', insight: 'Urgent sale signals higher flexibility on price.' },
  { keywords: ['new', 'nou', 'recent'], scoreImpact: 10, category: 'strength', insight: 'Newer properties typically yield better opportunities.' },
  { keywords: ['commission', 'comision', 'agentie', 'agency'], scoreImpact: -20, category: 'weakness', insight: 'Involvement of another agency reduces margin.' },
  { keywords: ['pipera', 'herastrau', 'primaverii', 'dorobanti', 'nord'], scoreImpact: 20, category: 'strength', insight: 'High-value market area detected.' },
  { keywords: ['litigiu', 'probleme', 'viciu', 'renovare', 'demolare'], scoreImpact: -30, category: 'weakness', insight: 'Legal or structural issues identified.' },
  { keywords: ['renovat', 'lux', 'premium'], scoreImpact: 10, category: 'strength', insight: 'Premium condition increases property appeal.' },
];
