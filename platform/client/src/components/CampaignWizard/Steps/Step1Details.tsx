"use client";

import { ArrowRight } from "lucide-react";

interface StepProps {
    data: any;
    updateData: (data: any) => void;
    onNext: () => void;
    onBack?: () => void;
}

export default function Step1Details({ data, updateData, onNext }: StepProps) {

    const isValid = data.name.length > 0 && data.subject.length > 0;

    return (
        <div className="p-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Campaign Details</h2>

            <div className="space-y-6 max-w-2xl">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Campaign Name
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => updateData({ name: e.target.value })}
                        placeholder="e.g. March Newsletter"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                        Internal name, not visible to recipients.
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Subject Line
                    </label>
                    <input
                        type="text"
                        value={data.subject}
                        onChange={(e) => updateData({ subject: e.target.value })}
                        placeholder="e.g. Big News! 50% Off Everything"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="mt-10 flex justify-end">
                <button
                    onClick={onNext}
                    disabled={!isValid}
                    className={`
                        flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors
                        ${isValid
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
                    `}
                >
                    Next Step <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
