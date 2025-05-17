<template>
  <div class="health-summary">
    <div class="card">
      <div class="card-header">
        <h3>Health Summary</h3>
      </div>
      <div class="card-body">
        <div class="summary-stats">
          <div class="stat-item">
            <div class="stat-value">{{ summary.totalCustomers }}</div>
            <div class="stat-label">Total Customers</div>
          </div>
          <div class="stat-item">
            <div class="stat-value green">{{ summary.healthyCount }}</div>
            <div class="stat-label">Healthy</div>
            <div class="stat-percent">({{ summary.percentHealthy ? summary.percentHealthy.toFixed(1) : '0.0' }}%)</div>
          </div>
          <div class="stat-item">
            <div class="stat-value yellow">{{ summary.concernsCount }}</div>
            <div class="stat-label">Some Concerns</div>
            <div class="stat-percent">({{ summary.percentConcerns ? summary.percentConcerns.toFixed(1) : '0.0' }}%)</div>
          </div>
          <div class="stat-item">
            <div class="stat-value red">{{ summary.criticalCount }}</div>
            <div class="stat-label">Critical Issues</div>
            <div class="stat-percent">({{ summary.percentCritical ? summary.percentCritical.toFixed(1) : '0.0' }}%)</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HealthSummary',
  props: {
    summary: {
      type: Object,
      default: () => ({
        totalCustomers: 0,
        healthyCount: 0,
        concernsCount: 0,
        criticalCount: 0,
        percentHealthy: 0,
        percentConcerns: 0,
        percentCritical: 0
      })
    }
  }
}
</script>

<style scoped>
.health-summary {
  margin-bottom: 2rem;
}

.summary-stats {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
  flex: 1;
  min-width: 120px;
  margin: 0.5rem;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
}

.stat-label {
  font-size: 1rem;
  margin-top: 0.5rem;
}

.stat-percent {
  font-size: 0.9rem;
  color: #666;
}

.green {
  color: #28a745;
}

.yellow {
  color: #ffc107;
}

.red {
  color: #dc3545;
}
</style>
