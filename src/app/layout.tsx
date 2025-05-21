import type { Metadata } from "next";
import "./styles/globals.css";

import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Trainer Hub",
  description: "Best trainer app ever",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}