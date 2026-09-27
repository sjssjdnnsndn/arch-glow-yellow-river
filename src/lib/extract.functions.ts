import { createServerFn } from "@tanstack/react-start";
import type { ExtractResult } from "./extract";

export const interceptDiskwala = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (
      typeof data !== "object" ||
      data === null ||
      !("url" in data) ||
      typeof (data as { url: unknown }).url !== "string"
    ) {
      throw new Error("A Diskwala URL is required.");
    }
    const url = (data as { url: string }).url.trim();
    if (!url) throw new Error("A Diskwala URL is required.");
    if (url.length > 2000) throw new Error("URL is too long.");
    return { url };
  })
  .handler(async ({ data }): Promise<ExtractResult> => {
    const { interceptShare } = await import("./extract.server");
    return interceptShare(data.url);
  });
