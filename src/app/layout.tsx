import type { Metadata } from "next";
import "./styles/globals.css";

export const metadata: Metadata = {
  title: "Trainer Hub",
  description: "Best trainer app ever",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}