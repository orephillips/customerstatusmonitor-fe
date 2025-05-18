import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import SnapshotManagementView from '../views/SnapshotManagementView.vue'
import PortfolioTrackerView from '../views/PortfolioTrackerView.vue'
import LoginView from '../views/LoginView.vue'
import { auth } from '../firebase'

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

// Authentication guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const currentUser = auth.currentUser;
  
  if (requiresAuth && !currentUser) {
    // Redirect to login if authentication is required but user is not logged in
    next({ name: 'login' });
  } else if (requiresAuth && currentUser) {
    // Check if user is from allowed domain
    if (currentUser.email && currentUser.email.endsWith('@bitwave.io')) {
      // Allow access if from allowed domain
      next();
    } else {
      // Logout and redirect to login if not from allowed domain
      auth.signOut().then(() => {
        next({ 
          name: 'login',
          query: { error: 'domain_restricted' }
        });
      });
    }
  } else {
    // Allow access to non-protected routes
    next();
  }
});

export default router
