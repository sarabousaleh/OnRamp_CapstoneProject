const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

router.get('/assessments', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Assessments');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching assessments:', err.message);
        res.status(500).json({ error: 'Server error while fetching assessments' });
    }
});

router.get('/assessments/:assessmentId', authenticateToken, async (req, res) => {
    const { assessmentId } = req.params;

    try {
        const questions = await pool.query(
            'SELECT * FROM questions WHERE assessment_id = $1',
            [assessmentId]
        );

        const questionIds = questions.rows.map(q => q.question_id);
        if (questionIds.length === 0) {
            return res.json({ questions: [] });
        }

        const options = await pool.query(
            'SELECT * FROM options WHERE question_id = ANY($1::int[])',
            [questionIds]
        );

        const questionsWithOptions = questions.rows.map(question => ({
            ...question,
            options: options.rows.filter(option => option.question_id === question.question_id)
        }));

        res.json({ questions: questionsWithOptions });
    } catch (err) {
        console.error('Error fetching questions and options:', err.message);
        res.status(500).json({ error: 'Server error while fetching questions and options' });
    }
});


router.post('/submit-assessment', authenticateToken, async (req, res) => {
    const { user_id } = req.user;
    const { answers, assessment_id } = req.body; // answers should be an array of { question_id, option_id }

    if (!Array.isArray(answers) || !assessment_id) {
        return res.status(400).json({ error: 'Invalid input format' });
    }

    try {
        // Insert the answers into the user_answers table
        const insertAnswersQuery = `
            INSERT INTO user_answers (user_id, question_id, option_id, assessment_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const insertAnswersPromises = answers.map(answer => {
            const { question_id, option_id } = answer;
            return pool.query(insertAnswersQuery, [user_id, question_id, option_id, assessment_id]);
        });

        const answersResults = await Promise.all(insertAnswersPromises);

        // Calculate the total score
        const optionIds = answers.map(answer => answer.option_id);
        const scoreQuery = `
            SELECT SUM(score) as total_score
            FROM options
            WHERE option_id = ANY($1::int[]);
        `;
        const scoreResult = await pool.query(scoreQuery, [optionIds]);
        const totalScore = scoreResult.rows[0].total_score;

        // Determine the user's mental health condition based on the total score
        let condition = '';
        if (totalScore < 5) {
            condition = 'Low risk';
        } else if (totalScore < 10) {
            condition = 'Moderate risk';
        } else if (totalScore < 15) {
            condition = 'High risk';
        } else {
            condition = 'Severe risk';
        }

        // Insert the assessment results into assessment_results table
        const insertResultQuery = `
            INSERT INTO assessment_results (user_id, assessment_id, total_score, mental_health_condition)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const result = await pool.query(insertResultQuery, [user_id, assessment_id, totalScore, condition]);

        res.json({ message: 'Answers submitted successfully', condition, answersResults, result: result.rows[0] });
    } catch (err) {
        console.error('Error submitting answers:', err.message);
        res.status(500).json({ error: 'Server error while submitting answers' });
    }
});


module.exports = router;