

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parsePrice(price: any): number {
  if (typeof price === 'number') return price;
  if (!price) return 0;
  
  // Remove non-numeric characters except for dots and minus
  const sanitized = price.toString().replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(sanitized);
  
  return isNaN(parsed) ? 0 : parsed;
}
