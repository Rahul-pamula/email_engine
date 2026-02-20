'use client';

import Link from 'next/link';
import { Activity, Mail, Settings, ArrowRight, Zap } from 'lucide-react';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)] p-8 lg:p-12">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="mb-12 animate-slide-up stagger-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-[var(--accent-glow)] border border-[var(--accent)]/30 text-[var(--accent)] text-xs font-semibold uppercase tracking-wider">
                        <Zap className="w-3.5 h-3.5" /> Workspace Active
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-[var(--text-primary)] tracking-tight mb-4">
                        Welcome to <span className="text-gradient">Email Engine</span>
                    </h1>
                    <p className="text-lg text-[var(--text-muted)] max-w-2xl leading-relaxed">
                        Your command center for automated communications. Connect your data sources, design beautiful templates, and launch triggered campaigns.
                    </p>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Card 1 - Events */}
                    <div className="glass-panel p-8 flex flex-col hover-lift animate-slide-up stagger-2 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Activity className="w-32 h-32" />
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center mb-6 border border-[var(--accent)]/20 shadow-[var(--shadow-glow)]">
                            <Activity className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
                            Event Stream
                        </h2>
                        <p className="text-[var(--text-muted)] mb-8 flex-grow leading-relaxed">
                            Monitor incoming data from your applications or APIs in real-time. Use these events to trigger workflows.
                        </p>
                        <Link href="/events" className="w-full">
                            <button className="w-full py-3 px-4 bg-[var(--bg-hover)] hover:bg-[var(--border)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg font-medium transition-colors flex items-center justify-center gap-2 group-hover:border-[var(--accent)]/50 group-hover:text-[var(--accent)]">
                                View Event Logs <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>
                        </Link>
                    </div>

                    {/* Card 2 - Campaigns */}
                    <div className="glass-panel p-8 flex flex-col hover-lift animate-slide-up stagger-3 group relative overflow-hidden border-[var(--accent)]/30">
                        {/* Glow effect for the primary action card */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--accent)] rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity"></div>

                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-white flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                            <Mail className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3 relative z-10">
                            Automation Campaigns
                        </h2>
                        <p className="text-[var(--text-muted)] mb-8 flex-grow leading-relaxed relative z-10">
                            Design automated email journeys that trigger instantly when specific user events are received.
                        </p>
                        <Link href="/campaigns" className="w-full relative z-10">
                            <button className="btn-premium w-full group">
                                Create Campaign <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>
                        </Link>
                    </div>

                    {/* Card 3 - Settings */}
                    <div className="glass-panel p-8 flex flex-col hover-lift animate-slide-up stagger-4 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Settings className="w-32 h-32" />
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-[var(--bg-hover)] text-[var(--text-secondary)] flex items-center justify-center mb-6 border border-[var(--border)]">
                            <Settings className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
                            System Settings
                        </h2>
                        <p className="text-[var(--text-muted)] mb-8 flex-grow leading-relaxed">
                            Configure integration endpoints, manage API keys, and set up your sending domains.
                        </p>
                        <Link href="/settings" className="w-full">
                            <button className="w-full py-3 px-4 bg-[var(--bg-hover)] hover:bg-[var(--border)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg font-medium transition-colors flex items-center justify-center gap-2 group-hover:border-[var(--text-primary)]/50">
                                Open Settings <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>
                        </Link>
                    </div>

                </div>

                {/* Quick Stats Summary Section (Placeholder for future) */}
                <div className="mt-12 glass-panel p-6 animate-slide-up stagger-4 border-t-0 rounded-b-lg opacity-80 backdrop-blur-md">
                    <div className="flex flex-col sm:flex-row gap-6 justify-between items-center text-sm">
                        <div className="flex items-center gap-2 text-[var(--text-muted)]">
                            <div className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse"></div>
                            System Operational
                        </div>
                        <div className="flex gap-6">
                            <span className="text-[var(--text-muted)]">Events Today: <span className="text-[var(--text-primary)] font-medium">0</span></span>
                            <span className="text-[var(--text-muted)]">Emails Sent: <span className="text-[var(--text-primary)] font-medium">0</span></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
