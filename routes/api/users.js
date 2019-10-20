const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const config = require('config');
const jwt = require('jsonwebtoken');

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

module.exports = router;
