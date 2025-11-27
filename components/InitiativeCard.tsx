"use client";

import Link from "next/link";
import { Initiative } from "@/types";
import { formatCurrency, calculateProgress } from "@/lib/utils";
import ProgressBar from "./ProgressBar";

interface InitiativeCardProps {
  initiative: Initiative;
  currentAmount: number;
}

export default function InitiativeCard({ initiative, currentAmount }: InitiativeCardProps) {

  return (
    <Link href={`/initiatives/${initiative.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {initiative.name}
          </h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              initiative.status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {initiative.status === "active" ? "Activa" : "Finalizada"}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {initiative.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Monto requerido:</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(initiative.requiredAmount)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Cuota sugerida:</span>
            <span className="font-medium text-gray-700">
              {formatCurrency(initiative.suggestedFee)}
            </span>
          </div>
        </div>

        <ProgressBar
          current={currentAmount}
          required={initiative.requiredAmount}
          showLabels={false}
        />

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            {initiative.tentativeHouses} casas beneficiadas
          </p>
        </div>
      </div>
    </Link>
  );
}

