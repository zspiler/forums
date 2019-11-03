const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const ObjectId = require('mongodb').ObjectID;

const Forum = require('../../models/Forum');
const Post = require('../../models/Post');
const User = require('../../models/User');

// @route  GET api/forums
// @desc   Get all forums
// @access Public

router.get('/', async (req, res) => {
  try {
    const forums = await Forum.find().sort({
      followerCount: -1
    });

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

// @route  GET api/forums/f/:forumname
// @desc   Get forum by name
// @access Public

router.get('/f/:forumName', async (req, res) => {
  try {
    const forum = await Forum.find({ name: req.params.forumName });

    if (!forum) return res.status(404).json({ msg: 'Forum not found.' });
    res.json(forum[0]);
  } catch (err) {
    console.log(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'Forum not found.' });
    }
    res.status(404).send('Server Error');
  }
});

// @route  GET api/forums/owned
// @desc   Get forums owned by user
// @access Private

router.get('/owned/:userId', auth, async (req, res) => {
  try {
    const forums = await Forum.find({ user: req.params.userId }).sort({
      followerCount: -1
    });
    if (!forums)
      return res.status(404).json({ msg: 'User does not own any forums.' });
    res.json(forums);
  } catch (err) {
    console.log(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'User not found.' });
    }
    res.status(404).send('Server Error');
  }
});

// @route  GET api/forums/top/100
// @desc   Get top 100 forums by follower count
// @access Public

router.get('/top/100', async (req, res) => {
  try {
    const forums = await Forum.find()
      .sort({
        followerCount: -1
      })
      .limit(100);

    res.json(forums);
  } catch (err) {
    console.log(err.message);
    res.status(500, { msg: 'Server Error' });
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
      check(
        'name',
        'Forum name can not be more than 20 characters long'
      ).isLength({
        max: 20
      }),
      check('name', 'Forum name can not contain any spaces')
        .not()
        .contains(' '),
      check('description', 'Description is required')
        .not()
        .isEmpty(),
      check(
        'description',
        'Description can not be more than 1000 characters long'
      ).isLength({
        max: 1000
      })
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

      let forumId;
      await forum.save((err, forum) => {
        forumId = forum._id;
      });

      // const user = await User.findById(req.user.id);
      // user.owned.unshift({ forum: forum._id });

      // await user.save();
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
      // Check if Forum with id exists
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
    // Check if Forum with id exists
    const forum = await Forum.findById(req.params.forumId);
    if (!forum) {
      return res.status(404).json({ msg: 'Forum does not exist' });
    }
    // Check if user owns this forum
    if (forum.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    // Delete from Forums collection
    await Forum.findOneAndRemove({ _id: req.params.forumId });

    // Delete forum's posts from Posts collection
    await Post.deleteMany({ forum: req.params.forumId });

    // const user = await User.findById(req.user.id);
    // user.owned.filter(f => f._id !== forum._id);
    // await user.save();

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
