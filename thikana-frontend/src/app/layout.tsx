import type { Metadata } from "next";
import {
  Anton,
  Geist,
  Geist_Mono,
  Instrument_Serif,
  Inter,
  Plus_Jakarta_Sans,
  Outfit,
} from "next/font/google";
import { siteDescription, siteName } from "@/config/site";
import { SiteLoaderProvider } from "@/components/loading/site-loader-provider";
import { AdminAuthProvider } from "@/lib/auth/AdminAuthProvider";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["800"],
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
});

export const metadata: Metadata = {
  title: siteName,
  description: siteDescription,
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/thikana-logo.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/thikana-logo.png", sizes: "192x192", type: "image/png" }],
    shortcut: ["/favicon-48.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${plusJakartaSans.variable} ${outfit.variable} ${anton.variable} ${instrumentSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          <AdminAuthProvider>
            <SiteLoaderProvider>{children}</SiteLoaderProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
