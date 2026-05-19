import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BuilderPilot — Run Your Sites. Not Just Your Day.",
  description: "The AI operating system for residential builders. Built by site supers, for site supers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-ink text-white antialiased">{children}</body>
    </html>
  );
}
