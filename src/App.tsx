import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import Index from "./pages/Index";
import AccountPage from "./pages/AccountPage";
import AuthPage from "./pages/AuthPage";
import FundDetail from "./components/FundDetail";
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
          <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/*" element={
                <>
                  <main className="flex-1 w-full max-w-[1200px] mx-auto">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/account" element={<AccountPage />} />
                      <Route path="/fund/:fundId" element={<FundDetail />} />
                    </Routes>
                  </main>
                  <BottomNavigation />
                </>
              } />
            </Routes>
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