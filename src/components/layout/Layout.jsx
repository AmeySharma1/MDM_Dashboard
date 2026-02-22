import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useTheme } from '../../context/ThemeContext';

const FloatingLines = React.lazy(() => import('../ui/FloatingLines/FloatingLines'));

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  // Auto-close sidebar on route change (Mobile)
  useEffect(() => {
    setSidebarCollapsed(true);
  }, [location.pathname]);

  const { isDark } = useTheme();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-gray-100 relative overflow-hidden transition-colors duration-500">
      {/* Global Animated Background for Dark Mode */}
      {isDark && (
        <React.Suspense fallback={null}>
          <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
            <FloatingLines
              enabledWaves={["top", "middle", "bottom"]}
              lineCount={8}
              lineDistance={4}
              bendRadius={4}
              bendStrength={-0.3}
              interactive={true}
              parallax={true}
            />
          </div>
        </React.Suspense>
      )}

      {/* Mobile Backdrop
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={(e) => {
            e.stopPropagation();
            setSidebarCollapsed(true);
          }}
        ></div>
      )} */}

      <div className="relative z-10 flex w-full h-full">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onClose={() => setSidebarCollapsed(true)}
          className="glass-sidebar"
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={toggleSidebar} className="glass-header" />

          <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;