'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

type ToastVariant = 'success' | 'warning' | 'danger' | 'info';

interface Toast {
    id: string;
    message: string;
    variant: ToastVariant;
    duration?: number;
}

interface ToastContextValue {
    toast: (message: string, variant?: ToastVariant, duration?: number) => void;
    success: (message: string) => void;
    warning: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const icons: Record<ToastVariant, typeof CheckCircle2> = {
    success: CheckCircle2,
    warning: AlertTriangle,
    danger: XCircle,
    info: Info,
};

const variantStyles: Record<ToastVariant, string> = {
    success: 'border-l-[var(--success)] bg-[var(--success-bg)] text-[var(--success)]',
    warning: 'border-l-[var(--warning)] bg-[var(--warning-bg)] text-[var(--warning)]',
    danger: 'border-l-[var(--danger)] bg-[var(--danger-bg)] text-[var(--danger)]',
    info: 'border-l-[var(--info)] bg-[var(--info-bg)] text-[var(--info)]',
};

function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const dismiss = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const toast = useCallback((message: string, variant: ToastVariant = 'info', duration = 4000) => {
        const id = `${Date.now()}-${Math.random()}`;
        setToasts(prev => [...prev, { id, message, variant, duration }]);
        if (duration > 0) {
            setTimeout(() => dismiss(id), duration);
        }
    }, [dismiss]);

    const success = useCallback((msg: string) => toast(msg, 'success'), [toast]);
    const warning = useCallback((msg: string) => toast(msg, 'warning'), [toast]);
    const error = useCallback((msg: string) => toast(msg, 'danger'), [toast]);
    const info = useCallback((msg: string) => toast(msg, 'info'), [toast]);

    return (
        <ToastContext.Provider value={{ toast, success, warning, error, info }}>
            {children}

            {/* Toast container — fixed bottom-right */}
            <div
                aria-live="polite"
                aria-atomic="false"
                className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
            >
                {toasts.map(t => {
                    const Icon = icons[t.variant];
                    return (
                        <div
                            key={t.id}
                            role="alert"
                            className={`
                                flex items-start gap-3 min-w-[280px] max-w-sm
                                bg-[var(--bg-card)] border border-[var(--border)]
                                border-l-4 ${variantStyles[t.variant]}
                                rounded-[var(--radius)] shadow-2xl px-4 py-3
                                animate-fade-in pointer-events-auto
                            `}
                        >
                            <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                            <p className="flex-1 text-sm text-[var(--text-primary)] leading-snug">
                                {t.message}
                            </p>
                            <button
                                onClick={() => dismiss(t.id)}
                                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors flex-shrink-0"
                                aria-label="Dismiss notification"
                            >
                                <X className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}

function useToast(): ToastContextValue {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
    return ctx;
}

export { ToastProvider, useToast };
export type { ToastVariant };
