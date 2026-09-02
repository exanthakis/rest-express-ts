import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const parseCookie = (cookie: string) => {
  return Object.fromEntries(cookie.split("; ").map((item) => item.split("=")))
}

export const getAccessToken = () => parseCookie(document.cookie).access_token
