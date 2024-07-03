var express = require('express');
var router = express.Router();
const Validator = require('fastest-validator');

const {progress} = require('../models');

const v = new Validator();

router.get('/', async (req, res) => {
    try {
        const progressData = await progress.findAll({
            order: [
                ['ranking', 'DESC'],
                ['userId', 'ASC']
            ]
        });
        res.json(progressData);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching progress data' });
    }
});

module.exports = router;