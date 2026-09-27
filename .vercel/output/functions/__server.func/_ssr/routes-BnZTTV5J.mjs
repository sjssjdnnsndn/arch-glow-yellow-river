import { i as __toESM } from "../_runtime.mjs";
import { b as require_jsx_runtime, q as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { i as formatBytes, o as isHls, s as mediaProxyUrl, t as DEFAULT_SHARE_URL } from "./extract-YRyIimBq.mjs";
import { a as LoaderCircle, c as Check, i as Play, l as ArrowUpRight, n as RefreshCw, o as Download, r as Radio, s as Copy } from "../_libs/lucide-react.mjs";
import { t as Hls } from "../_libs/hls.js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BnZTTV5J.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MediaPlayer(props) {
	const videoRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const video = videoRef.current;
		if (!video || !props.src) return;
		if (!Boolean(props.hls)) {
			video.src = props.src;
			return () => {
				video.removeAttribute("src");
				video.load();
			};
		}
		if (video.canPlayType("application/vnd.apple.mpegurl")) {
			video.src = props.src;
			return () => {
				video.removeAttribute("src");
				video.load();
			};
		}
		if (Hls.isSupported()) {
			const hls = new Hls({ enableWorker: false });
			hls.loadSource(props.src);
			hls.attachMedia(video);
			return () => {
				hls.destroy();
			};
		}
		video.src = props.src;
		return () => {
			video.removeAttribute("src");
			video.load();
		};
	}, [props.src, props.hls]);
	if (!props.src) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex aspect-video items-center justify-center rounded-md bg-player text-sm text-muted",
		children: props.busy ? "Listening on Diskwala edges…" : "Stream appears after intercept"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
		ref: videoRef,
		className: "aspect-video w-full rounded-md bg-player object-contain",
		controls: true,
		playsInline: true,
		poster: props.poster ?? void 0,
		preload: "metadata",
		"aria-label": props.title
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var interceptDiskwala = createServerFn({ method: "POST" }).validator((data) => {
	if (typeof data !== "object" || data === null || !("url" in data) || typeof data.url !== "string") throw new Error("A Diskwala URL is required.");
	const url = data.url.trim();
	if (!url) throw new Error("A Diskwala URL is required.");
	if (url.length > 2e3) throw new Error("URL is too long.");
	return { url };
}).handler(createSsrRpc("a4090fa9d3dd8d3bc4e27fe508837e3804cba59871432250049fa78ad38b1280"));
function CopyField(props) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	async function copy() {
		if (!props.value) return;
		await navigator.clipboard.writeText(props.value);
		setCopied(true);
		window.setTimeout(() => setCopied(false), 1400);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-border bg-elevated p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 flex items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-wide text-muted uppercase",
				children: props.label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => void copy(),
				disabled: !props.value,
				className: "inline-flex h-11 min-h-11 items-center gap-1.5 rounded-sm border border-border px-3 text-xs font-medium text-fg transition-[transform,background-color] duration-150 ease-[var(--ease-out)] enabled:hover:bg-surface enabled:active:scale-[0.98] disabled:opacity-40",
				children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), copied ? "Copied" : "Copy"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono text-xs leading-5 break-all text-fg/90",
			children: props.value || "Not captured yet"
		})]
	});
}
function StatusDot({ outcome }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-1.5 shrink-0 rounded-full ${outcome === "ok" ? "bg-ok" : outcome === "empty" ? "bg-warn" : "bg-danger"}` });
}
function Waterfall({ hits }) {
	if (!hits.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "No packets yet. Run intercept to fill the log."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "divide-y divide-border",
		children: hits.map((hit) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "grid grid-cols-[72px_1fr_auto] gap-3 py-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 font-mono text-xs text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusDot, { outcome: hit.outcome }), hit.status ?? "—"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-medium text-fg",
							children: hit.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate font-mono text-xs text-subtle",
							children: [
								hit.method,
								" ",
								hit.url
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 line-clamp-2 text-xs text-muted",
							children: hit.detail
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-xs tabular-nums text-subtle",
					children: [hit.ms, "ms"]
				})
			]
		}, hit.id))
	});
}
function InterceptApp() {
	const [url, setUrl] = (0, import_react.useState)(DEFAULT_SHARE_URL);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [result, setResult] = (0, import_react.useState)(null);
	const file = result?.file ?? null;
	const playSrc = (0, import_react.useMemo)(() => {
		if (!file) return null;
		if (file.playUrl) return file.playUrl;
		if (file.streamUrl) return mediaProxyUrl(file.streamUrl);
		if (file.downloadUrl) return mediaProxyUrl(file.downloadUrl);
		return null;
	}, [file]);
	async function run(target = url) {
		setBusy(true);
		setError(null);
		try {
			const next = await interceptDiskwala({ data: { url: target } });
			setResult(next);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Intercept failed");
		} finally {
			setBusy(false);
		}
	}
	(0, import_react.useEffect)(() => {
		run(DEFAULT_SHARE_URL);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-dvh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-grid" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 pt-6 pb-4 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-9 place-items-center rounded-sm border border-border bg-surface",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "size-4 text-accent" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-lg leading-none font-semibold tracking-display",
						children: "Deeper"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: "Diskwala network intercept"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "hidden text-xs text-subtle sm:block",
					children: "Capture download + stream URLs from a share link"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "relative mx-auto max-w-6xl px-4 pb-16 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl border border-border bg-surface p-3 sm:p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "flex flex-col gap-3 sm:flex-row",
						onSubmit: (event) => {
							event.preventDefault();
							run(url);
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "sr-only",
								htmlFor: "share-url",
								children: "Diskwala URL"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "share-url",
								value: url,
								onChange: (event) => setUrl(event.target.value),
								placeholder: "Paste a diskwala.com/app/… link",
								inputMode: "url",
								autoComplete: "off",
								spellCheck: false,
								className: "h-12 min-h-12 flex-1 rounded-md border border-border bg-elevated px-4 text-sm text-fg outline-none transition-[box-shadow,border-color] duration-150 placeholder:text-subtle focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: busy,
								className: "inline-flex h-12 min-h-12 items-center justify-center gap-2 rounded-md bg-accent px-5 text-sm font-semibold text-accent-fg transition-[transform,filter] duration-150 ease-[var(--ease-out)] hover:brightness-105 active:scale-[0.98] disabled:opacity-60",
								children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }), busy ? "Intercepting" : "Intercept"]
							})
						]
					}), error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-danger",
						children: error
					}) : null]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl border border-border bg-surface p-3 sm:p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3 flex items-center justify-between px-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-sm font-medium",
										children: "Stream"
									})]
								}), file?.teaser ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full border border-border px-2 py-0.5 text-xs text-warn",
									children: "Public preview object"
								}) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaPlayer, {
								src: playSrc,
								poster: file?.thumb ? mediaProxyUrl(file.thumb) : null,
								title: file?.name || "Diskwala stream",
								hls: isHls(file?.streamUrl),
								busy: busy && !playSrc
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 grid gap-3 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyField, {
									label: "Download URL",
									value: file?.downloadUrl ?? null
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyField, {
									label: "Streaming URL",
									value: file?.streamUrl ?? null
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: [file?.downloadUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: mediaProxyUrl(file.downloadUrl, true),
									className: "inline-flex h-11 min-h-11 items-center gap-2 rounded-md bg-accent px-4 text-sm font-semibold text-accent-fg transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.98]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Download MP4"]
								}) : null, file?.downloadUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: file.downloadUrl,
									target: "_blank",
									rel: "noreferrer",
									className: "inline-flex h-11 min-h-11 items-center gap-2 rounded-md border border-border px-4 text-sm font-medium text-fg transition-colors duration-150 hover:bg-elevated",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4" }), "Open CDN"]
								}) : null]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "flex flex-col gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-xl border border-border bg-surface p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium",
								children: "File"
							}), file ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-xs text-muted",
											children: "Name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "mt-1 break-all",
											children: file.name
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted",
										children: "Size"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "mt-1 font-mono text-sm tabular-nums",
										children: formatBytes(file.size)
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted",
										children: "Type"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "mt-1 font-mono text-sm",
										children: file.type || "video"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-xs text-muted",
											children: "File ID"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "mt-1 font-mono text-xs break-all text-muted",
											children: file.fileId
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-xs text-muted",
											children: "Source"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "mt-1 text-muted",
											children: file.source || "pending"
										})]
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-muted",
								children: busy ? "Listening on Diskwala edges…" : "No file captured yet."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-xl border border-border bg-surface p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-sm font-medium",
									children: "Intercept log"
								}), result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-mono text-xs tabular-nums text-subtle",
									children: [result.elapsedMs, "ms"]
								}) : null]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Waterfall, { hits: result?.hits ?? [] })
							})]
						})]
					})]
				})]
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InterceptApp, {});
}
//#endregion
export { Home as component };
