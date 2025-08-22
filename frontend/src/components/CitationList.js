import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, FileText, Globe, BookOpen, ChevronRight } from 'lucide-react';
const CitationList = ({ citations, title = 'Sources', maxVisible = 5, showRelevance = false }) => {
    const [showAll, setShowAll] = React.useState(false);
    const visibleCitations = showAll ? citations : citations.slice(0, maxVisible);
    const hasMore = citations.length > maxVisible;
    const getSourceIcon = (type) => {
        switch (type) {
            case 'manual':
                return _jsx(BookOpen, { className: "h-4 w-4" });
            case 'website':
                return _jsx(Globe, { className: "h-4 w-4" });
            case 'document':
                return _jsx(FileText, { className: "h-4 w-4" });
            case 'video':
                return _jsx(BookOpen, { className: "h-4 w-4" });
            default:
                return _jsx(FileText, { className: "h-4 w-4" });
        }
    };
    const getSourceColor = (type) => {
        switch (type) {
            case 'manual':
                return 'text-blue-600 dark:text-blue-400';
            case 'website':
                return 'text-green-600 dark:text-green-400';
            case 'document':
                return 'text-purple-600 dark:text-purple-400';
            case 'video':
                return 'text-orange-600 dark:text-orange-400';
            default:
                return 'text-gray-600 dark:text-gray-400';
        }
    };
    const getRelevanceColor = (relevance) => {
        if (relevance >= 0.8)
            return 'text-green-600 dark:text-green-400';
        if (relevance >= 0.6)
            return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };
    const formatRelevance = (relevance) => {
        return `${(relevance * 100).toFixed(0)}%`;
    };
    const handleCitationClick = (citation) => {
        if (citation.url) {
            window.open(citation.url, '_blank', 'noopener,noreferrer');
        }
    };
    if (citations.length === 0) {
        return null;
    }
    return (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 overflow-hidden", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: [title, " (", citations.length, ")"] }), showRelevance && (_jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Relevance Score" }))] }) }), _jsx("div", { className: "divide-y divide-gray-200 dark:divide-gray-700", children: visibleCitations.map((citation, index) => (_jsx(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.3, delay: index * 0.1 }, className: "p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200", children: _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("div", { className: `flex-shrink-0 mt-1 ${getSourceColor(citation.type)}`, children: getSourceIcon(citation.type) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "text-sm font-medium text-gray-900 dark:text-white mb-1 line-clamp-2", children: citation.title }), _jsxs("p", { className: "text-xs text-gray-500 dark:text-gray-400 mb-2", children: [citation.source, citation.date && (_jsxs("span", { className: "ml-2", children: ["\u2022 ", citation.date] }))] }), citation.excerpt && (_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-300 line-clamp-2", children: citation.excerpt }))] }), showRelevance && (_jsx("div", { className: "ml-4 flex-shrink-0", children: _jsx("span", { className: `text-xs font-medium ${getRelevanceColor(citation.relevance)}`, children: formatRelevance(citation.relevance) }) }))] }), _jsxs("div", { className: "mt-3 flex items-center space-x-2", children: [citation.url && (_jsxs("button", { onClick: () => handleCitationClick(citation), className: "inline-flex items-center space-x-1 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200", children: [_jsx(ExternalLink, { className: "h-3 w-3" }), _jsx("span", { children: "View Source" })] })), _jsx("span", { className: "text-xs text-gray-400 dark:text-gray-500", children: citation.type.charAt(0).toUpperCase() + citation.type.slice(1) })] })] }), citation.url && (_jsx("div", { className: "flex-shrink-0 ml-2", children: _jsx(ChevronRight, { className: "h-4 w-4 text-gray-400" }) }))] }) }, citation.id))) }), hasMore && (_jsx("div", { className: "px-6 py-4 border-t border-gray-200 dark:border-gray-700", children: _jsx("button", { onClick: () => setShowAll(!showAll), className: "w-full text-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200", children: showAll ? 'Show Less' : `Show ${citations.length - maxVisible} More` }) })), _jsx("div", { className: "px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex items-center justify-between text-xs text-gray-500 dark:text-gray-400", children: [_jsxs("span", { children: [citations.length, " source", citations.length !== 1 ? 's' : '', " found"] }), _jsx("span", { children: "Powered by AI search" })] }) })] }));
};
export default CitationList;
