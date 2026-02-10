"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Mail,
    ChevronLeft,
    LogOut
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

/* ============================================================
   SIDEBAR - Light Mode
   ============================================================ */

const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Events", href: "/events" },
    { name: "Campaigns", href: "/campaigns" },
    { name: "Settings", href: "/settings" },
];

// Light Mode Colors
const colors = {
    bgPrimary: '#ffffff',
    bgSecondary: '#f8fafc',    // slate-50
    bgElevated: '#f1f5f9',     // slate-100
    borderSubtle: '#e2e8f0',   // slate-200
    borderDefault: '#cbd5e1',  // slate-300
    textPrimary: '#0f172a',    // slate-900
    textSecondary: '#475569',  // slate-600
    textMuted: '#94a3b8',      // slate-400
    accentBlue: '#2563eb',     // blue-600
};

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const { logout } = useAuth();

    return (
        <aside style={{
            width: collapsed ? '64px' : '224px',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: colors.bgSecondary,
            borderRight: `1px solid ${colors.borderSubtle}`,
            flexShrink: 0,
            transition: 'width 200ms ease',
        }}>
            {/* Logo Area */}
            <div style={{
                height: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                borderBottom: `1px solid ${colors.borderSubtle}`,
            }}>
                {!collapsed && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            backgroundColor: colors.accentBlue,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Mail style={{ width: '16px', height: '16px', color: 'white' }} />
                        </div>
                        <span style={{
                            fontWeight: 600,
                            fontSize: '14px',
                            color: colors.textPrimary,
                            letterSpacing: '-0.01em',
                        }}>
                            Email Engine
                        </span>
                    </div>
                )}

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        padding: '6px',
                        borderRadius: '6px',
                        border: 'none',
                        background: 'transparent',
                        color: colors.textMuted,
                        cursor: 'pointer',
                    }}
                >
                    <ChevronLeft style={{
                        width: '16px',
                        height: '16px',
                        transform: collapsed ? 'rotate(180deg)' : 'none',
                        transition: 'transform 200ms ease',
                    }} />
                </button>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== "/" && pathname.startsWith(item.href));

                        return (
                            <li key={item.name} style={{ marginBottom: '4px' }}>
                                <Link
                                    href={item.href}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        textDecoration: 'none',
                                        color: isActive ? colors.accentBlue : colors.textSecondary,
                                        backgroundColor: isActive ? `${colors.accentBlue}10` : 'transparent',
                                        transition: 'all 150ms ease',
                                    }}
                                    title={collapsed ? item.name : undefined}
                                >
                                    {!collapsed && <span>{item.name}</span>}
                                    {collapsed && <span style={{ fontSize: '12px' }}>{item.name.charAt(0)}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer with Logout */}
            <div style={{
                padding: '12px',
                borderTop: `1px solid ${colors.borderSubtle}`,
            }}>
                <button
                    onClick={logout}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        gap: '12px',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 500,
                        border: 'none',
                        background: 'transparent',
                        color: colors.textSecondary,
                        cursor: 'pointer',
                        transition: 'all 150ms ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.bgElevated;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                >
                    <LogOut style={{ width: '18px', height: '18px' }} />
                    {!collapsed && <span>Log Out</span>}
                </button>
            </div>
        </aside>
    );
}
