import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HelpCircle, Search, Book, MessageCircle, Mail, Phone,
  FileText, Video, Shield, CreditCard, Users, Settings,
  ChevronDown, ChevronUp, ExternalLink, Send, Check,
  AlertCircle, Clock, Zap, Target, Award, TrendingUp,
  Camera, Mic, Monitor, Wifi, Download, Upload, Lock,
  Globe, Smartphone, Bell, Eye, Database, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const HelpSupport = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    category: 'general',
    message: '',
    priority: 'normal'
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const categories = [
    { id: 'all', label: 'All Topics', icon: Book },
    { id: 'getting-started', label: 'Getting Started', icon: Zap },
    { id: 'interviews', label: 'Interviews', icon: Video },
    { id: 'technical', label: 'Technical Issues', icon: Settings },
    { id: 'account', label: 'Account & Billing', icon: CreditCard },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield }
  ];

  const faqs = [
    {
      id: 1,
      category: 'getting-started',
      question: 'How do I get started with AI Recruiter Pro?',
      answer: `Getting started is easy! Follow these steps:
      
1. **Sign Up**: Create your account using email or Google authentication
2. **Complete Your Profile**: Go to the Profile page and fill in your professional details (experience, skills, education)
3. **Upload Resume (Optional)**: You can upload your resume for automatic profile population, or manually enter your information
4. **Start Interview**: Click "Start Interview" from the navbar, select your target job role, and begin!

The AI will generate personalized questions based on your profile and the job role you're applying for.`
    },
    {
      id: 2,
      category: 'getting-started',
      question: 'Do I need to upload a resume?',
      answer: `No, uploading a resume is optional! You have two ways to set up your profile:

**Option 1: Upload Resume**
- Go to Profile page and click "Upload Resume"
- Our AI will automatically extract your information
- Supports PDF, DOC, and DOCX formats (max 10MB)

**Option 2: Manual Entry**
- Fill in your profile information manually through the Profile page tabs
- Add your skills, experience, education, projects, and achievements
- This gives you more control over what information is included

Both methods work equally well for interview preparation!`
    },
    {
      id: 3,
      category: 'interviews',
      question: 'How does the AI interview work?',
      answer: `Our AI-powered interview system provides a realistic interview experience:

**Before Interview:**
- Select your target job role (Software Engineer, Data Scientist, etc.)
- AI generates 10 personalized questions based on your profile and role
- You can review technical requirements before starting

**During Interview:**
- AI avatar asks questions with voice synthesis
- Your camera records video responses (for analysis)
- Real-time subtitles show what AI is saying
- Speech recognition transcribes your answers
- AI asks relevant follow-up questions based on your responses

**After Interview:**
- Detailed performance report with scores
- Feedback on communication, technical knowledge, and confidence
- Suggestions for improvement
- Interview recording available for review`
    },
    {
      id: 4,
      category: 'interviews',
      question: 'Can I pause or restart an interview?',
      answer: `**During Interview:**
- Interviews are designed to simulate real conditions, so pausing is not available
- Each question has a reasonable time limit
- You can take a moment to think before answering

**Restarting:**
- You can start a new interview anytime from the Dashboard
- Previous interview history is saved in your profile
- Each interview is independent and doesn't affect others

**Best Practices:**
- Ensure stable internet connection before starting
- Find a quiet, well-lit space
- Test your camera and microphone first
- Keep answers concise and focused (2-3 minutes per question)`
    },
    {
      id: 5,
      category: 'interviews',
      question: 'What should I do if my video or audio isn\'t working?',
      answer: `**Quick Troubleshooting:**

**Camera Issues:**
1. Check browser permissions (click lock icon in address bar)
2. Ensure no other app is using your camera
3. Try a different browser (Chrome recommended)
4. Check Settings > Interview Settings > Auto-Start Video

**Microphone Issues:**
1. Verify microphone is selected in browser permissions
2. Check system volume and microphone settings
3. Test with another application first
4. Ensure Settings > Interview Settings > Auto-Start Audio is enabled

**Still Having Issues?**
- Refresh the page and rejoin
- Try incognito/private browsing mode
- Update your browser to the latest version
- Contact support with your browser version and OS`
    },
    {
      id: 6,
      category: 'interviews',
      question: 'How is my interview performance scored?',
      answer: `Our AI analyzes multiple dimensions of your performance:

**Communication Skills (30%)**
- Clarity and articulation
- Response structure and organization
- Use of professional language
- Confidence and tone

**Technical Knowledge (40%)**
- Accuracy of technical answers
- Depth of understanding
- Problem-solving approach
- Relevant experience demonstration

**Behavioral Assessment (20%)**
- Eye contact and body language
- Confidence level
- Engagement and enthusiasm
- Professional presentation

**Response Quality (10%)**
- Completeness of answers
- Relevance to question
- Examples and evidence provided
- Time management

Scores range from 0-100, with detailed breakdowns and improvement suggestions in your report.`
    },
    {
      id: 7,
      category: 'technical',
      question: 'What browsers and devices are supported?',
      answer: `**Recommended Browsers:**
- Google Chrome (v90+) - Best performance
- Microsoft Edge (v90+)
- Firefox (v88+)
- Safari (v14+)

**Device Requirements:**
- **Desktop/Laptop**: Recommended for best experience
  - Webcam: 720p or higher
  - Microphone: Built-in or external
  - RAM: 4GB minimum, 8GB recommended
  - Internet: 5 Mbps minimum

- **Mobile/Tablet**: Supported but limited features
  - iOS 14+ or Android 10+
  - Stable WiFi connection required
  - External microphone recommended

**Not Supported:**
- Internet Explorer
- Opera Mini
- Very old browser versions`
    },
    {
      id: 8,
      category: 'technical',
      question: 'The interview page is loading slowly or freezing',
      answer: `**Immediate Actions:**
1. Check your internet connection (minimum 5 Mbps required)
2. Close unnecessary browser tabs and applications
3. Refresh the page (Ctrl+R or Cmd+R)
4. Clear browser cache: Settings > Privacy > Clear browsing data

**Performance Optimization:**
- Disable browser extensions temporarily
- Close other bandwidth-heavy applications (downloads, streaming)
- Connect to a stable WiFi network (avoid mobile data)
- Reduce video quality in Settings if available

**Advanced Solutions:**
- Update your browser to the latest version
- Restart your computer/device
- Try a different browser
- Use incognito/private mode

**Still Issues?**
Contact support with:
- Your browser version
- Internet speed test results
- Console error logs (F12 > Console tab)`
    },
    {
      id: 9,
      category: 'account',
      question: 'How do I update my profile information?',
      answer: `**Easy Profile Updates:**

1. **Navigate to Profile:**
   - Click "My Profile" in the navbar
   - Or go to Dashboard > My Profile

2. **Select Section to Edit:**
   - Basic Info (name, email, phone)
   - Social Links (LinkedIn, GitHub, portfolio)
   - Skills, Experience, Education
   - Projects, Achievements, Certifications

3. **Edit Information:**
   - Click "Edit" button on any section
   - Make your changes
   - Click "Save" to update

4. **Upload New Resume:**
   - Click "Upload Resume" button in Profile page
   - Choose file and job role
   - AI will update your profile automatically

**Tips:**
- Keep your profile up-to-date for best interview questions
- Add detailed experience for better AI analysis
- Include relevant skills for your target roles`
    },
    {
      id: 10,
      category: 'account',
      question: 'How do I change my password or email?',
      answer: `**Change Password:**
1. Go to Settings > Account
2. Click "Change Password"
3. Enter current password
4. Enter new password (min 8 characters)
5. Confirm new password
6. Click "Update Password"

**Change Email:**
1. Go to Settings > Account
2. Update email field
3. Click "Save Changes"
4. Verify new email via link sent to inbox

**Forgot Password:**
1. Click "Forgot Password" on login page
2. Enter your email address
3. Check inbox for reset link
4. Create new password
5. Login with new credentials

**Security Tips:**
- Use strong, unique passwords
- Enable Two-Factor Authentication (Settings > Account)
- Never share your password
- Change password regularly`
    },
    {
      id: 11,
      category: 'account',
      question: 'Is there a free trial? What are the pricing plans?',
      answer: `**Free Forever Plan:**
- 3 interviews per month
- Basic performance reports
- Profile management
- Standard AI questions

**Pro Plan ($19/month):**
- Unlimited interviews
- Advanced analytics and insights
- Detailed performance tracking
- Priority support
- Custom question generation
- Interview recording downloads
- No ads

**Enterprise Plan (Contact Sales):**
- Everything in Pro
- Dedicated account manager
- Custom integrations
- Team management features
- Advanced reporting
- SLA guarantees
- White-label options

**Student Discount:**
- 50% off Pro Plan with valid .edu email
- All Pro features included

Start with free plan, upgrade anytime!`
    },
    {
      id: 12,
      category: 'privacy',
      question: 'How is my data stored and protected?',
      answer: `**Data Security:**

**Encryption:**
- All data encrypted in transit (SSL/TLS)
- Database encryption at rest (AES-256)
- Secure password hashing (bcrypt)

**Storage:**
- Interview recordings: Secure cloud storage (AWS S3)
- Personal data: Encrypted MongoDB database
- Automatic backups every 24 hours
- Data retention: Active accounts + 90 days after deletion

**Privacy Controls:**
- You control who sees your profile (Settings > Privacy)
- Export your data anytime (Settings > Data & Storage)
- Delete account and all data permanently
- No data sold to third parties

**Compliance:**
- GDPR compliant
- SOC 2 Type II certified
- Regular security audits
- HTTPS everywhere

**Your Rights:**
- Access your data anytime
- Export in portable format
- Request deletion
- Opt-out of analytics`
    },
    {
      id: 13,
      category: 'privacy',
      question: 'Who can see my interview recordings?',
      answer: `**Default Settings:**
- **Only You**: By default, only you can access your interviews
- Recordings stored in your private account
- Not shared with anyone without permission

**Sharing Options:**
1. **Private (Default)**
   - Only visible to you
   - Accessible from Dashboard > Interview History

2. **Share with Recruiters**
   - Enable in Settings > Privacy
   - Generates shareable link
   - You control access duration
   - Can revoke access anytime

3. **Public Profile**
   - Optional: Make profile discoverable
   - Interview scores visible (not recordings)
   - Personal info controlled separately

**Data Usage:**
- Anonymized data may be used to improve AI
- Opt-out available in Settings > Privacy
- No recordings used without consent

**Best Practices:**
- Review privacy settings regularly
- Only share when needed
- Revoke access after hiring process
- Delete old recordings if desired`
    },
    {
      id: 14,
      category: 'technical',
      question: 'Can I download my interview recordings?',
      answer: `**Download Interview Recordings:**

**Free Plan:**
- View interviews online only
- Access for 30 days
- Screenshot support

**Pro Plan:**
- Download all interview recordings
- MP4 format, HD quality
- Keep forever
- Includes transcript files

**How to Download:**
1. Go to Dashboard > Interview History
2. Click on completed interview
3. Click "Download Recording" button (Pro only)
4. Video downloads to your device

**File Sizes:**
- Standard quality: ~100MB per 30 min interview
- HD quality: ~300MB per 30 min interview

**Transcript Download:**
- Available for all users
- PDF format with timestamps
- Questions and responses included

**Bulk Export:**
- Settings > Data & Storage > Export Data
- Downloads all your data in JSON format
- Includes all interview metadata`
    },
    {
      id: 15,
      category: 'getting-started',
      question: 'What job roles are supported?',
      answer: `**Current Supported Roles:**

**Engineering:**
- Software Engineer (Full Stack, Frontend, Backend)
- Data Scientist / Data Analyst
- DevOps Engineer
- ML Engineer / AI Engineer
- QA Engineer
- Mobile Developer (iOS/Android)
- Cloud Engineer

**Technology:**
- Product Manager
- Project Manager
- UX/UI Designer
- Business Analyst
- Cybersecurity Analyst

**Custom Roles:**
- Pro users can request custom role questions
- Enterprise users get fully customized role support

**Coming Soon:**
- Marketing roles
- Sales positions
- Finance roles
- HR positions
- Executive roles

Each role has specialized questions targeting:
- Technical skills specific to the role
- Domain knowledge
- Problem-solving scenarios
- Behavioral questions
- Industry best practices

**Question Quality:**
Questions are continuously updated based on:
- Current industry trends
- Real interview feedback
- Latest technology developments
- Hiring manager input`
    }
  ];

  const quickLinks = [
    { title: 'Getting Started Guide', icon: Book, link: '#getting-started', description: 'Learn the basics of AI Recruiter Pro' },
    { title: 'Video Tutorials', icon: Video, link: '#tutorials', description: 'Watch step-by-step video guides' },
    { title: 'Interview Tips', icon: Target, link: '#tips', description: 'Best practices for AI interviews' },
    { title: 'Technical Requirements', icon: Monitor, link: '#requirements', description: 'System requirements and compatibility' },
    { title: 'Privacy Policy', icon: Shield, link: '/privacy', description: 'How we protect your data' },
    { title: 'Terms of Service', icon: FileText, link: '/terms', description: 'User agreement and terms' }
  ];

  const contactOptions = [
    {
      type: 'email',
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      action: 'support@airecruiter.pro',
      buttonText: 'Send Email'
    },
    {
      type: 'chat',
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team (Mon-Fri, 9AM-6PM)',
      action: 'Start Chat',
      buttonText: 'Start Chat'
    },
    {
      type: 'docs',
      icon: Book,
      title: 'Documentation',
      description: 'Browse comprehensive guides and tutorials',
      action: '/docs',
      buttonText: 'View Docs'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    if (!contactForm.subject || !contactForm.message) {
      setSubmitError('Please fill in all required fields');
      return;
    }

    try {
      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFormSubmitted(true);
      setContactForm({ subject: '', category: 'general', message: '', priority: 'normal' });
      setTimeout(() => setFormSubmitted(false), 5000);
    } catch (error) {
      setSubmitError('Failed to submit. Please try again.');
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
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center transform rotate-3 shadow-2xl">
              <HelpCircle className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Help & Support</h1>
          <p className="text-xl text-gray-300">We're here to help you succeed</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help articles, FAQs, and guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={index}
                href={link.link}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-purple-500/50 hover:bg-white/15 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1 flex items-center gap-2">
                      {link.title}
                      <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-sm text-gray-400">{link.description}</p>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{option.title}</h3>
                <p className="text-gray-300 mb-4">{option.description}</p>
                <button className="px-6 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors font-medium">
                  {option.buttonText}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6">Frequently Asked Questions</h2>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeCategory === cat.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 text-lg">No results found for "{searchQuery}"</p>
                <p className="text-gray-400 mt-2">Try different keywords or browse categories</p>
              </div>
            ) : (
              filteredFAQs.map((faq) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white/5 rounded-xl border border-white/10 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="text-white font-medium pr-4">{faq.question}</span>
                    {expandedFAQ === faq.id ? (
                      <ChevronUp className="h-5 w-5 text-purple-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {expandedFAQ === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-gray-300 whitespace-pre-line leading-relaxed border-t border-white/10 pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Contact Form */}
        <div className="mt-12 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6">Still Need Help?</h2>
          <p className="text-gray-300 mb-8">Send us a message and we'll get back to you within 24 hours</p>

          {formSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-10 w-10 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
              <p className="text-gray-300">We'll get back to you within 24 hours</p>
            </motion.div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={contactForm.category}
                    onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="general" className="bg-slate-800">General Inquiry</option>
                    <option value="technical" className="bg-slate-800">Technical Issue</option>
                    <option value="billing" className="bg-slate-800">Billing Question</option>
                    <option value="feature" className="bg-slate-800">Feature Request</option>
                    <option value="bug" className="bg-slate-800">Bug Report</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                  <select
                    value={contactForm.priority}
                    onChange={(e) => setContactForm({ ...contactForm, priority: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="low" className="bg-slate-800">Low</option>
                    <option value="normal" className="bg-slate-800">Normal</option>
                    <option value="high" className="bg-slate-800">High</option>
                    <option value="urgent" className="bg-slate-800">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subject *</label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  placeholder="Brief description of your issue"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Message *</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Please provide as much detail as possible..."
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              {submitError && (
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-300">
                  <AlertCircle className="h-5 w-5" />
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:scale-105 transition-all shadow-lg shadow-purple-500/50"
              >
                <Send className="h-5 w-5" />
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Additional Resources */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-500/30">
            <Clock className="h-10 w-10 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Support Hours</h3>
            <p className="text-gray-300 mb-2">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
            <p className="text-gray-300 mb-2">Saturday: 10:00 AM - 4:00 PM EST</p>
            <p className="text-gray-300">Sunday: Closed</p>
            <p className="text-sm text-gray-400 mt-4">Email support available 24/7 with response within 24 hours</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30">
            <TrendingUp className="h-10 w-10 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">API Status</span>
                <span className="flex items-center gap-2 text-green-400">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">AI Services</span>
                <span className="flex items-center gap-2 text-green-400">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Video Processing</span>
                <span className="flex items-center gap-2 text-green-400">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Operational
                </span>
              </div>
            </div>
            <a href="#" className="inline-block mt-4 text-purple-400 hover:text-purple-300 text-sm font-medium">
              View detailed status →
            </a>
          </div>
        </div>
      </div>

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

export default HelpSupport;
