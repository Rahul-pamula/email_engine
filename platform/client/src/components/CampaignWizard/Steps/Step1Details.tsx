"use client";

import { useState, useEffect } from "react";
import { FileText, Loader2, AlertTriangle, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function Step1Details({ data, updateData, onNext }: any) {
    const { token } = useAuth();
    const [errors, setErrors] = useState<any>({});
    const [domains, setDomains] = useState<any[]>([]);
    const [senders, setSenders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
            try {
                const [domRes, sendRes] = await Promise.all([
                    fetch(`${API_BASE}/domains/`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(`${API_BASE}/senders/`, { headers: { 'Authorization': `Bearer ${token}` } })
                ]);

                let verifiedDomains = [];
                let verifiedSenders = [];

                if (domRes.ok) {
                    const json = await domRes.json();
                    verifiedDomains = (json.data || []).filter((d: any) => d.status === 'verified');
                    setDomains(verifiedDomains);
                }

                if (sendRes.ok) {
                    const json = await sendRes.json();
                    verifiedSenders = (json.data || []).filter((s: any) => s.is_verified);
                    setSenders(verifiedSenders);
                }

                // Validate existing domain_id or Auto-select
                const isDomainStale = data.domain_id && !verifiedDomains.find((d: any) => d.id === data.domain_id);

                if (isDomainStale || (!data.domain_id && verifiedSenders.length > 0 && verifiedDomains.length > 0)) {
                    const firstSender = verifiedSenders[0].email;
                    const [prefix, domainStr] = firstSender.split('@');
                    const domainObj = verifiedDomains.find((d: any) => d.domain_name === domainStr);
                    if (domainObj) {
                        updateData({ from_prefix: prefix, domain_id: domainObj.id, domain_name: domainObj.domain_name });
                    } else if (isDomainStale) {
                        // Fallback clear if even the first sender's domain is mysteriously gone
                        updateData({ from_prefix: '', domain_id: '', domain_name: '' });
                    }
                } else if (data.domain_id && !data.domain_name) {
                    // Backfill domain_name into context for Step4Review if missing
                    const domainObj = verifiedDomains.find((d: any) => d.id === data.domain_id);
                    if (domainObj) updateData({ domain_name: domainObj.domain_name });
                }
            } catch (err) {
                console.error("Failed to fetch data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    const validate = () => {
        const e: any = {};
        if (!data.name?.trim()) e.name = "Campaign name is required";
        if (!data.subject?.trim()) e.subject = "Subject line is required";
        if (!data.from_name?.trim()) e.from_name = "Sender name is required";
        if (!data.from_prefix?.trim()) e.from_prefix = "Sender email prefix is required";
        else if (!/^[a-zA-Z0-9._%+-]+$/.test(data.from_prefix)) e.from_prefix = "Invalid email prefix format";
        if (!data.domain_id) e.domain_id = "You must select a verified sending domain";
        return e;
    };

    const handleNext = () => {
        const e = validate();
        if (Object.keys(e).length > 0) { setErrors(e); return; }
        onNext();
    };

    const inputStyle = (hasError: boolean) => ({
        width: '100%',
        padding: '10px 14px',
        background: 'rgba(9, 9, 11, 0.8)',
        border: `1px solid ${hasError ? 'rgba(239, 68, 68, 0.5)' : 'rgba(63, 63, 70, 0.4)'}`,
        borderRadius: '8px',
        color: '#FAFAFA',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s',
    });

    const labelStyle = {
        display: 'block',
        fontSize: '13px',
        fontWeight: 500,
        color: '#A1A1AA',
        marginBottom: '6px',
    };

    return (
        <div style={{ padding: '36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                <div style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <FileText size={18} color="#3B82F6" />
                </div>
                <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#FAFAFA', margin: 0 }}>Campaign Details</h2>
                    <p style={{ fontSize: '13px', color: '#71717A', margin: 0 }}>Set the basic information and sender identity</p>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* Core Campaign Info */}
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#E4E4E7', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={14} className="text-blue-400" /> General Information
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={labelStyle}>Internal Campaign Name *</label>
                            <input
                                type="text"
                                placeholder="e.g. Q3 Summer Spectacular"
                                value={data.name || ''}
                                onChange={(e) => { updateData({ name: e.target.value }); setErrors((p: any) => ({ ...p, name: '' })); }}
                                style={inputStyle(!!errors.name)}
                            />
                            {errors.name && <p style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.name}</p>}
                            <p style={{ fontSize: '12px', color: '#52525B', marginTop: '4px' }}>Only you and your team will see this name.</p>
                        </div>
                    </div>
                </div>

                {/* Sender Identity Section */}
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#E4E4E7', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={14} className="text-purple-400" /> Sender Identity
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={labelStyle}>Sender Name (From Name) *</label>
                            <input
                                type="text"
                                placeholder="e.g. John from MyCompany"
                                value={data.from_name || ''}
                                onChange={(e) => { updateData({ from_name: e.target.value }); setErrors((p: any) => ({ ...p, from_name: '' })); }}
                                style={inputStyle(!!errors.from_name)}
                            />
                            {errors.from_name && <p style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.from_name}</p>}
                        </div>

                        <div>
                            <label style={labelStyle}>Sender Email Address *</label>

                            {loading ? (
                                <div className="flex items-center gap-2 p-3 rounded-md bg-zinc-900/50 border border-zinc-800 text-zinc-400 text-sm">
                                    <Loader2 size={16} className="animate-spin" /> Loading verified senders...
                                </div>
                            ) : senders.length === 0 ? (
                                <div className="flex flex-col gap-2 p-4 rounded-md bg-amber-950/20 border border-amber-900/50 text-amber-400 text-sm">
                                    <div className="flex items-center gap-2 font-medium">
                                        <AlertTriangle size={16} /> No Verified Senders Found
                                    </div>
                                    <p className="text-amber-400/80">You must verify an email inbox ownership before launching campaigns.</p>
                                    <Link href="/settings/senders" className="text-blue-400 hover:text-blue-300 underline mt-1 w-fit">
                                        Go to Sender Settings →
                                    </Link>
                                </div>
                            ) : (
                                <div>
                                    <select
                                        value={
                                            data.from_prefix && data.domain_id
                                                ? `${data.from_prefix}@${domains.find(d => d.id === data.domain_id)?.domain_name || ''}`
                                                : ''
                                        }
                                        onChange={(e) => {
                                            const fullEmail = e.target.value;
                                            const [prefix, domainStr] = fullEmail.split('@');
                                            const domainObj = domains.find(d => d.domain_name === domainStr);
                                            if (domainObj) {
                                                updateData({ from_prefix: prefix, domain_id: domainObj.id, domain_name: domainObj.domain_name });
                                            }
                                            setErrors((p: any) => ({ ...p, from_prefix: '', domain_id: '' }));
                                        }}
                                        className="w-full bg-zinc-900/80 border text-zinc-100 px-4 py-3 rounded-md text-sm focus:ring-2 focus:ring-blue-500/50 outline-none cursor-pointer hover:bg-zinc-800/60 transition-colors appearance-none"
                                        style={{ borderColor: errors.from_prefix || errors.domain_id ? 'rgba(239, 68, 68, 0.5)' : 'rgba(63, 63, 70, 0.4)' }}
                                    >
                                        <option value="" disabled>Select Verified Sender</option>
                                        {senders.map(sender => (
                                            <option key={sender.id} value={sender.email}>{sender.email}</option>
                                        ))}
                                    </select>

                                    {/* Custom Dropdown Arrow */}
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4" style={{ top: '228px' }}>
                                        <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>

                                    {errors.from_prefix && <p style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.from_prefix}</p>}
                                </div>
                            )}
                        </div>

                        <div className="pt-2 border-t border-zinc-800/50">
                            <label style={labelStyle}>Email Subject Line *</label>
                            <input
                                type="text"
                                placeholder="e.g. Don't miss our biggest sale of the year!"
                                value={data.subject || ''}
                                onChange={(e) => { updateData({ subject: e.target.value }); setErrors((p: any) => ({ ...p, subject: '' })); }}
                                style={inputStyle(!!errors.subject)}
                            />
                            {errors.subject && <p style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.subject}</p>}
                            <p style={{ fontSize: '12px', color: '#52525B', marginTop: '4px' }}>This is the main headline recipients will see in their inbox.</p>
                        </div>
                    </div>
                </div>

            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(63, 63, 70, 0.3)' }}>
                <button
                    onClick={handleNext}
                    className="btn-premium"
                    disabled={loading || senders.length === 0}
                    style={{ opacity: (loading || senders.length === 0) ? 0.5 : 1, cursor: (loading || senders.length === 0) ? 'not-allowed' : 'pointer' }}
                >
                    Next Step →
                </button>
            </div>
        </div>
    );
}
