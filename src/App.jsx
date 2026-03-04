import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import ToastProvider from "./components/ui/ToastProvider";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;