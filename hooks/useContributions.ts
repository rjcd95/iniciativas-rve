"use client";

import { useState, useEffect, useCallback } from "react";
import { getContributions, getUserContribution } from "@/lib/firebase/firestore";
import { Contribution } from "@/types";

export function useContributions(initiativeId: string) {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchContributions = useCallback(async () => {
    if (!initiativeId) return;

    try {
      setLoading(true);
      const data = await getContributions(initiativeId);
      setContributions(data);
      setError(null);
      console.log("Contributions loaded:", data.length, data);
    } catch (err: any) {
      console.error("Error loading contributions:", err);
      setError(err.message);
      setContributions([]);
    } finally {
      setLoading(false);
    }
  }, [initiativeId]);

  useEffect(() => {
    fetchContributions();
  }, [fetchContributions, refreshTrigger]);

  // Expose refresh function
  const refresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return { contributions, loading, error, refresh };
}

export function useUserContribution(initiativeId: string, email: string) {
  const [contribution, setContribution] = useState<Contribution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchContribution = useCallback(async () => {
    if (!initiativeId || !email) return;

    try {
      setLoading(true);
      const data = await getUserContribution(initiativeId, email);
      setContribution(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [initiativeId, email]);

  useEffect(() => {
    fetchContribution();
  }, [fetchContribution, refreshTrigger]);

  const refresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return { contribution, loading, error, refresh };
}

