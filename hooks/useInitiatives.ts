"use client";

import { useState, useEffect } from "react";
import { getInitiatives } from "@/lib/firebase/firestore";
import { Initiative } from "@/types";

export function useInitiatives(filters?: {
  status?: "active" | "completed";
  createdBy?: string;
}) {
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitiatives = async () => {
      try {
        setLoading(true);
        const data = await getInitiatives(filters);
        setInitiatives(data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitiatives();
  }, [filters?.status, filters?.createdBy]);

  return { initiatives, loading, error };
}

