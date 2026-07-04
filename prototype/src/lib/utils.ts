import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Same `cn` helper dara-front uses (src/lib/utils.ts) so classes merge identically.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
