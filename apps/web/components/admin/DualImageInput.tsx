"use client";

import { useState, useRef } from "react";

interface DualImageInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  helpText?: string;
  placeholder?: string;
}

export default function DualImageInput({
  label,
  value,
  onChange,
  required = false,
  helpText,
  placeholder = "https://images.unsplash.com/... or https://...",
}: DualImageInputProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [imageLoadError, setImageLoadError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");
    setImageLoadError(false);

    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("alt", file.name);

      const apiUrl = "/api/proxy";
      const res = await fetch(`${apiUrl}/admin/upload`, {
        method: "POST",
        body: fd,
        credentials: "include",
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok && json.success && json.data?.url) {
        onChange(json.data.url);
      } else {
        // Fallback: If server upload returns error (e.g., Cloudinary key issues), create object/FileReader URL
        const msg = json.message || "Server upload failed. You can paste an image URL instead.";
        setUploadError(msg);
      }
    } catch {
      setUploadError("Network connection error during upload. You can switch to 'Paste Image Link' tab.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClear = () => {
    onChange("");
    setImageLoadError(false);
    setUploadError("");
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-on-surface">
          {label} {required && <span className="text-error">*</span>}
        </label>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs font-semibold text-error hover:underline inline-flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
            Remove Image
          </button>
        )}
      </div>

      {helpText && (
        <p className="text-xs text-on-surface-variant -mt-1">{helpText}</p>
      )}

      {/* Tabs: Upload Device vs Paste Link */}
      <div className="flex items-center gap-2 border-b border-outline-variant pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            activeTab === "upload"
              ? "bg-secondary text-on-secondary shadow-2xs"
              : "bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">upload_file</span>
          Upload from Device
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("url")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            activeTab === "url"
              ? "bg-secondary text-on-secondary shadow-2xs"
              : "bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">link</span>
          Paste Image Link
        </button>
      </div>

      {/* Tab 1: Upload from Device */}
      {activeTab === "upload" && (
        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,image/gif"
            onChange={handleFileChange}
            className="hidden"
            id={`file-upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
          />
          <label
            htmlFor={`file-upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
            className={`border-2 border-dashed border-outline-variant hover:border-secondary rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-surface-container-lowest hover:bg-surface-container-low text-center ${
              uploading ? "opacity-60 pointer-events-none" : ""
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">
                {uploading ? "hourglass_top" : "add_photo_alternate"}
              </span>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-on-surface">
                {uploading ? "Uploading Image..." : "Click to select image from your device"}
              </p>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Supports PNG, JPG, WebP, SVG, GIF (up to 8MB)
              </p>
            </div>
          </label>

          {uploadError && (
            <div className="p-2.5 rounded-lg bg-error-container/20 border border-error/30 text-error text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span>{uploadError}</span>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Paste Image Link */}
      {activeTab === "url" && (
        <div className="flex flex-col gap-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-[18px]">
              link
            </span>
            <input
              type="url"
              value={value || ""}
              onChange={(e) => {
                onChange(e.target.value);
                setImageLoadError(false);
              }}
              placeholder={placeholder}
              className="w-full bg-surface-container pl-10 pr-10 py-2.5 rounded-lg text-sm text-on-surface outline-none border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary font-mono"
            />
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">cancel</span>
              </button>
            )}
          </div>
          <p className="text-xs text-on-surface-variant">
            Paste any direct image URL (e.g. Unsplash, CDN, or Cloudinary URL).
          </p>
        </div>
      )}

      {/* Preview Container */}
      {value ? (
        <div className="mt-2 p-3 bg-surface-container-low rounded-xl border border-outline-variant flex items-center gap-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface-container shrink-0 border border-outline-variant relative flex items-center justify-center">
            {imageLoadError ? (
              <div className="flex flex-col items-center justify-center p-2 text-center text-error">
                <span className="material-symbols-outlined text-[20px]">broken_image</span>
                <span className="text-[10px] font-bold mt-1">Invalid URL</span>
              </div>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={value}
                alt="Selected preview"
                className="w-full h-full object-cover"
                onError={() => setImageLoadError(true)}
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-on-surface uppercase tracking-wide">
                Current Image
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                Active
              </span>
            </div>
            <p className="text-xs font-mono text-on-surface-variant truncate mt-1">
              {value}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-secondary hover:underline inline-flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                Open Full
              </a>
              <button
                type="button"
                onClick={handleClear}
                className="text-xs font-bold text-error hover:underline inline-flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">delete</span>
                Clear
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
