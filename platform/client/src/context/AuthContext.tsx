'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
    userId: string;
    email: string;
    fullName: string;
    tenantId: string;
    tenantStatus: 'onboarding' | 'active';
    role: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    refreshUserStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    // Check for existing session on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('auth_token');
            const userData = localStorage.getItem('user_data');

            if (token && userData) {
                try {
                    const parsedUser = JSON.parse(userData);
                    setUser(parsedUser);
                    setIsAuthenticated(true);

                    // Redirect based on tenant status
                    if (parsedUser.tenantStatus === 'onboarding' && !pathname?.startsWith('/onboarding')) {
                        router.push('/onboarding/basic-info');
                    }
                } catch (e) {
                    console.error('Auth check error:', e);
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user_data');
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);



    // Protect routes
    useEffect(() => {
        if (isLoading) return;

        const publicRoutes = ['/', '/login', '/signup', '/docs', '/forgot-password', '/contact', '/pricing'];
        const isPublicRoute = publicRoutes.includes(pathname || '');
        const isOnboardingRoute = pathname?.startsWith('/onboarding');

        console.log('Auth check:', { isAuthenticated, tenantStatus: user?.tenantStatus, pathname, cookie: document.cookie });

        // Allow onboarding routes if authenticated
        if (isOnboardingRoute && isAuthenticated) {
            return;
        }

        // If not authenticated and trying to access protected route
        if (!isAuthenticated && !isPublicRoute && !isOnboardingRoute) {
            if (pathname !== '/login') { // Only navigate if not already on login
                router.push('/login');
            }
            return;
        }

        // If authenticated but in onboarding status, force onboarding
        if (isAuthenticated && user?.tenantStatus === 'onboarding' && !isOnboardingRoute && !isPublicRoute) {
            console.log('Redirecting to onboarding (AuthContext)');
            if (pathname !== '/onboarding/workspace') { // Only navigate if not already there
                router.push('/onboarding/workspace');
            }
            return;
        }

        // If authenticated and active, redirect away from auth pages
        if (isAuthenticated && user?.tenantStatus === 'active' && (pathname === '/login' || pathname === '/signup')) {
            router.push('/dashboard');
            return;
        }
    }, [isLoading, isAuthenticated, pathname, user]); // Removed 'router' to prevent re-render loop

    const login = async (email: string, password: string) => {
        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const err = await response.json();
                console.error('Login failed:', err);
                throw new Error(err.detail || 'Login failed');
            }

            const data = await response.json();

            // Store JWT token in both localStorage AND cookies
            localStorage.setItem('auth_token', data.token);

            // Set cookie for middleware (expires in 7 days)
            document.cookie = `auth_token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;

            // Store user data
            const userData = {
                userId: data.user_id,
                email: email,
                fullName: data.full_name || email.split('@')[0],
                tenantId: data.tenant_id,
                tenantStatus: data.tenant_status,
                role: data.role || 'owner',
            };
            localStorage.setItem('user_data', JSON.stringify(userData));

            // Set tenant_status cookie for middleware
            document.cookie = `tenant_status=${data.tenant_status}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;

            setUser(userData);
            setIsAuthenticated(true);

            // Redirect based on tenant status
            if (data.tenant_status === 'onboarding') {
                router.push('/onboarding/workspace');
            } else {
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'tenant_status=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        setUser(null);
        setIsAuthenticated(false);
        router.push('/login');
    };

    const refreshUserStatus = async () => {
        // Update user status after completing onboarding
        const userData = localStorage.getItem('user_data');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            parsedUser.tenantStatus = 'active';
            localStorage.setItem('user_data', JSON.stringify(parsedUser));
            setUser(parsedUser);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isLoading,
                token: typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null,
                login,
                logout,
                refreshUserStatus,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
