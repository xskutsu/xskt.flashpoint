import fs from "node:fs/promises";
import path from "node:path";
import config from "../flashpoint.config.mjs";

const directories = new Set();
for (const target of config.targets) {
	let outfilePath;
	switch (target.type) {
		case "esbuild":
			outfilePath = target.esbuild?.outfile;
			break;
		case "porffor":
			outfilePath = target.porffor?.outfile;
			break;
		default:
			console.warn(`Warning: Unknown target type ${target.type} on ${target.name}. Skipping.`);
			continue;
	}
	if (!outfilePath) {
		console.warn(`Warning: No out file path for ${target.name} on ${target.name}. Skipping.`);
		continue;
	}
	const dir = path.dirname(outfilePath);
	if (dir === "." || dir === "/" || dir.includes("..")) {
		console.warn(`Warning: Skipping potentially dangerous path "${dir}" on ${target.name}.`);
		continue;
	}
	directories.add(dir);
}

if (directories.size === 0) {
	console.log("Nothing to clean.");
} else {
	for (const dir of directories) {
		try {
			await fs.rm(dir, {
				force: true,
				recursive: true,
			});
			console.log("Cleaned directory:", dir);
		} catch (error) {
			console.error("Failed to clean directory:", dir);
			console.error(error);
		}
	}
}
