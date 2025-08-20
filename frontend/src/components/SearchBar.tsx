import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mic, Filter, X, ChevronDown } from 'lucide-react';
import { useMutation } from 'react-query';
import { searchRVRepair } from '../services/api';
import AnswerCard from './AnswerCard';
import CitationList from './CitationList';
import Loader from './Loader';

interface SearchFilters {
  brand?: string;
  component?: string;
  manualType?: 'service' | 'owner' | 'parts' | 'wiring';
}

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Search mutation
  const searchMutation = useMutation(searchRVRepair, {
    onSuccess: () => {
      setShowResults(true);
    },
    onError: (error) => {
      console.error('Search failed:', error);
      // Handle error (show toast, etc.)
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      searchMutation.mutate({
        question: query.trim(),
        ...filters,
      });
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  const popularBrands = [
    'Winnebago', 'Airstream', 'Jayco', 'Forest River', 'Thor Industries',
    'Keystone RV', 'Grand Design RV', 'Palomino', 'Coachmen'
  ];

  const popularComponents = [
    'Refrigerator', 'Furnace', 'Water Heater', 'Air Conditioner', 'Generator',
    'Battery', 'Inverter', 'Brakes', 'Suspension', 'Electrical', 'Plumbing'
  ];

  const manualTypes = [
    { value: 'service', label: 'Service Manual' },
    { value: 'owner', label: 'Owner Manual' },
    { value: 'parts', label: 'Parts Manual' },
    { value: 'wiring', label: 'Wiring Diagram' },
  ];

  return (
    <div className="w-full">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe your RV repair issue..."
            className="w-full pl-12 pr-20 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-xl shadow-soft focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            disabled={searchMutation.isLoading}
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {/* Voice Input Button */}
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
              aria-label="Voice input"
            >
              <Mic className="h-5 w-5" />
            </button>
            
            {/* Filters Button */}
            <button
              type="button"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                hasActiveFilters
                  ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400'
              }`}
              aria-label="Toggle filters"
            >
              <Filter className="h-5 w-5" />
            </button>
            
            {/* Search Button */}
            <button
              type="submit"
              disabled={!query.trim() || searchMutation.isLoading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
            >
              {searchMutation.isLoading ? (
                <Loader size="sm" />
              ) : (
                'Search'
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Filters Panel */}
      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="mt-4 bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Search Filters
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Brand Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    RV Brand
                  </label>
                  <select
                    value={filters.brand || ''}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Any brand</option>
                    {popularBrands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Component Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Component
                  </label>
                  <select
                    value={filters.component || ''}
                    onChange={(e) => handleFilterChange('component', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Any component</option>
                    {popularComponents.map((component) => (
                      <option key={component} value={component}>
                        {component}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Manual Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Manual Type
                  </label>
                  <select
                    value={filters.manualType || ''}
                    onChange={(e) => handleFilterChange('manualType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Any type</option>
                    {manualTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(filters).map(([key, value]) => {
                      if (!value) return null;
                      return (
                        <span
                          key={key}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-200"
                        >
                          {key}: {value}
                          <button
                            onClick={() => handleFilterChange(key as keyof SearchFilters, '')}
                            className="ml-2 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Results */}
      <AnimatePresence>
        {showResults && searchMutation.data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Search Results
              </h3>
              
              <AnswerCard
                answer={searchMutation.data.data.answer}
                sources={searchMutation.data.data.sources}
                metadata={searchMutation.data.data.metadata}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {searchMutation.isError && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <p className="text-red-800 dark:text-red-200">
            Sorry, we couldn't process your search. Please try again.
          </p>
        </motion.div>
      )}

      {/* Quick Search Suggestions */}
      {!showResults && !searchMutation.isLoading && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Popular searches:
          </h4>
          <div className="flex flex-wrap gap-2">
            {[
              'Dometic refrigerator not cooling',
              'Water heater pilot light won\'t stay lit',
              'Slide out not working',
              'Battery not charging',
              'Furnace won\'t start',
              'Electrical system troubleshooting'
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setQuery(suggestion);
                  handleSearch({ preventDefault: () => {} } as React.FormEvent);
                }}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;