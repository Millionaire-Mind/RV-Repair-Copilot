import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMutation } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mic, Send, Wrench, ChevronDown, ChevronUp } from 'lucide-react';
import { searchRVRepair } from '../services/api';
const SearchBar = ({ className = '' }) => {
    const [query, setQuery] = useState('');
    const [rvInfo, setRvInfo] = useState({
        brand: '',
        model: '',
        year: '',
        type: ''
    });
    const [isRvInfoExpanded, setIsRvInfoExpanded] = useState(false);
    const [searchResults, setSearchResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const searchMutation = useMutation(searchRVRepair, {
        onMutate: () => {
            setIsSearching(true);
            setSearchResults(null);
        },
        onSuccess: (data) => {
            setSearchResults(data);
            setIsSearching(false);
        },
        onError: (error) => {
            console.error('Search error:', error);
            setIsSearching(false);
        }
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            const searchRequest = {
                query: query.trim(),
                rvInfo: Object.values(rvInfo).some(v => v.trim()) ? rvInfo : undefined
            };
            searchMutation.mutate(searchRequest);
        }
    };
    const handleVoiceInput = () => {
        // Placeholder for voice input functionality
        console.log('Voice input clicked');
    };
    const popularQueries = [
        'Water pump not working',
        'AC troubleshooting',
        'Battery maintenance',
        'Propane system issues',
        'Slide-out problems',
        'Generator won\'t start'
    ];
    const handlePopularQuery = (popularQuery) => {
        setQuery(popularQuery);
        const searchRequest = {
            query: popularQuery,
            rvInfo: Object.values(rvInfo).some(v => v.trim()) ? rvInfo : undefined
        };
        searchMutation.mutate(searchRequest);
    };
    return (_jsxs("div", { className: `space-y-6 ${className}`, children: [_jsx("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 p-6", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "flex space-x-3", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" }), _jsx("input", { type: "text", value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Ask about any RV repair issue...", className: "w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200", disabled: isSearching })] }), _jsx("button", { type: "button", onClick: handleVoiceInput, className: "p-3 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200", "aria-label": "Voice input", children: _jsx(Mic, { className: "h-5 w-5" }) }), _jsxs("button", { type: "submit", disabled: !query.trim() || isSearching, className: "px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 flex items-center space-x-2", children: [_jsx(Send, { className: "h-4 w-4" }), _jsx("span", { children: "Ask Copilot" })] })] }), _jsxs("div", { className: "border-t border-gray-200 dark:border-gray-700 pt-4", children: [_jsxs("button", { type: "button", onClick: () => setIsRvInfoExpanded(!isRvInfoExpanded), className: "flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200", children: [_jsx(Wrench, { className: "h-4 w-4" }), _jsx("span", { children: "RV Unit Information" }), _jsx(motion.div, { animate: { rotate: isRvInfoExpanded ? 180 : 0 }, transition: { duration: 0.2 }, children: isRvInfoExpanded ? _jsx(ChevronUp, { className: "h-4 w-4" }) : _jsx(ChevronDown, { className: "h-4 w-4" }) })] }), _jsx(AnimatePresence, { children: isRvInfoExpanded && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, transition: { duration: 0.3 }, className: "mt-4 grid grid-cols-2 md:grid-cols-4 gap-3", children: [_jsx("input", { type: "text", placeholder: "Brand", value: rvInfo.brand, onChange: (e) => setRvInfo(prev => ({ ...prev, brand: e.target.value })), className: "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent" }), _jsx("input", { type: "text", placeholder: "Model", value: rvInfo.model, onChange: (e) => setRvInfo(prev => ({ ...prev, model: e.target.value })), className: "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent" }), _jsx("input", { type: "text", placeholder: "Year", value: rvInfo.year, onChange: (e) => setRvInfo(prev => ({ ...prev, year: e.target.value })), className: "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent" }), _jsx("input", { type: "text", placeholder: "Type", value: rvInfo.type, onChange: (e) => setRvInfo(prev => ({ ...prev, type: e.target.value })), className: "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent" })] })) })] })] }) }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-4", children: "Popular Queries" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3", children: popularQueries.map((popularQuery, index) => (_jsx("button", { onClick: () => handlePopularQuery(popularQuery), className: "p-3 text-left text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-600 transition-all duration-200 hover:border-primary-300 dark:hover:border-primary-600", children: popularQuery }, index))) })] }), _jsx(AnimatePresence, { children: searchResults && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 }, className: "bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-4", children: "Search Results" }), _jsxs("div", { className: "prose dark:prose-invert max-w-none", children: [_jsx("div", { className: "text-gray-700 dark:text-gray-300 whitespace-pre-wrap", children: searchResults.answer }), searchResults.sources && searchResults.sources.length > 0 && (_jsxs("div", { className: "mt-6 pt-4 border-t border-gray-200 dark:border-gray-700", children: [_jsx("h4", { className: "text-sm font-medium text-gray-900 dark:text-white mb-2", children: "Sources:" }), _jsx("ul", { className: "text-sm text-gray-600 dark:text-gray-400 space-y-1", children: searchResults.sources.map((source, index) => (_jsxs("li", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "w-2 h-2 bg-primary-500 rounded-full" }), _jsx("span", { children: source })] }, index))) })] })), searchResults.metadata && (_jsx("div", { className: "mt-4 pt-4 border-t border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex items-center justify-between text-xs text-gray-500 dark:text-gray-400", children: [_jsxs("span", { children: ["Processing time: ", searchResults.metadata.processingTime, "ms"] }), _jsxs("span", { children: ["Model: ", searchResults.metadata.modelUsed] }), _jsxs("span", { children: ["Confidence: ", (searchResults.metadata.confidence * 100).toFixed(1), "%"] })] }) }))] })] })) }), _jsx(AnimatePresence, { children: isSearching && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 p-6 text-center", children: _jsxs("div", { className: "flex items-center justify-center space-x-3", children: [_jsx("div", { className: "animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600" }), _jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Searching for solutions..." })] }) })) })] }));
};
export default SearchBar;
