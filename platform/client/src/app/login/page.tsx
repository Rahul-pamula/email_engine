'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            setIsSubmitting(false);
            return;
        }

        try {
            await login(email, password);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Invalid credentials');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[var(--bg-primary)]">
            {/* Left Panel - Aesthetic Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[var(--bg-secondary)] items-center justify-center overflow-hidden border-r border-[var(--border)]">
                {/* Decorative Gradients */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--accent)] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-blue-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-4000"></div>

                <div className="relative z-10 w-full max-w-lg px-8 text-center">
                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-[var(--accent)] mb-8 shadow-2xl shadow-blue-500/20 transform transition-transform hover:scale-105">
                        <Mail className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] mb-6">
                        The Ultimate <br /> Email Engine
                    </h1>
                    <p className="text-lg text-[var(--text-muted)] leading-relaxed mb-12">
                        Deliver millions of emails, analyze campaigns in real-time, and scale your audience with enterprise-grade infrastructure.
                    </p>

                    {/* Testimonial / Social Proof */}
                    <div className="p-6 bg-[var(--bg-card)]/50 backdrop-blur-sm border border-[var(--border)] rounded-2xl text-left shadow-xl hidden md:block">
                        <div className="flex items-center gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map(i => (
                                <svg key={i} className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <p className="text-[var(--text-primary)] text-sm mb-4 font-medium italic">
                            &quot;Since switching to Email Engine, our delivery rates hit 99% and we scaled our campaigns effortlessly.&quot;
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">JS</div>
                            <div>
                                <h4 className="text-sm font-semibold text-[var(--text-primary)]">Jane Smith</h4>
                                <p className="text-xs text-[var(--text-muted)]">CMO at TechFlow</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
                <div className="w-full max-w-md space-y-8 relative z-10">

                    <div className="text-center lg:text-left">
                        <div className="lg:hidden inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[var(--accent)] mb-6 shadow-lg shadow-blue-500/20">
                            <Mail className="h-6 w-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] mb-2">
                            Welcome back
                        </h2>
                        <p className="text-[var(--text-muted)]">
                            Sign in to your account to continue
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* Social Login Buttons */}
                        <div className="grid grid-cols-2 gap-4">
                            <a href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google/login`} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors group">
                                <svg className="h-5 w-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google
                            </a>
                            <a href={`${process.env.NEXT_PUBLIC_API_URL}/auth/github/login`} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors group">
                                <svg className="h-5 w-5 text-gray-900 dark:text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                                GitHub
                            </a>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-[var(--border)]"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[var(--bg-primary)] px-2 text-[var(--text-muted)] font-medium">Or continue with email</span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-4 bg-[var(--danger)]/10 border border-[var(--danger)]/20 rounded-xl text-sm text-[var(--danger)] flex items-start gap-3 animate-fadeIn">
                                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
                                        placeholder="you@company.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-sm font-medium text-[var(--text-primary)]">
                                        Password
                                    </label>
                                    <Link href="/forgot-password" className="text-sm font-medium text-[var(--accent)] hover:text-blue-400 transition-colors">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            isLoading={isSubmitting}
                            className="w-full mt-2"
                            size="lg"
                        >
                            Sign in <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>

                    <p className="text-center text-sm text-[var(--text-muted)]">
                        Don't have an account?{' '}
                        <Link href="/signup" className="font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
                            Sign up for free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
