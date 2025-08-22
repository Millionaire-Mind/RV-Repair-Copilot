import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mic, Send, Wrench, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { searchRVRepair, SearchRequest, SearchResponse } from '../services/api';

interface SearchBarProps {
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ className = '' }) => {
  const [query, setQuery] = useState('');
  const [rvInfo, setRvInfo] = useState({
    brand: '',
    model: '',
    year: '',
    type: ''
  });
  const [isRvInfoExpanded, setIsRvInfoExpanded] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const searchMutation = useMutation(searchRVRepair, {
    onMutate: () => {
      setIsSearching(true);
      setSearchResults(null);
    },
    onSuccess: (data: SearchResponse) => {
      setSearchResults(data);
      setIsSearching(false);
    },
    onError: (error: any) => {
      console.error('Search error:', error);
      setIsSearching(false);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const searchRequest: SearchRequest = {
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

  const handlePopularQuery = (popularQuery: string) => {
    setQuery(popularQuery);
    const searchRequest: SearchRequest = {
      query: popularQuery,
      rvInfo: Object.values(rvInfo).some(v => v.trim()) ? rvInfo : undefined
    };
    searchMutation.mutate(searchRequest);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about any RV repair issue..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                disabled={isSearching}
              />
            </div>
            
            <button
              type="button"
              onClick={handleVoiceInput}
              className="p-3 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
              aria-label="Voice input"
            >
              <Mic className="h-5 w-5" />
            </button>
            
            <button
              type="submit"
              disabled={!query.trim() || isSearching}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Ask Copilot</span>
            </button>
          </div>

          {/* RV Information Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <button
              type="button"
              onClick={() => setIsRvInfoExpanded(!isRvInfoExpanded)}
              className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
            >
              <Wrench className="h-4 w-4" />
              <span>RV Unit Information</span>
              <motion.div
                animate={{ rotate: isRvInfoExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isRvInfoExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </motion.div>
            </button>

            <AnimatePresence>
              {isRvInfoExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3"
                >
                  <input
                    type="text"
                    placeholder="Brand"
                    value={rvInfo.brand}
                    onChange={(e) => setRvInfo(prev => ({ ...prev, brand: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Model"
                    value={rvInfo.model}
                    onChange={(e) => setRvInfo(prev => ({ ...prev, model: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Year"
                    value={rvInfo.year}
                    onChange={(e) => setRvInfo(prev => ({ ...prev, year: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Type"
                    value={rvInfo.type}
                    onChange={(e) => setRvInfo(prev => ({ ...prev, type: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </div>

      {/* Popular Queries */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Popular Queries
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {popularQueries.map((popularQuery, index) => (
            <button
              key={index}
              onClick={() => handlePopularQuery(popularQuery)}
              className="p-3 text-left text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-600 transition-all duration-200 hover:border-primary-300 dark:hover:border-primary-600"
            >
              {popularQuery}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {searchResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Search Results
            </h3>
            <div className="prose dark:prose-invert max-w-none">
              <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {searchResults.answer}
              </div>
              
              {searchResults.sources && searchResults.sources.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Sources:</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {searchResults.sources.map((source, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                        <span>{source}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {searchResults.metadata && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Processing time: {searchResults.metadata.processingTime}ms</span>
                    <span>Model: {searchResults.metadata.modelUsed}</span>
                    <span>Confidence: {(searchResults.metadata.confidence * 100).toFixed(1)}%</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 p-6 text-center"
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              <span className="text-gray-600 dark:text-gray-400">Searching for solutions...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;