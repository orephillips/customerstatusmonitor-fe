<template>
  <div id="app">
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
    
    <template v-else>
      <!-- Only show navbar when authenticated -->
      <nav v-if="isAuthenticated" class="navbar navbar-expand-lg navbar-dark bg-dark">
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
            <div class="d-flex" v-if="user">
              <span class="navbar-text me-3">
                {{ user.email }} ({{ user.displayName || 'User' }})
              </span>
              <button @click="logout" class="btn btn-outline-light btn-sm">Logout</button>
            </div>
          </div>
        </div>
      </nav>
      
      <main>
        <router-view/>
      </main>
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from './firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'

export default {
  name: 'App',
  setup() {
    const router = useRouter()
    const user = ref(null)
    const loading = ref(true)
    
    const isAuthenticated = computed(() => user.value !== null)
    
    onMounted(() => {
      // Set up authentication state listener
      onAuthStateChanged(auth, (currentUser) => {
        user.value = currentUser
        loading.value = false
        
        // If on a protected route but not authenticated, redirect to login
        if (!currentUser && router.currentRoute.value.meta.requiresAuth) {
          router.push('/login')
        }
        
        // If authenticated but not from allowed domain, log out
        if (currentUser && currentUser.email && !currentUser.email.endsWith('@bitwave.io')) {
          signOut(auth).then(() => {
            router.push({
              name: 'login',
              query: { error: 'domain_restricted' }
            })
          })
        }
      })
    })
    
    const logout = async () => {
      try {
        await signOut(auth)
        router.push('/login')
      } catch (error) {
        console.error('Logout error:', error)
      }
    }
    
    return {
      user,
      loading,
      isAuthenticated,
      logout
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
