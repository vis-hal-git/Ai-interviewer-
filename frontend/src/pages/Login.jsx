/**
 * Login Page - Enhanced with Modern Design & Animations
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield, Zap, Clock, Brain, TrendingUp, Users, Sparkles, Chrome } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden pt-16">
      {/* Animated Background Blobs */}
      <motion.div 
        className="absolute top-0 left-0 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl"
        animate={{ 
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 20, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl"
        animate={{ 
          x: [0, -100, 0],
          y: [0, -50, 0],
          scale: [1.2, 1, 1.2]
        }}
        transition={{ duration: 15, repeat: Infinity }}
      />

      {/* Left: Login Form */}
      <motion.div 
        className="flex items-center justify-center p-6 md:p-12 relative z-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-full max-w-md">
          <motion.div 
            className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl border border-white/60 p-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Logo/Branding */}
            <motion.div 
              className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <div>
                <div className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Recruiter
                </div>
              </div>
            </motion.div>

            {/* Header */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                Welcome back
              </h1>
              <p className="text-gray-600">
                Sign in to continue to your dashboard
              </p>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div 
                className="mb-6 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm flex items-start gap-2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div className="w-5 h-5 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">!</span>
                </div>
                <div>{error}</div>
              </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <motion.input
                    type="email"
                    required
                    whileFocus={{ scale: 1.01 }}
                    className="w-full rounded-xl border-2 border-gray-200 pl-12 pr-4 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <button 
                    type="button" 
                    className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <motion.input
                    type={showPassword ? 'text' : 'password'}
                    required
                    whileFocus={{ scale: 1.01 }}
                    className="w-full rounded-xl border-2 border-gray-200 pl-12 pr-12 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500" />
                    )}
                  </motion.button>
                </div>
              </motion.div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {loading ? 'Signing in...' : 'Sign In'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            </form>

            {/* Divider */}
            <motion.div 
              className="flex items-center gap-4 my-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-sm text-gray-500 font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-300" />
            </motion.div>

            {/* Google Sign In */}
            {typeof loginWithGoogle === 'function' && (
              <motion.button
                onClick={async () => {
                  try {
                    setLoading(true);
                    setError('');
                    await loginWithGoogle();
                    navigate('/dashboard');
                  } catch (err) {
                    setError(err.message || 'Failed to sign in with Google');
                  } finally {
                    setLoading(false);
                  }
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                disabled={loading}
                className="w-full rounded-xl border-2 border-gray-300 bg-white hover:bg-gray-50 font-semibold py-3.5 flex items-center justify-center gap-3 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Chrome className="h-5 w-5 text-gray-700" />
                <span className="text-gray-700">Continue with Google</span>
              </motion.button>
            )}

            {/* Sign Up Link */}
            <motion.div 
              className="mt-6 text-center text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
              >
                Create Account
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right: Benefits & Features */}
      <motion.div 
        className="hidden md:flex items-center p-12 relative z-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="w-full max-w-xl mx-auto space-y-6">
          {/* Main Feature Card */}
          <motion.div 
            className="rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white p-10 shadow-2xl relative overflow-hidden"
            whileHover={{ scale: 1.02, rotate: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <motion.div 
                className="flex items-center gap-2 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Sparkles className="h-6 w-6" />
                <span className="text-sm font-semibold">Why Choose AI Recruiter?</span>
              </motion.div>
              
              <motion.h2 
                className="text-3xl font-extrabold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Transform Your Hiring Process
              </motion.h2>
              
              <motion.ul 
                className="space-y-4 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                {[
                  { icon: Shield, text: 'Enterprise-grade Security' },
                  { icon: Brain, text: 'AI-Powered Analysis' },
                  { icon: Zap, text: 'Instant Reports & Insights' },
                  { icon: Clock, text: 'Save 80% Screening Time' }
                ].map((item, i) => (
                  <motion.li 
                    key={item.text}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="text-white/95 font-medium">{item.text}</span>
                  </motion.li>
                ))}
              </motion.ul>

              {/* Stats Grid */}
              <motion.div 
                className="grid grid-cols-3 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                {[
                  { icon: TrendingUp, value: '95%', label: 'Accuracy' },
                  { icon: Clock, value: '80%', label: 'Time Saved' },
                  { icon: Users, value: '10K+', label: 'Interviews' }
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    whileHover={{ y: -5, scale: 1.05 }}
                    className="rounded-2xl bg-white/10 backdrop-blur-sm p-4 text-center"
                  >
                    <stat.icon className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-2xl font-extrabold mb-1">{stat.value}</div>
                    <div className="text-xs text-white/80">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Testimonial Card */}
          <motion.div
            className="rounded-2xl bg-white/90 backdrop-blur-xl p-8 shadow-xl border border-gray-100"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                S
              </div>
              <div>
                <p className="text-gray-700 italic mb-3 leading-relaxed">
                  "AI Recruiter has transformed how we conduct initial screenings. 
                  The time savings and quality of insights are incredible!"
                </p>
                <div>
                  <div className="font-bold text-gray-900">Sarah Mitchell</div>
                  <div className="text-sm text-gray-500">Head of Talent, TechCorp</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
