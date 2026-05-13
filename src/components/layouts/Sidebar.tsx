/**
 * Modern Sidebar Component
 * Navigation sidebar for admin and dashboard
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  BarChart3,
  LogOut,
  LucideIcon,
  ChevronRight,
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  badge?: number | string;
  submenu?: SidebarItem[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  items: SidebarItem[];
  onItemClick?: (item: SidebarItem) => void;
  userRole?: 'admin' | 'user' | 'department';
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  items,
  onItemClick,
  userRole = 'user',
  onLogout,
}) => {
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(
    new Set()
  );

  const toggleSubmenu = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const defaultItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
    },
    {
      id: 'complaints',
      label: 'Complaints',
      icon: FileText,
      href: '/complaints',
    },
  ];

  if (userRole === 'admin') {
    defaultItems.push(
      {
        id: 'users',
        label: 'Users',
        icon: Users,
        href: '/admin/users',
      },
      {
        id: 'analytics',
        label: 'Analytics',
        icon: BarChart3,
        href: '/admin/analytics',
      }
    );
  }

  const finalItems = items.length > 0 ? items : defaultItems;

  const SidebarItemComponent: React.FC<{
    item: SidebarItem;
    level?: number;
  }> = ({ item, level = 0 }) => {
    const Icon = item.icon;
    const isExpanded = expandedItems.has(item.id);
    const hasSubmenu = item.submenu && item.submenu.length > 0;

    return (
      <>
        <motion.button
          onClick={() => {
            if (hasSubmenu) {
              toggleSubmenu(item.id);
            } else {
              onItemClick?.(item);
              item.onClick?.();
              onClose?.();
            }
          }}
          className={`
            w-full flex items-center justify-between px-4 py-3 rounded-lg
            transition-all duration-200 font-medium
            ${
              item.active
                ? 'bg-blue-100 text-blue-900'
                : 'text-gray-700 hover:bg-gray-100'
            }
          `}
          style={{ paddingLeft: `${level * 1 + 1}rem` }}
          whileHover={{ x: 4 }}
        >
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span>{item.label}</span>
          </div>

          <div className="flex items-center gap-2">
            {item.badge && (
              <span className="px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                {item.badge}
              </span>
            )}
            {hasSubmenu && (
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
              </motion.div>
            )}
          </div>
        </motion.button>

        {/* Submenu */}
        <AnimatePresence>
          {hasSubmenu && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {item.submenu?.map((subitem) => (
                <SidebarItemComponent
                  key={subitem.id}
                  item={subitem}
                  level={level + 1}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  };

  return (
    <>
      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 md:hidden z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className="fixed md:static left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 shadow-sm z-40 md:z-0"
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Menu</h2>
            <p className="text-xs text-gray-500 capitalize">
              {userRole} Account
            </p>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {finalItems.map((item) => (
              <SidebarItemComponent key={item.id} item={item} />
            ))}
          </nav>

          {/* Settings & Logout */}
          <div className="p-4 border-t border-gray-100 space-y-1">
            <motion.button
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              whileHover={{ x: 4 }}
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </motion.button>

            <motion.button
              onClick={() => {
                onLogout?.();
                onClose?.();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
              whileHover={{ x: 4 }}
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
