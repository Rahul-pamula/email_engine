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
            // Prevent double-call in Strict Mode or if already active
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

                // Update user status in context & localStorage
                await refreshUserStatus();

                // Update cookie for middleware
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
        // Force a hard reload to ensure middleware sees the new cookie
        window.location.href = '/dashboard';
    };

    if (status === 'loading') {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8fafc',
            }}>
                <div style={{ textAlign: 'center' }}>
                    <Loader2 style={{ width: '48px', height: '48px', color: '#2563eb', animation: 'spin 1s linear infinite' }} />
                    <p style={{ marginTop: '16px', color: '#64748b' }}>Finalizing setup...</p>
                    <style jsx>{`
                        @keyframes spin {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8fafc',
            }}>
                <div style={{ textAlign: 'center', maxWidth: '400px', padding: '24px' }}>
                    <div style={{ color: '#dc2626', marginBottom: '16px' }}>⚠️</div>
                    <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Setup Failed</h2>
                    <p style={{ color: '#64748b', marginBottom: '24px' }}>
                        We couldn't activate your workspace. Please try again or contact support.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            padding: '24px',
        }}>
            <div style={{
                width: '100%',
                maxWidth: '600px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '64px 48px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
            }}>
                {/* Success Icon */}
                <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#dcfce7',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 32px auto',
                }}>
                    <CheckCircle2 style={{ width: '48px', height: '48px', color: '#16a34a' }} />
                </div>

                {/* Title */}
                <h1 style={{
                    fontSize: '36px',
                    fontWeight: 700,
                    color: '#0f172a',
                    marginBottom: '16px',
                }}>
                    You're all set 🎉
                </h1>

                {/* Description */}
                <p style={{
                    fontSize: '18px',
                    color: '#64748b',
                    lineHeight: '1.6',
                    marginBottom: '40px',
                }}>
                    Your workspace is ready. You can now start sending events and building automation.
                </p>

                {/* Go to Dashboard Button */}
                <button
                    onClick={handleGoToDashboard}
                    disabled={submitting}
                    style={{
                        width: '100%',
                        maxWidth: '300px',
                        padding: '16px 32px',
                        fontSize: '18px',
                        fontWeight: 600,
                        color: '#ffffff',
                        backgroundColor: '#2563eb',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: submitting ? 'not-allowed' : 'pointer',
                        opacity: submitting ? 0.6 : 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        marginBottom: '24px',
                    }}
                >
                    {submitting ? 'Loading...' : 'Go to Dashboard'}
                    {!submitting && <ArrowRight style={{ width: '20px', height: '20px' }} />}
                </button>

                {/* Secondary Text */}
                <p style={{
                    fontSize: '14px',
                    color: '#94a3b8',
                    margin: 0,
                }}>
                    You can update these settings anytime later.
                </p>
            </div>
        </div>
    );
}
