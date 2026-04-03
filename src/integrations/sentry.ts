/**
 * Sentry Error Tracking Integration
 *
 * Initializes only when VITE_SENTRY_DSN is set. Uses @sentry/react (bundled with the app).
 */

let sentryInitialized = false;
let sentryApi: typeof import("@sentry/react") | null = null;

export const initSentry = async () => {
  if (sentryInitialized) return;

  const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

  if (!sentryDsn) {
    sentryInitialized = true;
    return;
  }

  try {
    const Sentry = await import("@sentry/react");
    sentryApi = Sentry;

    Sentry.init({
      dsn: sentryDsn,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
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
  } catch (error) {
    sentryInitialized = true;
    console.warn(
      "Sentry module not found or failed to load.",
      error instanceof Error ? error.message : error
    );
  }
};

export const captureException = (
  error: Error,
  context?: Record<string, unknown>
) => {
  try {
    sentryApi?.captureException(error, {
      contexts: { custom: context },
    });
  } catch {
    console.debug("Sentry not available for error capture");
  }
};

export const captureMessage = (
  message: string,
  level: "fatal" | "error" | "warning" | "info" | "debug" = "info",
  context?: Record<string, unknown>
) => {
  try {
    sentryApi?.captureMessage(message, {
      level,
      contexts: { custom: context },
    });
  } catch {
    console.debug("Sentry not available for message capture");
  }
};

export const setSentryUser = (
  userId?: string,
  email?: string,
  username?: string
) => {
  try {
    sentryApi?.setUser({
      id: userId,
      email,
      username,
    });
  } catch {
    console.debug("Sentry not available for user context");
  }
};

export const clearSentryUser = () => {
  try {
    sentryApi?.setUser(null);
  } catch {
    console.debug("Sentry not available for clearing user context");
  }
};
