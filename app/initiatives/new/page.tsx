"use client";

import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Layout/Header";
import InitiativeForm from "@/components/InitiativeForm";
import { useAuth } from "@/hooks/useAuth";
import { createInitiative } from "@/lib/firebase/firestore";
import toast from "react-hot-toast";

export default function NewInitiativePage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleSuccess = () => {
    router.push("/");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-3xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Crear Nueva Iniciativa
          </h1>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <InitiativeForm
              onSuccess={handleSuccess}
              onCancel={handleCancel}
              userEmail={user?.email || ""}
            />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

