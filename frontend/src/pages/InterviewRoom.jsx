/**
 * Interview Room Page - AI Voice Interview with Two-Panel Layout
 */
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { interviewAPI } from '../services/api';
import voiceAgent from '../services/voiceAgent';
import speechRecognition from '../services/speechRecognition';
import { 
  Video, Mic, Clock, AlertTriangle, 
  Loader, Bot, Volume2, VolumeX, StopCircle, Send
} from 'lucide-react';

const InterviewRoom = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const conversationEndRef = useRef(null);
  const timeoutRef = useRef(null);
  const silenceTimeoutRef = useRef(null);

  // Interview state
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewEnding, setInterviewEnding] = useState(false);
  const [error, setError] = useState(null);

  // AI Agent state
  const [agentSpeaking, setAgentSpeaking] = useState(false);
  const [agentText, setAgentText] = useState(''); // Current sentence being spoken
  const [agentMuted, setAgentMuted] = useState(false);

  // Candidate state
  const [isListening, setIsListening] = useState(false);
  const [candidateTranscript, setCandidateTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [canSpeak, setCanSpeak] = useState(false);
  const [silenceCountdown, setSilenceCountdown] = useState(10); // 10 second countdown
  
  // Conversation state
  const [conversation, setConversation] = useState([]);
  const [currentQuestionObj, setCurrentQuestionObj] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [awaitingFollowUp, setAwaitingFollowUp] = useState(false);
  const [stream, setStream] = useState(null);

  // Timer state
  const [elapsedTime, setElapsedTime] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(null);

  // Initialize interview
  useEffect(() => {
    initializeInterview();
    
    return () => {
      // Cleanup
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      voiceAgent.stop();
      speechRecognition.stop();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, []);

  // Timer effect
  useEffect(() => {
    let interval;
    if (interviewStarted && !interviewEnding) {
      interval = setInterval(() => {
        setElapsedTime(prev => {
          const newTime = prev + 1;
          // Auto-end after 30 minutes (1800 seconds)
          if (newTime >= 1800) {
            handleEndInterview();
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [interviewStarted, interviewEnding]);

  // Auto-scroll conversation
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const initializeInterview = async () => {
    try {
      // Fetch interview details
      const response = await interviewAPI.getById(sessionId);
      if (response.data.success) {
        const interviewData = response.data.data;
        setInterview(interviewData);
        
        // Initialize camera
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: true
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        // Start interview automatically
        await startInterview(interviewData);
      }
    } catch (err) {
      console.error('Initialization error:', err);
      setError('Failed to initialize interview. Please refresh the page.');
      setLoading(false);
    }
  };

  const startInterview = async (interviewData) => {
    try {
      setLoading(true);
      setInterviewStarted(true);
      
      // Check if questions exist
      if (!interviewData.questions || interviewData.questions.length === 0) {
        setError('No interview questions were generated. Please try again or contact support.');
        setLoading(false);
        setInterviewStarted(false);
        return;
      }
      
      // Wait for loading to complete (simulate setup time)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set loading to false BEFORE speaking
      setLoading(false);
      
      // Wait a bit more for UI to render
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Now start speaking - welcome message
      const welcomeMsg = `Hello! Welcome to your ${interviewData.job_role} interview. I'm your AI interviewer today. Let's begin.`;
      
      // Add to conversation FIRST
      addToConversation('agent', welcomeMsg);
      
      // Then speak
      await speakMessage(welcomeMsg, 'agent');
      
      // Wait 1 second then ask first question
      setTimeout(() => {
        askNextQuestion(interviewData.questions, 0);
      }, 1000);
      
    } catch (err) {
      console.error('Start interview error:', err);
      setError('Failed to start interview');
      setLoading(false);
    }
  };

  const askNextQuestion = async (questions, index) => {
    if (!questions || questions.length === 0) {
      setError('No questions available. Please try starting the interview again.');
      setLoading(false);
      return;
    }
    
    if (index >= questions.length) {
      // All questions complete
      await handleEndInterview();
      return;
    }

    const question = questions[index];
    setCurrentQuestionObj(question);
    setCurrentQuestionIndex(index);
    setQuestionStartTime(Date.now());
    setCanSpeak(false);
    
    const questionText = question.question || question;
    
    // Add to conversation FIRST (before speaking)
    addToConversation('agent', questionText, { 
      isQuestion: true, 
      questionId: question._id || index 
    });
    
    // Then speak (without adding to conversation again)
    await speakMessage(questionText, 'agent');
    
    // After agent finishes speaking, allow candidate to respond
    setTimeout(() => {
      startListening();
    }, 500);
  };

  const startListening = () => {
    try {
      // Clear any existing silence timeout
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      
      // Reset countdown
      setSilenceCountdown(10);
      
      const success = speechRecognition.start(
        (result) => {
          // Handle transcript updates - use correct property names from service
          if (result) {
            const finalText = result.final || '';
            const interimText = result.interim || '';
            
            setCandidateTranscript(finalText);
            setInterimTranscript(interimText);
            
            // Reset silence timer whenever we get new speech
            if (finalText || interimText) {
              resetSilenceTimer();
            }
          }
        },
        () => {
          // Handle end of speech
          setIsListening(false);
        }
      );
      
      if (success !== false) {
        setIsListening(true);
        setCanSpeak(true);
        setError(null);
        
        // Start 10-second silence timer
        startSilenceTimer();
      } else {
        setError('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
        setCanSpeak(false);
      }
    } catch (err) {
      console.error('Speech recognition error:', err);
      setError('Microphone access denied. Please enable microphone permissions and refresh.');
      setCanSpeak(false);
    }
  };

  const startSilenceTimer = () => {
    let countdown = 10;
    setSilenceCountdown(countdown);
    
    const countdownInterval = setInterval(() => {
      countdown--;
      setSilenceCountdown(countdown);
      
      if (countdown <= 0) {
        clearInterval(countdownInterval);
        // Auto-submit answer after 10 seconds of silence
        console.log('⏱️ 10 seconds of silence - auto-submitting answer');
        handleSubmitAnswer();
      }
    }, 1000);
    
    silenceTimeoutRef.current = countdownInterval;
  };

  const resetSilenceTimer = () => {
    // Clear existing timer
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      clearInterval(silenceTimeoutRef.current);
    }
    
    // Restart timer
    startSilenceTimer();
  };

  const handleSubmitAnswer = async () => {
    const answer = candidateTranscript.trim();
    
    // Clear silence timer
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      clearInterval(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    
    if (!answer) {
      console.log('⚠️ No answer provided, skipping to next question');
      // If no answer after 10 seconds, move to next question
      setAwaitingFollowUp(false);
      setTimeout(() => {
        askNextQuestion(interview.questions, currentQuestionIndex + 1);
      }, 1000);
      return;
    }

    try {
      setCanSpeak(false);
      speechRecognition.stop();
      setIsListening(false);
      
      // Add answer to conversation
      addToConversation('candidate', answer);
      
      // Submit to backend
      await interviewAPI.submitAnswer(sessionId, {
        question_id: currentQuestionObj._id || currentQuestionIndex,
        question: currentQuestionObj.question || currentQuestionObj,
        answer: answer,
        time_taken: Math.floor((Date.now() - questionStartTime) / 1000)
      });
      
      // Reset transcript
      setCandidateTranscript('');
      setInterimTranscript('');
      speechRecognition.reset();
      
      // Decide: follow-up or next question (60% follow-up chance)
      const shouldFollowUp = Math.random() > 0.4 && !awaitingFollowUp;
      
      if (shouldFollowUp) {
        setAwaitingFollowUp(true);
        await generateAndAskFollowUp(answer);
      } else {
        setAwaitingFollowUp(false);
        // Move to next question
        setTimeout(() => {
          askNextQuestion(interview.questions, currentQuestionIndex + 1);
        }, 1500);
      }
      
    } catch (err) {
      console.error('Submit answer error:', err);
      setError('Failed to submit answer. Please try again.');
      setCanSpeak(true);
    }
  };

  const generateAndAskFollowUp = async (previousAnswer) => {
    try {
      const response = await interviewAPI.generateFollowUp(
        sessionId,
        currentQuestionObj._id || currentQuestionIndex,
        previousAnswer
      );
      
      if (response.data.success && response.data.follow_up) {
        const followUp = response.data.follow_up;
        
        setTimeout(async () => {
          // Add to conversation FIRST
          addToConversation('agent', followUp, { isFollowUp: true });
          
          // Then speak
          await speakMessage(followUp, 'agent');
          
          setTimeout(() => {
            startListening();
          }, 500);
        }, 1000);
      } else {
        // No follow-up, move to next question
        setAwaitingFollowUp(false);
        setTimeout(() => {
          askNextQuestion(interview.questions, currentQuestionIndex + 1);
        }, 1500);
      }
    } catch (err) {
      console.error('Follow-up generation error:', err);
      // On error, skip follow-up and continue
      setAwaitingFollowUp(false);
      setTimeout(() => {
        askNextQuestion(interview.questions, currentQuestionIndex + 1);
      }, 1500);
    }
  };

  const speakMessage = async (text, sender) => {
    if (sender === 'agent' && !agentMuted) {
      setAgentSpeaking(true);
      
      try {
        // Use sentence-by-sentence speaking with subtitle updates
        await voiceAgent.speakWithSentenceUpdates(
          text,
          (currentSentence, index, total) => {
            // Update subtitle to show only current sentence
            setAgentText(currentSentence);
            
            // If it's the last sentence and it's empty, we're done
            if (index === total && !currentSentence) {
              setAgentSpeaking(false);
            }
          }
        );
        
        setAgentSpeaking(false);
        setAgentText(''); // Clear after all sentences
      } catch (err) {
        console.error('Voice agent error:', err);
        setAgentSpeaking(false);
        setAgentText('');
      }
    }
  };

  const addToConversation = (sender, text, metadata = {}) => {
    setConversation(prev => {
      // Check if this exact message already exists (prevent duplicates)
      const isDuplicate = prev.some(msg => 
        msg.sender === sender && 
        msg.text === text && 
        Date.now() - msg.timestamp < 2000 // Within last 2 seconds
      );
      
      if (isDuplicate) {
        console.log('⚠️ Duplicate message prevented:', text.substring(0, 50));
        return prev;
      }
      
      return [...prev, {
        sender,
        text,
        timestamp: Date.now(),
        ...metadata
      }];
    });
  };

  const handleEndInterview = async () => {
    if (interviewEnding) return;
    
    setInterviewEnding(true);
    speechRecognition.stop();
    voiceAgent.stop();
    
    try {
      // Speak farewell
      const farewellMsg = "Thank you for your time. Your interview has been completed. We'll review your responses and get back to you soon.";
      await speakMessage(farewellMsg, 'agent');
      
      // Complete interview on backend
      await interviewAPI.completeInterview(sessionId);
      
      // Navigate to completion page
      setTimeout(() => {
        navigate(`/interview/complete/${sessionId}`);
      }, 2000);
    } catch (err) {
      console.error('End interview error:', err);
      navigate(`/interview/complete/${sessionId}`);
    }
  };

  const toggleAgentMute = () => {
    setAgentMuted(prev => !prev);
    if (!agentMuted) {
      voiceAgent.stop();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Initializing AI Interview...</p>
        </div>
      </div>
    );
  }

  if (error && !interview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md">
          <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Interview Error</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
      {/* Header - Fixed position to avoid navbar overlap */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-slate-800/50 backdrop-blur-lg border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Bot className="h-6 w-6 text-purple-400" />
            <div>
              <h1 className="text-xl font-bold text-white">AI Interview in Progress</h1>
              <p className="text-sm text-gray-400">{interview?.job_role}</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-gray-300">
              <Clock className="h-5 w-5" />
              <span className="font-mono">{formatTime(elapsedTime)}</span>
            </div>
            <div className="text-gray-300">
              Question {currentQuestionIndex + 1} / {interview?.questions?.length || 0}
            </div>
            <button
              onClick={handleEndInterview}
              disabled={interviewEnding}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition-all disabled:opacity-50"
            >
              <StopCircle className="h-4 w-4" />
              <span>End Interview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Panel Layout - Add top padding for fixed header */}
      <div className="h-[calc(100vh-144px)] mt-20 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* Left Panel: AI Agent */}
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-white/10 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-semibold text-lg flex items-center space-x-2">
              <Bot className="h-5 w-5 text-purple-400" />
              <span>AI Interviewer</span>
            </h3>
            <button
              onClick={toggleAgentMute}
              className={`p-2 rounded-lg transition-all ${
                agentMuted 
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                  : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
              }`}
            >
              {agentMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
          </div>

          {/* AI Avatar */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative mb-6">
              {/* Pulsing rings when speaking */}
              {agentSpeaking && (
                <>
                  <div className="absolute inset-0 rounded-full bg-purple-500/30 animate-ping" />
                  <div className="absolute inset-0 rounded-full bg-pink-500/20 animate-pulse" 
                       style={{ animationDelay: '0.2s' }} />
                </>
              )}
              
              {/* Avatar circle */}
              <div className={`relative w-48 h-48 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center transition-transform ${
                agentSpeaking ? 'scale-110' : 'scale-100'
              }`}>
                <Bot className="h-24 w-24 text-white" />
              </div>
            </div>

            {/* Subtitles - Below Avatar */}
            <div className="w-full min-h-[100px] bg-slate-900/50 rounded-xl p-4 border border-white/10 flex items-center justify-center">
              {agentText ? (
                <p className="text-gray-200 text-center leading-relaxed text-lg animate-fadeIn">
                  {agentText}
                </p>
              ) : (
                <p className="text-gray-500 text-center italic">
                  {agentSpeaking ? 'Speaking...' : 'Waiting...'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Candidate Video & Conversation */}
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-white/10 p-6 flex flex-col">
          {/* Candidate Video */}
          <div className="mb-4">
            <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
              <Video className="h-5 w-5 text-purple-400" />
              <span>Your Video</span>
            </h3>
            <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover mirror"
              />
              {isListening && (
                <div className="absolute bottom-3 left-3 flex items-center space-x-2 bg-green-600 px-3 py-1 rounded-full animate-pulse">
                  <Mic className="h-4 w-4 text-white" />
                  <span className="text-white text-sm font-semibold">Listening...</span>
                </div>
              )}
            </div>
          </div>

          {/* Conversation History */}
          <div className="flex-1 bg-slate-900/50 rounded-xl p-4 border border-white/10 overflow-y-auto mb-4">
            <div className="space-y-3">
              {conversation.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'agent' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.sender === 'agent'
                        ? 'bg-purple-500/20 border border-purple-500/30 text-purple-100'
                        : 'bg-green-500/20 border border-green-500/30 text-green-100'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
              <div ref={conversationEndRef} />
            </div>
          </div>

          {/* Real-time Transcript & Auto-Submit */}
          {canSpeak && (
            <div className="bg-slate-900/50 rounded-xl p-4 border border-white/10">
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-semibold">Your Response:</p>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-yellow-400" />
                    <span className={`font-mono font-bold ${
                      silenceCountdown <= 3 ? 'text-red-400 animate-pulse' : 
                      silenceCountdown <= 5 ? 'text-yellow-400' : 
                      'text-gray-400'
                    }`}>
                      Auto-submit in {silenceCountdown}s
                    </span>
                  </div>
                </div>
                <p className="text-gray-300 min-h-[60px] leading-relaxed">
                  {candidateTranscript || <span className="text-gray-500 italic">Start speaking...</span>}
                  {interimTranscript && (
                    <span className="text-gray-500 italic"> {interimTranscript}</span>
                  )}
                </p>
              </div>
              
              {/* Progress bar for countdown */}
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-2 transition-all duration-1000 ${
                    silenceCountdown <= 3 ? 'bg-red-500' : 
                    silenceCountdown <= 5 ? 'bg-yellow-500' : 
                    'bg-green-500'
                  }`}
                  style={{ width: `${(silenceCountdown / 10) * 100}%` }}
                />
              </div>
              
              <p className="text-xs text-gray-500 mt-2 text-center">
                {candidateTranscript ? 'Answer will auto-submit after 10s of silence' : 'Waiting for your response...'}
              </p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-3 flex items-start space-x-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .mirror {
          transform: scaleX(-1);
        }
        
        /* Fade in animation for subtitles */
        @keyframes fadeIn {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default InterviewRoom;
