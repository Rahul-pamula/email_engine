import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    label?: string;   // screen reader label
}

const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-8 w-8',
};

function LoadingSpinner({ size = 'md', className = '', label = 'Loading...' }: LoadingSpinnerProps) {
    return (
        <span role="status" aria-label={label} className={`inline-flex items-center justify-center ${className}`}>
            <Loader2
                className={`animate-spin text-[var(--accent)] ${sizeMap[size]}`}
                aria-hidden="true"
            />
            <span className="sr-only">{label}</span>
        </span>
    );
}

/** Full-page centered loading state */
function PageLoader({ label = 'Loading...' }: { label?: string }) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-3">
                <LoadingSpinner size="lg" />
                <p className="text-sm text-[var(--text-muted)]">{label}</p>
            </div>
        </div>
    );
}

export { LoadingSpinner, PageLoader };
