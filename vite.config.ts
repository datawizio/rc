import fs from "fs-extra";
import dts from "vite-plugin-dts";
import react from "@vitejs/plugin-react-swc";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import { theme } from "antd";
import { convertLegacyToken, defaultTheme } from "@ant-design/compatible";
import { glob } from "glob";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import { peerDependencies } from "./package.json";

const mapV4Token = theme.getDesignToken(defaultTheme);
const v4Vars = convertLegacyToken(mapV4Token);

const entryFiles = await glob("./src/**/*.{ts,tsx,less}", {
  ignore: [
    "./src/vite-env.d.ts",
    "./src/styles/mixin/*.less",
    "./src/styles/variables.less"
  ]
});

const copyLessFiles = () => {
  return {
    name: "copy-less-files",
    closeBundle: () => {
      const srcDir = resolve(__dirname, "src");
      const outDirs = ["es", "lib"];

      for (const out of outDirs) {
        const targetDir = resolve(__dirname, out);
        fs.copySync(srcDir, targetDir, {
          filter: src => src.endsWith(".less") || fs.statSync(src).isDirectory()
        });
      }
    }
  };
};

export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
    copyLessFiles(),
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
        javascriptEnabled: true,
        modifyVars: v4Vars
      }
    }
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src")
    }
  },
  build: {
    lib: {
      entry: entryFiles,
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
    sourcemap: true, // TODO: import.meta.env.NODE_ENV === 'development'
    emptyOutDir: true
  }
});
