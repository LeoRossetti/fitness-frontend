import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css";
import "./styles/animations.css";
import { Toaster } from "react-hot-toast";
import { ConvexClientProvider } from "@/components/providers/ConvexProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Fitness App",
  description: "Manage your fitness clients and sessions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <ErrorBoundary>
          <ConvexClientProvider>
            {children}
            <Toaster position="top-right" />
          </ConvexClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}