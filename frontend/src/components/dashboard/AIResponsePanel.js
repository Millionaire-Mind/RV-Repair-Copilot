import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Bookmark, BookmarkPlus, Copy, Check, Download, Share2, AlertTriangle, CheckCircle, Clock, Brain } from 'lucide-react';
const AIResponsePanel = ({ response, isLoading = false, onSaveSolution }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const handleCopy = async () => {
        if (response?.answer) {
            try {
                await navigator.clipboard.writeText(response.answer);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            }
            catch (error) {
                console.error('Failed to copy text:', error);
            }
        }
    };
    const handleSaveSolution = () => {
        setIsSaved(true);
        onSaveSolution?.();
        setTimeout(() => setIsSaved(false), 2000);
    };
    const formatProcessingTime = (ms) => {
        if (ms < 1000)
            return `${ms}ms`;
        return `${(ms / 1000).toFixed(1)}s`;
    };
    const getConfidenceColor = (confidence) => {
        if (confidence >= 0.8)
            return 'text-green-600 dark:text-green-400';
        if (confidence >= 0.6)
            return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };
    if (isLoading) {
        return (_jsx("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 p-8", children: _jsxs("div", { className: "flex items-center justify-center space-x-3", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" }), _jsx("span", { className: "text-lg text-gray-600 dark:text-gray-400", children: "AI Copilot is analyzing your question..." })] }) }));
    }
    if (!response) {
        return (_jsx("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 p-8", children: _jsxs("div", { className: "text-center", children: [_jsx(Brain, { className: "h-16 w-16 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-semibold text-gray-900 dark:text-white mb-2", children: "Ready to Help" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Ask a question about your RV repair issue to get started" })] }) }));
    }
    return (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 overflow-hidden", children: [_jsx("div", { className: "p-6 border-b border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-2", children: "AI Repair Guidance" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-3", children: response.metadata.question }), _jsxs("div", { className: "flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400", children: [_jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Clock, { className: "h-4 w-4" }), _jsxs("span", { children: ["Processed in ", formatProcessingTime(response.metadata.processingTime)] })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(CheckCircle, { className: "h-4 w-4" }), _jsxs("span", { children: [response.metadata.searchResults, " sources found"] })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Brain, { className: "h-4 w-4" }), _jsx("span", { children: response.metadata.modelUsed })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(AlertTriangle, { className: "h-4 w-4" }), _jsxs("span", { className: getConfidenceColor(response.metadata.confidence), children: [Math.round(response.metadata.confidence * 100), "% confidence"] })] })] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { onClick: handleCopy, className: "p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700", "aria-label": "Copy answer", children: isCopied ? (_jsx(Check, { className: "h-5 w-5 text-green-600" })) : (_jsx(Copy, { className: "h-5 w-5" })) }), _jsx("button", { onClick: handleSaveSolution, className: "p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700", "aria-label": "Save solution", children: isSaved ? (_jsx(Check, { className: "h-5 w-5 text-green-600" })) : (_jsx(BookmarkPlus, { className: "h-5 w-5" })) })] })] }) }), _jsx("div", { className: "p-6", children: _jsx("div", { className: "prose prose-gray dark:prose-invert max-w-none", children: _jsx("div", { className: "text-gray-700 dark:text-gray-300 leading-relaxed", children: response.answer }) }) }), _jsxs("div", { className: "border-t border-gray-200 dark:border-gray-700", children: [_jsx("button", { onClick: () => setIsExpanded(!isExpanded), className: "w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h4", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: "Detailed Steps & Sources" }), isExpanded ? (_jsx(ChevronUp, { className: "h-4 w-4 text-gray-500" })) : (_jsx(ChevronDown, { className: "h-4 w-4 text-gray-500" }))] }) }), _jsx(AnimatePresence, { children: isExpanded && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, transition: { duration: 0.3 }, className: "px-6 pb-6", children: [_jsxs("div", { className: "mb-6", children: [_jsxs("h5", { className: "text-sm font-medium text-gray-900 dark:text-white mb-3", children: ["Sources (", response.sources.length, ")"] }), _jsx("div", { className: "space-y-2", children: response.sources.map((source, index) => (_jsxs("div", { className: "flex items-center space-x-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700", children: [_jsx("span", { className: "text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-600 rounded-full w-5 h-5 flex items-center justify-center", children: index + 1 }), _jsx("span", { className: "text-sm text-gray-700 dark:text-gray-300 flex-1", children: source })] }, index))) })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs("button", { onClick: handleSaveSolution, className: "flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors duration-200", children: [_jsx(Bookmark, { className: "h-4 w-4" }), _jsx("span", { children: "Save This Solution" })] }), _jsxs("button", { className: "flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors duration-200", children: [_jsx(Download, { className: "h-4 w-4" }), _jsx("span", { children: "Export PDF" })] }), _jsxs("button", { className: "flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors duration-200", children: [_jsx(Share2, { className: "h-4 w-4" }), _jsx("span", { children: "Share" })] })] })] })) })] })] }));
};
export default AIResponsePanel;
