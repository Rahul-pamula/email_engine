'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Mail, ArrowRight, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Invalid or missing verification link.');
            return;
        }

        const verifyEmail = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email?token=${token}`, {
                    method: 'GET',
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.detail || 'Verification failed');
                }

                setStatus('success');
                setMessage(data.message || 'Email verified successfully!');
            } catch (err: any) {
                setStatus('error');
                setMessage(err.message || 'Something went wrong. Please request a new verification link.');
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[var(--accent)] mb-4">
                        <Mail className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Email Engine</h1>
                </div>

                <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-8 text-center">
                    {status === 'loading' && (
                        <>
                            <Loader2 className="h-12 w-12 text-[var(--accent)] mx-auto mb-4 animate-spin" />
                            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Verifying...</h2>
                            <p className="text-sm text-[var(--text-muted)]">Please wait while we verify your email address.</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <CheckCircle2 className="h-12 w-12 text-[var(--success)] mx-auto mb-4 animate-fadeIn" />
                            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Email Verified</h2>
                            <p className="text-sm text-[var(--text-muted)] mb-6">{message}</p>
                            <Link href="/login" className="w-full h-10 rounded-[var(--radius)] font-medium text-sm bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors flex items-center justify-center gap-2">
                                Go to Login <ArrowRight className="h-4 w-4" />
                            </Link>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <XCircle className="h-12 w-12 text-[var(--danger)] mx-auto mb-4" />
                            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Verification Failed</h2>
                            <p className="text-sm text-[var(--text-muted)] mb-6">{message}</p>
                            <Link href="/login" className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:underline">
                                Back to login
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
