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
  ArrowRight, Sparkles, Zap, Brain, PlayCircle, Download
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  // Mock data - replace with actual API calls
  const stats = [
    { 
      label: 'Interviews Completed', 
      value: '3', 
      change: '+2 this week',
      icon: CheckCircle, 
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    { 
      label: 'Average Score', 
      value: '85%', 
      change: '+5% improvement',
      icon: TrendingUp, 
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    { 
      label: 'Pending Reviews', 
      value: '1', 
      change: 'In progress',
      icon: Clock, 
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    { 
      label: 'Skills Assessed', 
      value: '12', 
      change: 'Across 3 domains',
      icon: Award, 
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
  ];

  const recentInterviews = [
    {
      id: 1,
      position: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      date: '2025-11-03',
      status: 'completed',
      score: 88,
      duration: '45 min'
    },
    {
      id: 2,
      position: 'Full Stack Engineer',
      company: 'StartupXYZ',
      date: '2025-11-01',
      status: 'completed',
      score: 82,
      duration: '38 min'
    },
    {
      id: 3,
      position: 'React Developer',
      company: 'Digital Solutions',
      date: '2025-10-28',
      status: 'pending',
      score: null,
      duration: '42 min'
    },
  ];

  const quickActions = [
    {
      title: 'Upload Resume',
      description: 'Update your resume for better matching',
      icon: Upload,
      color: 'from-blue-500 to-blue-600',
      action: () => navigate('/upload-resume')
    },
    {
      title: 'Practice Interview',
      description: 'Take a practice session to improve',
      icon: Video,
      color: 'from-purple-500 to-purple-600',
      action: () => navigate('/practice')
    },
    {
      title: 'View Reports',
      description: 'Check your performance analytics',
      icon: BarChart3,
      color: 'from-green-500 to-green-600',
      action: () => navigate('/reports')
    },
    {
      title: 'Skill Assessment',
      description: 'Test your technical skills',
      icon: Brain,
      color: 'from-orange-500 to-orange-600',
      action: () => navigate('/assessment')
    },
  ];

  const upcomingInterviews = [
    {
      id: 1,
      position: 'Backend Developer',
      company: 'CloudTech',
      date: '2025-11-08',
      time: '10:00 AM',
      type: 'Technical Round'
    },
    {
      id: 2,
      position: 'DevOps Engineer',
      company: 'InnovateLab',
      date: '2025-11-10',
      time: '2:30 PM',
      type: 'System Design'
    },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {greeting}, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {user?.displayName || user?.email?.split('@')[0] || 'there'}
                </span>! 👋
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                Ready to ace your next interview?
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/upload-resume')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
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
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className={`text-xs font-medium ${stat.textColor} flex items-center gap-1`}>
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
            className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Recent Interviews
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentInterviews.map((interview, index) => (
                  <motion.div
                    key={interview.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100 group cursor-pointer"
                    onClick={() => navigate(`/interview/${interview.id}`)}
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {interview.position}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{interview.company}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(interview.date).toLocaleDateString()}
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
                          <div className="text-2xl font-bold text-gray-900">{interview.score}</div>
                          <div className="text-xs text-gray-500">Score</div>
                        </div>
                      )}
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 ${getStatusBadge(interview.status)}`}>
                        {getStatusIcon(interview.status)}
                        {interview.status}
                      </span>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 text-center text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                View All Interviews →
              </button>
            </div>
          </motion.div>

          {/* Upcoming Interviews */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Upcoming
              </h2>
            </div>
            <div className="p-6">
              {upcomingInterviews.length > 0 ? (
                <div className="space-y-4">
                  {upcomingInterviews.map((interview, index) => (
                    <motion.div
                      key={interview.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                            {interview.position}
                          </h3>
                          <p className="text-xs text-gray-600 mb-2">{interview.company}</p>
                        </div>
                        <PlayCircle className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-700 font-medium mb-2">
                        <Calendar className="h-3 w-3 text-blue-600" />
                        {new Date(interview.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        <span className="text-gray-400">•</span>
                        <Clock className="h-3 w-3 text-blue-600" />
                        {interview.time}
                      </div>
                      <span className="inline-block px-2 py-1 bg-white text-xs font-medium text-blue-600 rounded-md border border-blue-200">
                        {interview.type}
                      </span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No upcoming interviews</p>
                </div>
              )}
              <button className="w-full mt-6 py-3 text-center text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors">
                Schedule New Interview
              </button>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-600" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={action.action}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 group"
              >
                <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} w-fit mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                <div className="flex items-center text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
                  Get Started
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl"
        >
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Sparkles className="h-6 w-6" />
                Your Interview Journey
              </h3>
              <p className="text-blue-100 mb-4">Keep improving and reach your goals!</p>
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <div className="text-3xl font-bold">3</div>
                  <div className="text-blue-100">Completed</div>
                </div>
                <div className="h-12 w-px bg-blue-400"></div>
                <div>
                  <div className="text-3xl font-bold">2</div>
                  <div className="text-blue-100">Scheduled</div>
                </div>
                <div className="h-12 w-px bg-blue-400"></div>
                <div>
                  <div className="text-3xl font-bold">85%</div>
                  <div className="text-blue-100">Avg Score</div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <Download className="h-5 w-5" />
                Download Report
              </motion.button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Dashboard;
