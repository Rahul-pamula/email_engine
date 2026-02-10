"use client";

import { useState } from "react";
import {
    Search,
    Plus,
    Upload,
    Download,
    MoreHorizontal,
    Trash2,
    Filter,
    ChevronLeft,
    ChevronRight,
    Check
} from "lucide-react";

/* ============================================================
   CONTACTS - Light Mode
   ============================================================ */

// Light Mode Colors
const colors = {
    bgPrimary: '#ffffff',
    bgSecondary: '#f8fafc',
    bgElevated: '#f1f5f9',
    borderSubtle: '#e2e8f0',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    accentBlue: '#2563eb',
    accentBlueHover: '#1d4ed8',
    statusSuccess: '#16a34a',
    statusError: '#dc2626',
};

// Mock Data
const contactsData = [
    { id: 1, email: "john@example.com", name: "John Doe", status: "Active", added: "Mar 1, 2026" },
    { id: 2, email: "jane@company.com", name: "Jane Smith", status: "Active", added: "Mar 2, 2026" },
    { id: 3, email: "bob@test.org", name: "Bob Wilson", status: "Unsubscribed", added: "Feb 28, 2026" },
    { id: 4, email: "alice@demo.net", name: "Alice Brown", status: "Bounced", added: "Feb 25, 2026" },
    { id: 5, email: "charlie@startup.io", name: "Charlie Davis", status: "Active", added: "Mar 3, 2026" },
    { id: 6, email: "diana@agency.com", name: "Diana Miller", status: "Active", added: "Mar 3, 2026" },
    { id: 7, email: "evan@freelance.co", name: "Evan Wright", status: "Active", added: "Feb 20, 2026" },
    { id: 8, email: "fiona@consulting.grp", name: "Fiona Clark", status: "Active", added: "Feb 15, 2026" },
];

