'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Users, Mail, UserPlus, X, Trash2, CheckCircle2, AlertTriangle, Shield, Clock } from 'lucide-react';


const API_BASE = 'http://127.0.0.1:8000';

interface Member {
    user_id: string;
    email: string;
    full_name: string | null;
    role: 'owner' | 'admin' | 'member';
    joined_at: string;
}

interface Invite {
    id: string;
    email: string;
    role: 'owner' | 'admin' | 'member';
    expires_at: string;
    created_at: string;
    inviter_id?: string;
}

export default function TeamSettingsPage() {
    const { token, user } = useAuth();
    const [members, setMembers] = useState<Member[]>([]);
    const [invites, setInvites] = useState<Invite[]>([]);
    const [loading, setLoading] = useState(true);

    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member');
    const [inviteStatus, setInviteStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    // Currently logged-in user's role
    const myRole = members.find(m => m.user_id === user?.userId)?.role || 'member';

    const fetchTeam = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const [memRes, invRes] = await Promise.all([
                fetch(`${API_BASE}/team/members`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${API_BASE}/team/invites`, { headers: { Authorization: `Bearer ${token}` } })
            ]);

            if (memRes.ok) setMembers(await memRes.json());
            if (invRes.ok) setInvites(await invRes.json());
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, [token]);

    const handleSendInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !inviteEmail.trim()) return;

        setInviteStatus('sending');
        try {
            const res = await fetch(`${API_BASE}/team/invites`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ email: inviteEmail, role: inviteRole })
            });

            if (!res.ok) throw new Error(await res.text());

            setInviteStatus('success');
            setTimeout(() => {
                setShowInviteModal(false);
                setInviteStatus('idle');
                setInviteEmail('');
                setInviteRole('member');
                fetchTeam();
            }, 1500);
        } catch (e) {
            console.error(e);
            setInviteStatus('error');
        }
    };

    const handleRemoveMember = async (userId: string) => {
        if (!confirm('Are you sure you want to remove this member?')) return;
        try {
            await fetch(`${API_BASE}/team/members/${userId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTeam();
        } catch (e) {
            console.error(e);
        }
    };

    const handleLeaveWorkspace = async () => {
        if (!confirm('⚠️ DANGER: Are you sure you want to leave this workspace? If you do, any domains or sender identities you verified here will be left behind or invalidated, and you will lose access to all campaigns. You will need a new invite to rejoin.')) return;
        
        try {
            const res = await fetch(`${API_BASE}/team/members/me/leave`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (res.ok) {
                // Clear session and go to login
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user_data');
                window.location.href = '/login';
            } else {
                const data = await res.json();
                alert(data.detail || 'Failed to leave workspace.');
            }
        } catch (e) {
            console.error(e);
            alert('An error occurred.');
        }
    };

    const handleCancelInvite = async (inviteId: string) => {
        if (!confirm('Are you sure you want to cancel this invitation?')) return;
        try {
            await fetch(`${API_BASE}/team/invites/${inviteId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTeam();
        } catch (e) {
            console.error(e);
        }
    };

    const handleChangeRole = async (userId: string, newRole: string) => {
        try {
            await fetch(`${API_BASE}/team/members/${userId}/role`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ role: newRole })
            });
            fetchTeam();
        } catch (e) {
            alert('Failed to update role. You must be an owner.');
        }
    };

    if (loading) return <div className="p-12 text-[var(--text-muted)] animate-pulse flex items-center gap-2"><div className="w-4 h-4 rounded-full border-2 border-t-transparent border-[var(--accent)] animate-spin" /> Loading team...</div>;

    const isAdminOrOwner = myRole === 'admin' || myRole === 'owner';

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
            <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Team Members</h1>
                <p className="text-[var(--text-muted)] text-sm">Manage who has access to your workspace and their permissions.</p>
            </div>

            {isAdminOrOwner && (
                <div className="flex justify-end">
                    <button
                        onClick={() => setShowInviteModal(true)}
                        className="btn-premium flex items-center gap-2"
                    >
                        <UserPlus className="w-4 h-4" /> Invite Member
                    </button>
                </div>
            )}

            {/* Active Members */}
            <div className="card">
                <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-secondary)] rounded-t-xl flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                        <Users className="w-4 h-4 text-emerald-400" /> Active Members ({members.length})
                    </h3>
                </div>
                <div className="divide-y divide-[var(--border)] bg-[var(--bg-primary)] rounded-b-xl">
                    {members.map(m => (
                        <div key={m.user_id} className="p-6 flex items-center justify-between hover:bg-[var(--bg-secondary)] transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold font-mono border border-indigo-500/30">
                                    {(m.full_name || m.email).charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[var(--text-primary)]">{m.full_name || 'No name provided'}</p>
                                    <p className="text-xs text-[var(--text-muted)]">{m.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                {/* Role Badge/Dropdown */}
                                {myRole === 'owner' && m.user_id !== user?.userId ? (
                                    <select
                                        value={m.role}
                                        onChange={(e) => handleChangeRole(m.user_id, e.target.value)}
                                        className="bg-[var(--bg-secondary)] border border-[var(--border)] text-xs text-[var(--text-primary)] rounded px-2 py-1 outline-none focus:border-indigo-500 transition-colors"
                                    >
                                        <option value="owner">Owner</option>
                                        <option value="admin">Admin</option>
                                        <option value="member">Member</option>
                                    </select>
                                ) : (
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${m.role === 'owner' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                        m.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                            'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                                        }`}>
                                        {m.role} {m.user_id === user?.userId && '(You)'}
                                    </span>
                                )}

                                {/* Leave Workspace Button (For the logged-in user) */}
                                {m.user_id === user?.userId && m.role !== 'owner' && (
                                    <button
                                        onClick={handleLeaveWorkspace}
                                        className="text-[var(--text-muted)] hover:text-red-400 p-1.5 hover:bg-red-400/10 rounded transition-colors"
                                        title="Leave workspace"
                                    >
                                        <Shield className="w-4 h-4 mr-1 inline" />Leave
                                    </button>
                                )}

                                {/* Remove Button */}
                                {isAdminOrOwner && m.role !== 'owner' && m.user_id !== user?.userId && (
                                    <button
                                        onClick={() => handleRemoveMember(m.user_id)}
                                        className="text-[var(--text-muted)] hover:text-red-400 p-1.5 hover:bg-red-400/10 rounded transition-colors"
                                        title="Remove member"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pending Invites */}
            {invites.length > 0 && (
                <div className="card mt-8">
                    <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-secondary)] rounded-t-xl">
                        <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-400" /> Pending Invites ({invites.length})
                        </h3>
                    </div>
                    <div className="divide-y divide-[var(--border)] bg-[var(--bg-primary)] rounded-b-xl">
                        {invites.map(inv => {
                            const isExpired = new Date(inv.expires_at) < new Date();
                            return (
                                <div key={inv.id} className="p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                                            <Mail className="w-4 h-4 text-zinc-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-[var(--text-primary)]">{inv.email}</p>
                                            <p className="text-xs text-[var(--text-muted)]">
                                                Invited as <span className="uppercase text-[10px] tracking-wider font-semibold text-zinc-300">{inv.role}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {isExpired ? (
                                            <span className="text-xs text-red-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Expired</span>
                                        ) : (
                                            <span className="text-xs text-zinc-400">Expires {new Date(inv.expires_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                        )}
                                        
                                        {(isAdminOrOwner || inv.inviter_id === user?.userId) && (
                                            <button
                                                onClick={() => handleCancelInvite(inv.id)}
                                                className="text-[var(--text-muted)] hover:text-red-400 p-1.5 hover:bg-red-400/10 rounded transition-colors"
                                                title="Cancel invitation"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
                        <button
                            onClick={() => setShowInviteModal(false)}
                            className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-white transition-colors p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="mb-6">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col items-center justify-center mb-4 text-indigo-400">
                                <Mail className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-1">Invite Team Member</h2>
                            <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                                An invitation link will be sent to their email. They will gain access to this workspace's campaigns and domains.
                            </p>
                        </div>

                        <form onSubmit={handleSendInvite} className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={inviteEmail}
                                    onChange={e => setInviteEmail(e.target.value)}
                                    placeholder="colleague@company.com"
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Access Role</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {(['member', 'admin'] as const).map(role => (
                                        <button
                                            key={role}
                                            type="button"
                                            onClick={() => setInviteRole(role)}
                                            className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-colors ${inviteRole === role
                                                ? 'bg-indigo-500/10 border-indigo-500 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                                                : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800'
                                                }`}
                                        >
                                            <Shield className={`w-4 h-4 ${inviteRole === role ? 'text-indigo-400' : 'text-zinc-500'}`} />
                                            <div>
                                                <div className="text-sm font-semibold capitalize bg-transparent">{role}</div>
                                                <div className="text-[10px] leading-tight mt-0.5 opacity-80 bg-transparent">
                                                    {role === 'admin' ? 'Can manage billing & domains' : 'Can manage campaigns'}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {inviteStatus === 'error' && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-xs font-medium mt-2 flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 shrink-0" />
                                    Failed to send invite. They may already be a member.
                                </div>
                            )}

                            {inviteStatus === 'success' && (
                                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-500 text-xs font-medium mt-2 flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                                    Invite sent successfully!
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={inviteStatus === 'sending' || inviteStatus === 'success'}
                                className="w-full btn-premium flex justify-center py-3 mt-2"
                                style={inviteStatus === 'success' ? { background: '#10B981', color: 'white' } : {}}
                            >
                                {inviteStatus === 'sending' ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : inviteStatus === 'success' ? (
                                    'Sent!'
                                ) : (
                                    'Send Invitation Link'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
