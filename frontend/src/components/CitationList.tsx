import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, FileText, Globe, BookOpen, ChevronRight } from 'lucide-react';

interface Citation {
  id: string;
  title: string;
  url?: string;
  source: string;
  type: 'manual' | 'website' | 'document' | 'video';
  relevance: number;
  excerpt?: string;
  date?: string;
}

interface CitationListProps {
  citations: Citation[];
  title?: string;
  maxVisible?: number;
  showRelevance?: boolean;
}

const CitationList: React.FC<CitationListProps> = ({
  citations,
  title = 'Sources',
  maxVisible = 5,
  showRelevance = false
}) => {
  const [showAll, setShowAll] = React.useState(false);
  const visibleCitations = showAll ? citations : citations.slice(0, maxVisible);
  const hasMore = citations.length > maxVisible;

  const getSourceIcon = (type: Citation['type']) => {
    switch (type) {
      case 'manual':
        return <BookOpen className="h-4 w-4" />;
      case 'website':
        return <Globe className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'video':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getSourceColor = (type: Citation['type']) => {
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

  const getRelevanceColor = (relevance: number) => {
    if (relevance >= 0.8) return 'text-green-600 dark:text-green-400';
    if (relevance >= 0.6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const formatRelevance = (relevance: number) => {
    return `${(relevance * 100).toFixed(0)}%`;
  };

  const handleCitationClick = (citation: Citation) => {
    if (citation.url) {
      window.open(citation.url, '_blank', 'noopener,noreferrer');
    }
  };

  if (citations.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title} ({citations.length})
          </h3>
          {showRelevance && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Relevance Score
            </div>
          )}
        </div>
      </div>

      {/* Citations List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {visibleCitations.map((citation, index) => (
          <motion.div
            key={citation.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
          >
            <div className="flex items-start space-x-3">
              {/* Icon */}
              <div className={`flex-shrink-0 mt-1 ${getSourceColor(citation.type)}`}>
                {getSourceIcon(citation.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">
                      {citation.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {citation.source}
                      {citation.date && (
                        <span className="ml-2">• {citation.date}</span>
                      )}
                    </p>
                    {citation.excerpt && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {citation.excerpt}
                      </p>
                    )}
                  </div>

                  {/* Relevance Score */}
                  {showRelevance && (
                    <div className="ml-4 flex-shrink-0">
                      <span className={`text-xs font-medium ${getRelevanceColor(citation.relevance)}`}>
                        {formatRelevance(citation.relevance)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-3 flex items-center space-x-2">
                  {citation.url && (
                    <button
                      onClick={() => handleCitationClick(citation)}
                      className="inline-flex items-center space-x-1 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>View Source</span>
                    </button>
                  )}
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {citation.type.charAt(0).toUpperCase() + citation.type.slice(1)}
                  </span>
                </div>
              </div>

              {/* Chevron for clickable items */}
              {citation.url && (
                <div className="flex-shrink-0 ml-2">
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Show More/Less Button */}
      {hasMore && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full text-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
          >
            {showAll ? 'Show Less' : `Show ${citations.length - maxVisible} More`}
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>
            {citations.length} source{citations.length !== 1 ? 's' : ''} found
          </span>
          <span>
            Powered by AI search
          </span>
        </div>
      </div>
    </div>
  );
};

export default CitationList;