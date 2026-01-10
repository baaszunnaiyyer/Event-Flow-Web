import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD5GZKTg1o2baoaK3T5drHkaaMv225SuCI",
  authDomain: "event-flow-5e758.firebaseapp.com",
  projectId: "event-flow-5e758",
  storageBucket: "event-flow-5e758.firebasestorage.app",
  messagingSenderId: "556429365376",
  appId: "1:556429365376:web:1dc2cf87da8fd293915665",
  measurementId: "G-JK6CR45372"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// Add the web client ID from Firebase (same as apiKey for OAuth verification)
googleProvider.addScope('profile');
googleProvider.addScope('email');
// Set custom parameters if needed
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

if (typeof window !== "undefined") {
  getAnalytics(app);
}

export default app;
