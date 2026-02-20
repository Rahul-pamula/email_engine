'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, Zap, Code2, MoveRight, Layers, Workflow, ExternalLink, Shield } from 'lucide-react';

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div style={{ backgroundColor: '#09090b', color: 'white', minHeight: '100vh', position: 'relative', overflowX: 'hidden', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <style jsx global>{`
                ::selection {
                    background: rgba(59, 130, 246, 0.3);
                }
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                    100% { transform: translateY(0px); }
                }
                @keyframes float-delayed {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes gradient-text {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .hero-text {
                    background: linear-gradient(to right, #ffffff, #94a3b8, #ffffff);
                    background-size: 200% auto;
                    color: transparent;
                    -webkit-background-clip: text;
                    background-clip: text;
                    animation: gradient-text 8s linear infinite;
                }
                .hero-highlight {
                    background: linear-gradient(to right, #60a5fa, #c084fc, #60a5fa);
                    background-size: 200% auto;
                    color: transparent;
                    -webkit-background-clip: text;
                    background-clip: text;
                    animation: gradient-text 4s linear infinite;
                }
                .glass-card {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .glass-card:hover {
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    transform: translateY(-4px);
                    box-shadow: 0 10px 40px -10px rgba(0,0,0,0.5);
                }
                .glass-nav {
                    background: rgba(9, 9, 11, 0.7);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                }
                .btn-premium {
                    position: relative;
                    overflow: hidden;
                    background: #ffffff;
                    color: #09090b;
                    border: none;
                    transition: all 0.3s ease;
                }
                .btn-premium:hover {
                    transform: scale(1.02);
                    box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
                }
                .btn-secondary {
                    background: transparent;
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    transition: all 0.3s ease;
                }
                .btn-secondary:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(255, 255, 255, 0.3);
                }
                .marquee-container {
                    overflow: hidden;
                    white-space: nowrap;
                    position: relative;
                    width: 100%;
                    -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
                    mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
                }
                .marquee-content {
                    display: inline-flex;
                    gap: 3rem;
                    animation: marquee 30s linear infinite;
                    padding-right: 3rem;
                }
                .marquee-content:hover {
                    animation-play-state: paused;
                }
                
                /* Custom scrollbar */
                ::-webkit-scrollbar { width: 8px; }
                ::-webkit-scrollbar-track { background: #09090b; }
                ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
                ::-webkit-scrollbar-thumb:hover { background: #475569; }
            `}</style>

            {/* Ambient Background Glows */}
            <div style={{
                position: 'fixed',
                top: '-20%',
                left: '-10%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(9, 9, 11, 0) 70%)',
                filter: 'blur(80px)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'fixed',
                bottom: '-20%',
                right: '-10%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, rgba(9, 9, 11, 0) 70%)',
                filter: 'blur(80px)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            {/* Dynamic Mouse Spotlight */}
            <div style={{
                position: 'fixed',
                top: mousePos.y - 300,
                left: mousePos.x - 300,
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.02) 0%, rgba(9,9,11,0) 50%)',
                pointerEvents: 'none',
                zIndex: 1,
            }} />

            {/* Z-Index Wrapper for content */}
            <div style={{ position: 'relative', zIndex: 10 }}>

                {/* Header */}
                <header style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    transition: 'all 0.3s ease',
                    zIndex: 50,
                    backgroundColor: scrolled ? 'rgba(9, 9, 11, 0.8)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(20px)' : 'none',
                    borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent'
                }}>
                    <div style={{
                        maxWidth: '1280px',
                        margin: '0 auto',
                        padding: '16px 24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)'
                            }}>
                                <Mail style={{ width: '18px', height: '18px', color: 'white' }} />
                            </div>
                            <span style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.02em', color: 'white' }}>
                                Email Engine
                            </span>
                        </div>

                        <nav style={{ display: 'flex', gap: '40px' }}>
                            <button onClick={() => scrollToSection('features')} style={{ background: 'none', border: 'none', fontSize: '14px', fontWeight: 500, color: '#94a3b8', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'white'} onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}>Features</button>
                            <button onClick={() => scrollToSection('integrations')} style={{ background: 'none', border: 'none', fontSize: '14px', fontWeight: 500, color: '#94a3b8', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'white'} onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}>Integrations</button>
                            <button onClick={() => scrollToSection('pricing')} style={{ background: 'none', border: 'none', fontSize: '14px', fontWeight: 500, color: '#94a3b8', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'white'} onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}>Pricing</button>
                        </nav>

                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <Link href="/login" style={{
                                fontSize: '14px',
                                fontWeight: 500,
                                color: '#e2e8f0',
                                textDecoration: 'none',
                                transition: 'color 0.2s'
                            }} onMouseOver={(e) => e.currentTarget.style.color = 'white'} onMouseOut={(e) => e.currentTarget.style.color = '#e2e8f0'}>
                                Sign In
                            </Link>
                            <Link href="/signup" className="btn-secondary" style={{
                                fontSize: '14px',
                                fontWeight: 500,
                                padding: '8px 20px',
                                borderRadius: '8px',
                                textDecoration: 'none',
                            }}>
                                Get Started
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '160px 24px 80px',
                    position: 'relative',
                }}>
                    {/* Grid Background Overlay */}
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
                        zIndex: -1,
                        pointerEvents: 'none'
                    }} />

                    <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

                        <div style={{ animation: 'slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '6px 16px',
                                borderRadius: '99px',
                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                border: '1px solid rgba(59, 130, 246, 0.2)',
                                marginBottom: '32px',
                            }}>
                                <Zap style={{ width: '14px', height: '14px', color: '#60a5fa' }} />
                                <span style={{ fontSize: '13px', fontWeight: 500, color: '#93c5fd' }}>v2.0 Early Access is now live</span>
                            </div>

                            <h1 style={{
                                fontSize: 'clamp(48px, 6vw, 84px)',
                                fontWeight: 700,
                                letterSpacing: '-0.03em',
                                lineHeight: '1.05',
                                marginBottom: '24px',
                                color: 'white'
                            }}>
                                Automate emails like <br />
                                <span className="hero-highlight">absolute magic.</span>
                            </h1>

                            <p style={{
                                fontSize: 'clamp(18px, 2vw, 22px)',
                                color: '#94a3b8',
                                maxWidth: '700px',
                                margin: '0 auto 48px auto',
                                lineHeight: '1.6',
                                fontWeight: 400
                            }}>
                                The developer-first infrastructure for event-driven communications. Build complex workflows, personalize templates, and deliver at scale in minutes.
                            </p>

                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'center', marginBottom: '80px' }}>
                                <Link href="/signup" className="btn-premium" style={{
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    padding: '16px 32px',
                                    borderRadius: '12px',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                }}>
                                    Get Started Free
                                    <MoveRight style={{ width: '18px', height: '18px' }} />
                                </Link>
                                <Link href="/docs" className="glass-card" style={{
                                    fontSize: '16px',
                                    fontWeight: 500,
                                    color: 'white',
                                    padding: '16px 32px',
                                    borderRadius: '12px',
                                    textDecoration: 'none',
                                }}>
                                    Read Documentation
                                </Link>
                            </div>
                        </div>

                        {/* Hero Visual - Floating Terminal */}
                        <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', perspective: '1000px', animation: 'slide-up 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards', opacity: 0 }}>
                            <div className="glass-card" style={{
                                padding: '0',
                                borderRadius: '20px',
                                animation: 'float 8s ease-in-out infinite',
                                overflow: 'hidden',
                                boxShadow: '0 30px 60px -15px rgba(0,0,0,0.8), 0 0 40px rgba(59, 130, 246, 0.1)',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                {/* Mac Window Header */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 20px', backgroundColor: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ width: 12, height: 12, borderRadius: 6, background: '#ef4444' }} />
                                    <div style={{ width: 12, height: 12, borderRadius: 6, background: '#f59e0b' }} />
                                    <div style={{ width: 12, height: 12, borderRadius: 6, background: '#10b981' }} />
                                    <div style={{ marginLeft: '12px', fontSize: '13px', color: '#64748b', fontFamily: 'monospace' }}>api/trigger-campaign.ts</div>
                                </div>
                                {/* Terminal Body */}
                                <div style={{ padding: '32px', fontFamily: '"JetBrains Mono", "Fira Code", monospace', fontSize: '15px', lineHeight: '1.7', color: '#cbd5e1', textAlign: 'left', backgroundColor: '#0f172a' }}>
                                    <div><span style={{ color: '#c084fc' }}>import</span> {'{ Engine }'} <span style={{ color: '#c084fc' }}>from</span> <span style={{ color: '#34d399' }}>'@email-engine/sdk'</span>;</div>
                                    <br />
                                    <div><span style={{ color: '#60a5fa' }}>const</span> app = <span style={{ color: '#fbbf24' }}>new</span> <span style={{ color: '#60a5fa' }}>Engine</span>(process.env.API_KEY);</div>
                                    <br />
                                    <div>app.<span style={{ color: '#60a5fa' }}>on</span>(<span style={{ color: '#34d399' }}>'user.signup'</span>, <span style={{ color: '#c084fc' }}>async</span> (event) {'=>'} {'{'}</div>
                                    <div style={{ paddingLeft: '24px' }}>
                                        <span style={{ color: '#c084fc' }}>await</span> app.<span style={{ color: '#60a5fa' }}>campaigns</span>.<span style={{ color: '#60a5fa' }}>trigger</span>({'{'}
                                    </div>
                                    <div style={{ paddingLeft: '48px', color: '#cbd5e1' }}>workflowId: <span style={{ color: '#34d399' }}>'wfl_welcome_series'</span>,</div>
                                    <div style={{ paddingLeft: '48px', color: '#cbd5e1' }}>contact: event.user.email,</div>
                                    <div style={{ paddingLeft: '48px', color: '#cbd5e1' }}>data: {'{'}</div>
                                    <div style={{ paddingLeft: '72px', color: '#93c5fd' }}>name: event.user.firstName,</div>
                                    <div style={{ paddingLeft: '72px', color: '#93c5fd' }}>trialEnds: event.user.trialEndDate</div>
                                    <div style={{ paddingLeft: '48px' }}>{'}'}</div>
                                    <div style={{ paddingLeft: '24px' }}>{'}'});</div>
                                    <br />
                                    <div style={{ paddingLeft: '24px', color: '#64748b' }}>// ✨ Email delivered instantly</div>
                                    <div>{'}'});</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Marquee Integrations Section */}
                <section id="integrations" style={{ padding: '40px 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Integrates with your modern stack</p>
                    </div>
                    <div className="marquee-container">
                        <div className="marquee-content">
                            {/* Duplicated for infinite scroll effect */}
                            {[...Array(4)].map((_, i) => (
                                <div key={i} style={{ display: 'flex', gap: '4rem', alignItems: 'center' }}>
                                    {['Node.js', 'Python', 'React', 'Shopify', 'Webhook', 'Stripe', 'Segment', 'Next.js'].map((logo, j) => (
                                        <div key={`${i}-${j}`} style={{ fontSize: '24px', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Layers style={{ color: '#475569', width: '28px', height: '28px' }} />
                                            {logo}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Bento Grid Features Section */}
                <section id="features" style={{ padding: '160px 24px', maxWidth: '1280px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h2 style={{ fontSize: '48px', fontWeight: 700, color: 'white', marginBottom: '24px', letterSpacing: '-0.02em' }}>
                            Everything you <span style={{ color: '#60a5fa' }}>need</span>, <br />nothing you don't.
                        </h2>
                        <p style={{ fontSize: '18px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
                            We striped away the bloated marketing tools to give developers a powerful, headless email engine.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>

                        {/* Box 1 */}
                        <div className="glass-card" style={{ gridColumn: 'span 8', padding: '48px', borderRadius: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', animation: 'float-delayed 7s ease-in-out infinite' }}>
                            <div>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(96, 165, 250, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', border: '1px solid rgba(96, 165, 250, 0.2)' }}>
                                    <Workflow style={{ width: '24px', height: '24px', color: '#60a5fa' }} />
                                </div>
                                <h3 style={{ fontSize: '28px', fontWeight: 600, color: 'white', marginBottom: '16px' }}>Visual Automation Builder</h3>
                                <p style={{ fontSize: '16px', color: '#94a3b8', lineHeight: '1.6', maxWidth: '400px' }}>
                                    Design complex journeys with a drag-and-drop workflow canvas. Set delays, rules, and conditions without touching the code.
                                </p>
                            </div>
                        </div>

                        {/* Box 2 */}
                        <div className="glass-card" style={{ gridColumn: 'span 4', padding: '48px', borderRadius: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                                    <Code2 style={{ width: '24px', height: '24px', color: '#c084fc' }} />
                                </div>
                                <h3 style={{ fontSize: '24px', fontWeight: 600, color: 'white', marginBottom: '16px' }}>Developer API</h3>
                                <p style={{ fontSize: '16px', color: '#94a3b8', lineHeight: '1.6' }}>
                                    RESTful endpoints with predictable payloads and comprehensive webhooks.
                                </p>
                            </div>
                        </div>

                        {/* Box 3 */}
                        <div className="glass-card" style={{ gridColumn: 'span 4', padding: '48px', borderRadius: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                    <Shield style={{ width: '24px', height: '24px', color: '#34d399' }} />
                                </div>
                                <h3 style={{ fontSize: '24px', fontWeight: 600, color: 'white', marginBottom: '16px' }}>Multi-Tenant Security</h3>
                                <p style={{ fontSize: '16px', color: '#94a3b8', lineHeight: '1.6' }}>
                                    Isolated workspaces out of the box. Safe for B2B SaaS applications.
                                </p>
                            </div>
                        </div>

                        {/* Box 4 */}
                        <div className="glass-card" style={{ gridColumn: 'span 8', padding: '48px', borderRadius: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', animation: 'float 9s ease-in-out infinite' }}>
                            <div>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(251, 191, 36, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                                    <Zap style={{ width: '24px', height: '24px', color: '#fbbf24' }} />
                                </div>
                                <h3 style={{ fontSize: '28px', fontWeight: 600, color: 'white', marginBottom: '16px' }}>Real-time Delivery Pipeline</h3>
                                <p style={{ fontSize: '16px', color: '#94a3b8', lineHeight: '1.6', maxWidth: '400px' }}>
                                    Our Rust-based ingest servers and Redis queues ensure sub-millisecond event processing and reliable email dispatch even during massive spikes.
                                </p>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Final CTA */}
                <section style={{ padding: '160px 24px', textAlign: 'center', position: 'relative' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                        <h2 style={{ fontSize: '56px', fontWeight: 700, color: 'white', marginBottom: '32px', letterSpacing: '-0.02em' }}>
                            Ready to upgrade your stack?
                        </h2>
                        <p style={{ fontSize: '20px', color: '#94a3b8', marginBottom: '48px' }}>
                            Join hundreds of developers building the future of automated communications.
                        </p>

                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                            <Link href="/signup" className="btn-premium" style={{
                                fontSize: '16px',
                                fontWeight: 600,
                                padding: '16px 32px',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px',
                            }}>
                                Get Started for Free
                                <MoveRight style={{ width: '18px', height: '18px' }} />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '64px 24px', background: 'rgba(0,0,0,0.3)' }}>
                    <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '48px' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                                <Mail style={{ width: '16px', height: '16px', color: '#60a5fa' }} />
                                <span style={{ fontSize: '16px', fontWeight: 600, color: 'white' }}>Email Engine</span>
                            </div>
                            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
                                The modern infrastructure for event-driven email automation.
                            </p>
                        </div>

                        <div>
                            <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'white', marginBottom: '20px' }}>Product</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <Link href="#" style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'none' }}>Features</Link>
                                <Link href="#" style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'none' }}>Integrations</Link>
                                <Link href="#" style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'none' }}>Pricing</Link>
                                <Link href="#" style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'none' }}>Changelog</Link>
                            </div>
                        </div>

                        <div>
                            <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'white', marginBottom: '20px' }}>Developers</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <Link href="/docs" style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'none' }}>Documentation</Link>
                                <Link href="#" style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'none' }}>API Reference</Link>
                                <a href="https://github.com" style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    GitHub <ExternalLink style={{ width: '12px', height: '12px' }} />
                                </a>
                                <Link href="#" style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'none' }}>Status</Link>
                            </div>
                        </div>

                        <div>
                            <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'white', marginBottom: '20px' }}>Company</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <Link href="#" style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'none' }}>About</Link>
                                <Link href="#" style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'none' }}>Blog</Link>
                                <Link href="#" style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'none' }}>Contact</Link>
                            </div>
                        </div>
                    </div>

                    <div style={{ maxWidth: '1280px', margin: '64px auto 0', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ fontSize: '14px', color: '#64748b' }}>© 2026 Email Engine Inc. All rights reserved.</p>
                        <div style={{ display: 'flex', gap: '24px' }}>
                            <Link href="#" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Privacy</Link>
                            <Link href="#" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>Terms</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
