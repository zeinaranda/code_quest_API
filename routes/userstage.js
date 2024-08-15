const express = require('express');
const router = express.Router();
const { Op, fn, col } = require('sequelize');
const { UserStage, KnowledgeDone, BossDone, User, Stage, sequelize } = require('../models');

// const subCPMKDescriptions = {
//     1: [
//         { description: 'jenis parts of speech', stageId: 1 },
//         { description: 'membedakan ragam noun', stageId: 1 }
//     ],
//     2: [
//         { description: 'ciri pronoun', stageId: 2 },
//         { description: 'ragam pronoun', stageId: 2 }
//     ],
//     3: [
//         { description: 'indikator 3', stageId: 3 },
//         { description: 'indikaorr 3', stageId: 3 }
//     ],
//     4: [
//         { description: 'indikator 4', stageId: 4 },
//         { description: 'indikaorr 4', stageId: 4 }
//     ],
//     5: [
//         { description: 'indikator 5', stageId: 5 },
//         { description: 'indikaorr 5', stageId: 5 }
//     ],
//     // Add more entries as needed
// };


// post progress
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


// Rute untuk memeriksa status penyelesaian tahap
router.get('/progress/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Ambil data dari UserStage dengan asosiasi Stage
        const userStageData = await UserStage.findAll({
            where: { userId: userId },
            include: [{ model: Stage, attributes: ['stageId', 'nameStage'] }],  // Include Stage
            attributes: ['stageId', 'test', 'progressPoint'],
            order: [['stageId', 'ASC']]
        });

        // Ambil data dari KnowledgeDone untuk user tertentu dengan knowledgeId yang spesifik
        const knowledgeData = {};
        for (let knowledgeId = 1; knowledgeId <= 14; knowledgeId++) {
            const data = await KnowledgeDone.findOne({
                attributes: [
                    'knowledgeId',
                    [sequelize.fn('MAX', sequelize.col('point')), 'maxTestPoints']
                ],
                where: {
                    userId: userId,
                    knowledgeId: knowledgeId
                },
                group: ['knowledgeId']
            });

            knowledgeData[knowledgeId] = data ? data.get('maxTestPoints') : 0;
        }

        // Ambil data dari BossDone untuk user tertentu dengan bossId yang spesifik
        const bossData = {};
        for (let bossId = 1; bossId <= 7; bossId++) {
            const data = await BossDone.findOne({
                attributes: [
                    'bossId',
                    [sequelize.fn('MAX', sequelize.col('point')), 'maxTestPoints']
                ],
                where: {
                    userId: userId,
                    bossId: bossId
                },
                group: ['bossId']
            });

            bossData[bossId] = data ? data.get('maxTestPoints') : 0;
        }

        // Definisikan sub CPMK untuk setiap stageId
        const subCPMKDescriptions = {
            1: [
                { description: 'jenis-jenis parts of speech', knowledgeId: 1 },
                { description: 'ragam noun', knowledgeId: 2 }
            ],
            2: [
                { description: 'ciri singular & plural nouns', knowledgeId: 3 },
                { description: 'membedakan penggunaan article a / an untuk singular nouns.', knowledgeId: 4 }
            ],
            3: [
                { description: 'mengidentifikasi ciri pronoun', knowledgeId: 5 },
                { description: 'membedakan ragam pronoun.', knowledgeId: 6 }
            ],
            4: [
                { description: 'mengidentifikasi ciri adjective dan possessive adjective.', knowledgeId: 7 },
                { description: 'membedakan adjective dan possessive adjective.', knowledgeId: 8 }
            ],
            5: [
                { description: 'mengidentifikasi prepositions (in, on, at) untuk menunjukkan waktu dan tempat.', knowledgeId: 9 },
                { description: 'membedakan penggunaan prepositions in, on, at untuk menunjukkan waktu dan tempat.', knowledgeId: 10 }
            ],
            6: [
                { description: 'mengidentifikasi ciri gerunds dan infinitives', knowledgeId: 11 },
                { description: 'membedakan kata kerja yang diikuti oleh gerunds dan infinitives.', knowledgeId: 12 }
            ],
            7: [
                { description: 'mengidentifikasi ciri the, a / an dan membedakan penggunaan the, a / an untuk menerangkan kata benda.', knowledgeId: 13 },
                { description: 'mengidentifikasi penggunaan some dan any untuk countable & uncountable nouns. dan membedakan penggunaan some dan any untuk countable & uncountable nouns', knowledgeId: 14 }
            ]
        };

        // Definisikan default nameStage untuk setiap stageId
        const defaultStageNames = {
            1: 'Stage Satu',
            2: 'Stage Dua',
            3: 'Stage Tiga',
            4: 'Stage Empat',
            5: 'Stage Lima',
            6: 'Stage Enam',
            7: 'Stage Tujuh'
        };

        // Format data untuk ditampilkan dalam tabel
        const formattedData = [];
        const addedEntries = new Set(); // Set to prevent duplicate entries

        // Loop over each stageId from 1 to 7
        for (let stageId = 1; stageId <= 7; stageId++) {
            // Ambil data UserStage untuk stageId tertentu
            const userStage = userStageData.find(us => us.stageId == stageId);
            // Gunakan nama stage dari database atau default jika tidak ada
            const stageName = userStage ? userStage.Stage?.nameStage || defaultStageNames[stageId] : defaultStageNames[stageId];
            const subCPMKs = subCPMKDescriptions[stageId] || [];
            const ujianPoints = bossData[stageId] || 0;

            // Loop through subCPMKs and format the data
            subCPMKs.forEach((subCPMK, subIndex) => {
                const entryId = `${stageId}-${subCPMK.description}`; // Unique entry identifier

                if (!addedEntries.has(entryId)) {
                    const materiPembelajaran = (subIndex === 0) ? stageName : ''; // Set materiPembelajaran for the first subCPMK only
                    const tesPoints = knowledgeData[subCPMK.knowledgeId] || 0;

                    formattedData.push({
                        materiPembelajaran: materiPembelajaran,
                        subCPMK: subCPMK.description,
                        tes: tesPoints,
                        ujian: (subIndex === 0) ? ujianPoints : '' // Only include ujianPoints for the first subCPMK
                    });

                    addedEntries.add(entryId); // Mark entry as added
                }
            });
        }

        console.log('Formatted Data:', formattedData);

        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching progress data:', error);
        res.status(500).json({ error: 'An error occurred while fetching progress data' });
    }
});














router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['userId', 'nama']
        });
        console.log(users); // Tambahkan log untuk memeriksa data
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'An error occurred while fetching users' });
    }
});

module.exports = router;
