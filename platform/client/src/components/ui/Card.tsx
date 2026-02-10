import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    noPadding?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className = '', noPadding = false, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`
                    bg-white rounded-xl border border-border shadow-sm
                    ${noPadding ? '' : 'p-6 sm:p-8'}
                    ${className}
                `}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

export { Card };
