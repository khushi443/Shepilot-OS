import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      babel: {
        // Dev-only editor tooling: annotates JSX elements with their
        // source file/line so the scaffolding tool can locate them. It has
        // no purpose in a production build — it adds a babel pass to every
        // JSX element and ships internal file paths/line numbers into the
        // shipped HTML, which is unnecessary bytes and a minor information
        // leak for zero runtime benefit once the app is deployed.
        plugins: mode === "development" ? ["./babel-plugin-imagine-loc.cjs"] : [],
      },
    }),
    tailwindcss(),
    tsconfigPaths(),
  ],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
}));
