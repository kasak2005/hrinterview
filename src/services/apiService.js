import API_CONFIG from '../config/api.js';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.timeout = API_CONFIG.timeout;
    this.headers = API_CONFIG.headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      timeout: this.timeout,
      headers: { ...this.headers, ...options.headers },
      ...options,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // Interview API endpoints
  async getInterviewQuestions(jobRole, difficulty = 'medium') {
    return this.request('/api/questions', {
      method: 'POST',
      body: JSON.stringify({ job_role: jobRole, difficulty }),
    });
  }

  async submitAnswer(questionId, answer, sessionId) {
    return this.request('/api/submit-answer', {
      method: 'POST',
      body: JSON.stringify({
        question_id: questionId,
        answer: answer,
        session_id: sessionId,
      }),
    });
  }

  async getInterviewFeedback(sessionId) {
    return this.request(`/api/feedback/${sessionId}`, {
      method: 'GET',
    });
  }

  async startInterviewSession(jobRole, candidateName) {
    return this.request('/api/start-session', {
      method: 'POST',
      body: JSON.stringify({
        job_role: jobRole,
        candidate_name: candidateName,
      }),
    });
  }

  async endInterviewSession(sessionId) {
    return this.request('/api/end-session', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId }),
    });
  }

  // Health check endpoint
  async healthCheck() {
    return this.request('/api/health', {
      method: 'GET',
    });
  }
}

export default new ApiService();