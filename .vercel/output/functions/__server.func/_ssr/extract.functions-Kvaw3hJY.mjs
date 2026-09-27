import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/extract.functions-Kvaw3hJY.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var interceptDiskwala_createServerFn_handler = createServerRpc({
	id: "a4090fa9d3dd8d3bc4e27fe508837e3804cba59871432250049fa78ad38b1280",
	name: "interceptDiskwala",
	filename: "src/lib/extract.functions.ts"
}, (opts) => interceptDiskwala.__executeServer(opts));
var interceptDiskwala = createServerFn({ method: "POST" }).validator((data) => {
	if (typeof data !== "object" || data === null || !("url" in data) || typeof data.url !== "string") throw new Error("A Diskwala URL is required.");
	const url = data.url.trim();
	if (!url) throw new Error("A Diskwala URL is required.");
	if (url.length > 2e3) throw new Error("URL is too long.");
	return { url };
}).handler(interceptDiskwala_createServerFn_handler, async ({ data }) => {
	const { interceptShare } = await import("./extract.server-Cao2c66v.mjs");
	return interceptShare(data.url);
});
//#endregion
export { interceptDiskwala_createServerFn_handler };
