'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { MailCheck, CheckCircle2, ShieldAlert, Plus, Shield, Loader2, ArrowLeft, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

interface SenderIdentity {
    id: string;
    email: string;
    status: 'pending' | 'verified';
    created_at: string;
}

interface Domain {
    id: string;
    domain_name: string;
    status: 'pending' | 'verified' | 'failed';
}

export default function SenderIdentitiesPage() {
    const { token } = useAuth();
    const [senders, setSenders] = useState<SenderIdentity[]>([]);
    const [domains, setDomains] = useState<Domain[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [prefixInput, setPrefixInput] = useState('');
    const [selectedDomain, setSelectedDomain] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (token) {
            fetchData();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const fetchData = async () => {
        try {
            const [sendersRes, domainsRes] = await Promise.all([
                fetch(`${API_BASE}/senders`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${API_BASE}/domains`, { headers: { Authorization: `Bearer ${token}` } })
            ]);
            
            if (sendersRes.ok) {
                const data = await sendersRes.json();
                setSenders(data.data || []);
            }
            if (domainsRes.ok) {
                const data = await domainsRes.json();
                const allDomains = data.data || [];
                setDomains(allDomains);
                
                const verifiedDomains = allDomains.filter((d: Domain) => d.status === 'verified');
                if (verifiedDomains.length > 0) {
                    // Set the first domain as the default
                    setSelectedDomain(verifiedDomains[0].domain_name);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddSender = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!prefixInput || !selectedDomain) {
            setError('Please enter a prefix and select a verified domain.');
            return;
        }

        setError('');
        setIsSubmitting(true);
        
        const fullEmail = `${prefixInput}@${selectedDomain}`;

        try {
            const res = await fetch(`${API_BASE}/senders`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: fullEmail })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || 'Failed to add sender. Please ensure the domain is verified.');
            }

            setPrefixInput('');
            await fetchData(); // Refresh the list
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResend = async (email: string) => {
        try {
            const res = await fetch(`${API_BASE}/senders`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            
            if (!res.ok) {
                const data = await res.json();
                if (data.detail !== "Sender email already registered in your workspace.") {
                     alert(data.detail || 'Failed to resend email.');
                     return;
                }
            }
            alert('AWS SES limit resends internally. If you did not receive it, delete and add it again.');
        } catch (err: any) {
            alert('An error occurred.');
        }
    };

    const handleDelete = async (id: string, email: string) => {
        if (!confirm(`Are you sure you want to remove ${email}? You will no longer be able to send emails from this address.`)) return;

        try {
            const res = await fetch(`${API_BASE}/senders/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                await fetchData();
            } else {
                const data = await res.json();
                alert(data.detail || 'Failed to delete sender identity.');
            }
        } catch (err: any) {
            alert('An error occurred while deleting.');
        }
    };
    
    // Check verification status directly from AWS
    const checkStatus = async (id: string) => {
        try {
            await fetch(`${API_BASE}/senders/${id}/verify`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            await fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const verifiedDomains = domains.filter(d => d.status === 'verified');

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 animate-fadeIn bg-[var(--bg-primary)]">
            {/* Header Section */}
            <div className="flex flex-col mb-8 mt-4 md:mt-12">
                <div className="mb-4">
                    <a href="/settings" className="inline-flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-sm font-medium">
                        <ArrowLeft size={16} className="mr-2" /> Back to Settings
                    </a>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-[var(--text-primary)] mb-2 flex items-center gap-3">
                    <MailCheck className="text-[var(--accent)] h-8 w-8" />
                    Sender Identities
                </h1>
                <p className="text-[var(--text-muted)] text-base max-w-2xl">
                    Verify specific email addresses to prevent internal domain spoofing. You must verify ownership of an inbox before you can send campaigns from it.
                </p>
            </div>

            {/* Add Sender Form Section */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6 mb-8 shadow-sm">
                 <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Add New Sender</h2>
                 {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-500 flex items-start gap-2">
                        <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}
                 <form onSubmit={handleAddSender} className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                Sender Prefix
                            </label>
                            <input
                                type="text"
                                required
                                value={prefixInput}
                                onChange={e => setPrefixInput(e.target.value.replace(/[^a-zA-Z0-9.\-_]/g, ''))} // safe email prefix chars
                                placeholder="hello"
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                Verified Domain
                            </label>
                            <select
                                value={selectedDomain}
                                onChange={e => setSelectedDomain(e.target.value)}
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all"
                                required
                            >
                                {verifiedDomains.length === 0 ? (
                                    <option value="" disabled>No verified domains found in workspace.</option>
                                ) : (
                                    verifiedDomains.map(d => (
                                        <option key={d.id} value={d.domain_name}>@{d.domain_name}</option>
                                    ))
                                )}
                            </select>
                        </div>
                    </div>
                    <Button type="submit" isLoading={isSubmitting} disabled={!prefixInput || !selectedDomain || verifiedDomains.length === 0} className="w-full sm:w-auto mt-2 sm:mt-0">
                        <Plus className="h-4 w-4 mr-2" /> Add Sender
                    </Button>
                 </form>
            </div>

            {/* Table Section */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden shadow-sm mb-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="border-b border-[var(--border)] bg-[var(--bg-secondary)] uppercase text-[10px] tracking-wider font-semibold text-[var(--text-muted)]">
                                <th className="px-6 py-4">Sender Email</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date Added</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)] text-sm">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-[var(--text-muted)]">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto opacity-50 mb-2" />
                                        Loading verified senders...
                                    </td>
                                </tr>
                            ) : senders.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-[var(--text-muted)]">
                                        <ShieldAlert className="h-10 w-10 mx-auto opacity-20 mb-3" />
                                        <p>No sender identities verified yet.</p>
                                        <p className="text-xs opacity-70 mt-1">Add one to start sending campaigns.</p>
                                    </td>
                                </tr>
                            ) : (
                                senders.map((s) => (
                                    <tr key={s.id} className="hover:bg-[var(--bg-secondary)] transition-colors group">
                                         <td className="px-6 py-4 font-medium text-[var(--text-primary)]">
                                            {s.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            {s.status === 'verified' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    Verified
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20">
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                    Pending
                                                </span>
                                            )}
                                            {s.status === 'pending' && (
                                                <button onClick={() => checkStatus(s.id)} className="ml-3 text-xs text-[var(--accent)] hover:underline">
                                                    Check Status
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-[var(--text-muted)]">
                                            {new Date(s.created_at).toLocaleDateString(undefined, {
                                                year: 'numeric', month: 'short', day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            {s.status === 'pending' && (
                                                <button
                                                    onClick={() => handleResend(s.email)}
                                                    className="inline-flex items-center text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] p-2 hover:bg-[var(--bg-primary)] rounded transition-colors"
                                                >
                                                    <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Resend Verification
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(s.id, s.email)}
                                                className="inline-flex items-center text-xs font-medium text-red-400 hover:text-red-300 p-2 hover:bg-red-400/10 rounded transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-[var(--radius-lg)] p-5">
                <h4 className="text-sm font-semibold text-blue-500 flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4" /> Adding new senders
                </h4>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    Once you add an email prefix, AWS SES will automatically send a verification email to that exact address. You must open that inbox and click the AWS verification link inside before the sender transitions from Pending to Verified status. Once verified, you can select this email as your FROM address in the Campaign Builder.
                </p>
            </div>
        </div>
    );
}
