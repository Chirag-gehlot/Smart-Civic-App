import React, { useContext } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProviderNew } from "./contexts/AuthContextNew";
import { useAuth } from "./contexts/AuthContextNew";
import { ToastProvider } from "./contexts/ToastContext";
import { SiteProvider } from "./contexts/SiteContext";
import { ElectionProvider } from "./contexts/ElectionContext";
import { BlockchainProvider } from "./contexts/BlockchainContext";

// Layouts
import Layout from "./components/global/Layout";
import ChatbotLayout from "./components/global/ChatbotLayout";
import EVotingLayout from "./components/global/EVotingLayout";
// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import VerificationPage from "./pages/VerificationPage";
import ElectionsListPage from "./pages/ElectionsListPage";
import VotingPage from "./pages/VotingPage";
import ExplorerPage from "./pages/ExplorerPage";
import TransparencyPage from "./pages/TransparencyPage";
import HelpPage from "./pages/HelpPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import CreateElectionPage from "./pages/CreateElectionPage";
import EditElectionPage from "./pages/EditElectionPage";
import ChatbotPage from "./pages/ChatbotPage";

// UI Components
import LoadingScreen from "./components/ui/LoadingScreen";

// ------------------ ProtectedRoute ------------------
const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading || user === "pending") return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

// ------------------ App Routes ------------------
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* ================= PUBLIC / NORMAL PAGES ================= */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="verify" element={<VerificationPage />} />
      </Route>

      {/* ================= PROTECTED ROUTES ================= */}
      <Route element={<ProtectedRoute />}>
        {/* -------- E-VOTING LAYOUT -------- */}
        <Route element={<EVotingLayout />}>
          <Route path="e-voting" element={<ElectionsListPage />} />
          <Route path="explorer" element={<ExplorerPage />} />
          <Route path="transparency" element={<TransparencyPage />} />
          <Route path="vote/:electionId" element={<VotingPage />} />
          <Route path="admin/dashboard" element={<AdminDashboardPage />} />
          <Route
            path="admin/create-election"
            element={<CreateElectionPage />}
          />
          <Route
            path="admin/edit-election/:electionId"
            element={<EditElectionPage />}
          />
        </Route>

        {/* -------- CHATBOT LAYOUT -------- */}
        <Route element={<ChatbotLayout />}>
          <Route path="chatbot" element={<ChatbotPage />} />
        </Route>
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// ------------------ App Component ------------------
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProviderNew>
          <SiteProvider>
            <ElectionProvider>
              <BlockchainProvider>
                <AppRoutes />
              </BlockchainProvider>
            </ElectionProvider>
          </SiteProvider>
        </AuthProviderNew>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
