import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { OrkutHeader } from "@/components/Header/orkut-header";
import "./globals.css";
import OrkutLeftSidebar from "@/components/LeftSideBar/container-bar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Orkut Clone",
  description: "A recreation of the classic Orkut social network",
};

const DEFAULT_USERNAME = "felipe";

function emailLocalFromUsername(username: string) {
  try {
    const raw = decodeURIComponent(username).toLowerCase().replace(/\+/g, "");
    const slug = raw.replace(/[^a-z0-9._-]/g, "").slice(0, 32);
    return slug || "usuario";
  } catch {
    return "usuario";
  }
}

function displayNameFromUsername(username: string) {
  try {
    return decodeURIComponent(username)
      .replace(/\+/g, " ")
      .replace(/-/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  } catch {
    return username;
  }
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const email = `${emailLocalFromUsername(DEFAULT_USERNAME)}@gmail.com`;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen w-full bg-[#d4e0ef]">
        <OrkutHeader email={email} />
        <div className="min-h-screen w-full bg-[#d4e0ef]">
          <div className="orkut-shell">
            <div className="flow-root">
              <div className="orkut-col-left border border-[#bcd2e8] bg-white shadow-sm">
                <OrkutLeftSidebar displayName={displayNameFromUsername(DEFAULT_USERNAME)} />
              </div>
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
