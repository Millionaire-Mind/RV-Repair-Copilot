import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { Loader2, Search, Brain, Cog } from 'lucide-react';
const Loader = ({ type = 'spinner', size = 'md', message, className = '' }) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12'
    };
    const renderLoader = () => {
        switch (type) {
            case 'spinner':
                return (_jsx(motion.div, { animate: { rotate: 360 }, transition: { duration: 1, repeat: Infinity, ease: 'linear' }, className: `${sizeClasses[size]} text-primary-600 dark:text-primary-400`, children: _jsx(Loader2, { className: "w-full h-full" }) }));
            case 'dots':
                return (_jsx("div", { className: "flex space-x-1", children: [0, 1, 2].map((i) => (_jsx(motion.div, { animate: {
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5]
                        }, transition: {
                            duration: 1.4,
                            repeat: Infinity,
                            delay: i * 0.2
                        }, className: `${sizeClasses[size]} bg-primary-600 dark:bg-primary-400 rounded-full` }, i))) }));
            case 'pulse':
                return (_jsx(motion.div, { animate: {
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 1, 0.7]
                    }, transition: {
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }, className: `${sizeClasses[size]} bg-primary-600 dark:bg-primary-400 rounded-full` }));
            case 'search':
                return (_jsx(motion.div, { animate: {
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                    }, transition: {
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }, className: `${sizeClasses[size]} text-primary-600 dark:text-primary-400`, children: _jsx(Search, { className: "w-full h-full" }) }));
            case 'brain':
                return (_jsx(motion.div, { animate: {
                        scale: [1, 1.05, 1],
                        opacity: [0.8, 1, 0.8]
                    }, transition: {
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }, className: `${sizeClasses[size]} text-primary-600 dark:text-primary-400`, children: _jsx(Brain, { className: "w-full h-full" }) }));
            case 'custom':
                return (_jsx(motion.div, { animate: {
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                    }, transition: {
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }, className: `${sizeClasses[size]} text-primary-600 dark:text-primary-400`, children: _jsx(Cog, { className: "w-full h-full" }) }));
            default:
                return (_jsx(motion.div, { animate: { rotate: 360 }, transition: { duration: 1, repeat: Infinity, ease: 'linear' }, className: `${sizeClasses[size]} text-primary-600 dark:text-primary-400`, children: _jsx(Loader2, { className: "w-full h-full" }) }));
        }
    };
    return (_jsxs("div", { className: `flex flex-col items-center justify-center space-y-3 ${className}`, children: [renderLoader(), message && (_jsx(motion.p, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.3 }, className: "text-sm text-gray-600 dark:text-gray-400 text-center max-w-xs", children: message }))] }));
};
// Specialized loader components for common use cases
export const SearchLoader = ({ message }) => (_jsx(Loader, { type: "search", size: "lg", message: message || "Searching for repair information...", className: "py-8" }));
export const BrainLoader = ({ message }) => (_jsx(Loader, { type: "brain", size: "lg", message: message || "AI is analyzing your question...", className: "py-8" }));
export const ProcessingLoader = ({ message }) => (_jsx(Loader, { type: "dots", size: "md", message: message || "Processing...", className: "py-4" }));
export const InlineLoader = ({ size = 'sm' }) => (_jsx(Loader, { type: "spinner", size: size, className: "inline-flex" }));
export default Loader;
