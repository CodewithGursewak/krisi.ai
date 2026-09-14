import {
  CloudSun,
  FlaskConical,
  IndianRupee,
  Leaf,
  MessageCircle,
  ScanLine,
  Settings as SettingsIcon,
  Sprout,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { navLabels } from "@/lib/nav";

export function AppSidebar({ lang }: { lang: Lang }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const labels = t[lang];
  const nav = navLabels[lang];

  const items = [
    { title: nav.chat, url: "/app/chat", icon: MessageCircle },
    { title: nav.crop, url: "/app/crop-guide", icon: Leaf },
    { title: nav.disease, url: "/app/disease-detection", icon: ScanLine },
    { title: nav.weather, url: "/app/weather", icon: CloudSun },
    { title: nav.fertilizer, url: "/app/fertilizer", icon: FlaskConical },
    { title: nav.market, url: "/app/market-prices", icon: IndianRupee },
    { title: nav.settings, url: "/app/settings", icon: SettingsIcon },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="flex items-center gap-2.5 px-3 py-4">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-primary shadow-glow">
            <Sprout className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-bold leading-tight">
                {labels.appName}
              </p>
              <p className="truncate text-xs text-muted-foreground leading-tight">
                {labels.tagline}
              </p>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>{nav.groupLabel}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <NavLink to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </NavLink>
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
