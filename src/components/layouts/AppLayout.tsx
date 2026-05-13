/**
 * AppLayout Component
 * Main layout wrapper with Navbar and Sidebar
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { pageVariants, containerVariants } from '../../animations/variants';

interface AppLayoutProps {
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  userRole?: 'admin' | 'user' | 'department';
  onLogout?: () => void;
  showSidebar?: boolean;
  notificationCount?: number;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  userName,
  userEmail,
  userAvatar,
  userRole = 'user',
  onLogout,
  showSidebar = true,
  notificationCount = 0,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      {showSidebar && (
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          items={[]}
          userRole={userRole}
          onLogout={onLogout}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar
          userName={userName}
          userEmail={userEmail}
          userAvatar={userAvatar}
          onLogout={onLogout}
          onMenuToggle={setIsSidebarOpen}
          notificationCount={notificationCount}
        />

        {/* Content Area */}
        <motion.main
          className="flex-1 overflow-y-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"
            variants={pageVariants}
            initial="initial"
            animate="animate"
          >
            {children}
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
};

export default AppLayout;
