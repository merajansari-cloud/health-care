import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/context/ThemeProvider";
import MainLayout from "@/layouts/MainLayout";
import Dashboard from "@/pages/Dashboard";
import Chat from "@/pages/Chat";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/chat" component={Chat} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          
          {/* FIX: safer base handling (prevents deploy bugs) */}
          <WouterRouter
            base={
              import.meta.env.BASE_URL
                ? import.meta.env.BASE_URL.replace(/\/$/, "")
                : ""
            }
          >
            <Router />
          </WouterRouter>

          <Toaster />

        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
