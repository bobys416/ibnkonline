import React from "react";
import Image from "next/image";

export interface IbnkLogoProps {
  variant?: "color" | "white" | "compact" | "compact-white" | "icon";
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function IbnkLogo({
  variant = "color",
  className = "h-8 w-auto",
  width,
  height,
  priority = false,
}: IbnkLogoProps) {
  let src = "/images/logo/ibnk-logo.png";
  let defaultWidth = 140;
  let defaultHeight = 84;

  switch (variant) {
    case "white":
      src = "/images/logo/ibnk-logo-white.png";
      defaultWidth = 140;
      defaultHeight = 84;
      break;
    case "compact":
      src = "/images/logo/ibnk-logo-compact.png";
      defaultWidth = 140;
      defaultHeight = 70;
      break;
    case "compact-white":
      src = "/images/logo/ibnk-logo-compact-white.png";
      defaultWidth = 140;
      defaultHeight = 70;
      break;
    case "icon":
      src = "/images/logo/ibnk-icon.png";
      defaultWidth = 64;
      defaultHeight = 32;
      break;
    case "color":
    default:
      src = "/images/logo/ibnk-logo.png";
      defaultWidth = 140;
      defaultHeight = 84;
      break;
  }

  const finalWidth = width ?? defaultWidth;
  const finalHeight = height ?? defaultHeight;

  return (
    <div className={`relative inline-flex items-center shrink-0 select-none ${className}`}>
      <Image
        src={src}
        alt="iBnK - Ab har dukaan, bank samaan"
        width={finalWidth}
        height={finalHeight}
        priority={priority}
        className="h-full w-auto object-contain"
      />
    </div>
  );
}
