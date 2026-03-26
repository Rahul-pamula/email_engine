"use client";

import { useState, useEffect, useRef } from "react";
import {
    LayoutTemplate, PenLine,
    Check, Search, Loader2, X, Paperclip, Upload
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui";

type ContentMode = 'compose' | 'template';

const MODES = [
    {
        id: 'compose' as ContentMode,
        icon: PenLine,
        label: 'Compose Email',
        description: 'Write text, add attachments — like Gmail',
    },
    {
        id: 'template' as ContentMode,
        icon: LayoutTemplate,
        label: 'Use a Template',
        description: 'Pick a saved design from your library',
    },
];

export default function Step3Content({ data, updateData, onNext, onBack }: any) {
    const { token } = useAuth();
    const [mode, setMode] = useState<ContentMode>(data.contentMode || 'compose');
    const [templates, setTemplates] = useState<any[]>([]);
    const [loadingTemplates, setLoadingTemplates] = useState(false);
    const [search, setSearch] = useState("");
    const [bodyText, setBodyText] = useState(data.bodyText || "");
    const [attachments, setAttachments] = useState<File[]>([]);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (mode !== 'template' || !token) return;
        setLoadingTemplates(true);
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        fetch(`${API_BASE}/templates/`, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(r => r.ok ? r.json() : { data: [] })
            .then(json => setTemplates(Array.isArray(json.data) ? json.data : []))
            .catch(() => setTemplates([]))
            .finally(() => setLoadingTemplates(false));
    }, [mode, token]);

    const handleModeChange = (m: ContentMode) => {
        setMode(m);
        updateData({ contentMode: m, templateId: '', templateName: '', htmlContent: '', bodyText: '' });
        setBodyText('');
    };

    const handleBodyChange = (val: string) => {
        setBodyText(val);
        const html = `<div style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#111;">${val.replace(/\n/g, '<br/>')}</div>`;
        updateData({ bodyText: val, htmlContent: html, contentMode: 'compose', templateName: 'Composed Email', attachments });
    };

    const handleTemplateSelect = (t: any) => {
        updateData({ templateId: t.id, templateName: t.name, htmlContent: t.compiled_html, contentMode: 'template' });
    };

    const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const updated = [...attachments, ...files].slice(0, 5);
        setAttachments(updated);
        updateData({ attachments: updated });
    };

    const removeFile = (idx: number) => {
        const updated = attachments.filter((_, i) => i !== idx);
        setAttachments(updated);
        updateData({ attachments: updated });
    };

    const canProceed = () => {
        if (mode === 'compose') return bodyText.trim().length > 10;
        if (mode === 'template') return !!data.templateId;
        return false;
    };

    const filtered = templates.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="p-9">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-[var(--radius)] bg-[var(--accent-glow)] border border-[var(--accent)] flex items-center justify-center">
                    <PenLine className="w-4.5 h-4.5 text-[var(--accent-purple)]" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-[var(--text-primary)] m-0">Email Content</h2>
                    <p className="text-sm text-[var(--text-secondary)] m-0 mt-0.5">How do you want to write this campaign?</p>
                </div>
            </div>

            {/* Mode Toggle — 2 options */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                {MODES.map(m => {
                    const Icon = m.icon;
                    const isActive = mode === m.id;
                    return (
                        <button
                            key={m.id}
                            onClick={() => handleModeChange(m.id)}
                            className={`
                                p-4 rounded-[var(--radius-lg)] text-left border transition-all duration-200
                                ${isActive ? 'border-[var(--accent-purple)] bg-[var(--accent-purple)]/10' : 'border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)]'}
                            `}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--accent-purple)]' : 'text-[var(--text-muted)]'}`} />
                                <span className={`text-sm font-semibold ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>{m.label}</span>
                                {isActive && (
                                    <span className="ml-auto w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                                        <Check className="w-2.5 h-2.5 text-white" />
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] m-0">{m.description}</p>
                        </button>
                    );
                })}
            </div>

            {/* ── COMPOSE MODE (plain text + optional file attach) ── */}
            {mode === 'compose' && (
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-medium text-[var(--text-muted)] mb-2">Email Body</label>
                        <textarea
                            placeholder={"Hi {{first_name}},\n\nWrite your message here...\n\nBest regards,\nYour Team"}
                            value={bodyText}
                            onChange={e => handleBodyChange(e.target.value)}
                            className="w-full p-3.5 bg-[var(--bg-input)] border border-[var(--border)] rounded-[var(--radius-lg)] text-[var(--text-primary)] text-sm outline-none resize-y min-h-[160px] leading-relaxed font-inherit focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
                        />
                        <p className="text-xs text-[var(--text-secondary)] mt-1.5">
                            Use <code className="text-[var(--accent-purple)] bg-[var(--accent-purple)]/10 px-1.5 py-0.5 rounded-[var(--radius-sm)]">{'{{first_name}}'}</code> &nbsp;
                            <code className="text-[var(--accent-purple)] bg-[var(--accent-purple)]/10 px-1.5 py-0.5 rounded-[var(--radius-sm)]">{'{{last_name}}'}</code> for personalization
                        </p>
                    </div>

                    {/* Attachment Section */}
                    <div>
                        <label className="block text-xs font-medium text-[var(--text-muted)] mb-2">
                            <Paperclip className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                            Attachments <span className="text-[var(--text-secondary)]">(optional, max 5)</span>
                        </label>
                        <div
                            onClick={() => fileRef.current?.click()}
                            className="border border-dashed border-[var(--border)] rounded-[var(--radius-lg)] p-5 text-center cursor-pointer bg-[var(--bg-input)]/50 hover:border-[var(--accent-purple)] hover:bg-[var(--bg-hover)] transition-all"
                        >
                            <Upload className="w-4 h-4 text-[var(--text-secondary)] mx-auto mb-2" />
                            <p className="text-[var(--text-secondary)] text-xs m-0">Click to attach files — PDF, PNG, JPG, DOCX</p>
                            <input ref={fileRef} type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.docx,.xlsx,.csv"
                                onChange={handleFilePick} className="hidden" />
                        </div>

                        {attachments.length > 0 && (
                            <div className="mt-3 flex flex-col gap-1.5">
                                {attachments.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between py-2 px-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius)]">
                                        <div className="flex items-center gap-2">
                                            <Paperclip className="w-3.5 h-3.5 text-[var(--accent-purple)]" />
                                            <span className="text-xs text-[var(--text-primary)]">{file.name}</span>
                                            <span className="text-[11px] text-[var(--text-secondary)]">({(file.size / 1024).toFixed(0)} KB)</span>
                                        </div>
                                        <button onClick={() => removeFile(idx)} className="text-[var(--text-secondary)] hover:text-[var(--danger)] transition-colors p-0.5">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── TEMPLATE MODE ── */}
            {mode === 'template' && (
                <div>
                    <div className="relative max-w-sm mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                        <input type="text" placeholder="Search templates..." value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full py-2.5 pl-9 pr-4 bg-[var(--bg-input)] border border-[var(--border)] rounded-[var(--radius-lg)] text-[var(--text-primary)] text-sm outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
                        />
                    </div>

                    {loadingTemplates ? (
                        <div className="flex justify-center p-10">
                            <Loader2 className="w-6 h-6 text-[var(--accent-purple)] animate-spin" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center p-8 border border-dashed border-[var(--border)] rounded-[var(--radius-lg)]">
                            <LayoutTemplate className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-3" />
                            <p className="text-[var(--text-secondary)] text-sm mb-1">No templates found.</p>
                            <p className="text-[var(--text-muted)] text-xs">Build one in <strong className="text-[var(--text-primary)]">Templates → Editor</strong>, or switch to Compose mode.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-3 max-h-[260px] overflow-y-auto pr-1 custom-scrollbar">
                            {filtered.map(t => {
                                const isSelected = data.templateId === t.id;
                                return (
                                    <div key={t.id} onClick={() => handleTemplateSelect(t)}
                                        className={`
                                            rounded-[var(--radius-lg)] cursor-pointer overflow-hidden border transition-all duration-200 relative
                                            ${isSelected ? 'border-[var(--accent-purple)] bg-[var(--accent-purple)]/10' : 'border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--text-muted)]'}
                                        `}
                                    >
                                        <div className="aspect-[16/9] bg-black/40 flex items-center justify-center">
                                            <LayoutTemplate className="w-5 h-5 text-[var(--text-muted)]" />
                                            {isSelected && (
                                                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                                    <Check className="w-2.5 h-2.5 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-2.5">
                                            <p className="text-xs font-semibold text-[var(--text-primary)] m-0 truncate">{t.name}</p>
                                            <p className="text-[10px] text-[var(--text-secondary)] m-0 mt-0.5">{new Date(t.updated_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Footer */}
            <div className="flex justify-between mt-8 pt-6 border-t border-[var(--border)]">
                <Button variant="ghost" onClick={onBack}>
                    ← Back
                </Button>
                <Button
                    onClick={onNext}
                    disabled={!canProceed()}
                    variant={canProceed() ? 'primary' : 'secondary'}
                >
                    Next Step →
                </Button>
            </div>
        </div>
    );
}
