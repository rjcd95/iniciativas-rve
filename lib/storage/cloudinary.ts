// Alternative storage using Cloudinary (free, no credit card required)
// Sign up at: https://cloudinary.com/users/register/free

export const uploadPhotoToCloudinary = async (
  file: File,
  folder: string = "iniciativas-rve"
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Error al subir la imagen");
  }

  const data = await response.json();
  return data.secure_url;
};

export const uploadMultiplePhotosToCloudinary = async (
  files: File[],
  folder: string = "iniciativas-rve"
): Promise<string[]> => {
  const uploadPromises = files.map((file) => uploadPhotoToCloudinary(file, folder));
  return Promise.all(uploadPromises);
};

