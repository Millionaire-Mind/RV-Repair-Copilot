import React, { useState } from 'react';

const Dashboard: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              RV Repair Copilot
            </h1>
            <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
              Dashboard
            </span>
          </div>
          
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Welcome to RV Repair Copilot Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            This is a simplified version to test rendering. The full dashboard components will be loaded once we resolve any issues.
          </p>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-medium text-blue-900 dark:text-blue-100">Search & Query</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">Ask about RV repair issues</p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="font-medium text-green-900 dark:text-green-100">AI Response</h3>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">Get detailed repair guidance</p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <h3 className="font-medium text-purple-900 dark:text-purple-100">Manuals</h3>
              <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">Access RV documentation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;