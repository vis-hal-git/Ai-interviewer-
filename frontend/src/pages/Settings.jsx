import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Bell, Lock, Globe, Moon, Sun, Monitor,
  Shield, Eye, EyeOff, Check, AlertCircle, Save, Trash2,
  LogOut, Smartphone, Database, Download, Upload, RefreshCw,
  Zap, Sparkles, Volume2, VolumeX, Camera, Mic, Video,
  CheckCircle, X, ChevronRight, Key, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Active tab state
  const [activeTab, setActiveTab] = useState('account');
  
  // Account Settings
  const [accountData, setAccountData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    photoURL: user?.photoURL || ''
  });
  
  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    interviewReminders: true,
    resultNotifications: true,
    weeklyReports: false,
    marketingEmails: false,
    browserNotifications: true,
    soundEnabled: true
  });
  
  // Privacy Settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'private',
    showEmail: false,
    showPhone: false,
    dataSharing: false,
    analyticsTracking: true
  });
  
  // Appearance Settings
  const [appearance, setAppearance] = useState({
    theme: localStorage.getItem('theme') || 'system',
    fontSize: localStorage.getItem('fontSize') || 'medium',
    reduceAnimations: false,
    highContrast: false
  });
  
  // Interview Settings
  const [interviewSettings, setInterviewSettings] = useState({
    autoStartVideo: true,
    autoStartAudio: true,
    showSubtitles: true,
    questionTimerEnabled: true,
    defaultJobRole: 'Software Engineer'
  });
  
  // State management
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const tabs = [
    { id: 'account', label: 'Account', icon: User, description: 'Manage your account details' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Configure notification preferences' },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield, description: 'Control your privacy settings' },
    { id: 'appearance', label: 'Appearance', icon: Monitor, description: 'Customize your experience' },
    { id: 'interview', label: 'Interview Settings', icon: Video, description: 'Configure interview preferences' },
    { id: 'data', label: 'Data & Storage', icon: Database, description: 'Manage your data' }
  ];

  // Show success message temporarily
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  // Save handlers
  const handleSaveAccount = async () => {
    setSaving(true);
    try {
      // TODO: Implement API call to update account
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess('Account details updated successfully!');
    } catch (error) {
      showError('Failed to update account details');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      localStorage.setItem('notifications', JSON.stringify(notifications));
      await new Promise(resolve => setTimeout(resolve, 500));
      showSuccess('Notification preferences saved!');
    } catch (error) {
      showError('Failed to save notification preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePrivacy = async () => {
    setSaving(true);
    try {
      localStorage.setItem('privacy', JSON.stringify(privacy));
      await new Promise(resolve => setTimeout(resolve, 500));
      showSuccess('Privacy settings updated!');
    } catch (error) {
      showError('Failed to update privacy settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAppearance = async () => {
    setSaving(true);
    try {
      localStorage.setItem('theme', appearance.theme);
      localStorage.setItem('fontSize', appearance.fontSize);
      localStorage.setItem('appearance', JSON.stringify(appearance));
      await new Promise(resolve => setTimeout(resolve, 500));
      showSuccess('Appearance settings saved!');
    } catch (error) {
      showError('Failed to save appearance settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveInterview = async () => {
    setSaving(true);
    try {
      localStorage.setItem('interviewSettings', JSON.stringify(interviewSettings));
      await new Promise(resolve => setTimeout(resolve, 500));
      showSuccess('Interview settings saved!');
    } catch (error) {
      showError('Failed to save interview settings');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('Passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      showError('Password must be at least 8 characters long');
      return;
    }
    
    setSaving(true);
    try {
      // TODO: Implement password change API
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess('Password changed successfully!');
      setShowPasswordChange(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      showError('Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setSaving(true);
    try {
      // TODO: Implement account deletion API
      await new Promise(resolve => setTimeout(resolve, 1000));
      await logout();
      navigate('/');
    } catch (error) {
      showError('Failed to delete account');
      setSaving(false);
    }
  };

  const handleExportData = () => {
    // Create a JSON file with user data
    const data = {
      account: accountData,
      notifications,
      privacy,
      appearance,
      interviewSettings,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-recruiter-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showSuccess('Data exported successfully!');
  };

  // Render functions for each tab
  const renderAccountSettings = () => (
    <div className="space-y-6">
      {/* Profile Picture */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Information
        </h3>
        
        <div className="flex items-center gap-6 mb-6">
          <div className="relative group">
            <img
              src={accountData.photoURL || 'https://via.placeholder.com/100'}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-purple-500/50"
            />
            <button className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-400 mb-2">Profile Photo</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors text-sm">
                Upload New
              </button>
              <button className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-sm">
                Remove
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Display Name</label>
            <input
              type="text"
              value={accountData.displayName}
              onChange={(e) => setAccountData({ ...accountData, displayName: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
            <input
              type="email"
              value={accountData.email}
              onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="your.email@example.com"
            />
          </div>

          <button
            onClick={handleSaveAccount}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:scale-105 transition-all shadow-lg shadow-purple-500/50 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Password Change */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Password & Security
        </h3>

        {!showPasswordChange ? (
          <div>
            <p className="text-gray-300 mb-4">Keep your account secure by using a strong password</p>
            <button
              onClick={() => setShowPasswordChange(true)}
              className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
            >
              Change Password
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handlePasswordChange}
                disabled={saving}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:scale-105 transition-all disabled:opacity-50"
              >
                {saving ? 'Updating...' : 'Update Password'}
              </button>
              <button
                onClick={() => {
                  setShowPasswordChange(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="px-4 py-2 bg-gray-500/20 text-gray-300 rounded-lg hover:bg-gray-500/30 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Two-Factor Authentication
        </h3>
        <p className="text-gray-300 mb-4">Add an extra layer of security to your account</p>
        <button className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors">
          Enable 2FA
        </button>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Email Notifications
        </h3>
        
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive email updates about your account' },
            { key: 'interviewReminders', label: 'Interview Reminders', description: 'Get reminded about upcoming interviews' },
            { key: 'resultNotifications', label: 'Result Notifications', description: 'Receive notifications when interview results are ready' },
            { key: 'weeklyReports', label: 'Weekly Reports', description: 'Get weekly summaries of your interview performance' },
            { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive tips and updates about new features' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex-1">
                <p className="text-white font-medium">{item.label}</p>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  notifications[item.key] ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications[item.key] ? 'translate-x-7' : ''
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Push Notifications
        </h3>
        
        <div className="space-y-4">
          {[
            { key: 'browserNotifications', label: 'Browser Notifications', description: 'Show desktop notifications' },
            { key: 'soundEnabled', label: 'Sound Alerts', description: 'Play sound for notifications' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex-1">
                <p className="text-white font-medium">{item.label}</p>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  notifications[item.key] ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications[item.key] ? 'translate-x-7' : ''
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleSaveNotifications}
          disabled={saving}
          className="mt-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:scale-105 transition-all shadow-lg shadow-purple-500/50 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Profile Visibility
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Who can see your profile?</label>
            <select
              value={privacy.profileVisibility}
              onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="public" className="bg-slate-800">Public - Anyone can view</option>
              <option value="private" className="bg-slate-800">Private - Only you</option>
              <option value="recruiters" className="bg-slate-800">Recruiters Only</option>
            </select>
          </div>

          {[
            { key: 'showEmail', label: 'Show Email Address', description: 'Display your email on your public profile' },
            { key: 'showPhone', label: 'Show Phone Number', description: 'Display your phone number on your public profile' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex-1">
                <p className="text-white font-medium">{item.label}</p>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
              <button
                onClick={() => setPrivacy({ ...privacy, [item.key]: !privacy[item.key] })}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  privacy[item.key] ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    privacy[item.key] ? 'translate-x-7' : ''
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data & Analytics
        </h3>
        
        <div className="space-y-4">
          {[
            { key: 'dataSharing', label: 'Data Sharing', description: 'Share anonymized data to improve our services' },
            { key: 'analyticsTracking', label: 'Analytics Tracking', description: 'Help us improve by tracking usage patterns' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex-1">
                <p className="text-white font-medium">{item.label}</p>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
              <button
                onClick={() => setPrivacy({ ...privacy, [item.key]: !privacy[item.key] })}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  privacy[item.key] ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    privacy[item.key] ? 'translate-x-7' : ''
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleSavePrivacy}
          disabled={saving}
          className="mt-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:scale-105 transition-all shadow-lg shadow-purple-500/50 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          Theme
        </h3>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { value: 'light', label: 'Light', icon: Sun },
            { value: 'dark', label: 'Dark', icon: Moon },
            { value: 'system', label: 'System', icon: Monitor }
          ].map((theme) => {
            const Icon = theme.icon;
            return (
              <button
                key={theme.value}
                onClick={() => setAppearance({ ...appearance, theme: theme.value })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  appearance.theme === theme.value
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <Icon className="h-8 w-8 text-white mx-auto mb-2" />
                <p className="text-white font-medium">{theme.label}</p>
              </button>
            );
          })}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Font Size</label>
          <select
            value={appearance.fontSize}
            onChange={(e) => setAppearance({ ...appearance, fontSize: e.target.value })}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="small" className="bg-slate-800">Small</option>
            <option value="medium" className="bg-slate-800">Medium (Default)</option>
            <option value="large" className="bg-slate-800">Large</option>
          </select>
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Accessibility
        </h3>
        
        <div className="space-y-4">
          {[
            { key: 'reduceAnimations', label: 'Reduce Animations', description: 'Minimize motion effects for better focus' },
            { key: 'highContrast', label: 'High Contrast', description: 'Increase contrast for better visibility' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex-1">
                <p className="text-white font-medium">{item.label}</p>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
              <button
                onClick={() => setAppearance({ ...appearance, [item.key]: !appearance[item.key] })}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  appearance[item.key] ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    appearance[item.key] ? 'translate-x-7' : ''
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleSaveAppearance}
          disabled={saving}
          className="mt-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:scale-105 transition-all shadow-lg shadow-purple-500/50 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );

  const renderInterviewSettings = () => (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Video className="h-5 w-5" />
          Interview Preferences
        </h3>
        
        <div className="space-y-4">
          {[
            { key: 'autoStartVideo', label: 'Auto-Start Video', description: 'Automatically start video when joining interview', icon: Camera },
            { key: 'autoStartAudio', label: 'Auto-Start Audio', description: 'Automatically enable microphone', icon: Mic },
            { key: 'showSubtitles', label: 'Show Subtitles', description: 'Display real-time subtitles during interview', icon: Globe },
            { key: 'questionTimerEnabled', label: 'Question Timer', description: 'Show timer for each question', icon: Clock }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3 flex-1">
                  <Icon className="h-5 w-5 text-purple-400" />
                  <div>
                    <p className="text-white font-medium">{item.label}</p>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setInterviewSettings({ ...interviewSettings, [item.key]: !interviewSettings[item.key] })}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    interviewSettings[item.key] ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      interviewSettings[item.key] ? 'translate-x-7' : ''
                    }`}
                  />
                </button>
              </div>
            );
          })}

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Default Job Role</label>
            <select
              value={interviewSettings.defaultJobRole}
              onChange={(e) => setInterviewSettings({ ...interviewSettings, defaultJobRole: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Software Engineer" className="bg-slate-800">Software Engineer</option>
              <option value="Data Scientist" className="bg-slate-800">Data Scientist</option>
              <option value="DevOps Engineer" className="bg-slate-800">DevOps Engineer</option>
              <option value="Frontend Developer" className="bg-slate-800">Frontend Developer</option>
              <option value="Backend Developer" className="bg-slate-800">Backend Developer</option>
              <option value="Full Stack Developer" className="bg-slate-800">Full Stack Developer</option>
              <option value="ML Engineer" className="bg-slate-800">ML Engineer</option>
              <option value="Product Manager" className="bg-slate-800">Product Manager</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSaveInterview}
          disabled={saving}
          className="mt-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:scale-105 transition-all shadow-lg shadow-purple-500/50 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );

  const renderDataSettings = () => (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Your Data
        </h3>
        <p className="text-gray-300 mb-4">Download a copy of your data including profile, interview history, and settings</p>
        <button
          onClick={handleExportData}
          className="flex items-center gap-2 px-6 py-3 bg-blue-500/20 text-blue-300 rounded-lg font-semibold hover:bg-blue-500/30 transition-all"
        >
          <Download className="h-4 w-4" />
          Export Data
        </button>
      </div>

      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Clear Cache
        </h3>
        <p className="text-gray-300 mb-4">Clear cached data to free up space and improve performance</p>
        <button
          onClick={() => {
            localStorage.clear();
            showSuccess('Cache cleared successfully!');
          }}
          className="flex items-center gap-2 px-6 py-3 bg-yellow-500/20 text-yellow-300 rounded-lg font-semibold hover:bg-yellow-500/30 transition-all"
        >
          <RefreshCw className="h-4 w-4" />
          Clear Cache
        </button>
      </div>

      <div className="bg-red-500/10 rounded-2xl p-6 border border-red-500/30">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          Danger Zone
        </h3>
        <p className="text-gray-300 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-red-500/20 text-red-300 rounded-lg font-semibold hover:bg-red-500/30 transition-all"
        >
          <Trash2 className="h-4 w-4" />
          Delete Account
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return renderAccountSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'interview':
        return renderInterviewSettings();
      case 'data':
        return renderDataSettings();
      default:
        return <div className="text-white">Coming soon...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-8 px-4">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-300">Manage your account preferences and application settings</p>
        </div>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-2 text-green-300"
            >
              <CheckCircle className="h-5 w-5" />
              {successMessage}
            </motion.div>
          )}

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-300"
            >
              <AlertCircle className="h-5 w-5" />
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Sidebar Tabs */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10 sticky top-24">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                          : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <div className="text-left flex-1">
                        <p className="font-semibold">{tab.label}</p>
                        {activeTab !== tab.id && (
                          <p className="text-xs text-gray-400">{tab.description}</p>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full border border-red-500/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Delete Account</h3>
              </div>
              
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete your account? This action cannot be undone. All your data, including interview history and profile information, will be permanently deleted.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Deleting...' : 'Yes, Delete My Account'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animation Styles */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
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

export default Settings;
