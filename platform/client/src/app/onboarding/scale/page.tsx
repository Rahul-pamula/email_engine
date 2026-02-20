'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, ArrowRight } from 'lucide-react';

export default function ScaleOnboarding() {
    const router = useRouter();
    const [selectedScale, setSelectedScale] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const scaleOptions = [
        { value: 'testing', label: 'Just testing' },
        { value: 'less_1k', label: 'Less than 1,000' },
        { value: '1k_10k', label: '1,000 – 10,000' },
        { value: '10k_plus', label: '10,000+' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        if (!selectedScale) {
            setErrors({ scale: 'Please select an option' });
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/onboarding/scale`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    expected_scale: selectedScale,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save scale');
            }

            router.push('/onboarding/complete');
        } catch (error) {
            console.error('Error saving scale:', error);
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
                    <p className="text-center text-sm font-medium text-[var(--text-muted)]">Step 4 of 4</p>
                    <div className="mt-2 h-1 w-full rounded-full bg-[var(--border)]">
                        <div className="h-1 w-full rounded-full bg-[var(--accent)]"></div>
                    </div>
                </div>

                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)]/10">
                        <TrendingUp className="h-6 w-6 text-[var(--accent)]" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mb-2">
                        How many events do you expect per month?
                    </h1>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                        Used only to set sensible defaults.
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
                        {scaleOptions.map((option) => (
                            <label
                                key={option.value}
                                className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedScale === option.value
                                        ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                                        : 'border-[var(--border)] hover:border-[var(--accent)]/50'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="scale"
                                    value={option.value}
                                    checked={selectedScale === option.value}
                                    onChange={(e) => setSelectedScale(e.target.value)}
                                    disabled={loading}
                                    className="w-4 h-4 cursor-pointer accent-[var(--accent)]"
                                />
                                <p className="text-sm font-medium text-[var(--text-primary)]">{option.label}</p>
                            </label>
                        ))}
                    </div>

                    {errors.scale && (
                        <p className="text-sm text-[var(--danger)]">{errors.scale}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-3.5 px-6 text-base font-semibold text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : 'Finish Setup'}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>
                </form>
            </div>
        </div>
    );
}
