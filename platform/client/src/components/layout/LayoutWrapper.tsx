"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

interface LayoutWrapperProps {
    children: React.ReactNode;
}

import { useState } from "react";

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { isAuthenticated, isLoading, user } = useAuth();

    // Public routes that should NOT show sidebar (marketing/auth pages)
    const publicRoutes = ['/', '/login', '/signup', '/docs', '/forgot-password', '/contact', '/pricing', '/unsubscribe'];
    const isPublicRoute = publicRoutes.includes(pathname || '');
    const isOnboardingRoute = pathname?.startsWith('/onboarding');

    // Full-screen routes: template editor (/templates/[id]) should hide sidebar for immersive editing
    const isFullScreenRoute = /^\/templates\/[^/]+$/.test(pathname || '') && pathname !== '/templates';

    // Only show sidebar/header for authenticated users on app routes
    const showSidebar = !isPublicRoute && !isOnboardingRoute && !isFullScreenRoute && isAuthenticated;

    // Show loading state
    const isRedirectingToOnboarding = isAuthenticated && user?.tenantStatus === 'onboarding' && !isOnboardingRoute && !isPublicRoute;
    if (isLoading || isRedirectingToOnboarding) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[var(--bg-primary)]">
                <div className="w-8 h-8 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-4 border-solid border-[var(--accent)] border-t-transparent animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden relative">
            {showSidebar && <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />}

            <main className="flex-1 overflow-auto bg-[var(--bg-primary)] flex flex-col min-w-0">
                {showSidebar && <Header setMobileMenuOpen={() => setMobileMenuOpen(true)} />}
                <div className={`flex-1 ${showSidebar ? 'p-4 md:p-8 max-w-7xl mx-auto w-full' : 'w-full'}`}>
                    {children}
                </div>
            </main>
        </div>
    );
}
