"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ChevronLeft } from "lucide-react";

const API_BASE = "http://localhost:8000";

function apiHeaders(token: string) {
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };
}

import { TEMPLATE_PRESETS } from "../templatePresets";

export default function NewTemplatePage() {
    const { token, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [name, setName] = useState("");
    const [subject, setSubject] = useState("");
    const [category, setCategory] = useState("marketing");
    const [selectedPresetId, setSelectedPresetId] = useState("blank");
    const [creating, setCreating] = useState(false);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !subject) return;

        setCreating(true);

        // Find selected preset
        const preset = TEMPLATE_PRESETS.find(p => p.id === selectedPresetId) || TEMPLATE_PRESETS[0];

        try {
            const res = await fetch(`${API_BASE}/templates`, {
                method: "POST",
                headers: apiHeaders(token!),
                body: JSON.stringify({
                    name,
                    subject,
                    category,
                    mjml_json: preset.design || {}, // Unlayer design JSON if available
                    compiled_html: preset.compiledHtml || "<div>Start designing your email...</div>"
                })
            });

            if (res.ok) {
                const data = await res.json();
                router.push(`/templates/${data.id}`);
            } else {
                alert("Failed to create template");
            }
        } catch (err) {
            console.error(err);
            alert("Error creating template");
        } finally {
            setCreating(false);
        }
    };

    // Styles
    const colors = {
        primary: "#2563eb",
        bg: "var(--bg-primary)",
        text: "#1e293b",
        textSecondary: "#64748b",
        border: "#e2e8f0",
        selected: "#eff6ff",
        selectedBorder: "#2563eb"
    };

    if (authLoading) return <div>Loading...</div>;

    return (
        <div style={{ maxWidth: "1000px", margin: "40px auto", fontFamily: "Inter, sans-serif", padding: "0 20px" }}>
            <button
                onClick={() => router.back()}
                style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", color: colors.textSecondary, marginBottom: "24px" }}
            >
                <ChevronLeft size={16} /> Back
            </button>

            <h1 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "32px", color: colors.text }}>Create New Template</h1>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
                {/* Left: Form */}
                <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px", color: colors.text }}>
                            Template Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Monthly Newsletter"
                            required
                            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: `1px solid ${colors.border}`, fontSize: "14px" }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px", color: colors.text }}>
                            Email Subject
                        </label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="e.g. Only for you {{first_name}}!"
                            required
                            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: `1px solid ${colors.border}`, fontSize: "14px" }}
                        />
                        <p style={{ fontSize: "12px", color: colors.textSecondary, marginTop: "4px" }}>
                            You can use merge tags like {"{{first_name}}"}, {"{{email}}"}
                        </p>
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px", color: colors.text }}>
                            Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: `1px solid ${colors.border}`, fontSize: "14px", backgroundColor: "white" }}
                        >
                            <option value="marketing">Marketing</option>
                            <option value="transactional">Transactional</option>
                            <option value="newsletter">Newsletter</option>
                            <option value="education">Education</option>
                        </select>
                    </div>

                    <div style={{ paddingTop: "16px" }}>
                        <button
                            type="submit"
                            disabled={creating}
                            style={{
                                width: "100%", padding: "12px", backgroundColor: colors.primary, color: "white",
                                border: "none", borderRadius: "6px", fontSize: "14px", fontWeight: 500,
                                cursor: creating ? "default" : "pointer", opacity: creating ? 0.7 : 1
                            }}
                        >
                            {creating ? "Creating..." : "Create Template"}
                        </button>
                    </div>
                </form>

                {/* Right: Presets */}
                <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "16px", color: colors.text }}>
                        Choose a Starting Point
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        {TEMPLATE_PRESETS.map(preset => (
                            <div
                                key={preset.id}
                                onClick={() => setSelectedPresetId(preset.id)}
                                style={{
                                    border: `2px solid ${selectedPresetId === preset.id ? colors.selectedBorder : colors.border}`,
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    overflow: "hidden",
                                    backgroundColor: selectedPresetId === preset.id ? colors.selected : "white",
                                    transition: "all 0.2s"
                                }}
                            >
                                <div style={{ height: "100px", backgroundColor: "#f1f5f9", overflow: "hidden" }}>
                                    <img
                                        src={preset.thumbnail}
                                        alt={preset.name}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                </div>
                                <div style={{ padding: "12px" }}>
                                    <h3 style={{ fontSize: "14px", fontWeight: 600, margin: "0 0 4px 0", color: colors.text }}>
                                        {preset.name}
                                    </h3>
                                    <p style={{ fontSize: "12px", color: colors.textSecondary, margin: 0, lineHeight: "1.4" }}>
                                        {preset.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
