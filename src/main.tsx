import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { initSentry } from "./integrations/sentry";
import App from "./App.tsx";
import "./index.css";

// Suppress React DevTools suggestion in development
if (import.meta.env.DEV) {
  // Only set if the property doesn't already exist or is configurable
  if (!window.hasOwnProperty('__REACT_DEVTOOLS_GLOBAL_HOOK__')) {
    try {
      Object.defineProperty(window, '__REACT_DEVTOOLS_GLOBAL_HOOK__', {
        value: {
          isDisabled: false,
          supportsFiber: true,
          inject: () => {},
          onCommitFiberRoot: () => {},
          onCommitFiberUnmount: () => {},
          onPostCommitFiberRoot: () => {},
          onPreCommitFiberRoot: () => {},
        },
        writable: true,
        configurable: true
      });
    } catch (e) {
      // Silently fail if we can't define the property
      console.debug('Could not configure React DevTools hook');
    }
  }
}

// Initialize Sentry error tracking (if configured in environment)
initSentry().catch((err) => {
  console.debug("Sentry initialization skipped or failed gracefully", err);
});

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error(
        'Failed to find root element. Please ensure your HTML contains <div id="root"></div>'
    );
}

createRoot(rootElement).render(
    <StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </StrictMode>
);
