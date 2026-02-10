'use client';

import Link from 'next/link';

export default function DashboardPage() {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
        }}>
            <div style={{ maxWidth: '900px', width: '100%', textAlign: 'center' }}>
                {/* Title */}
                <h1 style={{
                    fontSize: '36px',
                    fontWeight: 600,
                    color: '#0f172a',
                    marginBottom: '12px',
                }}>
                    Welcome to Email Engine
                </h1>

                {/* Subtitle */}
                <p style={{
                    fontSize: '18px',
                    color: '#64748b',
                    marginBottom: '60px',
                }}>
                    Start by adding data. Then automate.
                </p>

                {/* Three Action Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '32px',
                }}>
                    {/* Card 1 - Events */}
                    <div style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '40px 24px',
                        textAlign: 'center',
                    }}>
                        <h2 style={{
                            fontSize: '20px',
                            fontWeight: 600,
                            color: '#0f172a',
                            marginBottom: '12px',
                        }}>
                            Events
                        </h2>
                        <p style={{
                            fontSize: '14px',
                            color: '#64748b',
                            marginBottom: '24px',
                            lineHeight: '1.6',
                        }}>
                            Incoming data from apps or APIs
                        </p>
                        <Link href="/events">
                            <button style={{
                                width: '100%',
                                padding: '12px 24px',
                                backgroundColor: '#2563eb',
                                border: 'none',
                                borderRadius: '6px',
                                color: '#ffffff',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: 'pointer',
                            }}>
                                View Events
                            </button>
                        </Link>
                    </div>

                    {/* Card 2 - Campaigns */}
                    <div style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '40px 24px',
                        textAlign: 'center',
                    }}>
                        <h2 style={{
                            fontSize: '20px',
                            fontWeight: 600,
                            color: '#0f172a',
                            marginBottom: '12px',
                        }}>
                            Campaigns
                        </h2>
                        <p style={{
                            fontSize: '14px',
                            color: '#64748b',
                            marginBottom: '24px',
                            lineHeight: '1.6',
                        }}>
                            Automated emails triggered by events
                        </p>
                        <Link href="/campaigns">
                            <button style={{
                                width: '100%',
                                padding: '12px 24px',
                                backgroundColor: '#2563eb',
                                border: 'none',
                                borderRadius: '6px',
                                color: '#ffffff',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: 'pointer',
                            }}>
                                Create Campaign
                            </button>
                        </Link>
                    </div>

                    {/* Card 3 - Settings */}
                    <div style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '40px 24px',
                        textAlign: 'center',
                    }}>
                        <h2 style={{
                            fontSize: '20px',
                            fontWeight: 600,
                            color: '#0f172a',
                            marginBottom: '12px',
                        }}>
                            Settings
                        </h2>
                        <p style={{
                            fontSize: '14px',
                            color: '#64748b',
                            marginBottom: '24px',
                            lineHeight: '1.6',
                        }}>
                            Configure integrations and preferences
                        </p>
                        <Link href="/settings">
                            <button style={{
                                width: '100%',
                                padding: '12px 24px',
                                backgroundColor: '#2563eb',
                                border: 'none',
                                borderRadius: '6px',
                                color: '#ffffff',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: 'pointer',
                            }}>
                                Open Settings
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
