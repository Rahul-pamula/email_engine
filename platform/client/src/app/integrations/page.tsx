'use client';

import { useState } from 'react';
import {
    RefreshCw,
    Settings,
    Database,
    Zap,
    ArrowRight,
    ShoppingBag,
    Globe,
    Code,
    Server,
    Layers,
    GitBranch,
    Package
} from 'lucide-react';

export default function IntegrationsPage() {
    const [hoveredNode, setHoveredNode] = useState<number | null>(null);

    // Integration data
    const integrations = [
        {
            id: 1,
            name: 'Shopify Store',
            icon: ShoppingBag,
            status: 'Active',
            eventsToday: 124,
            lastEvent: '2 minutes ago',
        },
        {
            id: 2,
            name: 'Wix Website',
            icon: Globe,
            status: 'Active',
            eventsToday: 89,
            lastEvent: '5 minutes ago',
        },
        {
            id: 3,
            name: 'Web Application',
            icon: Code,
            status: 'Active',
            eventsToday: 456,
            lastEvent: '1 minute ago',
        },
        {
            id: 4,
            name: 'Public API',
            icon: Server,
            status: 'Active',
            eventsToday: 1203,
            lastEvent: '30 seconds ago',
        },
    ];

    // Flow nodes
    const flowNodes = [
        {
            id: 1,
            title: 'API Gateway',
            icon: Server,
            description: 'Receives events securely from integrations.',
            footer: 'Auth • Validation • Rate Limit',
        },
        {
            id: 2,
            title: 'Event Normalizer',
            icon: GitBranch,
            description: 'Converts all incoming data into a standard format.',
            footer: 'Unified Event Schema',
        },
        {
            id: 3,
            title: 'Event Store',
            icon: Database,
            description: 'Persistent storage for all normalized events.',
            footer: 'Append-only',
        },
        {
            id: 4,
            title: 'Rule Engine',
            icon: Zap,
            description: 'Evaluates events against automation rules.',
            footer: 'Triggers & Conditions',
        },
        {
            id: 5,
            title: 'Message Queue',
            icon: Layers,
            description: 'Buffers actions for reliable delivery.',
            footer: 'Retry • Backoff',
        },
    ];

    return (
        <div style={{ minWidth: '1280px', maxWidth: '1440px', margin: '0 auto', padding: '24px', backgroundColor: '#FFFFFF' }}>
            {/* Page Title Section */}
            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 600, color: '#0f172a', margin: 0, marginBottom: '8px' }}>
                        Data Flow Overview
                    </h1>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                        Visualize how external events move through your email automation engine.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        backgroundColor: 'transparent',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        color: '#475569',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer',
                    }}>
                        <RefreshCw style={{ width: '16px', height: '16px' }} />
                        Refresh Flow
                    </button>
                    <button style={{
                        padding: '8px',
                        backgroundColor: 'transparent',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        color: '#475569',
                        cursor: 'pointer',
                    }}>
                        <Settings style={{ width: '16px', height: '16px' }} />
                    </button>
                </div>
            </div>

            {/* 3 Column Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '25% 45% 30%', gap: '24px' }}>
                {/* LEFT COLUMN - Integrations Panel */}
                <div>
                    <div style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '20px',
                    }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', margin: 0, marginBottom: '4px' }}>
                            Data Sources
                        </h2>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0, marginBottom: '20px' }}>
                            External systems sending events into your platform.
                        </p>

                        {/* Integration Cards */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                            {integrations.map((integration) => {
                                const Icon = integration.icon;
                                return (
                                    <div
                                        key={integration.id}
                                        style={{
                                            backgroundColor: '#f8fafc',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '6px',
                                            padding: '12px',
                                        }}
                                    >
                                        {/* Top Row */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Icon style={{ width: '16px', height: '16px', color: '#64748b' }} />
                                                <span style={{ fontSize: '14px', fontWeight: 500, color: '#0f172a' }}>
                                                    {integration.name}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                                                <span style={{ fontSize: '12px', color: '#10b981' }}>Active</span>
                                            </div>
                                        </div>

                                        {/* Middle Row */}
                                        <div style={{ marginBottom: '8px' }}>
                                            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                                                Events received today: {integration.eventsToday}
                                            </p>
                                            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                                                Last event: {integration.lastEvent}
                                            </p>
                                        </div>

                                        {/* Bottom Row */}
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button style={{
                                                fontSize: '12px',
                                                color: '#2563eb',
                                                backgroundColor: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: 0,
                                            }}>
                                                View Events
                                            </button>
                                            <button style={{
                                                fontSize: '12px',
                                                color: '#94a3b8',
                                                backgroundColor: 'transparent',
                                                border: 'none',
                                                cursor: 'not-allowed',
                                                padding: 0,
                                            }} disabled>
                                                Disconnect
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Add Integration Button */}
                        <button style={{
                            width: '100%',
                            padding: '10px',
                            backgroundColor: 'transparent',
                            border: '1px dashed #cbd5e1',
                            borderRadius: '6px',
                            color: '#64748b',
                            fontSize: '14px',
                            fontWeight: 500,
                            cursor: 'pointer',
                        }}>
                            + Add Integration
                        </button>
                    </div>
                </div>

                {/* CENTER COLUMN - Data Flow Visualization */}
                <div>
                    <div style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '20px',
                    }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', margin: 0, marginBottom: '4px' }}>
                            Event Processing Pipeline
                        </h2>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0, marginBottom: '24px' }}>
                            Every event passes through the same standardized flow.
                        </p>

                        {/* Flow Nodes */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {flowNodes.map((node, index) => {
                                const Icon = node.icon;
                                const isHovered = hoveredNode === node.id;
                                const isBeforeHovered = hoveredNode !== null && node.id <= hoveredNode;

                                return (
                                    <div key={node.id}>
                                        <div
                                            onMouseEnter={() => setHoveredNode(node.id)}
                                            onMouseLeave={() => setHoveredNode(null)}
                                            style={{
                                                backgroundColor: isHovered ? '#f1f5f9' : '#ffffff',
                                                border: `1px solid ${isBeforeHovered ? '#2563eb' : '#e2e8f0'}`,
                                                borderRadius: '8px',
                                                padding: '16px',
                                                cursor: 'pointer',
                                                transition: 'all 150ms ease',
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    backgroundColor: isBeforeHovered ? '#dbeafe' : '#f8fafc',
                                                    borderRadius: '6px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}>
                                                    <Icon style={{ width: '16px', height: '16px', color: isBeforeHovered ? '#2563eb' : '#64748b' }} />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: 0, marginBottom: '4px' }}>
                                                        {node.title}
                                                    </h3>
                                                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                                                        {node.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <div style={{
                                                fontSize: '11px',
                                                color: '#94a3b8',
                                                fontWeight: 500,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                            }}>
                                                {node.footer}
                                            </div>
                                        </div>

                                        {/* Arrow between nodes */}
                                        {index < flowNodes.length - 1 && (
                                            <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
                                                <ArrowRight style={{ width: '20px', height: '20px', color: isBeforeHovered && node.id < (hoveredNode || 0) ? '#2563eb' : '#cbd5e1' }} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - Campaign Output */}
                <div>
                    <div style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '20px',
                    }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', margin: 0, marginBottom: '12px' }}>
                            Triggered Campaign
                        </h2>

                        {/* Condition Badge */}
                        <div style={{
                            backgroundColor: '#fef3c7',
                            border: '1px solid #fbbf24',
                            borderRadius: '6px',
                            padding: '8px 12px',
                            marginBottom: '16px',
                        }}>
                            <p style={{ fontSize: '12px', color: '#92400e', margin: 0, fontWeight: 500 }}>
                                If Event = Cart Abandoned AND No Purchase in 24h
                            </p>
                        </div>

                        {/* Email Preview Card */}
                        <div style={{
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            padding: '16px',
                            marginBottom: '16px',
                        }}>
                            <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', margin: 0, marginBottom: '12px' }}>
                                Subject: You forgot something in your cart
                            </p>

                            <div style={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '4px',
                                padding: '12px',
                                marginBottom: '12px',
                            }}>
                                <div style={{
                                    width: '100%',
                                    height: '80px',
                                    backgroundColor: '#e2e8f0',
                                    borderRadius: '4px',
                                    marginBottom: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Package style={{ width: '24px', height: '24px', color: '#94a3b8' }} />
                                </div>
                                <p style={{ fontSize: '13px', fontWeight: 500, color: '#0f172a', margin: 0, marginBottom: '4px' }}>
                                    Product Name
                                </p>
                                <p style={{ fontSize: '12px', color: '#64748b', margin: 0, marginBottom: '12px' }}>
                                    Complete your purchase before this item sells out.
                                </p>
                                <button style={{
                                    width: '100%',
                                    padding: '8px',
                                    backgroundColor: '#2563eb',
                                    border: 'none',
                                    borderRadius: '4px',
                                    color: '#ffffff',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                }}>
                                    Complete Purchase
                                </button>
                            </div>
                        </div>

                        {/* Campaign Metadata */}
                        <div style={{ marginBottom: '16px' }}>
                            <p style={{ fontSize: '12px', color: '#64748b', margin: 0, marginBottom: '4px' }}>
                                Campaign name: <span style={{ color: '#0f172a', fontWeight: 500 }}>Abandoned Cart – Default</span>
                            </p>
                            <p style={{ fontSize: '12px', color: '#64748b', margin: 0, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                Status: <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                                    <span style={{ color: '#10b981', fontWeight: 500 }}>Active</span>
                                </span>
                            </p>
                            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                                Emails sent today: <span style={{ color: '#0f172a', fontWeight: 500 }}>342</span>
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <button style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#2563eb',
                                border: 'none',
                                borderRadius: '6px',
                                color: '#ffffff',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: 'pointer',
                            }}>
                                View Campaign
                            </button>
                            <button style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: 'transparent',
                                border: '1px solid #e2e8f0',
                                borderRadius: '6px',
                                color: '#475569',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: 'pointer',
                            }}>
                                Edit Rules
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Status Strip */}
            <div style={{
                marginTop: '32px',
                backgroundColor: '#f0fdf4',
                border: '1px solid #86efac',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
            }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '12px', color: '#166534', margin: 0, marginBottom: '4px', fontWeight: 500 }}>
                        Events processed today
                    </p>
                    <p style={{ fontSize: '20px', fontWeight: 600, color: '#15803d', margin: 0 }}>
                        12,482
                    </p>
                </div>
                <div style={{ width: '1px', height: '40px', backgroundColor: '#86efac' }} />
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '12px', color: '#166534', margin: 0, marginBottom: '4px', fontWeight: 500 }}>
                        Queue backlog
                    </p>
                    <p style={{ fontSize: '20px', fontWeight: 600, color: '#15803d', margin: 0 }}>
                        0
                    </p>
                </div>
                <div style={{ width: '1px', height: '40px', backgroundColor: '#86efac' }} />
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '12px', color: '#166534', margin: 0, marginBottom: '4px', fontWeight: 500 }}>
                        Email failures
                    </p>
                    <p style={{ fontSize: '20px', fontWeight: 600, color: '#15803d', margin: 0 }}>
                        0
                    </p>
                </div>
            </div>
        </div>
    );
}
