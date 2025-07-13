
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCArr2NtU7FN5LTjVRq7cnmrhIVGS_8nOs",
  authDomain: "agrinavigate.firebaseapp.com",
  projectId: "agrinavigate",
  storageBucket: "agrinavigate.firebasestorage.app",
  messagingSenderId: "619147792018",
  appId: "1:619147792018:web:0d779d71bfba162962a04b"
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
const storage = getStorage(app);

export { app, db, auth, storage };
