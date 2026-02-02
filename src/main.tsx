import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { initSentry } from "./integrations/sentry";
import App from "./App.tsx";
import "./index.css";

// Suppress React DevTools suggestion in development
if (import.meta.env.DEV) {
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
    isDisabled: false,
    supportsFiber: true,
    inject: () => {},
    onCommitFiberRoot: () => {},
    onCommitFiberUnmount: () => {},
    onPostCommitFiberRoot: () => {},
    onPreCommitFiberRoot: () => {},
  } as any;
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
