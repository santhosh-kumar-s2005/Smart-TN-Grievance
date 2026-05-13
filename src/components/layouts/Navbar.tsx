/**
 * Modern Navbar Component
 * Header with branding, navigation, and user menu
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bell, User, LogOut } from 'lucide-react';
import Avatar from './ui/Avatar';

interface NavbarProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onLogout?: () => void;
  onMenuToggle?: (isOpen: boolean) => void;
  showNotifications?: boolean;
  notificationCount?: number;
}

const Navbar: React.FC<NavbarProps> = ({
  userName = 'User',
  userEmail,
  userAvatar,
  onLogout,
  onMenuToggle,
  showNotifications = true,
  notificationCount = 0,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    onMenuToggle?.(!isMenuOpen);
  };

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">TN</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900">Smart TN</h1>
              <p className="text-xs text-gray-500">Grievance Management</p>
            </div>
          </motion.div>

          {/* Center - Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="/dashboard"
              className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
            >
              Dashboard
            </a>
            <a
              href="/complaints"
              className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
            >
              Complaints
            </a>
          </div>

          {/* Right - Notifications & User */}
          <div className="flex items-center gap-4">
            {showNotifications && (
              <motion.button
                className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <motion.span
                    className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </motion.span>
                )}
              </motion.button>
            )}

            {/* User Dropdown */}
            <div className="relative">
              <motion.button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <Avatar
                  name={userName}
                  src={userAvatar}
                  size="sm"
                />
              </motion.button>

              <AnimatePresence>
                {isUserDropdownOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg overflow-hidden"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="p-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">{userName}</p>
                      {userEmail && (
                        <p className="text-xs text-gray-500">{userEmail}</p>
                      )}
                    </div>

                    <motion.button
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 font-medium flex items-center gap-2 transition-colors"
                      whileHover={{ x: 4 }}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </motion.button>

                    <motion.button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        onLogout?.();
                      }}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 font-medium flex items-center gap-2 transition-colors"
                      whileHover={{ x: 4 }}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={handleMenuToggle}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden pb-4 border-t border-gray-100"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <a
                href="/dashboard"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Dashboard
              </a>
              <a
                href="/complaints"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Complaints
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
