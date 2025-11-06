/**
 * Main App Component with Routing
 */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ResumeUpload from './pages/ResumeUpload';
import StartInterview from './pages/StartInterview';
import InterviewRoom from './pages/InterviewRoom';
import InterviewPreparation from './pages/InterviewPreparation';
import InterviewComplete from './pages/InterviewComplete';
import RecruiterDashboard from './pages/RecruiterDashboard';
import InterviewDetail from './pages/InterviewDetail';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import HelpSupport from './pages/HelpSupport';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Candidate Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload-resume"
              element={
                <ProtectedRoute>
                  <ResumeUpload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/start-interview"
              element={
                <ProtectedRoute>
                  <StartInterview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/help"
              element={
                <ProtectedRoute>
                  <HelpSupport />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview/prepare/:sessionId"
              element={
                <ProtectedRoute>
                  <InterviewPreparation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview/room/:sessionId"
              element={
                <ProtectedRoute>
                  <InterviewRoom />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview/complete/:sessionId"
              element={
                <ProtectedRoute>
                  <InterviewComplete />
                </ProtectedRoute>
              }
            />

            {/* Protected Recruiter Routes */}
            <Route
              path="/recruiter"
              element={
                <ProtectedRoute requiredRole="recruiter">
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/interview/:id"
              element={
                <ProtectedRoute requiredRole="recruiter">
                  <InterviewDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/analytics"
              element={
                <ProtectedRoute requiredRole="recruiter">
                  <Analytics />
                </ProtectedRoute>
              }
            />

            {/* 404 Not Found */}
            <Route path="*" element={<div className="p-8 text-center"><h1 className="text-2xl">404 - Page Not Found</h1></div>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
