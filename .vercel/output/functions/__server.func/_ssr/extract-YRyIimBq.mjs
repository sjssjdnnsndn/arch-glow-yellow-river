//#region node_modules/.nitro/vite/services/ssr/assets/extract-YRyIimBq.js
var DEFAULT_SHARE_URL = "https://www.diskwala.com/app/6997f8c539857e10c69f6f21";
var OBJECT_ID_RE = /[a-fA-F0-9]{24}/;
var SHARE_URL_RE = /https?:\/\/\S*diskwala\.com\/\S+/i;
function extractFileId(text) {
	const match = OBJECT_ID_RE.exec(text || "");
	return match ? match[0].toLowerCase() : null;
}
function normalizeShareUrl(text) {
	const raw = (text || "").trim();
	if (!raw) return DEFAULT_SHARE_URL;
	const nested = SHARE_URL_RE.exec(raw);
	const candidate = nested ? nested[0].replace(/[),.\]]+$/, "") : raw;
	const id = extractFileId(candidate);
	if (id) return `https://www.diskwala.com/app/${id}`;
	return candidate;
}
function formatBytes(bytes) {
	if (bytes == null || !Number.isFinite(bytes) || bytes <= 0) return "Unknown size";
	const units = [
		"B",
		"KB",
		"MB",
		"GB",
		"TB"
	];
	let value = bytes;
	let i = 0;
	while (value >= 1024 && i < units.length - 1) {
		value /= 1024;
		i += 1;
	}
	const digits = value >= 10 || i === 0 ? 0 : 1;
	return `${value.toFixed(digits)} ${units[i]}`;
}
function mediaProxyUrl(target, download = false) {
	const params = new URLSearchParams({ url: target });
	if (download) params.set("download", "1");
	return `/api/media?${params.toString()}`;
}
function isHls(url) {
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
function filenameFromCdn(url) {
	if (!url) return null;
	try {
		const decoded = decodeURIComponent(url);
		const hashed = decoded.includes("#") ? decoded.slice(decoded.lastIndexOf("#") + 1) : decoded.split("/").pop();
		if (!hashed) return null;
		return hashed.split("?")[0]?.trim() || null;
	} catch {
		return null;
	}
}
function isAllowedMediaHost(hostname) {
	return /(^|\.)diskwala\.com$/i.test(hostname) || hostname === "diskwala.litedns.xyz";
}
//#endregion
export { isAllowedMediaHost as a, normalizeShareUrl as c, formatBytes as i, extractFileId as n, isHls as o, filenameFromCdn as r, mediaProxyUrl as s, DEFAULT_SHARE_URL as t };
