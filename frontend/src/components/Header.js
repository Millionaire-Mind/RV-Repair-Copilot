import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Wrench, Home, Info, MessageCircle, Sun, Moon } from 'lucide-react';
const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const location = useLocation();
    const navigation = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'About', href: '/about', icon: Info },
        { name: 'Contact', href: '/contact', icon: MessageCircle },
    ];
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        // In a real app, you'd implement actual dark mode toggle
        document.documentElement.classList.toggle('dark');
    };
    const closeMenu = () => {
        setIsMenuOpen(false);
    };
    const isActive = (path) => {
        return location.pathname === path;
    };
    return (_jsxs("header", { className: "bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50", children: [_jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsxs(Link, { to: "/", className: "flex items-center space-x-2 group", children: [_jsxs("div", { className: "relative", children: [_jsx(Wrench, { className: "h-8 w-8 text-primary-600 group-hover:text-primary-700 transition-colors duration-200" }), _jsx(motion.div, { className: "absolute inset-0 bg-primary-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200", initial: { scale: 0.8 }, whileHover: { scale: 1.2 }, transition: { duration: 0.2 } })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors duration-200", children: "RV Repair" }), _jsx("span", { className: "text-sm text-gray-500 dark:text-gray-400 group-hover:text-primary-500 transition-colors duration-200", children: "Copilot" })] })] }), _jsx("nav", { className: "hidden md:flex items-center space-x-8", children: navigation.map((item) => {
                                const Icon = item.icon;
                                return (_jsxs(Link, { to: item.href, className: `flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive(item.href)
                                        ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20'
                                        : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800'}`, children: [_jsx(Icon, { className: "h-4 w-4" }), _jsx("span", { children: item.name })] }, item.name));
                            }) }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("button", { onClick: toggleDarkMode, className: "p-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200", "aria-label": "Toggle dark mode", children: isDarkMode ? (_jsx(Sun, { className: "h-5 w-5" })) : (_jsx(Moon, { className: "h-5 w-5" })) }), _jsx("button", { onClick: toggleMenu, className: "md:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200", "aria-label": "Toggle menu", children: isMenuOpen ? (_jsx(X, { className: "h-6 w-6" })) : (_jsx(Menu, { className: "h-6 w-6" })) })] })] }) }), _jsx(AnimatePresence, { children: isMenuOpen && (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, transition: { duration: 0.3, ease: 'easeInOut' }, className: "md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700", children: _jsx("div", { className: "px-2 pt-2 pb-3 space-y-1", children: navigation.map((item) => {
                            const Icon = item.icon;
                            return (_jsxs(Link, { to: item.href, onClick: closeMenu, className: `flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActive(item.href)
                                    ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20'
                                    : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800'}`, children: [_jsx(Icon, { className: "h-5 w-5" }), _jsx("span", { children: item.name })] }, item.name));
                        }) }) })) })] }));
};
export default Header;
