import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService.js';

const ConnectionStatus = () => {
  const [status, setStatus] = useState('checking'); // checking, connected, disconnected
  const [lastChecked, setLastChecked] = useState(null);

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    try {
      await apiService.healthCheck();
      setStatus('connected');
    } catch (error) {
      setStatus('disconnected');
    }
    setLastChecked(new Date());
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'disconnected': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected': return 'Backend Connected';
      case 'disconnected': return 'Backend Disconnected';
      default: return 'Checking Connection...';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-md p-3 flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
        <span className="text-sm font-medium text-gray-700">{getStatusText()}</span>
        {lastChecked && (
          <span className="text-xs text-gray-500">
            {lastChecked.toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default ConnectionStatus;