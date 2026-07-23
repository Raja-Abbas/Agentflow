import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(value: number): string {
  if (value >= 1000) {
    return value.toLocaleString()
  }
  return String(value)
}

export function trackNodeUsage(type: string) {
  try {
    const key = "af_node_stats";
    const raw = localStorage.getItem(key);
    const stats: Record<string, number> = raw ? JSON.parse(raw) : {};
    stats[type] = (stats[type] || 0) + 1;
    localStorage.setItem(key, JSON.stringify(stats));
  } catch {}
}

export function getNodeStats(): Record<string, number> {
  try {
    const raw = localStorage.getItem("af_node_stats");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
