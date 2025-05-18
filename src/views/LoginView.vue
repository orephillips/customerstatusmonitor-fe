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
import { ref } from 'vue';
import { auth } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

export default {
  name: 'LoginView',
  setup() {
    const error = ref(null);
    const loading = ref(false);
    
    // Check if user is already authenticated
    if (auth.currentUser) {
      checkUserDomain(auth.currentUser);
    }
    
    // Function to check if user's email is from allowed domain
    const checkUserDomain = async (user) => {
      if (user && user.email) {
        if (user.email.endsWith('@bitwave.io')) {
          // Redirect to dashboard if from allowed domain
          window.location.href = '/';
        } else {
          // Logout if not from allowed domain
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
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        await checkUserDomain(result.user);
      } catch (err) {
        console.error('Authentication error:', err);
        error.value = 'Authentication failed. Please try again.';
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
