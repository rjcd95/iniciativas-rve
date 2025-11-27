"use client";

interface FilterBarProps {
  statusFilter: "active" | "completed" | "all";
  onStatusChange: (status: "active" | "completed" | "all") => void;
  showMyInitiatives: boolean;
  onMyInitiativesChange: (show: boolean) => void;
}

export default function FilterBar({
  statusFilter,
  onStatusChange,
  showMyInitiatives,
  onMyInitiativesChange,
}: FilterBarProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select
            value={statusFilter}
            onChange={(e) =>
              onStatusChange(e.target.value as "active" | "completed" | "all")
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="active">Activas</option>
            <option value="completed">Finalizadas</option>
            <option value="all">Todas</option>
          </select>
        </div>

        <div className="flex items-end">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showMyInitiatives}
              onChange={(e) => onMyInitiativesChange(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Mis iniciativas
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}

