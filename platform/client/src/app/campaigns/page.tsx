"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Play,
    Pause,
    MoreHorizontal,
    Plus,
    Search,
    Filter,
    Loader2,
    AlertCircle
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

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

function StatusBadge({ status }: { status: string }) {
    const getColors = (s: string) => {
        switch (s) {
            case 'sent': return { bg: `${colors.statusSuccess}15`, text: colors.statusSuccess };
            case 'sending': return { bg: `${colors.statusWarning}15`, text: colors.statusWarning };
            case 'processing': return { bg: `${colors.statusWarning}15`, text: colors.statusWarning };
            case 'scheduled': return { bg: `${colors.accentBlue}15`, text: colors.accentBlue };
            case 'draft': return { bg: `${colors.textMuted}15`, text: colors.textMuted };
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
            {(status === 'sending' || status === 'processing') && (
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
    const { token } = useAuth();
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    // Fetch Campaigns
    useEffect(() => {
        const fetchCampaigns = async () => {
            if (!token) return;
            try {
                const res = await fetch('http://127.0.0.1:8000/campaigns/', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error("Failed to fetch campaigns");
                const json = await res.json();
                setCampaigns(json.campaigns || []);
            } catch (err) {
                console.error(err);
                setError("Failed to load campaigns.");
            } finally {
                setLoading(false);
            }
        };
        fetchCampaigns();
    }, [token]);

    const filtered = campaigns.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

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
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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

            {/* ERROR STATE */}
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            {/* LOADING STATE */}
            {loading && (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
            )}

            {/* EMPTY STATE */}
            {!loading && !error && filtered.length === 0 && (
                <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-slate-500 mb-4">No campaigns found.</p>
                    <Link href="/campaigns/new" className="text-blue-600 font-medium hover:underline">
                        Create your first campaign
                    </Link>
                </div>
            )}

            {/* DATA TABLE */}
            {!loading && filtered.length > 0 && (
                <div style={{
                    backgroundColor: colors.bgPrimary,
                    border: `1px solid ${colors.borderSubtle}`,
                    borderRadius: '8px',
                    overflow: 'hidden',
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: colors.bgSecondary, borderBottom: `1px solid ${colors.borderSubtle}` }}>
                                {['Campaign', 'Status', 'Tasks', 'Created', ''].map((h, i) => (
                                    <th key={h} style={{
                                        padding: '12px 20px',
                                        fontSize: '12px',
                                        fontWeight: 500,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        color: colors.textMuted,
                                        textAlign: i >= 2 && i < 4 ? 'right' : 'left',
                                    }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((c) => (
                                <tr key={c.id} style={{ borderBottom: `1px solid ${colors.borderSubtle}` }}>
                                    {/* Name */}
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
                                            <span style={{ fontSize: '12px', color: colors.textMuted }}>{c.subject}</span>
                                        </Link>
                                    </td>

                                    {/* Status */}
                                    <td style={{ padding: '16px 20px' }}>
                                        <StatusBadge status={c.status} />
                                    </td>

                                    {/* Tasks Count (from stats join) */}
                                    <td style={{ padding: '16px 20px', fontSize: '14px', color: colors.textSecondary, textAlign: 'right', fontFeatureSettings: '"tnum"' }}>
                                        {c.stats?.[0]?.count ? c.stats[0].count.toLocaleString() : '0'}
                                    </td>

                                    {/* Date */}
                                    <td style={{ padding: '16px 20px', fontSize: '14px', color: colors.textSecondary, textAlign: 'right' }}>
                                        {new Date(c.created_at).toLocaleDateString()}
                                    </td>

                                    {/* Actions */}
                                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                            {(c.status === 'draft' || c.status === 'paused') && (
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
            )}
        </>
    );
}
