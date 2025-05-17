import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import Index from "./pages/Index";
import FundCreationModal from "./components/FundCreationModal";
import DepositModal from "./components/DepositModal";
import CapitalRequestSheet from "./components/CapitalRequestSheet";
import DebtPaymentSheet from "./components/DebtPaymentSheet";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider, Sidebar, SidebarCategories } from "@/components/ui/sidebar";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <BrowserRouter>
          <SidebarProvider>
            <div className="flex justify-center">
              <Sidebar variant="sidebar" collapsible="icon">
                <SidebarCategories />
              </Sidebar>
              <main className="flex-1 max-w-[1200px]">
                <Index />
              </main>
            </div>
            <FundCreationModal />
            <DepositModal />
            <CapitalRequestSheet />
            <DebtPaymentSheet />
            <Toaster />
          </SidebarProvider>
        </BrowserRouter>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;