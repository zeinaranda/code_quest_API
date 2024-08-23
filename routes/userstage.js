const express = require('express');
const router = express.Router();
const { Op, fn, col } = require('sequelize');
const { UserStage, KnowledgeDone, BossDone, User, Stage, sequelize } = require('../models');
const XLSX = require('xlsx'); // Import the xlsx library



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
            include: [{ model: Stage, attributes: ['stageId', 'titleStage'] }],  // Include Stage
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
                { description: 'a. Mahasiswa mampu mengidentifikasi jenis-jenis parts of speech dalam bahasa Inggris.', knowledgeId: 1 },
                { description: 'b. Mahasiswa mampu mengidentifikasi dan membedakan ragam noun sebagai salah satu parts of speech.', knowledgeId: 2 }
            ],
            2: [
                { description: 'a. Mahasiswa mampu mengidentifikasi ciri singular & plural nouns.', knowledgeId: 3 },
                { description: 'b. Mahasiswa mampu membedakan penggunaan article a / an untuk singular nouns.', knowledgeId: 4 }
            ],
            3: [
                { description: 'a. Mahasiswa mampu mengidentifikasi ciri pronoun.', knowledgeId: 5 },
                { description: 'b. Mahasiswa mampu membedakan ragam pronoun.', knowledgeId: 6 }
            ],
            4: [
                { description: 'a. Mahasiswa mampu mengidentifikasi ciri adjective dan possessive adjective.', knowledgeId: 7 },
                { description: 'b. Mahasiswa mampu membedakan adjective dan possessive adjective.', knowledgeId: 8 }
            ],
            5: [
                { description: 'a. Mahasiswa mampu mengidentifikasi prepositions (in, on, at) untuk menunjukkan waktu dan tempat.', knowledgeId: 9 },
                { description: 'b. Mahasiswa mampu membedakan penggunaan prepositions in, on, at untuk menunjukkan waktu dan tempat. ', knowledgeId: 10 }
            ],
            6: [
                { description: 'a. Mahasiswa mampu mengidentifikasi ciri gerunds dan infinitives', knowledgeId: 11 },
                { description: 'b. Mahasiswa mampu membedakan kata kerja yang diikuti oleh gerunds dan infinitives. ', knowledgeId: 12 }
            ],
            7: [
                { description: 'a. Mahasiswa mampu mengidentifikasi ciri the, a / an dan membedakan penggunaan the, a / an untuk menerangkan kata benda.', knowledgeId: 13 },
                { description: 'b. Mahasiswa mampu mengidentifikasi penggunaan some dan any untuk countable & uncountable nouns dan membedakan penggunaan some dan any untuk countable & uncountable nouns', knowledgeId: 14 }
            ]
        };

        // Definisikan default titleStage untuk setiap stageId
        const defaultStageTitles = {
            1: 'Parts of Speech: Parts of Speech, Noun',
            2: 'Singular & Plural Nouns, Indefinite Articles (a /an).',
            3: 'Parts of Speech: Pronoun',
            4: 'Parts of Speech: Adjective, Possessive Adjective',
            5: 'Prepositions of time and place (in, on, at)',
            6: 'Gerunds and Infinitives',
            7: 'Definite and Indefinite Articles (the, a / an) & Expressions of quantity (some, any).'
        };

        // Format data untuk ditampilkan dalam tabel
        const formattedData = [];
        const addedEntries = new Set(); // Set to prevent duplicate entries

        // Loop over each stageId from 1 to 7
        for (let stageId = 1; stageId <= 7; stageId++) {
            // Ambil data UserStage untuk stageId tertentu
            const userStage = userStageData.find(us => us.stageId == stageId);
            // Gunakan nama stage dari database atau default jika tidak ada
            const stageTitle = userStage ? userStage.Stage?.titleStage || defaultStageTitles[stageId] : defaultStageTitles[stageId];
            const subCPMKs = subCPMKDescriptions[stageId] || [];
            let ujianPoints = bossData[stageId] || 0;

            // Terapkan rumus (point/80) * 4
            if (ujianPoints > 0) {
                ujianPoints = (ujianPoints / 80) * 4;
            }

            // Loop through subCPMKs and format the data
            subCPMKs.forEach((subCPMK, subIndex) => {
                const entryId = `${stageId}-${subCPMK.description}`; // Unique entry identifier

                if (!addedEntries.has(entryId)) {
                    const materiPembelajaran = (subIndex === 0) ? stageTitle : ''; // Set materiPembelajaran for the first subCPMK only
                    let tesPoints = knowledgeData[subCPMK.knowledgeId] || 0;

                    if (tesPoints > 0) {
                        tesPoints = (tesPoints / 40) * 25;
                    }

                    formattedData.push({
                        materiPembelajaran: materiPembelajaran,
                        subCPMK: subCPMK.description,
                        tes: tesPoints,
                        ujian: (subIndex === 0) ? ujianPoints.toFixed(2) : '' // Only include ujianPoints for the first subCPMK, fixed to 2 decimals
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














// Rute untuk mengambil pengguna dengan kategori A
router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll({
            where: { kategori: 'A' }, // Filter only category A users
            attributes: ['userId', 'nama']
        });
        console.log(users); // Tambahkan log untuk memeriksa data
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'An error occurred while fetching users' });
    }
});

router.get('/user', async (req, res) => {
    try {
        const users = await User.findAll({
            where: { kategori: 'B' }, // Filter only category A users
            attributes: ['userId', 'nama']
        });
        console.log(users); // Tambahkan log untuk memeriksa data
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'An error occurred while fetching users' });
    }
});




