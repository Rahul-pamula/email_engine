"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";

interface LayoutWrapperProps {
    children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
    const pathname = usePathname();
    const { isAuthenticated, isLoading, user } = useAuth();

    // Public routes that should NOT show sidebar (marketing/auth pages)
    const publicRoutes = ['/', '/login', '/signup', '/docs', '/forgot-password', '/contact', '/pricing'];
    const isPublicRoute = publicRoutes.includes(pathname || '');
    const isOnboardingRoute = pathname?.startsWith('/onboarding');

    // Full-screen routes: template editor (/templates/[id]) should hide sidebar for immersive editing
    const isFullScreenRoute = /^\/templates\/[^/]+$/.test(pathname || '') && pathname !== '/templates';

    // Only show sidebar for authenticated users on app routes (not public, onboarding, or full-screen)
    const showSidebar = !isPublicRoute && !isOnboardingRoute && !isFullScreenRoute && isAuthenticated;

    // If the user's tenant is 'onboarding', but they are trying to access a protected route like /dashboard,
    // AuthContext will redirect them. We want to show a loading state here to prevent the dashboard from flashing.
    const isRedirectingToOnboarding = isAuthenticated && user?.tenantStatus === 'onboarding' && !isOnboardingRoute && !isPublicRoute;

    // Show loading state
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
        <div style={{
            display: 'flex',
            minHeight: '100vh',
        }}>
            {showSidebar && <Sidebar />}

            <main className="flex-1 overflow-auto bg-[var(--bg-primary)]">
                <div style={{
                    padding: showSidebar ? '32px' : '0',
                    maxWidth: showSidebar ? '1280px' : '100%',
                }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
