import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function knotsToKmh(knots: number) {
  return knots * 1.852;
}

export function getColorFromArea(area: string) {
  area = area.trim().toLowerCase();
  switch (area) {
    case "alpha":
      return "#f87171";
    case "bravo":
      return "#4ade80";
    case "charlie":
      return "#60a5fa";
    case "delta":
      return "#facc15";
    case "echo":
      return "#e879f9";
    case "foxtrot":
      return "#2dd4bf";
    default:
      return "#9ca3af";
  }
}