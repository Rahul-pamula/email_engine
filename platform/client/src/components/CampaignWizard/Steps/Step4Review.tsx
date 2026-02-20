"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Send,
    CheckCircle2,
    FileText,
    Users,
    LayoutTemplate,
    AlertTriangle,
    Loader2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Step4Review({ data, onBack }: any) {
    const router = useRouter();
    const { token, user } = useAuth();
    const tenantId = user?.tenantId;
    const [status, setStatus] = useState<'idle' | 'creating' | 'sending' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState("");

    const handleLaunch = async () => {
        if (!token || !tenantId) return;
        setStatus('creating');
        setErrorMsg("");

        try {
            // 1. Create Campaign
            const createRes = await fetch('http://127.0.0.1:8000/campaigns/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: data.name,
                    subject: data.subject,
                    body_html: data.htmlContent, // Snapshotting current content
                    status: 'draft',
                    scheduled_at: data.scheduledAt
                })
            });

            if (!createRes.ok) {
                const err = await createRes.json();
                throw new Error(err.detail || "Failed to create campaign");
            }

            const { id: campaignId } = await createRes.json();

            // 2. Trigger Send (Orchestration)
            setStatus('sending');
            const sendRes = await fetch(`http://127.0.0.1:8000/campaigns/${campaignId}/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    contact_list_id: data.listId, // Project ID or specific list
                    // Test emails can be added here if needed
                })
            });

            if (!sendRes.ok) {
                const err = await sendRes.json();
                throw new Error(err.detail || "Failed to launch campaign");
            }

            setStatus('success');

            // Redirect after delay
            setTimeout(() => {
                router.push("/campaigns");
            }, 2000);

        } catch (err: any) {
            console.error(err);
            setStatus('error');
            setErrorMsg(err.message);
        }
    };

    if (status === 'success') {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-[400px]">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Campaign Launched!</h2>
                <p className="text-slate-500 max-w-md">
                    "<strong>{data.name}</strong>" has been queued. Our delivery engine is now processing your list and preparing emails.
                </p>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Review & Launch</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Summary Card */}
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-4">
                    <div className="flex items-start gap-4">
                        <FileText className="w-5 h-5 text-slate-400 mt-1" />
                        <div>
                            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Campaign</span>
                            <h3 className="text-slate-900 font-medium">{data.name}</h3>
                            <p className="text-sm text-slate-500">Subject: {data.subject}</p>
                        </div>
                    </div>

                    <div className="w-full h-px bg-slate-200" />

                    <div className="flex items-start gap-4">
                        <Users className="w-5 h-5 text-slate-400 mt-1" />
                        <div>
                            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Audience</span>
                            <h3 className="text-slate-900 font-medium">{data.listName}</h3>
                        </div>
                    </div>

                    <div className="w-full h-px bg-slate-200" />

                    <div className="flex items-start gap-4">
                        <LayoutTemplate className="w-5 h-5 text-slate-400 mt-1" />
                        <div>
                            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Template</span>
                            <h3 className="text-slate-900 font-medium">{data.templateName}</h3>
                        </div>
                    </div>
                </div>

                {/* Preview Thumbnail (Mock) */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col">
                    <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 text-xs text-slate-500 flex justify-between">
                        <span>Preview</span>
                        <span>Desktop</span>
                    </div>
                    <div className="flex-1 bg-white p-4 overflow-y-auto max-h-[250px] text-[10px] origin-top scale-90 relative">
                        {/* Render HTML content safely - simplistic view */}
                        <div dangerouslySetInnerHTML={{ __html: data.htmlContent }} className="pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {status === 'error' && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 text-red-700">
                    <AlertTriangle className="w-5 h-5" />
                    <span>{errorMsg}</span>
                </div>
            )}

            {/* Action Bar */}
            <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                <button
                    onClick={onBack}
                    disabled={status === 'creating' || status === 'sending'}
                    className="text-slate-600 font-medium hover:text-slate-900 px-4 py-2"
                >
                    Back
                </button>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-500">
                        Ready to blast off? 🚀
                    </span>
                    <button
                        onClick={handleLaunch}
                        disabled={status === 'creating' || status === 'sending'}
                        className={`
                            flex items-center gap-2 px-8 py-3 rounded-lg text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all
                            ${status === 'creating' || status === 'sending'
                                ? 'bg-blue-400 cursor-wait'
                                : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5'}
                        `}
                    >
                        {status === 'creating' ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
                        ) : status === 'sending' ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Queuing...</>
                        ) : (
                            <><Send className="w-4 h-4" /> Launch Campaign</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
