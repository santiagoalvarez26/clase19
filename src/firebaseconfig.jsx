// firebaseconfig.jsx
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDbBpoCnUeqKThbOjJ8Br_UnyCuppyxsdk",
  authDomain: "clase19-2ba53.firebaseapp.com",
  projectId: "clase19-2ba53",
  storageBucket: "clase19-2ba53.firebasestorage.app",
  messagingSenderId: "388413525260",
  appId: "1:388413525260:web:e2565b651ea1bc15378d29"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
