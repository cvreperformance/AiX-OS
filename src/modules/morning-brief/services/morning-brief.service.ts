import { MorningBrief, MBOpportunity, MBTask, MBCalendarEvent, MBFollowUp } from '../types/morning-brief.types';

export class MorningBriefService {
  public generate(
    opportunities: MBOpportunity[],
    tasks: MBTask[],
    calendarEvents: MBCalendarEvent[],
    followUps: MBFollowUp[],
    currentDate: string = new Date().toISOString().split('T')[0]
  ): MorningBrief {
    // 1. Sort opportunities by Score (Descending)
    const sortedOpps = [...opportunities].sort((a, b) => b.score - a.score);
    
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

    // Rule: High value property added today
    topPriorities.forEach(opp => {
      if (opp.isNew && opp.value >= 1000000) {
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
