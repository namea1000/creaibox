"use client";

import React from "react";
import { handleImageError } from "@/utils/image-url";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
}

export default function SafeImage({ src, alt, className, style, fallbackSrc, ...props }: SafeImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={(e) => handleImageError(e, fallbackSrc)}
      {...props}
    />
  );
}
