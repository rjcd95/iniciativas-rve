import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

// Validate Firebase configuration
const validateConfig = () => {
  if (typeof window !== "undefined") {
    const missing = [];
    if (!firebaseConfig.apiKey) missing.push("NEXT_PUBLIC_FIREBASE_API_KEY");
    if (!firebaseConfig.authDomain) missing.push("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
    if (!firebaseConfig.projectId) missing.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
    if (!firebaseConfig.storageBucket) missing.push("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
    if (!firebaseConfig.messagingSenderId) missing.push("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID");
    if (!firebaseConfig.appId) missing.push("NEXT_PUBLIC_FIREBASE_APP_ID");
    
    if (missing.length > 0) {
      console.error("❌ Firebase configuration missing:", missing);
      console.error("💡 Make sure you have a .env.local file with all Firebase credentials");
      console.error("💡 Restart the dev server after creating/updating .env.local");
      return false;
    }
  }
  return true;
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

if (typeof window !== "undefined") {
  if (validateConfig()) {
    try {
      if (!getApps().length) {
        // Validate all required fields are present
        if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
          console.error("❌ Firebase configuration is incomplete");
          console.error("Missing:", {
            apiKey: !firebaseConfig.apiKey,
            projectId: !firebaseConfig.projectId,
          });
        } else {
          app = initializeApp(firebaseConfig);
          console.log("✅ Firebase initialized successfully");
          auth = getAuth(app);
          db = getFirestore(app);
          storage = getStorage(app);
        }
      } else {
        app = getApps()[0];
        auth = getAuth(app);
        db = getFirestore(app);
        storage = getStorage(app);
      }
    } catch (error: any) {
      console.error("❌ Error initializing Firebase:", error);
      if (error.message?.includes("configuration")) {
        console.error("💡 Make sure:");
        console.error("   1. .env.local file exists in the project root");
        console.error("   2. All NEXT_PUBLIC_FIREBASE_* variables are set");
        console.error("   3. You restarted the dev server after creating .env.local");
        console.error("   4. Authentication is enabled in Firebase Console");
      }
    }
  } else {
    console.error("❌ Firebase configuration validation failed");
  }
}

export { app, auth, db, storage };

