import { v2 as cloudinary } from "cloudinary";

const configured =
  Boolean(process.env.CLOUDINARY_CLOUD_NAME) &&
  Boolean(process.env.CLOUDINARY_API_KEY) &&
  Boolean(process.env.CLOUDINARY_API_SECRET);

if (configured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export const isCloudinaryConfigured = (): boolean => configured;

export const createUploadSignature = (input: {
  folder: string;
  resourceType?: "image" | "raw";
}) => {
  if (!configured) {
    throw new Error("Cloudinary is not configured");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = `thikana/${input.folder}`;
  const paramsToSign = {
    timestamp,
    folder,
    type: "authenticated",
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET as string
  );

  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME as string,
    apiKey: process.env.CLOUDINARY_API_KEY as string,
    timestamp,
    folder,
    signature,
    resourceType: input.resourceType || "image",
    type: "authenticated" as const,
  };
};

export const getSignedAssetUrl = (input: {
  publicId: string;
  resourceType?: "image" | "raw";
  expiresInSeconds?: number;
  /** When true, returns a square face-focused avatar transform. */
  avatar?: boolean;
}): string => {
  if (!configured) {
    throw new Error("Cloudinary is not configured");
  }

  const expiresAt = Math.floor(Date.now() / 1000) + (input.expiresInSeconds || 60 * 10);

  return cloudinary.url(input.publicId, {
    resource_type: input.resourceType || "image",
    type: "authenticated",
    sign_url: true,
    secure: true,
    expires_at: expiresAt,
    ...(input.avatar
      ? {
          transformation: [
            {
              width: 512,
              height: 512,
              crop: "fill",
              gravity: "auto",
              quality: "auto",
              fetch_format: "auto",
            },
          ],
        }
      : {}),
  });
};
