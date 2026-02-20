'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            // Always show success — prevents email enumeration
            setIsSubmitted(true);
        } catch {
            setError('Something went wrong. Please try again.');
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
                    {isSubmitted ? (
                        <div className="text-center">
                            <CheckCircle2 className="h-12 w-12 text-[var(--success)] mx-auto mb-4" />
                            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Check your email</h2>
                            <p className="text-sm text-[var(--text-muted)] mb-6">
                                If <strong>{email}</strong> is registered, you&apos;ll receive a reset link shortly. It expires in <strong>1 hour</strong>.
                            </p>
                            <Link href="/login" className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:underline">
                                <ArrowLeft className="h-4 w-4" /> Back to login
                            </Link>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-1">Forgot your password?</h2>
                            <p className="text-sm text-[var(--text-muted)] mb-6">
                                Enter your email and we&apos;ll send you a reset link.
                            </p>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                                        Email address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        autoComplete="email"
                                        placeholder="you@company.com"
                                        className="w-full h-10 px-3 rounded-[var(--radius)] bg-[var(--bg-primary)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                                    />
                                </div>
                                {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
                                <button
                                    type="submit"
                                    disabled={isLoading || !email}
                                    className="w-full h-10 rounded-[var(--radius)] font-medium text-sm bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <><span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
                                    ) : 'Send reset link'}
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
