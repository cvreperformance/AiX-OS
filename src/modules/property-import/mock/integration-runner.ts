import { PropertyImportService } from '../services/property-import.service';
import { RadarAnalyzerService } from '../../radar/services/analyzer.service';
import { MorningBriefService } from '../../morning-brief/services/morning-brief.service';
import { mockTasks, mockCalendarEvents, mockFollowUps } from '../../morning-brief/mock/data';
import { MBOpportunity } from '../../morning-brief/types/morning-brief.types';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export function runEndToEndPipeline() {
  console.log('--- STARTING AIX OS LOCAL PIPELINE ---\n');

  // 1. IMPORT PIPELINE
  const importService = new PropertyImportService();
  const rawJson = readFileSync(resolve(__dirname, '../mock/properties.json'), 'utf-8');
  const records = importService.load(rawJson);
  const importResult = importService.import(records);
  
  // 2. SCANNER & RADAR & OPPORTUNITY ENGINE (Simulated pass-through)
  const analyzer = new RadarAnalyzerService();
  const opportunities: MBOpportunity[] = importResult.properties.map(prop => {
    // Pass raw description into the Rule Engine via Radar Analyzer
    const analysis = analyzer.analyze(prop.description + ' ' + prop.title);
    
    return {
      id: prop.id,
      title: prop.title,
      value: prop.price.amount,
      score: analysis.opportunityScore,
      isNew: true
    };
  });

  // 3. MORNING BRIEF ENGINE
  const mbService = new MorningBriefService();
  const brief = mbService.generate(opportunities, mockTasks, mockCalendarEvents, mockFollowUps, '2026-07-14');

  console.log('\n--- MORNING BRIEF RESULT ---');
  console.log(JSON.stringify(brief, null, 2));
  
  return brief;
}
