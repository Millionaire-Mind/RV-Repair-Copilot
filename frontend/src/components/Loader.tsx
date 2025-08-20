import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Search, Brain, Cog } from 'lucide-react';

interface LoaderProps {
  type?: 'spinner' | 'dots' | 'pulse' | 'search' | 'brain' | 'custom';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  type = 'spinner',
  size = 'md',
  message,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const renderLoader = () => {
    switch (type) {
      case 'spinner':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className={`${sizeClasses[size]} text-primary-600 dark:text-primary-400`}
          >
            <Loader2 className="w-full h-full" />
          </motion.div>
        );

      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className={`${sizeClasses[size]} bg-primary-600 dark:bg-primary-400 rounded-full`}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className={`${sizeClasses[size]} bg-primary-600 dark:bg-primary-400 rounded-full`}
          />
        );

      case 'search':
        return (
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className={`${sizeClasses[size]} text-primary-600 dark:text-primary-400`}
          >
            <Search className="w-full h-full" />
          </motion.div>
        );

      case 'brain':
        return (
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className={`${sizeClasses[size]} text-primary-600 dark:text-primary-400`}
          >
            <Brain className="w-full h-full" />
          </motion.div>
        );

      case 'custom':
        return (
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className={`${sizeClasses[size]} text-primary-600 dark:text-primary-400`}
          >
            <Cog className="w-full h-full" />
          </motion.div>
        );

      default:
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className={`${sizeClasses[size]} text-primary-600 dark:text-primary-400`}
          >
            <Loader2 className="w-full h-full" />
          </motion.div>
        );
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      {renderLoader()}
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-xs"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};

// Specialized loader components for common use cases
export const SearchLoader: React.FC<{ message?: string }> = ({ message }) => (
  <Loader
    type="search"
    size="lg"
    message={message || "Searching for repair information..."}
    className="py-8"
  />
);

export const BrainLoader: React.FC<{ message?: string }> = ({ message }) => (
  <Loader
    type="brain"
    size="lg"
    message={message || "AI is analyzing your question..."}
    className="py-8"
  />
);

export const ProcessingLoader: React.FC<{ message?: string }> = ({ message }) => (
  <Loader
    type="dots"
    size="md"
    message={message || "Processing..."}
    className="py-4"
  />
);

export const InlineLoader: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'sm' }) => (
  <Loader
    type="spinner"
    size={size}
    className="inline-flex"
  />
);

export default Loader;