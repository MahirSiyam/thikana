import { authorizedFetch } from "@/lib/api/client";
import type { CloudinaryAsset } from "@/lib/api/auth";

export type UploadFolder =
  | "identity/nid-front"
  | "identity/nid-back"
  | "identity/selfie"
  | "owner/ownership-proof"
  | "provider/trade-certificate"
  | "listings/photos"
  | "profile/avatar";

type UploadSignature = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
  resourceType: "image" | "raw";
  type: "authenticated";
};

const MAX_EDGE_BY_FOLDER: Partial<Record<UploadFolder, number>> = {
  "identity/nid-front": 1600,
  "identity/nid-back": 1600,
  "identity/selfie": 1280,
  "owner/ownership-proof": 1600,
  "provider/trade-certificate": 1600,
  "listings/photos": 1920,
  "profile/avatar": 1024,
};

const QUALITY_BY_FOLDER: Partial<Record<UploadFolder, number>> = {
  "identity/nid-front": 0.78,
  "identity/nid-back": 0.78,
  "identity/selfie": 0.8,
  "owner/ownership-proof": 0.78,
  "provider/trade-certificate": 0.78,
  "listings/photos": 0.82,
  "profile/avatar": 0.85,
};

export const getUploadSignature = async (input: {
  folder: UploadFolder;
  resourceType?: "image" | "raw";
}) => {
  const response = await authorizedFetch<UploadSignature>("/api/uploads/signature", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return response.data as UploadSignature;
};

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image"));
    };
    image.src = url;
  });
}

/**
 * Compress + downscale images before Cloudinary upload to cut transfer time.
 * Skips tiny files that are already small enough.
 */
export async function optimizeImageForUpload(
  file: File,
  folder: UploadFolder
): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
    return file;
  }

  // Already small enough — skip work.
  if (file.size <= 350_000) {
    return file;
  }

  try {
    const image = await loadImageElement(file);
    const maxEdge = MAX_EDGE_BY_FOLDER[folder] ?? 1600;
    const scale = Math.min(1, maxEdge / Math.max(image.width, image.height));
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(image, 0, 0, width, height);

    const quality = QUALITY_BY_FOLDER[folder] ?? 0.8;
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((result) => resolve(result), "image/jpeg", quality);
    });

    if (!blob || blob.size >= file.size) {
      return file;
    }

    const baseName = file.name.replace(/\.[^.]+$/, "") || "upload";
    return new File([blob], `${baseName}.jpg`, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch {
    return file;
  }
}

export const uploadToCloudinary = async (input: {
  file: File;
  folder: UploadFolder;
  resourceType?: "image" | "raw";
}): Promise<CloudinaryAsset> => {
  const resourceType = input.resourceType || "image";

  // Fetch signature while compressing — saves wall-clock time.
  const [signature, file] = await Promise.all([
    getUploadSignature({
      folder: input.folder,
      resourceType,
    }),
    resourceType === "image"
      ? optimizeImageForUpload(input.file, input.folder)
      : Promise.resolve(input.file),
  ]);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signature.apiKey);
  formData.append("timestamp", String(signature.timestamp));
  formData.append("signature", signature.signature);
  formData.append("folder", signature.folder);
  formData.append("type", signature.type);

  const endpoint = `https://api.cloudinary.com/v1_1/${signature.cloudName}/${signature.resourceType}/upload`;
  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  const data = (await response.json()) as {
    public_id?: string;
    format?: string;
    bytes?: number;
    secure_url?: string;
    error?: { message?: string };
  };

  if (!response.ok || !data.public_id) {
    throw new Error(data.error?.message || "Could not upload file");
  }

  return {
    publicId: data.public_id,
    resourceType: signature.resourceType,
    format: data.format,
    bytes: data.bytes,
    uploadedAt: new Date().toISOString(),
    ...(data.secure_url ? { secureUrl: data.secure_url } : {}),
  } as CloudinaryAsset & { secureUrl?: string };
};
