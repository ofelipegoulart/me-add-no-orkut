import type { Metadata } from "next";
import AuthSessionProvider from "@/components/ui/Providers/session-provider";
import { DisclaimerBanner } from "@/components/ui/Header/disclaimer-banner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Me Add no Orkut",
  description: "A recreation of the classic Orkut social network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body suppressHydrationWarning className="min-h-screen w-full bg-orkut-bg">
        <DisclaimerBanner />
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
