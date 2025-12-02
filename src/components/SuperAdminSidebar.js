'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, FileText, Settings, BarChart3, LifeBuoy, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/super-admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/super-admin/tenants', label: 'Tenant Management', icon: Users },
  // { href: '/super-admin/users', label: 'Users', icon: Users },
  { href: '/super-admin/billing', label: 'Billing', icon: FileText },
  { href: '/super-admin/subscriptions/plans', label: 'Subscription Plans', icon: FileText },
  { href: '/super-admin/activity-logs', label: 'Activity Logs', icon: BarChart3 },
  { href: '/super-admin/settings', label: 'Global Settings', icon: Settings },
];

const SuperAdminSidebar = ({ open, onClose }) => {
  const pathname = usePathname();

  return (
    <aside
      className={`transform top-0 left-0 w-64 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-4 fixed h-full overflow-auto z-40 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex justify-between items-center mb-8">
        <div className="text-2xl font-bold text-center text-green-600 dark:text-green-500">
          SuperAdmin
        </div>
        <button className="lg:hidden" onClick={onClose}>
          <X className="w-6 h-6" />
        </button>
      </div>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/super-admin' && pathname.startsWith(item.href));
            const finalHref = item.href.startsWith('/') ? item.href : `/super-admin${item.href}`;
            return (
              <li key={item.href} className="mb-2">
                <Link
                  href={finalHref}
                  className={`flex items-center p-3 rounded-lg transition-colors 
                              ${
                                isActive
                                  ? 'bg-green-500 text-white dark:bg-green-600'
                                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                              }`}
                >
                  <item.icon size={20} className="mr-3" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div>
        <Link
          href="/super-admin/support"
          className="flex items-center p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <LifeBuoy size={20} className="mr-3" />
          Support
        </Link>
      </div>
    </aside>
  );
};

export default SuperAdminSidebar;
