'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, X, ArrowRight, Check, ExternalLink } from 'lucide-react';

export default function LandingPage() {
    const [showBanner, setShowBanner] = useState(true);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div style={{ backgroundColor: '#ffffff' }}>
            {/* SECTION 1 - Announcement Bar */}
            {showBanner && (
                <div style={{
                    backgroundColor: '#1e293b',
                    color: '#ffffff',
                    padding: '12px 24px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                }}>
                    <p style={{ fontSize: '14px', margin: 0, textAlign: 'center' }}>
                        Early access is live. Features and pricing may change as we scale.
                    </p>
                    <button
                        onClick={() => setShowBanner(false)}
                        style={{
                            position: 'absolute',
                            right: '24px',
                            background: 'transparent',
                            border: 'none',
                            color: '#ffffff',
                            cursor: 'pointer',
                            padding: '4px',
                        }}
                    >
                        <X style={{ width: '16px', height: '16px' }} />
                    </button>
                </div>
            )}

            {/* SECTION 2 - Header / Navigation */}
            <header style={{
                position: 'sticky',
                top: 0,
                backgroundColor: '#ffffff',
                borderBottom: '1px solid #e2e8f0',
                zIndex: 50,
            }}>
                <div style={{
                    maxWidth: '1280px',
                    margin: '0 auto',
                    padding: '16px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#2563eb',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Mail style={{ width: '18px', height: '18px', color: '#ffffff' }} />
                        </div>
                        <span style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a' }}>
                            Email Engine
                        </span>
                    </div>

                    {/* Center Navigation */}
                    <nav style={{ display: 'flex', gap: '32px' }}>
                        <button onClick={() => scrollToSection('features')} style={{ background: 'none', border: 'none', fontSize: '14px', fontWeight: 500, color: '#475569', cursor: 'pointer' }}>
                            Product
                        </button>
                        <button onClick={() => scrollToSection('integrations')} style={{ background: 'none', border: 'none', fontSize: '14px', fontWeight: 500, color: '#475569', cursor: 'pointer' }}>
                            Integrations
                        </button>
                        <button onClick={() => scrollToSection('pricing')} style={{ background: 'none', border: 'none', fontSize: '14px', fontWeight: 500, color: '#475569', cursor: 'pointer' }}>
                            Pricing
                        </button>
                        <Link href="/docs" style={{ fontSize: '14px', fontWeight: 500, color: '#475569', textDecoration: 'none' }}>
                            Docs
                        </Link>
                    </nav>

                    {/* Right Buttons */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <Link href="/login" style={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#475569',
                            textDecoration: 'none',
                            padding: '8px 16px',
                        }}>
                            Log In
                        </Link>
                        <Link href="/signup" style={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#ffffff',
                            backgroundColor: '#2563eb',
                            padding: '8px 20px',
                            borderRadius: '6px',
                            textDecoration: 'none',
                        }}>
                            Sign up
                        </Link>
                    </div>
                </div>
            </header>

            {/* SECTION 3 - Hero Section */}
            <section style={{
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '80px 24px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '64px',
                alignItems: 'center',
            }}>
                {/* Left Column */}
                <div>
                    <h1 style={{
                        fontSize: '56px',
                        fontWeight: 700,
                        color: '#0f172a',
                        lineHeight: '1.1',
                        marginBottom: '24px',
                    }}>
                        Integrate your data.<br />
                        Inform your decisions.<br />
                        Impact your results.
                    </h1>
                    <p style={{
                        fontSize: '20px',
                        color: '#64748b',
                        lineHeight: '1.6',
                        marginBottom: '12px',
                    }}>
                        An event-driven email automation platform designed for modern applications and real-time user behavior.
                    </p>
                    <p style={{
                        fontSize: '14px',
                        color: '#94a3b8',
                        fontStyle: 'italic',
                        marginBottom: '32px',
                    }}>
                        Early access preview. Features and pricing may evolve.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <Link href="/signup" style={{
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#ffffff',
                            backgroundColor: '#2563eb',
                            padding: '14px 28px',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}>
                            Sign up
                            <ArrowRight style={{ width: '18px', height: '18px' }} />
                        </Link>
                        <Link href="/docs" style={{
                            fontSize: '16px',
                            fontWeight: 500,
                            color: '#475569',
                            textDecoration: 'none',
                        }}>
                            View Documentation
                        </Link>
                    </div>
                </div>

                {/* Right Column - Visual */}
                <div style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    padding: '48px',
                    border: '1px solid #e2e8f0',
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
                        {/* Event */}
                        <div style={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '16px 24px',
                            width: '100%',
                            textAlign: 'center',
                        }}>
                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: 0 }}>Event</p>
                            <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>User action detected</p>
                        </div>

                        <ArrowRight style={{ width: '24px', height: '24px', color: '#cbd5e1' }} />

                        {/* Rule */}
                        <div style={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '16px 24px',
                            width: '100%',
                            textAlign: 'center',
                        }}>
                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: 0 }}>Rule</p>
                            <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>Automation triggered</p>
                        </div>

                        <ArrowRight style={{ width: '24px', height: '24px', color: '#cbd5e1' }} />

                        {/* Email */}
                        <div style={{
                            backgroundColor: '#dbeafe',
                            border: '1px solid #93c5fd',
                            borderRadius: '8px',
                            padding: '16px 24px',
                            width: '100%',
                            textAlign: 'center',
                        }}>
                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#1e40af', margin: 0 }}>Email</p>
                            <p style={{ fontSize: '12px', color: '#3b82f6', margin: '4px 0 0 0' }}>Delivered to user</p>
                        </div>
                    </div>

                    {/* Integration Icons */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '16px',
                        marginTop: '32px',
                    }}>
                        {['API', 'Web App', 'Shopify'].map((name) => (
                            <div key={name} style={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '6px',
                                padding: '8px 16px',
                                fontSize: '12px',
                                fontWeight: 500,
                                color: '#64748b',
                            }}>
                                {name}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 4 - Integrations / Trust */}
            <section id="integrations" style={{
                backgroundColor: '#f8fafc',
                padding: '80px 24px',
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{
                        fontSize: '36px',
                        fontWeight: 700,
                        color: '#0f172a',
                        marginBottom: '16px',
                    }}>
                        Built to work with modern tools
                    </h2>
                    <p style={{
                        fontSize: '18px',
                        color: '#64748b',
                        marginBottom: '48px',
                    }}>
                        Accept events from APIs, web apps, and popular platforms.
                    </p>

                    {/* Logo Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, 1fr)',
                        gap: '24px',
                        maxWidth: '800px',
                        margin: '0 auto 32px auto',
                    }}>
                        {['API', 'Webhooks', 'Shopify', 'Wix', 'Custom App'].map((name) => (
                            <div key={name} style={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                padding: '32px 16px',
                                textAlign: 'center',
                            }}>
                                <p style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                                    {name}
                                </p>
                            </div>
                        ))}
                    </div>

                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                        Integrations shown are examples. Availability may vary during early access.
                    </p>
                </div>
            </section>

            {/* SECTION 5 - Features */}
            <section id="features" style={{
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '80px 24px',
            }}>
                <h2 style={{
                    fontSize: '36px',
                    fontWeight: 700,
                    color: '#0f172a',
                    textAlign: 'center',
                    marginBottom: '64px',
                }}>
                    What you can build with Email Engine
                </h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '32px',
                }}>
                    {/* Feature 1 */}
                    <div style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '32px',
                    }}>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: 600,
                            color: '#0f172a',
                            marginBottom: '12px',
                        }}>
                            Event-Based Automation
                        </h3>
                        <p style={{
                            fontSize: '16px',
                            color: '#64748b',
                            lineHeight: '1.6',
                            margin: 0,
                        }}>
                            Trigger emails based on real user actions such as signups, purchases, or activity events.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '32px',
                    }}>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: 600,
                            color: '#0f172a',
                            marginBottom: '12px',
                        }}>
                            Multi-Tenant Ready
                        </h3>
                        <p style={{
                            fontSize: '16px',
                            color: '#64748b',
                            lineHeight: '1.6',
                            margin: 0,
                        }}>
                            Designed from day one to securely support multiple workspaces and teams.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '32px',
                    }}>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: 600,
                            color: '#0f172a',
                            marginBottom: '12px',
                        }}>
                            Scalable Delivery Architecture
                        </h3>
                        <p style={{
                            fontSize: '16px',
                            color: '#64748b',
                            lineHeight: '1.6',
                            margin: 0,
                        }}>
                            Built with queues and workers to reliably deliver emails as volume grows.
                        </p>
                    </div>
                </div>
            </section>

            {/* SECTION 6 - Social Proof */}
            <section style={{
                backgroundColor: '#f8fafc',
                padding: '80px 24px',
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{
                        fontSize: '36px',
                        fontWeight: 700,
                        color: '#0f172a',
                        marginBottom: '32px',
                    }}>
                        Built with production-grade architecture in mind
                    </h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '16px',
                        textAlign: 'left',
                    }}>
                        {[
                            'Event-driven system design',
                            'Queue-based email delivery',
                            'Tenant-isolated data model',
                            'Upgrade-ready infrastructure',
                        ].map((item) => (
                            <div key={item} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                            }}>
                                <Check style={{ width: '20px', height: '20px', color: '#10b981', flexShrink: 0 }} />
                                <p style={{ fontSize: '16px', color: '#475569', margin: 0 }}>
                                    {item}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 7 - Pricing */}
            <section id="pricing" style={{
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '80px 24px',
            }}>
                <h2 style={{
                    fontSize: '36px',
                    fontWeight: 700,
                    color: '#0f172a',
                    textAlign: 'center',
                    marginBottom: '64px',
                }}>
                    Simple pricing during early access
                </h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '32px',
                    maxWidth: '900px',
                    margin: '0 auto 32px auto',
                }}>
                    {/* Plan 1 - Early Access */}
                    <div style={{
                        backgroundColor: '#ffffff',
                        border: '2px solid #2563eb',
                        borderRadius: '12px',
                        padding: '40px',
                    }}>
                        <h3 style={{
                            fontSize: '24px',
                            fontWeight: 700,
                            color: '#0f172a',
                            marginBottom: '8px',
                        }}>
                            Early Access
                        </h3>
                        <p style={{
                            fontSize: '14px',
                            color: '#64748b',
                            marginBottom: '24px',
                        }}>
                            Free
                        </p>

                        <ul style={{
                            listStyle: 'none',
                            padding: 0,
                            margin: '0 0 32px 0',
                        }}>
                            {[
                                'Limited events per month',
                                'Limited email sends',
                                'Single workspace',
                                'Community support',
                            ].map((feature) => (
                                <li key={feature} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    marginBottom: '12px',
                                }}>
                                    <Check style={{ width: '18px', height: '18px', color: '#10b981', flexShrink: 0 }} />
                                    <span style={{ fontSize: '15px', color: '#475569' }}>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <Link href="/signup" style={{
                            display: 'block',
                            textAlign: 'center',
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#ffffff',
                            backgroundColor: '#2563eb',
                            padding: '14px 28px',
                            borderRadius: '8px',
                            textDecoration: 'none',
                        }}>
                            Get Early Access
                        </Link>
                    </div>

                    {/* Plan 2 - Pro */}
                    <div style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '40px',
                    }}>
                        <h3 style={{
                            fontSize: '24px',
                            fontWeight: 700,
                            color: '#0f172a',
                            marginBottom: '8px',
                        }}>
                            Pro
                        </h3>
                        <p style={{
                            fontSize: '14px',
                            color: '#64748b',
                            marginBottom: '24px',
                        }}>
                            Coming Soon
                        </p>

                        <ul style={{
                            listStyle: 'none',
                            padding: 0,
                            margin: '0 0 32px 0',
                        }}>
                            {[
                                'Higher limits',
                                'Advanced automation',
                                'Team access',
                                'Priority support',
                            ].map((feature) => (
                                <li key={feature} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    marginBottom: '12px',
                                }}>
                                    <Check style={{ width: '18px', height: '18px', color: '#cbd5e1', flexShrink: 0 }} />
                                    <span style={{ fontSize: '15px', color: '#94a3b8' }}>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <Link href="/contact" style={{
                            display: 'block',
                            textAlign: 'center',
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#475569',
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            padding: '14px 28px',
                            borderRadius: '8px',
                            textDecoration: 'none',
                        }}>
                            Notify Me
                        </Link>
                    </div>
                </div>

                <p style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', margin: 0 }}>
                    Pricing and limits may change during early access.
                </p>
            </section>

            {/* SECTION 8 - Final CTA */}
            <section style={{
                backgroundColor: '#f8fafc',
                padding: '80px 24px',
                textAlign: 'center',
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{
                        fontSize: '40px',
                        fontWeight: 700,
                        color: '#0f172a',
                        marginBottom: '32px',
                    }}>
                        Start building event-driven email automation today.
                    </h2>

                    <Link href="/signup" style={{
                        display: 'inline-block',
                        fontSize: '18px',
                        fontWeight: 600,
                        color: '#ffffff',
                        backgroundColor: '#2563eb',
                        padding: '16px 32px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        marginBottom: '16px',
                    }}>
                        Create Free Account
                    </Link>

                    <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                        Already have an account?{' '}
                        <Link href="/login" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>
                            Log in
                        </Link>
                    </p>
                </div>
            </section>

            {/* SECTION 9 - Footer */}
            <footer style={{
                backgroundColor: '#0f172a',
                color: '#94a3b8',
                padding: '64px 24px 32px 24px',
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '48px',
                        marginBottom: '48px',
                    }}>
                        {/* Product */}
                        <div>
                            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9', marginBottom: '16px' }}>
                                Product
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                <li style={{ marginBottom: '12px' }}>
                                    <button onClick={() => scrollToSection('features')} style={{ background: 'none', border: 'none', fontSize: '14px', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>
                                        Features
                                    </button>
                                </li>
                                <li style={{ marginBottom: '12px' }}>
                                    <button onClick={() => scrollToSection('integrations')} style={{ background: 'none', border: 'none', fontSize: '14px', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>
                                        Integrations
                                    </button>
                                </li>
                                <li style={{ marginBottom: '12px' }}>
                                    <button onClick={() => scrollToSection('pricing')} style={{ background: 'none', border: 'none', fontSize: '14px', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>
                                        Pricing
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Resources */}
                        <div>
                            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9', marginBottom: '16px' }}>
                                Resources
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                <li style={{ marginBottom: '12px' }}>
                                    <Link href="/docs" style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'none' }}>
                                        Docs
                                    </Link>
                                </li>
                                <li style={{ marginBottom: '12px' }}>
                                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        GitHub
                                        <ExternalLink style={{ width: '12px', height: '12px' }} />
                                    </a>
                                </li>
                                <li style={{ marginBottom: '12px' }}>
                                    <Link href="/docs" style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'none' }}>
                                        API Reference
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9', marginBottom: '16px' }}>
                                Company
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                <li style={{ marginBottom: '12px' }}>
                                    <a href="#" style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'none' }}>
                                        About
                                    </a>
                                </li>
                                <li style={{ marginBottom: '12px' }}>
                                    <Link href="/contact" style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'none' }}>
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9', marginBottom: '16px' }}>
                                Legal
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                <li style={{ marginBottom: '12px' }}>
                                    <a href="#" style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'none' }}>
                                        Privacy Policy
                                    </a>
                                </li>
                                <li style={{ marginBottom: '12px' }}>
                                    <a href="#" style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'none' }}>
                                        Terms of Service
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Line */}
                    <div style={{
                        borderTop: '1px solid #334155',
                        paddingTop: '32px',
                        textAlign: 'center',
                    }}>
                        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                            © 2026 Email Engine. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
