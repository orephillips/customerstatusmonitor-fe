<template>
  <div class="portfolio-view">
    <h2 class="mb-4">Portfolio Tracker</h2>
    
    <div class="table-header">
      <div class="filter-group">
        <div class="filter-item">
          <label for="snapshot-select">Snapshot:</label>
          <select id="snapshot-select" v-model="selectedSnapshotId" class="form-select">
            <option value="">Select a snapshot</option>
            <option v-for="snapshot in snapshots" :key="snapshot.id" :value="snapshot.id">
              {{ snapshot.name }}
            </option>
          </select>
        </div>
        <div class="filter-item">
          <label for="cso-select">CSO:</label>
          <input id="cso-select" type="text" v-model="selectedCso" class="form-select" placeholder="Filter by CSO" list="cso-options">
          <datalist id="cso-options">
            <option v-for="cso in csos" :key="cso.id" :value="cso.name">{{ cso.name }}</option>
          </datalist>
        </div>
        <div class="filter-item checkbox-filter">
          <label for="show-custom-fields" class="form-label">Show Custom Fields</label>
          <input 
            id="show-custom-fields" 
            v-model="showCustomFields" 
            type="checkbox" 
            class="form-check-input"
          >
        </div>

      </div>
    </div>
    
    <div class="action-buttons mb-3">
      <button @click="saveAllChanges" class="btn btn-success me-2">Save All Selected Rows</button>
      <button @click="pushSelectedToSlack" class="btn btn-info me-2" :disabled="selectedCustomers.length === 0">
        Push Selected to Slack
      </button>
      <button @click="showAddCustomerModal = true" class="btn btn-primary">Add New Customer</button>
    </div>
    
    <div class="table-container">
      <table class="customer-table">
        <thead>
          <tr>
            <th>
              <input 
                type="checkbox" 
                id="select-all" 
                v-model="selectAll"
                @change="toggleSelectAll"
                title="Select all customers"
              />
            </th>
            <th>Customer Name</th>
            <th>CSO</th>
            <th>ARR</th>
            <th>Customer ID</th>
            <th>Type</th>
            <th>Slack Channel ID</th>
            <th>Last Interaction Type</th>
            <th>Last Interaction Date</th>
            <th v-if="showCustomFields">Custom Field 1</th>
            <th v-if="showCustomFields">Custom Field 2</th>
            <th v-if="showCustomFields">Custom Field 3</th>
            <th v-if="showCustomFields">Custom Field 4</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="customer in customers" :key="customer.id">
            <!-- Customer info row -->
            <tr class="customer-info-row">
              <td>
                <input 
                  type="checkbox" 
                  v-model="selectedCustomers" 
                  :value="customer.id"
                  title="Select this customer for bulk actions"
                />
              </td>
              <td>
                <input 
                  type="text" 
                  v-model="customer.name"
                  placeholder="Customer Name"
                  class="standard-input"
                />
              </td>
              <td>
                <input 
                  type="text" 
                  v-model="customer.cso" 
                  placeholder="CSO Name"
                  class="standard-input"
                />
              </td>
              <td>
                <input 
                  type="number" 
                  v-model="customer.arr"
                  placeholder="Annual Recurring Revenue"
                  class="standard-input"
                />
              </td>
              <td>
                <input 
                  type="text" 
                  v-model="customer.customerId"
                  placeholder="Customer ID"
                  class="standard-input"
                />
              </td>
              <td>
                <select 
                  v-model="customer.customerType" 
                  class="standard-input"
                >
                  <option v-for="type in customerTypes" :key="type.id" :value="type.id">
                    {{ type.name }}
                  </option>
                </select>
              </td>
              <td>
                <input 
                  type="text" 
                  v-model="customer.slackChannel"
                  placeholder="Enter Slack Channel ID"
                  class="standard-input"
                />
              </td>
              <td>
                <input 
                  type="text" 
                  v-model="customer.lastInteractionType"
                  placeholder="e.g., Slack, Zoom, Email"
                  class="standard-input"
                />
              </td>
              <td>
                <input 
                  type="date" 
                  v-model="customer.lastInteractionDate"
                  class="standard-input"
                />
              </td>
              <td v-if="showCustomFields">
                <input 
                  type="text" 
                  v-model="customer.customField1"
                  placeholder="Custom Field 1"
                  class="standard-input"
                />
              </td>
              <td v-if="showCustomFields">
                <input 
                  type="text" 
                  v-model="customer.customField2"
                  placeholder="Custom Field 2"
                  class="standard-input"
                />
              </td>
              <td v-if="showCustomFields">
                <input 
                  type="text" 
                  v-model="customer.customField3"
                  placeholder="Custom Field 3"
                  class="standard-input"
                />
              </td>
              <td v-if="showCustomFields">
                <input 
                  type="text" 
                  v-model="customer.customField4"
                  placeholder="Custom Field 4"
                  class="standard-input"
                />
              </td>
              <td>
                <div class="button-container">
                  <button 
                    class="delete-customer-button" 
                    @click="confirmDeleteCustomer(customer)"
                    title="Delete this customer"
                  >
                    ✕
                  </button>
                </div>
              </td>
            </tr>
            
            <!-- Health status and notes row -->
            <tr class="health-status-row">
              <td colspan="20" class="health-status-cell">
                <div class="health-section-wrapper">
                  <div class="health-section">
                    <div class="health-status-header">
                      <h4>Health Update</h4>
                      <span class="period-indicator">{{ snapshots.find(p => p.id === selectedSnapshotId)?.name || 'Current Snapshot' }}</span>
                    </div>
                    
                    <div class="health-status-container-wrapper">
                      <div class="health-status-row-container">
                        <div class="health-status-container">
                          <label class="section-label">Health Status:</label>
                          <div class="health-status-selector">
                            <button 
                              class="health-status-button red" 
                              :class="{ 'active': customer.healthStatus.status === 'red' }"
                              @click="setHealthStatus(customer, 'red')"
                              title="Red - Critical issues"
                            >R</button>
                            <button 
                              class="health-status-button yellow" 
                              :class="{ 'active': customer.healthStatus.status === 'yellow' }"
                              @click="setHealthStatus(customer, 'yellow')"
                              title="Yellow - Some concerns"
                            >Y</button>
                            <button 
                              class="health-status-button green" 
                              :class="{ 'active': customer.healthStatus.status === 'green' }"
                              @click="setHealthStatus(customer, 'green')"
                              title="Green - Healthy"
                            >G</button>
                          </div>
                        </div>
                        
                        <div class="status-notes-container">
                          <label class="section-label">Status Notes:</label>
                          <textarea 
                            v-model="customer.healthStatus.statusNotes"
                            placeholder="Enter status notes for this period..."
                            class="notes-textarea"
                          ></textarea>
                        </div>
                        
                        <div class="bug-status-container">
                          <label class="section-label">New Bug?</label>
                          <select 
                            v-model="customer.healthStatus.hasBug"
                            class="bug-select"
                          >
                            <option :value="false">No</option>
                            <option :value="true">Yes</option>
                          </select>
                        </div>
                        
                        <div class="bug-notes-container" :class="{ 'disabled': !customer.healthStatus.hasBug }">
                          <label class="section-label">Bug Notes:</label>
                          <textarea 
                            v-model="customer.healthStatus.bugNotes"
                            placeholder="Describe the bug if applicable..."
                            class="notes-textarea"
                            :disabled="!customer.healthStatus.hasBug"
                          ></textarea>
                        </div>
                        
                        <div class="save-button-container">
                          <button 
                            class="save-button"
                            @click="saveCustomerRow(customer)"
                            title="Save customer data and health status changes"
                          >
                            Save Row
                          </button>
                          <button 
                            class="push-slack-button"
                            @click="pushToSlack(customer.id)"
                            title="Push health status to Slack"
                            :disabled="!customer.slackChannel"
                          >
                            Push to Slack
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    
    <!-- Add Customer Modal -->
    <div v-if="showAddCustomerModal" class="modal-backdrop">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add New Customer</h5>
            <button @click="showAddCustomerModal = false" class="btn-close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addCustomer">
              <div class="mb-3">
                <label for="new-customer-name" class="form-label">Customer Name</label>
                <input id="new-customer-name" v-model="newCustomer.name" class="form-control" required>
              </div>
              <div class="mb-3">
                <label for="new-customer-id" class="form-label">Customer ID</label>
                <input id="new-customer-id" v-model="newCustomer.customerId" class="form-control" required>
              </div>
              <div class="mb-3">
                <label for="new-customer-cso" class="form-label">CSO</label>
                <input id="new-customer-cso" type="text" v-model="newCustomer.cso" class="form-control" placeholder="Enter CSO Name" required>
              </div>
              <div class="mb-3">
                <label for="new-customer-arr" class="form-label">Annual Recurring Revenue (ARR)</label>
                <input id="new-customer-arr" type="number" v-model="newCustomer.arr" class="form-control" required>
              </div>
              <div class="mb-3">
                <label for="new-customer-type" class="form-label">Customer Type</label>
                <select id="new-customer-type" v-model="newCustomer.customerType" class="form-select" required>
                  <option value="">Select Type</option>
                  <option v-for="type in customerTypes" :key="type.id" :value="type.id">
                    {{ type.name }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label for="new-customer-slack" class="form-label">Slack Channel ID</label>
                <input id="new-customer-slack" v-model="newCustomer.slackChannel" class="form-control">
              </div>
              <div class="modal-footer">
                <button type="button" @click="showAddCustomerModal = false" class="btn btn-secondary">Cancel</button>
                <button type="submit" class="btn btn-primary">Add Customer</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div class="modal-backdrop" v-if="showDeleteModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Confirm Delete</h3>
            <button class="btn-close" @click="showDeleteModal = false"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete {{ customerToDelete?.name }}?</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showDeleteModal = false">Cancel</button>
            <button class="btn btn-danger" @click="deleteCustomerConfirmed">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api, { API_URL } from '@/services/api';

export default {
  name: 'PortfolioTrackerView',
  watch: {
    selectedSnapshotId(newVal) {
      if (newVal) {
        this.fetchCustomers();
      }
    },
    selectedCso() {
      if (this.selectedSnapshotId) {
        this.fetchCustomers();
      }
    }
  },
  data() {
    return {
      snapshots: [],
      csos: [],
      customerTypes: [],
      customers: [],
      selectedSnapshotId: '',
      selectedCso: '',
      showCustomFields: false,
      selectedCustomers: [],
      selectAll: false,
      showAddCustomerModal: false,
      showDeleteModal: false,
      customerToDelete: null,
      newCustomer: {
        name: '',
        customerId: '',
        cso: '',
        arr: 0,
        customerType: '',
        slackChannel: '',
        healthStatus: {
          status: 'green',
          hasBug: false,
          statusNotes: '',
          bugNotes: ''
        }
      }
    };
  },
  created() {
    this.fetchSnapshots();
    this.fetchCsos();
    this.fetchCustomerTypes();
  },
  methods: {
    async fetchSnapshots() {
      try {
        const response = await api.get('/snapshots');
        this.snapshots = response.data;
        if (this.snapshots.length > 0) {
          this.selectedSnapshotId = this.snapshots[0].id;
          this.fetchCustomers();
        }
      } catch (error) {
        console.error('Error fetching snapshots:', error);
      }
    },
    async fetchCsos() {
      try {
        const response = await api.get('/dashboard/csos');
        this.csos = response.data;
      } catch (error) {
        console.error('Error fetching CSOs:', error);
      }
    },
    async fetchCustomerTypes() {
      try {
        const response = await api.get('/dashboard/customer-types');
        this.customerTypes = response.data;
      } catch (error) {
        console.error('Error fetching customer types:', error);
      }
    },
    async fetchCustomers() {
      if (!this.selectedSnapshotId) return;
      
      try {
        const params = new URLSearchParams();
        params.append('snapshotId', this.selectedSnapshotId);
        if (this.selectedCso) params.append('cso', this.selectedCso);
        
        const response = await api.get(`/customers?${params.toString()}`);
        this.customers = response.data;
        this.selectedCustomers = [];
        this.selectAll = false;
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    },
    applyFilters() {
      this.fetchCustomers();
    },
    toggleSelectAll() {
      if (this.selectAll) {
        this.selectedCustomers = this.customers.map(c => c.id);
      } else {
        this.selectedCustomers = [];
      }
    },
    setHealthStatus(customer, status) {
      customer.healthStatus.status = status;
    },
    async saveAllChanges() {
      console.log('saveAllChanges called');
      console.log('selectedCustomers:', this.selectedCustomers);
      
      try {
        const selectedCustomers = this.customers.filter(customer => 
          this.selectedCustomers.includes(customer.id)
        );
        
        console.log('filtered selectedCustomers:', selectedCustomers);
        
        if (selectedCustomers.length === 0) {
          alert('Please select at least one customer to save changes.');
          return;
        }
        
        const promises = selectedCustomers.map(async customer => {
          // First save customer data (static fields that persist across snapshots)
          const customerData = {
            name: customer.name,
            customerId: customer.customerId,
            cso: customer.cso,
            arr: customer.arr,
            customerType: customer.customerType,
            slackChannel: customer.slackChannel,
            lastInteractionType: customer.lastInteractionType,
            lastInteractionDate: customer.lastInteractionDate,
            customField1: customer.customField1,
            customField2: customer.customField2,
            customField3: customer.customField3,
            customField4: customer.customField4
          };
          
          console.log('Saving customer data:', customerData);
          await api.patch(`/customers/${customer.id}`, customerData);
          
          // Then save health status (snapshot-specific data)
          console.log('Saving health status:', customer.healthStatus);
          await api.patch(`/customers/${customer.id}/health?snapshotId=${this.selectedSnapshotId}`, customer.healthStatus);
        });
        
        await Promise.all(promises);
        console.log('All saves completed successfully');
        alert('All selected customer data and health status changes saved successfully!');
      } catch (error) {
        console.error('Error saving changes:', error);
        alert('Error saving changes. Please try again.');
      }
    },
    async pushToSlack(customerId) {
      try {
        await api.post(`/customers/${customerId}/push-to-slack?snapshotId=${this.selectedSnapshotId}`);
        alert('Customer pushed to Slack successfully!');
      } catch (error) {
        console.error('Error pushing to Slack:', error);
        alert('Error pushing to Slack. Please try again.');
      }
    },
    async pushSelectedToSlack() {
      if (this.selectedCustomers.length === 0) return;
      
      try {
        const promises = this.selectedCustomers.map(customerId => 
          axios.post(`${API_URL}/customers/${customerId}/push-to-slack?snapshotId=${this.selectedSnapshotId}`)
        );
        
        await Promise.all(promises);
        alert('Selected customers pushed to Slack successfully!');
      } catch (error) {
        console.error('Error pushing to Slack:', error);
        alert('Error pushing to Slack. Please try again.');
      }
    },
    async addCustomer() {
      try {
        await api.post('/customers', this.newCustomer);
        this.showAddCustomerModal = false;
        this.newCustomer = {
          name: '',
          customerId: '',
          cso: '',
          arr: 0,
          customerType: '',
          slackChannel: '',
          healthStatus: {
            status: 'green',
            hasBug: false,
            statusNotes: '',
            bugNotes: ''
          }
        };
        this.fetchCustomers();
      } catch (error) {
        console.error('Error adding customer:', error);
        alert('Error adding customer. Please try again.');
      }
    },
    confirmDeleteCustomer(customer) {
      this.customerToDelete = customer;
      this.showDeleteModal = true;
    },
    async deleteCustomerConfirmed() {
      if (!this.customerToDelete) return;
      
      try {
        await api.delete(`/customers/${this.customerToDelete.id}`);
        this.showDeleteModal = false;
        this.customerToDelete = null;
        this.fetchCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Error deleting customer. Please try again.');
      }
    },
    async updateHealthStatus(customer) {
      try {
        await api.patch(`/customers/${customer.id}/health?snapshotId=${this.selectedSnapshotId}`, customer.healthStatus);
        alert('Health status updated successfully!');
      } catch (error) {
        console.error('Error updating health status:', error);
        alert('Error updating health status. Please try again.');
      }
    },
    
    async updateCustomerData(customer) {
      try {
        // Extract customer data without health status
        const customerData = {
          name: customer.name,
          customerId: customer.customerId,
          cso: customer.cso,
          arr: customer.arr,
          customerType: customer.customerType,
          slackChannel: customer.slackChannel,
          lastInteractionType: customer.lastInteractionType,
          lastInteractionDate: customer.lastInteractionDate,
          customField1: customer.customField1,
          customField2: customer.customField2,
          customField3: customer.customField3,
          customField4: customer.customField4
        };
        
        await api.patch(`/customers/${customer.id}`, customerData);
        return true;
      } catch (error) {
        console.error('Error updating customer data:', error);
        alert('Error updating customer data. Please try again.');
        return false;
      }
    },
    
    async saveCustomerRow(customer) {
      // First save customer data (static fields that persist across snapshots)
      const customerDataSaved = await this.updateCustomerData(customer);
      
      // Then save health status (snapshot-specific data)
      try {
        if (customerDataSaved) {
          await api.patch(`/customers/${customer.id}/health?snapshotId=${this.selectedSnapshotId}`, customer.healthStatus);
          alert('Customer data and health status updated successfully!');
        }
      } catch (error) {
        console.error('Error updating health status:', error);
        alert('Customer data saved, but health status update failed. Please try again.');
      }
    }
  }
}
</script>

<style scoped>
.portfolio-view {
  padding: 2rem;
}

.table-header {
  margin-bottom: 1.5rem;
}

.filter-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
}

.filter-item {
  flex: 1;
  min-width: 200px;
}

.checkbox-filter {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.filter-item label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 2rem;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
}

.customer-table {
  width: 100%;
  border-collapse: collapse;
}

.customer-table th,
.customer-table td {
  padding: 0.75rem;
  border: 1px solid #dee2e6;
}

.customer-table thead th {
  background-color: #f8f9fa;
  font-weight: 600;
  text-align: left;
}

.customer-info-row {
  background-color: #fff;
}

.health-status-row {
  background-color: #f8f9fa;
}

.health-status-cell {
  padding: 0 !important;
}

.health-section-wrapper {
  padding: 1rem;
}

.health-section {
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  padding: 1rem;
  background-color: #fff;
}

.health-status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.health-status-header h4 {
  margin: 0;
  font-size: 1.1rem;
}

.period-indicator {
  font-size: 0.9rem;
  color: #6c757d;
}

.health-status-container-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.health-status-row-container {
  display: flex;
  flex-wrap: nowrap;
  gap: 1rem;
  align-items: flex-start;
  width: 100%;
}

.health-status-container {
  flex: 0 0 auto;
  width: 150px;
}

.bug-status-container {
  flex: 0 0 auto;
  width: 120px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.status-notes-container,
.bug-notes-container {
  flex: 1 1 auto;
  min-width: 25%;
}

.save-button-container {
  flex: 0 0 auto;
  width: 150px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  margin-left: auto;
  align-self: flex-start;
}

.section-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  margin-top: 0;
}

.health-status-selector {
  display: flex;
  gap: 0.5rem;
}

.health-status-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid transparent;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.health-status-button.red {
  background-color: #f8d7da;
  color: #721c24;
  border-color: #f5c6cb;
}

.health-status-button.yellow {
  background-color: #fff3cd;
  color: #856404;
  border-color: #ffeeba;
}

.health-status-button.green {
  background-color: #d4edda;
  color: #155724;
  border-color: #c3e6cb;
}

.health-status-button.active {
  border-width: 3px;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.bug-select {
  width: 100%;
  padding: 0.375rem 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
}

.save-button,
.push-slack-button {
  padding: 0.375rem 0.75rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  cursor: pointer;
  margin-bottom: 0.5rem;
  width: 100%;
}

.save-button {
  background-color: #28a745;
  color: #fff;
}

.push-slack-button {
  background-color: #17a2b8;
  color: #fff;
}

.notes-container-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.notes-textarea {
  width: 100%;
  min-height: 40px;
  max-height: 80px;
  padding: 0.375rem 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  resize: vertical;
}

.bug-notes-container.disabled .notes-textarea {
  background-color: #e9ecef;
  cursor: not-allowed;
}

.standard-input {
  width: 100%;
  padding: 0.375rem 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
}

.button-container {
  display: flex;
  justify-content: center;
}

.delete-customer-button {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #dc3545;
  color: #fff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-dialog {
  width: 100%;
  max-width: 500px;
  margin: 1.75rem auto;
}

.modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #fff;
  border-radius: 0.3rem;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
  border-top: 1px solid #dee2e6;
}

@media (max-width: 768px) {
  .filter-group {
    flex-direction: column;
  }
  
  .filter-item {
    width: 100%;
  }
  
  .health-status-container-wrapper,
  .notes-container-wrapper {
    flex-direction: column;
  }
}
</style>
