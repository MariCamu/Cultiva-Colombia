
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCArr2NtU7FN5LTjVRq7cnmrhIVGS_8nOs",
  authDomain: "agrinavigate.firebaseapp.com",
  projectId: "agrinavigate",
  storageBucket: "agrinavigate.firebasestorage.app",
  messagingSenderId: "619147792018",
  appId: "1:619147792018:web:b7591b27fd28c34a62a04b"
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db: Firestore = getFirestore(app);
const auth = getAuth(app);

// For simplicity, storage is commented out as it's not used in the core functionality being debugged.
// import { getStorage } from "firebase/storage";
// const storage = getStorage(app);

export { app, db, auth };
