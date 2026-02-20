"use client";

import React from "react";
import { useParams } from "next/navigation";

export default function TemplateEditorPage() {
    const { id } = useParams<{ id: string }>();

    return (
        <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
            <div className="text-center max-w-md p-8 bg-white shadow rounded-lg">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Template Editor Disabled</h1>
                <p className="text-gray-600 mb-6">
                    The template editor is currently in stabilization mode.
                    Editing and MJML compilation are disabled.
                </p>
                <div className="text-xs text-gray-400 font-mono bg-gray-100 p-2 rounded mb-6">
                    Template ID: {id}
                </div>
                <a
                    href="/templates"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                    ← Back to Templates
                </a>
            </div>
        </div>
    );
}
