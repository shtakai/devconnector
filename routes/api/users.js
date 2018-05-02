const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');

const router = express.Router();

// @route  GET api/users/test
// @desc   Tests users route
// @access Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// @route  GET api/users/register
// @desc   Register user
// @access Public
router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        return res.status(400).json({ email: 'Email already exists'});
      }
      const avatar = gravatar.url(req.body.email, {
        s: '200', // Size
        r: 'pg', // Rating
        d: 'mm', // Default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (_err, hash) => {
          if (_err) throw _err;
          newUser.password = hash;
          newUser.save()
            .then(_user => res.json(_user))
            .catch(_err2 => console.log(_err2));
        });
      });
    });
});

// @route  POST api/users/login
// @desc   Login User / Returning JWT Token
// @access Public
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      // Check for user
      if (!user) {
        return res.status(404).json({ email: 'User not found' });
      }
      // Check password
      bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (isMatch) {
            res.json({ msg: 'Success' });
          } else {
            return res.status(400).json({ password: 'Password incorrect' });
          }
        });
    });
});
module.exports = router;
