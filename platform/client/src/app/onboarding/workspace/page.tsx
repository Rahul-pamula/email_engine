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
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            padding: '24px',
        }}>
            <div style={{
                width: '100%',
                maxWidth: '600px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '48px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}>
                {/* Progress Indicator */}
                <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                    <p style={{
                        fontSize: '14px',
                        color: '#64748b',
                        fontWeight: 500,
                        marginBottom: '8px',
                    }}>
                        Step 1 of 4
                    </p>
                    <div style={{
                        width: '100%',
                        height: '4px',
                        backgroundColor: '#e2e8f0',
                        borderRadius: '2px',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            width: '25%',
                            height: '100%',
                            backgroundColor: '#2563eb',
                            transition: 'width 300ms ease',
                        }} />
                    </div>
                </div>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        backgroundColor: '#dbeafe',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px auto',
                    }}>
                        <Building2 style={{ width: '28px', height: '28px', color: '#2563eb' }} />
                    </div>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: 700,
                        color: '#0f172a',
                        marginBottom: '12px',
                    }}>
                        Set up your workspace
                    </h1>
                    <p style={{
                        fontSize: '16px',
                        color: '#64748b',
                        lineHeight: '1.5',
                    }}>
                        This helps us configure your environment correctly.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {errors.general && (
                        <div style={{
                            padding: '12px 16px',
                            backgroundColor: '#fee2e2',
                            border: '1px solid #fecaca',
                            borderRadius: '8px',
                            color: '#dc2626',
                            fontSize: '14px',
                        }}>
                            {errors.general}
                        </div>
                    )}

                    {/* Workspace Name */}
                    <div>
                        <label htmlFor="workspaceName" style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#0f172a',
                            marginBottom: '8px',
                        }}>
                            Workspace / Company Name
                        </label>
                        <input
                            type="text"
                            id="workspaceName"
                            value={formData.workspaceName}
                            onChange={(e) => setFormData({ ...formData, workspaceName: e.target.value })}
                            placeholder="Acme Corporation"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                fontSize: '16px',
                                border: `1px solid ${errors.workspaceName ? '#fca5a5' : '#e2e8f0'}`,
                                borderRadius: '8px',
                                backgroundColor: errors.workspaceName ? '#fef2f2' : '#ffffff',
                                outline: 'none',
                            }}
                        />
                        {errors.workspaceName && (
                            <p style={{ fontSize: '14px', color: '#dc2626', marginTop: '6px' }}>
                                {errors.workspaceName}
                            </p>
                        )}
                    </div>

                    {/* Role */}
                    <div>
                        <label htmlFor="role" style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#0f172a',
                            marginBottom: '8px',
                        }}>
                            Your Role
                        </label>
                        <select
                            id="role"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                fontSize: '16px',
                                border: `1px solid ${errors.role ? '#fca5a5' : '#e2e8f0'}`,
                                borderRadius: '8px',
                                backgroundColor: errors.role ? '#fef2f2' : '#ffffff',
                                outline: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            <option value="">Select your role</option>
                            {roles.map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                        {errors.role && (
                            <p style={{ fontSize: '14px', color: '#dc2626', marginTop: '6px' }}>
                                {errors.role}
                            </p>
                        )}
                    </div>

                    {/* Continue Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px 24px',
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#ffffff',
                            backgroundColor: '#2563eb',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.6 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            marginTop: '8px',
                        }}
                    >
                        {loading ? 'Saving...' : 'Continue'}
                        {!loading && <ArrowRight style={{ width: '18px', height: '18px' }} />}
                    </button>
                </form>
            </div>
        </div>
    );
}
