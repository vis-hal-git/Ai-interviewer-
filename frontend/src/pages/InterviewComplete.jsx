/**
 * Interview Complete Page - Thank you and results preview
 */
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { interviewAPI } from '../services/api';
import { CheckCircle, Loader, TrendingUp, Clock, Award, ArrowRight } from 'lucide-react';

const InterviewComplete = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviewDetails();
  }, []);

  const fetchInterviewDetails = async () => {
    try {
      const response = await interviewAPI.getById(sessionId);
      if (response.data.success) {
        setInterview(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching interview:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center pt-20">
        <div className="text-center">
          <Loader className="h-12 w-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Processing your interview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 pt-24">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-block mb-6">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center transform shadow-2xl animate-bounce">
                <CheckCircle className="h-16 w-16 text-white" />
              </div>
              <div className="absolute inset-0 w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Interview Complete! 🎉
          </h1>
          <p className="text-gray-300 text-xl">
            Great job! Your interview has been submitted successfully.
          </p>
        </div>

        {/* Interview Summary */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl mb-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
            <Award className="h-6 w-6 text-yellow-400" />
            <span>Interview Summary</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Questions Answered */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Questions</span>
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-white">
                {interview?.questions?.length || 0}
              </p>
              <p className="text-gray-400 text-sm mt-1">Answered</p>
            </div>

            {/* Duration */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Duration</span>
                <Clock className="h-5 w-5 text-purple-400" />
              </div>
              <p className="text-3xl font-bold text-white">
                {interview?.duration ? `${Math.floor(interview.duration / 60)}m` : '~30m'}
              </p>
              <p className="text-gray-400 text-sm mt-1">Total Time</p>
            </div>

            {/* Job Role */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Position</span>
                <Award className="h-5 w-5 text-green-400" />
              </div>
              <p className="text-xl font-bold text-white truncate">
                {interview?.job_role || 'N/A'}
              </p>
              <p className="text-gray-400 text-sm mt-1">Role Applied</p>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl mb-6">
          <h2 className="text-2xl font-bold text-white mb-6">What Happens Next?</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                <span className="text-purple-300 font-bold">1</span>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">AI Analysis</h3>
                <p className="text-gray-400 text-sm">
                  Our AI is processing your responses to evaluate technical skills, communication, and problem-solving abilities.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                <span className="text-purple-300 font-bold">2</span>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">Detailed Report</h3>
                <p className="text-gray-400 text-sm">
                  You'll receive a comprehensive evaluation report with scores, feedback, and improvement suggestions.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                <span className="text-purple-300 font-bold">3</span>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">Recruiter Review</h3>
                <p className="text-gray-400 text-sm">
                  Recruiters will review your performance and may reach out for next steps.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 py-4 px-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:scale-105 transition-all shadow-xl flex items-center justify-center space-x-2"
          >
            <span>View Dashboard</span>
            <ArrowRight className="h-5 w-5" />
          </button>
          <button
            onClick={() => navigate(`/interview/report/${sessionId}`)}
            className="flex-1 py-4 px-8 bg-white/10 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all border border-white/20 flex items-center justify-center space-x-2"
          >
            <Award className="h-5 w-5" />
            <span>View Report (Coming Soon)</span>
          </button>
        </div>

        {/* Encouragement Message */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Thank you for using AI Recruiter Pro! We'll notify you once your report is ready.
          </p>
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

export default InterviewComplete;
