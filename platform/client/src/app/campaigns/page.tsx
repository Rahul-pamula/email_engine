"use client";

import Link from "next/link";
import {
    Play,
    Pause,
    MoreHorizontal,
    Plus,
    Search,
    Filter,
    FileText
} from "lucide-react";

/* ============================================================
   CAMPAIGNS - Light Mode
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

const campaigns = [
    { id: "1", name: "March Newsletter", status: "sent", sent: 12450, opens: 5230, clicks: 1200, date: "Mar 15, 2026" },
    { id: "2", name: "Product Launch", status: "sending", sent: 8920, opens: 2100, clicks: 850, date: "Mar 20, 2026" },
    { id: "3", name: "Weekly Digest", status: "scheduled", sent: 0, opens: 0, clicks: 0, date: "Mar 25, 2026" },
    { id: "4", name: "Welcome Series", status: "draft", sent: 0, opens: 0, clicks: 0, date: "Last edited 2h ago" },
    { id: "5", name: "Q1 Report", status: "sent", sent: 5000, opens: 2500, clicks: 100, date: "Jan 10, 2026" },
];

function StatusBadge({ status }: { status: string }) {
    const getColors = (s: string) => {
        switch (s) {
            case 'sent': return { bg: `${colors.statusSuccess}15`, text: colors.statusSuccess };
            case 'sending': return { bg: `${colors.statusWarning}15`, text: colors.statusWarning };
            case 'scheduled': return { bg: `${colors.accentBlue}15`, text: colors.accentBlue };
            default: return { bg: `${colors.textMuted}15`, text: colors.textMuted };
        }
    };
    const { bg, text } = getColors(status);

    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 500,
            backgroundColor: bg,
            color: text,
        }}>
            {status === 'sending' && (
                <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: text,
                    marginRight: '6px',
                    animation: 'pulse 2s infinite',
                }} />
            )}
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

export default function CampaignsPage() {
    return (
        <>
            {/* Page Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px'
            }}>
                <h1 style={{
                    fontSize: '24px',
                    fontWeight: 600,
                    color: colors.textPrimary,
                    margin: 0,
                    letterSpacing: '-0.02em',
                }}>
                    Campaigns
                </h1>

                <Link
                    href="/campaigns/new"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        backgroundColor: colors.accentBlue,
                        border: 'none',
                        borderRadius: '6px',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        textDecoration: 'none',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    }}
                >
                    <Plus style={{ width: '16px', height: '16px' }} />
                    Create Campaign
                </Link>
            </div>

            {/* Toolbar */}
            <div style={{ marginBottom: '24px', display: 'flex', gap: '16px' }}>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '16px',
                        height: '16px',
                        color: colors.textMuted
                    }} />
                    <input
                        type="text"
                        placeholder="Search campaigns..."
                        style={{
                            width: '100%',
                            padding: '10px 12px 10px 36px',
                            backgroundColor: colors.bgPrimary,
                            border: `1px solid ${colors.borderSubtle}`,
                            borderRadius: '6px',
                            fontSize: '14px',
                            color: colors.textPrimary,
                        }}
                    />
                </div>

                <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    backgroundColor: colors.bgPrimary,
                    border: `1px solid ${colors.borderSubtle}`,
                    borderRadius: '6px',
                    color: colors.textSecondary,
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                }}>
                    <Filter style={{ width: '16px', height: '16px' }} />
                    Filter
                </button>
            </div>

            {/* Table */}
            <div style={{
                backgroundColor: colors.bgPrimary,
                border: `1px solid ${colors.borderSubtle}`,
                borderRadius: '8px',
                overflow: 'hidden',
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: colors.bgSecondary, borderBottom: `1px solid ${colors.borderSubtle}` }}>
                            {['Campaign', 'Status', 'Sent', 'Opens', 'Clicks', 'Date', ''].map((h, i) => (
                                <th key={h} style={{
                                    padding: '12px 20px',
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: colors.textMuted,
                                    textAlign: i >= 2 && i < 6 ? 'right' : 'left',
                                }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {campaigns.map((c) => (
                            <tr key={c.id} style={{ borderBottom: `1px solid ${colors.borderSubtle}` }}>
                                <td style={{ padding: '16px 20px' }}>
                                    <Link href={`/campaigns/${c.id}`} style={{
                                        color: colors.textPrimary,
                                        fontWeight: 500,
                                        fontSize: '14px',
                                        textDecoration: 'none',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '2px'
                                    }}>
                                        <span>{c.name}</span>
                                    </Link>
                                </td>
                                <td style={{ padding: '16px 20px' }}>
                                    <StatusBadge status={c.status} />
                                </td>
                                <td style={{ padding: '16px 20px', fontSize: '14px', color: colors.textSecondary, textAlign: 'right', fontFeatureSettings: '"tnum"' }}>
                                    {c.sent > 0 ? c.sent.toLocaleString() : '—'}
                                </td>
                                <td style={{ padding: '16px 20px', fontSize: '14px', color: colors.textSecondary, textAlign: 'right', fontFeatureSettings: '"tnum"' }}>
                                    {c.opens > 0 ? c.opens.toLocaleString() : '—'}
                                </td>
                                <td style={{ padding: '16px 20px', fontSize: '14px', color: colors.textSecondary, textAlign: 'right', fontFeatureSettings: '"tnum"' }}>
                                    {c.clicks > 0 ? c.clicks.toLocaleString() : '—'}
                                </td>
                                <td style={{ padding: '16px 20px', fontSize: '14px', color: colors.textSecondary, textAlign: 'right' }}>
                                    {c.date}
                                </td>
                                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                        {c.status === 'draft' && (
                                            <button style={{
                                                padding: '6px 12px',
                                                backgroundColor: 'transparent',
                                                border: `1px solid ${colors.borderSubtle}`,
                                                borderRadius: '6px',
                                                color: colors.textPrimary,
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                cursor: 'pointer',
                                            }}>
                                                Edit
                                            </button>
                                        )}
                                        {c.status === 'sending' && (
                                            <button style={{
                                                padding: '6px 12px',
                                                backgroundColor: `${colors.statusWarning}15`,
                                                border: 'none',
                                                borderRadius: '6px',
                                                color: colors.statusWarning,
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                            }}>
                                                <Pause style={{ width: '12px', height: '12px' }} />
                                                Pause
                                            </button>
                                        )}
                                        {c.status === 'sent' && (
                                            <button style={{
                                                padding: '6px 12px',
                                                backgroundColor: `${colors.bgElevated}`,
                                                border: 'none',
                                                borderRadius: '6px',
                                                color: colors.textSecondary,
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                cursor: 'pointer',
                                            }}>
                                                Report
                                            </button>
                                        )}
                                        <button style={{
                                            background: 'none',
                                            border: 'none',
                                            color: colors.textMuted,
                                            cursor: 'pointer',
                                            padding: '4px',
                                        }}>
                                            <MoreHorizontal style={{ width: '16px', height: '16px' }} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
