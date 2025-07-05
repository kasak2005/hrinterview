import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService.js';

const InterviewSession = ({ sessionData, onEndInterview }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes per question
  const [isRecording, setIsRecording] = useState(false);

  const { questions, sessionId, candidateName, jobRole } = sessionData;
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextQuestion();
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      alert('Please provide an answer before proceeding.');
      return;
    }

    setLoading(true);

    try {
      await apiService.submitAnswer(currentQuestion.id, answer, sessionId);
      
      const newAnswer = {
        questionId: currentQuestion.id,
        question: currentQuestion.text,
        answer: answer,
        timestamp: new Date().toISOString(),
      };
      
      setAnswers([...answers, newAnswer]);
      handleNextQuestion();
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('Failed to submit answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswer('');
      setTimeLeft(300);
    } else {
      handleFinishInterview();
    }
  };

  const handleFinishInterview = async () => {
    setLoading(true);
    
    try {
      await apiService.endInterviewSession(sessionId);
      onEndInterview(sessionId, answers);
    } catch (error) {
      console.error('Error ending interview:', error);
      onEndInterview(sessionId, answers);
    }
  };

  const handleSkipQuestion = () => {
    const skippedAnswer = {
      questionId: currentQuestion.id,
      question: currentQuestion.text,
      answer: '[Skipped]',
      timestamp: new Date().toISOString(),
    };
    
    setAnswers([...answers, skippedAnswer]);
    handleNextQuestion();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Mock Interview Session</h1>
              <p className="text-gray-600">Candidate: {candidateName} | Role: {jobRole}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{formatTime(timeLeft)}</div>
              <div className="text-sm text-gray-500">Time remaining</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
                {currentQuestionIndex + 1}
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Interview Question</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">{currentQuestion?.text}</p>
          </div>

          {/* Answer Input */}
          <div className="mb-6">
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
              Your Answer
            </label>
            <textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
              placeholder="Type your answer here... Be specific and provide examples where possible."
            />
            <div className="text-right mt-2">
              <span className="text-sm text-gray-500">{answer.length} characters</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleSkipQuestion}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Skip Question
            </button>
            
            <div className="flex space-x-4">
              <button
                onClick={handleSubmitAnswer}
                disabled={loading || !answer.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : currentQuestionIndex === questions.length - 1 ? (
                  'Finish Interview'
                ) : (
                  'Next Question'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tips Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">💡 Interview Tips</h3>
          <ul className="text-blue-700 space-y-1 text-sm">
            <li>• Use the STAR method (Situation, Task, Action, Result) for behavioral questions</li>
            <li>• Provide specific examples from your experience</li>
            <li>• Think out loud to show your problem-solving process</li>
            <li>• Take your time to structure your thoughts before answering</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;