import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Sun, 
  Moon, 
  Bell,
  HelpCircle,
  FileText,
  Wrench
} from 'lucide-react';

interface UserProfileDropdownProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ 
  isDarkMode, 
  onToggleDarkMode 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock user data - in real app this would come from auth context
  const user = {
    name: 'John Technician',
    email: 'john.tech@rvrepair.com',
    role: 'Senior Technician',
    avatar: null,
    preferences: {
      units: 'imperial',
      notifications: true,
      language: 'en'
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // In real app, this would handle logout
    console.log('Logging out...');
    setIsOpen(false);
  };

  const handleProfileClick = () => {
    // In real app, this would navigate to profile page
    console.log('Navigate to profile...');
    setIsOpen(false);
  };

  const handleSettingsClick = () => {
    // In real app, this would open settings modal/page
    console.log('Open settings...');
    setIsOpen(false);
  };

  const handleUnitsChange = (units: 'imperial' | 'metric') => {
    // In real app, this would update user preferences
    console.log('Change units to:', units);
  };

  const handleNotificationsToggle = () => {
    // In real app, this would update user preferences
    console.log('Toggle notifications');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
        aria-label="User profile menu"
      >
        {/* Avatar */}
        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <User className="h-5 w-5 text-white" />
          )}
        </div>
        
        {/* User Info */}
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {user.name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {user.role}
          </div>
        </div>
        
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-strong border border-gray-200 dark:border-gray-700 z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                  <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                    {user.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                Quick Actions
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleProfileClick}
                  className="p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                >
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-primary-600" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Profile</span>
                  </div>
                </button>
                
                <button
                  onClick={handleSettingsClick}
                  className="p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                >
                  <div className="flex items-center space-x-2">
                    <Settings className="h-4 w-4 text-primary-600" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Settings</span>
                  </div>
                </button>
                
                <button className="p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-primary-600" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Reports</span>
                  </div>
                </button>
                
                <button className="p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200">
                  <div className="flex items-center space-x-2">
                    <HelpCircle className="h-4 w-4 text-primary-600" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Help</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Preferences */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                Preferences
              </h4>
              
              <div className="space-y-3">
                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {isDarkMode ? (
                      <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <Sun className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    )}
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Dark Mode
                    </span>
                  </div>
                  <button
                    onClick={onToggleDarkMode}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                      isDarkMode ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                        isDarkMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Units Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Wrench className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Units
                    </span>
                  </div>
                  <div className="flex space-x-1 bg-gray-200 dark:bg-gray-600 rounded-lg p-1">
                    <button
                      onClick={() => handleUnitsChange('imperial')}
                      className={`px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                        user.preferences.units === 'imperial'
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      Imperial
                    </button>
                    <button
                      onClick={() => handleUnitsChange('metric')}
                      className={`px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                        user.preferences.units === 'metric'
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      Metric
                    </button>
                  </div>
                </div>

                {/* Notifications Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Notifications
                    </span>
                  </div>
                  <button
                    onClick={handleNotificationsToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                      user.preferences.notifications ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                        user.preferences.notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 font-medium rounded-lg transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfileDropdown;