import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { ToastProvider } from "@/components/ui";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "Email Engine",
    description: "Enterprise Email Marketing Platform",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={inter.variable}>
            <body className={inter.className}>
                <AuthProvider>
                    <ToastProvider>
                        <LayoutWrapper>
                            {children}
                        </LayoutWrapper>
                    </ToastProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
