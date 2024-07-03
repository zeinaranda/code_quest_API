const express = require('express');
const router = express.Router();
const { Question } = require('../models');
const Validator = require('fastest-validator');

const v = new Validator();

// Define validation schema
const schema = {
    content: 'string',
    choicesOne: 'string',
    choicesTwo: 'string',
    choicesThree: 'string',
    choicesFour: 'string',
    correctAnswer: 'string',
    knowledgeId: { type: 'number', optional: true, nullable: true },
    bossId: { type: 'number', optional: true, nullable: true },
};

router.post('/', async (req, res) => {
    // Validate request body
    const validationResult = v.validate(req.body, schema);

    if (validationResult.length > 0) {
        return res.status(400).json(validationResult);
    }

    try {
        // Create question in the database
        const question = await Question.create(req.body);
        return res.json(question);
    } catch (error) {
        console.error('Error creating question:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/:bossId', async(req, res) => {
    const bossId = req.params.bossId;
    const question = await Question.findAll({ where: { bossId: bossId } });
    return res.json(question || {});
});

router.get('/knowledge/:knowledgeId', async(req, res) => {
    const knowledgeId = req.params.knowledgeId;
    const question = await Question.findAll({ where: { knowledgeId: knowledgeId } });
    return res.json(question || {});
});

module.exports = router;
