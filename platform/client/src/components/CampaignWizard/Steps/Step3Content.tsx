"use client";

import { useState, useEffect } from "react";
import { Check, Search, LayoutTemplate, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Step3Content({ data, updateData, onNext, onBack }: any) {
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [templates, setTemplates] = useState<any[]>([]);
    const [search, setSearch] = useState("");

    // Fetch Templates from Backend
    useEffect(() => {
        const fetchTemplates = async () => {
            if (!token) return;
            try {
                // Using the actual Template API we built in Phase 3
                const res = await fetch('http://127.0.0.1:8000/templates/', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const json = await res.json();
                    setTemplates(json.templates || []);
                }
            } catch (err) {
                console.error("Failed to fetch templates:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTemplates();
    }, [token]);

    const filtered = templates.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="p-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Select Content</h2>
            <p className="text-sm text-slate-500 mb-6">Choose a template for your campaign.</p>

            {/* Search */}
            <div className="relative max-w-md mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search templates..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Templates Grid */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
                    {filtered.map(template => {
                        const isSelected = data.templateId === template.id;
                        return (
                            <div
                                key={template.id}
                                onClick={() => updateData({
                                    templateId: template.id,
                                    templateName: template.name,
                                    htmlContent: template.compiled_html // Store for preview in next step
                                })}
                                className={`
                                    relative p-4 rounded-lg border-2 cursor-pointer transition-all flex flex-col gap-3
                                    ${isSelected
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-slate-200 hover:border-blue-300 bg-white'}
                                `}
                            >
                                {/* Thumbnail Placeholder */}
                                <div className="aspect-[16/9] bg-slate-100 rounded-md flex items-center justify-center text-slate-400 overflow-hidden relative">
                                    {template.thumbnail ? (
                                        <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <LayoutTemplate className="w-8 h-8" />
                                    )}
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h3 className={`font-medium truncate ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
                                        {template.name}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Edited {new Date(template.updated_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="mt-10 flex justify-between">
                <button onClick={onBack} className="text-slate-600 font-medium hover:text-slate-900 px-4 py-2">
                    Back
                </button>
                <button
                    onClick={onNext}
                    disabled={!data.templateId}
                    className={`
                        px-6 py-2.5 rounded-lg text-sm font-medium transition-colors
                        ${data.templateId
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
                    `}
                >
                    Next Step
                </button>
            </div>
        </div>
    );
}
