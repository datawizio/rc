import dts from "vite-plugin-dts";
import react from "@vitejs/plugin-react-swc";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import { peerDependencies } from "./package.json";

export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
    dts({
      outDir: ["es", "lib"],
      tsconfigPath: resolve(__dirname, "tsconfig.app.json")
    })
  ],
  css: {
    preprocessorOptions: {
      less: {
        math: "always",
        relativeUrls: true,
        javascriptEnabled: true
      }
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      fileName: format => (format === "es" ? "index.js" : "index.cjs")
    },
    rollupOptions: {
      output: [
        {
          exports: "named",
          format: "es",
          dir: "es",
          preserveModules: true,
          preserveModulesRoot: "src",
          entryFileNames: "[name].js"
        },
        {
          exports: "named",
          format: "cjs",
          dir: "lib",
          preserveModules: true,
          preserveModulesRoot: "src",
          entryFileNames: "[name].cjs"
        }
      ],
      external: ["react/jsx-runtime", ...Object.keys(peerDependencies || {})]
    },
    sourcemap: true
  }
});
