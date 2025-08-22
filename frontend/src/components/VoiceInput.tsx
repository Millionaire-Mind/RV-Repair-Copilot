import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, X, Check } from 'lucide-react';

// TypeScript declarations for Web Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  isListening?: boolean;
  onToggleListening?: () => void;
  className?: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  isListening = false,
  onToggleListening,
  className = ''
}) => {
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check if Speech Recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setError(null);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
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

        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
          onTranscript(finalTranscript);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        let errorMessage = 'Speech recognition error';
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected';
            break;
          case 'audio-capture':
            errorMessage = 'Audio capture failed';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone access denied';
            break;
          case 'network':
            errorMessage = 'Network error';
            break;
          case 'service-not-allowed':
            errorMessage = 'Speech recognition service not allowed';
            break;
          case 'bad-grammar':
            errorMessage = 'Bad grammar';
            break;
          case 'language-not-supported':
            errorMessage = 'Language not supported';
            break;
        }
        
        setError(errorMessage);
      };

      recognition.onend = () => {
        // Recognition ended
      };

      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
      setError('Speech recognition not supported in this browser');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript]);

  const startListening = () => {
    if (recognitionRef.current && isSupported) {
      try {
        recognitionRef.current.start();
        onToggleListening?.();
      } catch (error) {
        setError('Failed to start speech recognition');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      onToggleListening?.();
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setError(null);
  };

  if (!isSupported) {
    return (
      <div className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>
        Speech recognition not supported in this browser
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {isListening ? (
        <button
          onClick={stopListening}
          className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
          aria-label="Stop listening"
        >
          <MicOff className="h-5 w-5" />
        </button>
      ) : (
        <button
          onClick={startListening}
          className="p-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20"
          aria-label="Start listening"
        >
          <Mic className="h-5 w-5" />
        </button>
      )}

      {transcript && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
            {transcript}
          </span>
          <button
            onClick={clearTranscript}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            aria-label="Clear transcript"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 text-sm text-red-600 dark:text-red-400">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-200"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;