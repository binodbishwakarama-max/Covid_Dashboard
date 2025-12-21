import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Activity } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex h-screen w-full items-center justify-center bg-brand-900 flex-col gap-6 p-4">
                    <div className="relative">
                        <Activity size={64} className="text-status-critical animate-pulse" />
                        <div className="absolute inset-0 bg-status-critical blur-xl opacity-20"></div>
                    </div>

                    <div className="text-center space-y-2 max-w-md">
                        <h1 className="text-3xl font-bold tracking-tight text-white">System Critical Error</h1>
                        <p className="text-brand-400">
                            The application has encountered an unexpected state and cannot continue.
                            Diagnostics have been logged.
                        </p>
                    </div>

                    <div className="p-4 bg-black/40 rounded border border-white/10 w-full max-w-lg font-mono text-xs text-status-critical overflow-auto max-h-32">
                        {this.state.error?.message}
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        className="px-8 py-3 bg-brand-800 hover:bg-brand-700 text-white rounded border border-white/10 transition-all uppercase text-sm tracking-widest hover:border-status-active/50 shadow-lg"
                    >
                        Reinitialize System
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
