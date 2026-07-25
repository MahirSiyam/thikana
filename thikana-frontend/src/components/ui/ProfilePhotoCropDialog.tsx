"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

type ProfilePhotoCropDialogProps = {
  imageSrc: string;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: (file: File) => void;
};

async function createCroppedFile(
  imageSrc: string,
  crop: Area,
  fileName = "profile-avatar.jpg"
): Promise<File> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const size = 512;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not prepare image crop");
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    size,
    size
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) resolve(result);
        else reject(new Error("Could not export cropped image"));
      },
      "image/jpeg",
      0.92
    );
  });

  return new File([blob], fileName, { type: "image/jpeg" });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () =>
      reject(new Error("Could not load selected image"))
    );
    image.src = src;
  });
}

export function ProfilePhotoCropDialog({
  imageSrc,
  busy = false,
  onCancel,
  onConfirm,
}: ProfilePhotoCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.2);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setWorking(true);
    setError(null);
    try {
      const file = await createCroppedFile(imageSrc, croppedAreaPixels);
      onConfirm(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not crop image");
      setWorking(false);
    }
  };

  const disabled = busy || working;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-brand-dark/45 p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close crop dialog"
        className="absolute inset-0 cursor-default"
        onClick={disabled ? undefined : onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-photo-crop-title"
        className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(10,10,10,0.24)]"
      >
        <div className="border-b border-[#ecece8] px-5 py-4">
          <h2
            id="profile-photo-crop-title"
            className="font-inter text-base font-bold text-brand-dark"
          >
            Adjust profile photo
          </h2>
          <p className="mt-1 font-inter text-xs text-brand-dark/55">
            Drag to reposition and zoom so your face is centered in the circle.
          </p>
        </div>

        <div className="relative mx-5 mt-4 aspect-square overflow-hidden rounded-xl bg-[#111]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="flex flex-col gap-3 px-5 py-4">
          <label className="flex flex-col gap-2">
            <span className="font-inter text-[11px] font-semibold tracking-wide text-brand-dark/45 uppercase">
              Zoom
            </span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              disabled={disabled}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="w-full accent-brand-dark"
            />
          </label>

          {error ? (
            <p role="alert" className="font-inter text-xs font-medium text-red-600">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
            <button
              type="button"
              disabled={disabled}
              onClick={onCancel}
              className="rounded-lg px-4 py-2.5 font-inter text-sm font-semibold text-brand-dark/70 transition-colors hover:bg-brand-dark/5 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={disabled || !croppedAreaPixels}
              onClick={() => void handleSave()}
              className="rounded-lg bg-brand-dark px-4 py-2.5 font-inter text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {busy || working ? "Uploading…" : "Save photo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
