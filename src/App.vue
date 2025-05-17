<template>
  <div id="app">
    <!-- Always show navbar for testing -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/dashboard">Status Monitor</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/snapshots">Snapshot Management</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/portfolio">Portfolio Tracker</router-link>
            </li>
          </ul>
          <div class="d-flex">
            <span class="navbar-text me-3">
              test@example.com (Test User)
            </span>
            <button @click="logout" class="btn btn-outline-light btn-sm">Logout</button>
          </div>
        </div>
      </div>
    </nav>
    
    <main>
      <router-view/>
    </main>
  </div>
</template>

<script>
import authService from './services/auth'

export default {
  name: 'App',
  data() {
    return {
      isAuthenticated: false,
      userInfo: null
    }
  },
  created() {
    // Check authentication status when app is created
    this.checkAuth()
    
    // Listen for route changes to update auth status
    this.$router.beforeEach((to, from, next) => {
      this.checkAuth()
      next()
    })
  },
  methods: {
    checkAuth() {
      this.isAuthenticated = authService.isAuthenticated()
      this.userInfo = authService.getUserInfo()
    },
    logout() {
      authService.logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style>
@import 'bootstrap/dist/css/bootstrap.min.css';

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

main {
  min-height: calc(100vh - 56px);
}
</style>
