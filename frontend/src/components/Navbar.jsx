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
    <nav className="fixed top-0 inset-x-0 z-40 backdrop-blur bg-white/80 border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={user ? getDashboardLink() : '/'} className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Recruiter Pro
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {/* Only show these links on landing page for non-authenticated users */}
          {isLandingPage && (
            <>
              <a href="/#features" className="text-sm font-medium text-gray-700 hover:text-gray-900">Features</a>
              <a href="/#how-it-works" className="text-sm font-medium text-gray-700 hover:text-gray-900">How It Works</a>
              <a href="/#pricing" className="text-sm font-medium text-gray-700 hover:text-gray-900">Pricing</a>
            </>
          )}
          
          {/* Show dashboard navigation links for authenticated users */}
          {user && (
            <>
              <Link to={getDashboardLink()} className="text-sm font-medium text-gray-700 hover:text-gray-900">
                Dashboard
              </Link>
              {isRecruiter && (
                <>
                  <Link to="/recruiter/analytics" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                    Analytics
                  </Link>
                </>
              )}
              {!isRecruiter && (
                <Link to="/upload-resume" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  Upload Resume
                </Link>
              )}
            </>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {/* Notifications Icon */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 group"
                >
                  {/* User Avatar */}
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm shadow-md group-hover:shadow-lg transition-shadow">
                    {getUserInitials()}
                  </div>
                  
                  {/* User Info */}
                  <div className="hidden lg:flex flex-col items-start">
                    <span className="text-sm font-semibold text-gray-900">
                      {user.displayName || user.email?.split('@')[0]}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">{user.role || 'User'}</span>
                  </div>
                  
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                    >
                      {/* User Info Header */}
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 border-b">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {getUserInitials()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {user.displayName || 'User'}
                            </p>
                            <p className="text-xs text-gray-600 truncate">{user.email}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700 capitalize">
                              {user.role || 'candidate'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          to={getDashboardLink()}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
                        >
                          <LayoutDashboard className="h-4 w-4 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Dashboard</span>
                        </Link>

                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
                        >
                          <User className="h-4 w-4 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">My Profile</span>
                        </Link>

                        {isRecruiter ? (
                          <Link
                            to="/recruiter/analytics"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
                          >
                            <BarChart3 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Analytics</span>
                          </Link>
                        ) : (
                          <Link
                            to="/upload-resume"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
                          >
                            <FileText className="h-4 w-4 group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Upload Resume</span>
                          </Link>
                        )}

                        <Link
                          to="/settings"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
                        >
                          <Settings className="h-4 w-4 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Settings</span>
                        </Link>

                        <Link
                          to="/help"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
                        >
                          <HelpCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Help & Support</span>
                        </Link>
                      </div>

                      {/* Logout Button */}
                      <div className="p-2 border-t bg-gray-50">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
                        >
                          <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform" />
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
          className="md:hidden border-t bg-white/95 backdrop-blur"
        >
          <div className="px-4 py-4 space-y-3">
            {/* User Info on Mobile */}
            {user && (
              <div className="pb-3 border-b">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold shadow-md">
                    {getUserInitials()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.displayName || user.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-600 truncate">{user.email}</p>
                  </div>
                  <Bell className="h-5 w-5 text-gray-400" />
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
                  className="flex items-center gap-3 py-2 text-sm font-medium text-gray-700"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>

                <Link 
                  to="/profile" 
                  onClick={() => setMobileOpen(false)} 
                  className="flex items-center gap-3 py-2 text-sm font-medium text-gray-700"
                >
                  <User className="h-4 w-4" />
                  My Profile
                </Link>

                {isRecruiter ? (
                  <Link 
                    to="/recruiter/analytics" 
                    onClick={() => setMobileOpen(false)} 
                    className="flex items-center gap-3 py-2 text-sm font-medium text-gray-700"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Analytics
                  </Link>
                ) : (
                  <Link 
                    to="/upload-resume" 
                    onClick={() => setMobileOpen(false)} 
                    className="flex items-center gap-3 py-2 text-sm font-medium text-gray-700"
                  >
                    <FileText className="h-4 w-4" />
                    Upload Resume
                  </Link>
                )}

                <Link 
                  to="/settings" 
                  onClick={() => setMobileOpen(false)} 
                  className="flex items-center gap-3 py-2 text-sm font-medium text-gray-700"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>

                <Link 
                  to="/help" 
                  onClick={() => setMobileOpen(false)} 
                  className="flex items-center gap-3 py-2 text-sm font-medium text-gray-700"
                >
                  <HelpCircle className="h-4 w-4" />
                  Help & Support
                </Link>
              </>
            )}
            
            <div className="pt-3 border-t">
              {user ? (
                <button
                  onClick={async () => { await handleLogout(); setMobileOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold shadow-sm"
                >
                  <LogOut className="h-4 w-4" />
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
