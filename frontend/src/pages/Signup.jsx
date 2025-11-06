/**
 * Signup/Registration Page - Enhanced with Modern Design & Animations
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Check, Briefcase, UserCheck, Brain, Shield, Zap, Clock, TrendingUp, Sparkles, CheckCircle, Award, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'candidate', // candidate or recruiter
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement signup logic
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setLoading(true);
      setError('');
      await signup(formData.email, formData.password, formData.role, formData.name);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const passwordCriteria = {
    length: formData.password.length >= 8,
    upper: /[A-Z]/.test(formData.password),
    lower: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
  };

  const strengthScore = Object.values(passwordCriteria).filter(Boolean).length;
  const strengthLevel = strengthScore <= 2 ? 'weak' : strengthScore <= 4 ? 'medium' : 'strong';
  const strengthWidth = strengthLevel === 'weak' ? 'w-1/3' : strengthLevel === 'medium' ? 'w-2/3' : 'w-full';
  const strengthColor = strengthLevel === 'weak' ? 'bg-red-500' : strengthLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500';
  const isEmailValid = /.+@.+\..+/.test(formData.email);
  const isNameValid = formData.name.trim().length >= 2;
  const passwordsMatch = formData.password && formData.password === formData.confirmPassword;

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

      {/* Left: Signup Form */}
      <motion.div 
        className="flex items-center justify-center p-6 md:p-12 relative z-10 overflow-y-auto"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-full max-w-lg my-8">
          <motion.div 
            className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl border border-white/60 p-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Logo/Branding */}
            <motion.div 
              className="flex items-center gap-3 mb-6"
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
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                Create your account
              </h1>
              <p className="text-gray-600">
                Join thousands transforming their hiring process
              </p>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  className="mb-6 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm flex items-start gap-2"
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                >
                  <div className="w-5 h-5 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">!</span>
                  </div>
                  <div>{error}</div>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <motion.input
                    type="text"
                    required
                    whileFocus={{ scale: 1.01 }}
                    className="w-full rounded-xl border-2 border-gray-200 pl-12 pr-12 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <AnimatePresence>
                    {isNameValid && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                      >
                        <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
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
                    className="w-full rounded-xl border-2 border-gray-200 pl-12 pr-12 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <AnimatePresence>
                    {isEmailValid && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                      >
                        <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
              {/* Password Section */}
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <motion.input
                      type={showPassword ? 'text' : 'password'}
                      required
                      whileFocus={{ scale: 1.01 }}
                      className="w-full rounded-xl border-2 border-gray-200 pl-12 pr-12 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

                  {/* Password Strength Meter */}
                  {formData.password && (
                    <motion.div 
                      className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-600">Password strength</span>
                        <span className={`text-xs font-bold capitalize px-2 py-1 rounded ${
                          strengthLevel === 'weak' ? 'bg-red-100 text-red-700' :
                          strengthLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {strengthLevel}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mb-3">
                        <motion.div 
                          className={`h-2 ${strengthColor} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: strengthLevel === 'weak' ? '33%' : strengthLevel === 'medium' ? '66%' : '100%' }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <ul className="grid grid-cols-2 gap-2 text-xs">
                        {[
                          { key: 'length', text: '8+ characters' },
                          { key: 'upper', text: 'Uppercase' },
                          { key: 'lower', text: 'Lowercase' },
                          { key: 'number', text: 'Number' },
                          { key: 'special', text: 'Special char' }
                        ].map(({ key, text }) => (
                          <li key={key} className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                              passwordCriteria[key] ? 'bg-green-500' : 'bg-gray-300'
                            }`}>
                              {passwordCriteria[key] && <Check className="h-3 w-3 text-white" />}
                            </div>
                            <span className={passwordCriteria[key] ? 'text-green-700 font-medium' : 'text-gray-500'}>
                              {text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <motion.input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      whileFocus={{ scale: 1.01 }}
                      className="w-full rounded-xl border-2 border-gray-200 pl-12 pr-12 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute right-12 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500" />
                      )}
                    </motion.button>
                    <AnimatePresence>
                      {passwordsMatch && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                        >
                          <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>

              {/* Role Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  I am joining as
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { 
                      key: 'candidate', 
                      title: 'Candidate', 
                      subtitle: 'Looking for opportunities',
                      icon: UserCheck,
                      gradient: 'from-blue-500 to-blue-600'
                    },
                    { 
                      key: 'recruiter', 
                      title: 'Recruiter', 
                      subtitle: 'Hiring top talent',
                      icon: Briefcase,
                      gradient: 'from-purple-500 to-purple-600'
                    },
                  ].map((opt) => {
                    const selected = formData.role === opt.key;
                    return (
                      <motion.button
                        type="button"
                        key={opt.key}
                        onClick={() => setFormData({ ...formData, role: opt.key })}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className={`rounded-2xl border-2 p-5 text-left transition-all duration-300 ${
                          selected 
                            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg' 
                            : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-md'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${opt.gradient} flex items-center justify-center mb-3 shadow-md`}>
                          <opt.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="font-bold text-gray-900 mb-1">{opt.title}</div>
                        <div className="text-sm text-gray-600">{opt.subtitle}</div>
                        {selected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-3 right-3 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center"
                          >
                            <Check className="h-4 w-4 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Terms & Conditions */}
              <motion.div 
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <input 
                  id="terms" 
                  type="checkbox" 
                  required 
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500" 
                />
                <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 font-semibold hover:underline">
                    Terms of Service
                  </a>
                  {' '}and{' '}
                  <a href="#" className="text-blue-600 font-semibold hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating your account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <Sparkles className="h-5 w-5" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            </form>

            {/* Login Link */}
            <motion.div 
              className="mt-6 text-center text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
              >
                Sign In
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right: Benefits */}
      <div className="hidden md:flex items-center p-12">
        <div className="w-full max-w-xl mx-auto">
          <div className="rounded-2xl bg-white p-8 shadow-xl border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">Why join AI Recruiter Pro?</div>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              {['Quick setup', 'AI-powered', 'Detailed reports', 'Secure & private'].map((t) => (
                <div key={t} className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                  <div className="font-semibold text-gray-900">{t}</div>
                  <div className="text-sm text-gray-600">Start in minutes and scale with confidence.</div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="font-semibold">Testimonial</div>
              <p className="text-white/90 mt-1">“This platform transformed our hiring process with accurate, instant insights.”</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
