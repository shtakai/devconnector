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

module.exports = router;
