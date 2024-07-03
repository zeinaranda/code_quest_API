var express = require('express');
var router = express.Router();
const Validator = require('fastest-validator');

const {Ownedavatar} = require('../models');

const v = new Validator();

router.get('/', async(req, res) => {
    const ownedavatar = await Ownedavatar.findAll();
    return res.json(ownedavatar);
});


router.get('/avatars/:userId', (req, res) => {
    const userId = req.params.userId;
    const sql = `
        SELECT a.id, a.name, a.image_url,
            CASE WHEN ua.user_id IS NOT NULL THEN true ELSE false END AS owned
        FROM avatars a
        LEFT JOIN user_avatars ua ON a.id = ua.avatar_id AND ua.user_id = ?
    `;
    db.query(sql, [userId], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});


// router.get('/:ownedId', async(req, res) => {
//     const ownedId = req.params.ownedId;
//     const ownedavatar = await Ownedavatar.findByPk(ownedId);
//     return res.json(ownedavatar || {});
// });

// router.get('/user/:userId', async(req, res) => {
//     const userId = req.params.userId;
//     const ownedavatar = await Ownedavatar.findAll({ where: { userId: userId } });
//     return res.json(ownedavatar || {});
// });

// router.post('/', async (req, res) => {
//     const schema = {
//         userId: 'number',
//         avatarId: 'number',
//     }

//     const validate = v.validate(req.body, schema);

//     if (validate.length) {
//         return res
//         .status(400)
//         .json(validate);
//     }

//     const ownedavatar = await Ownedavatar.create(req.body);

//     res.json(ownedavatar);
// });

router.put('/:ownedId', async (req, res) => {
const ownedId = req.params.ownedId;

let ownedavatar = await Ownedavatar.findByPk(ownedId);

if (!ownedavatar) {
    return res.json({ message: 'User not found'});
}

const schema = {
    userId : 'number|optional',
    avatarId : 'number|optional'
}

const validate = v.validate(req.body, schema);

if (validate.length) {
    return res
    .status(400)
    .json(validate);
}
ownedavatar = await ownedavatar.update(req.body);
res.json(ownedavatar);
});

router.delete('/:ownedId', async(req, res) => {
    const ownedId = req.params.ownedId;
    const ownedavatar = await Ownedavatar.findByPk(ownedId);

    if (!ownedavatar) {
        return res.json({ message: 'User not found'});
}
await ownedavatar.destroy();
res.json({
    message: 'User deleted'
});

});

module.exports = router;