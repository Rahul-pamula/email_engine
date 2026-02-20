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
        <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] p-4">
            <div className="w-full max-w-lg rounded-2xl bg-[var(--bg-card)] p-8 shadow-xl border border-[var(--border)]">
                {/* Progress Indicator */}
                <div className="mb-4">
                    <p className="text-center text-sm font-medium text-[var(--text-muted)]">Step 2 of 4</p>
                    <div className="mt-2 h-1 w-full rounded-full bg-[var(--border)]">
                        <div className="h-1 w-1/2 rounded-full bg-[var(--accent)]"></div>
                    </div>
                </div>

                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)]/10">
                        <Target className="h-6 w-6 text-[var(--accent)]" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mb-2">
                        How do you plan to use Email Engine?
                    </h1>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                        This helps us personalize your setup.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {errors.general && (
                        <div className="p-3 bg-[var(--danger)]/10 border border-[var(--danger)]/20 rounded-lg text-[var(--danger)] text-sm">
                            {errors.general}
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        {useCases.map((useCase) => (
                            <label
                                key={useCase.value}
                                className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedUseCase === useCase.value
                                        ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                                        : 'border-[var(--border)] hover:border-[var(--accent)]/50'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="useCase"
                                    value={useCase.value}
                                    checked={selectedUseCase === useCase.value}
                                    onChange={(e) => setSelectedUseCase(e.target.value)}
                                    disabled={loading}
                                    className="mt-0.5 w-4 h-4 cursor-pointer accent-[var(--accent)]"
                                />
                                <div>
                                    <p className="text-sm font-semibold text-[var(--text-primary)]">{useCase.label}</p>
                                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{useCase.description}</p>
                                </div>
                            </label>
                        ))}
                    </div>

                    {errors.useCase && (
                        <p className="text-sm text-[var(--danger)]">{errors.useCase}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-3.5 px-6 text-base font-semibold text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : 'Continue'}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>
                </form>
            </div>
        </div>
    );
}
