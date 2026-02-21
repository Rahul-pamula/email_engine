"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// Dynamically import ReactQuill to prevent "document is not defined" SSR errors
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const API_BASE = "http://localhost:8000";

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["link", "image"],
        ["clean"],
    ],
};

const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "align",
    "link",
    "image",
];

export default function BasicEditorPage() {
    const { id } = useParams();
    const router = useRouter();
    const { token, isLoading: authLoading } = useAuth();

    const [template, setTemplate] = useState<any>(null);
    const [content, setContent] = useState("");
    const [name, setName] = useState("");
    const [subject, setSubject] = useState("");
    const [category, setCategory] = useState("marketing");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!authLoading && token && id) {
            fetchTemplate();
        }
    }, [authLoading, token, id]);

    const fetchTemplate = async () => {
        try {
            const res = await fetch(`${API_BASE}/templates/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setTemplate(data);
                setName(data.name);
                setSubject(data.subject);
                setCategory(data.category || "marketing");
                // If the template was just created from Blank, it'll have the fallback text
                setContent(data.compiled_html || "");
            }
        } catch (err) {
            console.error("Failed to load template:", err);
            alert("Failed to load template");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Send exactly what the user typed as the compiled_html
            // We retain the mjml_json.editor flag so it keeps opening in this editor
            const res = await fetch(`${API_BASE}/templates/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    subject,
                    category,
                    compiled_html: content,
                    mjml_json: { editor: "rich_text" }
                })
            });

            if (res.ok) {
                router.push("/templates");
            } else {
                alert("Failed to save template");
            }
        } catch (err) {
            console.error(err);
            alert("Error saving template");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#F9FAFB", color: "#6B7280" }}>
                <Loader2 size={32} className="animate-spin" />
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#F9FAFB", fontFamily: "Inter, sans-serif" }}>
            {/* Top Toolbar */}
            <div style={{
                height: "64px",
                backgroundColor: "white",
                borderBottom: "1px solid #E5E7EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 24px",
                flexShrink: 0
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <button
                        onClick={() => router.push("/templates")}
                        style={{
                            background: "none", border: "none", cursor: "pointer", color: "#6B7280",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            width: "36px", height: "36px", borderRadius: "8px", transition: "background-color 0.2s"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#F3F4F6"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{
                                fontSize: "16px", fontWeight: 600, color: "#111827", border: "none",
                                outline: "none", background: "transparent", padding: 0, width: "300px"
                            }}
                            placeholder="Template Name"
                        />
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        style={{
                            backgroundColor: "#3B82F6", color: "white", border: "none", borderRadius: "6px",
                            padding: "8px 16px", fontSize: "14px", fontWeight: 500, cursor: saving ? "default" : "pointer",
                            display: "flex", alignItems: "center", gap: "8px", opacity: saving ? 0.7 : 1
                        }}
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save & Exit
                    </button>
                </div>
            </div>

            {/* Email Properties (To / Subject style) */}
            <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB", padding: "16px 24px 16px 64px", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", fontSize: "14px" }}>
                    <span style={{ color: "#6B7280", width: "60px", fontWeight: 500 }}>Subject</span>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. You won't believe this!"
                        style={{
                            flexGrow: 1, border: "none", outline: "none", fontSize: "14px", color: "#111827", padding: "4px 0"
                        }}
                    />
                </div>
            </div>

            {/* Editor Area */}
            <div style={{ flexGrow: 1, display: "flex", justifyContent: "center", backgroundColor: "#F3F4F6", overflowY: "auto", padding: "32px" }}>
                <div style={{
                    width: "100%",
                    maxWidth: "800px",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden" // To contain the rounded corners
                }}>
                    <style suppressHydrationWarning>{`
                        .ql-toolbar.ql-snow {
                            border: none !important;
                            border-bottom: 1px solid #E5E7EB !important;
                            padding: 12px 16px !important;
                            background-color: #FAFAFA;
                        }
                        .ql-container.ql-snow {
                            border: none !important;
                            flex-grow: 1;
                            font-family: inherit;
                            font-size: 15px;
                        }
                        .ql-editor {
                            min-height: 400px;
                            padding: 24px !important;
                            color: #1F2937;
                            line-height: 1.6;
                        }
                    `}</style>
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        formats={formats}
                        style={{ height: "100%", display: "flex", flexDirection: "column" }}
                    />
                </div>
            </div>
        </div>
    );
}
