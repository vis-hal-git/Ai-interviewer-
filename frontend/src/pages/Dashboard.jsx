/**
 * Candidate Dashboard Page - Modern & Beautiful Design
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Upload, Calendar, Clock, CheckCircle, XCircle, AlertCircle,
  TrendingUp, Award, Target, FileText, Video, BarChart3,
  ArrowRight, Sparkles, Zap, Brain, PlayCircle, Download, Loader
} from 'lucide-react';
import { interviewAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
    
    // Fetch dashboard data
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await interviewAPI.getUserStats();
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Build stats array from fetched data
  const getStats = () => {
    if (!dashboardData) return [];
    
    const { stats } = dashboardData;
    
    return [
      { 
        label: 'Interviews Completed', 
        value: stats.completed_interviews || '0', 
        change: stats.total_interviews > 0 ? `${stats.total_interviews} total` : 'Start your first',
        icon: CheckCircle, 
        color: 'from-green-500 to-emerald-500',
        bgColor: 'bg-green-50',
        textColor: 'text-green-600'
      },
      { 
        label: 'Average Score', 
        value: stats.average_score ? `${stats.average_score}%` : 'N/A', 
        change: stats.completed_interviews > 0 ? 'Keep it up!' : 'Complete interviews',
        icon: TrendingUp, 
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600'
      },
      { 
        label: 'Pending Reviews', 
        value: stats.pending_interviews || '0', 
        change: stats.pending_interviews > 0 ? 'In progress' : 'All clear',
        icon: Clock, 
        color: 'from-yellow-500 to-orange-500',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-600'
      },
      { 
        label: 'Skills Assessed', 
        value: stats.skills_assessed || '0', 
        change: stats.skills_assessed > 0 ? 'Growing portfolio' : 'Start practicing',
        icon: Award, 
        color: 'from-purple-500 to-pink-500',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-600'
      },
    ];
  };

  const getRecentInterviews = () => {
    if (!dashboardData || !dashboardData.recent_interviews) return [];
    return dashboardData.recent_interviews.map(interview => ({
      id: interview.session_id || interview.id,
      position: interview.position,
      company: 'AI Recruiter Pro',
      date: interview.date,
      status: interview.status,
      score: interview.score,
      duration: interview.duration ? `${Math.floor(interview.duration / 60)} min` : 'N/A'
    }));
  };

  const quickActions = [
    {
      title: 'Upload Resume',
      description: 'Update your resume for better matching',
      icon: Upload,
      color: 'from-blue-500 to-blue-600',
      action: () => navigate('/upload-resume')
    },
    {
      title: 'Start Interview',
      description: 'Begin a new practice interview',
      icon: Video,
      color: 'from-purple-500 to-purple-600',
      action: () => navigate('/upload-resume')
    },
    {
      title: 'View Profile',
      description: 'Check and update your profile',
      icon: BarChart3,
      color: 'from-green-500 to-green-600',
      action: () => navigate('/profile')
    },
    {
      title: 'Past Interviews',
      description: 'Review your interview history',
      icon: Brain,
      color: 'from-orange-500 to-orange-600',
      action: () => {}
    },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-500/20 text-green-300 border-green-500/30',
      pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      in_progress: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      scheduled: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      cancelled: 'bg-red-500/20 text-red-300 border-red-500/30'
    };
    return styles[status] || styles.pending;
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = getStats();
  const recentInterviews = getRecentInterviews();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 relative z-10">
        
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {greeting}, <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {user?.displayName || user?.email?.split('@')[0] || 'there'}
                </span>! 👋
              </h1>
              <p className="text-gray-300 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                Ready to ace your next interview?
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/upload-resume')}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
              <Zap className="h-5 w-5" />
              Start New Interview
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-white/20"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-gray-300 text-sm font-medium mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-xs font-medium text-gray-400 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {stat.change}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          
          {/* Recent Interviews */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 overflow-hidden"
          >
            <div className="p-6 border-b border-white/20">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-400" />
                Recent Interviews
              </h2>
            </div>
            <div className="p-6">
              {recentInterviews.length > 0 ? (
                <div className="space-y-4">
                  {recentInterviews.map((interview, index) => (
                    <motion.div
                      key={interview.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-white/10 transition-colors border border-white/10 group cursor-pointer"
                      onClick={() => navigate(`/interview/complete/${interview.id}`)}
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1 group-hover:text-purple-400 transition-colors">
                          {interview.position}
                        </h3>
                        <p className="text-sm text-gray-300 mb-2">{interview.company}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {interview.date ? new Date(interview.date).toLocaleDateString() : 'N/A'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {interview.duration}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {interview.score && (
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">{interview.score}</div>
                            <div className="text-xs text-gray-400">Score</div>
                          </div>
                        )}
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 ${getStatusBadge(interview.status)}`}>
                          {getStatusIcon(interview.status)}
                          {interview.status}
                        </span>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-sm text-gray-300">No interviews yet. Start your first one!</p>
                </div>
              )}
              <button 
                onClick={() => navigate('/upload-resume')}
                className="w-full mt-6 py-3 text-center text-sm font-medium text-purple-400 hover:text-purple-300 hover:bg-white/5 rounded-lg transition-colors"
              >
                Start New Interview →
              </button>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 overflow-hidden"
          >
            <div className="p-6 border-b border-white/20">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-pink-400" />
                Quick Actions
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={action.action}
                    className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color}`}>
                        <action.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-sm mb-0.5">
                          {action.title}
                        </h3>
                        <p className="text-xs text-gray-400">{action.description}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 rounded-2xl p-8 text-white shadow-2xl"
        >
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Sparkles className="h-6 w-6" />
                Your Interview Journey
              </h3>
              <p className="text-purple-100 mb-4">Keep improving and reach your goals!</p>
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <div className="text-3xl font-bold">{dashboardData?.stats.completed_interviews || 0}</div>
                  <div className="text-purple-100">Completed</div>
                </div>
                <div className="h-12 w-px bg-purple-300"></div>
                <div>
                  <div className="text-3xl font-bold">{dashboardData?.stats.pending_interviews || 0}</div>
                  <div className="text-purple-100">Pending</div>
                </div>
                <div className="h-12 w-px bg-purple-300"></div>
                <div>
                  <div className="text-3xl font-bold">{dashboardData?.stats.average_score || 0}%</div>
                  <div className="text-purple-100">Avg Score</div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/upload-resume')}
                className="px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <Zap className="h-5 w-5" />
                Start Interview
              </motion.button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Dashboard;
