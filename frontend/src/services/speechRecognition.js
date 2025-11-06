/**
 * Speech Recognition Service
 * Handles speech-to-text for candidate responses
 */

class SpeechRecognitionService {
  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('⚠️ Speech Recognition not supported in this browser');
      this.supported = false;
      return;
    }

    this.supported = true;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;

    this.isListening = false;
    this.transcript = '';
    this.interimTranscript = '';
    this.onResultCallback = null;
    this.onEndCallback = null;

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      if (final) {
        this.transcript += final;
      }
      this.interimTranscript = interim;

      if (this.onResultCallback) {
        this.onResultCallback({
          final: this.transcript.trim(),
          interim: this.interimTranscript,
          isFinal: final.length > 0
        });
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      
      // Handle specific errors
      if (event.error === 'no-speech') {
        console.log('No speech detected, continuing...');
      } else if (event.error === 'aborted') {
        console.log('Recognition aborted');
      } else if (event.error === 'network') {
        console.error('Network error in speech recognition');
      }
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        // Restart to keep listening
        try {
          this.recognition.start();
        } catch (error) {
          console.log('Recognition restart attempted while already running');
        }
      } else if (this.onEndCallback) {
        this.onEndCallback(this.transcript.trim());
      }
    };

    this.recognition.onstart = () => {
      console.log('🎤 Speech recognition started');
    };
  }

  start(onResult, onEnd) {
    if (!this.supported) {
      console.error('Speech recognition not supported');
      return false;
    }

    this.transcript = '';
    this.interimTranscript = '';
    this.onResultCallback = onResult;
    this.onEndCallback = onEnd;
    this.isListening = true;

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      if (error.message.includes('already started')) {
        console.log('Recognition already running');
        return true;
      }
      console.error('Error starting speech recognition:', error);
      return false;
    }
  }

  stop() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.log('Recognition stop error (likely already stopped):', error.message);
      }
    }
    return this.transcript.trim();
  }

  getTranscript() {
    return {
      final: this.transcript.trim(),
      interim: this.interimTranscript
    };
  }

  reset() {
    this.transcript = '';
    this.interimTranscript = '';
  }

  isSupported() {
    return this.supported;
  }

  getCurrentlyListening() {
    return this.isListening;
  }
}

export default new SpeechRecognitionService();
