"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Initiative } from "@/types";
import { uploadMultiplePhotos } from "@/lib/firebase/storage";
import { createInitiative, updateInitiative } from "@/lib/firebase/firestore";
import toast from "react-hot-toast";
import Image from "next/image";

interface InitiativeFormProps {
  initiative?: Initiative;
  onSuccess: () => void;
  onCancel: () => void;
  userEmail: string;
}

interface FormData {
  name: string;
  description: string;
  requiredAmount: number;
  suggestedFee: number;
  tentativeHouses: number;
  status: "active" | "completed";
}

export default function InitiativeForm({
  initiative,
  onSuccess,
  onCancel,
  userEmail,
}: InitiativeFormProps) {
  const isEditing = !!initiative;
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>(
    initiative?.photos || []
  );
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    defaultValues: initiative
      ? {
          name: initiative.name,
          description: initiative.description,
          requiredAmount: initiative.requiredAmount,
          suggestedFee: initiative.suggestedFee,
          tentativeHouses: initiative.tentativeHouses,
          status: initiative.status,
        }
      : {
          status: "active",
        },
  });

  // Watch for changes in requiredAmount and tentativeHouses
  const requiredAmount = watch("requiredAmount");
  const tentativeHouses = watch("tentativeHouses");

  // Auto-calculate suggested fee
  useEffect(() => {
    if (requiredAmount && tentativeHouses && tentativeHouses > 0) {
      const calculated = requiredAmount / tentativeHouses;
      setValue("suggestedFee", parseFloat(calculated.toFixed(2)));
    }
  }, [requiredAmount, tentativeHouses, setValue]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPhotos = [...photos, ...files];
    setPhotos(newPhotos);

    // Create previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPhotoPreviews([...photoPreviews, ...newPreviews]);
  };

  const removePhoto = (index: number) => {
    if (index < photoPreviews.length - photos.length) {
      // Remove existing photo
      const newPreviews = [...photoPreviews];
      newPreviews.splice(index, 1);
      setPhotoPreviews(newPreviews);
    } else {
      // Remove new photo
      const photoIndex = index - (photoPreviews.length - photos.length);
      const newPhotos = [...photos];
      newPhotos.splice(photoIndex, 1);
      setPhotos(newPhotos);

      const newPreviews = [...photoPreviews];
      newPreviews.splice(index, 1);
      setPhotoPreviews(newPreviews);
    }
  };

  const onSubmit = async (data: FormData) => {
    setUploading(true);
    try {
      let photoUrls = initiative?.photos || [];

      if (isEditing) {
        // Upload new photos if editing
        if (photos.length > 0) {
          const uploadedUrls = await uploadMultiplePhotos(photos, initiative.id);
          photoUrls = [...photoUrls, ...uploadedUrls];
        }

        const initiativeData: Partial<Initiative> = {
          name: data.name,
          description: data.description,
          requiredAmount: Number(data.requiredAmount),
          suggestedFee: Number(data.suggestedFee),
          tentativeHouses: Number(data.tentativeHouses),
          status: data.status,
          photos: photoUrls,
        };

        await updateInitiative(initiative.id, initiativeData);
        toast.success("Iniciativa actualizada correctamente");
      } else {
        // Create initiative first, then upload photos
        const initiativeData: Omit<Initiative, "id" | "createdAt" | "updatedAt"> = {
          name: data.name,
          description: data.description,
          requiredAmount: Number(data.requiredAmount),
          suggestedFee: Number(data.suggestedFee),
          tentativeHouses: Number(data.tentativeHouses),
          status: data.status,
          photos: [],
          createdBy: userEmail,
        };

        const newInitiativeId = await createInitiative(initiativeData);

        // Upload photos after creating the initiative
        if (photos.length > 0) {
          const uploadedUrls = await uploadMultiplePhotos(photos, newInitiativeId);
          await updateInitiative(newInitiativeId, { photos: uploadedUrls });
        }

        toast.success("Iniciativa creada correctamente");
      }

      onSuccess();
    } catch (error: any) {
      toast.error("Error al guardar la iniciativa: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre de la iniciativa *
        </label>
        <input
          {...register("name", { required: "El nombre es requerido" })}
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white placeholder:text-gray-400"
          placeholder="Ej: Instalación de garita de seguridad"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción
        </label>
        <textarea
          {...register("description")}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white placeholder:text-gray-400"
          placeholder="Describe la iniciativa..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monto requerido (C$) *
          </label>
          <input
            {...register("requiredAmount", {
              required: "El monto es requerido",
              min: { value: 0, message: "El monto debe ser mayor a 0" },
            })}
            type="number"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white placeholder:text-gray-400"
            onChange={(e) => {
              const value = parseFloat(e.target.value) || 0;
              const houses = watch("tentativeHouses") || 1;
              if (value > 0 && houses > 0) {
                setValue("suggestedFee", parseFloat((value / houses).toFixed(2)));
              }
            }}
          />
          {errors.requiredAmount && (
            <p className="mt-1 text-sm text-red-600">
              {errors.requiredAmount.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cantidad tentativa de casas *
          </label>
          <input
            {...register("tentativeHouses", {
              required: "La cantidad es requerida",
              min: { value: 1, message: "Debe ser al menos 1" },
            })}
            type="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white placeholder:text-gray-400"
            onChange={(e) => {
              const houses = parseFloat(e.target.value) || 1;
              const amount = watch("requiredAmount") || 0;
              if (houses > 0 && amount > 0) {
                setValue("suggestedFee", parseFloat((amount / houses).toFixed(2)));
              }
            }}
          />
          {errors.tentativeHouses && (
            <p className="mt-1 text-sm text-red-600">
              {errors.tentativeHouses.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cuota sugerida (C$) *
        </label>
        <input
          {...register("suggestedFee", {
            required: "La cuota es requerida",
            min: { value: 0, message: "La cuota debe ser mayor a 0" },
          })}
          type="number"
          step="0.01"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white placeholder:text-gray-400 bg-gray-50"
          readOnly
        />
        {errors.suggestedFee && (
          <p className="mt-1 text-sm text-red-600">
            {errors.suggestedFee.message}
          </p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          Se calcula automáticamente: Monto requerido ÷ Cantidad de casas
        </p>
      </div>

      {isEditing && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select
            {...register("status")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white"
          >
            <option value="active">Activa</option>
            <option value="completed">Finalizada</option>
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fotos (materiales, presupuestos, cotizaciones)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
        {photoPreviews.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            {photoPreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square relative rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={uploading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {uploading
            ? "Guardando..."
            : isEditing
            ? "Actualizar Iniciativa"
            : "Crear Iniciativa"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={uploading}
          className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

