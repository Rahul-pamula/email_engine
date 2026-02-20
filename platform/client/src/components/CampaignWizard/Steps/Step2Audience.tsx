"use client";

import { useState, useEffect } from "react";
import { Check, Search, Users, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
// MOCK DATA until we wire up the API
// In real implementation, this comes from GET /contacts/lists (which we need to build or mock)
// For now, we'll fetch actual contacts or use a placeholder list logic

export default function Step2Audience({ data, updateData, onNext, onBack }: any) {
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [lists, setLists] = useState<any[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        // Fetch Lists (Mocking logic for now as we didn't explicitly build LIST CRUD yet in Phase 1)
        // We will just show "All Contacts" as the default option
        const fetchLists = async () => {
            try {
                // In a real app, GET /contacts/lists
                // For now, we simulate one main list "All Subscribers"
                await new Promise(r => setTimeout(r, 600));
                setLists([
                    { id: "all", name: "All Subscribers", count: 12450, type: "Master List" },
                    { id: "segment_vip", name: "VIP Customers", count: 850, type: "Segment" },
                    { id: "segment_active", name: "Active Last 30 Days", count: 3200, type: "Segment" },
                ]);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLists();
    }, []);

    const filtered = lists.filter(l => l.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="p-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Select Audience</h2>
            <p className="text-sm text-slate-500 mb-6">Who should receive this campaign?</p>

            {/* Search */}
            <div className="relative max-w-md mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search lists/segments..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Lists Grid */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map(list => {
                        const isSelected = data.listId === list.id;
                        return (
                            <div
                                key={list.id}
                                onClick={() => updateData({ listId: list.id, listName: list.name })}
                                className={`
                                    relative p-4 rounded-lg border-2 cursor-pointer transition-all
                                    ${isSelected
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-slate-200 hover:border-blue-300 bg-white'}
                                `}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className={`font-medium ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>{list.name}</h3>
                                            <p className="text-xs text-slate-500">{list.count.toLocaleString()} contacts • {list.type}</p>
                                        </div>
                                    </div>
                                    {isSelected && (
                                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                    )}
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
                    disabled={!data.listId}
                    className={`
                        px-6 py-2.5 rounded-lg text-sm font-medium transition-colors
                        ${data.listId
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
