'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, Building2, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui';

export default function SignupPage() {
    const { signup } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        tenant_name: '',
        first_name: '',
        last_name: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        if (!formData.email || !formData.password || !formData.tenant_name) {
            setError('Please fill in all required fields');
            setIsSubmitting(false);
            return;
        }

        try {
            await signup(
                formData.email,
                formData.password,
                formData.tenant_name,
                formData.first_name,
                formData.last_name
            );
            // The auth context handles the redirect to /onboarding
        } catch (err: any) {
            setError(err.message || 'Error creating account');
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="flex min-h-screen bg-[var(--bg-primary)]">
            {/* Left Panel - Aesthetic Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[var(--bg-secondary)] items-center justify-center overflow-hidden border-r border-[var(--border)]">
                {/* Decorative Gradients */}
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-[var(--accent)] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-purple-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-4000"></div>

                <div className="relative z-10 w-full max-w-lg px-8 text-center mt-[-10%]">
                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-[var(--accent)] mb-8 shadow-2xl shadow-blue-500/20 transform transition-transform hover:scale-105">
                        <Mail className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] mb-6">
                        Scale your outreach <br /> with Email Engine
                    </h1>
                    <p className="text-lg text-[var(--text-muted)] leading-relaxed mb-12">
                        Join thousands of companies orchestrating high-volume email campaigns with enterprise reliability.
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-left">
                        <div className="p-5 bg-[var(--bg-card)]/50 backdrop-blur-sm border border-[var(--border)] rounded-2xl">
                            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-1">99.9%</h3>
                            <p className="text-sm text-[var(--text-muted)]">Delivery Rate across major ISPs</p>
                        </div>
                        <div className="p-5 bg-[var(--bg-card)]/50 backdrop-blur-sm border border-[var(--border)] rounded-2xl">
                            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-1">10M+</h3>
                            <p className="text-sm text-[var(--text-muted)]">Emails processed daily</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Signup Form */}
            <div className="w-full lg:w-1/2 flex justify-center p-6 sm:p-12 lg:p-16 relative overflow-y-auto">
                <div className="w-full max-w-md space-y-8 relative z-10 my-auto">

                    <div className="text-center lg:text-left">
                        <div className="lg:hidden inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[var(--accent)] mb-6 shadow-lg">
                            <Mail className="h-6 w-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] mb-2">
                            Create your account
                        </h2>
                        <p className="text-[var(--text-muted)]">
                            Start your 14-day free trial. No credit card required.
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
                                <span className="bg-[var(--bg-primary)] px-2 text-[var(--text-muted)] font-medium">Or register with email</span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-4 bg-[var(--danger)]/10 border border-[var(--danger)]/20 rounded-xl text-sm text-[var(--danger)] flex items-start gap-3 animate-fadeIn">
                                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">
                                    First Name
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        className="block w-full pl-9 pr-3 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] xl:text-base focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                                        placeholder="Jane"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className="block w-full px-3 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] xl:text-base focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                                    placeholder="Smith"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">
                                Company / Tenant Name <span className="text-[var(--danger)]">*</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Building2 className="h-4 w-4 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    name="tenant_name"
                                    required
                                    value={formData.tenant_name}
                                    onChange={handleChange}
                                    className="block w-full pl-9 pr-3 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] xl:text-base focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                                    placeholder="Acme Corp"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">
                                Work Email <span className="text-[var(--danger)]">*</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full pl-9 pr-3 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] xl:text-base focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                                    placeholder="jane@acme.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">
                                Password <span className="text-[var(--danger)]">*</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    minLength={8}
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full pl-9 pr-3 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] xl:text-base focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                                    placeholder="Min 8 characters"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full mt-2"
                            size="lg"
                            isLoading={isSubmitting}
                        >
                            Create Account <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>

                    <p className="text-center text-sm text-[var(--text-muted)]">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
