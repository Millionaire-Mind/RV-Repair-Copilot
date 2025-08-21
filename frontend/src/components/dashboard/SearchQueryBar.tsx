import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Mic, Send, Wrench, Calendar } from 'lucide-react';

interface SearchQueryBarProps {
  onSearch: (query: string, rvInfo: RVInfo) => void;
  isLoading?: boolean;
}

interface RVInfo {
  brand: string;
  model: string;
  year: string;
  type: string;
}

const SearchQueryBar: React.FC<SearchQueryBarProps> = ({ onSearch, isLoading = false }) => {
  const [query, setQuery] = useState('');
  const [rvInfo, setRvInfo] = useState<RVInfo>({
    brand: '',
    model: '',
    year: '',
    type: ''
  });
  const [isRvInfoExpanded, setIsRvInfoExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), rvInfo);
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 p-6">
      {/* Main Search Bar */}
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
              disabled={isLoading}
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
            disabled={!query.trim() || isLoading}
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
              <Calendar className="h-4 w-4" />
            </motion.div>
          </button>

          <motion.div
            initial={false}
            animate={{ height: isRvInfoExpanded ? 'auto' : 0, opacity: isRvInfoExpanded ? 1 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Brand
                </label>
                <input
                  type="text"
                  value={rvInfo.brand}
                  onChange={(e) => setRvInfo({ ...rvInfo, brand: e.target.value })}
                  placeholder="e.g., Winnebago"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Model
                </label>
                <input
                  type="text"
                  value={rvInfo.model}
                  onChange={(e) => setRvInfo({ ...rvInfo, model: e.target.value })}
                  placeholder="e.g., View"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Year
                </label>
                <input
                  type="text"
                  value={rvInfo.year}
                  onChange={(e) => setRvInfo({ ...rvInfo, year: e.target.value })}
                  placeholder="e.g., 2023"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={rvInfo.type}
                  onChange={(e) => setRvInfo({ ...rvInfo, type: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select Type</option>
                  <option value="Class A">Class A</option>
                  <option value="Class B">Class B</option>
                  <option value="Class C">Class C</option>
                  <option value="Travel Trailer">Travel Trailer</option>
                  <option value="Fifth Wheel">Fifth Wheel</option>
                  <option value="Pop-up">Pop-up</option>
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      </form>

      {/* Quick Search Suggestions */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Popular queries:</p>
        <div className="flex flex-wrap gap-2">
          {popularQueries.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setQuery(suggestion)}
              className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-primary-100 dark:hover:bg-primary-900/20 text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-300 rounded-full transition-all duration-200"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchQueryBar;