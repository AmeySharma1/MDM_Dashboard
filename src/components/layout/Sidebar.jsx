import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiMonitor, FiSettings, FiBarChart2, FiCpu, FiShield, FiTrendingUp } from 'react-icons/fi';

const Sidebar = ({ isCollapsed, onClose }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <FiHome className="w-5 h-5" /> },
    { path: '/devices', label: 'Devices', icon: <FiMonitor className="w-5 h-5" /> },
    { path: '/scheduler', label: 'Update Schedule', icon: <FiSettings className="w-5 h-5" /> },
    { path: '/active-monitor', label: 'Active Rollout', icon: <FiCpu className="w-5 h-5" /> },
    { path: '/monitor', label: 'Rollout Monitor', icon: <FiBarChart2 className="w-5 h-5" /> },
  ];

  return (
    <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-80 glass-sidebar h-full flex-shrink-0 transition-transform duration-500 overflow-hidden border-r border-black/5 dark:border-white/5 ${isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

      <div className="p-10 relative z-10">
        <h1 className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white flex flex-col gap-1 italic">
          MoveInSync
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400">MDM</span>
            <div className="h-[2px] w-8 bg-primary-500"></div>
          </div>
        </h1>
      </div>

      <nav className="mt-10 px-6 space-y-2 relative z-10">
        <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 dark:text-gray-500 mb-6">Navigation Hub</p>
        <ul className="space-y-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => {
                    setTimeout(() => onClose(), 0);
                  }}
                  className={`group flex items-center px-5 py-4 text-xs font-black uppercase tracking-[0.15em] rounded-[1.25rem] transition-all duration-500 ${isActive
                    ? 'bg-primary-500/10 text-primary-500 border border-primary-500/20 shadow-[0_10px_30px_-10px_rgba(59,130,246,0.2)]'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                >
                  <span className={`mr-4 transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-12'}`}>{item.icon}</span>
                  {item.label}
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500 shadow-[0_0_10px_rgba(59,130,246,1)]"></div>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-8 left-0 w-full px-6 space-y-4">

        {/* Close Menu Button - Mobile Only */}
        <button
          onClick={onClose}
          className="w-full lg:hidden py-4 px-6 bg-gray-900/10 dark:bg-white/5 hover:bg-gray-900/20 dark:hover:bg-white/10 rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white transition-all border border-black/5 dark:border-white/10"
        >
          Close Menu
        </button>
      </div>
    </aside>
  );
};

export default React.memo(Sidebar);
