import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import * as CryptoJS from "crypto-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shortUUID(uuid: string) {
  return uuid.substring(0, 8);
}


export function stringToColor(input: string): string {
  // Create a SHA-256 hash of the input string
  const hash = CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
  // console.log(hash);
  // Return the last 6 characters of the hash
  return "#" + hash.slice(-6);
}


export function getContrastYIQ(hexColor: string): string {
  // Convert hex color to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b);

  // Return black or white based on luminance
  return luminance >= 128 ? '#000000' : '#FFFFFF';
}

export function lerp(a: number, b: number, t: number): number {
  return a * (1 - t) + b * t;
}