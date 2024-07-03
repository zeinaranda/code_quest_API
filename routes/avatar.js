const express = require('express');
const router = express.Router();
const Validator = require('fastest-validator');
const multer = require('multer');
const { Avatar, User, Ownedavatar, sequelize } = require('../models');
// const { Avatar } = require('../models');

// const storage = multer.diskStorage({
//     destination: './upload/images',
//     filename: (req, file, cb) => {
//         cb(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
//     }
// });

// const upload = multer({ storage: storage });
 const v = new Validator();

// router.use('/imageAvatar', express.static('upload/images'));

router.get('/avatars/:userId', async (req, res) => {
    const userId = req.params.userId;
    const avatars = await Avatar.findAll({
        include: [{
            model: User,
            where: { userId },
            required: false,
            attributes: []
        }],
        attributes: {
            include: [
                [sequelize.fn('COUNT', sequelize.col('User.userId')), 'owned']
            ]
        },
        group: ['Avatar.avatarId']
    });

    const response = avatars.map(avatar => ({
        id: avatar.avatarId,
        name: avatar.namaAvatar,
        image_url: avatar.imageAvatar,
        owned: avatar.dataValues.owned > 0
    }));

    res.json(response);
});



router.post("/", async (req, res) => {
    // Define schema without imageAvatar
    const schema = {
        namaAvatar: { type: "string", empty: false },
        obtainMethod: { type: "string", empty: false },
        priceAvatar: { type: 'number', integer: true },
        stageId: { type: "number", integer: true, nullable: true },
        imageAvatar: { type: "string", empty: false },
    };

    // Cast priceAvatar and stageId to numbers if present
    if (req.body.priceAvatar) {
        req.body.priceAvatar = Number(req.body.priceAvatar);
    }
    if (req.body.stageId) {
        req.body.stageId = Number(req.body.stageId);
    }

    const validate = v.validate(req.body, schema);

    if (validate.length) {
        return res
        .status(400)
        .json(validate);
    }

    const avatar = await Avatar.create(req.body);

    res.json(avatar);
});

    // Add imageAvatar file name to req.body if the file exists





router.get('/', async (req, res) => {
    try {
        const avatars = await Avatar.findAll();

        return res.status(200).json({
            error: 0,
            message: 'success',
            data: avatars
        });
    } catch (error) {
        console.error('Error fetching avatars:', error);
        return res.status(500).json({ error: 1, message: 'Terjadi kesalahan saat mengambil daftar avatar' });
    }
});


router.get('/avatars', async (req, res) => {
    try {
        const avatars = await Avatar.findAll();

        // Membentuk array objek avatar sesuai format yang diharapkan
        const formattedAvatars = avatars.map(avatar => ({
            avatarId: avatar.avatarId,
            namaAvatar: avatar.namaAvatar,
            priceAvatar: avatar.priceAvatar,
            imageAvatar: avatar.imageAvatar,
            obtainMethod: avatar.obtainMethod,
            createdAt: avatar.createdAt,
            updatedAt: avatar.updatedAt,
            stageId: avatar.stageId
        }));

        return res.status(200).json(formattedAvatars);
    } catch (error) {
        console.error('Error fetching avatars:', error);
        return res.status(500).json({ error: 1, message: 'Terjadi kesalahan saat mengambil daftar avatar' });
    }
});


router.get('/:avatarId', async(req, res) => {
    const avatarId = req.params.avatarId;
    const avatar = await Avatar.findByPk(avatarId);
    return res.json(avatar || {});
});

router.get('/method/:obtainMethod', async(req, res) => {
    const obtainMethod = req.params.obtainMethod;
    const avatar = await Avatar.findAll({ where: { obtainMethod: obtainMethod } });
    return res.json(avatar || {});
});


router.put('/:avatarId', async (req, res) => {
const avatarId = req.params.avatarId;

let avatar = await Avatar.findByPk(avatarId);

if (!avatar) {
    return res.json({ message: 'User not found'});
}

const schema = {
    namaAvatar: { type: "string", empty: false, optional:true },
        obtainMethod: { type: "string", empty: false, optional:true },
        priceAvatar: { type: 'number', integer:true, optional:true},
        stageId: { type: "number", integer:true, optional:true}
}
if (req.body.priceAvatar) {
    req.body.priceAvatar = Number(req.body.priceAvatar);
}
if (req.body.stageId) {
    req.body.stageId = Number(req.body.stageId);
}

const validate = v.validate(req.body, schema);

if (validate.length) {
    return res
    .status(400)
    .json(validate);
}
avatar = await avatar.update(req.body);
res.json(avatar);
});

router.delete('/:avatarId', async(req, res) => {
    const avatarId = req.params.avatarId;
    const avatar = await Avatar.findByPk(avatarId);

    if (!avatar) {
        return res.json({ message: 'User not found'});
}
await avatar.destroy();
res.json({
    message: 'User deleted'
});

});

module.exports = router;

