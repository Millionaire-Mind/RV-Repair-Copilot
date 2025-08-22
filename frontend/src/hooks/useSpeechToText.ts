import { useState, useCallback, useEffect } from 'react';

interface UseSpeechToTextReturn {
  transcript: string;
  listening: boolean;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export const useSpeechToText = (): UseSpeechToTextReturn => {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if Web Speech API is supported
    const checkSupport = () => {
      const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
      setIsSupported(supported);
    };
    
    checkSupport();
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) return;

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setListening(true);
        setTranscript('');
      };
      
      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setListening(false);
      };
      
      recognition.onend = () => {
        setListening(false);
      };
      
      recognition.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setListening(false);
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    setListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    transcript,
    listening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
};