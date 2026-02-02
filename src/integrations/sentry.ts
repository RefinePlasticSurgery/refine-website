/**
 * Sentry Error Tracking Integration
 *
 * This module provides error tracking and monitoring using Sentry (optional).
 * Sentry is only loaded if VITE_SENTRY_DSN is configured.
 *
 * To use Sentry:
 * 1. Install: bun add @sentry/react
 * 2. Create an account at https://sentry.io/
 * 3. Create a new project for React
 * 4. Add VITE_SENTRY_DSN to your .env.production file
 * 5. The integration will automatically initialize when the app loads
 *
 * If Sentry is not configured or installed, the app will work normally
 * with error tracking disabled.
 */

let sentryInitialized = false;

/**
 * Initialize Sentry error tracking
 * Only loads Sentry if DSN is configured and package is installed
 */
export const initSentry = async () => {
  if (sentryInitialized) return;
  
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

  if (!sentryDsn) {
    // Suppress log in development - Sentry is optional
    sentryInitialized = true;
    return;
  }

  try {
    // Dynamically import Sentry to avoid requiring it as a dependency
    // This allows the app to work without Sentry installed
    const Sentry = await import("@sentry/react");
    
    Sentry.init({
      dsn: sentryDsn,
      integrations: [
        new Sentry.BrowserTracing(),
        new Sentry.Replay({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      environment: import.meta.env.MODE,
      release: "1.0.0",
      enabled: import.meta.env.MODE === "production",
    });

    sentryInitialized = true;
    console.log("Sentry initialized successfully");
  } catch (error) {
    sentryInitialized = true;
    console.warn(
      "Sentry module not found. Install with: bun add @sentry/react",
      error instanceof Error ? error.message : error
    );
  }
};

/**
 * Capture an exception in Sentry (if available)
 * @param error - The error to capture
 * @param context - Optional context information
 */
export const captureException = (error: Error, context?: Record<string, any>) => {
  try {
    if (typeof window !== "undefined" && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        contexts: {
          custom: context,
        },
      });
    }
  } catch (err) {
    // Silently fail if Sentry is not available
    console.debug("Sentry not available for error capture");
  }
};

/**
 * Capture a message in Sentry (if available)
 * @param message - The message to capture
 * @param level - Log level
 * @param context - Optional context information
 */
export const captureMessage = (
  message: string,
  level: "fatal" | "error" | "warning" | "info" | "debug" = "info",
  context?: Record<string, any>
) => {
  try {
    if (typeof window !== "undefined" && (window as any).Sentry) {
      (window as any).Sentry.captureMessage(message, level, {
        contexts: {
          custom: context,
        },
      });
    }
  } catch (err) {
    console.debug("Sentry not available for message capture");
  }
};

/**
 * Set Sentry user context (if available)
 * Useful for identifying which user encountered an error
 */
export const setSentryUser = (
  userId?: string,
  email?: string,
  username?: string
) => {
  try {
    if (typeof window !== "undefined" && (window as any).Sentry) {
      (window as any).Sentry.setUser({
        id: userId,
        email,
        username,
      });
    }
  } catch (err) {
    console.debug("Sentry not available for user context");
  }
};

/**
 * Clear Sentry user context (if available)
 * Call this when user logs out
 */
export const clearSentryUser = () => {
  try {
    if (typeof window !== "undefined" && (window as any).Sentry) {
      (window as any).Sentry.setUser(null);
    }
  } catch (err) {
    console.debug("Sentry not available for clearing user context");
  }
};
