/**
 * Interview Detail Page - Full report view
 */
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const InterviewDetail = () => {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  // TODO: Implement interview detail logic
  // - Fetch interview data
  // - Display full report
  // - Handle actions (shortlist, reject, download PDF)

  // TODO: Replace with v0 generated interview detail UI
  // - Candidate info header
  // - Score breakdown (circular progress bars)
  // - AI evaluation section
  // - Cheating report
  // - Interview transcript
  // - Action buttons

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 pt-24">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        <h1 className="text-3xl font-bold text-white mb-4">Interview Detail - {id}</h1>
        <p className="text-gray-300 mb-8">TODO: Replace with v0 generated interview detail UI</p>
        {loading ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <p className="text-gray-300">Loading...</p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="text-white mb-2">Candidate Name</div>
            <div className="text-gray-300 mb-2">Overall Score: --/100</div>
            <div className="text-gray-300">Recommendation: --</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewDetail;
