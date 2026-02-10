"use client";

import {
    BarChart3,
    Download,
    Calendar,
    Filter,
    Info
} from "lucide-react";

/* ============================================================
   REPORTS - Light Mode
   ============================================================ */

const colors = {
    bgPrimary: '#ffffff',
    bgSecondary: '#f8fafc',
    bgElevated: '#f1f5f9',
    borderSubtle: '#e2e8f0',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    accentBlue: '#2563eb',
    chartBar1: '#3b82f6', // blue-500
    chartBar2: '#93c5fd', // blue-300
};

const summaryMetrics = [
    { label: "Emails Sent", value: "245.2k", change: "+12%" },
    { label: "Avg Open Rate", value: "42.3%", change: "+2.1%" },
    { label: "Avg Click Rate", value: "8.7%", change: "-0.5%" },
    { label: "Bounces", value: "1.2%", change: "+0.1%" },
];

const ispPerformance = [
    { name: "Gmail", sent: "120k", openRate: "45%", clickRate: "9.2%", complaint: "0.01%" },
    { name: "Outlook", sent: "85k", openRate: "38%", clickRate: "7.8%", complaint: "0.03%" },
    { name: "Yahoo", sent: "25k", openRate: "41%", clickRate: "8.1%", complaint: "0.02%" },
    { name: "iCloud", sent: "15k", openRate: "48%", clickRate: "10.5%", complaint: "0.00%" },
];

export default function ReportsPage() {
    return (
        <>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'end',
                marginBottom: '32px'
            }}>
                <div>
                    <h1 style={{
                        fontSize: '24px',
                        fontWeight: 600,
                        color: colors.textPrimary,
                        margin: 0,
                        letterSpacing: '-0.02em',
                    }}>
                        Reports
                    </h1>
                    <p style={{
                        fontSize: '14px',
                        color: colors.textSecondary,
                        margin: '4px 0 0 0',
                    }}>
                        Analytics and performance insights
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
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
                        <Calendar style={{ width: '16px', height: '16px' }} />
                        Last 30 Days
                    </button>
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
                        <Download style={{ width: '16px', height: '16px' }} />
                        Export
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                marginBottom: '32px',
            }}>
                {summaryMetrics.map((m) => (
                    <div key={m.label} style={{
                        padding: '20px',
                        backgroundColor: colors.bgPrimary,
                        border: `1px solid ${colors.borderSubtle}`,
                        borderRadius: '8px',
                    }}>
                        <div style={{ fontSize: '14px', color: colors.textMuted }}>{m.label}</div>
                        <div style={{ fontSize: '24px', fontWeight: 700, color: colors.textPrimary, margin: '8px 0' }}>{m.value}</div>
                        <div style={{ fontSize: '12px', color: m.change.startsWith('+') ? '#16a34a' : '#dc2626' }}>
                            {m.change} from last period
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
                {/* Main Chart Placeholder */}
                <div style={{
                    padding: '24px',
                    backgroundColor: colors.bgPrimary,
                    border: `1px solid ${colors.borderSubtle}`,
                    borderRadius: '8px',
                    minHeight: '300px',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: colors.textPrimary }}>Email Performance</h3>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: colors.textSecondary }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colors.chartBar1 }}></div> Sent
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: colors.textSecondary }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colors.chartBar2 }}></div> Opens
                            </div>
                        </div>
                    </div>

                    {/* Mock Bar Chart */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '200px', paddingBottom: '24px', borderBottom: `1px solid ${colors.borderSubtle}` }}>
                        {[60, 45, 75, 50, 80, 65, 90, 55, 70, 40, 60, 85].map((h, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center', width: '6%' }}>
                                <div style={{ width: '100%', height: `${h * 0.4}%`, backgroundColor: colors.chartBar2, borderRadius: '2px' }}></div>
                                <div style={{ width: '100%', height: `${h}%`, backgroundColor: colors.chartBar1, borderRadius: '2px' }}></div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', color: colors.textMuted, fontSize: '12px' }}>
                        <span>Jan 1</span>
                        <span>Jan 7</span>
                        <span>Jan 14</span>
                        <span>Jan 21</span>
                        <span>Jan 28</span>
                    </div>
                </div>

                {/* Bot Filtering Card */}
                <div style={{
                    padding: '24px',
                    backgroundColor: colors.bgPrimary,
                    border: `1px solid ${colors.borderSubtle}`,
                    borderRadius: '8px',
                }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: colors.textPrimary }}>Bot Filtering</h3>
                    <p style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '24px' }}>
                        We automatically filter out bot clicks and opens to ensure your metrics are accurate.
                    </p>

                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '14px', color: colors.textSecondary }}>Bot Opens Blocked</span>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: colors.textPrimary }}>12.4k</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', backgroundColor: colors.bgElevated, borderRadius: '3px' }}>
                            <div style={{ width: '35%', height: '100%', backgroundColor: colors.accentBlue, borderRadius: '3px' }}></div>
                        </div>
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '14px', color: colors.textSecondary }}>Bot Clicks Blocked</span>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: colors.textPrimary }}>4.1k</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', backgroundColor: colors.bgElevated, borderRadius: '3px' }}>
                            <div style={{ width: '18%', height: '100%', backgroundColor: colors.accentBlue, borderRadius: '3px' }}></div>
                        </div>
                    </div>

                    <div style={{ marginTop: '24px', padding: '12px', backgroundColor: colors.bgElevated, borderRadius: '6px', fontSize: '12px', color: colors.textSecondary, display: 'flex', gap: '8px' }}>
                        <Info style={{ width: '16px', height: '16px', flexShrink: 0, color: colors.accentBlue }} />
                        <span>Accuracy rate of 99.8% based on heuristic analysis.</span>
                    </div>
                </div>
            </div>

            {/* ISP Performance Table */}
            <div style={{
                backgroundColor: colors.bgPrimary,
                border: `1px solid ${colors.borderSubtle}`,
                borderRadius: '8px',
                overflow: 'hidden',
            }}>
                <div style={{ padding: '16px 24px', borderBottom: `1px solid ${colors.borderSubtle}` }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: colors.textPrimary }}>ISP Performance</h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: colors.bgSecondary }}>
                            {['ISP', 'Emails Sent', 'Open Rate', 'Click Rate', 'Complaint Rate'].map(h => (
                                <th key={h} style={{
                                    padding: '12px 24px',
                                    textAlign: 'left',
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    textTransform: 'uppercase',
                                    color: colors.textMuted,
                                    borderBottom: `1px solid ${colors.borderSubtle}`,
                                    letterSpacing: '0.05em',
                                }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {ispPerformance.map((isp) => (
                            <tr key={isp.name} style={{ borderBottom: `1px solid ${colors.borderSubtle}` }}>
                                <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: 500, color: colors.textPrimary }}>{isp.name}</td>
                                <td style={{ padding: '16px 24px', fontSize: '14px', color: colors.textSecondary }}>{isp.sent}</td>
                                <td style={{ padding: '16px 24px', fontSize: '14px', color: colors.textSecondary }}>{isp.openRate}</td>
                                <td style={{ padding: '16px 24px', fontSize: '14px', color: colors.textSecondary }}>{isp.clickRate}</td>
                                <td style={{ padding: '16px 24px', fontSize: '14px', color: colors.textSecondary }}>{isp.complaint}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
