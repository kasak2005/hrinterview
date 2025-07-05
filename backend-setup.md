# Backend Setup Instructions

## Flask Backend Configuration

To ensure proper integration between the frontend and backend, please follow these steps:

### 1. Install Required Dependencies

Make sure your Flask backend has the following dependencies installed:

```bash
pip install flask flask-cors python-dotenv
```

### 2. Enable CORS in Flask Backend

Add the following to your Flask app (usually in `app.py` or `main.py`):

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:3000"])  # Add your frontend URLs

# Your existing routes...
```

### 3. Required API Endpoints

Ensure your backend implements these endpoints:

#### Health Check
```python
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Backend is running"})
```

#### Start Interview Session
```python
@app.route('/api/start-session', methods=['POST'])
def start_session():
    data = request.get_json()
    job_role = data.get('job_role')
    candidate_name = data.get('candidate_name')
    
    # Your session creation logic here
    session_id = "generated_session_id"  # Generate unique session ID
    
    return jsonify({
        "session_id": session_id,
        "message": "Session started successfully"
    })
```

#### Get Interview Questions
```python
@app.route('/api/questions', methods=['POST'])
def get_questions():
    data = request.get_json()
    job_role = data.get('job_role')
    difficulty = data.get('difficulty', 'medium')
    
    # Your question generation logic here
    questions = [
        {
            "id": 1,
            "text": "Tell me about yourself and your experience in " + job_role,
            "type": "behavioral"
        },
        # Add more questions...
    ]
    
    return jsonify({"questions": questions})
```

#### Submit Answer
```python
@app.route('/api/submit-answer', methods=['POST'])
def submit_answer():
    data = request.get_json()
    question_id = data.get('question_id')
    answer = data.get('answer')
    session_id = data.get('session_id')
    
    # Your answer processing logic here
    
    return jsonify({
        "message": "Answer submitted successfully",
        "question_id": question_id
    })
```

#### End Session
```python
@app.route('/api/end-session', methods=['POST'])
def end_session():
    data = request.get_json()
    session_id = data.get('session_id')
    
    # Your session ending logic here
    
    return jsonify({"message": "Session ended successfully"})
```

#### Get Feedback
```python
@app.route('/api/feedback/<session_id>', methods=['GET'])
def get_feedback(session_id):
    # Your feedback generation logic here
    
    feedback = {
        "overall_score": 85,
        "overall_feedback": "Great performance overall!",
        "question_feedback": [
            {
                "question": "Tell me about yourself",
                "score": 90,
                "feedback": "Excellent introduction with clear structure"
            }
        ],
        "strengths": [
            "Clear communication",
            "Good examples provided"
        ],
        "improvements": [
            "Could provide more specific metrics",
            "Consider using STAR method more consistently"
        ]
    }
    
    return jsonify(feedback)
```

### 4. Run the Backend

Start your Flask backend on port 5000:

```bash
python app.py
```

Or if using flask run:

```bash
export FLASK_APP=app.py
flask run --port=5000
```

### 5. Environment Variables

Create a `.env` file in your backend directory:

```
FLASK_ENV=development
FLASK_DEBUG=True
PORT=5000
```

## Testing the Integration

1. Start the Flask backend on port 5000
2. Start the frontend development server
3. The connection status indicator in the top-right should show "Backend Connected"
4. Try starting a mock interview to test the full integration

## Troubleshooting

- **CORS Issues**: Make sure CORS is properly configured with your frontend URL
- **Port Conflicts**: Ensure the backend is running on port 5000 or update the frontend API configuration
- **API Responses**: Check that your API responses match the expected format shown in the examples above