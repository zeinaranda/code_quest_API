var express = require('express');
var router = express.Router();
const Validator = require('fastest-validator');

const {Course} = require('../models');

const v = new Validator();

router.get('/', async(req, res) => {
    const course = await Course.findAll();
    return res.json(course);
});

router.get('/:courseId', async(req, res) => {
    const courseId = req.params.courseId;
    const course = await Course.findByPk(courseId);
    return res.json(course || {});
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

    const course = await Course.create(req.body);

    res.json(course);
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