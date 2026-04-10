// analytics/analytics-service.ts

import { EventEmitter } from 'events';

class AnalyticsService extends EventEmitter {
  private events: any[] = [];

  trackEvent(eventName: string, data: any) {
    const event = {
      name: eventName,
      timestamp: new Date(),
      data,
      userId: data.userId,
      sessionId: data.sessionId,
    };

    this.events.push(event);
    this.emit('event', event);

    // Send to analytics provider
    this.sendToAnalytics(event);
  }

  async generateReport(startDate: Date, endDate: Date) {
    const filteredEvents = this.events.filter(
      e => e.timestamp >= startDate && e.timestamp <= endDate
    );

    return {
      totalEvents: filteredEvents.length,
      uniqueUsers: new Set(filteredEvents.map(e => e.userId)).size,
      eventsByType: this.groupBy(filteredEvents, 'name'),
      topPages: this.getTopPages(filteredEvents),
      userJourney: this.analyzeUserJourney(filteredEvents),
      performance: this.analyzePerformance(filteredEvents),
    };
  }

  private groupBy(events: any[], key: string) {
    return events.reduce((acc, event) => {
      const groupKey = event[key];
      acc[groupKey] = (acc[groupKey] || 0) + 1;
      return acc;
    }, {});
  }

  private getTopPages(events: any[]) {
    const pageViews = this.groupBy(events, 'page');
    return Object.entries(pageViews)
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .slice(0, 10);
  }

  private analyzeUserJourney(events: any[]) {
    // Analyze user navigation patterns
    const journeys: any[] = [];
    const userSessions = this.groupBySession(events);

    for (const [sessionId, sessionEvents] of Object.entries(userSessions)) {
      journeys.push({
        sessionId,
        path: (sessionEvents as any[]).map(e => e.page).join(' → '),
        duration: this.calculateSessionDuration(sessionEvents as any[]),
      });
    }

    return journeys;
  }

  private analyzePerformance(events: any[]) {
    const performanceEvents = events.filter(e => e.name === 'performance');
    return {
      avgLoadTime: this.average(performanceEvents.map(e => e.data.loadTime)),
      avgResponseTime: this.average(performanceEvents.map(e => e.data.responseTime)),
    };
  }

  private groupBySession(events: any[]) {
    return events.reduce((acc, event) => {
      const sessionId = event.sessionId;
      if (!acc[sessionId]) acc[sessionId] = [];
      acc[sessionId].push(event);
      return acc;
    }, {});
  }

  private calculateSessionDuration(events: any[]) {
    if (events.length === 0) return 0;
    const start = new Date(events[0].timestamp);
    const end = new Date(events[events.length - 1].timestamp);
    return (end.getTime() - start.getTime()) / 1000; // seconds
  }

  private average(numbers: number[]) {
    return numbers.reduce((a, b) => a + b, 0) / numbers.length;
  }

  private sendToAnalytics(event: any) {
    // Send to Google Analytics, Mixpanel, or custom analytics service
    console.log('Analytics Event:', event);
  }
}

export default new AnalyticsService();
