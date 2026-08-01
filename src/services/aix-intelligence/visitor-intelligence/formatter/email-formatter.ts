import { VisitorIntelligence } from "../index";

export class EmailFormatter {
  public static formatHtml(intelligence: VisitorIntelligence): string {
    const { metrics, intent, journey, recommendation, leadTemperature, estimatedLeadValue } = intelligence;
    return `
      <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;padding:24px;background:#0c0c0c;color:#fff;border-radius:12px;max-width:600px;">
        <h2 style="color:#f59e0b;margin-top:0;">🔥 ${leadTemperature} LEAD — ${intelligence.classification.replace(/_/g, " ")}</h2>
        <p style="color:#a1a1aa;font-size:13px;">${intent.summary}</p>
        <table style="width:100%;border-collapse:collapse;font-size:13px;margin:16px 0;">
          <tr><td style="color:#71717a;padding:4px 0;">Intent Score:</td><td style="color:#10b981;font-weight:bold;">${intent.score}%</td></tr>
          <tr><td style="color:#71717a;padding:4px 0;">Estimated Value:</td><td style="color:#fff;font-weight:bold;">${estimatedLeadValue}</td></tr>
          <tr><td style="color:#71717a;padding:4px 0;">Priority:</td><td style="color:#ef4444;font-weight:bold;">${intelligence.priority}</td></tr>
          <tr><td style="color:#71717a;padding:4px 0;">Recommended Action:</td><td style="color:#f59e0b;font-weight:bold;">${recommendation.action}</td></tr>
        </table>
        <div style="background:#18181b;padding:12px;border-radius:8px;border:1px solid #27272a;font-size:12px;">
          <strong>Journey Path:</strong><br/>
          <pre style="margin:6px 0 0 0;color:#e4e4e7;font-family:monospace;">${journey.formattedJourney}</pre>
        </div>
      </div>
    `;
  }
}