// Route to export progress data to Excel
router.get('/export-progress/:category', async (req, res) => {
    try {
        const { category } = req.params;

        // Fetch users based on category
        console.log(`Fetching users with category: ${category}`);
        const users = await User.findAll({
            where: { kategori: category },
            attributes: ['userId', 'nama']
        });

        console.log('Users:', users);

        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found for the specified category.' });
        }

        const allData = [];

        for (const user of users) {
            const userId = user.userId;
            const userName = user.nama;

            console.log(`Fetching stage data for user: ${userId}`);
            const userStageData = await UserStage.findAll({
                where: { userId: userId },
                include: [{ model: Stage, attributes: ['stageId', 'titleStage'] }],
                attributes: ['stageId', 'test', 'progressPoint'],
                order: [['stageId', 'ASC']]
            });

            console.log(`User ${userId} Stage Data:`, userStageData);

            // Fetch knowledge data
            const knowledgeData = {};
            for (let knowledgeId = 1; knowledgeId <= 14; knowledgeId++) {
                console.log(`Fetching knowledge data for user ${userId} and knowledgeId ${knowledgeId}`);
                const data = await KnowledgeDone.findOne({
                    attributes: [
                        'knowledgeId',
                        [sequelize.fn('MAX', sequelize.col('point')), 'maxTestPoints']
                    ],
                    where: { userId: userId, knowledgeId: knowledgeId },
                    group: ['knowledgeId']
                });

                knowledgeData[knowledgeId] = data ? data.get('maxTestPoints') : 0;
            }

            console.log(`User ${userId} Knowledge Data:`, knowledgeData);

            // Fetch boss data
            const bossData = {};
            for (let bossId = 1; bossId <= 7; bossId++) {
                console.log(`Fetching boss data for user ${userId} and bossId ${bossId}`);
                const data = await BossDone.findOne({
                    attributes: [
                        'bossId',
                        [sequelize.fn('MAX', sequelize.col('point')), 'maxTestPoints']
                    ],
                    where: { userId: userId, bossId: bossId },
                    group: ['bossId']
                });

                bossData[bossId] = data ? data.get('maxTestPoints') : 0;
            }

            console.log(`User ${userId} Boss Data:`, bossData);

            // Define subCPMKDescriptions and defaultStageTitles
            const subCPMKDescriptions = {
                1: [{ description: 'a. Mahasiswa mampu mengidentifikasi jenis-jenis parts of speech dalam bahasa Inggris.', knowledgeId: 1 }, { description: 'b. Mahasiswa mampu mengidentifikasi dan membedakan ragam noun sebagai salah satu parts of speech.', knowledgeId: 2 }],
                2: [{ description: 'a. Mahasiswa mampu mengidentifikasi ciri singular & plural nouns.', knowledgeId: 3 }, { description: 'b. Mahasiswa mampu membedakan penggunaan article a / an untuk singular nouns.', knowledgeId: 4 }],
                3: [{ description: 'a. Mahasiswa mampu mengidentifikasi ciri pronoun.', knowledgeId: 5 }, { description: 'b. Mahasiswa mampu membedakan ragam pronoun.', knowledgeId: 6 }],
                4: [{ description: 'a. Mahasiswa mampu mengidentifikasi ciri adjective dan possessive adjective.', knowledgeId: 7 }, { description: 'b. Mahasiswa mampu membedakan adjective dan possessive adjective.', knowledgeId: 8 }],
                5: [{ description: 'a. Mahasiswa mampu mengidentifikasi prepositions (in, on, at) untuk menunjukkan waktu dan tempat.', knowledgeId: 9 }, { description: 'b. Mahasiswa mampu membedakan penggunaan prepositions in, on, at untuk menunjukkan waktu dan tempat.', knowledgeId: 10 }],
                6: [{ description: 'a. Mahasiswa mampu mengidentifikasi ciri gerunds dan infinitives', knowledgeId: 11 }, { description: 'b. Mahasiswa mampu membedakan kata kerja yang diikuti oleh gerunds dan infinitives.', knowledgeId: 12 }],
                7: [{ description: 'a. Mahasiswa mampu mengidentifikasi ciri the, a / an dan membedakan penggunaan the, a / an untuk menerangkan kata benda.', knowledgeId: 13 }, { description: 'b. Mahasiswa mampu mengidentifikasi penggunaan some dan any untuk countable & uncountable nouns dan membedakan penggunaan some dan any untuk countable & uncountable nouns', knowledgeId: 14 }]
            };

            const defaultStageTitles = {
                1: 'Parts of Speech: Parts of Speech, Noun',
                2: 'Singular & Plural Nouns, Indefinite Articles (a /an).',
                3: 'Parts of Speech: Pronoun',
                4: 'Parts of Speech: Adjective, Possessive Adjective',
                5: 'Prepositions of time and place (in, on, at)',
                6: 'Gerunds and Infinitives',
                7: 'Definite and Indefinite Articles (the, a / an) & Expressions of quantity (some, any).'
            };

            // Format data
            const formattedData = [];
            const addedEntries = new Set();

            for (let stageId = 1; stageId <= 7; stageId++) {
                const userStage = userStageData.find(us => us.stageId == stageId);
                const stageTitle = userStage ? userStage.Stage?.titleStage || defaultStageTitles[stageId] : defaultStageTitles[stageId];
                const subCPMKs = subCPMKDescriptions[stageId] || [];
                const ujianPoints = bossData[stageId] || 0;

                subCPMKs.forEach((subCPMK, subIndex) => {
                    const entryId = `${stageId}-${subCPMK.description}`;

                    if (!addedEntries.has(entryId)) {
                        const materiPembelajaran = (subIndex === 0) ? stageTitle : '';
                        const tesPoints = knowledgeData[subCPMK.knowledgeId] || 0;

                        // Apply formula for knowledge check and exam result
                        const knowledgeCheck = (tesPoints / 40) * 25;
                        const ujian = (ujianPoints / 80) * 4;


                        formattedData.push({
                            userName,
                            materiPembelajaran: materiPembelajaran,
                            subCPMK: subCPMK.description,
                            knowledgeCheck: knowledgeCheck,
                            ujian: (subIndex === 0) ? ujian : ''
                        });

                        addedEntries.add(entryId);
                    }
                });
            }

            console.log(`User ${userId} Formatted Data:`, formattedData);

            allData.push(...formattedData);
        }

        if (allData.length === 0) {
            return res.status(404).json({ message: 'No data found to export.' });
        }

        // Convert data to worksheet
        const ws = XLSX.utils.json_to_sheet(allData);

        // Customize the worksheet: merge cells and set alignment
        const mergeCells = [];
        const numRows = allData.length;
        let rowIndex = 1; // Start merging from row 2 (index 1)

        // Merge userName every 14 rows starting from row 2
        while (rowIndex < numRows) {
            mergeCells.push({ s: { r: rowIndex, c: 0 }, e: { r: Math.min(rowIndex + 13, numRows - 1), c: 0 } });
            rowIndex += 14;
        }

        // Merge materiPembelajaran every 2 rows
        rowIndex = 1; // Start merging from row 2 (index 1)
        while (rowIndex < numRows) {
            mergeCells.push({ s: { r: rowIndex, c: 1 }, e: { r: Math.min(rowIndex + 1, numRows - 1), c: 1 } });
            rowIndex += 2;
        }

        // Merge ujian every 2 rows
        rowIndex = 1; // Start merging from row 2 (index 1)
        while (rowIndex < numRows) {
            mergeCells.push({ s: { r: rowIndex, c: 4 }, e: { r: Math.min(rowIndex + 1, numRows - 1), c: 4 } });
            rowIndex += 2;
        }

        ws['!merges'] = mergeCells;

        // Set vertical alignment for all cells
        Object.keys(ws).forEach(key => {
            if (key[0] === '!') return; // Skip special keys
            const cell = ws[key];
            if (!cell.s) cell.s = {}; // Initialize cell style
            if (!cell.s.alignment) cell.s.alignment = {}; // Initialize alignment
            cell.s.alignment.vertical = 'center'; // Set vertical alignment
        });

        // Create workbook and append sheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'ProgressData');

        // Send Excel file as response
        res.setHeader('Content-Disposition', 'attachment; filename=progress_data.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.end(XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' }));

    } catch (error) {
        console.error('Error exporting progress data:', error);
        res.status(500).json({ error: 'An error occurred while exporting progress data' });
    }
});

module.exports = router;
