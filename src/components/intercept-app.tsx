import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  Download,
  LoaderCircle,
  Play,
  Radio,
  RefreshCw,
} from "lucide-react";
import { MediaPlayer } from "@/components/player";
import {
  DEFAULT_SHARE_URL,
  formatBytes,
  isHls,
  mediaProxyUrl,
  type ExtractResult,
  type ProbeHit,
} from "@/lib/extract";
import { interceptDiskwala } from "@/lib/extract.functions";

function CopyField(props: { label: string; value: string | null }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!props.value) return;
    await navigator.clipboard.writeText(props.value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="rounded-md border border-border bg-elevated p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-xs font-medium tracking-wide text-muted uppercase">
          {props.label}
        </p>
        <button
          type="button"
          onClick={() => void copy()}
          disabled={!props.value}
          className="inline-flex h-11 min-h-11 items-center gap-1.5 rounded-sm border border-border px-3 text-xs font-medium text-fg transition-[transform,background-color] duration-150 ease-[var(--ease-out)] enabled:hover:bg-surface enabled:active:scale-[0.98] disabled:opacity-40"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="font-mono text-xs leading-5 break-all text-fg/90">
        {props.value || "Not captured yet"}
      </p>
    </div>
  );
}

function StatusDot({ outcome }: { outcome: ProbeHit["outcome"] }) {
  const color =
    outcome === "ok" ? "bg-ok" : outcome === "empty" ? "bg-warn" : "bg-danger";
  return <span className={`size-1.5 shrink-0 rounded-full ${color}`} />;
}

function Waterfall({ hits }: { hits: ProbeHit[] }) {
  if (!hits.length) {
    return (
      <p className="text-sm text-muted">No packets yet. Run intercept to fill the log.</p>
    );
  }
  return (
    <ul className="divide-y divide-border">
      {hits.map((hit) => (
        <li key={hit.id} className="grid grid-cols-[72px_1fr_auto] gap-3 py-3">
          <div className="flex items-center gap-2 font-mono text-xs text-muted">
            <StatusDot outcome={hit.outcome} />
            {hit.status ?? "—"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-fg">{hit.label}</p>
            <p className="truncate font-mono text-xs text-subtle">
              {hit.method} {hit.url}
            </p>
            <p className="mt-1 line-clamp-2 text-xs text-muted">{hit.detail}</p>
          </div>
          <p className="font-mono text-xs tabular-nums text-subtle">{hit.ms}ms</p>
        </li>
      ))}
    </ul>
  );
}

export function InterceptApp() {
  const [url, setUrl] = useState(DEFAULT_SHARE_URL);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExtractResult | null>(null);

  const file = result?.file ?? null;
  const playSrc = useMemo(() => {
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

  useEffect(() => {
    void run(DEFAULT_SHARE_URL);
    // First paint intercepts the requested share automatically.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative min-h-dvh bg-bg text-fg">
      <div className="pointer-events-none absolute inset-0 bg-grid" />
      <header className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 pt-6 pb-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-sm border border-border bg-surface">
            <Radio className="size-4 text-accent" />
          </span>
          <div>
            <h1 className="font-display text-lg leading-none font-semibold tracking-display">
              Deeper
            </h1>
            <p className="mt-1 text-xs text-muted">Diskwala network intercept</p>
          </div>
        </div>
        <p className="hidden text-xs text-subtle sm:block">
          Capture download + stream URLs from a share link
        </p>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <section className="rounded-xl border border-border bg-surface p-3 sm:p-4">
          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              void run(url);
            }}
          >
            <label className="sr-only" htmlFor="share-url">
              Diskwala URL
            </label>
            <input
              id="share-url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="Paste a diskwala.com/app/… link"
              inputMode="url"
              autoComplete="off"
              spellCheck={false}
              className="h-12 min-h-12 flex-1 rounded-md border border-border bg-elevated px-4 text-sm text-fg outline-none transition-[box-shadow,border-color] duration-150 placeholder:text-subtle focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
            />
            <button
              type="submit"
              disabled={busy}
              className="inline-flex h-12 min-h-12 items-center justify-center gap-2 rounded-md bg-accent px-5 text-sm font-semibold text-accent-fg transition-[transform,filter] duration-150 ease-[var(--ease-out)] hover:brightness-105 active:scale-[0.98] disabled:opacity-60"
            >
              {busy ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <RefreshCw className="size-4" />
              )}
              {busy ? "Intercepting" : "Intercept"}
            </button>
          </form>
          {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <section className="rounded-xl border border-border bg-surface p-3 sm:p-4">
            <div className="mb-3 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Play className="size-4 text-accent" />
                <h2 className="text-sm font-medium">Stream</h2>
              </div>
              {file?.teaser ? (
                <span className="rounded-full border border-border px-2 py-0.5 text-xs text-warn">
                  Public preview object
                </span>
              ) : null}
            </div>
            <MediaPlayer
              src={playSrc}
              poster={file?.thumb ? mediaProxyUrl(file.thumb) : null}
              title={file?.name || "Diskwala stream"}
              hls={isHls(file?.streamUrl)}
              busy={busy && !playSrc}
            />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <CopyField label="Download URL" value={file?.downloadUrl ?? null} />
              <CopyField label="Streaming URL" value={file?.streamUrl ?? null} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {file?.downloadUrl ? (
                <a
                  href={mediaProxyUrl(file.downloadUrl, true)}
                  className="inline-flex h-11 min-h-11 items-center gap-2 rounded-md bg-accent px-4 text-sm font-semibold text-accent-fg transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.98]"
                >
                  <Download className="size-4" />
                  Download MP4
                </a>
              ) : null}
              {file?.downloadUrl ? (
                <a
                  href={file.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 min-h-11 items-center gap-2 rounded-md border border-border px-4 text-sm font-medium text-fg transition-colors duration-150 hover:bg-elevated"
                >
                  <ArrowUpRight className="size-4" />
                  Open CDN
                </a>
              ) : null}
            </div>
          </section>

          <aside className="flex flex-col gap-6">
            <section className="rounded-xl border border-border bg-surface p-4">
              <h2 className="text-sm font-medium">File</h2>
              {file ? (
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div className="col-span-2">
                    <dt className="text-xs text-muted">Name</dt>
                    <dd className="mt-1 break-all">{file.name}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Size</dt>
                    <dd className="mt-1 font-mono text-sm tabular-nums">
                      {formatBytes(file.size)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Type</dt>
                    <dd className="mt-1 font-mono text-sm">{file.type || "video"}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-xs text-muted">File ID</dt>
                    <dd className="mt-1 font-mono text-xs break-all text-muted">
                      {file.fileId}
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-xs text-muted">Source</dt>
                    <dd className="mt-1 text-muted">{file.source || "pending"}</dd>
                  </div>
                </dl>
              ) : (
                <p className="mt-3 text-sm text-muted">
                  {busy ? "Listening on Diskwala edges…" : "No file captured yet."}
                </p>
              )}
            </section>

            <section className="rounded-xl border border-border bg-surface p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium">Intercept log</h2>
                {result ? (
                  <p className="font-mono text-xs tabular-nums text-subtle">
                    {result.elapsedMs}ms
                  </p>
                ) : null}
              </div>
              <div className="mt-2">
                <Waterfall hits={result?.hits ?? []} />
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
