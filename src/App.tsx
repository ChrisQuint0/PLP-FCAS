import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ModuleSelection from "./pages/ModuleSelection";
import MainPage from "./pages/MainPage";
import { ToastProvider } from "./contexts/ToastContext";

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          {/* The Default Route opens the MainPage */}
          <Route path="/" element={<MainPage />} />

          {/* The Module Selection Route */}
          <Route path="/module-selection" element={<ModuleSelection />} />

          {/* Catch-all route to redirect back to home if they type a bad URL */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
