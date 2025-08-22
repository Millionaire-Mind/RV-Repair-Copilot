import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, ChevronDown, Sun, Moon, Bell, HelpCircle, FileText, Wrench } from 'lucide-react';
const UserProfileDropdown = ({ isDarkMode, onToggleDarkMode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
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
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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
    const handleUnitsChange = (units) => {
        // In real app, this would update user preferences
        console.log('Change units to:', units);
    };
    const handleNotificationsToggle = () => {
        // In real app, this would update user preferences
        console.log('Toggle notifications');
    };
    return (_jsxs("div", { className: "relative", ref: dropdownRef, children: [_jsxs("button", { onClick: () => setIsOpen(!isOpen), className: "flex items-center space-x-3 p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200", "aria-label": "User profile menu", children: [_jsx("div", { className: "w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center", children: user.avatar ? (_jsx("img", { src: user.avatar, alt: user.name, className: "w-8 h-8 rounded-full object-cover" })) : (_jsx(User, { className: "h-5 w-5 text-white" })) }), _jsxs("div", { className: "hidden md:block text-left", children: [_jsx("div", { className: "text-sm font-medium text-gray-900 dark:text-white", children: user.name }), _jsx("div", { className: "text-xs text-gray-500 dark:text-gray-400", children: user.role })] }), _jsx(ChevronDown, { className: `h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}` })] }), _jsx(AnimatePresence, { children: isOpen && (_jsxs(motion.div, { initial: { opacity: 0, y: -10, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -10, scale: 0.95 }, transition: { duration: 0.2 }, className: "absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-strong border border-gray-200 dark:border-gray-700 z-50", children: [_jsx("div", { className: "p-4 border-b border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center", children: user.avatar ? (_jsx("img", { src: user.avatar, alt: user.name, className: "w-12 h-12 rounded-full object-cover" })) : (_jsx(User, { className: "h-6 w-6 text-white" })) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: user.name }), _jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: user.email }), _jsx("p", { className: "text-xs text-primary-600 dark:text-primary-400 font-medium", children: user.role })] })] }) }), _jsxs("div", { className: "p-4 border-b border-gray-200 dark:border-gray-700", children: [_jsx("h4", { className: "text-xs font-medium text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide", children: "Quick Actions" }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsx("button", { onClick: handleProfileClick, className: "p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(User, { className: "h-4 w-4 text-primary-600" }), _jsx("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: "Profile" })] }) }), _jsx("button", { onClick: handleSettingsClick, className: "p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Settings, { className: "h-4 w-4 text-primary-600" }), _jsx("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: "Settings" })] }) }), _jsx("button", { className: "p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(FileText, { className: "h-4 w-4 text-primary-600" }), _jsx("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: "Reports" })] }) }), _jsx("button", { className: "p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(HelpCircle, { className: "h-4 w-4 text-primary-600" }), _jsx("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: "Help" })] }) })] })] }), _jsxs("div", { className: "p-4 border-b border-gray-200 dark:border-gray-700", children: [_jsx("h4", { className: "text-xs font-medium text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide", children: "Preferences" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [isDarkMode ? (_jsx(Moon, { className: "h-4 w-4 text-gray-600 dark:text-gray-400" })) : (_jsx(Sun, { className: "h-4 w-4 text-gray-600 dark:text-gray-400" })), _jsx("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: "Dark Mode" })] }), _jsx("button", { onClick: onToggleDarkMode, className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${isDarkMode ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}`, children: _jsx("span", { className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}` }) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Wrench, { className: "h-4 w-4 text-gray-600 dark:text-gray-400" }), _jsx("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: "Units" })] }), _jsxs("div", { className: "flex space-x-1 bg-gray-200 dark:bg-gray-600 rounded-lg p-1", children: [_jsx("button", { onClick: () => handleUnitsChange('imperial'), className: `px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 ${user.preferences.units === 'imperial'
                                                                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                                                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`, children: "Imperial" }), _jsx("button", { onClick: () => handleUnitsChange('metric'), className: `px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 ${user.preferences.units === 'metric'
                                                                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                                                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`, children: "Metric" })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Bell, { className: "h-4 w-4 text-gray-600 dark:text-gray-400" }), _jsx("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: "Notifications" })] }), _jsx("button", { onClick: handleNotificationsToggle, className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${user.preferences.notifications ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}`, children: _jsx("span", { className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${user.preferences.notifications ? 'translate-x-6' : 'translate-x-1'}` }) })] })] })] }), _jsx("div", { className: "p-4", children: _jsxs("button", { onClick: handleLogout, className: "w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 font-medium rounded-lg transition-colors duration-200", children: [_jsx(LogOut, { className: "h-4 w-4" }), _jsx("span", { children: "Sign Out" })] }) })] })) })] }));
};
export default UserProfileDropdown;
