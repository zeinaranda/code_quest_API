var express = require('express');
var router = express.Router();
const Validator = require('fastest-validator');

const {Stage} = require('../models');

const v = new Validator();

//get data stage
router.get('/', async(req, res) => {
    const stage = await Stage.findAll();
    return res.json(stage);
});

//get data by id
router.get('/:stageId', async(req, res) => {
    const stageId = req.params.stageId;
    const stage = await Stage.findByPk(stageId);
    return res.json(stage || {});
});

//post stage
router.post('/', async (req, res) => {
    const schema = {
        nameStage: 'string',
        bgImage: 'string'
    }

    const validate = v.validate(req.body, schema);

    if (validate.length) {
        return res
        .status(400)
        .json(validate);
    }

    const stage = await Stage.create(req.body);

    res.json(stage);
});

// put stage
router.put('/:stageId', async (req, res) => {
const stageId = req.params.stageId;

let stage = await Stage.findByPk(stageId);

if (!stage) {
    return res.json({ message: 'Stage not found'});
}

const schema = {
    nameStage: 'string|optional',
    bgImage: 'string|optional'
}

const validate = v.validate(req.body, schema);

if (validate.length) {
    return res
    .status(400)
    .json(validate);
}
stage = await Stage.update(req.body);
res.json(stage);
});

//delete stage
router.delete('/:stageId', async(req, res) => {
    const stageId = req.params.stageId;
    const stage = await Stage.findByPk(stageId);

    if (!stage) {
        return res.json({ message: 'Stage not found'});
}
await stage.destroy();
res.json({
    message: 'Stage deleted'
});

});

module.exports = router;