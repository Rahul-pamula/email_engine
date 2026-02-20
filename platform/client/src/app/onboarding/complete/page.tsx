'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function OnboardingComplete() {
    const router = useRouter();
    const { refreshUserStatus } = useAuth();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        let mounted = true;

        const completeOnboarding = async () => {
            const userDataStr = localStorage.getItem('user_data');
            if (userDataStr) {
                const userData = JSON.parse(userDataStr);
                if (userData.tenant_status === 'active' || userData.tenantStatus === 'active') {
                    if (mounted) setStatus('success');
                    return;
                }
            }

            try {
                const token = localStorage.getItem('auth_token');
                if (!token) return;

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/onboarding/complete`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to complete onboarding');
                }

                await refreshUserStatus();
                document.cookie = `tenant_status=active; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;

                if (mounted) setStatus('success');
            } catch (error) {
                console.error('Error completing onboarding:', error);
                if (mounted) setStatus('error');
            }
        };

        if (status === 'loading') {
            completeOnboarding();
        }

        return () => {
            mounted = false;
        };
    }, [refreshUserStatus, status]);

    const handleGoToDashboard = () => {
        setSubmitting(true);
        window.location.href = '/dashboard';
    };

    if (status === 'loading') {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-[var(--accent)] animate-spin mx-auto" />
                    <p className="mt-4 text-[var(--text-muted)]">Finalizing setup...</p>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)]">
                <div className="text-center max-w-sm p-6">
                    <div className="text-4xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Setup Failed</h2>
                    <p className="text-[var(--text-muted)] mb-6">
                        We couldn&apos;t activate your workspace. Please try again or contact support.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-5 py-2.5 text-sm font-medium border border-[var(--border)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] p-4">
            <div className="w-full max-w-lg rounded-2xl bg-[var(--bg-card)] p-12 shadow-xl border border-[var(--border)] text-center">
                {/* Success Icon */}
                <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--success)]/10">
                    <CheckCircle2 className="w-12 h-12 text-[var(--success)]" />
                </div>

                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
                    You&apos;re all set 🎉
                </h1>

                <p className="text-base text-[var(--text-muted)] leading-relaxed mb-10 max-w-sm mx-auto">
                    Your workspace is ready. You can now start sending events and building automation.
                </p>

                <button
                    onClick={handleGoToDashboard}
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed mb-6"
                >
                    {submitting ? 'Loading...' : 'Go to Dashboard'}
                    {!submitting && <ArrowRight className="w-5 h-5" />}
                </button>

                <p className="text-sm text-[var(--text-muted)]">
                    You can update these settings anytime later.
                </p>
            </div>
        </div>
    );
}
