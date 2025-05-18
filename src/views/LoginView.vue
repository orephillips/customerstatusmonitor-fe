<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Status Monitor</h1>
      <p class="subtitle">Sign in with your Bitwave Google account</p>
      
      <div class="logo-container">
        <img src="@/assets/logo.png" alt="Status Monitor Logo" class="logo">
      </div>
      
      <div class="login-button-container">
        <button @click="signInWithGoogle" class="google-login-button" :disabled="loading">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google Logo" class="google-icon">
          Sign in with Google
        </button>
      </div>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <div class="domain-restriction">
        <p>* Only @bitwave.io email addresses are allowed</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

export default {
  name: 'LoginView',
  setup() {
    const error = ref(null);
    const loading = ref(false);
    const router = useRouter();
    
    // Check for error in URL query params
    onMounted(() => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('error') === 'domain_restricted') {
        error.value = 'Access denied. Only @bitwave.io email addresses are allowed.';
      }
      
      // Check if user is already authenticated
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log('Login page: auth state changed', user ? `User: ${user.email}` : 'No user');
        if (user) {
          checkUserDomain(user);
        }
      });
      
      // Clean up the listener when component unmounts
      return () => unsubscribe();
    });
    
    // Function to check if user's email is from allowed domain
    const checkUserDomain = async (user) => {
      if (user && user.email) {
        console.log('Checking user domain for:', user.email);
        if (user.email.endsWith('@bitwave.io')) {
          // Redirect to dashboard if from allowed domain
          console.log('User from allowed domain, redirecting to dashboard');
          router.push('/dashboard');
        } else {
          // Logout if not from allowed domain
          console.log('User not from allowed domain, logging out');
          error.value = 'Access denied. Only @bitwave.io email addresses are allowed.';
          await signOut(auth);
        }
      }
    };
    
    // Sign in with Google
    const signInWithGoogle = async () => {
      loading.value = true;
      error.value = null;
      
      try {
        console.log('Attempting Google sign-in');
        const provider = new GoogleAuthProvider();
        // Add scopes if needed
        provider.addScope('profile');
        provider.addScope('email');
        
        const result = await signInWithPopup(auth, provider);
        console.log('Sign-in successful:', result.user.email);
        await checkUserDomain(result.user);
      } catch (err) {
        console.error('Authentication error:', err);
        error.value = 'Authentication failed: ' + (err.message || 'Please try again.');
      } finally {
        loading.value = false;
      }
    };
    
    return {
      error,
      loading,
      signInWithGoogle
    };
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.login-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 400px;
  text-align: center;
}

h1 {
  color: #333;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  margin-bottom: 30px;
}

.logo-container {
  margin-bottom: 30px;
}

.logo {
  max-width: 120px;
}

.google-login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4285F4;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s;
}

.google-login-button:hover {
  background-color: #3367D6;
}

.google-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  background-color: white;
  padding: 2px;
  border-radius: 2px;
}

.error-message {
  color: #d32f2f;
  margin-top: 20px;
  padding: 10px;
  background-color: #ffebee;
  border-radius: 4px;
}

.domain-restriction {
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}
</style>
