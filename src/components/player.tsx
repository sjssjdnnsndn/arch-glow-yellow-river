import { useEffect, useRef } from "react";
import Hls from "hls.js";

export function MediaPlayer(props: {
  src: string | null;
  poster: string | null;
  title: string;
  hls?: boolean;
  busy?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !props.src) return;

    const useHls = Boolean(props.hls);
    if (!useHls) {
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

  if (!props.src) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-md bg-player text-sm text-muted">
        {props.busy ? "Listening on Diskwala edges…" : "Stream appears after intercept"}
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      className="aspect-video w-full rounded-md bg-player object-contain"
      controls
      playsInline
      poster={props.poster ?? undefined}
      preload="metadata"
      aria-label={props.title}
    />
  );
}
