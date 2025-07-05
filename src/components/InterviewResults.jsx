import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService.js';

const InterviewResults = ({ sessionId, answers, onRestart }) => {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeedback();
  }, [sessionId]);

  const fetchFeedback = async () => {
    try {
      const feedbackData = await apiService.getInterviewFeedback(sessionId);
      setFeedback(feedbackData);
    } catch (err) {
      setError('Failed to load interview feedback');
      console.error('Error fetching feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Analyzing your interview performance...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Results</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={onRestart}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Start New Interview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Interview Complete! 🎉</h1>
          <p className="text-gray-600">Here's your detailed performance analysis</p>
        </div>

        {/* Overall Score */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBgColor(feedback?.overall_score || 0)} mb-4`}>
              <span className={`text-3xl font-bold ${getScoreColor(feedback?.overall_score || 0)}`}>
                {feedback?.overall_score || 0}
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Overall Score</h2>
            <p className="text-gray-600">{feedback?.overall_feedback || 'Great job completing the interview!'}</p>
          </div>
        </div>

        {/* Detailed Feedback */}
        {feedback?.question_feedback && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Question-by-Question Analysis</h3>
            <div className="space-y-6">
              {feedback.question_feedback.map((item, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-800">Question {index + 1}</h4>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${getScoreBgColor(item.score)} ${getScoreColor(item.score)}`}>
                      {item.score}/100
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2 italic">"{item.question}"</p>
                  <p className="text-gray-700">{item.feedback}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strengths and Areas for Improvement */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-3">✅ Strengths</h3>
            <ul className="space-y-2">
              {feedback?.strengths?.map((strength, index) => (
                <li key={index} className="text-green-700">• {strength}</li>
              )) || [
                <li key="default" className="text-green-700">• Completed all questions</li>
              ]}
            </ul>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-orange-800 mb-3">🎯 Areas for Improvement</h3>
            <ul className="space-y-2">
              {feedback?.improvements?.map((improvement, index) => (
                <li key={index} className="text-orange-700">• {improvement}</li>
              )) || [
                <li key="default" className="text-orange-700">• Continue practicing interview skills</li>
              ]}
            </ul>
          </div>
        </div>

        {/* Your Answers Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Answers Summary</h3>
          <div className="space-y-4">
            {answers.map((answer, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-800">Question {index + 1}</h4>
                  <span className="text-sm text-gray-500">
                    {new Date(answer.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-gray-600 mb-2 italic">"{answer.question}"</p>
                <p className="text-gray-700">{answer.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">What's Next?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onRestart}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Take Another Interview
            </button>
            <button
              onClick={() => window.print()}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Print Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewResults;