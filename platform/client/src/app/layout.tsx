import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Email Engine",
    description: "Enterprise Email Marketing Platform",
};

// Light Mode Colors
const colors = {
    bgPrimary: '#ffffff',
    textPrimary: '#0f172a',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className} style={{
                margin: 0,
                padding: 0,
                backgroundColor: colors.bgPrimary,
                color: colors.textPrimary,
                minHeight: '100vh',
            }}>
                <AuthProvider>
                    <LayoutWrapper>
                        {children}
                    </LayoutWrapper>
                </AuthProvider>
            </body>
        </html>
    );
}
