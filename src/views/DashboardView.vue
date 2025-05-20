<template>
  <div class="dashboard-container">
    <h1 class="dashboard-title">My Portfolio Dashboard</h1>
    <div class="dashboard-content">
      <div class="filter-group">
        <div class="filter-item">
          <label for="current-period">Current Snapshot:</label>
          <select id="current-period" v-model="currentSnapshotId" class="form-select">
            <option value="">Select a snapshot</option>
            <option v-for="snapshot in snapshots" :key="snapshot.id" :value="snapshot.id">
              {{ snapshot.name }}
            </option>
          </select>
        </div>
        <div class="filter-item">
          <label for="comparison-period">Comparison Snapshot:</label>
          <select id="comparison-period" v-model="comparisonSnapshotId" class="form-select">
            <option value="">None</option>
            <option v-for="snapshot in snapshots" :key="snapshot.id" :value="snapshot.id">
              {{ snapshot.name }}
            </option>
          </select>
        </div>
        <div class="filter-item">
          <label for="cso-filter">CSO:</label>
          <select id="cso-filter" v-model="selectedCso" class="form-select">
            <option value="">All CSOs</option>
            <option v-for="cso in csos" :key="cso.id" :value="cso.id">
              {{ cso.name }}
            </option>
          </select>
        </div>
        <div class="filter-item">
          <label for="customer-type">Customer Type:</label>
          <select id="customer-type" v-model="selectedCustomerType" class="form-select">
            <option value="">All Types</option>
            <option v-for="type in customerTypes" :key="type.id" :value="type.id">
              {{ type.name }}
            </option>
          </select>
        </div>

      </div>
      
      <HealthSummary :summary="healthSummary" />
      
      <h2 class="section-title">Customer Health Status</h2>
      
      <div class="dashboard-stats">
        <div class="health-status-card red-card">
          <h3>Red Customers</h3>
          <div class="health-metrics">
            <div class="metric">
              <div class="metric-label">Count</div>
              <div class="metric-value">{{ metrics.red.count }}</div>
              <div class="metric-percentage">{{ ((metrics.red.count / metrics.total.count) * 100).toFixed(1) }}%</div>
              <div v-if="comparisonMetrics" :class="['metric-change', getChangeClass(metrics.red.count, comparisonMetrics.red.count)]">
                {{ getChangeIndicator(metrics.red.count, comparisonMetrics.red.count) }}
                {{ getChangePercentage(metrics.red.count, comparisonMetrics.red.count) }}%
              </div>
            </div>
            <div class="metric">
              <div class="metric-label">ARR</div>
              <div class="metric-value">${{ metrics.red.arr ? metrics.red.arr.toLocaleString() : '0' }}</div>
              <div class="metric-percentage">{{ metrics.total.arr > 0 ? ((metrics.red.arr / metrics.total.arr) * 100).toFixed(1) : '0.0' }}%</div>
              <div v-if="comparisonMetrics" :class="['metric-change', getChangeClass(metrics.red.arr, comparisonMetrics.red.arr, true)]">
                {{ getChangeIndicator(metrics.red.arr, comparisonMetrics.red.arr, true) }}
                {{ getChangePercentage(metrics.red.arr, comparisonMetrics.red.arr) }}%
              </div>
            </div>
          </div>
          
          <!-- Customer tooltip -->
          <div class="customer-tooltip" v-if="redCustomers.length > 0">
            <h4>Red Customers ({{ redCustomers.length }})</h4>
            <div class="tooltip-customer" v-for="customer in redCustomers" :key="customer.id">
              <span class="tooltip-customer-name">{{ customer.name }}</span>
              <span class="tooltip-customer-arr">${{ customer.arr ? customer.arr.toLocaleString() : '0' }}</span>
            </div>
          </div>
          <div class="customer-tooltip" v-else>
            <div class="no-data">No customers in this category</div>
          </div>
        </div>
        
        <div class="health-status-card yellow-card">
          <h3>Yellow Customers</h3>
          <div class="health-metrics">
            <div class="metric">
              <div class="metric-label">Count</div>
              <div class="metric-value">{{ metrics.yellow.count }}</div>
              <div class="metric-percentage">{{ ((metrics.yellow.count / metrics.total.count) * 100).toFixed(1) }}%</div>
              <div v-if="comparisonMetrics" :class="['metric-change', getChangeClass(metrics.yellow.count, comparisonMetrics.yellow.count)]">
                {{ getChangeIndicator(metrics.yellow.count, comparisonMetrics.yellow.count) }}
                {{ getChangePercentage(metrics.yellow.count, comparisonMetrics.yellow.count) }}%
              </div>
            </div>
            <div class="metric">
              <div class="metric-label">ARR</div>
              <div class="metric-value">${{ metrics.yellow.arr ? metrics.yellow.arr.toLocaleString() : '0' }}</div>
              <div class="metric-percentage">{{ metrics.total.arr > 0 ? ((metrics.yellow.arr / metrics.total.arr) * 100).toFixed(1) : '0.0' }}%</div>
              <div v-if="comparisonMetrics" :class="['metric-change', getChangeClass(metrics.yellow.arr, comparisonMetrics.yellow.arr, true)]">
                {{ getChangeIndicator(metrics.yellow.arr, comparisonMetrics.yellow.arr, true) }}
                {{ getChangePercentage(metrics.yellow.arr, comparisonMetrics.yellow.arr) }}%
              </div>
            </div>
          </div>
          
          <!-- Customer tooltip -->
          <div class="customer-tooltip" v-if="yellowCustomers.length > 0">
            <h4>Yellow Customers ({{ yellowCustomers.length }})</h4>
            <div class="tooltip-customer" v-for="customer in yellowCustomers" :key="customer.id">
              <span class="tooltip-customer-name">{{ customer.name }}</span>
              <span class="tooltip-customer-arr">${{ customer.arr ? customer.arr.toLocaleString() : '0' }}</span>
            </div>
          </div>
          <div class="customer-tooltip" v-else>
            <div class="no-data">No customers in this category</div>
          </div>
        </div>
        
        <div class="health-status-card green-card">
          <h3>Green Customers</h3>
          <div class="health-metrics">
            <div class="metric">
              <div class="metric-label">Count</div>
              <div class="metric-value">{{ metrics.green.count }}</div>
              <div class="metric-percentage">{{ ((metrics.green.count / metrics.total.count) * 100).toFixed(1) }}%</div>
              <div v-if="comparisonMetrics" :class="['metric-change', getChangeClass(metrics.green.count, comparisonMetrics.green.count)]">
                {{ getChangeIndicator(metrics.green.count, comparisonMetrics.green.count) }}
                {{ getChangePercentage(metrics.green.count, comparisonMetrics.green.count) }}%
              </div>
            </div>
            <div class="metric">
              <div class="metric-label">ARR</div>
              <div class="metric-value">${{ metrics.green.arr ? metrics.green.arr.toLocaleString() : '0' }}</div>
              <div class="metric-percentage">{{ metrics.total.arr > 0 ? ((metrics.green.arr / metrics.total.arr) * 100).toFixed(1) : '0.0' }}%</div>
              <div v-if="comparisonMetrics" :class="['metric-change', getChangeClass(metrics.green.arr, comparisonMetrics.green.arr, true)]">
                {{ getChangeIndicator(metrics.green.arr, comparisonMetrics.green.arr, true) }}
                {{ getChangePercentage(metrics.green.arr, comparisonMetrics.green.arr) }}%
              </div>
            </div>
          </div>
          
          <!-- Customer tooltip -->
          <div class="customer-tooltip" v-if="greenCustomers.length > 0">
            <h4>Green Customers ({{ greenCustomers.length }})</h4>
            <div class="tooltip-customer" v-for="customer in greenCustomers" :key="customer.id">
              <span class="tooltip-customer-name">{{ customer.name }}</span>
              <span class="tooltip-customer-arr">${{ customer.arr ? customer.arr.toLocaleString() : '0' }}</span>
            </div>
          </div>
          <div class="customer-tooltip" v-else>
            <div class="no-data">No customers in this category</div>
          </div>
        </div>
      </div>
      
      <h2 class="section-title" v-if="comparisonMetrics">Change from Last Period</h2>
      
      <div class="dashboard-stats" v-if="comparisonMetrics">
        <!-- Red status change -->
        <div class="health-status-card red-card">
          <h3>Red</h3>
          <div class="health-metrics">
            <div class="metric">
              <div class="metric-label">ARR</div>
              <div class="metric-value" :class="getChangeClass(metrics.red.arr, comparisonMetrics.red.arr, true)">
                {{ formatCurrencyChange(metrics.red.arr - comparisonMetrics.red.arr) }}
              </div>
            </div>
            <div class="metric">
              <div class="metric-label">Count</div>
              <div class="metric-value" :class="getChangeClass(metrics.red.count, comparisonMetrics.red.count, true)">
                {{ formatCountChange(metrics.red.count - comparisonMetrics.red.count) }}
              </div>
            </div>
          </div>
          
          <!-- Change tooltip -->
          <div class="customer-tooltip">
            <div class="tooltip-section">
              <h4>Top 5 Additions to Red</h4>
              <div v-if="topAdditions.filter(c => c.currentStatus === 'red').length > 0">
                <div class="tooltip-customer" v-for="(customer, index) in topAdditions.filter(c => c.currentStatus === 'red').slice(0, 5)" :key="index">
                  <span class="tooltip-customer-name">{{ customer.name }}</span>
                  <span class="tooltip-customer-arr">${{ customer.arr ? customer.arr.toLocaleString() : '0' }}</span>
                  <span class="tooltip-status-change">
                    <span class="status-badge" :class="'status-' + customer.previousStatus.toLowerCase()">{{ customer.previousStatus }}</span>
                    →
                    <span class="status-badge" :class="'status-' + customer.currentStatus.toLowerCase()">{{ customer.currentStatus }}</span>
                  </span>
                </div>
              </div>
              <div v-else class="no-data">No customers added to Red status</div>
            </div>
            
            <div class="tooltip-section">
              <h4>Top 5 Removals from Red</h4>
              <div v-if="topRemovals.filter(c => c.previousStatus === 'red').length > 0">
                <div class="tooltip-customer" v-for="(customer, index) in topRemovals.filter(c => c.previousStatus === 'red').slice(0, 5)" :key="index">
                  <span class="tooltip-customer-name">{{ customer.name }}</span>
                  <span class="tooltip-customer-arr">${{ customer.arr ? customer.arr.toLocaleString() : '0' }}</span>
                  <span class="tooltip-status-change">
                    <span class="status-badge" :class="'status-' + customer.previousStatus.toLowerCase()">{{ customer.previousStatus }}</span>
                    →
                    <span class="status-badge" :class="'status-' + customer.currentStatus.toLowerCase()">{{ customer.currentStatus }}</span>
                  </span>
                </div>
              </div>
              <div v-else class="no-data">No customers removed from Red status</div>
            </div>
          </div>
        </div>
        
        <!-- Yellow status change -->
        <div class="health-status-card yellow-card">
          <h3>Yellow</h3>
          <div class="health-metrics">
            <div class="metric">
              <div class="metric-label">ARR</div>
              <div class="metric-value" :class="getChangeClass(metrics.yellow.arr, comparisonMetrics.yellow.arr)">
                {{ formatCurrencyChange(metrics.yellow.arr - comparisonMetrics.yellow.arr) }}
              </div>
            </div>
            <div class="metric">
              <div class="metric-label">Count</div>
              <div class="metric-value" :class="getChangeClass(metrics.yellow.count, comparisonMetrics.yellow.count)">
                {{ formatCountChange(metrics.yellow.count - comparisonMetrics.yellow.count) }}
              </div>
            </div>
          </div>
          
          <!-- Change tooltip -->
          <div class="customer-tooltip">
            <div class="tooltip-section">
              <h4>Top 5 Additions to Yellow</h4>
              <div v-if="topAdditions.filter(c => c.currentStatus === 'yellow').length > 0">
                <div class="tooltip-customer" v-for="(customer, index) in topAdditions.filter(c => c.currentStatus === 'yellow').slice(0, 5)" :key="index">
                  <span class="tooltip-customer-name">{{ customer.name }}</span>
                  <span class="tooltip-customer-arr">${{ customer.arr ? customer.arr.toLocaleString() : '0' }}</span>
                  <span class="tooltip-status-change">
                    <span class="status-badge" :class="'status-' + customer.previousStatus.toLowerCase()">{{ customer.previousStatus }}</span>
                    →
                    <span class="status-badge" :class="'status-' + customer.currentStatus.toLowerCase()">{{ customer.currentStatus }}</span>
                  </span>
                </div>
              </div>
              <div v-else class="no-data">No customers added to Yellow status</div>
            </div>
            
            <div class="tooltip-section">
              <h4>Top 5 Removals from Yellow</h4>
              <div v-if="topRemovals.filter(c => c.previousStatus === 'yellow').length > 0">
                <div class="tooltip-customer" v-for="(customer, index) in topRemovals.filter(c => c.previousStatus === 'yellow').slice(0, 5)" :key="index">
                  <span class="tooltip-customer-name">{{ customer.name }}</span>
                  <span class="tooltip-customer-arr">${{ customer.arr ? customer.arr.toLocaleString() : '0' }}</span>
                  <span class="tooltip-status-change">
                    <span class="status-badge" :class="'status-' + customer.previousStatus.toLowerCase()">{{ customer.previousStatus }}</span>
                    →
                    <span class="status-badge" :class="'status-' + customer.currentStatus.toLowerCase()">{{ customer.currentStatus }}</span>
                  </span>
                </div>
              </div>
              <div v-else class="no-data">No customers removed from Yellow status</div>
            </div>
          </div>
        </div>
        
        <!-- Green status change -->
        <div class="health-status-card green-card">
          <h3>Green</h3>
          <div class="health-metrics">
            <div class="metric">
              <div class="metric-label">ARR</div>
              <div class="metric-value" :class="getChangeClass(metrics.green.arr, comparisonMetrics.green.arr)">
                {{ formatCurrencyChange(metrics.green.arr - comparisonMetrics.green.arr) }}
              </div>
            </div>
            <div class="metric">
              <div class="metric-label">Count</div>
              <div class="metric-value" :class="getChangeClass(metrics.green.count, comparisonMetrics.green.count)">
                {{ formatCountChange(metrics.green.count - comparisonMetrics.green.count) }}
              </div>
            </div>
          </div>
          
          <!-- Change tooltip -->
          <div class="customer-tooltip">
            <div class="tooltip-section">
              <h4>Top 5 Additions to Green</h4>
              <div v-if="topAdditions.filter(c => c.currentStatus === 'green').length > 0">
                <div class="tooltip-customer" v-for="(customer, index) in topAdditions.filter(c => c.currentStatus === 'green').slice(0, 5)" :key="index">
                  <span class="tooltip-customer-name">{{ customer.name }}</span>
                  <span class="tooltip-customer-arr">${{ customer.arr ? customer.arr.toLocaleString() : '0' }}</span>
                  <span class="tooltip-status-change">
                    <span class="status-badge" :class="'status-' + customer.previousStatus.toLowerCase()">{{ customer.previousStatus }}</span>
                    →
                    <span class="status-badge" :class="'status-' + customer.currentStatus.toLowerCase()">{{ customer.currentStatus }}</span>
                  </span>
                </div>
              </div>
              <div v-else class="no-data">No customers added to Green status</div>
            </div>
            
            <div class="tooltip-section">
              <h4>Top 5 Removals from Green</h4>
              <div v-if="topRemovals.filter(c => c.previousStatus === 'green').length > 0">
                <div class="tooltip-customer" v-for="(customer, index) in topRemovals.filter(c => c.previousStatus === 'green').slice(0, 5)" :key="index">
                  <span class="tooltip-customer-name">{{ customer.name }}</span>
                  <span class="tooltip-customer-arr">${{ customer.arr ? customer.arr.toLocaleString() : '0' }}</span>
                  <span class="tooltip-status-change">
                    <span class="status-badge" :class="'status-' + customer.previousStatus.toLowerCase()">{{ customer.previousStatus }}</span>
                    →
                    <span class="status-badge" :class="'status-' + customer.currentStatus.toLowerCase()">{{ customer.currentStatus }}</span>
                  </span>
                </div>
              </div>
              <div v-else class="no-data">No customers removed from Green status</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="card mb-4" v-if="statusMovement.length > 0">
        <div class="card-header">
          <h3>Status Movement</h3>
        </div>
        <div class="card-body">
          <table class="table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>CSO</th>
                <th>Previous Status</th>
                <th>Current Status</th>
                <th>ARR</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(movement, index) in statusMovement" :key="index">
                <td>{{ movement.name }}</td>
                <td>{{ movement.cso }}</td>
                <td>
                  <span class="status-badge" :class="`status-${movement.previousStatus.toLowerCase()}`">
                    {{ movement.previousStatus }}
                  </span>
                </td>
                <td>
                  <span class="status-badge" :class="`status-${movement.currentStatus.toLowerCase()}`">
                    {{ movement.currentStatus }}
                  </span>
                </td>
                <td>${{ movement.arr ? movement.arr.toLocaleString() : '0' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <DashboardTable 
        :customers="customers" 
        :csos="csos" 
        :customerTypes="customerTypes"
        :showComparison="!!comparisonSnapshotId" 
      />
    </div>
  </div>
</template>

<script>
import HealthSummary from '@/components/HealthSummary.vue';
import DashboardTable from '@/components/DashboardTable.vue';
import axios from 'axios';

import { API_URL } from '@/services/api';

export default {
  name: 'DashboardView',
  components: {
    HealthSummary,
    DashboardTable
  },
  watch: {
    currentSnapshotId(newVal) {
      if (newVal) {
        this.fetchDashboardData();
      }
    },
    comparisonSnapshotId() {
      if (this.currentSnapshotId) {
        this.fetchDashboardData();
      }
    },
    selectedCso() {
      if (this.currentSnapshotId) {
        this.fetchDashboardData();
      }
    },
    selectedCustomerType() {
      if (this.currentSnapshotId) {
        this.fetchDashboardData();
      }
    }
  },
  data() {
    return {
      snapshots: [],
      csos: [],
      customerTypes: [],
      customers: [],
      currentSnapshotId: '',
      comparisonSnapshotId: '',
      selectedCso: '',
      selectedCustomerType: '',
      healthSummary: {
        totalCustomers: 0,
        healthyCount: 0,
        concernsCount: 0,
        criticalCount: 0,
        percentHealthy: 0,
        percentConcerns: 0,
        percentCritical: 0
      },
      metrics: {
        red: { count: 0, arr: 0 },
        yellow: { count: 0, arr: 0 },
        green: { count: 0, arr: 0 },
        total: { count: 0, arr: 0 }
      },
      comparisonMetrics: null,
      statusMovement: [],
      topAdditions: [],
      topRemovals: []
    };
  },
  created() {
    this.fetchSnapshots();
    this.fetchCsos();
    this.fetchCustomerTypes();
  },
  computed: {
    redCustomers() {
      return this.customers
        .filter(customer => customer.healthStatus.status === 'red')
        .sort((a, b) => b.arr - a.arr)
        .slice(0, 10);
    },
    yellowCustomers() {
      return this.customers
        .filter(customer => customer.healthStatus.status === 'yellow')
        .sort((a, b) => b.arr - a.arr)
        .slice(0, 10);
    },
    greenCustomers() {
      return this.customers
        .filter(customer => customer.healthStatus.status === 'green')
        .sort((a, b) => b.arr - a.arr)
        .slice(0, 10);
    }
  },
  methods: {
    async fetchSnapshots() {
      try {
        const response = await axios.get(`${API_URL}/snapshots/`);
        this.snapshots = response.data;
        if (this.snapshots.length > 0) {
          this.currentSnapshotId = this.snapshots[0].id;
          this.fetchDashboardData();
        }
      } catch (error) {
        console.error('Error fetching snapshots:', error);
      }
    },
    async fetchCsos() {
      try {
        const response = await axios.get(`${API_URL}/dashboard/csos`);
        this.csos = response.data;
      } catch (error) {
        console.error('Error fetching CSOs:', error);
      }
    },
    async fetchCustomerTypes() {
      try {
        const response = await axios.get(`${API_URL}/dashboard/customer-types`);
        this.customerTypes = response.data;
      } catch (error) {
        console.error('Error fetching customer types:', error);
      }
    },
    async fetchDashboardData() {
      if (!this.currentSnapshotId) return;
      
      try {
        // Fetch health summary
        const summaryParams = new URLSearchParams();
        summaryParams.append('snapshotId', this.currentSnapshotId);
        if (this.selectedCso) summaryParams.append('cso', this.selectedCso);
        if (this.selectedCustomerType) summaryParams.append('customerType', this.selectedCustomerType);
        
        const summaryResponse = await axios.get(`${API_URL}/dashboard/health-summary/?${summaryParams.toString()}`);
        this.healthSummary = summaryResponse.data;
        
        // Fetch health metrics
        const metricsResponse = await axios.get(`${API_URL}/dashboard/health-metrics/?${summaryParams.toString()}`);
        this.metrics = metricsResponse.data;
        
        // Fetch customers
        const customerParams = new URLSearchParams();
        customerParams.append('snapshotId', this.currentSnapshotId);
        if (this.selectedCso) customerParams.append('cso', this.selectedCso);
        if (this.selectedCustomerType) customerParams.append('customerType', this.selectedCustomerType);
        
        const customerResponse = await axios.get(`${API_URL}/customers/?${customerParams.toString()}`);
        this.customers = customerResponse.data;
        
        // If comparison is selected, fetch previous data
        if (this.comparisonSnapshotId) {
          const comparisonParams = new URLSearchParams();
          comparisonParams.append('snapshotId', this.comparisonSnapshotId);
          if (this.selectedCso) comparisonParams.append('cso', this.selectedCso);
          if (this.selectedCustomerType) comparisonParams.append('customerType', this.selectedCustomerType);
          
          const comparisonResponse = await axios.get(`${API_URL}/customers/?${comparisonParams.toString()}`);
          const previousCustomers = comparisonResponse.data;
          
          // Fetch comparison metrics
          const comparisonMetricsResponse = await axios.get(`${API_URL}/dashboard/health-metrics/?${comparisonParams.toString()}`);
          this.comparisonMetrics = comparisonMetricsResponse.data;
          
          // Calculate status movement
          this.calculateStatusMovement(previousCustomers);
          
          // Merge previous status into current customers
          this.customers = this.customers.map(customer => {
            const previousCustomer = previousCustomers.find(pc => pc.id === customer.id);
            return {
              ...customer,
              previousStatus: previousCustomer ? previousCustomer.healthStatus.status : null
            };
          });
        } else {
          this.comparisonMetrics = null;
          this.statusMovement = [];
          this.topAdditions = [];
          this.topRemovals = [];
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    },
    calculateStatusMovement(previousCustomers) {
      const movements = [];
      const additions = [];
      const removals = [];
      
      this.customers.forEach(customer => {
        const previousCustomer = previousCustomers.find(pc => pc.id === customer.id);
        if (previousCustomer && previousCustomer.healthStatus.status !== customer.healthStatus.status) {
          movements.push({
            name: customer.name,
            cso: customer.cso,
            previousStatus: previousCustomer.healthStatus.status,
            currentStatus: customer.healthStatus.status,
            arr: customer.arr
          });
          
          // Track additions to each status
          additions.push({
            name: customer.name,
            arr: customer.arr,
            previousStatus: previousCustomer.healthStatus.status,
            currentStatus: customer.healthStatus.status
          });
          
          // Track removals from each status
          removals.push({
            name: customer.name,
            arr: customer.arr,
            previousStatus: previousCustomer.healthStatus.status,
            currentStatus: customer.healthStatus.status
          });
        }
      });
      
      this.statusMovement = movements;
      this.topAdditions = additions.sort((a, b) => b.arr - a.arr);
      this.topRemovals = removals.sort((a, b) => b.arr - a.arr);
    },
    getChangeIndicator(current, previous) {
      const diff = current - previous;
      if (diff === 0) return '→';
      return diff > 0 ? '↑' : '↓';
    },
    getChangePercentage(current, previous) {
      if (previous === 0) return current > 0 ? '∞' : '0';
      const percentChange = ((current - previous) / previous) * 100;
      return Math.abs(percentChange).toFixed(1);
    },
    getChangeClass(current, previous, invertColors = false) {
      const diff = current - previous;
      if (diff === 0) return 'neutral-change';
      
      const isPositive = diff > 0;
      const isGood = invertColors ? !isPositive : isPositive;
      
      return isGood ? 'positive-change' : 'negative-change';
    },
    formatCurrencyChange(change) {
      const prefix = change > 0 ? '+' : '';
      return `${prefix}$${Math.abs(change).toLocaleString()}`;
    },
    formatCountChange(change) {
      const prefix = change > 0 ? '+' : '';
      return `${prefix}${change}`;
    },
    applyFilters() {
      this.fetchDashboardData();
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 2rem;
}

.dashboard-title {
  margin-bottom: 2rem;
  font-weight: bold;
  color: #333;
}

.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
}

.filter-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
}

.filter-item {
  flex: 1;
  min-width: 200px;
}

.filter-item label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 2rem 0 1rem;
  color: #333;
}

.dashboard-stats {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.health-status-card {
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
  width: 32%;
  flex: 0 0 32%;
}

.red-card {
  background-color: #f8d7da;
  border-left: 5px solid #721c24;
}

.yellow-card {
  background-color: #fff3cd;
  border-left: 5px solid #856404;
}

.green-card {
  background-color: #d4edda;
  border-left: 5px solid #155724;
}

.health-metrics {
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.metric:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.metric-label {
  font-weight: bold;
  color: #495057;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 5px 0;
  color: #4a6fa5;
}

.metric-percentage {
  color: #6c757d;
  font-size: 0.9rem;
}

.metric-change {
  color: #6c757d;
  font-size: 0.9rem;
}

.positive-change {
  color: #28a745;
}

.negative-change {
  color: #dc3545;
}

.neutral-change {
  color: #ffc107;
}

.customer-tooltip {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 10px;
  padding: 10px;
  background-color: rgba(245, 245, 245, 0.9);
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 100;
  text-align: left;
  max-height: 300px;
  overflow-y: auto;
}

.health-status-card:hover .customer-tooltip {
  display: block;
}

.customer-tooltip h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: bold;
}

.tooltip-customer {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 0.85rem;
  padding: 3px 0;
  border-bottom: 1px solid #eee;
}

.tooltip-customer:last-child {
  border-bottom: none;
}

.tooltip-customer-name {
  font-weight: bold;
  color: #333;
  margin-right: 10px;
}

.tooltip-customer-arr {
  color: #333;
  font-weight: 500;
}

.tooltip-status-change {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: bold;
}

.status-red {
  background-color: #dc3545;
  color: white;
}

.status-yellow {
  background-color: #ffc107;
  color: #333;
}

.status-green {
  background-color: #28a745;
  color: white;
}

.tooltip-section {
  margin-bottom: 1rem;
}

.tooltip-section:last-child {
  margin-bottom: 0;
}

.no-data {
  color: #666;
  font-style: italic;
  padding: 0.5rem 0;
}

@media (max-width: 768px) {
  .filter-group {
    flex-direction: column;
  }
  
  .filter-item {
    width: 100%;
  }
  
  .dashboard-stats {
    flex-direction: column;
  }
  
  .health-status-card {
    width: 100%;
  }
}
</style>
