import React from "react";
import Image from "next/image";

interface IbnkLogoProps {
  variant?: "white" | "color";
  className?: string;
  width?: number;
  height?: number;
  showTagline?: boolean;
  interactive?: boolean;
}

export function IbnkLogo({
  variant = "white",
  className = "h-9 w-auto",
  width = 130,
  height = 42,
  interactive = false,
}: IbnkLogoProps) {
  const src =
    variant === "white"
      ? "/images/logo/ibnk-logo-white.png"
      : "/images/logo/ibnk-logo.png";

  return (
    <div
      data-variant={variant}
      className={`relative inline-flex items-center select-none ${className} ${
        interactive
          ? "transition-transform duration-300 ease-out motion-reduce:transition-none hover:scale-[1.045] hover:-rotate-1 active:scale-95"
          : ""
      }`}
    >
      <Image
        src={src}
        alt="iBnK - Ab har dukaan bank samaan"
        width={width}
        height={height}
        priority
        className="object-contain h-full w-auto"
      />
    </div>
  );
}
