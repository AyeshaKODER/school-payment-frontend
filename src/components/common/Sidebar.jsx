import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CreditCard, 
  School, 
  CheckCircle, 
  BarChart3,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
    },
    {
      name: 'Make Payment',
      href: '/pay',
      icon: CreditCard,
    },
    {
      name: 'All Transactions',
      href: '/transactions',
      icon: BarChart3,
    },
    {
      name: 'School Transactions',
      href: '/school-transactions',
      icon: School,
    },
    {
      name: 'Transaction Status',
      href: '/transaction-status',
      icon: CheckCircle,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <School className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                SchoolPay
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          
<nav className="flex-1 px-4 py-4 space-y-2">
  {menuItems.map((item) => {
    const Icon = item.icon;

    // If item has children, render dropdown
    if (item.children) {
      return (
        <div key={item.name} className="space-y-1">
          <div className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
            {Icon && <Icon className="h-5 w-5 mr-2" />}
            <span>{item.name}</span>
          </div>
          <div className="ml-6 space-y-1">
            {item.children.map((child) => (
              <Link
                key={child.name}
                to={child.href}
                onClick={onClose}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                  location.pathname === child.href
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {child.name}
              </Link>
            ))}
          </div>
        </div>
      );
    }

    // Normal single link
    const isActive = location.pathname === item.href;
    return (
      <Link
        key={item.name}
        to={item.href}
        onClick={onClose}
        className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
          isActive
            ? 'bg-primary-500 text-white shadow-md'
            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        {Icon && <Icon className="h-5 w-5" />}
        <span>{item.name}</span>
      </Link>
    );
  })}
</nav>


          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Version 1.0.0
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;