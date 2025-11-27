import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";
import { Initiative, Contribution } from "@/types";

// Initiatives
export const getInitiatives = async (filters?: {
  status?: "active" | "completed";
  createdBy?: string;
}): Promise<Initiative[]> => {
  if (!db) {
    throw new Error("Firestore no está inicializado");
  }
  let q = query(collection(db, "initiatives"), orderBy("createdAt", "desc"));

  if (filters?.status) {
    q = query(q, where("status", "==", filters.status));
  }

  if (filters?.createdBy) {
    q = query(q, where("createdBy", "==", filters.createdBy));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as Initiative[];
};

export const getInitiative = async (id: string): Promise<Initiative | null> => {
  if (!db) {
    throw new Error("Firestore no está inicializado");
  }
  const docRef = doc(db, "initiatives", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Initiative;
  }
  return null;
};

export const createInitiative = async (
  initiative: Omit<Initiative, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  if (!db) {
    throw new Error("Firestore no está inicializado");
  }
  const docRef = await addDoc(collection(db, "initiatives"), {
    ...initiative,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateInitiative = async (
  id: string,
  updates: Partial<Initiative>
): Promise<void> => {
  if (!db) {
    throw new Error("Firestore no está inicializado");
  }
  const docRef = doc(db, "initiatives", id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const deleteInitiative = async (id: string): Promise<void> => {
  if (!db) {
    throw new Error("Firestore no está inicializado");
  }
  await deleteDoc(doc(db, "initiatives", id));
};

// Contributions
export const getContributions = async (
  initiativeId: string
): Promise<Contribution[]> => {
  if (!db) {
    throw new Error("Firestore no está inicializado");
  }

  try {
    const q = query(
      collection(db, "contributions"),
      where("initiativeId", "==", initiativeId),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Contribution[];
  } catch (error: any) {
    // If index error, try without orderBy
    if (error.code === "failed-precondition" || error.message?.includes("index")) {
      console.warn("Índice no encontrado, obteniendo aportes sin ordenar:", error);
      const q = query(
        collection(db, "contributions"),
        where("initiativeId", "==", initiativeId)
      );
      const snapshot = await getDocs(q);
      const contributions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Contribution[];
      // Sort manually
      return contributions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    throw error;
  }
};

export const getUserContribution = async (
  initiativeId: string,
  email: string
): Promise<Contribution | null> => {
  if (!db) {
    throw new Error("Firestore no está inicializado");
  }
  const q = query(
    collection(db, "contributions"),
    where("initiativeId", "==", initiativeId),
    where("contributorEmail", "==", email)
  );

  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Contribution;
  }
  return null;
};

export const createContribution = async (
  contribution: Omit<Contribution, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  if (!db) {
    throw new Error("Firestore no está inicializado");
  }
  const docRef = await addDoc(collection(db, "contributions"), {
    ...contribution,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateContribution = async (
  id: string,
  updates: Partial<Contribution>
): Promise<void> => {
  if (!db) {
    throw new Error("Firestore no está inicializado");
  }
  const docRef = doc(db, "contributions", id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

