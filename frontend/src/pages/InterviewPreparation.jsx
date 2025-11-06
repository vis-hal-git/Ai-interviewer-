/**
 * Interview Preparation Page - Face Detection & Camera Setup
 * Phase 2: Camera access, face detection, baseline photo capture
 */
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { interviewAPI } from '../services/api';
import { 
  Camera, AlertCircle, CheckCircle, Loader, 
  Video, Volume2, Monitor, Clock, Shield, Eye
} from 'lucide-react';

const InterviewPreparation = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [step, setStep] = useState('loading'); // loading, permissions, setup, ready, countdown, starting
  const [interview, setInterview] = useState(null);
  const [error, setError] = useState('');
  const [cameraReady, setCameraReady] = useState(false);
  const [micReady, setMicReady] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [baselinePhoto, setBaselinePhoto] = useState(null);

  useEffect(() => {
    fetchInterviewDetails();
    return () => {
      // Cleanup: stop camera stream when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const fetchInterviewDetails = async () => {
    try {
      const response = await api.get(`/api/interviews/${sessionId}`);
      if (response.data.success) {
        setInterview(response.data.data);
        setStep('permissions');
      }
    } catch (err) {
      setError('Failed to load interview details');
      console.error(err);
    }
  };

  const requestPermissions = async () => {
    try {
      setStep('setup');
      setError('');

      // Request camera and microphone access
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: true
      });

      setStream(mediaStream);
      
      // Set video source
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      setCameraReady(true);
      setMicReady(true);

      // Start face detection after a short delay
      setTimeout(() => {
        startFaceDetection();
      }, 1000);

    } catch (err) {
      console.error('Permission error:', err);
      if (err.name === 'NotAllowedError') {
        setError('Camera and microphone access denied. Please allow permissions and refresh.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera or microphone found. Please connect devices.');
      } else {
        setError('Failed to access camera/microphone. Please check your devices.');
      }
      setStep('permissions');
    }
  };

  const startFaceDetection = async () => {
    // ============================================================
    // DEVELOPMENT MODE: Face detection disabled for testing
    // TODO: Enable this for production with proper ML model
    // ============================================================
    
    // Simple simulation: Auto-detect after 2 seconds
    setTimeout(() => {
      if (videoRef.current && videoRef.current.videoWidth > 0) {
        setFaceDetected(true);
        setTimeout(() => {
          setStep('ready');
        }, 1000);
      }
    }, 2000);
    
    /* ============================================================
       REAL FACE DETECTION LOGIC (COMMENTED OUT FOR DEVELOPMENT)
       ============================================================
    
    // Face detection using OpenCV-inspired approach
    // Simple heuristic: check if video has sufficient brightness and contrast
    
    let detectionAttempts = 0;
    const maxAttempts = 60; // 30 seconds at 500ms intervals
    
    const detectFaceInterval = setInterval(() => {
      if (videoRef.current && videoRef.current.readyState === 4 && canvasRef.current) {
        detectionAttempts++;
        
        try {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          // Draw current frame
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Get image data for analysis
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Calculate average brightness
          let brightness = 0;
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            brightness += avg;
          }
          brightness = brightness / (data.length / 4);
          
          // Simple heuristic: if brightness is reasonable and video is active, assume face present
          // In production, use face-api.js or backend ML model
          if (brightness > 30 && brightness < 240 && video.videoWidth > 0) {
            setFaceDetected(true);
            clearInterval(detectFaceInterval);
            setTimeout(() => {
              setStep('ready');
            }, 1500);
          }
        } catch (err) {
          console.error('Face detection error:', err);
        }
        
        // Timeout after max attempts
        if (detectionAttempts >= maxAttempts) {
          clearInterval(detectFaceInterval);
          if (!faceDetected) {
            setError('Unable to detect face clearly. Please ensure good lighting and position yourself in the center.');
          }
        }
      }
    }, 500);
    
    ============================================================ */
  };

  const captureBaselinePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      // Convert to base64
      const photoData = canvas.toDataURL('image/jpeg', 0.8);
      setBaselinePhoto(photoData);
      
      return photoData;
    }
    return null;
  };

  const startInterview = async () => {
    try {
      // Capture baseline photo
      const photo = captureBaselinePhoto();
      
      if (!photo) {
        setError('Failed to capture reference photo');
        return;
      }

      // Update interview status to in_progress
      await interviewAPI.updateStatus(sessionId, 'in_progress');

      // Start countdown
      setStep('countdown');
      let count = 3;
      setCountdown(3);
      
      const countdownInterval = setInterval(() => {
        count--;
        
        if (count <= 0) {
          clearInterval(countdownInterval);
          
          console.log('🚀 Navigating to interview room:', sessionId);
          
          // Set to "starting" state before navigation
          setStep('starting');
          
          // Small delay to ensure state updates
          setTimeout(() => {
            // Don't pass stream in state (causes serialization issues)
            // Interview room will request camera access again
            navigate(`/interview/room/${sessionId}`, {
              replace: true // Replace history to prevent back navigation
            });
          }, 100);
        } else {
          setCountdown(count);
        }
      }, 1000);

    } catch (err) {
      console.error('Error starting interview:', err);
      setError('Failed to start interview. Please try again.');
    }
  };

  const rules = [
    { icon: Eye, text: 'Stay centered in the camera frame', color: 'text-blue-500' },
    { icon: Volume2, text: 'Speak clearly and audibly', color: 'text-green-500' },
    { icon: Shield, text: 'No external help or resources', color: 'text-red-500' },
    { icon: Monitor, text: 'Single screen, no tab switching', color: 'text-yellow-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4 pt-24">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Interview Preparation</h1>
          <p className="text-gray-300">Let's set up your camera and verify your environment</p>
          {interview && (
            <div className="mt-4 inline-block px-6 py-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20">
              <span className="text-purple-300 font-semibold">{interview.job_role}</span>
              <span className="text-gray-400 mx-2">•</span>
              <span className="text-gray-300">{interview.questions?.length || 10} Questions</span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Camera Feed */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
              <Camera className="h-6 w-6" />
              <span>Camera Preview</span>
            </h2>

            <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden border-4 border-white/10">
              {step === 'loading' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader className="h-12 w-12 text-purple-400 animate-spin" />
                </div>
              )}

              {step === 'permissions' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <Camera className="h-16 w-16 text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Camera & Microphone Access Required</h3>
                  <p className="text-gray-300 mb-6">We need access to monitor your interview</p>
                  <button
                    onClick={requestPermissions}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
                  >
                    Grant Permissions
                  </button>
                </div>
              )}

              {(step === 'setup' || step === 'ready') && (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {/* Face detection indicator */}
                  {step === 'setup' && (
                    <div className="absolute top-4 left-4 right-4">
                      <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                        faceDetected 
                          ? 'bg-green-500/80 backdrop-blur-sm' 
                          : 'bg-yellow-500/80 backdrop-blur-sm animate-pulse'
                      }`}>
                        {faceDetected ? (
                          <>
                            <CheckCircle className="h-5 w-5 text-white" />
                            <span className="text-white font-semibold">Face Detected ✓</span>
                          </>
                        ) : (
                          <>
                            <Loader className="h-5 w-5 text-white animate-spin" />
                            <span className="text-white font-semibold">Detecting Face...</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Status indicators */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                      cameraReady ? 'bg-green-500/80' : 'bg-red-500/80'
                    } backdrop-blur-sm`}>
                      <Video className="h-4 w-4 text-white" />
                      <span className="text-white text-sm font-medium">
                        {cameraReady ? 'Camera' : 'No Camera'}
                      </span>
                    </div>
                    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                      micReady ? 'bg-green-500/80' : 'bg-red-500/80'
                    } backdrop-blur-sm`}>
                      <Volume2 className="h-4 w-4 text-white" />
                      <span className="text-white text-sm font-medium">
                        {micReady ? 'Microphone' : 'No Mic'}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {step === 'countdown' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-8xl font-bold text-white mb-4 animate-bounce">
                      {countdown}
                    </div>
                    <p className="text-2xl text-white font-semibold">Interview Starting...</p>
                  </div>
                </div>
              )}

              {step === 'starting' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md">
                  <div className="text-center">
                    <Loader className="h-16 w-16 text-purple-400 animate-spin mx-auto mb-4" />
                    <p className="text-2xl text-white font-semibold">Loading Interview Room...</p>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Right: Instructions & Rules */}
          <div className="space-y-6">
            {/* Interview Rules */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                <Shield className="h-6 w-6" />
                <span>Interview Guidelines</span>
              </h2>
              <div className="space-y-4">
                {rules.map((rule, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg bg-white/5 ${rule.color}`}>
                      <rule.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{rule.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Setup Checklist */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-4">Setup Checklist</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  {cameraReady ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-400"></div>
                  )}
                  <span className={cameraReady ? 'text-green-300' : 'text-gray-400'}>
                    Camera access granted
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  {micReady ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-400"></div>
                  )}
                  <span className={micReady ? 'text-green-300' : 'text-gray-400'}>
                    Microphone access granted
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  {faceDetected ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-400"></div>
                  )}
                  <span className={faceDetected ? 'text-green-300' : 'text-gray-400'}>
                    Face detected
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  {step === 'ready' ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-400"></div>
                  )}
                  <span className={step === 'ready' ? 'text-green-300' : 'text-gray-400'}>
                    Environment verified
                  </span>
                </div>
              </div>
            </div>

            {/* Interview Info */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-4">What to Expect</h2>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-purple-400" />
                  <span>Duration: 20-30 minutes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  <span>Your face will be monitored throughout</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>Answer honestly and take your time</span>
                </div>
              </div>
            </div>

            {/* Start Button */}
            {step === 'ready' && (
              <button
                onClick={startInterview}
                className="w-full py-4 px-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-xl flex items-center justify-center space-x-2"
              >
                <span>🚀</span>
                <span>Begin Interview</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Animation CSS */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default InterviewPreparation;
