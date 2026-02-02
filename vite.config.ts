import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Validate environment variables at build time
// Note: For Vercel deployments, environment variables are provided at runtime
function validateEnvironment(mode: string) {
  if (mode === "production" && process.env.NODE_ENV !== "production") {
    // Only validate if explicitly building for production locally
    const requiredEnvVars = ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"];
    const missing = requiredEnvVars.filter((env) => !process.env[env]);

    if (missing.length > 0 && !process.env.CI) {
      console.warn(
        `Warning: Missing environment variables for production build:\n` +
        missing.map((env) => `  - ${env}`).join("\n") +
        `\n\nFor Vercel deployments, add these in Project Settings > Environment Variables.\n` +
        `See .env.example for reference.`
      );
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  validateEnvironment(mode);

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    build: {
      rollupOptions: {
        external: ["@sentry/react"],
      },
    },
    ssr: {
      noExternal: [],
    },
    optimizeDeps: {
      exclude: ["@sentry/react"],
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
