import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import Index from "./pages/Index";
import FundCreationModal from "./components/FundCreationModal";
import DepositModal from "./components/DepositModal";
import CapitalRequestSheet from "./components/CapitalRequestSheet";
import DebtPaymentSheet from "./components/DebtPaymentSheet";
import { Toaster } from "@/components/ui/sonner";
import BottomNavigation from "./components/BottomNavigation";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <main className="flex-1 w-full max-w-lg mx-auto px-4 pb-20">
              <Index />
            </main>
            <BottomNavigation />
            <FundCreationModal />
            <DepositModal />
            <CapitalRequestSheet />
            <DebtPaymentSheet />
            <Toaster />
          </div>
        </BrowserRouter>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;