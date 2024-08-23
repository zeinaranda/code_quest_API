const express = require('express');
const router = express.Router();
const { BossDone } = require('../models');
const Validator = require('fastest-validator');
const { Op } = require('sequelize');


const v = new Validator();

// Define validation schema
const schema = {
    quizDone: 'boolean',
    point: { type: 'number', optional: true },
    koin: { type: 'number', optional: true },
    bossId: { type: 'number', optional: true },    
    userId: { type: 'number', optional: true }

};

router.post('/', async (req, res) => {
    // Validate request body
    const validationResult = v.validate(req.body, schema);

    if (validationResult.length > 0) {
        return res.status(400).json(validationResult);
    }

    try {
        // Create question in the database
        const bossdone = await BossDone.create(req.body);
        return res.json(bossdone);
    } catch (error) {
        console.error('Error creating question:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/:userId', async(req, res) => {
    const userId = req.params.userId;
    const bossdone = await BossDone.findAll({ where: { userIdId: userId } });
    return res.json(bossdone || {});
});

router.get('/check/:userId', async (req, res) => {
    const { userId } = req.params;
    const bossIds = [1, 2, 3, 4, 5, 6, 7];

    try {
        const bossDone = await BossDone.findAll({
            where: {
                userId: userId,
                bossId: bossIds,
            }
        });

        const response = {
            boss1Completed: bossDone.some(kd => kd.bossId === 1),
            boss2Completed: bossDone.some(kd => kd.bossId === 2),
            boss3Completed: bossDone.some(kd => kd.bossId === 3),
            boss4Completed: bossDone.some(kd => kd.bossId === 4),
            boss5Completed: bossDone.some(kd => kd.bossId === 5),
            boss6Completed: bossDone.some(kd => kd.bossId === 6),
            boss7Completed: bossDone.some(kd => kd.bossId === 7),
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/user/:userId/stage/:bossId/completion', async (req, res) => {
    try {
        const { userId, bossId } = req.params;

        // Cari entri di BossDone dengan skor >= 1120
        const bossDone = await BossDone.findOne({
            where: {
                userId: userId,
                bossId: bossId,
                point: { [Op.gte]: 1120 }
            }
        });

        const isStageCompleted = !!bossDone; // true jika BossDone ditemukan, false jika tidak

        res.status(200).json({ stageCompleted: isStageCompleted });
    } catch (error) {
        console.error('Error checking stage completion:', error); // Log error to console for debugging
        res.status(500).json({ error: 'Terjadi kesalahan saat memeriksa status penyelesaian tahap.' });
    }
});

module.exports = router;
