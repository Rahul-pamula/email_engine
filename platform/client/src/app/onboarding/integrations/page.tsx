'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plug, ArrowRight } from 'lucide-react';

export default function IntegrationsOnboarding() {
    const router = useRouter();
    const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const integrations = [
        { value: 'api_webhooks', label: 'API / Webhooks' },
        { value: 'web_app', label: 'Web Application' },
        { value: 'mobile_app', label: 'Mobile App' },
        { value: 'ecommerce', label: 'Ecommerce (Shopify-style)' },
        { value: 'not_sure', label: 'Not sure yet' },
    ];

    const toggleIntegration = (value: string) => {
        if (selectedIntegrations.includes(value)) {
            setSelectedIntegrations(selectedIntegrations.filter(i => i !== value));
        } else {
            setSelectedIntegrations([...selectedIntegrations, value]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        if (selectedIntegrations.length === 0) {
            setErrors({ integrations: 'Please select at least one option' });
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/onboarding/integrations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    integration_sources: selectedIntegrations,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save integrations');
            }

            router.push('/onboarding/scale');
        } catch (error) {
            console.error('Error saving integrations:', error);
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
                        Step 3 of 4
                    </p>
                    <div style={{
                        width: '100%',
                        height: '4px',
                        backgroundColor: '#e2e8f0',
                        borderRadius: '2px',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            width: '75%',
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
                        <Plug style={{ width: '28px', height: '28px', color: '#2563eb' }} />
                    </div>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: 700,
                        color: '#0f172a',
                        marginBottom: '12px',
                    }}>
                        Where will your events come from?
                    </h1>
                    <p style={{
                        fontSize: '14px',
                        color: '#64748b',
                        lineHeight: '1.5',
                    }}>
                        You can change this later.
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

                    {/* Integration Options */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {integrations.map((integration) => (
                            <label
                                key={integration.value}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '16px',
                                    border: `2px solid ${selectedIntegrations.includes(integration.value) ? '#2563eb' : '#e2e8f0'}`,
                                    borderRadius: '8px',
                                    backgroundColor: selectedIntegrations.includes(integration.value) ? '#eff6ff' : '#ffffff',
                                    cursor: 'pointer',
                                    transition: 'all 150ms ease',
                                }}
                            >
                                <input
                                    type="checkbox"
                                    value={integration.value}
                                    checked={selectedIntegrations.includes(integration.value)}
                                    onChange={() => toggleIntegration(integration.value)}
                                    disabled={loading}
                                    style={{
                                        width: '18px',
                                        height: '18px',
                                        cursor: 'pointer',
                                    }}
                                />
                                <p style={{
                                    fontSize: '16px',
                                    fontWeight: 500,
                                    color: '#0f172a',
                                    margin: 0,
                                }}>
                                    {integration.label}
                                </p>
                            </label>
                        ))}
                    </div>

                    {errors.integrations && (
                        <p style={{ fontSize: '14px', color: '#dc2626' }}>
                            {errors.integrations}
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
