import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import Users from "./pages/Users";
import Schedule from "./pages/Schedule";
import Logs from "./pages/Logs";
import Reports from "./pages/Reports";
import OCR from "./pages/OCR";
import Settings from "./pages/Settings";
import SCADA from "./pages/SCADA";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
                <SidebarTrigger />
                <div className="flex-1" />
              </header>
              <main className="flex-1 p-6 overflow-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/devices" element={<Devices />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/logs" element={<Logs />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/ocr" element={<OCR />} />
                  <Route path="/scada" element={<SCADA />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
