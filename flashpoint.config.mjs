// biome-ignore lint/style/noDefaultExport: this is intentional since this file will only have one export
export default {
	targets: [
		{
			esbuild: {
				banner: {
					js: `
// ==UserScript==
// @name         Userscript
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       xskutsu
// @license      UNLICENSE
// @match        https://www.google.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==`.trim(),
				},
				bundle: true,
				entryPoints: ["src/userscript/index.ts"],
				format: "iife",
				minify: true,
				outfile: "dist/index.userscript.js",
				platform: "browser",
				sourcemap: false,
				tsconfig: "src/userscript/tsconfig.json",
			},
			name: "Userscript Target",
			type: "esbuild",
		},
		{
			esbuild: {
				banner: {
					js: "Copyright (c) 2026 xskutsu. Licensed under the UNLICENSED",
				},
				bundle: true,
				entryPoints: ["src/server/index.ts"],
				format: "cjs",
				outfile: "dist/server.cjs",
				packages: "external",
				platform: "node",
				sourcesContent: false,
				tsconfig: "src/server/tsconfig.json",
			},
			name: "Server Target",
			type: "esbuild",
		},
		{
			esbuild: {
				banner: {
					js: "Copyright (c) 2026 xskutsu. Licensed under the UNLICENSED",
				},
				bundle: true,
				entryPoints: ["src/client/index.ts"],
				format: "iife",
				minify: true,
				outfile: "dist/client.min.js",
				platform: "browser",
				sourcemap: true,
				sourcesContent: false,
				tsconfig: "src/client/tsconfig.json",
			},
			name: "Client Target",
			type: "esbuild",
		},
		{
			esbuild: {
				bundle: true,
				entryPoints: ["src/porffor/index.ts"],
				format: "esm",
				platform: "neutral",
				sourcesContent: false,
				tsconfig: "src/porffor/tsconfig.json",
			},
			name: "Porffor Target",
			porffor: {
				opt: true,
				outfile: "dist/porffor.wasm",
				target: "wasm",
				valtype: "f64",
			},
			type: "porffor",
		},
	],
};
