import { assetUrl, fallbackImageUrl } from "../api/client";
import type { ImgHTMLAttributes } from "react";

type SmartImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string;
  fallbackLabel?: string;
};

export function SmartImage({ src, fallbackLabel = "Image unavailable", alt = "", onError, ...props }: SmartImageProps) {
  const fallback = fallbackImageUrl(fallbackLabel);

  return (
    <img
      {...props}
      alt={alt}
      src={assetUrl(src) || fallback}
      onError={(event) => {
        if (event.currentTarget.src !== fallback) {
          event.currentTarget.src = fallback;
        }
        onError?.(event);
      }}
    />
  );
}
