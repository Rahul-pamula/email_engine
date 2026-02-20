'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, ArrowRight } from 'lucide-react';

export default function WorkspaceOnboarding() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        workspaceName: '',
        role: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const roles = ['Founder', 'Developer', 'Marketer', 'Other'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        // Validation
        if (!formData.workspaceName.trim()) {
            setErrors({ workspaceName: 'Workspace name is required' });
            return;
        }
        if (!formData.role) {
            setErrors({ role: 'Please select your role' });
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/onboarding/workspace`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    workspace_name: formData.workspaceName,
                    user_role: formData.role,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save workspace info');
            }

            // Navigate to next step
            router.push('/onboarding/use-case');
        } catch (error) {
            console.error('Error saving workspace:', error);
            setErrors({ general: 'Failed to save. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] p-4">
            <div className="w-full max-w-lg rounded-2xl bg-[var(--bg-card)] p-8 shadow-xl border border-[var(--border)]">
                {/* Progress Indicator */}
                <div className="mb-4">
                    <p className="text-center text-sm font-medium text-[var(--text-muted)]">Step 1 of 4</p>
                    <div className="mt-2 h-1 w-full rounded-full bg-[var(--border)]">
                        <div className="h-1 w-1/4 rounded-full bg-[var(--accent)]"></div>
                    </div>
                </div>

                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)]/10">
                        <Building2 className="h-6 w-6 text-[var(--accent)]" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mb-2">
                        Set up your workspace
                    </h1>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                        This helps us configure your environment correctly.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {errors.general && (
                        <div className="p-3 bg-[var(--danger)]/10 border border-[var(--danger)]/20 rounded-lg text-[var(--danger)] text-sm">
                            {errors.general}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Workspace Name */}
                        <div>
                            <label htmlFor="workspaceName" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                Workspace / Company Name
                            </label>
                            <input
                                type="text"
                                id="workspaceName"
                                value={formData.workspaceName}
                                onChange={(e) => setFormData({ ...formData, workspaceName: e.target.value })}
                                placeholder="Acme Corporation"
                                disabled={loading}
                                className={`w-full px-4 py-3 text-base border rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] outline-none transition-colors ${errors.workspaceName ? 'border-[var(--danger)]' : 'border-[var(--border)] focus:border-[var(--accent)]'
                                    }`}
                            />
                            {errors.workspaceName && (
                                <p className="text-sm text-[var(--danger)] mt-1.5">
                                    {errors.workspaceName}
                                </p>
                            )}
                        </div>

                        {/* Role */}
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                Your Role
                            </label>
                            <select
                                id="role"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                disabled={loading}
                                className={`w-full px-4 py-3 text-base border rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] outline-none transition-colors cursor-pointer ${errors.role ? 'border-[var(--danger)]' : 'border-[var(--border)] focus:border-[var(--accent)]'
                                    }`}
                            >
                                <option value="">Select your role</option>
                                {roles.map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </select>
                            {errors.role && (
                                <p className="text-sm text-[var(--danger)] mt-1.5">
                                    {errors.role}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Continue Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-3.5 px-6 text-base font-semibold text-white bg-[var(--accent)] hover:bg-blue-600 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : 'Continue'}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>
                </form>
            </div>
        </div>
    );
}
