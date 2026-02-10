"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";

// Light Mode layout logic
const colors = {
    bgPrimary: '#ffffff',
    textPrimary: '#0f172a',
};

interface LayoutWrapperProps {
    children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
    const pathname = usePathname();
    const { isAuthenticated, isLoading } = useAuth();

    // Public routes that should NOT show sidebar (marketing/auth pages)
    const publicRoutes = ['/', '/login', '/signup', '/docs', '/forgot-password', '/contact', '/pricing'];
    const isPublicRoute = publicRoutes.includes(pathname || '');
    const isOnboardingRoute = pathname?.startsWith('/onboarding');

    // Only show sidebar for authenticated users on app routes (not public or onboarding)
    const showSidebar = !isPublicRoute && !isOnboardingRoute && isAuthenticated;

    // Show loading state
    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
            }}>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
        }}>
            {showSidebar && <Sidebar />}

            <main style={{
                flex: 1,
                overflow: 'auto',
                backgroundColor: colors.bgPrimary,
            }}>
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
