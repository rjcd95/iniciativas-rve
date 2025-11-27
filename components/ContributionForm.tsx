"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Contribution } from "@/types";
import { createContribution, updateContribution } from "@/lib/firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

interface ContributionFormProps {
  initiativeId: string;
  suggestedFee: number;
  existingContribution?: Contribution | null;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  contributorName: string;
  contributorLastName: string;
  houseNumber: string;
  amount: number;
}

export default function ContributionForm({
  initiativeId,
  suggestedFee,
  existingContribution,
  onSuccess,
  onCancel,
}: ContributionFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const isEditing = !!existingContribution;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    defaultValues: existingContribution
      ? {
          contributorName: existingContribution.contributorName,
          contributorLastName: existingContribution.contributorLastName,
          houseNumber: existingContribution.houseNumber,
          amount: existingContribution.amount,
        }
      : {
          amount: suggestedFee,
        },
  });

  const onSubmit = async (data: FormData) => {
    if (!user?.email) {
      toast.error("Debes estar autenticado para realizar un aporte");
      return;
    }

    setLoading(true);
    try {
      const contributionData: Omit<Contribution, "id" | "createdAt" | "updatedAt"> = {
        initiativeId,
        contributorEmail: user.email,
        contributorName: data.contributorName,
        contributorLastName: data.contributorLastName,
        houseNumber: data.houseNumber,
        amount: Number(data.amount),
      };

      if (isEditing) {
        await updateContribution(existingContribution!.id, {
          amount: Number(data.amount),
          contributorName: data.contributorName,
          contributorLastName: data.contributorLastName,
          houseNumber: data.houseNumber,
        });
        toast.success("Aporte actualizado correctamente");
      } else {
        await createContribution(contributionData);
        toast.success("Aporte registrado correctamente");
      }

      onSuccess();
    } catch (error: any) {
      toast.error("Error al guardar el aporte: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre *
          </label>
          <input
            {...register("contributorName", { required: "El nombre es requerido" })}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white placeholder:text-gray-400"
          />
          {errors.contributorName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.contributorName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Apellido *
          </label>
          <input
            {...register("contributorLastName", {
              required: "El apellido es requerido",
            })}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white placeholder:text-gray-400"
          />
          {errors.contributorLastName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.contributorLastName.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Número de casa *
        </label>
        <input
          {...register("houseNumber", { required: "El número de casa es requerido" })}
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white placeholder:text-gray-400"
        />
        {errors.houseNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.houseNumber.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Monto a aportar (C$) *
        </label>
        <input
          {...register("amount", {
            required: "El monto es requerido",
            min: { value: 0, message: "El monto debe ser mayor a 0" },
          })}
          type="number"
          step="0.01"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white placeholder:text-gray-400"
        />
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
        )}
        {!isEditing && (
          <p className="mt-1 text-sm text-gray-500">
            Cuota sugerida: {suggestedFee.toLocaleString("es-NI", { style: "currency", currency: "NIO" })}
          </p>
        )}
        {isEditing && (
          <p className="mt-1 text-sm text-blue-600">
            Monto actual:{" "}
            {existingContribution!.amount.toLocaleString("es-NI", {
              style: "currency",
              currency: "NIO",
            })}
          </p>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading
            ? "Guardando..."
            : isEditing
            ? "Actualizar Aporte"
            : "Registrar Aporte"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

