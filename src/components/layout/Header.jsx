import React, { useState } from 'react';
import { FiSearch, FiBell, FiUser, FiMenu, FiSettings, FiLogOut } from 'react-icons/fi';
import ThemeToggle from '../ui/ThemeToggle';
import { useAuth } from '../../context/AuthContext';

const Header = ({ onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="glass-header px-10 py-5 sticky top-0 z-[60] border-b border-white/5 backdrop-blur-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button
            onClick={onMenuClick}
            className="p-3 rounded-2xl hover:bg-white/10 lg:hidden transition-all duration-300 border border-transparent hover:border-white/10"
          >
            <FiMenu className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Right side - Theme, User */}
        <div className="flex items-center space-x-6">
          <ThemeToggle />

          <div
            className="flex items-center space-x-5 pl-4 group cursor-pointer relative"
            onMouseEnter={() => setShowProfileMenu(true)}
            onMouseLeave={() => setShowProfileMenu(false)}
          >
            <div className="hidden lg:block text-right">
              <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">{user?.name || 'System Architect'}</p>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary-600 dark:text-primary-500 mt-1">{user?.role || 'L0 - PRIVILEGED'}</p>
            </div>
            <div className="relative">
              <div className="absolute -inset-1 bg-primary-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <button className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-primary-500 group-hover:border-primary-500/50 transition-all duration-500 shadow-2xl">
                <FiUser className="w-6 h-6" />
              </button>
            </div>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white/90 dark:bg-black/80 backdrop-blur-3xl rounded-[1.5rem] border border-black/5 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 animate-in fade-in slide-in-from-top-2 duration-300 z-[100]">
                <div className="px-4 py-3 border-b border-black/5 dark:border-white/5 mb-1">
                  <p className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Active Identity</p>
                  <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-wider mt-1">{user?.username || 'Admin'}</p>
                </div>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-500 transition-all text-[10px] font-black uppercase tracking-widest group/logout"
                >
                  <FiLogOut className="w-4 h-4 group-hover/logout:-translate-x-1 transition-transform" />
                  Terminate Session
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);
