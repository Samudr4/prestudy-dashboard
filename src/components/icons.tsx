import type { SVGProps } from "react";

// Consider creating a more accurate SVG logo if possible, or using text styling directly.
// This is a placeholder.
export function PrestudyFavicon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="32" height="32" rx="4" fill="hsl(var(--primary))"/>
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="hsl(var(--primary-foreground))" fontSize="18" fontWeight="bold">
        P
      </text>
    </svg>
  );
}
