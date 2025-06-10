import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "@/context/AppContext";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Index />
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;