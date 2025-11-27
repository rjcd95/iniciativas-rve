"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Layout/Header";
import FilterBar from "@/components/FilterBar";
import InitiativeCard from "@/components/InitiativeCard";
import { useInitiatives } from "@/hooks/useInitiatives";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { getContributions } from "@/lib/firebase/firestore";

export default function Home() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);
  
  const [statusFilter, setStatusFilter] = useState<"active" | "completed" | "all">("active");
  const [showMyInitiatives, setShowMyInitiatives] = useState(false);
  const [contributionTotals, setContributionTotals] = useState<Record<string, number>>({});

  const filters = {
    status: statusFilter === "all" ? undefined : statusFilter,
    createdBy: showMyInitiatives ? user?.email || undefined : undefined,
  };

  const { initiatives, loading, error } = useInitiatives(filters);

  // Calculate contribution totals for each initiative
  useEffect(() => {
    const calculateTotals = async () => {
      const totals: Record<string, number> = {};
      for (const initiative of initiatives) {
        try {
          const contributions = await getContributions(initiative.id);
          totals[initiative.id] = contributions.reduce(
            (sum, contrib) => sum + contrib.amount,
            0
          );
        } catch (err) {
          totals[initiative.id] = 0;
        }
      }
      setContributionTotals(totals);
    };

    if (initiatives.length > 0) {
      calculateTotals();
    }
  }, [initiatives]);

  // Show loading or redirect
  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Iniciativas</h1>
            <Link
              href="/initiatives/new"
              className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-center"
            >
              + Nueva Iniciativa
            </Link>
          </div>

          <FilterBar
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            showMyInitiatives={showMyInitiatives}
            onMyInitiativesChange={setShowMyInitiatives}
          />

          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando iniciativas...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              Error: {error}
            </div>
          )}

          {!loading && !error && initiatives.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-600">No hay iniciativas disponibles</p>
              <Link
                href="/initiatives/new"
                className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-medium"
              >
                Crear la primera iniciativa
              </Link>
            </div>
          )}

          {!loading && !error && initiatives.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {initiatives.map((initiative) => (
                <div key={initiative.id}>
                  <InitiativeCard
                    initiative={initiative}
                    currentAmount={contributionTotals[initiative.id] || 0}
                  />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
  );
}

