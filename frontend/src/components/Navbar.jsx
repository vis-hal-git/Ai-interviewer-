/**
 * Navbar Component with Modern User Dropdown
 */
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Sparkles, Menu, X, LogOut, LayoutDashboard, 
  User, Settings, HelpCircle, ChevronDown, Bell,
  FileText, BarChart3 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setDropdownOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Check if we're on the landing page (only show features/pricing there)
  const isLandingPage = location.pathname === '/' && !user;
  
  // Check if user is a recruiter
  const isRecruiter = user?.role === 'recruiter';
  
  // Get the appropriate dashboard link based on role
  const getDashboardLink = () => {
    if (!user) return '/dashboard';
    return isRecruiter ? '/recruiter' : '/dashboard';
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'U';
    if (user.displayName) {
      const names = user.displayName.split(' ');
      return names.length > 1 
        ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        : names[0][0].toUpperCase();
    }
    return user.email?.[0]?.toUpperCase() || 'U';
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-40 backdrop-blur-md bg-gradient-to-r from-white/90 via-purple-50/90 to-white/90 border-b border-purple-100/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={user ? getDashboardLink() : '/'} className="flex items-center gap-2 group">
            <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </span>
            <span className="text-lg md:text-xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:via-purple-700 group-hover:to-pink-700 transition-all duration-200">
              AI Recruiter Pro
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-2">
          {/* Only show these links on landing page for non-authenticated users */}
          {isLandingPage && (
            <>
              <a href="/#features" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">Features</a>
              <a href="/#how-it-works" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">How It Works</a>
              <a href="/#pricing" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">Pricing</a>
            </>
          )}
          
          {/* Show dashboard navigation links for authenticated users */}
          {user && !isRecruiter && (
            <>
              <Link 
                to={getDashboardLink()} 
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  location.pathname === getDashboardLink()
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/profile" 
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  location.pathname === '/profile'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                My Profile
              </Link>
              <Link 
                to="/start-interview" 
                className="px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Start Interview
              </Link>
            </>
          )}
          
          {/* Recruiter navigation */}
          {user && isRecruiter && (
            <>
              <Link 
                to={getDashboardLink()} 
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  location.pathname === getDashboardLink()
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/recruiter/analytics" 
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  location.pathname === '/recruiter/analytics'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                Analytics
              </Link>
            </>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {/* Notifications Icon */}
              <button className="relative p-2.5 rounded-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition-all duration-200 group">
                <Bell className="h-5 w-5 text-gray-600 group-hover:text-purple-600 transition-colors" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse shadow-md"></span>
              </button>

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition-all duration-200 group border border-transparent hover:border-purple-200"
                >
                  {/* User Avatar */}
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:shadow-xl group-hover:scale-105 transition-all duration-200 ring-2 ring-white">
                    {getUserInitials()}
                  </div>
                  
                  {/* User Info */}
                  <div className="hidden lg:flex flex-col items-start">
                    <span className="text-sm font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                      {user.displayName || user.email?.split('@')[0]}
                    </span>
                    <span className="text-xs font-medium text-gray-500 capitalize group-hover:text-purple-600 transition-colors">{user.role || 'User'}</span>
                  </div>
                  
                  <ChevronDown className={`h-4 w-4 text-gray-500 group-hover:text-purple-600 transition-all duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden z-50 backdrop-blur-xl"
                    >
                      {/* User Info Header */}
                      <div className="p-5 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-b border-purple-100">
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg ring-4 ring-white">
                            {getUserInitials()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">
                              {user.displayName || 'User'}
                            </p>
                            <p className="text-xs text-gray-600 truncate mt-0.5">{user.email}</p>
                            <span className="inline-block mt-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm">
                              {user.role || 'candidate'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all group"
                        >
                          <User className="h-5 w-5 group-hover:scale-110 transition-transform text-blue-500" />
                          <span className="font-semibold">My Profile</span>
                        </Link>

                        <Link
                          to="/settings"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-600 transition-all group"
                        >
                          <Settings className="h-5 w-5 group-hover:scale-110 transition-transform text-purple-500" />
                          <span className="font-semibold">Settings</span>
                        </Link>

                        <Link
                          to="/help"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-600 transition-all group"
                        >
                          <HelpCircle className="h-5 w-5 group-hover:scale-110 transition-transform text-green-500" />
                          <span className="font-semibold">Help & Support</span>
                        </Link>
                      </div>

                      {/* Logout Button */}
                      <div className="p-3 border-t border-gray-100 bg-gradient-to-br from-gray-50 to-red-50/30">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 group"
                        >
                          <LogOut className="h-5 w-5 group-hover:scale-110 group-hover:rotate-12 transition-all" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              {location.pathname !== '/login' && (
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm font-semibold transition-colors duration-200 hover:bg-gray-50"
                >
                  Login
                </Link>
              )}
              {location.pathname !== '/signup' && (
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold transition-transform duration-200 hover:scale-105"
                >
                  Sign Up
                </Link>
              )}
            </>
          )}
        </div>

        <button
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-gray-300 bg-white"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-purple-100 bg-gradient-to-b from-white/95 to-purple-50/95 backdrop-blur-md shadow-lg"
        >
          <div className="px-4 py-4 space-y-3">
            {/* User Info on Mobile */}
            {user && (
              <div className="pb-4 border-b border-purple-100">
                <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-xl">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white">
                    {getUserInitials()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {user.displayName || user.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-600 truncate">{user.email}</p>
                  </div>
                  <div className="relative">
                    <Bell className="h-5 w-5 text-purple-500" />
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                  </div>
                </div>
              </div>
            )}

            {/* Only show these links on landing page for non-authenticated users */}
            {isLandingPage && (
              <>
                <a href="/#features" className="block py-2 text-sm font-medium text-gray-700">Features</a>
                <a href="/#how-it-works" className="block py-2 text-sm font-medium text-gray-700">How It Works</a>
                <a href="/#pricing" className="block py-2 text-sm font-medium text-gray-700">Pricing</a>
              </>
            )}
            
            {/* Show dashboard navigation links for authenticated users */}
            {user && (
              <>
                <Link 
                  to={getDashboardLink()} 
                  onClick={() => setMobileOpen(false)} 
                  className="flex items-center gap-3 py-3 px-3 text-sm font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg transition-all"
                >
                  <LayoutDashboard className="h-5 w-5 text-blue-500" />
                  Dashboard
                </Link>

                <Link 
                  to="/profile" 
                  onClick={() => setMobileOpen(false)} 
                  className="flex items-center gap-3 py-3 px-3 text-sm font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-lg transition-all"
                >
                  <User className="h-5 w-5 text-purple-500" />
                  My Profile
                </Link>

                {isRecruiter ? (
                  <Link 
                    to="/recruiter/analytics" 
                    onClick={() => setMobileOpen(false)} 
                    className="flex items-center gap-3 py-3 px-3 text-sm font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 rounded-lg transition-all"
                  >
                    <BarChart3 className="h-5 w-5 text-cyan-500" />
                    Analytics
                  </Link>
                ) : (
                  <Link 
                    to="/start-interview" 
                    onClick={() => setMobileOpen(false)} 
                    className="flex items-center gap-3 py-3 px-3 text-sm font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Start Interview
                  </Link>
                )}

                <Link
                  to="/settings" 
                  onClick={() => setMobileOpen(false)} 
                  className="flex items-center gap-3 py-3 px-3 text-sm font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 rounded-lg transition-all"
                >
                  <Settings className="h-5 w-5 text-gray-500" />
                  Settings
                </Link>

                <Link 
                  to="/help" 
                  onClick={() => setMobileOpen(false)} 
                  className="flex items-center gap-3 py-3 px-3 text-sm font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-lg transition-all"
                >
                  <HelpCircle className="h-5 w-5 text-green-500" />
                  Help & Support
                </Link>
              </>
            )}
            
            <div className="pt-3 border-t border-purple-100">
              {user ? (
                <button
                  onClick={async () => { await handleLogout(); setMobileOpen(false); }}
                  className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm font-semibold"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
