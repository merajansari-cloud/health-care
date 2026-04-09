import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, MessageCircle } from "lucide-react";

export default function MainLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "Chat", url: "/chat", icon: MessageCircle },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background flex-col md:flex-row">
        <div className="hidden md:block">
          <AppSidebar />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 pb-16 md:pb-0 overflow-y-auto" data-testid="main-content">
            {children}
            <Footer />
          </main>

          {/* Mobile Bottom Nav */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur z-50 flex items-center justify-around p-2" data-testid="mobile-bottom-nav">
            {navItems.map((item) => {
              const isActive = location === item.url;
              return (
                <Link key={item.title} href={item.url} data-testid={`mobile-nav-${item.title.toLowerCase()}`}>
                  <div className={`flex flex-col items-center p-2 rounded-lg ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    <item.icon className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-medium">{item.title}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
