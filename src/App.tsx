import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Layouts
import { AppLayout } from "@/components/layout/AppLayout";

// Auth Pages
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage";
import { VerifyEmailPage } from "@/pages/auth/VerifyEmailPage";
import { ResetPasswordPage } from "@/pages/auth/ResetPasswordPage";

// Student Pages
import { ExplorePage } from "@/pages/student/ExplorePage";
import { InstructorProfilePage } from "@/pages/student/InstructorProfilePage";
import { SchoolProfilePage } from "@/pages/student/SchoolProfilePage";

// Professional Pages
import { RequestsPage } from "@/pages/instructor/RequestsPage";
import { OnboardingPage } from "@/pages/professional/OnboardingPage";

// Shared Pages
import { ProfilePage } from "@/pages/shared/ProfilePage";
import { NotificationsPage } from "@/pages/shared/NotificationsPage";
import { ConversationsPage } from "@/pages/shared/ConversationsPage";
import { ChatPage } from "@/pages/shared/ChatPage";
import { SubscriptionPage } from "@/pages/shared/SubscriptionPage";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary/30 rounded-full" />
          <div className="absolute inset-0 w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, isLoading, userRole } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={
        isAuthenticated 
          ? <Navigate to="/explore" replace />
          : <LoginPage />
      } />
      <Route path="/register" element={
        isAuthenticated 
          ? <Navigate to="/explore" replace />
          : <RegisterPage />
      } />
      <Route path="/forgot-password" element={
        isAuthenticated 
          ? <Navigate to="/explore" replace />
          : <ForgotPasswordPage />
      } />
      
      {/* Email Verification & Password Reset (accessible always) */}
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected App Routes */}
      <Route element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }>
        {/* Student Routes */}
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/lessons" element={<Navigate to="/profile" replace />} />
        <Route path="/instructor/:id" element={<InstructorProfilePage />} />
        <Route path="/school/:id" element={<SchoolProfilePage />} />

        {/* Professional Routes */}
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/schedule" element={<Navigate to="/profile" replace />} />
        <Route path="/requests" element={<RequestsPage />} />
        <Route path="/earnings" element={<Navigate to="/profile" replace />} />

        {/* Shared Routes */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/conversations" element={<ConversationsPage />} />
        <Route path="/chat/:id" element={<ChatPage />} />
        <Route path="/chat/:id" element={<ChatPage />} />
      </Route>

      {/* Redirects */}
      <Route path="/" element={
        isAuthenticated 
          ? <Navigate to="/explore" replace />
          : <Navigate to="/login" replace />
      } />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
