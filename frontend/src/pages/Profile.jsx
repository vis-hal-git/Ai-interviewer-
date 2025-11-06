import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  User, Mail, Phone, Link as LinkIcon, Save, Edit2, X,
  Briefcase, GraduationCap, Award, Code, Rocket, Star,
  Globe, BookOpen, Heart, Check, Loader, AlertCircle
} from 'lucide-react';
import { resumeAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [editMode, setEditMode] = useState({});
  const [editedData, setEditedData] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'social', label: 'Social Links', icon: LinkIcon },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'projects', label: 'Projects', icon: Rocket },
    { id: 'achievements', label: 'Achievements', icon: Star },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'additional', label: 'Additional', icon: BookOpen },
  ];

  useEffect(() => {
    fetchProfile();
    
    // Check for redirect message from StartInterview
    if (location.state?.message) {
      setInfoMessage(location.state.message);
      setTimeout(() => setInfoMessage(''), 5000);
      // Clear the location state
      navigate(location.pathname, { replace: true });
    }
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await resumeAPI.getProfile();
      setProfile(response.data.profile);
      setEditedData(response.data.profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 404) {
        // No resume found, redirect to upload
        navigate('/upload-resume');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section) => {
    setEditMode({ ...editMode, [section]: true });
  };

  const handleCancel = (section) => {
    setEditMode({ ...editMode, [section]: false });
    // Reset edited data to original profile data
    setEditedData({ ...editedData, [section]: profile[section] });
  };

  const handleSave = async (section) => {
    try {
      setSaving(true);
      const dataToUpdate = {};
      
      // Prepare data based on section
      if (section === 'basic') {
        dataToUpdate.full_name = editedData.full_name;
        dataToUpdate.email = editedData.email;
        dataToUpdate.phone = editedData.phone;
        dataToUpdate.summary = editedData.summary;
      } else if (section === 'social') {
        dataToUpdate.linkedin = editedData.linkedin;
        dataToUpdate.github = editedData.github;
        dataToUpdate.portfolio = editedData.portfolio;
      } else {
        dataToUpdate[section] = editedData[section];
      }

      await resumeAPI.updateProfile(dataToUpdate);
      
      // Update local profile state
      setProfile({ ...profile, ...dataToUpdate });
      setEditMode({ ...editMode, [section]: false });
      
      // Show success message
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedData({ ...editedData, [field]: value });
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...(editedData[field] || [])];
    newArray[index] = value;
    setEditedData({ ...editedData, [field]: newArray });
  };

  const handleObjectArrayChange = (field, index, key, value) => {
    const newArray = [...(editedData[field] || [])];
    newArray[index] = { ...newArray[index], [key]: value };
    setEditedData({ ...editedData, [field]: newArray });
  };

  const addArrayItem = (field, defaultValue = '') => {
    const newArray = [...(editedData[field] || []), defaultValue];
    setEditedData({ ...editedData, [field]: newArray });
  };

  const removeArrayItem = (field, index) => {
    const newArray = [...(editedData[field] || [])];
    newArray.splice(index, 1);
    setEditedData({ ...editedData, [field]: newArray });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center pt-20">
        <div className="text-center">
          <Loader className="h-12 w-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center pt-20">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        <div className="text-center relative z-10">
          <p className="text-white text-lg mb-4">No profile found. Please upload your resume first.</p>
          <button
            onClick={() => navigate('/upload-resume')}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:scale-105 transition-transform"
          >
            Upload Resume
          </button>
        </div>
      </div>
    );
  }

  const renderBasicInfo = () => (
    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Basic Information</h2>
        {!editMode.basic ? (
          <button
            onClick={() => handleEdit('basic')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => handleCancel('basic')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500/20 text-gray-300 rounded-lg hover:bg-gray-500/30 transition-colors"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              onClick={() => handleSave('basic')}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
          {editMode.basic ? (
            <input
              type="text"
              value={editedData.full_name || ''}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          ) : (
            <p className="text-white font-semibold">{profile.full_name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
          {editMode.basic ? (
            <input
              type="email"
              value={editedData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          ) : (
            <p className="text-white">{profile.email || 'Not provided'}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
          {editMode.basic ? (
            <input
              type="tel"
              value={editedData.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          ) : (
            <p className="text-white">{profile.phone || 'Not provided'}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Professional Summary</label>
          {editMode.basic ? (
            <textarea
              value={editedData.summary || ''}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              rows={4}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          ) : (
            <p className="text-gray-300">{profile.summary || 'No summary provided'}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderSocialLinks = () => (
    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Social Links</h2>
        {!editMode.social ? (
          <button
            onClick={() => handleEdit('social')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => handleCancel('social')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500/20 text-gray-300 rounded-lg hover:bg-gray-500/30 transition-colors"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              onClick={() => handleSave('social')}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">LinkedIn</label>
          {editMode.social ? (
            <input
              type="url"
              value={editedData.linkedin || ''}
              onChange={(e) => handleInputChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          ) : (
            profile.linkedin ? (
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline break-all">
                {profile.linkedin}
              </a>
            ) : (
              <p className="text-gray-500">Not provided</p>
            )
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">GitHub</label>
          {editMode.social ? (
            <input
              type="url"
              value={editedData.github || ''}
              onChange={(e) => handleInputChange('github', e.target.value)}
              placeholder="https://github.com/yourusername"
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          ) : (
            profile.github ? (
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline break-all">
                {profile.github}
              </a>
            ) : (
              <p className="text-gray-500">Not provided</p>
            )
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Portfolio</label>
          {editMode.social ? (
            <input
              type="url"
              value={editedData.portfolio || ''}
              onChange={(e) => handleInputChange('portfolio', e.target.value)}
              placeholder="https://yourportfolio.com"
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          ) : (
            profile.portfolio ? (
              <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline break-all">
                {profile.portfolio}
              </a>
            ) : (
              <p className="text-gray-500">Not provided</p>
            )
          )}
        </div>
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Code className="h-6 w-6" />
          Skills ({profile.skills?.length || 0})
        </h2>
        {!editMode.skills ? (
          <button
            onClick={() => handleEdit('skills')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => handleCancel('skills')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500/20 text-gray-300 rounded-lg hover:bg-gray-500/30 transition-colors"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              onClick={() => handleSave('skills')}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>

      {editMode.skills ? (
        <div className="space-y-4">
          {(editedData.skills || []).map((skill, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={skill}
                onChange={(e) => handleArrayChange('skills', index, e.target.value)}
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={() => removeArrayItem('skills', index)}
                className="px-3 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addArrayItem('skills', '')}
            className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
          >
            + Add Skill
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {profile.skills && profile.skills.length > 0 ? (
            profile.skills.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full text-white text-sm font-medium"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-gray-500">No skills added</p>
          )}
        </div>
      )}
    </div>
  );

  const renderExperience = () => (
    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Briefcase className="h-6 w-6" />
          Work Experience ({profile.experience?.length || 0})
        </h2>
        {!editMode.experience ? (
          <button
            onClick={() => handleEdit('experience')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => handleCancel('experience')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500/20 text-gray-300 rounded-lg hover:bg-gray-500/30 transition-colors"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              onClick={() => handleSave('experience')}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>

      {editMode.experience ? (
        <div className="space-y-6">
          {(editedData.experience || []).map((exp, index) => (
            <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="text-white font-semibold">Experience {index + 1}</h4>
                <button
                  onClick={() => removeArrayItem('experience', index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Job Title"
                value={exp.title || ''}
                onChange={(e) => handleObjectArrayChange('experience', index, 'title', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="Company Name"
                value={exp.company || ''}
                onChange={(e) => handleObjectArrayChange('experience', index, 'company', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="Duration (e.g., Jan 2023 - Present)"
                value={exp.duration || ''}
                onChange={(e) => handleObjectArrayChange('experience', index, 'duration', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <textarea
                placeholder="Description"
                value={exp.description || ''}
                onChange={(e) => handleObjectArrayChange('experience', index, 'description', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          ))}
          <button
            onClick={() => addArrayItem('experience', { title: '', company: '', duration: '', description: '' })}
            className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
          >
            + Add Experience
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {profile.experience && profile.experience.length > 0 ? (
            profile.experience.map((exp, index) => (
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
            ))
          ) : (
            <p className="text-gray-500">No work experience added</p>
          )}
        </div>
      )}
    </div>
  );

  const renderEducation = () => (
    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <GraduationCap className="h-6 w-6" />
          Education ({profile.education?.length || 0})
        </h2>
        {!editMode.education ? (
          <button
            onClick={() => handleEdit('education')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => handleCancel('education')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500/20 text-gray-300 rounded-lg hover:bg-gray-500/30 transition-colors"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              onClick={() => handleSave('education')}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>

      {editMode.education ? (
        <div className="space-y-6">
          {(editedData.education || []).map((edu, index) => (
            <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="text-white font-semibold">Education {index + 1}</h4>
                <button
                  onClick={() => removeArrayItem('education', index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Degree (e.g., B.Tech in Computer Science)"
                value={edu.degree || ''}
                onChange={(e) => handleObjectArrayChange('education', index, 'degree', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="Institution Name"
                value={edu.institution || ''}
                onChange={(e) => handleObjectArrayChange('education', index, 'institution', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="Year (e.g., 2020-2024)"
                value={edu.year || ''}
                onChange={(e) => handleObjectArrayChange('education', index, 'year', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="Grade/GPA"
                value={edu.grade || ''}
                onChange={(e) => handleObjectArrayChange('education', index, 'grade', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          ))}
          <button
            onClick={() => addArrayItem('education', { degree: '', institution: '', year: '', grade: '' })}
            className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
          >
            + Add Education
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {profile.education && profile.education.length > 0 ? (
            profile.education.map((edu, index) => (
              <div key={index} className="border-l-2 border-green-500 pl-4">
                <h4 className="text-white font-semibold">{edu.degree}</h4>
                <p className="text-green-400 text-sm">{edu.institution}</p>
                <div className="flex items-center gap-4 mt-1">
                  {edu.year && <p className="text-gray-400 text-xs">{edu.year}</p>}
                  {edu.grade && <p className="text-gray-400 text-xs">Grade: {edu.grade}</p>}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No education added</p>
          )}
        </div>
      )}
    </div>
  );

  const renderProjects = () => (
    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Rocket className="h-6 w-6" />
          Projects ({profile.projects?.length || 0})
        </h2>
        {!editMode.projects ? (
          <button
            onClick={() => handleEdit('projects')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => handleCancel('projects')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500/20 text-gray-300 rounded-lg hover:bg-gray-500/30 transition-colors"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              onClick={() => handleSave('projects')}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>

      {editMode.projects ? (
        <div className="space-y-6">
          {(editedData.projects || []).map((project, index) => (
            <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="text-white font-semibold">Project {index + 1}</h4>
                <button
                  onClick={() => removeArrayItem('projects', index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Project Name"
                value={project.name || ''}
                onChange={(e) => handleObjectArrayChange('projects', index, 'name', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <textarea
                placeholder="Description"
                value={project.description || ''}
                onChange={(e) => handleObjectArrayChange('projects', index, 'description', e.target.value)}
                rows={2}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="url"
                placeholder="Project Link"
                value={project.link || ''}
                onChange={(e) => handleObjectArrayChange('projects', index, 'link', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="Technologies (comma separated)"
                value={Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies || ''}
                onChange={(e) => handleObjectArrayChange('projects', index, 'technologies', e.target.value.split(',').map(t => t.trim()))}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          ))}
          <button
            onClick={() => addArrayItem('projects', { name: '', description: '', technologies: [], link: '' })}
            className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
          >
            + Add Project
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {profile.projects && profile.projects.length > 0 ? (
            profile.projects.map((project, index) => (
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
            ))
          ) : (
            <p className="text-gray-500">No projects added</p>
          )}
        </div>
      )}
    </div>
  );

  const renderAchievements = () => (
    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Star className="h-6 w-6" />
          Achievements ({profile.achievements?.length || 0})
        </h2>
        {!editMode.achievements ? (
          <button
            onClick={() => handleEdit('achievements')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => handleCancel('achievements')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500/20 text-gray-300 rounded-lg hover:bg-gray-500/30 transition-colors"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              onClick={() => handleSave('achievements')}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>

      {editMode.achievements ? (
        <div className="space-y-4">
          {(editedData.achievements || []).map((achievement, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={achievement}
                onChange={(e) => handleArrayChange('achievements', index, e.target.value)}
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={() => removeArrayItem('achievements', index)}
                className="px-3 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addArrayItem('achievements', '')}
            className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
          >
            + Add Achievement
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {profile.achievements && profile.achievements.length > 0 ? (
            profile.achievements.map((achievement, index) => (
              <div key={index} className="flex items-start space-x-2 text-gray-300">
                <span className="text-yellow-400 mt-1">★</span>
                <span className="text-sm">{achievement}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No achievements added</p>
          )}
        </div>
      )}
    </div>
  );

  const renderCertifications = () => (
    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Award className="h-6 w-6" />
          Certifications ({profile.certifications?.length || 0})
        </h2>
        {!editMode.certifications ? (
          <button
            onClick={() => handleEdit('certifications')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => handleCancel('certifications')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500/20 text-gray-300 rounded-lg hover:bg-gray-500/30 transition-colors"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              onClick={() => handleSave('certifications')}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>

      {editMode.certifications ? (
        <div className="space-y-4">
          {(editedData.certifications || []).map((cert, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={cert}
                onChange={(e) => handleArrayChange('certifications', index, e.target.value)}
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={() => removeArrayItem('certifications', index)}
                className="px-3 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addArrayItem('certifications', '')}
            className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
          >
            + Add Certification
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {profile.certifications && profile.certifications.length > 0 ? (
            profile.certifications.map((cert, index) => (
              <div key={index} className="flex items-center space-x-2 text-gray-300">
                <span className="text-green-400">✓</span>
                <span className="text-sm">{cert}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No certifications added</p>
          )}
        </div>
      )}
    </div>
  );

  const renderAdditional = () => (
    <div className="space-y-6">
      {/* Languages */}
      {profile.languages && profile.languages.length > 0 && (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Languages
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.languages.map((lang, index) => (
              <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full">
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Publications */}
      {profile.publications && profile.publications.length > 0 && (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Publications
          </h3>
          <div className="space-y-3">
            {profile.publications.map((pub, index) => (
              <div key={index} className="border-l-2 border-pink-500 pl-4">
                <h4 className="text-white font-semibold text-sm">{pub.title}</h4>
                <p className="text-pink-400 text-xs">{pub.venue}</p>
                {pub.year && <p className="text-gray-400 text-xs">{pub.year}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Volunteer Work */}
      {profile.volunteer && profile.volunteer.length > 0 && (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Volunteer Experience
          </h3>
          <div className="space-y-3">
            {profile.volunteer.map((vol, index) => (
              <div key={index}>
                <h4 className="text-white font-semibold text-sm">{vol.role}</h4>
                <p className="text-gray-400 text-xs">{vol.organization}</p>
                {vol.duration && <p className="text-gray-500 text-xs">{vol.duration}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {!profile.languages?.length && !profile.publications?.length && !profile.volunteer?.length && (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center">
          <p className="text-gray-500">No additional information available</p>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'basic':
        return renderBasicInfo();
      case 'social':
        return renderSocialLinks();
      case 'skills':
        return renderSkills();
      case 'experience':
        return renderExperience();
      case 'education':
        return renderEducation();
      case 'projects':
        return renderProjects();
      case 'achievements':
        return renderAchievements();
      case 'certifications':
        return renderCertifications();
      case 'additional':
        return renderAdditional();
      default:
        return <div className="text-white">Coming soon...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
            <p className="text-gray-300">Manage your professional information</p>
          </div>
          <button
            onClick={() => navigate('/upload-resume')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:scale-105 transition-all shadow-lg shadow-purple-500/50"
          >
            <Briefcase className="h-5 w-5" />
            Upload Resume
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-2 text-green-300 animate-fade-in">
            <Check className="h-5 w-5" />
            {successMessage}
          </div>
        )}

        {/* Info Message */}
        {infoMessage && (
          <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center gap-2 text-blue-300 animate-fade-in">
            <AlertCircle className="h-5 w-5" />
            {infoMessage}
          </div>
        )}

        {/* Tabs - Stylish with no scrollbar */}
        <div className="mb-6 relative">
          {/* Gradient fade on edges */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />
          
          <div 
            className="flex gap-2 overflow-x-auto pb-2 px-1"
            style={{
              scrollbarWidth: 'none', /* Firefox */
              msOverflowStyle: 'none', /* IE and Edge */
            }}
          >
            <style>{`
              .flex.gap-2.overflow-x-auto::-webkit-scrollbar {
                display: none; /* Chrome, Safari, Opera */
              }
            `}</style>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50 scale-105'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:scale-105 border border-white/10'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Scroll indicator dots */}
          <div className="flex justify-center gap-1 mt-3">
            {tabs.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all ${
                  tabs[index].id === activeTab
                    ? 'w-6 bg-purple-500'
                    : 'w-1 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content with animation */}
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Profile;
