const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

const User = require('../../models/User');

// @route  POST api/users
// @desc   Register user
// @access Public

router.post(
  '/',
  [
    check('username', 'Username is required')
      .not()
      .isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters long').isLength({
      min: 6
    })
  ],

  async (req, res) => {
    // Validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      let userEmail = await User.findOne({ email });
      let userName = await User.findOne({ username });

      if (userEmail || userName) {
        var existsErrors = [];
        if (userEmail) {
          existsErrors.push({ msg: 'User with that email already exists' });
        }
        if (userName) {
          existsErrors.push({ msg: 'That username is already taken' });
        }
        return res.status(400).json({ existsErrors });
      }

      let user = new User({
        username,
        email,
        password
      });

      const salt = await bcrypt.genSalt(10); //10 rounds
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id
        }
      };

      // Sign in with JWT
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route  DELETE api/users
// @desc   Delete user
// @access Private

router.delete('/', auth, async (req, res) => {
  try {
    await User.findOneAndRemove(
      { _id: req.user.id },
      { useFindAndModify: false }
    );
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.log(err.message);
    res.status(500, { msg: 'Server Error' });
  }
});

// @route  GET api/users
// @desc   Get all users
// @access Private

router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    console.log(err.message);
    res.status(500, { msg: 'Server Error' });
  }
});

// @route  PUT api/users/follow/:forumId
// @desc   Follow a forum
// @access Private

router.put('/follow/:forumId', auth, async (req, res) => {
  try {
    // Check if Forum with DB id exists
    const forum = await Forum.findById(req.params.forumId);
    if (!forum) {
      return res.status(404).json({ msg: 'Forum does not exist' });
    }
    const user = await User.findById(req.user.id);

    // Check if user already follows forum
    if (
      user.forums.filter(forum => forum.forum == req.params.forumId).length > 0
    ) {
      return res.status(400).json({ msg: 'User already follows forum' });
    }

    // Add forum to User
    user.forums.unshift({ forum: req.params.forumId });
    await user.save();
    return res.send(user);
  } catch (err) {
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Forum not found.' });
    }
    console.log(err.message);
    res.status(500, { msg: 'Server Error' });
  }
});

// @route  PUT api/users/follow/:forumId
// @desc   Unfollow a forum
// @access Private

router.put('/unfollow/:forumId', auth, async (req, res) => {
  try {
    // Check if Forum with DB id exists
    const forum = await Forum.findById(req.params.forumId);
    if (!forum) {
      return res.status(404).json({ msg: 'Forum does not exist' });
    }
    const user = await User.findById(req.user.id);

    // Check if User is following forum
    if (
      user.forums.filter(forum => forum.forum == req.params.forumId).length == 0
    ) {
      return res.status(400).json({ msg: 'User does not follow forum' });
    }

    // Get remove index
    const removeIndex = user.forums
      .map(forum => forum.forum.toString())
      .indexOf(req.params.forumId);
    user.forums.splice(removeIndex, 1);

    await user.save();
    return res.send(user);
  } catch (err) {
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Forum not found.' });
    }
    console.log(err.message);
    res.status(500, { msg: 'Server Error' });
  }
});

module.exports = router;
