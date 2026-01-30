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

// Student Pages
import { ExplorePage } from "@/pages/student/ExplorePage";
import { LessonsPage } from "@/pages/student/LessonsPage";
import { InstructorProfilePage } from "@/pages/student/InstructorProfilePage";
import { SchoolProfilePage } from "@/pages/student/SchoolProfilePage";

// Instructor Pages
import { SchedulePage } from "@/pages/instructor/SchedulePage";
import { RequestsPage } from "@/pages/instructor/RequestsPage";
import { EarningsPage } from "@/pages/instructor/EarningsPage";

// Shared Pages
import { ProfilePage } from "@/pages/shared/ProfilePage";
import { NotificationsPage } from "@/pages/shared/NotificationsPage";
import { ConversationsPage } from "@/pages/shared/ConversationsPage";
import { ChatPage } from "@/pages/shared/ChatPage";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, userRole } = useAuth();

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={
        isAuthenticated 
          ? <Navigate to={userRole === 'professional' ? '/schedule' : '/explore'} replace />
          : <LoginPage />
      } />
      <Route path="/register" element={
        isAuthenticated 
          ? <Navigate to={userRole === 'professional' ? '/schedule' : '/explore'} replace />
          : <RegisterPage />
      } />

      {/* Protected App Routes */}
      <Route element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }>
        {/* Student Routes */}
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/lessons" element={<LessonsPage />} />
        <Route path="/instructor/:id" element={<InstructorProfilePage />} />
        <Route path="/school/:id" element={<SchoolProfilePage />} />

        {/* Instructor Routes */}
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/requests" element={<RequestsPage />} />
        <Route path="/earnings" element={<EarningsPage />} />

        {/* Shared Routes */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/conversations" element={<ConversationsPage />} />
        <Route path="/chat/:id" element={<ChatPage />} />
      </Route>

      {/* Redirects */}
      <Route path="/" element={
        isAuthenticated 
          ? <Navigate to={userRole === 'professional' ? '/schedule' : '/explore'} replace />
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