import fs from "node:fs/promises";
import * as esbuild from "esbuild";
import compile from "porffor";
import config from "../flashpoint.config.mjs";

const startTime = performance.now();
let hasError = false;

await Promise.all(
	config.targets.map(async (target) => {
		try {
			switch (target.type) {
				case "esbuild":
					await esbuild.build(target.esbuild);
					console.log(`Built ${target.name} to file ${target.esbuild.outfile}`);
					break;
				case "porffor": {
					const outfilePath = target.outfile;
					const buildResult = await esbuild.build({
						...target.esbuild,
						outfile: "temp.js",
						write: false,
					});
					const jscode = buildResult.outputFiles[0].text;
					if (Object.hasOwn(target.porffor, "optTypes")) {
						globalThis.Prefs.optTypes = target.porffor.optTypes;
					}
					if (Object.hasOwn(target.porffor, "parseTypes")) {
						globalThis.Prefs.parseTypes = target.porffor.parseTypes;
					}
					if (Object.hasOwn(target.porffor, "valType")) {
						globalThis.Prefs.valType = target.porffor.valType;
					}
					if (Object.hasOwn(target.porffor, "optimizationLevel")) {
						const level = target.porffor.optimizationLevel;
						globalThis.Prefs[`O${level}`] = true;
					}
					const wasm = compile(jscode).wasm;
					await fs.writeFile(outfilePath, Buffer.from(wasm));
					console.log(`Built ${target.name} to file ${outfilePath}`);
					break;
				}
				default:
					console.warn(`Warning: Unknown target type ${target.type} on ${target.name}. Skipping.`);
					return;
			}
		} catch (error) {
			hasError = true;
			console.error("Failed to build:", target.name);
			console.error(error);
		}
	}),
);

const totalTime = (performance.now() - startTime).toFixed(1);
if (hasError) {
	console.error(`Build targets finished with errors in ${totalTime}ms.`);
	process.exit(1);
} else {
	console.log(`Build targets finished in ${totalTime}ms.`);
}
