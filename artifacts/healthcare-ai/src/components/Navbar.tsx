import { Moon, Sun, Cross, Menu } from "lucide-react";
import { useTheme } from "@/context/ThemeProvider";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" data-testid="navbar">
      <div className="flex h-16 items-center px-4 md:px-6 gap-4">
        <div className="flex items-center gap-2 lg:hidden">
          <SidebarTrigger data-testid="sidebar-trigger">
            <Menu className="w-6 h-6" />
          </SidebarTrigger>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <Cross className="w-5 h-5" />
          </div>
          <span className="font-semibold text-xl tracking-tight hidden sm:inline-block">MediAI</span>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            data-testid="button-theme-toggle"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <Avatar className="w-9 h-9 border border-border" data-testid="user-avatar">
            <AvatarFallback className="bg-primary/10 text-primary font-medium">AJ</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
