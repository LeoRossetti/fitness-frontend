"use client";

import * as Sentry from "@sentry/nextjs";
import { ErrorBoundary as SentryErrorBoundary } from "@sentry/react";
import { ReactNode } from "react";

interface ErrorFallbackProps {
  error: unknown;
  componentStack: string;
  eventId: string;
  resetError(): void;
}

function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h1 className="text-lg font-semibold text-gray-900">
              Something went wrong
            </h1>
            <p className="text-sm text-gray-600">
              We've been notified about this issue
            </p>
          </div>
        </div>
        
        <div className="mb-4">
          <details className="group">
            <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
              Show error details
            </summary>
            <div className="mt-2 p-3 bg-gray-50 rounded border text-xs font-mono text-red-700 break-all">
              {errorMessage}
            </div>
          </details>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={resetError}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  return (
    <SentryErrorBoundary
      fallback={ErrorFallback}
      beforeCapture={(scope) => {
        scope.setTag("errorBoundary", true);
      }}
    >
      {children}
    </SentryErrorBoundary>
  );
}
