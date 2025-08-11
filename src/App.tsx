import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Planner from "./pages/Planner";
import Supervisor from "./pages/Supervisor";
import Reporting from "./pages/Reporting";
import SeedData from "./pages/SeedData";
import NotFound from "./pages/NotFound";
import NavBar from "./components/NavBar";
import ScheduleBoard from "./pages/ScheduleBoard";
import NewProject from "./pages/NewProject";
import EmployeeCheckIn from "./pages/EmployeeCheckIn";
import Employees from "./pages/Employees";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/supervisor" element={<Supervisor />} />
          <Route path="/reporting" element={<Reporting />} />
          <Route path="/board" element={<ScheduleBoard />} />
          <Route path="/projects/new" element={<NewProject />} />
          <Route path="/checkin" element={<EmployeeCheckIn />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/seed" element={<SeedData />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
