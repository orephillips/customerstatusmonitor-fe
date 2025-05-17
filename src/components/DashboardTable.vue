<template>
  <div class="dashboard-table">
    <div class="card">
      <div class="card-header">
        <h3>Customer Health Comparison</h3>
      </div>
      <div class="card-body">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Customer</th>
              <th>CSO</th>
              <th>Type</th>
              <th>Current Status</th>
              <th v-if="showComparison">Previous Status</th>
              <th v-if="showComparison">Change</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in customers" :key="customer.id">
              <td>{{ customer.name }}</td>
              <td>{{ getCsoName(customer.cso) }}</td>
              <td>{{ getCustomerTypeName(customer.customerType) }}</td>
              <td>
                <span :class="getStatusClass(customer.healthStatus.status)">
                  {{ getStatusText(customer.healthStatus.status) }}
                </span>
              </td>
              <td v-if="showComparison">
                <span :class="getStatusClass(customer.previousStatus || 'unknown')">
                  {{ getStatusText(customer.previousStatus || 'unknown') }}
                </span>
              </td>
              <td v-if="showComparison">
                <span :class="getChangeClass(customer.healthStatus.status, customer.previousStatus)">
                  {{ getChangeText(customer.healthStatus.status, customer.previousStatus) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardTable',
  props: {
    customers: {
      type: Array,
      default: () => []
    },
    csos: {
      type: Array,
      default: () => []
    },
    customerTypes: {
      type: Array,
      default: () => []
    },
    showComparison: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getCsoName(csoId) {
      const cso = this.csos.find(c => c.id === csoId);
      return cso ? cso.name : csoId;
    },
    getCustomerTypeName(typeId) {
      const type = this.customerTypes.find(t => t.id === typeId);
      return type ? type.name : typeId;
    },
    getStatusClass(status) {
      switch (status) {
        case 'green': return 'status-green';
        case 'yellow': return 'status-yellow';
        case 'red': return 'status-red';
        default: return 'status-unknown';
      }
    },
    getStatusText(status) {
      switch (status) {
        case 'green': return 'Healthy';
        case 'yellow': return 'Some Concerns';
        case 'red': return 'Critical Issues';
        default: return 'Unknown';
      }
    },
    getChangeClass(current, previous) {
      if (!previous || previous === 'unknown') return 'change-neutral';
      
      const statusRank = {
        'green': 3,
        'yellow': 2,
        'red': 1,
        'unknown': 0
      };
      
      const currentRank = statusRank[current] || 0;
      const previousRank = statusRank[previous] || 0;
      
      if (currentRank > previousRank) return 'change-positive';
      if (currentRank < previousRank) return 'change-negative';
      return 'change-neutral';
    },
    getChangeText(current, previous) {
      if (!previous || previous === 'unknown') return 'N/A';
      
      const statusRank = {
        'green': 3,
        'yellow': 2,
        'red': 1,
        'unknown': 0
      };
      
      const currentRank = statusRank[current] || 0;
      const previousRank = statusRank[previous] || 0;
      
      if (currentRank > previousRank) return 'Improved';
      if (currentRank < previousRank) return 'Declined';
      return 'No Change';
    }
  }
}
</script>

<style scoped>
.dashboard-table {
  margin-bottom: 2rem;
}

.status-green {
  color: #28a745;
  font-weight: bold;
}

.status-yellow {
  color: #ffc107;
  font-weight: bold;
}

.status-red {
  color: #dc3545;
  font-weight: bold;
}

.status-unknown {
  color: #6c757d;
  font-style: italic;
}

.change-positive {
  color: #28a745;
}

.change-negative {
  color: #dc3545;
}

.change-neutral {
  color: #6c757d;
}
</style>
