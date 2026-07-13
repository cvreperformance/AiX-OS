import { MorningBrief, MBOpportunity, MBTask, MBCalendarEvent, MBFollowUp } from '../types/morning-brief.types';
import { RevenueFeedService } from '../../revenue-feed/services/revenue-feed.service';
import { RevenueIntelligenceService } from '../../revenue-intelligence/services/revenue-intelligence.service';
import { CompanyIntelligenceService } from '../../company-intelligence/services/company-intelligence.service';

export class MorningBriefService {
  private feedService = new RevenueFeedService();
  private intelligenceService = new RevenueIntelligenceService();
  private companyService = new CompanyIntelligenceService();

  public async generate(
    opportunities: MBOpportunity[],
    tasks: MBTask[],
    calendarEvents: MBCalendarEvent[],
    followUps: MBFollowUp[],
    currentDate: string = new Date().toISOString().split('T')[0]
  ): Promise<MorningBrief> {
    
    // Try to load LIVE feeds
    let finalOpps: MBOpportunity[] = [...opportunities];
    try {
      const liveFeeds = await this.feedService.loadFeeds();
      const intelligenceFeeds = this.intelligenceService.analyzeAll(liveFeeds);
      const companies = this.companyService.ingest(intelligenceFeeds);
      
      if (companies.length > 0) {
        // Map CompanyProfile to MBOpportunity
        finalOpps = companies.map(company => ({
          id: company.id,
          title: company.name,
          value: company.estimatedCommissionPotential,
          score: company.opportunityScore,
          isNew: true,
          targetCompany: company.name,
          contactTarget: company.contacts[0] || 'Unknown',
          suggestedService: company.articles[0]?.suggestedService || 'Unknown',
          potentialCommission: company.estimatedCommissionPotential,
          probability: Math.max(...company.articles.map(a => a.probability)),
          urgency: 'Today', // Companies pulled from live feed are active
          intelligenceRecommendation: `Contact ${company.contacts[0] || 'stakeholders'} at ${company.name}`
        }));
      }
    } catch (e) {
      console.warn('RevenueFeedService failed, falling back to mock opportunities.');
    }

    // 1. Sort opportunities by Score (Descending)
    const sortedOpps = [...finalOpps].sort((a, b) => b.score - a.score);
    
    // 2. Take Top 5
    const topPriorities = sortedOpps.slice(0, 5);
    
    // 3. Calculate estimated revenue from Top 5
    const estimatedRevenue = topPriorities.reduce((sum, opp) => sum + opp.value, 0);
    
    // 4. Calculate business health
    const averageScore = topPriorities.length > 0 
      ? topPriorities.reduce((sum, opp) => sum + opp.score, 0) / topPriorities.length 
      : 0;

    let businessHealth: MorningBrief['businessHealth'] = 'Critical';
    if (averageScore >= 90) businessHealth = 'Excellent';
    else if (averageScore >= 75) businessHealth = 'Good';
    else if (averageScore >= 60) businessHealth = 'Average';
    else if (averageScore >= 40) businessHealth = 'Weak';

    // 5. Generate deterministic recommendations
    const recommendations: string[] = [];

    // Rule: Important calendar event today
    calendarEvents.forEach(event => {
      if (event.isImportant && event.contactName) {
        recommendations.push(`Prepare for important meeting with ${event.contactName} at ${event.startTime}.`);
      }
    });

    // Rule: Overdue tasks
    tasks.forEach(task => {
      if (task.status === 'overdue' && task.daysOverdue) {
        recommendations.push(`Task "${task.title}" is overdue by ${task.daysOverdue} days. Handle immediately.`);
      }
    });

    // Rule: Tomorrow's insurance renewals
    followUps.forEach(fu => {
      if (fu.type === 'insurance_renewal' && this.isTomorrow(fu.dueDate, currentDate)) {
        recommendations.push(`Insurance renewal for ${fu.contactName} expires tomorrow. Follow up today.`);
      }
    });

    // Rule: Top Companies from Live Feeds
    topPriorities.forEach(opp => {
      if (opp.targetCompany) {
        recommendations.push(
          `[${opp.urgency}] ${opp.targetCompany} | Contact: ${opp.contactTarget} | Service: ${opp.suggestedService} | Est. Commission: €${opp.potentialCommission?.toLocaleString()} | Prob: ${opp.probability}% | Rec: ${opp.intelligenceRecommendation}`
        );
      } else if (opp.why && opp.nextStep) {
        recommendations.push(`[${opp.score}/100] ${opp.title}: ${opp.why} NEXT STEP: ${opp.nextStep}`);
      } else if (opp.isNew && opp.value >= 1000000) {
        recommendations.push(`High value opportunity added today: "${opp.title}" (Value: ${opp.value.toLocaleString()}).`);
      }
    });

    const summary = `Good morning. You have ${tasks.filter(t => t.status === 'pending').length} tasks pending and ${calendarEvents.length} meetings today. Your top pipeline is worth €${(estimatedRevenue / 1000000).toFixed(2)}M. Business Health is currently ${businessHealth}.`;

    return {
      date: currentDate,
      overallPriorityScore: Math.round(averageScore),
      estimatedRevenue,
      topPriorities,
      todayTasks: tasks.filter(t => t.dueDate === currentDate || t.status === 'overdue'),
      followUps: followUps.filter(f => f.dueDate === currentDate || this.isTomorrow(f.dueDate, currentDate)),
      calendarEvents: calendarEvents.sort((a, b) => a.startTime.localeCompare(b.startTime)),
      recommendations,
      businessHealth,
      summary
    };
  }

  private isTomorrow(dueDate: string, today: string): boolean {
    const dDate = new Date(dueDate);
    const tDate = new Date(today);
    const diffTime = dDate.getTime() - tDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
  }
}
