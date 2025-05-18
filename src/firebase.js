import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// Replace these values with your Firebase project configuration
// You can find these in your Firebase project settings
const firebaseConfig = {
  apiKey: "AIzaSyCVrY3LtFqrLe1Z-eBJTFNoLHEkIb73KTQ",
  authDomain: "bitwave-dev-solutions-ai-hacks.firebaseapp.com",
  projectId: "bitwave-dev-solutions-ai-hacks",
  storageBucket: "bitwave-dev-solutions-ai-hacks.firebasestorage.app",
  messagingSenderId: "196567358109",
  appId: "1:196567358109:web:a05571dc695657dd83d274"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
