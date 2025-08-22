import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ExternalLink, Clock, Search, Brain, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
const AnswerCard = ({ answer, sources, metadata }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(answer);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
        catch (error) {
            console.error('Failed to copy text:', error);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = answer;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };
    const formatProcessingTime = (ms) => {
        if (ms < 1000)
            return `${ms}ms`;
        return `${(ms / 1000).toFixed(1)}s`;
    };
    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 }, className: "bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 overflow-hidden", children: [_jsxs("div", { className: "p-6 border-b border-gray-200 dark:border-gray-700", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-2", children: "AI Repair Guidance" }), _jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["Generated using ", metadata.modelUsed, " based on ", metadata.searchResults, " relevant sources"] })] }), _jsx("button", { onClick: handleCopy, className: "ml-4 p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700", "aria-label": "Copy answer", children: isCopied ? (_jsx(Check, { className: "h-5 w-5 text-green-600" })) : (_jsx(Copy, { className: "h-5 w-5" })) })] }), _jsxs("div", { className: "mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400", children: [_jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Clock, { className: "h-4 w-4" }), _jsxs("span", { children: ["Processed in ", formatProcessingTime(metadata.processingTime)] })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Search, { className: "h-4 w-4" }), _jsxs("span", { children: [metadata.searchResults, " sources found"] })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Brain, { className: "h-4 w-4" }), _jsx("span", { children: metadata.modelUsed })] })] })] }), _jsx("div", { className: "p-6", children: _jsx("div", { className: "prose prose-gray dark:prose-invert max-w-none", children: _jsx(ReactMarkdown, { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeHighlight], components: {
                            // Custom styling for different markdown elements
                            h1: ({ children }) => (_jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-6 first:mt-0", children: children })),
                            h2: ({ children }) => (_jsx("h2", { className: "text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-5", children: children })),
                            h3: ({ children }) => (_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-2 mt-4", children: children })),
                            p: ({ children }) => (_jsx("p", { className: "text-gray-700 dark:text-gray-300 mb-4 leading-relaxed", children: children })),
                            ul: ({ children }) => (_jsx("ul", { className: "list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-1", children: children })),
                            ol: ({ children }) => (_jsx("ol", { className: "list-decimal list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-1", children: children })),
                            li: ({ children }) => (_jsx("li", { className: "text-gray-700 dark:text-gray-300", children: children })),
                            strong: ({ children }) => (_jsx("strong", { className: "font-semibold text-gray-900 dark:text-white", children: children })),
                            em: ({ children }) => (_jsx("em", { className: "italic text-gray-700 dark:text-gray-300", children: children })),
                            code: ({ children, className }) => {
                                const isInline = !className;
                                if (isInline) {
                                    return (_jsx("code", { className: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono", children: children }));
                                }
                                return (_jsx("code", { className: className, children: children }));
                            },
                            pre: ({ children }) => (_jsx("pre", { className: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-4 rounded-lg overflow-x-auto mb-4", children: children })),
                            blockquote: ({ children }) => (_jsx("blockquote", { className: "border-l-4 border-primary-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-4", children: children })),
                        }, children: answer }) }) }), sources.length > 0 && (_jsxs("div", { className: "border-t border-gray-200 dark:border-gray-700", children: [_jsx("button", { onClick: toggleExpanded, className: "w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h4", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: ["Sources (", sources.length, ")"] }), isExpanded ? (_jsx(ChevronUp, { className: "h-4 w-4 text-gray-500" })) : (_jsx(ChevronDown, { className: "h-4 w-4 text-gray-500" }))] }) }), isExpanded && (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, transition: { duration: 0.3 }, className: "px-4 pb-4", children: _jsx("div", { className: "space-y-2", children: sources.map((source, index) => (_jsxs("div", { className: "flex items-center space-x-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700", children: [_jsx("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: index + 1 }), _jsx("span", { className: "text-sm text-gray-700 dark:text-gray-300 flex-1", children: source }), _jsx("button", { className: "p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200", "aria-label": "View source", children: _jsx(ExternalLink, { className: "h-4 w-4" }) })] }, index))) }) }))] })), _jsx("div", { className: "px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex items-center justify-between text-sm text-gray-500 dark:text-gray-400", children: [_jsxs("span", { children: ["Generated on ", new Date().toLocaleDateString(), " at ", new Date().toLocaleTimeString()] }), _jsx("span", { className: "text-xs", children: "AI-powered by RV Repair Copilot" })] }) })] }));
};
export default AnswerCard;
