import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, X, Check } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  onError?: (error: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  onError,
  placeholder = 'Click to start voice input...',
  disabled = false,
  className = ''
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check if Speech Recognition is supported
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;

      // Configure recognition settings
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      // Event handlers
      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);
      };

      recognition.onerror = (event) => {
        let errorMessage = 'Voice recognition error occurred.';
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try again.';
            break;
          case 'audio-capture':
            errorMessage = 'Audio capture failed. Please check your microphone.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone access denied. Please allow microphone access.';
            break;
          case 'network':
            errorMessage = 'Network error occurred. Please check your connection.';
            break;
          case 'service-not-allowed':
            errorMessage = 'Speech recognition service not allowed.';
            break;
          case 'bad-grammar':
            errorMessage = 'Speech recognition grammar error.';
            break;
          case 'language-not-supported':
            errorMessage = 'Language not supported.';
            break;
        }

        setError(errorMessage);
        setIsListening(false);
        if (onError) {
          onError(errorMessage);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onError]);

  const startListening = () => {
    if (!isSupported || disabled) return;

    try {
      setTranscript('');
      setError(null);
      recognitionRef.current?.start();
    } catch (err) {
      const errorMessage = 'Failed to start voice recognition.';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setError(null);
  };

  const submitTranscript = () => {
    if (transcript.trim()) {
      onTranscript(transcript.trim());
      setTranscript('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && transcript.trim()) {
      submitTranscript();
    }
  };

  if (!isSupported) {
    return (
      <div className={`text-center p-4 text-gray-500 dark:text-gray-400 ${className}`}>
        <MicOff className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm">Voice input is not supported in your browser.</p>
        <p className="text-xs mt-1">Try Chrome, Edge, or Safari for voice input support.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Voice Input Button */}
      <div className="flex items-center space-x-3">
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={disabled}
          className={`relative p-3 rounded-full transition-all duration-300 ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg animate-pulse'
              : 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
        >
          <AnimatePresence mode="wait">
            {isListening ? (
              <motion.div
                key="listening"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MicOff className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div
                key="not-listening"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Mic className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isListening ? 'Listening... Speak now' : placeholder}
          </p>
        </div>
      </div>

      {/* Transcript Display */}
      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Voice Transcript
                </span>
              </div>
              <button
                onClick={clearTranscript}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                aria-label="Clear transcript"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Edit your transcript if needed..."
                className="w-full p-3 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {transcript.length} characters
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={submitTranscript}
                    disabled={!transcript.trim()}
                    className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm rounded-md transition-colors duration-200 flex items-center space-x-1"
                  >
                    <Check className="h-3 w-3" />
                    <span>Submit</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
          >
            <div className="flex items-center space-x-2">
              <MicOff className="h-4 w-4 text-red-600 dark:text-red-400" />
              <span className="text-sm text-red-800 dark:text-red-200">
                {error}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Indicator */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center justify-center space-x-2 text-sm text-primary-600 dark:text-primary-400"
        >
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
                className="w-2 h-2 bg-current rounded-full"
              />
            ))}
          </div>
          <span>Listening...</span>
        </motion.div>
      )}
    </div>
  );
};

export default VoiceInput;