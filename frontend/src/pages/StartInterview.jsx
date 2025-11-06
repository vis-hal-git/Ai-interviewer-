/**
 * Start Interview - Smart entry point that checks for existing resume
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeAPI, interviewAPI } from '../services/api';
import { Loader, AlertCircle, Upload, PlayCircle } from 'lucide-react';

const StartInterview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resumeData, setResumeData] = useState(null);
  const [jobRoles, setJobRoles] = useState([
    'Software Engineer',
    'Data Scientist',
    'DevOps Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'ML Engineer',
    'Product Manager'
  ]);
  const [selectedRole, setSelectedRole] = useState('');
  const [startingInterview, setStartingInterview] = useState(false);

  useEffect(() => {
    checkExistingResume();
  }, []);

  const checkExistingResume = async () => {
    try {
      setLoading(true);
      
      // Try to get the user's profile (from resume upload or manual entry)
      try {
        const profileResponse = await resumeAPI.getProfile();
        console.log('✅ Profile response received:', profileResponse.data);
        
        if (profileResponse.data && profileResponse.data.profile) {
          const profile = profileResponse.data.profile;
          console.log('✅ Profile data found:', {
            full_name: profile.full_name,
            name: profile.name,
            email: profile.email,
            skills_count: profile.skills?.length,
            experience_count: profile.experience?.length,
            _id: profile._id
          });
          
          // Check if profile has essential data (name, email, skills, or experience)
          const hasEssentialData = profile.full_name || profile.name || profile.email || 
                                    (profile.skills && profile.skills.length > 0) || 
                                    (profile.experience && profile.experience.length > 0);
          
          console.log('✅ Has essential data:', hasEssentialData);
          
          if (hasEssentialData) {
            // User has a complete profile, use this data
            const resumeDataToSet = {
              _id: profile._id,
              name: profile.full_name || profile.name,
              email: profile.email,
              phone: profile.phone,
              skills: profile.skills || [],
              experience: profile.experience || [],
              education: profile.education || [],
              job_role: profile.job_role || jobRoles[0]
            };
            console.log('✅ Setting resume data:', resumeDataToSet);
            setResumeData(resumeDataToSet);
            setSelectedRole(profile.job_role || jobRoles[0]);
            setLoading(false);
            console.log('✅ Profile loaded successfully, stopping here');
            return; // Profile found, no need to check resumes
          } else {
            console.log('❌ Profile found but missing essential data');
          }
        } else {
          console.log('❌ No profile in response');
        }
      } catch (profileErr) {
        // Profile not found or error, continue to check resumes
        console.error('❌ Profile error:', profileErr.response?.status, profileErr.response?.data || profileErr.message);
      }

      // If no profile, check for uploaded resumes
      const response = await resumeAPI.getUserResumes();
      
      if (response.data.success && response.data.data && response.data.data.length > 0) {
        // User has at least one resume
        const latestResume = response.data.data[0]; // Get most recent resume
        setResumeData(latestResume);
        setSelectedRole(latestResume.job_role || jobRoles[0]);
      } else {
        // No resume or profile found, redirect to profile page
        navigate('/profile', { 
          state: { message: 'Please complete your profile or upload your resume first.' }
        });
      }
    } catch (err) {
      console.error('Error checking resume:', err);
      if (err.response?.status === 404) {
        // No resume found, redirect to profile
        navigate('/profile', { 
          state: { message: 'Please complete your profile or upload your resume first.' }
        });
      } else {
        setError('Failed to check profile data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStartInterview = async () => {
    if (!selectedRole) {
      setError('Please select a job role');
      return;
    }

    try {
      setStartingInterview(true);
      setError('');

      // Start interview with existing resume data
      const response = await interviewAPI.start(resumeData._id, selectedRole);

      if (response.data.success) {
        const sessionId = response.data.data.session_id;
        // Navigate to interview preparation page
        navigate(`/interview/prepare/${sessionId}`);
      }
    } catch (err) {
      console.error('Error starting interview:', err);
      setError(err.response?.data?.detail || 'Failed to start interview. Please try again.');
      setStartingInterview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center pt-20">
        <div className="text-center">
          <Loader className="h-12 w-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Checking your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 pt-24">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center transform rotate-3 shadow-2xl">
              <PlayCircle className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Start Your Interview
          </h1>
          <p className="text-gray-300 text-lg">
            We found your resume! Select the role and let's begin.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          {/* Resume Info */}
          {resumeData && (
            <div className="mb-8 p-6 bg-white/5 rounded-2xl border border-white/10">
              <h2 className="text-xl font-bold text-white mb-4">Your Profile</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Name:</span>
                  <span className="text-white font-semibold">{resumeData.name || 'Not specified'}</span>
                </div>
                {resumeData.email && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Email:</span>
                    <span className="text-white font-semibold">{resumeData.email}</span>
                  </div>
                )}
                {resumeData.skills && resumeData.skills.length > 0 && (
                  <div>
                    <span className="text-gray-400 block mb-2">Skills:</span>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.slice(0, 8).map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                      {resumeData.skills.length > 8 && (
                        <span className="px-3 py-1 text-gray-400 text-sm">
                          +{resumeData.skills.length - 8} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <button
                  onClick={() => navigate('/profile')}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center space-x-1"
                >
                  <span>✏️</span>
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          )}

          {/* Job Role Selection */}
          <div className="mb-6">
            <label className="block text-white text-lg font-semibold mb-4">
              Select Target Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              {jobRoles.map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`p-4 rounded-xl text-left transition-all duration-300 ${
                    selectedRole === role
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:scale-105 border border-white/10'
                  }`}
                >
                  <div className="text-sm font-semibold">{role}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Info Box */}
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <h3 className="text-white font-semibold mb-2 flex items-center space-x-2">
              <span>💡</span>
              <span>What happens next?</span>
            </h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start space-x-2">
                <span>•</span>
                <span>10 personalized questions will be generated based on your profile</span>
              </li>
              <li className="flex items-start space-x-2">
                <span>•</span>
                <span>Camera and microphone setup for monitoring</span>
              </li>
              <li className="flex items-start space-x-2">
                <span>•</span>
                <span>20-30 minute interview session</span>
              </li>
              <li className="flex items-start space-x-2">
                <span>•</span>
                <span>Instant comprehensive evaluation report</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleStartInterview}
              disabled={!selectedRole || startingInterview}
              className={`flex-1 py-4 px-8 rounded-xl font-bold text-lg transition-all shadow-xl flex items-center justify-center space-x-2 ${
                !selectedRole || startingInterview
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:scale-105'
              }`}
            >
              {startingInterview ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>Starting Interview...</span>
                </>
              ) : (
                <>
                  <PlayCircle className="h-5 w-5" />
                  <span>Begin Interview</span>
                </>
              )}
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 py-4 px-8 bg-white/10 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all border border-white/20"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Alternative Action */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/upload-resume')}
            className="text-gray-400 hover:text-white transition-colors flex items-center justify-center space-x-2 mx-auto"
          >
            <Upload className="h-4 w-4" />
            <span className="text-sm">Upload a different resume</span>
          </button>
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

export default StartInterview;
