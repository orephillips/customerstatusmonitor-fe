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
router.beforeEach(async (to, from, next) => {
  console.log('Router guard: checking route', to.path);
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  // Wait for Firebase Auth to initialize
  const waitForAuthInit = () => {
    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        unsubscribe();
        resolve(user);
      });
    });
  };
  
  // Get current user, waiting for auth to initialize if necessary
  const currentUser = auth.currentUser || await waitForAuthInit();
  console.log('Router guard: current user', currentUser ? currentUser.email : 'none');
  
  // Handle test mode - remove this in production
  if (to.query.test === 'true') {
    console.log('Test mode enabled, bypassing authentication');
    return next();
  }
  
  if (requiresAuth && !currentUser) {
    // Redirect to login if authentication is required but user is not logged in
    console.log('Router guard: redirecting to login (not authenticated)');
    return next({ name: 'login' });
  } else if (requiresAuth && currentUser) {
    // Check if user is from allowed domain
    if (currentUser.email && currentUser.email.endsWith('@bitwave.io')) {
      // Allow access if from allowed domain
      console.log('Router guard: allowing access (authenticated with allowed domain)');
      return next();
    } else {
      // Logout and redirect to login if not from allowed domain
      console.log('Router guard: logging out (not from allowed domain)');
      await auth.signOut();
      return next({ 
        name: 'login',
        query: { error: 'domain_restricted' }
      });
    }
  } else {
    // Allow access to non-protected routes
    console.log('Router guard: allowing access (non-protected route)');
    return next();
  }
});

export default router
