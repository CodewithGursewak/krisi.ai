import { Link, Outlet } from "react-router-dom";
import { Home } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/krishi/AppSidebar";
import { LanguageToggle } from "@/components/krishi/LanguageToggle";
import { useLang } from "@/hooks/useLang";
import { navLabels } from "@/lib/nav";

export default function AppLayout() {
  const [lang, setLang] = useLang();
  const nav = navLabels[lang];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar lang={lang} />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border bg-card/70 px-3 backdrop-blur">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-muted-foreground transition-smooth hover:bg-secondary hover:text-foreground"
              >
                <Home className="h-3.5 w-3.5" />
                {nav.home}
              </Link>
            </div>
            <LanguageToggle lang={lang} onChange={setLang} />
          </header>
          <main className="min-h-0 flex-1">
            <Outlet context={{ lang, setLang }} />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
