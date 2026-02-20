import { ReactNode } from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    showHome?: boolean;
}

function Breadcrumb({ items, showHome = false }: BreadcrumbProps) {
    const allItems = showHome
        ? [{ label: 'Home', href: '/dashboard' }, ...items]
        : items;

    return (
        <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1 flex-wrap">
                {showHome && (
                    <li className="flex items-center gap-1">
                        <a
                            href="/dashboard"
                            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                            aria-label="Home"
                        >
                            <Home className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                    </li>
                )}
                {allItems.map((item, index) => {
                    const isLast = index === allItems.length - 1;
                    const isFirst = index === 0;

                    return (
                        <li key={index} className="flex items-center gap-1">
                            {(!isFirst || showHome) && (
                                <ChevronRight
                                    className="h-3.5 w-3.5 text-[var(--border)] flex-shrink-0"
                                    aria-hidden="true"
                                />
                            )}
                            {isLast || !item.href ? (
                                <span
                                    className={`text-xs font-medium ${isLast
                                            ? 'text-[var(--text-primary)]'
                                            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer'
                                        }`}
                                    aria-current={isLast ? 'page' : undefined}
                                >
                                    {item.label}
                                </span>
                            ) : (
                                <a
                                    href={item.href}
                                    className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                                >
                                    {item.label}
                                </a>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

export { Breadcrumb };
export type { BreadcrumbItem };
