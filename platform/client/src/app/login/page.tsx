'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Light Mode Colors
const colors = {
    bgPrimary: '#ffffff',
    bgSecondary: '#f8fafc',
    borderSubtle: '#e2e8f0',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    accentBlue: '#2563eb',
    accentBlueHover: '#1d4ed8',
};

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Use sessionStorage to persist error across component remounts
    const [error, setErrorState] = useState('');

    const setError = (msg: string) => {
        if (msg) {
            sessionStorage.setItem('login_error', msg);
        } else {
            sessionStorage.removeItem('login_error');
        }
        setErrorState(msg);
    };

    //Debug: Track component lifecycle
    useEffect(() => {
        console.log('LOGIN COMPONENT MOUNTED');
        // Restore error from sessionStorage on mount
        const savedError = sessionStorage.getItem('login_error');
        if (savedError) {
            console.log('RESTORING ERROR FROM SESSIONSTORAGE:', savedError);
            setErrorState(savedError);
        }
        return () => {
            console.log('LOGIN COMPONENT UNMOUNTING!');
        };
    }, []);

    // Debug: Log whenever error state changes
    useEffect(() => {
        console.log('ERROR STATE CHANGED:', error);
        if (error) {
            console.log('ERROR IS TRUTHY, SHOULD DISPLAY:', error);
        }
    }, [error]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!email || !password) {
            setError('Please fill in all fields');
            setIsSubmitting(false);
            return;
        }

        try {
            setError(''); // Clear any previous errors
            await login(email, password);
            // Login successful - error is already cleared above
        } catch (err: any) {
            console.log('Login error caught:', err);
            console.log('Error message:', err.message);
            const errorMessage = err.message || 'Invalid credentials';
            console.log('Setting error to:', errorMessage);
            setError(errorMessage);
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.bgSecondary,
            fontFamily: 'Inter, sans-serif',
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                padding: '40px',
                backgroundColor: colors.bgPrimary,
                borderRadius: '12px',
                border: `1px solid ${colors.borderSubtle}`,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: colors.accentBlue,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px auto',
                    }}>
                        <Mail style={{ width: '24px', height: '24px', color: 'white' }} />
                    </div>
                    <h1 style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        color: colors.textPrimary,
                        marginBottom: '8px',
                    }}>
                        Welcome Back
                    </h1>
                    <p style={{ fontSize: '14px', color: colors.textSecondary }}>
                        Sign in to your Email Engine account
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {error && (
                        <div style={{
                            padding: '12px',
                            backgroundColor: '#fee2e2',
                            border: '1px solid #fecaca',
                            borderRadius: '6px',
                            color: '#dc2626',
                            fontSize: '14px',
                            textAlign: 'center',
                        }}>
                            {error}
                        </div>
                    )}

                    <div>
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="login-input"
                                placeholder="name@company.com"
                                style={{
                                    width: '100%',
                                    padding: '10px 12px 10px 40px',
                                    borderRadius: '6px',
                                    border: `1px solid ${colors.borderSubtle}`,
                                    fontSize: '14px',
                                    color: colors.textPrimary,
                                    outline: 'none',
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: colors.textPrimary, marginBottom: '6px' }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock style={{
                                position: 'absolute',
                                left: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '16px',
                                height: '16px',
                                color: colors.textSecondary
                            }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="login-input"
                                placeholder="••••••••"
                                style={{
                                    width: '100%',
                                    padding: '10px 12px 10px 40px',
                                    borderRadius: '6px',
                                    border: `1px solid ${colors.borderSubtle}`,
                                    fontSize: '14px',
                                    color: colors.textPrimary,
                                    outline: 'none',
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                            <Link
                                href="/forgot-password"
                                style={{
                                    fontSize: '12px',
                                    color: colors.accentBlue,
                                    textDecoration: 'none',
                                    fontWeight: 500,
                                }}
                            >
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                            padding: '12px',
                            backgroundColor: colors.accentBlue,
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            opacity: isSubmitting ? 0.7 : 1,
                            transition: 'all 200ms ease',
                        }}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                                Signing in...
                            </>
                        ) : (
                            <>
                                Sign In <ArrowRight style={{ width: '16px', height: '16px' }} />
                            </>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                    <p style={{ fontSize: '12px', color: colors.textSecondary }}>
                        Don't have an account? <Link href="/signup" style={{ color: colors.accentBlue, textDecoration: 'none', fontWeight: 500 }}>Sign up</Link>
                    </p>
                </div>

                <style jsx global>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .login-input:focus {
            border-color: ${colors.accentBlue} !important;
            box-shadow: 0 0 0 2px ${colors.accentBlue}20;
          }
        `}</style>
            </div>
        </div>
    );
}
