"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "./button";
import { ImagePlus, Trash, Link, AlertCircle } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { Input } from "./input";
import { Alert, AlertDescription } from "./alert";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    console.log("🎉 Upload callback triggered!");
    console.log("📋 Full result object:", result);

    setUploadError(null);

    if (result.event === "success" && result.info?.secure_url) {
      console.log("✅ Upload successful!");
      console.log("📷 Secure URL:", result.info.secure_url);
      console.log("🔄 Calling onChange with:", result.info.secure_url);
      onChange(result.info.secure_url);
    }
  };

  const onError = (error: any) => {
    console.error("❌ Upload error:", error);
    setUploadError(error.statusText || "Upload failed");
  };

  const handleManualUrlSubmit = () => {
    if (manualUrl.trim()) {
      console.log("📝 Manual URL submitted:", manualUrl.trim());
      console.log("🔄 Calling onChange with manual URL:", manualUrl.trim());
      onChange(manualUrl.trim());
      setManualUrl("");
      setShowManualInput(false);
      setUploadError(null);
    }
  };

  const handleSampleImage = (url: string) => {
    console.log("🖼️ Sample image selected:", url);
    console.log("🔄 Calling onChange with sample URL:", url);
    onChange(url);
    setUploadError(null);
  };

  if (!isMounted) return null;

  console.log("🔍 ImageUpload render - Current values:", value);
  console.log("🔍 ImageUpload render - Value length:", value.length);

  return (
    <div className="space-y-4">
      {/* Error Alert */}
      {uploadError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Upload failed: {uploadError}. Please use the manual URL input below.
          </AlertDescription>
        </Alert>
      )}

      {/* Display uploaded images */}
      {value.length > 0 && (
        <div className="flex items-center mb-4 gap-4">
          {value.map((url, index) => {
            console.log("🖼️ Rendering image:", url, "at index:", index);
            return (
              <div
                className="relative w-[200px] h-[200px] rounded-md overflow-hidden border-2 border-solid border-gray-300 bg-gray-50"
                key={`${url}-${index}`}
              >
                <Image
                  fill
                  className="object-cover"
                  alt="Uploaded image"
                  src={url || "/placeholder.svg"}
                  onLoad={() =>
                    console.log("✅ Image loaded successfully:", url)
                  }
                  onError={(e) =>
                    console.error("❌ Image failed to load:", url, e)
                  }
                />

                <div className="absolute top-2 right-2 z-10">
                  <Button
                    type="button"
                    onClick={() => {
                      console.log("🗑️ Removing image:", url);
                      onRemove(url);
                    }}
                    variant="destructive"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick test URLs - Make these prominent */}
      <div className="space-y-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm font-semibold text-blue-800">
          🚀 Quick Test - Click any image:
        </p>
        <div className="grid grid-cols-1 gap-2">
          {[
            {
              name: "Modern Store Billboard",
              url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop&crop=center",
            },
            {
              name: "Fashion Store Billboard",
              url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop&crop=center",
            },
            {
              name: "Electronics Store Billboard",
              url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop&crop=center",
            },
          ].map((sample, index) => (
            <Button
              key={`sample-${index}`}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSampleImage(sample.url)}
              className="justify-start text-left h-auto p-3 hover:bg-blue-100"
            >
              <ImagePlus className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-sm font-medium">{sample.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Manual URL Input */}
      <div className="space-y-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setShowManualInput(!showManualInput)}
          className="w-full"
        >
          <Link className="h-4 w-4 mr-2" />
          {showManualInput ? "Hide URL Input" : "Enter Custom Image URL"}
        </Button>

        {showManualInput && (
          <div className="flex gap-2">
            <Input
              placeholder="Paste your image URL here..."
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleManualUrlSubmit();
                }
              }}
            />
            <Button
              type="button"
              onClick={handleManualUrlSubmit}
              disabled={!manualUrl.trim()}
            >
              Add
            </Button>
          </div>
        )}
      </div>

      {/* Cloudinary Upload Widget */}
      <CldUploadWidget
        uploadPreset="sdadasdef"
        onUpload={onUpload}
        onError={onError}
        options={{
          maxFiles: 1,
          resourceType: "image",
          clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
          maxFileSize: 10000000,
          sources: ["local"],
          multiple: false,
        }}
      >
        {({ open }) => (
          <Button
            type="button"
            disabled={disabled}
            variant="outline"
            onClick={() => {
              console.log("🚀 Opening Cloudinary upload widget...");
              open?.();
            }}
            className="w-full"
          >
            <ImagePlus className="h-4 w-4 mr-2" />
            Upload File (Cloudinary)
          </Button>
        )}
      </CldUploadWidget>

      {/* Debug info */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-xs space-y-1">
          <p>
            <strong>🐛 Debug Info:</strong>
          </p>
          <p>📊 Values: {JSON.stringify(value)}</p>
          <p>📝 Values Length: {value.length}</p>
          <p>🔄 Is Mounted: {isMounted.toString()}</p>
          <p>🚫 Disabled: {disabled?.toString() || "false"}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
