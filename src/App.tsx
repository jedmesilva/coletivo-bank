import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import Index from "./pages/Index";
import FundCreationModal from "./components/FundCreationModal";
import DepositModal from "./components/DepositModal";
import CapitalRequestSheet from "./components/CapitalRequestSheet";
import DebtPaymentSheet from "./components/DebtPaymentSheet";
import { Toaster } from "@/components/ui/sonner";
import MainMenu from "./components/MainMenu";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
            <MainMenu />
            <main className="flex-1 w-full max-w-[1200px] mx-auto">
              <Index />
            </main>
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