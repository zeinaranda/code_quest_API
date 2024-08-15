const express = require('express');
const router = express.Router();
const { KnowledgeDone } = require('../models');
const Validator = require('fastest-validator');

const v = new Validator();

// Define validation schema
const schema = {
    quizDone: 'boolean',
    point: { type: 'number', optional: true },
    koin: { type: 'number', optional: true },
    knowledgeId: { type: 'number', optional: true },    
    userId: { type: 'number', optional: true }

};

// post knowledge done
router.post('/', async (req, res) => {
    // Validate request body
    const validationResult = v.validate(req.body, schema);

    if (validationResult.length > 0) {
        return res.status(400).json(validationResult);
    }

    try {
        // Create question in the database
        const knowledgedone = await KnowledgeDone.create(req.body);
        return res.json(knowledgedone);
    } catch (error) {
        console.error('Error creating question:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// get data by user id
router.get('/:userId', async(req, res) => {
    const userId = req.params.userId;
    const knowledgedone = await KnowledgeDone.findAll({ where: { userIdId: userId } });
    return res.json(knowledgedone || {});
});

// untuk check knowledge completion
router.get('/check/:userId', async (req, res) => {
    const { userId } = req.params;
    const knowledgeIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

    try {
        const knowledgeDone = await KnowledgeDone.findAll({
            where: {
                userId: userId,
                knowledgeId: knowledgeIds,
            }
        });

        const response = {
            knowledge1Completed: knowledgeDone.some(kd => kd.knowledgeId === 1),
            knowledge2Completed: knowledgeDone.some(kd => kd.knowledgeId === 2),
            knowledge3Completed: knowledgeDone.some(kd => kd.knowledgeId === 3),
            knowledge4Completed: knowledgeDone.some(kd => kd.knowledgeId === 4),
            knowledge5Completed: knowledgeDone.some(kd => kd.knowledgeId === 5),
            knowledge6Completed: knowledgeDone.some(kd => kd.knowledgeId === 6),
            knowledge7Completed: knowledgeDone.some(kd => kd.knowledgeId === 7),
            knowledge8Completed: knowledgeDone.some(kd => kd.knowledgeId === 8),
            knowledge9Completed: knowledgeDone.some(kd => kd.knowledgeId === 9),
            knowledge10Completed: knowledgeDone.some(kd => kd.knowledgeId === 10),
            knowledge11Completed: knowledgeDone.some(kd => kd.knowledgeId === 11),
            knowledge12Completed: knowledgeDone.some(kd => kd.knowledgeId === 12),
            knowledge13Completed: knowledgeDone.some(kd => kd.knowledgeId === 13),
            knowledge14Completed: knowledgeDone.some(kd => kd.knowledgeId === 14),

        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
