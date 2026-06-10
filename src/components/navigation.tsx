'use client';

import { Calendar, Star } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const navItems = [
  { href: "/", icon: Calendar, label: "Fixtures" },
  { href: "/favourite", icon: Star, label: "Favourite" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-card/80 backdrop-blur-xl border-t border-border pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-white"
              )}
            >
              <item.icon className={cn("w-6 h-6", isActive && "fill-primary/20")} />
              <span className="text-[10px] font-medium tracking-wide uppercase">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-8">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors",
              isActive ? "text-primary" : "text-muted-foreground hover:text-white"
            )}
          >
            <item.icon className={cn("w-4 h-4", isActive && "fill-primary/20")} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
