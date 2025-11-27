import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  User as FirebaseUser
} from "firebase/auth";
import { auth } from "./config";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config";
import { User } from "@/types";

// Simple email-based authentication (no password required)
// We'll use a dummy password or email link authentication
export const signInWithEmail = async (email: string): Promise<FirebaseUser> => {
  // Validate that auth is initialized
  if (!auth) {
    throw new Error(
      "Firebase Auth no está configurado. Verifica que:\n" +
      "1. El archivo .env.local existe con todas las variables NEXT_PUBLIC_FIREBASE_*\n" +
      "2. Has reiniciado el servidor después de crear .env.local\n" +
      "3. Authentication está habilitado en Firebase Console"
    );
  }

  // For simplicity, we'll use a temporary password approach
  // In production, you might want to use Firebase's email link authentication
  const tempPassword = "temp123456"; // This will be ignored in our flow
  
  try {
    // First, try to create the user (this will fail if user already exists)
    const userCredential = await createUserWithEmailAndPassword(auth, email, tempPassword);
    
    // Create user document in Firestore
    if (db) {
      await setDoc(doc(db, "users", email), {
        email,
        createdAt: serverTimestamp(),
      });
    }
    
    return userCredential.user;
  } catch (error: any) {
    // If user already exists, try to sign in
    if (error.code === "auth/email-already-in-use") {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, tempPassword);
        return userCredential.user;
      } catch (signInError: any) {
        // If sign in fails, the password might be different
        // In this case, we need to handle it
        if (signInError.code === "auth/invalid-credential" || signInError.code === "auth/wrong-password") {
          // User exists but with different password - this shouldn't happen with our flow
          // But if it does, we'll try to create a new account or handle it
          throw new Error(
            "No se pudo iniciar sesión. El usuario existe pero las credenciales no coinciden.\n" +
            "Por favor, contacta al administrador o intenta con otro correo."
          );
        }
        throw signInError;
      }
    }
    
    // Handle configuration errors
    if (error.code === "auth/configuration-not-found") {
      throw new Error(
        "Firebase Authentication no está configurado.\n" +
        "Verifica en Firebase Console → Authentication → Sign-in method que Email/Password esté habilitado."
      );
    }
    
    // Handle operation not allowed error
    if (error.code === "auth/operation-not-allowed") {
      throw new Error(
        "El método Email/Password no está habilitado en Firebase.\n\n" +
        "Para solucionarlo:\n" +
        "1. Ve a Firebase Console (https://console.firebase.google.com/)\n" +
        "2. Selecciona tu proyecto 'iniciativasrve'\n" +
        "3. Ve a Authentication → Sign-in method\n" +
        "4. Haz clic en 'Email/Password'\n" +
        "5. Activa el toggle y guarda"
      );
    }
    
    // Handle invalid credential error
    if (error.code === "auth/invalid-credential") {
      throw new Error(
        "Credenciales inválidas. Por favor verifica tu correo electrónico e intenta nuevamente."
      );
    }
    
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  if (!auth) {
    throw new Error("Firebase Auth no está inicializado");
  }
  await firebaseSignOut(auth);
};

export const getCurrentUser = (): FirebaseUser | null => {
  if (!auth) {
    return null;
  }
  return auth.currentUser;
};

export const getUserData = async (email: string): Promise<User | null> => {
  if (!db) {
    return null;
  }
  const userDoc = await getDoc(doc(db, "users", email));
  if (userDoc.exists()) {
    const data = userDoc.data();
    return {
      email: data.email,
      name: data.name,
      isAdmin: data.isAdmin,
      createdAt: data.createdAt?.toDate() || new Date(),
    };
  }
  return null;
};

