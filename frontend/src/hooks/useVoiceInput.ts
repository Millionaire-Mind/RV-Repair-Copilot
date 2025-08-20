import { useState, useRef, useCallback, useEffect } from 'react';

interface VoiceInputState {
  isListening: boolean;
  transcript: string;
  isSupported: boolean;
  error: string | null;
}

interface VoiceInputActions {
  startListening: () => void;
  stopListening: () => void;
  clearTranscript: () => void;
  submitTranscript: () => void;
  setTranscript: (transcript: string) => void;
}

interface UseVoiceInputOptions {
  onTranscript?: (transcript: string) => void;
  onError?: (error: string) => void;
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
  maxAlternatives?: number;
}

interface UseVoiceInputReturn extends VoiceInputState, VoiceInputActions {}

export const useVoiceInput = (options: UseVoiceInputOptions = {}): UseVoiceInputReturn => {
  const {
    onTranscript,
    onError,
    continuous = true,
    interimResults = true,
    language = 'en-US',
    maxAlternatives = 1
  } = options;

  const [state, setState] = useState<VoiceInputState>({
    isListening: false,
    transcript: '',
    isSupported: false,
    error: null
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isInitializedRef = useRef(false);

  // Initialize speech recognition
  useEffect(() => {
    if (isInitializedRef.current) return;

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      try {
        recognitionRef.current = new SpeechRecognition();
        const recognition = recognitionRef.current;

        // Configure recognition settings
        recognition.continuous = continuous;
        recognition.interimResults = interimResults;
        recognition.lang = language;
        recognition.maxAlternatives = maxAlternatives;

        // Event handlers
        recognition.onstart = () => {
          setState(prev => ({
            ...prev,
            isListening: true,
            error: null
          }));
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

          const newTranscript = finalTranscript + interimTranscript;
          setState(prev => ({
            ...prev,
            transcript: newTranscript
          }));
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
            case 'aborted':
              errorMessage = 'Voice recognition was aborted.';
              break;
          }

          setState(prev => ({
            ...prev,
            error: errorMessage,
            isListening: false
          }));

          if (onError) {
            onError(errorMessage);
          }
        };

        recognition.onend = () => {
          setState(prev => ({
            ...prev,
            isListening: false
          }));
        };

        recognition.onaudiostart = () => {
          // Audio capture started
        };

        recognition.onaudioend = () => {
          // Audio capture ended
        };

        recognition.onsoundstart = () => {
          // Sound detected
        };

        recognition.onsoundend = () => {
          // Sound ended
        };

        recognition.onspeechstart = () => {
          // Speech started
        };

        recognition.onspeechend = () => {
          // Speech ended
        };

        setState(prev => ({
          ...prev,
          isSupported: true
        }));

        isInitializedRef.current = true;
      } catch (error) {
        console.error('Failed to initialize speech recognition:', error);
        setState(prev => ({
          ...prev,
          isSupported: false,
          error: 'Failed to initialize voice recognition.'
        }));
      }
    } else {
      setState(prev => ({
        ...prev,
        isSupported: false
      }));
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          // Ignore errors during cleanup
        }
      }
    };
  }, [continuous, interimResults, language, maxAlternatives, onError]);

  const startListening = useCallback(() => {
    if (!state.isSupported || state.isListening) return;

    try {
      setState(prev => ({
        ...prev,
        transcript: '',
        error: null
      }));

      recognitionRef.current?.start();
    } catch (error) {
      const errorMessage = 'Failed to start voice recognition.';
      setState(prev => ({
        ...prev,
        error: errorMessage
      }));
      
      if (onError) {
        onError(errorMessage);
      }
    }
  }, [state.isSupported, state.isListening, onError]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && state.isListening) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
  }, [state.isListening]);

  const clearTranscript = useCallback(() => {
    setState(prev => ({
      ...prev,
      transcript: '',
      error: null
    }));
  }, []);

  const submitTranscript = useCallback(() => {
    if (state.transcript.trim() && onTranscript) {
      onTranscript(state.transcript.trim());
      setState(prev => ({
        ...prev,
        transcript: ''
      }));
    }
  }, [state.transcript, onTranscript]);

  const setTranscript = useCallback((transcript: string) => {
    setState(prev => ({
      ...prev,
      transcript
    }));
  }, []);

  // Auto-submit when final transcript is ready (if continuous is false)
  useEffect(() => {
    if (!continuous && state.transcript && !state.isListening && onTranscript) {
      const timer = setTimeout(() => {
        submitTranscript();
      }, 1000); // Wait 1 second after stopping to ensure final results

      return () => clearTimeout(timer);
    }
  }, [continuous, state.transcript, state.isListening, onTranscript, submitTranscript]);

  return {
    ...state,
    startListening,
    stopListening,
    clearTranscript,
    submitTranscript,
    setTranscript
  };
};

export default useVoiceInput;