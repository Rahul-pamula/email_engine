"use client";

import Link from "next/link";
import {
    FileText,
    MoreHorizontal,
    Plus,
    Search,
    Grid,
    List,
    Clock,
    Copy
} from "lucide-react";
import { useState } from "react";

/* ============================================================
   TEMPLATES - Light Mode
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
};

// Mock Data
const templates = [
    { id: 1, name: "Welcome Email v2", subject: "Welcome to our platform!", updated: "2h ago", usage: 12 },
    { id: 2, name: "Monthly Newsletter", subject: "Your {{month}} update is here", updated: "1d ago", usage: 45 },
    { id: 3, name: "Password Reset", subject: "Reset your password", updated: "1w ago", usage: 890 },
    { id: 4, name: "Order Confirmation", subject: "Order #{{order_id}} confirmed", updated: "2w ago", usage: 1205 },
    { id: 5, name: "Event Invitation", subject: "You're invited: {{event_name}}", updated: "3w ago", usage: 5 },
];

export default function TemplatesPage() {
    const [view, setView] = useState<'grid' | 'list'>('grid');

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
                    Templates
                </h1>

                <button style={{
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
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                }}>
                    <Plus style={{ width: '16px', height: '16px' }} />
                    Create Template
                </button>
            </div>

            {/* Toolbar */}
            <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', justifyContent: 'space-between' }}>
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
                        placeholder="Search templates..."
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

                <div style={{
                    display: 'flex',
                    backgroundColor: colors.bgElevated,
                    borderRadius: '6px',
                    padding: '2px',
                    border: `1px solid ${colors.borderSubtle}`,
                }}>
                    <button
                        onClick={() => setView('grid')}
                        style={{
                            padding: '6px',
                            backgroundColor: view === 'grid' ? colors.bgPrimary : 'transparent',
                            border: 0,
                            borderRadius: '4px',
                            color: view === 'grid' ? colors.textPrimary : colors.textMuted,
                            cursor: 'pointer',
                            boxShadow: view === 'grid' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                        }}
                    >
                        <Grid style={{ width: '16px', height: '16px' }} />
                    </button>
                    <button
                        onClick={() => setView('list')}
                        style={{
                            padding: '6px',
                            backgroundColor: view === 'list' ? colors.bgPrimary : 'transparent',
                            border: 0,
                            borderRadius: '4px',
                            color: view === 'list' ? colors.textPrimary : colors.textMuted,
                            cursor: 'pointer',
                            boxShadow: view === 'list' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                        }}
                    >
                        <List style={{ width: '16px', height: '16px' }} />
                    </button>
                </div>
            </div>

            {/* Grid View */}
            {view === 'grid' && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '24px',
                }}>
                    {templates.map((t) => (
                        <div key={t.id} style={{
                            backgroundColor: colors.bgPrimary,
                            border: `1px solid ${colors.borderSubtle}`,
                            borderRadius: '8px',
                            overflow: 'hidden',
                            transition: 'all 200ms ease',
                            cursor: 'pointer',
                        }}>
                            {/* Preview Placeholder */}
                            <div style={{
                                height: '160px',
                                backgroundColor: colors.bgElevated,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderBottom: `1px solid ${colors.borderSubtle}`,
                            }}>
                                <FileText style={{ width: '32px', height: '32px', color: colors.borderSubtle }} />
                            </div>

                            <div style={{ padding: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.textPrimary, margin: 0 }}>{t.name}</h3>
                                    <button style={{ color: colors.textMuted, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                        <MoreHorizontal style={{ width: '16px', height: '16px' }} />
                                    </button>
                                </div>
                                <p style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {t.subject}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: colors.textMuted }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Clock style={{ width: '12px', height: '12px' }} /> {t.updated}
                                    </span>
                                    <span>Used {t.usage} times</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* List View */}
            {view === 'list' && (
                <div style={{
                    backgroundColor: colors.bgPrimary,
                    border: `1px solid ${colors.borderSubtle}`,
                    borderRadius: '8px',
                    overflow: 'hidden',
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: colors.bgSecondary, borderBottom: `1px solid ${colors.borderSubtle}` }}>
                                {['Name', 'Subject', 'Last Updated', 'Usage', ''].map((h, i) => (
                                    <th key={h} style={{
                                        padding: '12px 20px',
                                        fontSize: '12px',
                                        fontWeight: 500,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        color: colors.textMuted,
                                        textAlign: i >= 3 && i < 4 ? 'right' : 'left',
                                    }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {templates.map((t) => (
                                <tr key={t.id} style={{ borderBottom: `1px solid ${colors.borderSubtle}` }}>
                                    <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 500, color: colors.textPrimary }}>{t.name}</td>
                                    <td style={{ padding: '16px 20px', fontSize: '14px', color: colors.textSecondary }}>{t.subject}</td>
                                    <td style={{ padding: '16px 20px', fontSize: '14px', color: colors.textSecondary }}>{t.updated}</td>
                                    <td style={{ padding: '16px 20px', fontSize: '14px', color: colors.textSecondary, textAlign: 'right' }}>{t.usage}</td>
                                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                            <button style={{
                                                padding: '6px',
                                                background: 'transparent',
                                                border: `1px solid ${colors.borderSubtle}`,
                                                borderRadius: '4px',
                                                color: colors.textSecondary,
                                                cursor: 'pointer',
                                            }} title="Duplicate">
                                                <Copy style={{ width: '14px', height: '14px' }} />
                                            </button>
                                            <button style={{
                                                padding: '6px',
                                                background: 'transparent',
                                                border: 'none',
                                                color: colors.textMuted,
                                                cursor: 'pointer',
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
            )}
        </>
    );
}
