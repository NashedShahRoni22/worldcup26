import { Calendar, Users, Target, Settings, Trophy } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Link from "next/link";

const items = [
  { title: "Fixtures", url: "/", icon: Calendar },
  { title: "My Teams", url: "#", icon: Users },
  { title: "My Squad", url: "#", icon: Target },
  { title: "Settings", url: "#", icon: Settings },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-white/10 bg-slate-950/50 backdrop-blur-xl">
      <SidebarHeader className="p-4 flex items-center justify-center border-b border-white/10 mb-2">
        <Trophy className="w-8 h-8 text-emerald-400 mb-2 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
        <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
          FIFA 2026
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-semibold tracking-wider uppercase text-xs mb-2">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="hover:bg-white/10 hover:text-emerald-400 transition-colors p-0">
                    <Link href={item.url} className="flex items-center w-full px-2 py-1.5">
                      <item.icon className="w-5 h-5 mr-3" />
                      <span className="font-medium text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
