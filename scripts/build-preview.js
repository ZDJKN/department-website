import { build } from "vite";
import { cp, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import "./check-preview.js";

const root = fileURLToPath(new URL("../", import.meta.url));
process.env.VITE_PUBLIC_PREVIEW = "true";
await build({
  configFile: resolve(root, "apps/web/vite.config.js"),
  build: { outDir: resolve(root, "dist"), emptyOutDir: true },
});
await mkdir(resolve(root, "dist/content"), { recursive: true });
await cp(
  resolve(root, "content/site.json"),
  resolve(root, "dist/content/site.json"),
);
await cp(resolve(root, "media"), resolve(root, "dist/media"), {
  recursive: true,
});
await writeFile(resolve(root, "dist/.nojekyll"), "");
console.log("只读预览已构建到 dist，无需 API 或后台。");
