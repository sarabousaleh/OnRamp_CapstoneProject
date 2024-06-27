import React, { useEffect, useState } from "react";
import ArrowHeader from '../../components/ArrowHeader/ArrowHeader';

const AssessmentsPage = () => {
    const [assessments, setAssessments] = useState([]);
    const [userAnswers, setUserAnswers] = useState({}); // To store user answers

    useEffect(() => {
        fetch('/api/assessments')
            .then(response => response.json())
            .then(data => setAssessments(data))
            .catch(error => console.error('Error fetching assessments:', error));
    }, []);

    const handleAnswerChange = (question_id, option_id) => {
        setUserAnswers(prevAnswers => ({
            ...prevAnswers,
            [question_id]: option_id
        }));
    };

    const handleSubmit = (assessment_id) => {
        const answers = Object.keys(userAnswers).map(question_id => ({
            question_id: parseInt(question_id),
            option_id: userAnswers[question_id]
        }));

        fetch('/api/user_assessment_results', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: 1, // Replace with actual user ID
                assessment_id,
                answers
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Assessment submitted successfully:', data);
        })
        .catch(error => console.error('Error submitting assessment:', error));
    };

    return (
        <div>
            <ArrowHeader title="Assessments" />
            <div>
                {assessments.map(assessment => (
                    <div key={assessment.assessment_id}>
                        <h2>{assessment.name}</h2>
                        <p>{assessment.description}</p>
                        {assessment.questions.map(question => (
                            <div key={question.question_id}>
                                <p>{question.question_text}</p>
                                {question.options.map(option => (
                                    <label key={option.option_id}>
                                        <input
                                            type="radio"
                                            name={`question_${question.question_id}`}
                                            value={option.option_id}
                                            onChange={() => handleAnswerChange(question.question_id, option.option_id)}
                                        />
                                        {option.option_text}
                                    </label>
                                ))}
                            </div>
                        ))}
                        <button onClick={() => handleSubmit(assessment.assessment_id)}>Submit</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AssessmentsPage;