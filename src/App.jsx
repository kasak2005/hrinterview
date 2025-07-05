import React, { useState } from 'react';
import InterviewSetup from './components/InterviewSetup.jsx';
import InterviewSession from './components/InterviewSession.jsx';
import InterviewResults from './components/InterviewResults.jsx';
import ConnectionStatus from './components/ConnectionStatus.jsx';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('setup'); // setup, interview, results
  const [sessionData, setSessionData] = useState(null);
  const [interviewResults, setInterviewResults] = useState(null);

  const handleStartInterview = (data) => {
    setSessionData(data);
    setCurrentView('interview');
  };

  const handleEndInterview = (sessionId, answers) => {
    setInterviewResults({ sessionId, answers });
    setCurrentView('results');
  };

  const handleRestart = () => {
    setSessionData(null);
    setInterviewResults(null);
    setCurrentView('setup');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'interview':
        return (
          <InterviewSession
            sessionData={sessionData}
            onEndInterview={handleEndInterview}
          />
        );
      case 'results':
        return (
          <InterviewResults
            sessionId={interviewResults.sessionId}
            answers={interviewResults.answers}
            onRestart={handleRestart}
          />
        );
      default:
        return <InterviewSetup onStartInterview={handleStartInterview} />;
    }
  };

  return (
    <div className="App">
      <ConnectionStatus />
      {renderCurrentView()}
    </div>
  );
}

export default App;