"use client";

import { calculateProgress } from "@/lib/utils";

interface ProgressBarProps {
  current: number;
  required: number;
  showLabels?: boolean;
}

export default function ProgressBar({
  current,
  required,
  showLabels = true,
}: ProgressBarProps) {
  const progress = calculateProgress(current, required);

  return (
    <div className="w-full">
      {showLabels && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Recaudado: {current.toLocaleString("es-NI", { style: "currency", currency: "NIO" })}</span>
          <span>Meta: {required.toLocaleString("es-NI", { style: "currency", currency: "NIO" })}</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-blue-600 h-full transition-all duration-300 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      {showLabels && (
        <p className="text-xs text-gray-500 mt-1 text-right">
          {progress.toFixed(1)}% completado
        </p>
      )}
    </div>
  );
}

