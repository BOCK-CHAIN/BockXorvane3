import { QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import ControlLayout from "./layouts/ControlLayout";
import { queryClient } from "./clients/reactquery";
import { Toaster } from "./components/ui/toaster";
import AuthButton from "./components/global/AuthButton";
import Widget from "./components/global/widget";

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ControlLayout className="h-screen w-screen ">
          <AuthButton />
          <Widget />
        </ControlLayout>
        <Toaster />
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </>
  );
}

export default App;
