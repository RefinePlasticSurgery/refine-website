/**
 * Error monitoring integration.
 *
 * HOW TO ENABLE IN PRODUCTION:
 * 1. Install the SDK: npm i @sentry/react
 * 2. Add VITE_SENTRY_DSN to your .env
 * 3. Uncomment the Sentry.init block below
 *
 * Until then, errors are logged to the console in dev and silently dropped
 * in production so the UX is never blocked by monitoring failures.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Uncomment when @sentry/react is installed:
//
// import * as Sentry from '@sentry/react';
//
// if (import.meta.env.VITE_SENTRY_DSN) {
//   Sentry.init({
//     dsn: import.meta.env.VITE_SENTRY_DSN,
//     environment: import.meta.env.MODE,
//     tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
//     integrations: [Sentry.browserTracingIntegration()],
//     beforeSend(event) {
//       // Strip PII from error payloads before sending
//       if (event.user?.email) delete event.user.email;
//       return event;
//     },
//   });
// }
//
// export const captureException = Sentry.captureException;
// export const setUser = Sentry.setUser;
// export const addBreadcrumb = Sentry.addBreadcrumb;
// ─────────────────────────────────────────────────────────────────────────────

type CaptureContext = Record<string, unknown>;

/**
 * Initialises the error monitoring integration.
 * Called once from main.tsx on application startup.
 *
 * To activate real Sentry:
 * 1. npm i @sentry/react
 * 2. Add VITE_SENTRY_DSN to .env
 * 3. Uncomment the block below and remove this stub.
 *
 * Uncomment when ready:
 * ─────────────────────────────────────────────────────────────
 * import * as Sentry from '@sentry/react';
 *
 * export async function initSentry(): Promise<void> {
 *   if (!import.meta.env.VITE_SENTRY_DSN) return;
 *   Sentry.init({
 *     dsn: import.meta.env.VITE_SENTRY_DSN,
 *     environment: import.meta.env.MODE,
 *     tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
 *     integrations: [Sentry.browserTracingIntegration()],
 *     beforeSend(event) {
 *       if (event.user?.email) delete event.user.email; // strip PII
 *       return event;
 *     },
 *   });
 * }
 * export const captureException = Sentry.captureException;
 * export const setUser         = Sentry.setUser;
 * export const addBreadcrumb   = Sentry.addBreadcrumb;
 * ─────────────────────────────────────────────────────────────
 */

export async function initSentry(): Promise<void> {
  // No-op stub — swap for real implementation above when VITE_SENTRY_DSN is set.
}

export const captureException = (error: Error, context?: CaptureContext): void => {
  if (import.meta.env.DEV) {
    console.error('[Error monitor]', error.message, context ?? '');
  }
};

export const setUser = (_user: { id?: string; email?: string } | null): void => {
  // no-op until Sentry is wired
};

export const addBreadcrumb = (_crumb: {
  message: string;
  category?: string;
  level?: 'debug' | 'info' | 'warning' | 'error';
  data?: Record<string, unknown>;
}): void => {
  // no-op until Sentry is wired
};
