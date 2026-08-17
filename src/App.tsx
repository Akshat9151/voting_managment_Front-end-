import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

// Layout
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { TeamPage } from './pages/TeamPage';
import { CandidatesPage } from './pages/CandidatesPage';
import { VotersPage } from './pages/VotersPage';
import { DesignStudioPage } from './pages/DesignStudioPage';
import { BroadcastPage } from './pages/BroadcastPage';
import { VolunteersPage } from './pages/VolunteersPage';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { VolunteerWardPage } from './pages/VolunteerWardPage';
import { VolunteerAddPage } from './pages/VolunteerAddPage';
import { VolunteerActivityPage } from './pages/VolunteerActivityPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="candidates" element={<CandidatesPage />} />
        <Route path="voters" element={<VotersPage />} />
        <Route path="studio" element={<DesignStudioPage />} />
        <Route path="broadcast" element={<BroadcastPage />} />
        <Route path="volunteers" element={<VolunteersPage />} />
        <Route path="complaints" element={<ComplaintsPage />} />
        <Route path="expenses" element={<ExpensesPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="volunteer-ward" element={<VolunteerWardPage />} />
        <Route path="volunteer-add" element={<VolunteerAddPage />} />
        <Route path="volunteer-activity" element={<VolunteerActivityPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <ThemeProvider>
            <ToastProvider>
              <AppRoutes />
            </ToastProvider>
          </ThemeProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
