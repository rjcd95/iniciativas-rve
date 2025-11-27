"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Layout/Header";
import PhotoGallery from "@/components/PhotoGallery";
import ProgressBar from "@/components/ProgressBar";
import ContributionForm from "@/components/ContributionForm";
import InitiativeForm from "@/components/InitiativeForm";
import { useInitiatives } from "@/hooks/useInitiatives";
import { useContributions, useUserContribution } from "@/hooks/useContributions";
import { useAuth } from "@/hooks/useAuth";
import { getInitiative } from "@/lib/firebase/firestore";
import { formatCurrency } from "@/lib/utils";
import { Initiative } from "@/types";
import toast from "react-hot-toast";
import Link from "next/link";

export default function InitiativeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const initiativeId = params.id as string;

  const [initiative, setInitiative] = useState<Initiative | null>(null);
  const [loading, setLoading] = useState(true);
  const [showContributionForm, setShowContributionForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { contributions, loading: contributionsLoading, refresh: refreshContributions } = useContributions(
    initiativeId
  );
  const { contribution: userContribution, refresh: refreshUserContribution } = useUserContribution(
    initiativeId,
    user?.email || ""
  );

  // Force refresh contributions when refreshKey changes
  useEffect(() => {
    if (refreshKey > 0) {
      refreshContributions();
      refreshUserContribution();
    }
  }, [refreshKey, refreshContributions, refreshUserContribution]);

  useEffect(() => {
    const fetchInitiative = async () => {
      try {
        setLoading(true);
        const data = await getInitiative(initiativeId);
        if (!data) {
          toast.error("Iniciativa no encontrada");
          router.push("/");
          return;
        }
        setInitiative(data);
      } catch (error: any) {
        toast.error("Error al cargar la iniciativa: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    if (initiativeId) {
      fetchInitiative();
    }
  }, [initiativeId, router, refreshKey]);

  const totalRaised = contributions.reduce((sum, contrib) => sum + contrib.amount, 0);
  const remaining = Math.max(0, (initiative?.requiredAmount || 0) - totalRaised);
  const isCreator = initiative?.createdBy === user?.email;

  const handleContributionSuccess = () => {
    setShowContributionForm(false);
    setRefreshKey((k) => k + 1);
  };

  const handleEditSuccess = () => {
    setShowEditForm(false);
    setRefreshKey((k) => k + 1);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando iniciativa...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!initiative) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 mb-4 inline-block"
          >
            ← Volver a iniciativas
          </Link>

          {!showEditForm ? (
            <>
              <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl font-bold text-gray-900">
                        {initiative.name}
                      </h1>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          initiative.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {initiative.status === "active" ? "Activa" : "Finalizada"}
                      </span>
                    </div>
                    {isCreator && (
                      <div className="flex flex-col sm:flex-row gap-2 mt-4">
                        <button
                          onClick={() => setShowEditForm(true)}
                          className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Editar Iniciativa
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 mb-6 whitespace-pre-line">
                  {initiative.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">
                      Monto requerido
                    </h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(initiative.requiredAmount)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">
                      Cuota sugerida
                    </h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(initiative.suggestedFee)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">
                      Casas beneficiadas
                    </h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {initiative.tentativeHouses}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">
                      Monto recaudado
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(totalRaised)}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <ProgressBar
                    current={totalRaised}
                    required={initiative.requiredAmount}
                  />
                </div>

                {remaining > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-yellow-800">
                      <strong>Faltan {formatCurrency(remaining)}</strong> para
                      completar el monto requerido
                    </p>
                  </div>
                )}

                {initiative.photos.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Fotos
                    </h3>
                    <PhotoGallery photos={initiative.photos} />
                  </div>
                )}

                {initiative.status === "active" && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    {!showContributionForm ? (
                      <button
                        onClick={() => setShowContributionForm(true)}
                        className="w-full sm:w-auto bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                      >
                        {userContribution
                          ? "Editar Mi Aporte"
                          : "Aportar a esta Iniciativa"}
                      </button>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          {userContribution
                            ? "Editar Aporte"
                            : "Registrar Aporte"}
                        </h3>
                        <ContributionForm
                          initiativeId={initiativeId}
                          suggestedFee={initiative.suggestedFee}
                          existingContribution={userContribution}
                          onSuccess={handleContributionSuccess}
                          onCancel={() => setShowContributionForm(false)}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Aportes Realizados ({contributions.length})
                </h2>
                {contributionsLoading ? (
                  <p className="text-gray-600">Cargando aportes...</p>
                ) : contributions.length === 0 ? (
                  <p className="text-gray-600">Aún no hay aportes registrados</p>
                ) : (
                  <div className="space-y-3">
                    {contributions.map((contribution) => (
                      <div
                        key={contribution.id}
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {contribution.contributorName}{" "}
                            {contribution.contributorLastName}
                          </p>
                          <p className="text-sm text-gray-600">
                            Casa {contribution.houseNumber}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(contribution.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Editar Iniciativa
              </h2>
              <InitiativeForm
                initiative={initiative}
                onSuccess={handleEditSuccess}
                onCancel={() => setShowEditForm(false)}
                userEmail={user?.email || ""}
              />
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}

