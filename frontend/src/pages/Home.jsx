/**
 * Home/Landing Page - Enhanced with Modern Design
 */
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { 
  Rocket, Sparkles, Play, Bot, Eye as EyeIcon, BarChart3, Briefcase, Mic, FileText, Shield, TrendingUp,
  CheckCircle, Star, Users, Zap, Clock, Globe, Award, Target, ArrowRight, Quote, ChevronRight,
  Brain, LineChart, Video, MessageSquare, Lock, Smartphone, Upload, Calendar, Activity, FileCheck,
  UserCheck, LogIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (!loading && user) {
      // Redirect based on user role
      if (user.role === 'recruiter') {
        navigate('/recruiter', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block h-16 w-16 rounded-full border-4 border-solid border-blue-600 border-r-transparent"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-lg text-gray-700 font-medium"
          >
            Loading your experience...
          </motion.p>
        </div>
      </div>
    );
  }

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "HR Director at TechCorp",
      image: "SJ",
      content: "AI Recruiter Pro reduced our screening time by 75%. The quality of candidates improved dramatically!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Talent Acquisition Lead",
      image: "MC",
      content: "The AI insights are incredibly accurate. It's like having an expert interviewer available 24/7.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Startup Founder",
      image: "ER",
      content: "As a small team, this tool was a game-changer. We scaled our hiring without compromising quality.",
      rating: 5
    }
  ];

  const trustedCompanies = ["Google", "Microsoft", "Amazon", "Meta", "Netflix", "Apple"];

  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-x-hidden">
      
      {/* Hero Section - Enhanced */}
      <motion.section 
        className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 -left-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 20, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 -right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -50, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 15, repeat: Infinity }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/80 backdrop-blur-sm border border-blue-200 mb-6"
              >
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">AI-Powered Recruitment Revolution</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-5xl md:text-7xl font-black leading-tight mb-6"
              >
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Transform
                </span>
                <br />
                Your Hiring
                <br />
                Process
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xl text-gray-700 mb-8 leading-relaxed"
              >
                Conduct intelligent AI interviews with real-time monitoring, 
                instant feedback, and comprehensive reports. 
                <span className="font-semibold text-blue-600"> Save 80% of screening time</span> while improving candidate quality.
              </motion.p>

              {/* Stats Pills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-3 mb-8"
              >
                {[
                  { icon: Users, text: "10,000+ Interviews", color: "blue" },
                  { icon: Star, text: "4.9/5 Rating", color: "yellow" },
                  { icon: Globe, text: "50+ Countries", color: "green" }
                ].map((item, index) => (
                  <motion.div
                    key={item.text}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md border border-${item.color}-100`}
                  >
                    <item.icon className={`h-4 w-4 text-${item.color}-600`} />
                    <span className="text-sm font-semibold text-gray-700">{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/signup')}
                  className="group px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Rocket className="h-5 w-5 group-hover:animate-bounce" />
                  Start Free Trial
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 rounded-xl border-2 border-gray-300 bg-white/80 backdrop-blur-sm text-gray-900 font-bold hover:bg-white hover:border-blue-500 hover:text-blue-600 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Play className="h-5 w-5" />
                  Watch Demo
                </motion.button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 text-sm text-gray-600 flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4 text-green-600" />
                No credit card required • 14-day free trial • Cancel anytime
              </motion.p>
            </motion.div>

            {/* Right Visual - Enhanced Dashboard Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              {/* Main Dashboard Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="relative rounded-2xl bg-white shadow-2xl border border-gray-200 p-6 overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">AI Interview Dashboard</h3>
                      <p className="text-sm text-gray-600">Live Interview in Progress</p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="h-3 w-3 rounded-full bg-green-500"
                  />
                </div>

                {/* Mock Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { label: "Score", value: "92%", color: "green" },
                    { label: "Time", value: "12:34", color: "blue" },
                    { label: "Questions", value: "8/10", color: "purple" }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className={`p-3 rounded-lg bg-${stat.color}-50 border border-${stat.color}-100`}
                    >
                      <div className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</div>
                      <div className="text-xs text-gray-600">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Mock Chart */}
                <div className="space-y-3">
                  {[85, 70, 95, 60].map((width, index) => (
                    <motion.div
                      key={index}
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                      className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                    />
                  ))}
                </div>
              </motion.div>

              {/* Floating Stats Cards */}
              <motion.div
                animate={{ y: [0, 15, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -top-6 -right-6 px-4 py-3 rounded-xl bg-white shadow-xl border border-gray-200"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="text-sm font-bold text-gray-900">95% Accuracy</div>
                    <div className="text-xs text-gray-600">AI Analysis</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, -2, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 px-4 py-3 rounded-xl bg-white shadow-xl border border-gray-200"
              >
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <div>
                    <div className="text-sm font-bold text-gray-900">80% Faster</div>
                    <div className="text-xs text-gray-600">Screening Time</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>

        {/* Trusted By Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="relative pb-16"
        >
          <p className="text-center text-sm font-semibold text-gray-600 mb-8">
            TRUSTED BY LEADING COMPANIES WORLDWIDE
          </p>
          <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center items-center gap-12 opacity-60">
            {trustedCompanies.map((company, index) => (
              <motion.div
                key={company}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ opacity: 1, scale: 1.1 }}
                className="text-2xl font-bold text-gray-700"
              >
                {company}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section - Enhanced */}
      <motion.section 
        id="features" 
        className="py-24 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 mb-6"
            >
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">Powerful Features</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black text-gray-900 mb-4"
            >
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Hire Smarter
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              AI-powered tools that transform your recruitment process from start to finish
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                Icon: Brain, 
                title: 'AI Interview Engine', 
                desc: 'Adaptive questions that evolve based on candidate responses for deeper insights.',
                color: 'from-blue-500 to-cyan-500',
                bgColor: 'bg-blue-50'
              },
              { 
                Icon: Video, 
                title: 'Real-time Monitoring', 
                desc: 'Advanced face detection, gaze tracking, and behavioral analysis for interview integrity.',
                color: 'from-purple-500 to-pink-500',
                bgColor: 'bg-purple-50'
              },
              { 
                Icon: LineChart, 
                title: 'Instant Reports', 
                desc: 'Comprehensive, shareable reports with AI-generated insights and recommendations.',
                color: 'from-green-500 to-emerald-500',
                bgColor: 'bg-green-50'
              },
              { 
                Icon: BarChart3, 
                title: 'Recruiter Dashboard', 
                desc: 'Powerful analytics, filtering, and bulk actions in one intuitive interface.',
                color: 'from-orange-500 to-red-500',
                bgColor: 'bg-orange-50'
              },
              { 
                Icon: MessageSquare, 
                title: 'Voice Analysis', 
                desc: 'High-accuracy speech-to-text with sentiment and communication pattern analysis.',
                color: 'from-indigo-500 to-blue-500',
                bgColor: 'bg-indigo-50'
              },
              { 
                Icon: FileText, 
                title: 'Smart Resume Parser', 
                desc: 'Automatically extract and structure skills, experience, and qualifications.',
                color: 'from-pink-500 to-rose-500',
                bgColor: 'bg-pink-50'
              },
              { 
                Icon: Lock, 
                title: 'Enterprise Security', 
                desc: 'Bank-level encryption with RBAC, SOC 2 compliance, and secure data handling.',
                color: 'from-gray-600 to-gray-800',
                bgColor: 'bg-gray-50'
              },
              { 
                Icon: TrendingUp, 
                title: 'Advanced Analytics', 
                desc: 'Visualize hiring metrics, track performance, and optimize your recruitment funnel.',
                color: 'from-yellow-500 to-amber-500',
                bgColor: 'bg-yellow-50'
              },
            ].map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative rounded-2xl bg-white p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300"
              >
                <div className={`absolute inset-0 ${feature.bgColor} opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300`} />
                <div className="relative z-10">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="mt-4 flex items-center text-blue-600 text-sm font-semibold"
                  >
                    Learn more <ChevronRight className="h-4 w-4 ml-1" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How it works */}
      <motion.section 
        id="how-it-works" 
        className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-200/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              How It Works
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              From resume upload to comprehensive report in five simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-6 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300" style={{ width: 'calc(100% - 120px)', left: '60px' }} />

            {[
              { 
                step: 'Upload Resume', 
                icon: Upload, 
                color: 'from-blue-500 to-blue-600',
                desc: 'Upload candidate resumes seamlessly through our intuitive platform'
              },
              { 
                step: 'Schedule Interview', 
                icon: Calendar, 
                color: 'from-purple-500 to-purple-600',
                desc: 'Pick convenient time slots for AI-powered interview sessions'
              },
              { 
                step: 'AI Conducts Interview', 
                icon: Video, 
                color: 'from-pink-500 to-pink-600',
                desc: 'Our AI asks tailored questions and evaluates responses in real-time'
              },
              { 
                step: 'Real-time Monitoring', 
                icon: Activity, 
                color: 'from-indigo-500 to-indigo-600',
                desc: 'Track interview progress with live sentiment and engagement metrics'
              },
              { 
                step: 'Get Report', 
                icon: FileCheck, 
                color: 'from-orange-500 to-orange-600',
                desc: 'Receive detailed analytical reports with actionable insights instantly'
              }
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full">
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 left-6 w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg z-10">
                    {i + 1}
                  </div>

                  {/* Icon */}
                  <motion.div 
                    className={`w-16 h-16 mx-auto mb-4 mt-2 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <item.icon className="h-8 w-8 text-white" />
                  </motion.div>

                  {/* Title */}
                  <h4 className="text-lg font-bold text-gray-900 mb-3 text-center">
                    {item.step}
                  </h4>

                  {/* Description */}
                  <p className="text-sm text-gray-600 text-center leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section 
        className="max-w-7xl mx-auto px-6 py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Trusted by Industry Leaders
          </h3>
          <p className="text-gray-600 text-lg">
            Real numbers, real impact on hiring efficiency
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { num: '10,000+', label: 'Interviews Conducted', icon: Users, color: 'from-blue-500 to-blue-600' },
            { num: '95%', label: 'Accuracy Rate', icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
            { num: '80%', label: 'Time Saved', icon: Clock, color: 'from-pink-500 to-pink-600' },
            { num: '4.9/5', label: 'Customer Rating', icon: Star, color: 'from-orange-500 to-orange-600' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.05 }}
              className="relative group"
            >
              <div className="rounded-2xl bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 text-center overflow-hidden">
                {/* Gradient Overlay on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Icon */}
                <motion.div 
                  className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <stat.icon className="h-7 w-7 text-white" />
                </motion.div>

                {/* Number */}
                <motion.div 
                  className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 + 0.2 }}
                >
                  {stat.num}
                </motion.div>

                {/* Label */}
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trusted Companies */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-500 text-sm font-semibold mb-8 uppercase tracking-wider">
            Trusted by Leading Companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            {trustedCompanies.map((company, i) => (
              <motion.div
                key={company}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 0.6, scale: 1 }}
                whileHover={{ opacity: 1, scale: 1.1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="text-2xl font-bold text-gray-400"
              >
                {company}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.section>

      {/* Testimonials */}
      <motion.section 
        className="bg-gradient-to-br from-blue-50 via-purple-50/50 to-pink-50/50 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-300/20 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              What Our Users Say
            </h3>
            <p className="text-gray-600 text-lg">
              Real stories from recruiters and candidates
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote className="h-10 w-10 text-purple-400" />
                </div>

                {/* Rating Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>

                {/* User Info */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Use cases */}
      <motion.section 
        className="bg-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-20">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Built for Everyone
            </h3>
            <p className="text-gray-600 text-lg">
              Whether you're hiring or looking to be hired
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* For Recruiters */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-3xl font-bold text-gray-900">For Recruiters</h4>
              </div>
              <ul className="space-y-4">
                {[
                  'Automate initial screening interviews',
                  'Scale hiring processes without quality loss',
                  'Reduce bias in early stages',
                  'Access detailed candidate analytics',
                  'Save 80% of screening time'
                ].map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex items-start gap-3 text-gray-700"
                  >
                    <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-lg">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* For Candidates */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-100"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                  <UserCheck className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-3xl font-bold text-gray-900">For Candidates</h4>
              </div>
              <ul className="space-y-4">
                {[
                  'Practice interview skills with AI',
                  'Get instant, actionable feedback',
                  'Flexible scheduling and accessibility',
                  'Improve with detailed performance reports',
                  'Build confidence before real interviews'
                ].map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex items-start gap-3 text-gray-700"
                  >
                    <CheckCircle className="h-6 w-6 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-lg">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Pricing teaser */}
      <motion.section 
        id="pricing" 
        className="max-w-7xl mx-auto px-6 py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
          className="relative rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white p-12 md:p-16 overflow-hidden shadow-2xl"
        >
          {/* Animated Background Circles */}
          <motion.div 
            className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <motion.div 
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-semibold">Limited Time Offer</span>
              </motion.div>
              
              <motion.div 
                className="text-4xl md:text-5xl font-extrabold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Start Free. Scale as You Grow.
              </motion.div>
              
              <motion.p 
                className="text-xl text-white/90 mb-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                14-day free trial • No credit card required
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap gap-4 justify-center md:justify-start mt-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Unlimited interviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Full analytics access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>24/7 support</span>
                </div>
              </motion.div>
            </div>

            <motion.button
              onClick={() => navigate('/signup')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="px-10 py-5 rounded-2xl bg-white text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-3 group relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-white group-hover:bg-gray-50 transition-colors duration-300" style={{ zIndex: -1 }} />
              <span className="relative bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Get Started Now
              </span>
              <ArrowRight className="h-6 w-6 text-purple-600 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>
          </div>
        </motion.div>
      </motion.section>

      {/* Footer CTA */}
      <motion.section 
        className="bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Side - CTA Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                Ready to Transform Your Hiring?
              </h3>
              <p className="text-gray-600 text-lg mb-6 max-w-xl">
                Join thousands of recruiters using AI to speed up and improve their screening process. 
                Get started in minutes.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <span>Free 14-day trial</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <span>Enterprise-grade security</span>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Action Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.button
                onClick={() => navigate('/signup')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-2 justify-center group"
              >
                Get Started Free
                <Rocket className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </motion.button>
              
              <motion.button
                onClick={() => navigate('/login')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl border-2 border-gray-300 bg-white text-gray-900 font-bold text-lg shadow-md hover:shadow-lg hover:border-gray-400 transition-all duration-300 flex items-center gap-2 justify-center"
              >
                <LogIn className="h-5 w-5" />
                Sign In
              </motion.button>
            </motion.div>
          </div>

          {/* Footer Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 pt-8 border-t border-gray-300 flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="text-gray-600 text-sm">
              © 2024 AI Recruiter. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-blue-600 transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600 transition-colors duration-200">Terms of Service</a>
              <a href="#" className="hover:text-blue-600 transition-colors duration-200">Contact Us</a>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
