'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
    User, Building2, CreditCard, Shield, Key, Globe,
    ChevronRight, Zap, Settings, Users, MailCheck, UserPlus
} from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000';

const CARDS = [
    {
        href: '/settings/profile',
        icon: User,
        title: 'Profile',
        description: 'Update your name, timezone, and personal preferences.',
        color: 'blue',
    },
    {
        href: '/settings/organization',
        icon: Building2,
        title: 'Organization',
        description: 'Set your company name and CAN-SPAM physical address.',
        color: 'violet',
    },
    {
        href: '/settings/billing',
        icon: CreditCard,
        title: 'Billing & Plan',
        description: 'View your current plan, usage, and upgrade options.',
        color: 'emerald',
        badge: true,
    },
    {
        href: '/settings/compliance',
        icon: Shield,
        title: 'Compliance & GDPR',
        description: 'Export your data, erase contacts, and manage consent.',
        color: 'amber',
    },
    {
        href: '/settings/api-keys',
        icon: Key,
        title: 'API Keys',
        description: 'Generate and revoke API keys for developer integrations.',
        color: 'rose',
    },
    {
        href: '/settings/domain',
        icon: Globe,
        title: 'Sending Domain',
        description: 'Add a custom sending domain with SPF/DKIM/DMARC records.',
        color: 'cyan',
    },
    {
        href: '/settings/team',
        icon: Users,
        title: 'Team Members',
        description: 'Invite colleagues, manage roles, and control workspace access.',
        color: 'indigo',
    },
    {
        href: '/settings/team/requests',
        icon: UserPlus,
        title: 'Access Requests',
        description: 'Review and govern Just-in-Time workspace join requests.',
        color: 'amber',
    },
    {
        href: '/settings/senders',
        icon: MailCheck,
        title: 'Sender Identities',
        description: 'Verify and manage authorized email prefixes to prevent domain spoofing.',
        color: 'blue',
    },
];

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    blue: { bg: 'rgba(59,130,246,0.1)', text: '#3B82F6', border: 'rgba(59,130,246,0.25)', glow: 'rgba(59,130,246,0.15)' },
    violet: { bg: 'rgba(139,92,246,0.1)', text: '#8B5CF6', border: 'rgba(139,92,246,0.25)', glow: 'rgba(139,92,246,0.15)' },
    emerald: { bg: 'rgba(16,185,129,0.1)', text: '#10B981', border: 'rgba(16,185,129,0.25)', glow: 'rgba(16,185,129,0.15)' },
    amber: { bg: 'rgba(245,158,11,0.1)', text: '#F59E0B', border: 'rgba(245,158,11,0.25)', glow: 'rgba(245,158,11,0.15)' },
    rose: { bg: 'rgba(239,68,68,0.1)', text: '#EF4444', border: 'rgba(239,68,68,0.25)', glow: 'rgba(239,68,68,0.15)' },
    cyan: { bg: 'rgba(6,182,212,0.1)', text: '#06B6D4', border: 'rgba(6,182,212,0.25)', glow: 'rgba(6,182,212,0.15)' },
    indigo: { bg: 'rgba(99,102,241,0.1)', text: '#818CF8', border: 'rgba(99,102,241,0.25)', glow: 'rgba(99,102,241,0.15)' },
};

export default function SettingsPage() {
    const { token } = useAuth();
    const [plan, setPlan] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;
        fetch(`${API_BASE}/billing/plan`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.ok ? r.json() : null)
            .then(d => { if (d) setPlan(d.plan_details?.name ?? null); })
            .catch(() => { });
    }, [token]);

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] p-8 lg:p-12">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="mb-10 animate-slide-up stagger-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-[var(--accent-glow)] border border-[var(--accent)]/30 text-[var(--accent)] text-xs font-semibold uppercase tracking-wider">
                        <Settings className="w-3.5 h-3.5" /> Account Settings
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] tracking-tight mb-2">
                        Manage Your <span className="text-gradient">Workspace</span>
                    </h1>
                    <p className="text-[var(--text-muted)] text-base">
                        Configure your profile, organization, billing, and developer tools.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {CARDS.map((card, i) => {
                        const Icon = card.icon;
                        const c = COLOR_MAP[card.color];
                        return (
                            <Link key={card.href} href={card.href} className="group block">
                                <div
                                    className="glass-panel hover-lift p-6 flex flex-col h-full cursor-pointer animate-slide-up"
                                    style={{ animationDelay: `${0.05 * i + 0.1}s`, opacity: 0 }}
                                >
                                    {/* Icon */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div
                                            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                                            style={{ background: c.bg, border: `1px solid ${c.border}` }}
                                        >
                                            <Icon className="w-5 h-5" style={{ color: c.text }} />
                                        </div>
                                        {card.badge && plan && (
                                            <span
                                                className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                                                style={{
                                                    background: plan === 'Pro' ? 'rgba(59,130,246,0.15)' : 'rgba(161,161,170,0.15)',
                                                    color: plan === 'Pro' ? '#3B82F6' : '#A1A1AA',
                                                    border: `1px solid ${plan === 'Pro' ? 'rgba(59,130,246,0.3)' : 'rgba(161,161,170,0.2)'}`,
                                                }}
                                            >
                                                {plan}
                                            </span>
                                        )}
                                    </div>

                                    {/* Text */}
                                    <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1.5">{card.title}</h3>
                                    <p className="text-sm text-[var(--text-muted)] flex-1 leading-relaxed">{card.description}</p>

                                    {/* Arrow */}
                                    <div
                                        className="mt-4 flex items-center gap-1.5 text-xs font-medium transition-colors"
                                        style={{ color: c.text }}
                                    >
                                        <span>Manage</span>
                                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Footer note */}
                <p className="mt-10 text-center text-xs text-[var(--text-muted)]">
                    <Zap className="inline w-3.5 h-3.5 mr-1 text-[var(--accent)]" />
                    Changes are saved instantly. No need to click a global "Save" button.
                </p>

            </div>
        </div>
    );
}
