import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { captureException } from "@/integrations/sentry";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * ErrorBoundary Component
 *
 * Catches React rendering errors and displays a user-friendly error page.
 * Automatically reports errors to Sentry if configured.
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);

        // Send error to Sentry for monitoring and alerting
        captureException(error, {
            componentStack: errorInfo.componentStack,
        });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <div className="text-center space-y-6 p-6 max-w-md">
                        <div className="w-20 h-20 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                            <svg
                                className="w-10 h-10 text-destructive"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>

                        <h1 className="font-display text-3xl md:text-4xl text-foreground font-medium">
                            Oops! Something went wrong
                        </h1>

                        <p className="font-body text-muted-foreground leading-relaxed">
                            We're sorry for the inconvenience. An unexpected error has occurred.
                            Our team has been notified and is working on a fix.
                        </p>

                        {process.env.NODE_ENV === "development" && this.state.error && (
                            <details className="text-left bg-secondary p-4 rounded-lg">
                                <summary className="font-body text-sm font-medium cursor-pointer">
                                    Error Details (Development Only)
                                </summary>
                                <pre className="mt-2 text-xs text-destructive overflow-auto max-h-40">
                                    {this.state.error.toString()}
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button
                                onClick={() => window.location.reload()}
                                variant="outline"
                                className="rounded-full"
                            >
                                Reload Page
                            </Button>
                            <Button
                                onClick={() => window.location.href = "/"}
                                className="bg-primary hover:bg-pink-light text-primary-foreground rounded-full"
                            >
                                Go Home
                            </Button>
                        </div>

                        <p className="font-body text-xs text-muted-foreground">
                            If the problem persists, please contact us at (+255) 793 145 167
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
