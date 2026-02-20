'use client';

import { ReactNode } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface OnboardingLayoutProps {
    children: ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
    const { logout } = useAuth();

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f8fafc', // matches the page background
            position: 'relative',
        }}>
            <button
                onClick={logout}
                style={{
                    position: 'absolute',
                    top: '24px',
                    right: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    color: '#64748b',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    zIndex: 50,
                }}
            >
                <LogOut size={16} />
                Sign Out
            </button>
            {children}
        </div>
    );
}
