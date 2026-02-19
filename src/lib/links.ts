import { getClientId } from "./auth-client";

const API_BASE = "/api";

export interface ShortenedLink {
  id: string;
  original_url: string;
  short_code: string;
  alias: string | null;
  created_at: string;
  expires_at: string | null;
  clicks: number;
  is_active: boolean;
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const clientId = getClientId();
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      "X-Client-ID": clientId
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

export async function getLinks(): Promise<ShortenedLink[]> {
  return apiFetch<ShortenedLink[]>("/links");
}

export async function getLinkByShortCode(shortCode: string): Promise<ShortenedLink | null> {
  try {
    return await apiFetch<ShortenedLink>(`/links/${shortCode}`);
  } catch {
    return null;
  }
}

export async function createLink(link: {
  original_url: string;
  short_code: string;
  alias?: string;
  expires_at?: string;
}): Promise<ShortenedLink> {
  return apiFetch<ShortenedLink>("/links", {
    method: "POST",
    body: JSON.stringify(link),
  });
}

export async function deleteLink(id: string): Promise<void> {
  await apiFetch(`/links/${id}`, { method: "DELETE" });
}

export async function deleteAllLinks(): Promise<void> {
  await apiFetch("/links", { method: "DELETE" });
}

export async function toggleLinkActive(id: string, _isActive: boolean): Promise<void> {
  await apiFetch(`/links/${id}/toggle`, { method: "PUT" });
}

export async function recordClick(linkId: string, referrer?: string, userAgent?: string): Promise<void> {
  await apiFetch("/clicks", {
    method: "POST",
    body: JSON.stringify({
      link_id: linkId,
      referrer: referrer || null,
      user_agent: userAgent || null,
    }),
  });
}

export async function isShortCodeTaken(shortCode: string): Promise<boolean> {
  const result = await apiFetch<{ taken: boolean }>(`/links/${shortCode}/check`);
  return result.taken;
}

export function generateShortCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function formatDate(timestamp: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export function timeAgo(timestamp: string): string {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
