'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { MailCheck, CheckCircle2, ShieldAlert, Plus, Shield, Loader2, KeyRound, ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

interface SenderIdentity {
    id: string;
    email: string;
    is_verified: boolean;
    created_at: string;
}

interface Domain {
    id: string;
    domain_name: string;
    status: string;
}

export default function SenderIdentitiesPage() {
    const { token } = useAuth();
    const [senders, setSenders] = useState<SenderIdentity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [step, setStep] = useState<1 | 2>(1);
    const [prefixInput, setPrefixInput] = useState('');
    const [selectedDomain, setSelectedDomain] = useState('');
    const [domains, setDomains] = useState<Domain[]>([]);
    const [otpCode, setOtpCode] = useState('');

    const getFullEmail = () => {
        const domain = domains.find(d => d.id === selectedDomain);
        if (!domain || !prefixInput) return '';
        return `${prefixInput}@${domain.domain_name}`;
    };
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (token) {
            fetchSenders();
            fetchDomains();
        }
    }, [token]);

    const fetchDomains = async () => {
        try {
            const res = await fetch(`${API_BASE}/domains`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setDomains(data.data?.filter((d: any) => d.status === 'verified') || []);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSenders = async () => {
        try {
            const res = await fetch(`${API_BASE}/senders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSenders(data.data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const res = await fetch(`${API_BASE}/senders/verify-request`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: getFullEmail() })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || 'Failed to request code.');
            }

            setStep(2); // Move to OTP entry
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmitOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const res = await fetch(`${API_BASE}/senders/verify-submit`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: getFullEmail(), otp_code: otpCode })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || 'Invalid verification code.');
            }

            // Success!
            setIsModalOpen(false);
            setStep(1);
            setPrefixInput('');
            setSelectedDomain('');
            setOtpCode('');
            await fetchSenders(); // Refresh the table
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetModal = () => {
        setIsModalOpen(false);
        setStep(1);
        setPrefixInput('');
        setSelectedDomain('');
        setOtpCode('');
        setError('');
    }

    const handleDelete = async (id: string, email: string) => {
        if (!confirm(`Are you sure you want to remove ${email}? You will no longer be able to send emails from this address.`)) return;

        try {
            const res = await fetch(`${API_BASE}/senders/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                await fetchSenders();
            } else {
                const data = await res.json();
                alert(data.detail || 'Failed to delete sender identity.');
            }
        } catch (err: any) {
            alert('An error occurred while deleting.');
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-8 animate-fadeIn">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 mt-12">
                <div>
                    <div className="mb-4">
                        <a href="/settings" className="inline-flex items-center text-[var(--text-muted)] hover:text-white transition-colors text-sm font-medium">
                            <ArrowLeft size={16} className="mr-2" /> Back to Settings
                        </a>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] mb-2 flex items-center gap-2">
                        <MailCheck className="text-[var(--accent)] h-8 w-8" />
                        Sender Identities
                    </h1>
                    <p className="text-[var(--text-muted)] text-base max-w-2xl">
                        Verify specific email addresses to prevent internal domain spoofing. You must verify ownership of an inbox before you can send campaigns from it.
                    </p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Sender Identity
                </Button>
            </div>

            {/* Table Section */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border)] bg-[var(--bg-secondary)] uppercase text-[10px] tracking-wider font-semibold text-[var(--text-muted)]">
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Sender Email</th>
                                <th className="px-6 py-4">Date Added</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)] text-sm">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-[var(--text-muted)]">
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
                                senders.map((s, idx) => (
                                    <tr key={s.id} className="hover:bg-[var(--bg-secondary)] transition-colors group">
                                        <td className="px-6 py-4">
                                            {s.is_verified ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-[var(--success)]/10 text-[var(--success)] rounded-full border border-[var(--success)]/20 shadow-sm shadow-[var(--success)]/5">
                                                    <span className="relative flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--success)]"></span>
                                                    </span>
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20">
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-[var(--text-primary)]">
                                            {s.email}
                                        </td>
                                        <td className="px-6 py-4 text-[var(--text-muted)]">
                                            {new Date(s.created_at).toLocaleDateString(undefined, {
                                                year: 'numeric', month: 'short', day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(s.id, s.email)}
                                                className="text-[var(--text-muted)] hover:text-red-400 p-2 hover:bg-red-400/10 rounded transition-colors"
                                                title="Delete Sender Identity"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* OTP Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div
                        className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-lg)] w-full max-w-md shadow-2xl animate-slide-up relative overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Decorative background glow */}
                        <div className="absolute top-0 right-0 p-12 bg-blue-500/10 rounded-full blur-[80px] -mr-8 -mt-8 pointer-events-none"></div>

                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6 relative">
                                <div>
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 text-[var(--accent)] mb-4 border border-blue-500/20">
                                        {step === 1 ? <Shield className="h-6 w-6" /> : <KeyRound className="h-6 w-6" />}
                                    </div>
                                    <h3 className="text-xl font-bold text-[var(--text-primary)]">
                                        {step === 1 ? 'Verify Email Ownership' : 'Enter Verification Code'}
                                    </h3>
                                    <p className="text-sm text-[var(--text-muted)] mt-1">
                                        {step === 1
                                            ? "Request a 6-digit code to your inbox to prove you own it."
                                            : `We sent a code to ${getFullEmail()}. It expires in 15 minutes.`}
                                    </p>
                                </div>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-500 flex items-start gap-2">
                                    <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {step === 1 ? (
                                <form onSubmit={handleRequestOtp} className="space-y-4 relative">
                                    {domains.length === 0 ? (
                                        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm">
                                            You need to verify a custom domain under &quot;Domains&quot; before you can create a Sender Identity.
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                                Sender Email Address
                                            </label>
                                            <div className="flex bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[var(--accent)] focus-within:border-transparent transition-all">
                                                <input
                                                    type="text"
                                                    required
                                                    value={prefixInput}
                                                    onChange={e => setPrefixInput(e.target.value)}
                                                    placeholder="sales"
                                                    className="flex-1 bg-transparent px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
                                                />
                                                <div className="flex items-center px-3 bg-[var(--bg-secondary)] border-l border-[var(--border)] text-sm text-[var(--text-muted)]">
                                                    @
                                                </div>
                                                <select
                                                    required
                                                    value={selectedDomain}
                                                    onChange={e => setSelectedDomain(e.target.value)}
                                                    className="bg-[var(--bg-secondary)] px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none cursor-pointer border-none appearance-none pr-8"
                                                    style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em' }}
                                                >
                                                    <option value="" disabled>Select Domain</option>
                                                    {domains.map(d => (
                                                        <option key={d.id} value={d.id}>{d.domain_name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex justify-end gap-3 mt-8">
                                        <Button type="button" variant="secondary" onClick={resetModal}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" isLoading={isSubmitting} disabled={domains.length === 0 || !prefixInput || !selectedDomain}>
                                            Send Code
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleSubmitOtp} className="space-y-4 relative">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5 text-center">
                                            6-Digit OTP Code
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            maxLength={6}
                                            value={otpCode}
                                            onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))} // numbers only
                                            placeholder="000000"
                                            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-4 text-center text-3xl font-mono tracking-[0.5em] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div className="flex justify-between items-center mt-8">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                                        >
                                            Change email
                                        </button>
                                        <div className="flex gap-3">
                                            <Button type="button" variant="secondary" onClick={resetModal}>
                                                Cancel
                                            </Button>
                                            <Button type="submit" isLoading={isSubmitting}>
                                                Verify
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
