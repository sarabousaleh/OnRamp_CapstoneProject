import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AssessmentsPage.css';
import ArrowHeader from '../../components/ArrowHeader/ArrowHeader';

axios.defaults.withCredentials = true; // Ensure credentials (cookies) are sent with every request

const AssessmentsPage = () => {
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [result, setResult] = useState(null); // State to store the result
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await axios.get(`${backendUrl}/assessments`);
        setAssessments(response.data);
      } catch (error) {
        console.error('Error fetching assessments:', error);
      }
    };

    fetchAssessments();
  }, []);

  const fetchQuestions = async (assessmentId) => {
    try {
      const response = await axios.get(
        `${backendUrl}/assessments/${assessmentId}`
      );
      setQuestions(response.data.questions);
      setCurrentQuestionIndex(0); // Reset to the first question
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleAssessmentClick = (assessmentId) => {
    setSelectedAssessment(assessmentId);
    fetchQuestions(assessmentId);
  };

  const handleAnswerChange = (questionId, optionId) => {
    setAnswers((prevAnswers) => {
      const existingAnswerIndex = prevAnswers.findIndex(
        (answer) => answer.question_id === questionId
      );

      if (existingAnswerIndex >= 0) {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingAnswerIndex].option_id = optionId;
        return updatedAnswers;
      }

      return [...prevAnswers, { question_id: questionId, option_id: optionId }];
    });
  };

  const handleSubmit = async () => {
    const payload = { answers, assessment_id: selectedAssessment };
    console.log('Payload:', payload);

    try {
      const response = await axios.post(
        `${backendUrl}/submit-assessment`,
        payload
      );
      setResult(response.data.condition);
      setShowModal(true);
    } catch (error) {
      console.error('Error submitting answers:', error);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const getAdvice = (condition) => {
    switch (condition) {
      case 'Depression':
        return 'We advise you to consider seeking support from a mental health professional, practicing self-care, and staying connected with loved ones.';
      case 'Anxiety':
        return 'We advise you to try relaxation techniques such as deep breathing exercises, mindfulness meditation, and regular physical activity.';
      case 'Stress':
        return 'We advise you to identify stressors and develop healthy coping mechanisms, such as time management, hobbies, and talking to a therapist.';
      case 'Healthy':
        return 'We advise you to maintain a balanced lifestyle with regular exercise, a healthy diet, sufficient sleep, and strong social connections.';
      default:
        return 'We advise you to consult with a healthcare professional for personalized advice and support.';
    }
  };

  return (
    <>
      <ArrowHeader title="Assessments" />
      <div className="assess-page-container">
        <div className="assessments-container">
          <p>Choose an Assessment to start with!</p>
          <ul className="assessment-list">
            {assessments.map((assessment) => (
              <li key={assessment.assessment_id} className="assessment-item">
                <div
                  className="assessment-title"
                  onClick={() =>
                    handleAssessmentClick(assessment.assessment_id)
                  }
                >
                  {assessment.name}
                </div>
              </li>
            ))}
          </ul>

          {selectedAssessment && questions.length > 0 && (
            <div className="assess-questions-container">
              <h2 className="assess-subtitle">Questions</h2>
              <div className="assess-question-card">
                <p className="assess-question-text">
                  {questions[currentQuestionIndex].question_text}
                </p>
                {questions[currentQuestionIndex].options.map((option) => (
                  <div key={option.option_id} className="assess-option-item">
                    <label className="assess-label">
                      <input
                        type="radio"
                        name={`question_${questions[currentQuestionIndex].question_id}`}
                        value={option.option_id}
                        onChange={() =>
                          handleAnswerChange(
                            questions[currentQuestionIndex].question_id,
                            option.option_id
                          )
                        }
                      />
                      {option.option_text}
                    </label>
                  </div>
                ))}
                <div className="assess-navigation-buttons">
                  <button
                    className="assess-navigation-button"
                    onClick={previousQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </button>
                  <button
                    className="assess-navigation-button"
                    onClick={nextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                  >
                    Next
                  </button>
                </div>
              </div>
              {currentQuestionIndex === questions.length - 1 && (
                <button className="assess-submit-button" onClick={handleSubmit}>
                  Submit Answers
                </button>
              )}
            </div>
          )}
        </div>
        <div className="assess-image-container">
          <img
            src="https://i.pinimg.com/564x/9b/f4/06/9bf40657c69bd3c3e92d5a2e7df818fd.jpg"
            alt="Profile"
          />
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>Assessment Result</h2>
            <p>
              Your mental health condition is: <strong>{result}</strong>
            </p>
            <p>{getAdvice(result)}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default AssessmentsPage;
