import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  base: process.env.VITE_PUBLIC_PREVIEW === "true" ? "./" : "/apps/web/",
  build: { outDir: "dist", emptyOutDir: true },
  publicDir: false,
});
