<template>
  <div class="snapshot-management">
    <h1 class="page-title">Snapshot Management</h1>
    
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3>Create New Snapshot</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="createSnapshot">
              <div class="mb-3">
                <label for="snapshot-name" class="form-label">Snapshot Name</label>
                <input 
                  id="snapshot-name" 
                  v-model="newSnapshot.name" 
                  type="text" 
                  class="form-control" 
                  required
                >
              </div>
              <div class="mb-3">
                <label for="snapshot-date" class="form-label">Snapshot Date</label>
                <input 
                  id="snapshot-date" 
                  v-model="newSnapshot.snapshotDate" 
                  type="date" 
                  class="form-control" 
                  required
                >
              </div>
              <button type="submit" class="btn btn-primary">Create Snapshot</button>
            </form>
          </div>
        </div>
      </div>
      
      <div class="col-md-6">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h3>Existing Snapshots</h3>
            <button @click="exportCsv" class="btn btn-secondary">Export as CSV</button>
          </div>
          <div class="card-body">
            <table class="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="snapshot in snapshots" :key="snapshot.id">
                  <td>{{ snapshot.name }}</td>
                  <td>{{ formatDate(snapshot.snapshotDate) }}</td>
                  <td>
                    <button 
                      @click="deleteSnapshot(snapshot.id)" 
                      class="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api, { API_URL } from '@/services/api';

export default {
  name: 'SnapshotManagementView',
  data() {
    return {
      snapshots: [],
      newSnapshot: {
        name: '',
        snapshotDate: new Date().toISOString().split('T')[0]
      }
    };
  },
  created() {
    this.fetchSnapshots();
  },
  methods: {
    async fetchSnapshots() {
      try {
        const response = await api.get('/snapshots/');
        this.snapshots = response.data;
      } catch (error) {
        console.error('Error fetching snapshots:', error);
      }
    },
    async createSnapshot() {
      try {
        // Generate a UUID for the snapshot
        const snapshotId = 'snapshot-' + Date.now();
        const snapshotData = {
          ...this.newSnapshot,
          id: snapshotId
        };
        
        console.log('Creating snapshot with data:', snapshotData);
        console.log('Sending request to:', `${API_URL}/snapshots/`);
        
        const response = await api.post('/snapshots/', snapshotData);
        
        console.log('Snapshot created successfully:', response.data);
        
        this.newSnapshot = {
          name: '',
          snapshotDate: new Date().toISOString().split('T')[0]
        };
        this.fetchSnapshots();
        alert('Snapshot created successfully!');
      } catch (error) {
        console.error('Error creating snapshot:', error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
          alert(`Error creating snapshot: Server responded with status ${error.response.status}. Details: ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Request made but no response received:', error.request);
          alert('Error creating snapshot: No response received from server. Check your network connection.');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error setting up request:', error.message);
          alert('Error creating snapshot: ' + error.message);
        }
      }
    },
    async deleteSnapshot(id) {
      if (!confirm('Are you sure you want to delete this snapshot?')) return;
      
      try {
        await api.delete(`/snapshots/${id}`);
        this.fetchSnapshots();
      } catch (error) {
        console.error('Error deleting snapshot:', error);
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
    exportCsv() {
      // Create CSV content
      const headers = ['Name', 'Date'];
      const csvContent = [
        headers.join(','),
        ...this.snapshots.map(snapshot => [
          snapshot.name,
          this.formatDate(snapshot.snapshotDate)
        ].join(','))
      ].join('\n');
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'snapshots.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
</script>

<style scoped>
.snapshot-management {
  padding: 2rem;
}

.page-title {
  margin-bottom: 2rem;
  font-weight: bold;
  color: #333;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin: -0.5rem;
}

.col-md-6 {
  flex: 0 0 calc(50% - 1rem);
  margin: 0.5rem;
}

.card {
  margin-bottom: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
}

.card-header {
  padding: 0.75rem 1.25rem;
  background-color: rgba(0, 0, 0, 0.03);
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}

.card-body {
  padding: 1.25rem;
}

@media (max-width: 768px) {
  .col-md-6 {
    flex: 0 0 100%;
  }
}
</style>
