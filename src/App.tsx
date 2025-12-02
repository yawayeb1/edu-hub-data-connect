import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicRoute } from "@/components/PublicRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ATiShare from "./pages/services/ATiShare";
import MTNUP2U from "./pages/services/MTNUP2U";
import Telecel from "./pages/services/Telecel";
import Wallet from "./pages/Wallet";
import Transactions from "./pages/Transactions";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes - Only accessible when NOT logged in */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* Protected Routes - Require authentication */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/at-ishare"
              element={
                <ProtectedRoute>
                  <ATiShare />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/mtn-up2u"
              element={
                <ProtectedRoute>
                  <MTNUP2U />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/telecel"
              element={
                <ProtectedRoute>
                  <Telecel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wallet"
              element={
                <ProtectedRoute>
                  <Wallet />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <Transactions />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
