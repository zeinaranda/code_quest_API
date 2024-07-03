

const express = require('express');
const router = express.Router();
const { Storytelling, Avatar, Stage } = require('../models');
const Validator = require('fastest-validator');
const v = new Validator();

router.get('/', async (req, res) => {
  try {
    const storytelling = await Storytelling.findAll();
    return res.json(storytelling);
  } catch (error) {
    console.error('Error fetching storytelling:', error);
    res.status(500).json({ message: 'Failed to fetch storytelling' });
  }
});

router.get('/:storyId', async (req, res) => {
  const storyId = req.params.storyId;
  try {
    const storytelling = await Storytelling.findByPk(storyId);
    return res.json(storytelling || {});
  } catch (error) {
    console.error(`Error fetching storytelling with ID ${storyId}:`, error);
    res.status(500).json({ message: 'Failed to fetch storytelling' });
  }
});

router.get('/code/:codeScene', async (req, res) => {
  const codeScene = req.params.codeScene;
  try {
    const storytelling = await Storytelling.findAll({
      where: { codeScene },
      include: [
        {
          model: Avatar,
          as: 'avatar',
          attributes: ['namaAvatar', 'imageAvatar']
        },
        {
          model: Stage,
          as: 'stage',
          attributes: ['bgImage']
        }
      ]
    });

    // Map through the storytelling array to format the results as required
    const formattedStorytelling = storytelling.map(story => ({
      storyId: story.storyId,
      text: story.text,
      stageId: story.stageId,
      avatarId: story.avatarId,
      createdAt: story.createdAt,
      updatedAt: story.updatedAt,
      codeScene: story.codeScene,
      namaAvatar: story.avatar ? story.avatar.namaAvatar : null,
      imageAvatar: story.avatar ? story.avatar.imageAvatar : null,
      bgImage: story.stage ? story.stage.bgImage : null
    }));

    // Check if formattedStorytelling has elements and return appropriately
    if (formattedStorytelling.length > 0) {
      return res.json(formattedStorytelling);
    } else {
      return res.json([]); // Mengirimkan array kosong jika tidak ada data
    }
  } catch (error) {
    console.error(`Error fetching storytelling for code scene ${codeScene}:`, error);
    res.status(500).json({ message: 'Failed to fetch storytelling' });
  }
});

  
  

router.post('/', async (req, res) => {
  const schema = {
    text: 'string',
    stageId: { type: 'number', optional: true, nullable: true },
    avatarId: { type: 'number', optional: true, nullable: true },
    codeScene: 'string',
  };

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res.status(400).json(validate);
  }

  try {
    const storytelling = await Storytelling.create(req.body);
    res.json(storytelling);
  } catch (error) {
    console.error('Error creating storytelling:', error);
    res.status(500).json({ message: 'Failed to create storytelling' });
  }
});

router.put('/:storyId', async (req, res) => {
  const storyId = req.params.storyId;

  try {
    let storytelling = await Storytelling.findByPk(storyId);

    if (!storytelling) {
      return res.json({ message: 'Storytelling not found' });
    }

    const schema = {
      text: 'string|optional',
      stageId: 'number|optional',
      avatarId: 'number|optional',
      codeScene: 'string|optional',
    };

    const validate = v.validate(req.body, schema);

    if (validate.length) {
      return res.status(400).json(validate);
    }

    storytelling = await storytelling.update(req.body);
    res.json(storytelling);
  } catch (error) {
    console.error(`Error updating storytelling with ID ${storyId}:`, error);
    res.status(500).json({ message: 'Failed to update storytelling' });
  }
});

router.delete('/:storyId', async (req, res) => {
  const storyId = req.params.storyId;

  try {
    const storytelling = await Storytelling.findByPk(storyId);

    if (!storytelling) {
      return res.json({ message: 'Storytelling not found' });
    }

    await storytelling.destroy();
    res.json({ message: 'Storytelling deleted' });
  } catch (error) {
    console.error(`Error deleting storytelling with ID ${storyId}:`, error);
    res.status(500).json({ message: 'Failed to delete storytelling' });
  }
});

module.exports = router;
