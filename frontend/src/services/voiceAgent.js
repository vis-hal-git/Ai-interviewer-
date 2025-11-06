/**
 * AI Voice Agent Service
 * Handles text-to-speech for interview questions and interactions
 */

class VoiceAgentService {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voice = null;
    this.isSpeaking = false;
    this.currentUtterance = null;
    this.initialized = false;
    this.initVoice();
  }

  initVoice() {
    const setVoice = () => {
      const voices = this.synth.getVoices();
      
      // Prefer clear, professional English voices
      this.voice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha'))
                   || voices.find(v => v.lang === 'en-US')
                   || voices.find(v => v.lang.startsWith('en'))
                   || voices[0];
      
      this.initialized = true;
      console.log('🎤 Voice Agent initialized:', this.voice?.name);
    };

    if (this.synth.getVoices().length > 0) {
      setVoice();
    } else {
      this.synth.addEventListener('voiceschanged', setVoice);
    }
  }

  // Split text into sentences
  splitIntoSentences(text) {
    // Split by period, question mark, or exclamation followed by space
    return text.match(/[^.!?]+[.!?]+/g) || [text];
  }

  async speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      // Stop any ongoing speech
      if (this.isSpeaking) {
        this.stop();
      }

      // Wait for initialization
      if (!this.initialized) {
        setTimeout(() => this.speak(text, options).then(resolve).catch(reject), 100);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = this.voice;
      utterance.rate = options.rate || 0.95; // Slightly slower for clarity
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;
      utterance.lang = 'en-US';

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.currentUtterance = utterance;
        if (options.onStart) options.onStart();
      };

      utterance.onboundary = (event) => {
        // Called at word boundaries - we'll use this to track progress
        if (options.onBoundary) {
          options.onBoundary(event);
        }
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        if (options.onEnd) options.onEnd();
        resolve();
      };

      utterance.onerror = (error) => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        console.error('Speech synthesis error:', error);
        if (options.onError) options.onError(error);
        reject(error);
      };

      this.synth.speak(utterance);
    });
  }

  // Speak text sentence by sentence with updates
  async speakWithSentenceUpdates(text, onSentenceChange) {
    const sentences = this.splitIntoSentences(text);
    
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].trim();
      if (!sentence) continue;

      // Update current sentence
      if (onSentenceChange) {
        onSentenceChange(sentence, i, sentences.length);
      }

      // Speak the sentence
      await this.speak(sentence);

      // Small pause between sentences
      if (i < sentences.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    // Clear subtitle after all sentences
    if (onSentenceChange) {
      onSentenceChange('', sentences.length, sentences.length);
    }
  }

  stop() {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
    this.isSpeaking = false;
    this.currentUtterance = null;
  }

  pause() {
    if (this.isSpeaking && !this.synth.paused) {
      this.synth.pause();
    }
  }

  resume() {
    if (this.synth.paused) {
      this.synth.resume();
    }
  }

  isCurrentlySpeaking() {
    return this.isSpeaking || this.synth.speaking;
  }
}

export default new VoiceAgentService();
