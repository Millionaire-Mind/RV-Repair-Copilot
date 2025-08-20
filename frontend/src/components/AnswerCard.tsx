import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Copy, 
  Check, 
  ExternalLink, 
  Clock, 
  Search, 
  Brain,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface AnswerCardProps {
  answer: string;
  sources: string[];
  metadata: {
    question: string;
    searchResults: number;
    processingTime: number;
    modelUsed: string;
  };
}

const AnswerCard: React.FC<AnswerCardProps> = ({ answer, sources, metadata }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(answer);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
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

  const formatProcessingTime = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              AI Repair Guidance
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Generated using {metadata.modelUsed} based on {metadata.searchResults} relevant sources
            </p>
          </div>
          
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="ml-4 p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Copy answer"
          >
            {isCopied ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Metadata */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>Processed in {formatProcessingTime(metadata.processingTime)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Search className="h-4 w-4" />
            <span>{metadata.searchResults} sources found</span>
          </div>
          <div className="flex items-center space-x-1">
            <Brain className="h-4 w-4" />
            <span>{metadata.modelUsed}</span>
          </div>
        </div>
      </div>

      {/* Answer Content */}
      <div className="p-6">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              // Custom styling for different markdown elements
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-6 first:mt-0">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-5">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 mt-4">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-1">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-1">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-gray-700 dark:text-gray-300">
                  {children}
                </li>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-gray-900 dark:text-white">
                  {children}
                </strong>
              ),
              em: ({ children }) => (
                <em className="italic text-gray-700 dark:text-gray-300">
                  {children}
                </em>
              ),
              code: ({ children, className }) => {
                const isInline = !className;
                if (isInline) {
                  return (
                    <code className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono">
                      {children}
                    </code>
                  );
                }
                return (
                  <code className={className}>
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => (
                <pre className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-4 rounded-lg overflow-x-auto mb-4">
                  {children}
                </pre>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-4">
                  {children}
                </blockquote>
              ),
            }}
          >
            {answer}
          </ReactMarkdown>
        </div>
      </div>

      {/* Sources Section */}
      {sources.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={toggleExpanded}
            className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                Sources ({sources.length})
              </h4>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </div>
          </button>
          
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="px-4 pb-4"
            >
              <div className="space-y-2">
                {sources.map((source, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700"
                  >
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {index + 1}
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                      {source}
                    </span>
                    <button
                      className="p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                      aria-label="View source"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>
            Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </span>
          <span className="text-xs">
            AI-powered by RV Repair Copilot
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default AnswerCard;