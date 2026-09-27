export const DEFAULT_SHARE_URL =
  "https://www.diskwala.com/app/6997f8c539857e10c69f6f21";

const OBJECT_ID_RE = /[a-fA-F0-9]{24}/;
const SHARE_URL_RE = /https?:\/\/\S*diskwala\.com\/\S+/i;

export type ProbeStatus = "ok" | "fail" | "empty";

export type ProbeHit = {
  id: string;
  label: string;
  method: string;
  url: string;
  status: number | null;
  ms: number;
  outcome: ProbeStatus;
  detail: string;
};

export type ExtractedFile = {
  fileId: string;
  name: string;
  size: number | null;
  type: string | null;
  thumb: string | null;
  downloadUrl: string | null;
  streamUrl: string | null;
  playUrl: string | null;
  source: string | null;
  teaser: boolean;
};

export type ExtractResult = {
  input: string;
  shareUrl: string;
  fileId: string | null;
  file: ExtractedFile | null;
  hits: ProbeHit[];
  startedAt: string;
  elapsedMs: number;
};

export function extractFileId(text: string): string | null {
  const match = OBJECT_ID_RE.exec(text || "");
  return match ? match[0].toLowerCase() : null;
}

export function normalizeShareUrl(text: string): string {
  const raw = (text || "").trim();
  if (!raw) return DEFAULT_SHARE_URL;
  const nested = SHARE_URL_RE.exec(raw);
  const candidate = nested ? nested[0].replace(/[),.\]]+$/, "") : raw;
  const id = extractFileId(candidate);
  if (id) return `https://www.diskwala.com/app/${id}`;
  return candidate;
}

export function formatBytes(bytes: number | null | undefined): string {
  if (bytes == null || !Number.isFinite(bytes) || bytes <= 0) return "Unknown size";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i += 1;
  }
  const digits = value >= 10 || i === 0 ? 0 : 1;
  return `${value.toFixed(digits)} ${units[i]}`;
}

export function mediaProxyUrl(target: string, download = false): string {
  const params = new URLSearchParams({ url: target });
  if (download) params.set("download", "1");
  return `/api/media?${params.toString()}`;
}

export function isHls(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const decoded = decodeURIComponent(url);
    if (/\.m3u8(\?|$)/i.test(decoded)) return true;
    if (/\/stream\?file_id=/i.test(decoded)) return true;
    return false;
  } catch {
    return /\.m3u8(\?|$)/i.test(url);
  }
}

export function filenameFromCdn(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const decoded = decodeURIComponent(url);
    const hashed = decoded.includes("#")
      ? decoded.slice(decoded.lastIndexOf("#") + 1)
      : decoded.split("/").pop();
    if (!hashed) return null;
    const cleaned = hashed.split("?")[0]?.trim();
    return cleaned || null;
  } catch {
    return null;
  }
}

export function isAllowedMediaHost(hostname: string): boolean {
  return /(^|\.)diskwala\.com$/i.test(hostname) || hostname === "diskwala.litedns.xyz";
}
