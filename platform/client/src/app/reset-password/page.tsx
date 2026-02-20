'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            setError('Invalid or missing reset token.');
        }
    }, [token]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        if (!token) {
            setError('Invalid or missing reset token.');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, new_password: password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || 'Failed to reset password.');
            }

            setIsSuccess(true);
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[var(--accent)] mb-4">
                        <Mail className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Email Engine</h1>
                </div>

                <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-8">
                    {isSuccess ? (
                        <div className="text-center">
                            <CheckCircle2 className="h-12 w-12 text-[var(--success)] mx-auto mb-4 animate-fadeIn" />
                            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Password Reset Successful</h2>
                            <p className="text-sm text-[var(--text-muted)] mb-6">
                                Your password has been successfully updated. Redirecting to login...
                            </p>
                            <Link href="/login" className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:underline">
                                Click here if not redirected
                            </Link>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-1">Set a new password</h2>
                            <p className="text-sm text-[var(--text-muted)] mb-6">
                                Please enter your new password below.
                            </p>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                                        New password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                        minLength={8}
                                        placeholder="Min 8 characters"
                                        className="w-full h-10 px-3 rounded-[var(--radius)] bg-[var(--bg-primary)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                                        Confirm new password
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        required
                                        minLength={8}
                                        placeholder="Min 8 characters"
                                        className="w-full h-10 px-3 rounded-[var(--radius)] bg-[var(--bg-primary)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                                    />
                                </div>
                                {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
                                <button
                                    type="submit"
                                    disabled={isLoading || !token}
                                    className="w-full h-10 rounded-[var(--radius)] font-medium text-sm bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <><span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Resetting...</>
                                    ) : 'Reset password'}
                                </button>
                            </form>
                            <div className="mt-6 text-center">
                                <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                                    <ArrowLeft className="h-4 w-4" />Back to login
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
