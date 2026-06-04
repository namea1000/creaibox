import { DEFAULT_IMAGE_MODEL } from "./blogImageConstants";

export function normalizeImageModel(value?: string | null) {
  if (!value || value === "gemini") return DEFAULT_IMAGE_MODEL;
  return value;
}

export function getImageProviderFromModel(value: string) {
  return value === "openai" ? "openai" : "gemini";
}

export async function convertImageFileToWebp(file: File) {
  return new Promise<Blob>((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      const maxWidth = 1600;
      const scale = Math.min(1, maxWidth / image.width);
      const width = Math.round(image.width * scale);
      const height = Math.round(image.height * scale);
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("이미지 변환 캔버스를 생성할 수 없습니다."));
        return;
      }

      canvas.width = width;
      canvas.height = height;
      context.drawImage(image, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(objectUrl);
          if (!blob) {
            reject(new Error("WebP 이미지 변환에 실패했습니다."));
            return;
          }
          resolve(blob);
        },
        "image/webp",
        0.78
      );
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("이미지를 불러올 수 없습니다."));
    };

    image.src = objectUrl;
  });
}

export async function downloadImageFile(imageUrl: string, imageId: string, format: "png" | "webp") {
  const response = await fetch(
    `/api/image-studio/download?url=${encodeURIComponent(imageUrl)}&format=${format}`
  );

  if (!response.ok) {
    throw new Error("이미지 다운로드 변환에 실패했습니다.");
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = `creaibox-image-${imageId}.${format}`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(objectUrl);
}

import { IMAGE_BUCKET } from "./blogImageConstants";

export function getStoragePathFromPublicUrl(url: string) {
  const marker = `/object/public/${IMAGE_BUCKET}/`;
  const index = url.indexOf(marker);

  if (index === -1) return null;

  return decodeURIComponent(url.slice(index + marker.length).split("?")[0]);
}