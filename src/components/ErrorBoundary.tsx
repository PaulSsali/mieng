'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { logError } from '@/lib/error-service';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary component to catch and handle JavaScript errors in child components
 * Used to prevent the entire application from crashing on client-side errors
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to our error logging service
    logError(error, 'error', {
      component: 'ErrorBoundary',
      componentStack: errorInfo.componentStack,
    });
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Render custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="p-6 mx-auto max-w-lg bg-white rounded-lg shadow-md border border-gray-200">
          <div className="text-center mb-4">
            <div className="w-14 h-14 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Something Went Wrong</h2>
            <p className="text-gray-600 mt-2">
              There was an error with this component. We've logged the issue and will fix it as soon as possible.
            </p>
          </div>
          
          <Button 
            onClick={this.resetError}
            variant="default"
            className="w-full"
          >
            Try Again
          </Button>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-sm overflow-auto max-h-48">
              <p className="font-mono text-red-600">
                {this.state.error.toString()}
              </p>
              {this.state.errorInfo && (
                <pre className="mt-2 text-xs text-gray-700 whitespace-pre-wrap">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>
          )}
        </div>
      );
    }

    // When there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary; 