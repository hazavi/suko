// Environment-aware Firebase configuration
export const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || "AIzaSyDzNDLO5LlWgJNkgFx2IbrHRoOirmOmLtY",
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || "suko-d1871.firebaseapp.com",
  databaseURL: import.meta.env?.VITE_FIREBASE_DATABASE_URL || "https://suko-d1871-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || "suko-d1871",
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || "suko-d1871.appspot.com",
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "808281647987",
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || "1:808281647987:web:5d987225ef7e328880f306"
};

console.log('Firebase config loaded:', {
  hasApiKey: !!firebaseConfig.apiKey,
  projectId: firebaseConfig.projectId
});
