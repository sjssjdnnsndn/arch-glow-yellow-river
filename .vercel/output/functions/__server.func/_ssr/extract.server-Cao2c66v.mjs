import { c as normalizeShareUrl, n as extractFileId, r as filenameFromCdn, s as mediaProxyUrl } from "./extract-YRyIimBq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/extract.server-Cao2c66v.js
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
function clip(text, max = 280) {
	const compact = text.replace(/\s+/g, " ").trim();
	if (compact.length <= max) return compact;
	return `${compact.slice(0, max - 1)}…`;
}
async function probe(id, label, url, init, timeoutMs, inspect) {
	const started = Date.now();
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeoutMs);
	try {
		const res = await fetch(url, {
			...init,
			signal: controller.signal,
			redirect: "follow",
			headers: {
				"User-Agent": UA,
				Accept: "application/json, text/plain, */*",
				...init.headers ?? {}
			}
		});
		const body = await res.text();
		const viewed = inspect(res.status, body, res.headers);
		return {
			hit: {
				id,
				label,
				method: (init.method || "GET").toUpperCase(),
				url,
				status: res.status,
				ms: Date.now() - started,
				outcome: viewed.outcome,
				detail: viewed.detail
			},
			file: viewed.file
		};
	} catch (err) {
		const message = err instanceof Error ? err.message : "request failed";
		return { hit: {
			id,
			label,
			method: (init.method || "GET").toUpperCase(),
			url,
			status: null,
			ms: Date.now() - started,
			outcome: "fail",
			detail: clip(message)
		} };
	} finally {
		clearTimeout(timer);
	}
}
function jsonSafe(text) {
	try {
		const parsed = JSON.parse(text);
		if (parsed && typeof parsed === "object") return parsed;
		return null;
	} catch {
		return null;
	}
}
function asString(value) {
	return typeof value === "string" && value.trim() ? value.trim() : null;
}
function asNumber(value) {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "string" && value.trim()) {
		const n = Number(value);
		return Number.isFinite(n) ? n : null;
	}
	return null;
}
function mergeFile(base, patch) {
	if (!patch) return base;
	return {
		fileId: patch.fileId || base.fileId,
		name: patch.name || base.name,
		size: patch.size ?? base.size,
		type: patch.type ?? base.type,
		thumb: patch.thumb ?? base.thumb,
		downloadUrl: patch.downloadUrl ?? base.downloadUrl,
		streamUrl: patch.streamUrl ?? base.streamUrl,
		playUrl: patch.playUrl ?? base.playUrl,
		source: patch.source ?? base.source,
		teaser: patch.teaser || base.teaser
	};
}
async function inspectMedia(url) {
	const started = Date.now();
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), 8e3);
	try {
		const head = await fetch(url, {
			method: "HEAD",
			redirect: "follow",
			signal: controller.signal,
			headers: {
				"User-Agent": UA,
				Accept: "*/*"
			}
		});
		if (head.ok) {
			const size = asNumber(head.headers.get("content-length"));
			const type = head.headers.get("content-type");
			return {
				size,
				type,
				ok: true,
				status: head.status,
				ms: Date.now() - started,
				detail: `${type || "media"} · ${size ? `${size} bytes` : "length unknown"}`
			};
		}
		const ranged = await fetch(url, {
			method: "GET",
			redirect: "follow",
			signal: controller.signal,
			headers: {
				"User-Agent": UA,
				Accept: "*/*",
				Range: "bytes=0-0"
			}
		});
		const total = ranged.headers.get("content-range")?.split("/")[1];
		const size = asNumber(total) ?? asNumber(ranged.headers.get("content-length"));
		const type = ranged.headers.get("content-type");
		if (!(ranged.ok || ranged.status === 206)) {
			const failBody = clip(await ranged.text().catch(() => ranged.statusText));
			return {
				size,
				type,
				ok: false,
				status: ranged.status,
				ms: Date.now() - started,
				detail: failBody
			};
		}
		await ranged.body?.cancel().catch(() => void 0);
		return {
			size,
			type,
			ok: true,
			status: ranged.status,
			ms: Date.now() - started,
			detail: `${type || "media"} · ${size ? `${size} bytes` : "length unknown"}`
		};
	} catch (err) {
		return {
			size: null,
			type: null,
			ok: false,
			status: null,
			ms: Date.now() - started,
			detail: err instanceof Error ? err.message : "media probe failed"
		};
	} finally {
		clearTimeout(timer);
	}
}
async function interceptShare(rawUrl) {
	const startedAt = (/* @__PURE__ */ new Date()).toISOString();
	const t0 = Date.now();
	const shareUrl = normalizeShareUrl(rawUrl);
	const fileId = extractFileId(shareUrl);
	const encodedShare = encodeURIComponent(shareUrl);
	const jobs = [
		probe("origin-page", "Diskwala share page", shareUrl, { method: "GET" }, 8e3, (status, body) => {
			if (status >= 200 && status < 400) return {
				outcome: "ok",
				detail: clip(`${/<title>([^<]+)<\/title>/i.exec(body)?.[1] ?? "HTML shell"} · SPA, no media in HTML`)
			};
			return {
				outcome: "fail",
				detail: `HTTP ${status}`
			};
		}),
		probe("temp-info", "Official temp_info", "https://ddudapidd.diskwala.com/api/v1/file/temp_info", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Origin: "https://www.diskwala.com",
				Referer: "https://www.diskwala.com/"
			},
			body: JSON.stringify({ id: fileId })
		}, 8e3, (status, body) => {
			const json = jsonSafe(body);
			const info = json && typeof json.fileInfo === "object" && json.fileInfo ? json.fileInfo : json;
			const url = asString(info?.url) || asString(info?.download_url);
			if (status === 200 && info) return {
				outcome: url ? "ok" : "empty",
				detail: clip(asString(info.name) || body),
				file: {
					name: asString(info.name) ?? void 0,
					size: asNumber(info.size) ?? void 0,
					type: asString(info.type) ?? void 0,
					thumb: asString(info.thumb) ?? void 0,
					downloadUrl: url,
					streamUrl: url,
					source: "official temp_info"
				}
			};
			return {
				outcome: "fail",
				detail: clip(body || `HTTP ${status}`)
			};
		}),
		probe("edge-free", "Public intercept edge", `https://thediskwala.com/api/diskwala-free?url=${encodedShare}`, { method: "GET" }, 15e3, (status, body) => {
			const json = jsonSafe(body);
			const url = asString(json?.url);
			if (status === 200 && json?.success === true && url) return {
				outcome: "ok",
				detail: clip(asString(json.title) || url),
				file: {
					name: asString(json.title) ?? filenameFromCdn(url) ?? void 0,
					thumb: asString(json.thumb) ?? void 0,
					downloadUrl: url,
					streamUrl: url,
					source: "public intercept edge",
					teaser: json.isFreeTeaser === true
				}
			};
			return {
				outcome: "fail",
				detail: clip(asString(json?.error) || body || `HTTP ${status}`)
			};
		}),
		probe("litedns-stream", "LiteDNS stream map", `https://diskwala.litedns.xyz/stream?file_id=${fileId ?? ""}`, { method: "GET" }, 5e3, (status, body) => {
			if (status === 200 && (body.includes("#EXTM3U") || body.startsWith("http"))) return {
				outcome: "ok",
				detail: "HLS playlist",
				file: {
					streamUrl: `https://diskwala.litedns.xyz/stream?file_id=${fileId ?? ""}`,
					source: "LiteDNS stream"
				}
			};
			const json = jsonSafe(body);
			return {
				outcome: status === 200 ? "empty" : "fail",
				detail: clip(asString(json?.error) || body || `HTTP ${status}`)
			};
		}),
		probe("litedns-dl", "LiteDNS fast-download", `https://diskwala.litedns.xyz/fast-download?file_id=${fileId ?? ""}`, { method: "GET" }, 5e3, (status, body, headers) => {
			const type = headers.get("content-type") || "";
			if (status >= 200 && status < 400 && type.includes("video")) {
				const downloadUrl = `https://diskwala.litedns.xyz/fast-download?file_id=${fileId ?? ""}`;
				return {
					outcome: "ok",
					detail: type,
					file: {
						downloadUrl,
						streamUrl: downloadUrl,
						source: "LiteDNS download"
					}
				};
			}
			return {
				outcome: "fail",
				detail: clip(asString(jsonSafe(body)?.error) || body || `HTTP ${status}`)
			};
		})
	];
	const settled = await Promise.all(jobs);
	const hits = settled.map((item) => item.hit);
	let file = fileId ? {
		fileId,
		name: `Diskwala ${fileId.slice(0, 8)}`,
		size: null,
		type: null,
		thumb: null,
		downloadUrl: null,
		streamUrl: null,
		playUrl: null,
		source: null,
		teaser: false
	} : null;
	for (const item of settled) if (file) file = mergeFile(file, item.file);
	if (file?.downloadUrl) {
		const media = await inspectMedia(file.downloadUrl);
		hits.push({
			id: "cdn-head",
			label: "CDN object probe",
			method: media.status === 206 ? "GET" : "HEAD",
			url: file.downloadUrl,
			status: media.status,
			ms: media.ms,
			outcome: media.ok ? "ok" : "fail",
			detail: media.detail
		});
		if (media.ok) file = mergeFile(file, {
			size: media.size ?? void 0,
			type: media.type ?? void 0
		});
	}
	if (file && !file.streamUrl && file.downloadUrl) file.streamUrl = file.downloadUrl;
	if (file && (file.streamUrl || file.downloadUrl)) {
		file.playUrl = mediaProxyUrl(file.streamUrl || file.downloadUrl || "");
		if (file.name.startsWith("Diskwala ")) file.name = filenameFromCdn(file.downloadUrl || file.streamUrl) || file.name;
	}
	if (file && !file.downloadUrl && !file.streamUrl) file = null;
	return {
		input: rawUrl,
		shareUrl,
		fileId,
		file,
		hits,
		startedAt,
		elapsedMs: Date.now() - t0
	};
}
//#endregion
export { interceptShare };
