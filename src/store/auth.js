import { ref, computed } from 'vue';
import { auth } from '@/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// State
const user = ref(null);
const loading = ref(true);

// Initialize
onAuthStateChanged(auth, (currentUser) => {
  user.value = currentUser;
  loading.value = false;
});

// Getters
const isAuthenticated = computed(() => user.value !== null);
const currentUser = computed(() => user.value);

// Actions
const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export default {
  user,
  loading,
  isAuthenticated,
  currentUser,
  logout
};
