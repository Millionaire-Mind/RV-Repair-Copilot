import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Search, 
  BookOpen, 
  ArrowLeft,
  AlertTriangle,
  MapPin,
  Clock
} from 'lucide-react';

const NotFound: React.FC = () => {
  const quickActions = [
    {
      icon: Search,
      title: 'Search Repairs',
      description: 'Find solutions for your RV issues',
      href: '/',
      color: 'text-primary-600 dark:text-primary-400'
    },
    {
      icon: BookOpen,
      title: 'Browse Manuals',
      description: 'Access service documentation',
      href: '/about',
      color: 'text-secondary-600 dark:text-secondary-400'
    },
    {
      icon: Home,
      title: 'Go Home',
      description: 'Return to the main page',
      href: '/',
      color: 'text-green-600 dark:text-green-400'
    }
  ];

  const popularSearches = [
    'Water pump not working',
    'AC troubleshooting',
    'Battery maintenance',
    'Propane system issues',
    'Slide-out problems',
    'Generator won\'t start'
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-gray-50 dark:to-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* 404 Error */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="text-8xl md:text-9xl font-bold text-gray-200 dark:text-gray-700 mb-4">
            404
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group"
              >
                <Link
                  to={action.href}
                  className="block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group-hover:scale-105"
                >
                  <div className={`${action.color} mb-4 flex justify-center`}>
                    <action.icon className="h-12 w-12" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {action.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Popular Searches */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Popular RV Repair Searches
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {popularSearches.map((search, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-200"
              >
                {search}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-8"
        >
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Go Back</span>
          </button>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Need Help?
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            If you're experiencing issues or need assistance, our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>support@rvrepaircopilot.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Mon-Fri: 9AM-6PM EST</span>
            </div>
          </div>
        </motion.div>

        {/* Additional Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-8"
        >
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              to="/"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
            >
              Contact
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;