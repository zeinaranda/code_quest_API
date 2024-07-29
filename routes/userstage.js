const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { UserStage, User, Stage } = require('../models');

// Endpoint untuk menambahkan atau mengupdate progress point
// router.post('/user/:userId/stage/:stageId/progress', async (req, res) => {
//     try {
//         const { userId, stageId } = req.params;
//         const { progressPoint } = req.body;

//         // Cari atau buat entri di UserStage
//         const [userStage, created] = await UserStage.findOrCreate({
//             where: { userId: userId, stageId: stageId },
//             defaults: { progressPoint: progressPoint }
//         });

//         // Jika entri sudah ada, update progressPoint
//         if (!created) {
//             userStage.progressPoint = progressPoint;
//             await userStage.save();
//         }

//         res.status(200).json(userStage);
//     } catch (error) {
//         res.status(500).json({ error: 'Terjadi kesalahan saat mengupdate progress point.' });
//     }
// });

router.post('/user/:userId/stage/:stageId/progress', async (req, res) => {
    try {
        const { userId, stageId } = req.params;
        const { progressPoint, test } = req.body;

        // Buat entri baru di UserStage
        const userStage = await UserStage.create({
            userId: userId,
            stageId: stageId,
            progressPoint: progressPoint,
            test: test
        });

        res.status(200).json(userStage);
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan saat menambah progress point.' });
    }
});


// Rute untuk memeriksa status penyelesaian tahap
router.get('/user/:userId/stage/:stageId/completion', async (req, res) => {
    try {
        const { userId, stageId } = req.params;

        // Cari entri di UserStage dengan skor >= 1120
        const userStage = await UserStage.findOne({
            where: {
                userId: userId,
                stageId: stageId,
                progressPoint: {
                    [Op.gte]: 1120
                },
            }
        });

        const isStageCompleted = !!userStage; // true jika userStage ditemukan, false jika tidak

        res.status(200).json({ stageCompleted: isStageCompleted });
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan saat memeriksa status penyelesaian tahap.' });
    }
});

router.get('/progress', async (req, res) => {
    try {
        const progressData = await UserStage.findAll({
            attributes: [
                'userId',
                'stageId',
                'test',
                'progressPoint',
                'createdAt',
                'updatedAt'
            ],
            include: {
                model: User,
                attributes: ['nama'], // Include user's name
            },
            order: [
                ['stageId'], // Order by stageId
                ['createdAt', 'ASC'], // Then order by createdAt ascending
            ]
        });

        res.json(progressData);
    } catch (error) {
        console.error('Error fetching progress data:', error);
        res.status(500).json({ error: 'An error occurred while fetching progress data' });
    }
});

module.exports = router;
