'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Button from './Button';
import { Menu, X, LogOut } from 'lucide-react';

interface NavbarProps {
  userRole?: string;
  userName?: string;
}

export default function Navbar({ userRole = 'USER', userName = 'User' }: NavbarProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              Grievance<span className="text-blue-600 dark:text-blue-400">Hub</span>
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {userName} • <span className="font-medium text-indigo-600 dark:text-indigo-400">{userRole}</span>
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 py-4 space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 px-4">
              {userName} • <span className="font-medium text-indigo-600 dark:text-indigo-400">{userRole}</span>
            </p>
            <Button variant="ghost" fullWidth onClick={handleLogout} className="gap-2 justify-start px-4">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
