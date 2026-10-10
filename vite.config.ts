import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode, isSsrBuild }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  assetsInclude: ["**/*.glb", "**/*.gltf"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Improve chunking to reduce initial bundle size
    rollupOptions: {
      output: {
        // Dependencies are external in the SSR (pre-render) build, so only chunk the client build
        manualChunks: isSsrBuild
          ? undefined
          : {
              // Vendor chunk — heavy libraries loaded separately
              "vendor-react": ["react", "react-dom", "react-router-dom"],
              "vendor-motion": ["framer-motion"],
              "vendor-radix": [
                "@radix-ui/react-accordion",
                "@radix-ui/react-dialog",
                "@radix-ui/react-tabs",
                "@radix-ui/react-tooltip",
              ],
              "vendor-query": ["@tanstack/react-query"],
            },
      },
    },
    // Warn if any chunk exceeds 800KB
    chunkSizeWarningLimit: 800,
    // Enable minification
    minify: "esbuild",
    // Generate source maps for production debugging (disable if not needed)
    sourcemap: false,
    // Optimize CSS
    cssMinify: true,
  },
}));
