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

    useEffect(() => {
        const fetchAssessments = async () => {
            try {
                const response = await axios.get('http://localhost:5000/assessments');
                setAssessments(response.data);
            } catch (error) {
                console.error('Error fetching assessments:', error);
            }
        };

        fetchAssessments();
    }, []);

    const fetchQuestions = async (assessmentId) => {
        try {
            const response = await axios.get(`http://localhost:5000/assessments/${assessmentId}`);
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
        setAnswers(prevAnswers => {
            const existingAnswerIndex = prevAnswers.findIndex(
                answer => answer.question_id === questionId
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
            const response = await axios.post('http://localhost:5000/submit-assessment', payload);
            console.log('Response:', response.data);
            alert(`Your mental health condition is: ${response.data.condition}`);
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

    return (
        <>
        <ArrowHeader title="Assessments" />
        <div className="assess-page-container">
            
            <div className="assessments-container">
                <p>Choose an Assessment to start with!</p>
                <ul className="assessment-list">
                    {assessments.map(assessment => (
                        <li key={assessment.assessment_id} className="assessment-item">
                            <div
                                className="assessment-title"
                                onClick={() => handleAssessmentClick(assessment.assessment_id)}
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
                            <p className="assess-question-text">{questions[currentQuestionIndex].question_text}</p>
                            {questions[currentQuestionIndex].options.map(option => (
                                <div key={option.option_id} className="assess-option-item">
                                    <label className="assess-label">
                                        <input
                                            type="radio"
                                            name={`question_${questions[currentQuestionIndex].question_id}`}
                                            value={option.option_id}
                                            onChange={() => handleAnswerChange(questions[currentQuestionIndex].question_id, option.option_id)}
                                        />
                                        {option.option_text}
                                    </label>
                                </div>
                            ))}
                            <div className="assess-navigation-buttons">
                                <button className="assess-navigation-button" onClick={previousQuestion} disabled={currentQuestionIndex === 0}>Previous</button>
                                <button className="assess-navigation-button" onClick={nextQuestion} disabled={currentQuestionIndex === questions.length - 1}>Next</button>
                            </div>
                        </div>
                        {currentQuestionIndex === questions.length - 1 && (
                            <button className="assess-submit-button" onClick={handleSubmit}>Submit Answers</button>
                        )}
                    </div>
                )}
            </div>
            <div className="assess-image-container">
                <img src="https://i.pinimg.com/564x/9b/f4/06/9bf40657c69bd3c3e92d5a2e7df818fd.jpg" alt="Profile" />
            </div>
        </div>
        </>
    );
};

export default AssessmentsPage;