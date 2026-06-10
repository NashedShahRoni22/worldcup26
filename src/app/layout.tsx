import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MobileNav } from "@/components/navigation";
import Link from "next/link";
import { DesktopNav } from "@/components/navigation";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FIFA World Cup 2026 Fixtures",
  description: "Premium FIFA World Cup 2026 Fixtures dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bebasNeue.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground pb-16 sm:pb-0">
        <Providers>
          <TooltipProvider>
            <div className="flex flex-col flex-1 min-w-0 bg-background">
              {/* Desktop Top Navbar */}
              <header className="hidden sm:flex h-16 items-center justify-between border-b border-border bg-background/80 px-8 backdrop-blur sticky top-0 z-10 w-full">
                <Link
                  href="/"
                  className="text-2xl font-heading text-primary tracking-wide hover:opacity-80 transition-opacity"
                >
                  FIFA World Cup 2026
                </Link>
                <DesktopNav />
              </header>
              <main className="flex-1 w-full relative z-0">{children}</main>
            </div>
            <MobileNav />
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
