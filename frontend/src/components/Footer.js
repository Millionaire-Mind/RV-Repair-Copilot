import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wrench, Github, Twitter, Linkedin, Mail, Phone, MapPin, Heart } from 'lucide-react';
const Footer = () => {
    const currentYear = new Date().getFullYear();
    const footerLinks = {
        product: [
            { name: 'Features', href: '/#features' },
            { name: 'Pricing', href: '/#pricing' },
            { name: 'API', href: '/#api' },
            { name: 'Documentation', href: '/#docs' },
        ],
        company: [
            { name: 'About', href: '/about' },
            { name: 'Blog', href: '/blog' },
            { name: 'Careers', href: '/careers' },
            { name: 'Press', href: '/press' },
        ],
        support: [
            { name: 'Help Center', href: '/help' },
            { name: 'Contact', href: '/contact' },
            { name: 'Status', href: '/status' },
            { name: 'Community', href: '/community' },
        ],
        legal: [
            { name: 'Privacy', href: '/privacy' },
            { name: 'Terms', href: '/terms' },
            { name: 'Cookie Policy', href: '/cookies' },
            { name: 'Licenses', href: '/licenses' },
        ],
    };
    const socialLinks = [
        { name: 'GitHub', href: 'https://github.com/rv-repair-copilot', icon: Github },
        { name: 'Twitter', href: 'https://twitter.com/rvrepaircopilot', icon: Twitter },
        { name: 'LinkedIn', href: 'https://linkedin.com/company/rv-repair-copilot', icon: Linkedin },
        { name: 'Email', href: 'mailto:contact@rvrepaircopilot.com', icon: Mail },
    ];
    return (_jsx("footer", { className: "bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8", children: [_jsxs("div", { className: "lg:col-span-2", children: [_jsxs(Link, { to: "/", className: "flex items-center space-x-2 mb-4", children: [_jsx(Wrench, { className: "h-8 w-8 text-primary-600" }), _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-xl font-bold text-gray-900 dark:text-white", children: "RV Repair Copilot" }), _jsx("span", { className: "text-sm text-gray-500 dark:text-gray-400", children: "AI-Powered RV Repair Assistance" })] })] }), _jsx("p", { className: "text-gray-600 dark:text-gray-300 mb-4 max-w-md", children: "Get instant, expert RV repair guidance powered by artificial intelligence. Access service manuals, troubleshooting guides, and step-by-step repair instructions." }), _jsx("div", { className: "flex space-x-4", children: socialLinks.map((social) => {
                                        const Icon = social.icon;
                                        return (_jsx(motion.a, { href: social.href, target: "_blank", rel: "noopener noreferrer", className: "text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200", whileHover: { scale: 1.1 }, whileTap: { scale: 0.95 }, "aria-label": social.name, children: _jsx(Icon, { className: "h-5 w-5" }) }, social.name));
                                    }) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4", children: "Product" }), _jsx("ul", { className: "space-y-3", children: footerLinks.product.map((link) => (_jsx("li", { children: _jsx(Link, { to: link.href, className: "text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200", children: link.name }) }, link.name))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4", children: "Company" }), _jsx("ul", { className: "space-y-3", children: footerLinks.company.map((link) => (_jsx("li", { children: _jsx(Link, { to: link.href, className: "text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200", children: link.name }) }, link.name))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4", children: "Support" }), _jsx("ul", { className: "space-y-3", children: footerLinks.support.map((link) => (_jsx("li", { children: _jsx(Link, { to: link.href, className: "text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200", children: link.name }) }, link.name))) })] })] }), _jsx("div", { className: "border-t border-gray-200 dark:border-gray-700 pt-8 mb-8", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Mail, { className: "h-5 w-5 text-primary-600" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: "Email" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-300", children: "contact@rvrepaircopilot.com" })] })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Phone, { className: "h-5 w-5 text-primary-600" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: "Phone" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-300", children: "+1 (555) 123-4567" })] })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(MapPin, { className: "h-5 w-5 text-primary-600" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: "Address" }), _jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-300", children: ["RV Repair Copilot HQ", _jsx("br", {}), "Innovation District, Tech City"] })] })] })] }) }), _jsx("div", { className: "border-t border-gray-200 dark:border-gray-700 pt-8", children: _jsxs("div", { className: "flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0", children: [_jsxs("div", { className: "flex items-center space-x-2 text-gray-600 dark:text-gray-300", children: [_jsxs("span", { children: ["\u00A9 ", currentYear, " RV Repair Copilot. All rights reserved."] }), _jsx("span", { className: "hidden sm:inline", children: "\u2022" }), _jsx("span", { className: "hidden sm:inline", children: "Made with" }), _jsx(Heart, { className: "h-4 w-4 text-red-500" }), _jsx("span", { className: "hidden sm:inline", children: "for RV enthusiasts" })] }), _jsx("div", { className: "flex space-x-6", children: footerLinks.legal.map((link) => (_jsx(Link, { to: link.href, className: "text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200", children: link.name }, link.name))) })] }) })] }) }));
};
export default Footer;
