'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const colors = {
        bgPrimary: '#0F172A',
        bgSecondary: '#1E293B',
        textPrimary: '#F1F5F9',
        textSecondary: '#94A3B8',
        accentBlue: '#3B82F6',
        accentPurple: '#8B5CF6',
        borderSubtle: '#334155',
        success: '#10B981',
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            // Always show success message (security - prevents user enumeration)
            setMessage('If the email exists, a password reset link has been sent.');
        } catch (err) {
            // Always show success message even on error (security)
            setMessage('If the email exists, a password reset link has been sent.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${colors.bgPrimary} 0%, ${colors.bgSecondary} 100%)`,
            padding: '20px'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '440px',
                background: colors.bgSecondary,
                borderRadius: '12px',
                padding: '40px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                border: `1px solid ${colors.borderSubtle}`
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: 700,
                        background: `linear-gradient(135deg, ${colors.accentBlue}, ${colors.accentPurple})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '8px'
                    }}>
                        Forgot Password?
                    </h1>
                    <p style={{ fontSize: '14px', color: colors.textSecondary }}>
                        Enter your email and we'll send you a reset link
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: colors.textPrimary, marginBottom: '6px' }}>
                            Email Address
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail style={{
                                position: 'absolute',
                                left: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '16px',
                                height: '16px',
                                color: colors.textSecondary
                            }} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                style={{
                                    width: '100%',
                                    padding: '10px 12px 10px 40px',
                                    borderRadius: '6px',
                                    border: `1px solid ${colors.borderSubtle}`,
                                    fontSize: '14px',
                                    color: colors.textPrimary,
                                    background: colors.bgPrimary,
                                    outline: 'none',
                                }}
                            />
                        </div>
                    </div>

                    {/* Success Message */}
                    {message && (
                        <div style={{
                            padding: '12px',
                            borderRadius: '6px',
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: `1px solid ${colors.success}`,
                            marginBottom: '20px'
                        }}>
                            <p style={{ fontSize: '14px', color: colors.success, margin: 0 }}>
                                {message}
                            </p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '6px',
                            border: 'none',
                            background: `linear-gradient(135deg, ${colors.accentBlue}, ${colors.accentPurple})`,
                            color: colors.textPrimary,
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.6 : 1,
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link →'}
                    </button>
                </form>

                {/* Back to Login */}
                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                    <Link
                        href="/login"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '14px',
                            color: colors.textSecondary,
                            textDecoration: 'none',
                            transition: 'color 0.2s ease',
                        }}
                    >
                        <ArrowLeft style={{ width: '14px', height: '14px' }} />
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
}
