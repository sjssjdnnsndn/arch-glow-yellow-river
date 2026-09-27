import { createFileRoute } from "@tanstack/react-router";
import { isAllowedMediaHost } from "@/lib/extract";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

function filenameFromUrl(target: URL): string {
  const raw = decodeURIComponent(target.pathname.split("/").pop() || "video.mp4");
  const hashed = raw.includes("#") ? raw.slice(raw.lastIndexOf("#") + 1) : raw;
  const cleaned = hashed.replace(/[^\w.\- ()[\]]+/g, "_") || "video.mp4";
  return cleaned.endsWith(".mp4") || cleaned.includes(".") ? cleaned : `${cleaned}.mp4`;
}

function parseTarget(raw: string): URL | null {
  try {
    return new URL(raw.replace(/#/g, "%23"));
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/api/media")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const incoming = new URL(request.url);
        const raw = incoming.searchParams.get("url");
        const asDownload = incoming.searchParams.get("download") === "1";
        if (!raw) {
          return new Response("Missing url", { status: 400 });
        }
        const target = parseTarget(raw);
        if (!target) {
          return new Response("Invalid url", { status: 400 });
        }
        if (target.protocol !== "https:") {
          return new Response("Only https media is allowed", { status: 400 });
        }
        if (!isAllowedMediaHost(target.hostname)) {
          return new Response("Host not allowed", { status: 400 });
        }

        const headers: Record<string, string> = {
          "User-Agent": UA,
          Accept: "*/*",
        };
        const range = request.headers.get("range");
        if (range) headers.Range = range;

        const upstream = await fetch(target.href, {
          headers,
          redirect: "follow",
        });

        const out = new Headers();
        out.set(
          "Content-Type",
          upstream.headers.get("content-type") || "application/octet-stream",
        );
        const length = upstream.headers.get("content-length");
        if (length) out.set("Content-Length", length);
        const contentRange = upstream.headers.get("content-range");
        if (contentRange) out.set("Content-Range", contentRange);
        const acceptRanges = upstream.headers.get("accept-ranges");
        if (acceptRanges) out.set("Accept-Ranges", acceptRanges);
        else out.set("Accept-Ranges", "bytes");
        out.set("Cache-Control", "private, max-age=120");
        if (asDownload) {
          out.set(
            "Content-Disposition",
            `attachment; filename="${filenameFromUrl(target)}"`,
          );
        }

        return new Response(upstream.body, {
          status: upstream.status,
          headers: out,
        });
      },
    },
  },
});
