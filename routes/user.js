var express = require('express');
var router = express.Router();
const Validator = require('fastest-validator');

const {User} = require('../models');

const v = new Validator();

router.get('/', async(req, res) => {
    const user = await User.findAll();
    return res.json(user);
});

router.get('/:userId', async(req, res) => {
    const userId = req.params.userId;
    const user = await User.findByPk(userId);
    return res.json(user || {});
});

router.post('/', async (req, res) => {
    const schema = {
        nim: 'string',
        nama: 'string',
        password: 'string'
    }

    const validate = v.validate(req.body, schema);

    if (validate.length) {
        return res
        .status(400)
        .json(validate);
    }

    const user = await User.create(req.body);

    res.json(user);
});

router.put('/:userId', async (req, res) => {
const userId = req.params.userId;

let user = await User.findByPk(userId);

if (!user) {
    return res.json({ message: 'User not found'});
}

const schema = {
    nim: 'string|optional',
    nama: 'string|optional',
    password: 'string|optional'
}

const validate = v.validate(req.body, schema);

if (validate.length) {
    return res
    .status(400)
    .json(validate);
}
user = await user.update(req.body);
res.json(user);
});

router.delete('/:userId', async(req, res) => {
    const userId = req.params.userId;
    const user = await User.findByPk(userId);

    if (!user) {
        return res.json({ message: 'User not found'});
}
await user.destroy();
res.json({
    message: 'User deleted'
});

});

module.exports = router;