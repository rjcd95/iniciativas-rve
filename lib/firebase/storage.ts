import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./config";

export const uploadPhoto = async (
  file: File,
  initiativeId: string,
  index: number
): Promise<string> => {
  if (!storage) {
    throw new Error("Firebase Storage no está inicializado");
  }
  // Compress image if needed (basic approach)
  const compressedFile = await compressImage(file);
  
  const storageRef = ref(
    storage,
    `initiatives/${initiativeId}/${index}_${Date.now()}_${compressedFile.name}`
  );
  
  await uploadBytes(storageRef, compressedFile);
  const url = await getDownloadURL(storageRef);
  return url;
};

export const uploadMultiplePhotos = async (
  files: File[],
  initiativeId: string
): Promise<string[]> => {
  const uploadPromises = files.map((file, index) =>
    uploadPhoto(file, initiativeId, index)
  );
  return Promise.all(uploadPromises);
};

export const deletePhoto = async (url: string): Promise<void> => {
  if (!storage) {
    throw new Error("Firebase Storage no está inicializado");
  }
  const storageRef = ref(storage, url);
  await deleteObject(storageRef);
};

// Basic image compression
const compressImage = async (file: File, maxWidth = 1920, quality = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          file.type,
          quality
        );
      };
    };
  });
};

