import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DeviceProvider } from './context/DeviceContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Devices = React.lazy(() => import('./pages/Devices'));
const UpdateScheduler = React.lazy(() => import('./pages/UpdateScheduler'));
const RolloutMonitor = React.lazy(() => import('./pages/RolloutMonitor'));
const ActiveRolloutMonitor = React.lazy(() => import('./pages/ActiveRolloutMonitor'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));

// Robust Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // Or a splash screen

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DeviceProvider>
          <Router>
            <Routes>
              {/* Public Entry Point */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Administrative Layer */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <React.Suspense fallback={
                        <div className="h-full w-full flex items-center justify-center p-20">
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Synching Neural Link...</p>
                          </div>
                        </div>
                      }>
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/devices" element={<Devices />} />
                          <Route path="/scheduler" element={<UpdateScheduler />} />
                          <Route path="/active-monitor" element={<ActiveRolloutMonitor />} />
                          <Route path="/monitor" element={<RolloutMonitor />} />
                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                      </React.Suspense>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </DeviceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
