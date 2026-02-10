'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Target, ArrowRight } from 'lucide-react';

export default function UseCaseOnboarding() {
    const router = useRouter();
    const [selectedUseCase, setSelectedUseCase] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const useCases = [
        { value: 'transactional', label: 'Transactional emails', description: 'OTP, alerts, system emails' },
        { value: 'marketing', label: 'Marketing campaigns', description: 'Newsletters, promotions' },
        { value: 'event_based', label: 'Event-based automation', description: 'Triggered by user actions' },
        { value: 'exploring', label: 'Just exploring', description: 'Learning about the platform' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        if (!selectedUseCase) {
            setErrors({ useCase: 'Please select a use case' });
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/onboarding/use-case`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    primary_use_case: selectedUseCase,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save use case');
            }

            router.push('/onboarding/integrations');
        } catch (error) {
            console.error('Error saving use case:', error);
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
                        Step 2 of 4
                    </p>
                    <div style={{
                        width: '100%',
                        height: '4px',
                        backgroundColor: '#e2e8f0',
                        borderRadius: '2px',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            width: '50%',
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
                        <Target style={{ width: '28px', height: '28px', color: '#2563eb' }} />
                    </div>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: 700,
                        color: '#0f172a',
                        marginBottom: '12px',
                    }}>
                        How do you plan to use Email Engine?
                    </h1>
                    <p style={{
                        fontSize: '14px',
                        color: '#64748b',
                        lineHeight: '1.5',
                    }}>
                        This helps us personalize your setup.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

                    {/* Use Case Options */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {useCases.map((useCase) => (
                            <label
                                key={useCase.value}
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    padding: '16px',
                                    border: `2px solid ${selectedUseCase === useCase.value ? '#2563eb' : '#e2e8f0'}`,
                                    borderRadius: '8px',
                                    backgroundColor: selectedUseCase === useCase.value ? '#eff6ff' : '#ffffff',
                                    cursor: 'pointer',
                                    transition: 'all 150ms ease',
                                }}
                            >
                                <input
                                    type="radio"
                                    name="useCase"
                                    value={useCase.value}
                                    checked={selectedUseCase === useCase.value}
                                    onChange={(e) => setSelectedUseCase(e.target.value)}
                                    disabled={loading}
                                    style={{
                                        marginTop: '2px',
                                        width: '18px',
                                        height: '18px',
                                        cursor: 'pointer',
                                    }}
                                />
                                <div style={{ flex: 1 }}>
                                    <p style={{
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        color: '#0f172a',
                                        marginBottom: '4px',
                                    }}>
                                        {useCase.label}
                                    </p>
                                    <p style={{
                                        fontSize: '14px',
                                        color: '#64748b',
                                        margin: 0,
                                    }}>
                                        {useCase.description}
                                    </p>
                                </div>
                            </label>
                        ))}
                    </div>

                    {errors.useCase && (
                        <p style={{ fontSize: '14px', color: '#dc2626' }}>
                            {errors.useCase}
                        </p>
                    )}

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
