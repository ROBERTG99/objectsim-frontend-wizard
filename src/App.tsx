
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppLayout from "./components/AppLayout";
import Index from "./pages/Index";
import Namespaces from "./pages/Namespaces";
import Interfaces from "./pages/Interfaces";
import Classes from "./pages/Classes";
import Methods from "./pages/Methods";
import Execution from "./pages/Execution";
import Transformers from "./pages/Transformers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/namespaces" element={<Namespaces />} />
                <Route path="/interfaces" element={<Interfaces />} />
                <Route path="/classes" element={<Classes />} />
                <Route path="/methods" element={<Methods />} />
                <Route path="/execution" element={<Execution />} />
                <Route path="/transformers" element={<Transformers />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
