// Import the functions you need from the SDKs you need
import { getAnalytics } from 'firebase/analytics'
import { initializeApp } from 'firebase/app'
import type { User } from 'firebase/auth'
import { Auth, getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { Firestore, getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const getFirebaseAuth = (): Auth => getAuth(app)
const getFirebaseDb = (): Firestore => getFirestore()
const analytics = getAnalytics(app)
export {
  getFirebaseAuth,
  User,
  getFirebaseDb,
  analytics,
  signInWithEmailAndPassword,
}