export default function ContactsPage() {
    const [selected, setSelected] = useState<number[]>([]);
    const [showImport, setShowImport] = useState(false);

    const toggleSelect = (id: number) => {
        if (selected.includes(id)) {
            setSelected(selected.filter(i => i !== id));
        } else {
            setSelected([...selected, id]);
        }
    };

    const toggleAll = () => {
        if (selected.length === contactsData.length) {
            setSelected([]);
        } else {
            setSelected(contactsData.map(c => c.id));
        }
    };

    return (
        <>
            {/* Page Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'end',
                marginBottom: '32px'
            }}>
                <div>
                    <h1 style={{
                        fontSize: '24px',
                        fontWeight: 600,
                        color: colors.textPrimary,
                        margin: 0,
                        letterSpacing: '-0.02em',
                    }}>
                        Contacts
                    </h1>
                    <p style={{
                        fontSize: '14px',
                        color: colors.textSecondary,
                        margin: '4px 0 0 0',
                    }}>
                        {contactsData.length} total contacts
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        backgroundColor: colors.bgPrimary,
                        border: `1px solid ${colors.borderSubtle}`,
                        borderRadius: '6px',
                        color: colors.textSecondary,
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer',
                    }}>
                        <Download style={{ width: '16px', height: '16px' }} />
                        Export
                    </button>
                    <button
                        onClick={() => setShowImport(true)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            backgroundColor: colors.accentBlue,
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        }}
                    >
                        <Upload style={{ width: '16px', height: '16px' }} />
                        Import
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', justifyContent: 'space-between' }}>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '16px',
                        height: '16px',
                        color: colors.textMuted
                    }} />
                    <input
                        type="text"
                        placeholder="Search contacts by email or name..."
                        style={{
                            width: '100%',
                            padding: '10px 12px 10px 36px',
                            backgroundColor: colors.bgPrimary,
                            border: `1px solid ${colors.borderSubtle}`,
                            borderRadius: '6px',
                            fontSize: '14px',
                            color: colors.textPrimary,
                        }}
                    />
                </div>

                {selected.length > 0 && (
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        backgroundColor: `${colors.statusError}15`,
                        border: 'none',
                        borderRadius: '6px',
                        color: colors.statusError,
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer',
                    }}>
                        <Trash2 style={{ width: '16px', height: '16px' }} />
                        Delete ({selected.length})
                    </button>
                )}
            </div>

            {/* Table */}
            <div style={{
                backgroundColor: colors.bgPrimary,
                border: `1px solid ${colors.borderSubtle}`,
                borderRadius: '8px',
                overflow: 'hidden',
                marginBottom: '24px',
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: colors.bgSecondary, borderBottom: `1px solid ${colors.borderSubtle}` }}>
                            <th style={{ padding: '12px 20px', width: '40px' }}>
                                <input
                                    type="checkbox"
                                    checked={selected.length === contactsData.length}
                                    onChange={toggleAll}
                                    style={{ cursor: 'pointer', accentColor: colors.accentBlue }}
                                />
                            </th>
                            {['Email', 'Name', 'Status', 'Added', ''].map((h) => (
                                <th key={h} style={{
                                    padding: '12px 20px',
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: colors.textMuted,
                                    textAlign: 'left',
                                }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {contactsData.map((contact) => (
                            <tr key={contact.id} style={{ borderBottom: `1px solid ${colors.borderSubtle}` }}>
                                <td style={{ padding: '16px 20px' }}>
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(contact.id)}
                                        onChange={() => toggleSelect(contact.id)}
                                        style={{ cursor: 'pointer', accentColor: colors.accentBlue }}
                                    />
                                </td>
                                <td style={{ padding: '16px 20px', fontSize: '14px', color: colors.textSecondary }}>{contact.email}</td>
                                <td style={{ padding: '16px 20px', fontSize: '14px', color: colors.textPrimary, fontWeight: 500 }}>{contact.name}</td>
                                <td style={{ padding: '16px 20px' }}>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        fontWeight: 500,
                                        backgroundColor: contact.status === 'Active' ? `${colors.statusSuccess}15` : `${colors.textMuted}15`,
                                        color: contact.status === 'Active' ? colors.statusSuccess : colors.textMuted,
                                    }}>
                                        {contact.status}
                                    </span>
                                </td>
                                <td style={{ padding: '16px 20px', fontSize: '14px', color: colors.textSecondary, fontFeatureSettings: '"tnum"' }}>{contact.added}</td>
                                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                    <button style={{
                                        background: 'none',
                                        border: 'none',
                                        color: colors.textMuted,
                                        cursor: 'pointer',
                                        padding: '4px',
                                    }}>
                                        <MoreHorizontal style={{ width: '16px', height: '16px' }} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '14px', color: colors.textSecondary }}>
                    Showing 1 to 8 of 8 entries
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button disabled style={{
                        padding: '8px 12px',
                        backgroundColor: colors.bgPrimary,
                        border: `1px solid ${colors.borderSubtle}`,
                        borderRadius: '6px',
                        color: colors.textMuted,
                        cursor: 'not-allowed',
                        opacity: 0.5,
                    }}>
                        <ChevronLeft style={{ width: '16px', height: '16px' }} />
                    </button>
                    <button disabled style={{
                        padding: '8px 12px',
                        backgroundColor: colors.bgPrimary,
                        border: `1px solid ${colors.borderSubtle}`,
                        borderRadius: '6px',
                        color: colors.textMuted,
                        cursor: 'not-allowed',
                        opacity: 0.5,
                    }}>
                        <ChevronRight style={{ width: '16px', height: '16px' }} />
                    </button>
                </div>
            </div>

            {/* Import Modal */}
            {showImport && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 50,
                }}>
                    <div style={{
                        backgroundColor: colors.bgPrimary,
                        borderRadius: '12px',
                        width: '100%',
                        maxWidth: '500px',
                        padding: '24px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: colors.textPrimary, marginBottom: '8px' }}>Import Contacts</h2>
                        <p style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '24px' }}>
                            Upload a CSV file containing your contacts.
                        </p>

                        <div style={{
                            border: `2px dashed ${colors.borderSubtle}`,
                            borderRadius: '8px',
                            padding: '32px',
                            textAlign: 'center',
                            marginBottom: '24px',
                            cursor: 'pointer',
                            backgroundColor: colors.bgSecondary,
                        }}>
                            <Upload style={{ width: '24px', height: '24px', color: colors.textMuted, margin: '0 auto 12px auto' }} />
                            <p style={{ fontSize: '14px', color: colors.textPrimary, fontWeight: 500 }}>Click to upload or drag and drop</p>
                            <p style={{ fontSize: '12px', color: colors.textMuted }}>CSV up to 10MB</p>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowImport(false)}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: 'transparent',
                                    border: `1px solid ${colors.borderSubtle}`,
                                    borderRadius: '6px',
                                    color: colors.textPrimary,
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setShowImport(false)}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: colors.accentBlue,
                                    border: 'none',
                                    borderRadius: '6px',
                                    color: 'white',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                }}
                            >
                                Import Contacts
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
