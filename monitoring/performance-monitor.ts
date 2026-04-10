// monitoring/performance-monitor.ts

import prometheus from 'prom-client';
import { performance } from 'perf_hooks';

class PerformanceMonitor {
  private metrics = {
    apiResponseTime: new prometheus.Histogram({
      name: 'api_response_time_ms',
      help: 'API response time in milliseconds',
      labelNames: ['endpoint', 'method', 'status'],
      buckets: [10, 50, 100, 500, 1000, 5000],
    }),
    
    databaseQueryTime: new prometheus.Histogram({
      name: 'database_query_time_ms',
      help: 'Database query time in milliseconds',
      labelNames: ['query', 'status'],
      buckets: [1, 5, 10, 50, 100, 500],
    }),
    
    memoryUsage: new prometheus.Gauge({
      name: 'memory_usage_bytes',
      help: 'Memory usage in bytes',
      labelNames: ['type'],
    }),
    
    cpuUsage: new prometheus.Gauge({
      name: 'cpu_usage_percent',
      help: 'CPU usage percentage',
    }),
    
    cacheHitRate: new prometheus.Gauge({
      name: 'cache_hit_rate',
      help: 'Cache hit rate',
      labelNames: ['cache_name'],
    }),
  };

  monitorAPIResponse(endpoint: string, method: string, status: number, duration: number) {
    this.metrics.apiResponseTime
      .labels(endpoint, method, status)
      .observe(duration);
  }

  monitorDatabaseQuery(query: string, status: string, duration: number) {
    this.metrics.databaseQueryTime
      .labels(query, status)
      .observe(duration);
  }

  updateMemoryUsage() {
    const memUsage = process.memoryUsage();
    this.metrics.memoryUsage.labels('heapUsed').set(memUsage.heapUsed);
    this.metrics.memoryUsage.labels('external').set(memUsage.external);
    this.metrics.memoryUsage.labels('rss').set(memUsage.rss);
  }

  updateCpuUsage() {
    const usage = process.cpuUsage();
    const totalUsage = (usage.user + usage.system) / 1000000;
    this.metrics.cpuUsage.set(totalUsage);
  }

  updateCacheStats(cacheName: string, hits: number, misses: number) {
    const hitRate = hits / (hits + misses);
    this.metrics.cacheHitRate.labels(cacheName).set(hitRate);
  }
}

export default new PerformanceMonitor();
