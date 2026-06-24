"use client";
// src/components/create/UploadZone.tsx

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useCreationStore } from "@/store/creation";
import { Upload, X } from "lucide-react";
import Image from "next/image";

export function UploadZone() {
  const { imagePreview, setImageFile, setImageUrl } = useCreationStore();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      const preview = URL.createObjectURL(file);
      setImageFile(file, preview);
      setImageUrl(""); // reset until uploaded
    },
    [setImageFile, setImageUrl]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    maxSize: 20 * 1024 * 1024,
    maxFiles: 1,
  });

  const clear = () => {
    useCreationStore.getState().setImageFile(null as any, "");
    useCreationStore.getState().setImageUrl(null as any);
  };

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
      <h3 className="text-sm font-medium text-white/70 mb-4">Product Image</h3>

      {imagePreview ? (
        <div className="relative">
          <div className="relative w-full h-56 rounded-lg overflow-hidden bg-black/30">
            <Image src={imagePreview} alt="Product" fill className="object-contain" />
          </div>
          <button
            onClick={clear}
            className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
            isDragActive
              ? "border-violet-500/60 bg-violet-500/5"
              : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
              <Upload className="w-6 h-6 text-white/40" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/70">
                {isDragActive ? "Drop it here" : "Drop product image here"}
              </p>
              <p className="text-xs text-white/30 mt-1">PNG, JPG, WEBP — max 20MB</p>
            </div>
            <button className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
              or browse files
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
