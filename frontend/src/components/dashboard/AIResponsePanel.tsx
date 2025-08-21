import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  Bookmark, 
  BookmarkPlus, 
  Copy, 
  Check,
  Download,
  Share2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain
} from 'lucide-react';

interface AIResponsePanelProps {
  response?: {
    answer: string;
    sources: string[];
    metadata: {
      question: string;
      searchResults: number;
      processingTime: number;
      modelUsed: string;
      confidence: number;
    };
  } | undefined;
  isLoading?: boolean;
  onSaveSolution?: () => void;
}

const AIResponsePanel: React.FC<AIResponsePanelProps> = ({ 
  response, 
  isLoading = false, 
  onSaveSolution 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleCopy = async () => {
    if (response?.answer) {
      try {
        await navigator.clipboard.writeText(response.answer);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy text:', error);
      }
    }
  };

  const handleSaveSolution = () => {
    setIsSaved(true);
    onSaveSolution?.();
    setTimeout(() => setIsSaved(false), 2000);
  };

  const formatProcessingTime = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.8) return 'text-green-600 dark:text-green-400';
    if (confidence >= 0.6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="text-lg text-gray-600 dark:text-gray-400">
            AI Copilot is analyzing your question...
          </span>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center">
          <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Ready to Help
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Ask a question about your RV repair issue to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              AI Repair Guidance
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {response.metadata.question}
            </p>
            
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Processed in {formatProcessingTime(response.metadata.processingTime)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4" />
                <span>{response.metadata.searchResults} sources found</span>
              </div>
              <div className="flex items-center space-x-1">
                <Brain className="h-4 w-4" />
                <span>{response.metadata.modelUsed}</span>
              </div>
              <div className="flex items-center space-x-1">
                <AlertTriangle className="h-4 w-4" />
                <span className={getConfidenceColor(response.metadata.confidence)}>
                  {Math.round(response.metadata.confidence * 100)}% confidence
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Copy answer"
            >
              {isCopied ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </button>
            
            <button
              onClick={handleSaveSolution}
              className="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Save solution"
            >
              {isSaved ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <BookmarkPlus className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Answer Content */}
      <div className="p-6">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {response.answer}
          </div>
        </div>
      </div>

      {/* Expandable Details */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              Detailed Steps & Sources
            </h4>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="px-6 pb-6"
            >
              {/* Sources */}
              <div className="mb-6">
                <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Sources ({response.sources.length})
                </h5>
                <div className="space-y-2">
                  {response.sources.map((source, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                    >
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-600 rounded-full w-5 h-5 flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                        {source}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Actions */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSaveSolution}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                >
                  <Bookmark className="h-4 w-4" />
                  <span>Save This Solution</span>
                </button>
                
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors duration-200">
                  <Download className="h-4 w-4" />
                  <span>Export PDF</span>
                </button>
                
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors duration-200">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIResponsePanel;