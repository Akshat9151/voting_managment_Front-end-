import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ElectionProvider } from './context/ElectionContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

// Layout
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { SplashPage } from './pages/SplashPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { TeamPage } from './pages/TeamPage';
import { CandidatesPage } from './pages/CandidatesPage';
import { VotersPage } from './pages/VotersPage';
import { TasksPage } from './pages/TasksPage';
import { FieldActivitiesPage } from './pages/FieldActivitiesPage';
import { DesignStudioPage } from './pages/DesignStudioPage';
import { BroadcastPage } from './pages/BroadcastPage';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { VolunteerWardPage } from './pages/VolunteerWardPage';
import { VolunteerAddPage } from './pages/VolunteerAddPage';
import { VolunteerActivityPage } from './pages/VolunteerActivityPage';
import { VolunteersPage } from './pages/VolunteersPage';
import { SubscriptionsPage } from './pages/SubscriptionsPage';

const ROLE_ROUTE_ALLOWLIST: Record<'SUPER_ADMIN' | 'ADMIN' | 'VOLUNTEER', readonly string[]> = {
  SUPER_ADMIN: ['/', '/team', '/volunteers', '/candidates', '/voters', '/tasks', '/field-activities', '/studio', '/broadcast', '/complaints', '/expenses', '/analytics', '/subscriptions', '/settings', '/volunteer-ward', '/volunteer-add', '/volunteer-activity'],
  ADMIN: ['/', '/team', '/volunteers', '/voters', '/tasks', '/field-activities', '/studio', '/broadcast', '/complaints', '/expenses', '/analytics', '/subscriptions', '/settings'],
  VOLUNTEER: ['/', '/volunteer-add', '/volunteer-activity', '/volunteer-ward', '/field-activities', '/tasks', '/studio']
};

// ─── ProtectedRoute with optional permission check ────────────────────────────
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  permission?: string;
}> = ({ children, permission }) => {
  const { isAuthenticated, isLoading, hasPermission, currentRole } = useAuth();
  const location = useLocation();

  // Wait for session restore before redirecting
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500">Restoring session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const roleKey = (currentRole ?? 'VOLUNTEER') as keyof typeof ROLE_ROUTE_ALLOWLIST;
  const allowedRoutes = ROLE_ROUTE_ALLOWLIST[roleKey] ?? [];
  const isAllowedPath = allowedRoutes.some((route: string) => {
    if (route === '/') return location.pathname === '/';
    return location.pathname === route || location.pathname.startsWith(`${route}/`);
  });

  if (!isAllowedPath) {
    return (
      <div className="p-8 text-center">
        <div className="text-4xl mb-3">🔒</div>
        <h2 className="text-lg font-bold text-slate-800 mb-1">Access Restricted</h2>
        <p className="text-xs text-slate-500">This route is not available for your current role.</p>
      </div>
    );
  }

  if (permission && !hasPermission(permission)) {
    return (
      <div className="p-8 text-center">
        <div className="text-4xl mb-3">🔒</div>
        <h2 className="text-lg font-bold text-slate-800 mb-1">Access Restricted</h2>
        <p className="text-xs text-slate-500">You don't have permission to view this page.</p>
      </div>
    );
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
        <Route path="volunteers" element={<VolunteersPage />} />
        <Route path="candidates" element={<CandidatesPage />} />
        <Route path="voters" element={<VotersPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="field-activities" element={<FieldActivitiesPage />} />
        <Route path="studio" element={<DesignStudioPage />} />
        <Route path="broadcast" element={<BroadcastPage />} />
        <Route path="complaints" element={<ComplaintsPage />} />
        <Route path="expenses" element={<ExpensesPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="subscriptions" element={<SubscriptionsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="volunteer-ward" element={<VolunteerWardPage />} />
        <Route path="volunteer-add" element={<VolunteerAddPage />} />
        <Route path="volunteer-activity" element={<VolunteerActivityPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export const AppContent: React.FC = () => {
  const [showSplash, setShowSplash] = React.useState(() => {
    return !sessionStorage.getItem('vv_splash_shown');
  });

  if (showSplash) {
    return (
      <SplashPage
        onComplete={() => {
          sessionStorage.setItem('vv_splash_shown', 'true');
          setShowSplash(false);
        }}
      />
    );
  }

  return <AppRoutes />;
};

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || import.meta.env.GOOGLE_CLIENT_ID || '788447535370-saku8bnlrok263gt8qh244aq7rucnr53.apps.googleusercontent.com';


export const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter future={{ v7_relativeSplatPath: true }}>
        <AuthProvider>
          <ElectionProvider>
            <LanguageProvider>
              <ThemeProvider>
                <ToastProvider>
                  <AppContent />
                </ToastProvider>
              </ThemeProvider>
            </LanguageProvider>
          </ElectionProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default App;
