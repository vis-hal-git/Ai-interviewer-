/**
 * Resume Upload Page - Beautiful drag-and-drop UI
 */
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState('Software Engineer');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const [resumeId, setResumeId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for message from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setInfoMessage(location.state.message);
      // Clear the message after 5 seconds
      const timer = setTimeout(() => {
        setInfoMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const jobRoles = [
    { value: 'Software Engineer', icon: '💻', color: 'from-blue-500 to-cyan-500' },
    { value: 'Data Scientist', icon: '📊', color: 'from-purple-500 to-pink-500' },
    { value: 'DevOps Engineer', icon: '⚙️', color: 'from-green-500 to-teal-500' },
    { value: 'Frontend Developer', icon: '🎨', color: 'from-orange-500 to-red-500' },
    { value: 'Backend Developer', icon: '🔧', color: 'from-indigo-500 to-blue-500' },
    { value: 'Full Stack Developer', icon: '🚀', color: 'from-yellow-500 to-orange-500' },
    { value: 'ML Engineer', icon: '🤖', color: 'from-violet-500 to-purple-500' },
    { value: 'Product Manager', icon: '📱', color: 'from-pink-500 to-rose-500' },
  ];

  const validateFile = (file) => {
    // Check file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    const allowedExtensions = ['.pdf', '.docx', '.doc'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      return 'Please upload a PDF or DOCX file';
    }

    // Check file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }

    return null;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError('');

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const validationError = validateFile(droppedFile);
      
      if (validationError) {
        setError(validationError);
        return;
      }
      
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    setError('');
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validationError = validateFile(selectedFile);
      
      if (validationError) {
        setError(validationError);
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('job_role', jobRole);

      const response = await api.post('/api/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.data.success) {
        setExtractedData(response.data.extracted_data);
        setResumeId(response.data.resume_id);
        setShowSuccess(true);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.detail || 'Failed to upload resume. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleStartInterview = async () => {
    if (resumeId) {
      try {
        // Start interview and generate questions
        const response = await api.post('/api/interviews/start', {
          candidate_id: resumeId,
          job_role: jobRole
        });

        if (response.data.success) {
          const sessionId = response.data.data.session_id;
          // Navigate to interview preparation page (face detection setup)
          navigate(`/interview/prepare/${sessionId}`);
        }
      } catch (error) {
        console.error('Error starting interview:', error);
        setError('Failed to start interview. Please try again.');
      }
    }
  };

  const handleEditInfo = () => {
    // Navigate to profile page for editing
    navigate('/profile');
  };

  const handleReset = () => {
    setFile(null);
    setExtractedData(null);
    setResumeId(null);
    setShowSuccess(false);
    setUploadProgress(0);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Selected role details
  const selectedRoleDetails = jobRoles.find(role => role.value === jobRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 pt-24">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center transform rotate-3 shadow-2xl">
              <span className="text-4xl">📄</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Upload Your Resume
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Let AI analyze your experience and prepare a personalized interview for your dream role
          </p>
        </div>

        {!showSuccess ? (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Upload */}
            <div className="space-y-6">
              {/* Drag and Drop Zone */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                <form onSubmit={handleSubmit}>
                  <div
                    className={`relative border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                      dragActive
                        ? 'border-purple-400 bg-purple-500/20 scale-105'
                        : 'border-gray-400/50 hover:border-purple-400/50 hover:bg-white/5'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.docx,.doc"
                      className="hidden"
                      id="file-upload"
                    />
                    
                    {!file ? (
                      <div className="space-y-4">
                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform">
                          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-white text-lg font-semibold mb-2">
                            Drag & drop your resume here
                          </p>
                          <p className="text-gray-300 text-sm mb-4">or</p>
                          <label
                            htmlFor="file-upload"
                            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold cursor-pointer hover:scale-105 transition-transform shadow-lg"
                          >
                            Browse Files
                          </label>
                          <p className="text-gray-400 text-xs mt-4">
                            Supports PDF, DOC, DOCX (Max 10MB)
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center border-4 border-green-500">
                          <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-white font-semibold text-lg">{file.name}</p>
                          <p className="text-gray-300 text-sm">{formatFileSize(file.size)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleReset}
                          className="text-gray-300 hover:text-white text-sm underline"
                        >
                          Choose different file
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Info Message */}
                  {infoMessage && (
                    <div className="mt-4 p-4 bg-blue-500/20 border border-blue-500/50 rounded-xl text-blue-300 text-sm flex items-start space-x-2">
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span>{infoMessage}</span>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm flex items-start space-x-2 animate-shake">
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Upload Progress */}
                  {uploading && (
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm text-gray-300">
                        <span>Uploading and analyzing...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Upload Button */}
                  <button
                    type="submit"
                    disabled={!file || uploading}
                    className={`w-full mt-6 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                      !file || uploading
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 shadow-xl hover:shadow-2xl'
                    }`}
                  >
                    {uploading ? (
                      <span className="flex items-center justify-center space-x-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Analyzing Resume...</span>
                      </span>
                    ) : (
                      '🚀 Upload & Analyze'
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column - Job Role Selection */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                  <span>🎯</span>
                  <span>Select Target Role</span>
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {jobRoles.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setJobRole(role.value)}
                      className={`p-4 rounded-xl text-left transition-all duration-300 ${
                        jobRole === role.value
                          ? `bg-gradient-to-br ${role.color} text-white shadow-lg scale-105`
                          : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:scale-105'
                      }`}
                    >
                      <div className="text-3xl mb-2">{role.icon}</div>
                      <div className="text-sm font-semibold">{role.value}</div>
                    </button>
                  ))}
                </div>

                {/* Selected Role Info */}
                <div className={`mt-6 p-6 rounded-2xl bg-gradient-to-br ${selectedRoleDetails?.color} text-white`}>
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-4xl">{selectedRoleDetails?.icon}</span>
                    <div>
                      <p className="text-sm opacity-90">You're applying for</p>
                      <p className="text-xl font-bold">{jobRole}</p>
                    </div>
                  </div>
                  <p className="text-sm opacity-90">
                    Our AI will tailor interview questions based on this role and your resume
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl">
                <h4 className="text-lg font-bold text-white mb-4">What happens next?</h4>
                <div className="space-y-3">
                  {[
                    { icon: '🤖', text: 'AI analyzes your resume' },
                    { icon: '📝', text: 'Extracts skills & experience' },
                    { icon: '💡', text: 'Generates custom questions' },
                    { icon: '🎥', text: 'Start your interview' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 text-gray-300">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Success View with Extracted Data */
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl animate-fade-in">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4 animate-bounce-slow">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Resume Uploaded Successfully!</h2>
              <p className="text-gray-300">We've extracted the following information from your resume</p>
            </div>

            {/* Extracted Information */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Personal Info */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <span>👤</span>
                  <span>Personal Information</span>
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm">Name</p>
                    <p className="text-white font-semibold">{extractedData?.name || 'Not found'}</p>
                  </div>
                  {extractedData?.email && (
                    <div>
                      <p className="text-gray-400 text-sm">Email</p>
                      <p className="text-white font-semibold">{extractedData.email}</p>
                    </div>
                  )}
                  {extractedData?.phone && (
                    <div>
                      <p className="text-gray-400 text-sm">Phone</p>
                      <p className="text-white font-semibold">{extractedData.phone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Professional Links */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <span>�</span>
                  <span>Professional Links</span>
                </h3>
                <div className="space-y-3">
                  {extractedData?.linkedin ? (
                    <div>
                      <p className="text-gray-400 text-sm">LinkedIn</p>
                      <a href={extractedData.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm underline break-all">
                        {extractedData.linkedin}
                      </a>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No LinkedIn profile found</p>
                  )}
                  {extractedData?.github ? (
                    <div>
                      <p className="text-gray-400 text-sm">GitHub</p>
                      <a href={extractedData.github} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm underline break-all">
                        {extractedData.github}
                      </a>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No GitHub profile found</p>
                  )}
                  {extractedData?.portfolio && (
                    <div>
                      <p className="text-gray-400 text-sm">Portfolio</p>
                      <a href={extractedData.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm underline break-all">
                        {extractedData.portfolio}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills */}
              {extractedData?.skills && extractedData.skills.length > 0 && (
                <div className="md:col-span-2 bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                    <span>⚡</span>
                    <span>Skills ({extractedData.skills.length})</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {extractedData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full text-white text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {extractedData?.experience && extractedData.experience.length > 0 && (
                <div className="md:col-span-2 bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                    <span>💼</span>
                    <span>Work Experience ({extractedData.experience.length})</span>
                  </h3>
                  <div className="space-y-4">
                    {extractedData.experience.map((exp, index) => (
                      <div key={index} className="border-l-2 border-purple-500 pl-4">
                        <h4 className="text-white font-semibold">{exp.title}</h4>
                        <p className="text-purple-400 text-sm">{exp.company}</p>
                        {exp.duration && (
                          <p className="text-gray-400 text-xs mt-1">{exp.duration}</p>
                        )}
                        {exp.description && (
                          <p className="text-gray-300 text-sm mt-2">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {extractedData?.education && extractedData.education.length > 0 && (
                <div className="md:col-span-2 bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                    <span>🎓</span>
                    <span>Education ({extractedData.education.length})</span>
                  </h3>
                  <div className="space-y-4">
                    {extractedData.education.map((edu, index) => (
                      <div key={index} className="border-l-2 border-green-500 pl-4">
                        <h4 className="text-white font-semibold">{edu.degree}</h4>
                        <p className="text-green-400 text-sm">{edu.institution}</p>
                        <div className="flex items-center gap-4 mt-1">
                          {edu.year && (
                            <p className="text-gray-400 text-xs">{edu.year}</p>
                          )}
                          {edu.grade && (
                            <p className="text-gray-400 text-xs">Grade: {edu.grade}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {extractedData?.projects && extractedData.projects.length > 0 && (
                <div className="md:col-span-2 bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                    <span>🚀</span>
                    <span>Projects ({extractedData.projects.length})</span>
                  </h3>
                  <div className="space-y-4">
                    {extractedData.projects.map((project, index) => (
                      <div key={index} className="border-l-2 border-yellow-500 pl-4">
                        <h4 className="text-white font-semibold">{project.name}</h4>
                        {project.description && (
                          <p className="text-gray-300 text-sm mt-1">{project.description}</p>
                        )}
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {project.technologies.map((tech, i) => (
                              <span key={i} className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                        {project.link && (
                          <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-xs mt-2 inline-block underline">
                            View Project →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {extractedData?.certifications && extractedData.certifications.length > 0 && (
                <div className="md:col-span-2 bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                    <span>📜</span>
                    <span>Certifications ({extractedData.certifications.length})</span>
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {extractedData.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center space-x-2 text-gray-300">
                        <span className="text-green-400">✓</span>
                        <span className="text-sm">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements */}
              {extractedData?.achievements && extractedData.achievements.length > 0 && (
                <div className="md:col-span-2 bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                    <span>🏆</span>
                    <span>Achievements ({extractedData.achievements.length})</span>
                  </h3>
                  <div className="space-y-2">
                    {extractedData.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start space-x-2 text-gray-300">
                        <span className="text-yellow-400 mt-1">★</span>
                        <span className="text-sm">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {extractedData?.languages && extractedData.languages.length > 0 && (
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                    <span>🌐</span>
                    <span>Languages</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {extractedData.languages.map((lang, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Volunteer Work */}
              {extractedData?.volunteer && extractedData.volunteer.length > 0 && (
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                    <span>🤝</span>
                    <span>Volunteer Experience</span>
                  </h3>
                  <div className="space-y-3">
                    {extractedData.volunteer.map((vol, index) => (
                      <div key={index}>
                        <h4 className="text-white font-semibold text-sm">{vol.role}</h4>
                        <p className="text-gray-400 text-xs">{vol.organization}</p>
                        {vol.duration && (
                          <p className="text-gray-500 text-xs">{vol.duration}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Publications */}
              {extractedData?.publications && extractedData.publications.length > 0 && (
                <div className="md:col-span-2 bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                    <span>📚</span>
                    <span>Publications ({extractedData.publications.length})</span>
                  </h3>
                  <div className="space-y-3">
                    {extractedData.publications.map((pub, index) => (
                      <div key={index} className="border-l-2 border-pink-500 pl-4">
                        <h4 className="text-white font-semibold text-sm">{pub.title}</h4>
                        <p className="text-pink-400 text-xs">{pub.venue}</p>
                        {pub.year && (
                          <p className="text-gray-400 text-xs">{pub.year}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary */}
              {extractedData?.summary && (
                <div className="md:col-span-2 bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                    <span>📋</span>
                    <span>Professional Summary</span>
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{extractedData.summary}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleStartInterview}
                className="flex-1 py-4 px-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-xl flex items-center justify-center space-x-2"
              >
                <span>🎯</span>
                <span>Start Interview</span>
              </button>
              <button
                onClick={handleEditInfo}
                className="flex-1 py-4 px-8 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-xl flex items-center justify-center space-x-2"
              >
                <span>✏️</span>
                <span>Edit Info</span>
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-4 px-8 bg-white/10 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all border border-white/20"
              >
                Upload Another Resume
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
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
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
};

export default ResumeUpload;
