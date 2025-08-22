import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, Search, BookOpen, ArrowLeft, AlertTriangle, MapPin, Clock } from 'lucide-react';
const NotFound = () => {
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
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-background via-background to-gray-50 dark:to-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-4xl mx-auto text-center", children: [_jsxs(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.8 }, className: "mb-12", children: [_jsx("div", { className: "text-8xl md:text-9xl font-bold text-gray-200 dark:text-gray-700 mb-4", children: "404" }), _jsx("h1", { className: "text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4", children: "Page Not Found" }), _jsx("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto", children: "Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL." })] }), _jsxs(motion.div, { variants: containerVariants, initial: "hidden", animate: "visible", className: "mb-12", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 dark:text-white mb-6", children: "Quick Actions" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: quickActions.map((action, index) => (_jsx(motion.div, { variants: itemVariants, className: "group", children: _jsxs(Link, { to: action.href, className: "block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group-hover:scale-105", children: [_jsx("div", { className: `${action.color} mb-4 flex justify-center`, children: _jsx(action.icon, { className: "h-12 w-12" }) }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-2", children: action.title }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: action.description })] }) }, index))) })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: 0.3 }, className: "mb-12", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 dark:text-white mb-6", children: "Popular RV Repair Searches" }), _jsx("div", { className: "flex flex-wrap justify-center gap-3", children: popularSearches.map((search, index) => (_jsx(motion.button, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.5, delay: 0.4 + index * 0.1 }, className: "px-4 py-2 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-200", children: search }, index))) })] }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: 0.6 }, className: "mb-8", children: _jsxs("button", { onClick: () => window.history.back(), className: "inline-flex items-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200", children: [_jsx(ArrowLeft, { className: "h-5 w-5" }), _jsx("span", { children: "Go Back" })] }) }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: 0.8 }, className: "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-200 dark:border-gray-700", children: [_jsxs("div", { className: "flex items-center justify-center space-x-2 mb-4", children: [_jsx(AlertTriangle, { className: "h-6 w-6 text-yellow-600 dark:text-yellow-400" }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "Need Help?" })] }), _jsx("p", { className: "text-gray-600 dark:text-gray-300 mb-4", children: "If you're experiencing issues or need assistance, our support team is here to help." }), _jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6 text-sm text-gray-500 dark:text-gray-400", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(MapPin, { className: "h-4 w-4" }), _jsx("span", { children: "support@rvrepaircopilot.com" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Clock, { className: "h-4 w-4" }), _jsx("span", { children: "Mon-Fri: 9AM-6PM EST" })] })] })] }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: 1.0 }, className: "mt-8", children: _jsxs("div", { className: "flex flex-wrap justify-center gap-4 text-sm", children: [_jsx(Link, { to: "/", className: "text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200", children: "Home" }), _jsx(Link, { to: "/about", className: "text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200", children: "About" }), _jsx(Link, { to: "/contact", className: "text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200", children: "Contact" })] }) })] }) }));
};
export default NotFound;
