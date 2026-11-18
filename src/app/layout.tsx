import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemedToaster } from "@/components/ThemedToaster";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AOSProvider } from "@/components/AOSProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FixMate — Device & Appliance Repair Service",
    template: "%s · FixMate",
  },
  description:
    "Book verified technicians for smartphone, laptop, AC, refrigerator, TV and washing machine repairs. Pay only after the job is completed.",
  applicationName: "FixMate",
  keywords: [
    "repair service",
    "technician booking",
    "appliance repair",
    "device repair",
    "FixMate",
  ],
  openGraph: {
    title: "FixMate — Device & Appliance Repair Service",
    description:
      "Verified technicians, transparent pricing and pay-after-service protection for every repair.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f1a" },
  ],
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
          <ThemedToaster />
          <AOSProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}


