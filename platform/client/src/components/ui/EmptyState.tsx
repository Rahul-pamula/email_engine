import { ReactNode } from 'react';

interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;        // e.g. <Button>Import Contacts</Button>
    className?: string;
}

function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
    return (
        <div
            className={`
                flex flex-col items-center justify-center text-center
                py-16 px-6 rounded-[var(--radius-lg)]
                border border-dashed border-[var(--border)]
                bg-[var(--bg-primary)]
                ${className}
            `}
            role="status"
            aria-label={title}
        >
            {icon && (
                <div className="text-[var(--text-muted)] mb-4 opacity-60" aria-hidden="true">
                    {icon}
                </div>
            )}
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                {title}
            </h3>
            {description && (
                <p className="text-sm text-[var(--text-muted)] max-w-sm mb-5">
                    {description}
                </p>
            )}
            {action && (
                <div className="mt-2">{action}</div>
            )}
        </div>
    );
}

export { EmptyState };
