import React, { useEffect, useState } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true; // Ensure credentials (cookies) are sent with every request

const AssessmentsPage = () => {
    const [assessments, setAssessments] = useState([]);
    const [selectedAssessment, setSelectedAssessment] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);

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
    
    
    

    return (
        <div>
            <h1>Assessments</h1>
            <ul>
                {assessments.map(assessment => (
                    <li key={assessment.assessment_id}>
                        <button onClick={() => handleAssessmentClick(assessment.assessment_id)}>
                            {assessment.name}
                        </button>
                    </li>
                ))}
            </ul>

            {selectedAssessment && (
                <div>
                    <h2>Questions</h2>
                    {questions.map(question => (
                        <div key={question.question_id}>
                            <p>{question.question_text}</p>
                            {question.options.map(option => (
                                <div key={option.option_id}>
                                    <label>
                                        <input
                                            type="radio"
                                            name={`question_${question.question_id}`}
                                            value={option.option_id}
                                            onChange={() => handleAnswerChange(question.question_id, option.option_id)}
                                        />
                                        {option.option_text}
                                    </label>
                                </div>
                            ))}
                        </div>
                    ))}
                    <button onClick={handleSubmit}>Submit Answers</button>
                </div>
            )}
        </div>
    );
};

export default AssessmentsPage;
