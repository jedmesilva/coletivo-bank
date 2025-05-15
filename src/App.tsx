import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import Index from "./pages/Index";
import FundCreationModal from "./components/FundCreationModal";
import DepositModal from "./components/DepositModal";
import CapitalRequestSheet from "./components/CapitalRequestSheet";
import DebtPaymentSheet from "./components/DebtPaymentSheet";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <BrowserRouter>
          <Index />
          <FundCreationModal />
          <DepositModal />
          <CapitalRequestSheet />
          <DebtPaymentSheet />
        </BrowserRouter>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;