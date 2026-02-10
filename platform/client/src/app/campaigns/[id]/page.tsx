"use client";

import Link from "next/link";
import {
    ArrowLeft,
    Copy,
    Pause,
    Play,
    Settings,
    MoreHorizontal,
    Mail,
    Users,
    MousePointer,
    AlertTriangle,
    RotateCcw
} from "lucide-react";

/* ============================================================
   CAMPAIGN DETAILS - Light Mode
   ============================================================ */

// Light Mode Colors
const colors = {
    bgPrimary: '#ffffff',
    bgSecondary: '#f8fafc',
    bgElevated: '#f1f5f9',
    borderSubtle: '#e2e8f0',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    accentBlue: '#2563eb',
    statusSuccess: '#16a34a',
    statusWarning: '#ca8a04',
    statusError: '#dc2626',
};

export default function CampaignDetailsPage({ params }: { params: { id: string } }) {
    const campaign = {
        id: params.id,
        name: "March Newsletter",
        status: "Sent",
        subject: "March Updates: New features arrived",
        sender: "John <john@emailengine.com>",
        list: "All Subscribers (12,450)",
        sentAt: "Mar 15, 2026 at 10:00 AM"
    };

    const metrics = [
        { label: "Sent", value: 12450, icon: Mail },
        { label: "Delivered", value: 12380, sub: "99.4%", icon: Users },
        { label: "Opened", value: 5230, sub: "42.3%", icon: Users },
        { label: "Clicked", value: 1085, sub: "8.7%", icon: MousePointer },
        { label: "Bounced", value: 70, sub: "0.6%", icon: AlertTriangle },
        { label: "Complaints", value: 2, sub: "0.01%", icon: AlertTriangle },
    ];

    return (
        <>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <Link href="/campaigns" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '14px',
                    color: colors.textMuted,
                    textDecoration: 'none',
                    marginBottom: '16px'
                }}>
                    <ArrowLeft style={{ width: '16px', height: '16px' }} />
                    Back to Campaigns
                </Link>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <h1 style={{ fontSize: '24px', fontWeight: 600, color: colors.textPrimary, margin: 0 }}>
                                {campaign.name}
                            </h1>
                            <span style={{
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: 500,
                                backgroundColor: `${colors.statusSuccess}15`,
                                color: colors.statusSuccess,
                            }}>
                                {campaign.status}
                            </span>
                        </div>
                        <p style={{ fontSize: '14px', color: colors.textSecondary, margin: 0 }}>
                            Sent on {campaign.sentAt}
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button style={{
                            padding: '8px 12px',
                            backgroundColor: colors.bgPrimary,
                            border: `1px solid ${colors.borderSubtle}`,
                            borderRadius: '6px',
                            color: colors.textSecondary,
                            fontSize: '14px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}>
                            <Copy style={{ width: '16px', height: '16px' }} /> Duplicate
                        </button>
                        <button style={{
                            padding: '8px 12px',
                            backgroundColor: colors.accentBlue,
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 500,
                            cursor: 'pointer',
                        }}>
                            View Preview
                        </button>
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px', marginBottom: '32px' }}>
                {metrics.map((m) => (
                    <div key={m.label} style={{
                        padding: '16px',
                        backgroundColor: colors.bgPrimary,
                        border: `1px solid ${colors.borderSubtle}`,
                        borderRadius: '8px',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', color: colors.textMuted }}>{m.label}</span>
                            <m.icon style={{ width: '14px', height: '14px', color: colors.textMuted }} />
                        </div>
                        <div style={{ fontSize: '20px', fontWeight: 600, color: colors.textPrimary }}>{m.value.toLocaleString()}</div>
                        {m.sub && <div style={{ fontSize: '12px', color: colors.textSecondary, marginTop: '2px' }}>{m.sub}</div>}
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>

                {/* Activity Timeline Placeholder */}
                <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.textPrimary, marginBottom: '16px' }}>Activity Timeline</h3>
                    <div style={{
                        backgroundColor: colors.bgPrimary,
                        border: `1px solid ${colors.borderSubtle}`,
                        borderRadius: '8px',
                        padding: '24px',
                        minHeight: '200px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colors.textMuted,
                    }}>
                        timeline_chart_placeholder
                    </div>

                    {/* Failed Emails Section */}
                    <div style={{ marginTop: '32px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.textPrimary, marginBottom: '16px' }}>Failed Deliveries</h3>

                        <div style={{
                            backgroundColor: colors.bgPrimary,
                            border: `1px solid ${colors.borderSubtle}`,
                            borderRadius: '8px',
                            overflow: 'hidden',
                        }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: colors.bgSecondary }}>
                                        <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', color: colors.textMuted }}>Email</th>
                                        <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', color: colors.textMuted }}>Reason</th>
                                        <th style={{ padding: '12px 20px', textAlign: 'right', fontSize: '12px', color: colors.textMuted }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ borderBottom: `1px solid ${colors.borderSubtle}` }}>
                                        <td style={{ padding: '12px 20px', fontSize: '14px', color: colors.textPrimary }}>alex@bad-domain.com</td>
                                        <td style={{ padding: '12px 20px', fontSize: '14px', color: colors.textSecondary }}>Hard Bounce</td>
                                        <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                                            <button style={{ padding: '4px', color: colors.textSecondary, background: 'none', border: 'none', cursor: 'pointer' }}>
                                                <MoreHorizontal style={{ width: '16px', height: '16px' }} />
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '12px 20px', fontSize: '14px', color: colors.textPrimary }}>sarah@full-mailbox.com</td>
                                        <td style={{ padding: '12px 20px', fontSize: '14px', color: colors.textSecondary }}>Soft Bounce</td>
                                        <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                                            <button style={{ padding: '4px', color: colors.accentBlue, background: 'none', border: 'none', cursor: 'pointer' }} title="Retry">
                                                <RotateCcw style={{ width: '14px', height: '14px' }} />
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Campaign Info Card */}
                <div>
                    <div style={{
                        backgroundColor: colors.bgPrimary,
                        border: `1px solid ${colors.borderSubtle}`,
                        borderRadius: '8px',
                        padding: '24px',
                    }}>
                        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: colors.textPrimary }}>Details</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ fontSize: '12px', color: colors.textMuted, display: 'block', marginBottom: '4px' }}>Subject Line</label>
                                <div style={{ fontSize: '14px', color: colors.textPrimary }}>{campaign.subject}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', color: colors.textMuted, display: 'block', marginBottom: '4px' }}>From</label>
                                <div style={{ fontSize: '14px', color: colors.textPrimary }}>{campaign.sender}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', color: colors.textMuted, display: 'block', marginBottom: '4px' }}>List</label>
                                <div style={{ fontSize: '14px', color: colors.textPrimary }}>{campaign.list}</div>
                            </div>
                        </div>

                        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: `1px solid ${colors.borderSubtle}` }}>
                            <button style={{
                                width: '100%',
                                padding: '8px',
                                backgroundColor: 'transparent',
                                border: `1px solid ${colors.borderSubtle}`,
                                borderRadius: '6px',
                                color: colors.textSecondary,
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}>
                                <Settings style={{ width: '14px', height: '14px' }} /> Configure
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}
