# 🤖 AI Recruiter Pro

AI-Powered Interview Platform with real-time monitoring, automated screening, and comprehensive candidate evaluation.

## 🚀 Quick Start

### Option 1: One-Click Start (Recommended)

**For Windows (PowerShell):**
```powershell
.\start-dev.ps1
```

**For Windows (Command Prompt):**
```cmd
start-dev.bat
```

**For Mac/Linux:**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

This will automatically:
- ✅ Create virtual environments if needed
- ✅ Install all dependencies
- ✅ Start both backend (port 8000) and frontend (port 5173) in separate windows

### Option 2: Using npm (Single Window - All Platforms)

```bash
# Install concurrently package (first time only)
npm install

# Run both servers in one terminal
npm run dev

# Or install all dependencies first
npm run install-all
npm run dev
```

**Alternative for Mac/Linux (Single Window):**
```bash
chmod +x start-dev-single.sh
./start-dev-single.sh
```

**Alternative for Windows (Single Window):**
```powershell
.\start-dev-single.ps1
```

### Option 3: Manual Start

**Backend:**
```powershell
cd backend
.\start.ps1
```

**Frontend (in a new terminal):**
```bash
cd frontend
npm install
npm run dev
```

## 📦 Tech Stack

**Frontend:**
- React 19 + Vite
- React Router v7
- Tailwind CSS v4
- Framer Motion
- Firebase Authentication
- Axios

**Backend:**
- FastAPI
- Firebase Admin SDK
- Groq AI (LLM)
- OpenCV (Face Detection)
- SpeechRecognition

## 🌐 Access Points

Once running, access the application at:

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs
- **API Alternative Docs:** http://localhost:8000/redoc

## 📋 Prerequisites

- Python 3.8 or higher
- Node.js 18 or higher
- Firebase project with credentials
- Groq API key (for AI features)

## ⚙️ Configuration

### Backend Setup

1. Add your Firebase service account JSON to `backend/firebase-service-account.json`
2. Create `backend/.env` with:
   ```env
   GROQ_API_KEY=your_groq_api_key
   FIREBASE_CREDENTIALS_PATH=firebase-service-account.json
   ```

### Frontend Setup

1. Create `frontend/.env` with:
   ```env
   VITE_API_URL=http://localhost:8000
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

## 🎯 Features

- ✨ AI-Powered Adaptive Interviews
- 👁️ Real-time Face Detection & Monitoring
- 📊 Instant Comprehensive Reports
- 🎤 Voice Analysis & Transcription
- 📄 Smart Resume Parsing
- 🔐 Role-Based Access Control (Candidate/Recruiter)
- 📈 Analytics Dashboard
- 🔒 Secure Authentication with Firebase

## 📚 Project Structure

```
├── backend/           # FastAPI backend
│   ├── routes/       # API endpoints
│   ├── services/     # Business logic
│   ├── models/       # Data models
│   └── middleware/   # Auth middleware
├── frontend/         # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│   └── public/
└── start-dev.*       # Development scripts
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.