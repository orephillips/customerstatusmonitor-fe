import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import SnapshotManagementView from '../views/SnapshotManagementView.vue'
import PortfolioTrackerView from '../views/PortfolioTrackerView.vue'
import LoginView from '../views/LoginView.vue'
/* eslint-disable no-unused-vars */
import authService from '../services/auth'
/* eslint-enable no-unused-vars */

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/portfolio',
    name: 'portfolio',
    component: PortfolioTrackerView,
    meta: { requiresAuth: true }
  },
  {
    path: '/snapshots',
    name: 'snapshots',
    component: SnapshotManagementView,
    meta: { requiresAuth: true }
  },
  {
    path: '/auth/callback',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Bypass authentication for testing purposes
router.beforeEach((to, from, next) => {
  // Always allow access regardless of authentication status
  next()
  
  // Original authentication logic (commented out for testing)
  /*
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authService.isAuthenticated()) {
      next({ name: 'login' })
    } else if (!authService.isAllowedDomain()) {
      authService.logout()
      next({ 
        name: 'login',
        query: { error: 'domain_restricted' }
      })
    } else {
      next()
    }
  } else {
    next()
  }
  */
});

export default router
