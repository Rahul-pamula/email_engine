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

    const [selectedMode, setSelectedMode] = useState<"rich_text" | "grapesjs">("rich_text");
    const [creating, setCreating] = useState(false);

    const handleCreate = async () => {
        setCreating(true);

        try {
            const res = await fetch(`${API_BASE}/templates`, {
                method: "POST",
                headers: apiHeaders(token!),
                body: JSON.stringify({
                    name: "Untitled Template",
                    subject: "",
                    category: "marketing",
                    mjml_json: { editor: selectedMode },
                    compiled_html: "<div><p><br></p></div>"
                })
            });

            if (res.ok) {
                const data = await res.json();
                if (selectedMode === "rich_text") {
                    router.push(`/templates/${data.id}/editor`);
                } else {
                    router.push(`/templates/${data.id}/builder`);
                }
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
        primary: "#3B82F6",
        bg: "#0A0A0B",
        text: "#F3F4F6",
        textSecondary: "#9CA3AF",
        border: "#374151",
        selected: "rgba(59, 130, 246, 0.1)",
        selectedBorder: "#3B82F6",
        cardBg: "#111113"
    };

    if (authLoading) return <div>Loading...</div>;

    return (
        <div style={{ maxWidth: "800px", margin: "40px auto", fontFamily: "Inter, sans-serif", padding: "0 20px" }}>
            <button
                onClick={() => router.back()}
                style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", color: colors.textSecondary, marginBottom: "24px" }}
            >
                <ChevronLeft size={16} /> Back
            </button>

            <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <h1 style={{ fontSize: "28px", fontWeight: 600, marginBottom: "8px", color: colors.text }}>Create New Template</h1>
                <p style={{ color: colors.textSecondary, fontSize: "15px" }}>Choose how you want to build your email.</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px", maxWidth: "600px", margin: "0 auto 32px auto" }}>
                {/* Option 1: Basic Rich Text */}
                <div
                    onClick={() => setSelectedMode("rich_text")}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        border: `2px solid ${selectedMode === "rich_text" ? colors.selectedBorder : colors.border}`,
                        borderRadius: "12px",
                        cursor: "pointer",
                        padding: "24px",
                        backgroundColor: selectedMode === "rich_text" ? colors.selected : colors.cardBg,
                        transition: "all 0.2s"
                    }}
                >
                    <div style={{ padding: "16px", backgroundColor: selectedMode === "rich_text" ? "rgba(59, 130, 246, 0.2)" : "#1F2937", borderRadius: "12px", color: selectedMode === "rich_text" ? colors.primary : colors.textSecondary }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7V4h16v3" /><path d="M9 20h6" /><path d="M12 4v16" /></svg>
                    </div>
                    <div>
                        <h3 style={{ fontSize: "17px", fontWeight: 600, margin: "0 0 6px 0", color: colors.text }}>
                            Basic Email (Rich Text)
                        </h3>
                        <p style={{ fontSize: "14px", color: colors.textSecondary, margin: 0, lineHeight: "1.5" }}>
                            A simple, continuous text editor. Great for plain-text style campaigns, announcements, or personal messages.
                        </p>
                    </div>
                </div>

                {/* Option 2: Visual Drag and Drop */}
                <div
                    onClick={() => setSelectedMode("grapesjs")}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        border: `2px solid ${selectedMode === "grapesjs" ? colors.selectedBorder : colors.border}`,
                        borderRadius: "12px",
                        cursor: "pointer",
                        padding: "24px",
                        backgroundColor: selectedMode === "grapesjs" ? colors.selected : colors.cardBg,
                        transition: "all 0.2s"
                    }}
                >
                    <div style={{ padding: "16px", backgroundColor: selectedMode === "grapesjs" ? "rgba(59, 130, 246, 0.2)" : "#1F2937", borderRadius: "12px", color: selectedMode === "grapesjs" ? colors.primary : colors.textSecondary }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><rect x="7" y="7" width="3" height="9" /><rect x="14" y="7" width="3" height="5" /></svg>
                    </div>
                    <div>
                        <h3 style={{ fontSize: "17px", fontWeight: 600, margin: "0 0 6px 0", color: colors.text }}>
                            Drag & Drop Template
                        </h3>
                        <p style={{ fontSize: "14px", color: colors.textSecondary, margin: 0, lineHeight: "1.5" }}>
                            Build complex, beautiful layouts visually with blocks, columns, and custom styling.
                        </p>
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                    onClick={handleCreate}
                    disabled={creating}
                    style={{
                        padding: "14px 32px", backgroundColor: colors.primary, color: "white",
                        border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: 500,
                        cursor: creating ? "default" : "pointer", opacity: creating ? 0.7 : 1,
                        width: "100%", maxWidth: "600px"
                    }}
                >
                    {creating ? "Creating..." : "Continue to Editor"}
                </button>
            </div>
        </div>
    );
}
