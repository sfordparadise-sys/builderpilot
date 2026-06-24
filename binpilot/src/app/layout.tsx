import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mimico Bin Cleaning — BinPilot",
  description:
    "Professional bin cleaning for Mimico and New Toronto homes and multi-unit buildings. Scheduled, reliable, and odour-free.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
