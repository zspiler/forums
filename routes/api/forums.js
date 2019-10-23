const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const ObjectId = require('mongodb').ObjectID;

const Forum = require('../../models/Forum');
const Post = require('../../models/Post');

// @route  GET api/forums
// @desc   Get all forums
// @access Public

router.get('/', async (req, res) => {
  try {
    const forums = await Forum.find();
    res.json(forums);
  } catch (err) {
    console.log(err.message);
    res.status(500, { msg: 'Server Error' });
  }
});

// @route  GET api/forums/:forumId
// @desc   Get forum by ID
// @access Public

router.get('/:forumId', async (req, res) => {
  try {
    const forum = await Forum.findById(req.params.forumId);

    if (!forum) return res.status(400).json({ msg: 'Forum not found.' });
    res.json(forum);
  } catch (err) {
    console.log(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Forum not found.' });
    }
    res.status(500).send('Server Error');
  }
});

// @route  POST api/forums
// @desc   Create a forum
// @access Private

router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required')
        .not()
        .isEmpty(),
      check('description', 'Description is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, description } = req.body;

    let forum = await Forum.findOne({ name });
    if (forum) {
      return res
        .status(400)
        .json({ msg: 'Forum with that name already exists' });
    }

    try {
      // CREATE FORUM
      forum = new Forum({
        name: name,
        description: description,
        user: req.user.id
      });

      await forum.save();
      res.json(forum);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route  PUT api/forums/:forumId
// @desc   Edit forum description
// @access Private

router.put(
  '/:forumId',
  [
    auth,
    [
      check('description', 'Description is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    try {
      // Check if Forum with DB id exists
      const forum = await Forum.findById(req.params.forumId);
      if (!forum) {
        return res.status(404).json({ msg: 'Forum does not exist' });
      }
      // Check if user owns this forum
      if (forum.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Unauthorized' });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      forum.description = req.body.description;
      await forum.save();
      return res.send(forum);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route  DELETE api/forums/:forumId
// @desc   Delete forum
// @access Private

router.delete('/:forumId', auth, async (req, res) => {
  try {
    // Check if Forum with DB id exists
    const forum = await Forum.findById(req.params.forumId);
    if (!forum) {
      return res.status(404).json({ msg: 'Forum does not exist' });
    }
    // Check if user owns this forum
    if (forum.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    await Forum.findOneAndRemove({ _id: req.params.forumId });

    res.json({ msg: 'Forum deleted' });
  } catch (err) {
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Forum not found.' });
    }
    console.log(err.message);
    res.status(500, { msg: 'Server Error' });
  }
});

module.exports = router;
