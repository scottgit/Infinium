const express = require('express');
const router = express.Router();
const { userRegValidators, userSignInValidators } = require('../validations/users');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const{loginUser, logoutUser, requireAuth, checkUserRouteAccess} = require('../auth');
const { Op } = require("sequelize");


const { User, Story, Follower } = require('../db/models')
const { csrfProtection,
        asyncHandler,
        setHexadecimal,
      } = require('./utils');


/* GET the main user page */
router.get('/:userId(\\d+)', asyncHandler(async (req, res) => {
  const userId = req.params.userId
  const user = await User.findByPk(userId, {
    include: Story
  })
  const findAllFollowers = await Follower.findAll({
    where: {
      userId: userId
    }
  })

  const followerCount = findAllFollowers.length;

  const followCompare = await Follower.findOne({
    where: {
      [Op.and]: [
        { userId: userId },
        { followerId: res.locals.user.id }
      ]
    }
  })
  const authUser = res.locals.user.id;
  const authCompare = parseInt(authUser, 10) === parseInt(userId, 10);
  const stories = user.Stories.map(story => {
    story.hexId = setHexadecimal(story.id)
    return story;
  });

  const name = user.username;
  res.render('user', {
    title: 'User',
    stories,
    authCompare,
    followCompare,
    followerCount,
    userId,
    name,
  });
}));

/* GET register form. */
router.get('/register', csrfProtection, (req, res) => {
  const user = User.build();
  res.render('sign-up', {
    title: 'Sign-up',
    user,
    token: req.csrfToken()
  })
});

/* POST register form. */
router.post('/register', csrfProtection, userRegValidators, asyncHandler(async (req, res) => {
  const {
    email,
    username,
    password
  } = req.body;

  const user = User.build({
    username,
    email
  })

  const validatorErrors = validationResult(req);

  if (validatorErrors.isEmpty()) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user.hashedPassword = hashedPassword;
    await user.save();
    loginUser(req, res, user)
    res.redirect('/');
  } else {
    const errors = validatorErrors.array().map(error => error.msg);
    res.render('sign-up', {
      title: 'Sign-up',
      user,
      errors,
      token: req.csrfToken(),
    })
  }
}));

/* GET user log-in. */
router.get('/login', csrfProtection, (req, res) => {
  res.render('log-in', {
    title: 'Log-in',
    token: req.csrfToken()
  })
})

/* POST user log-in. */
router.post('/login', csrfProtection, userSignInValidators, asyncHandler(async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  let errors = [];
  const validatorErrors = validationResult(req);

  if (validatorErrors.isEmpty()) {
    let user;
    if (usernameOrEmail.includes('@')) {
      user = await User.findOne({ where: { email: usernameOrEmail } })
    } else {
      user = await User.findOne({ where: { username: usernameOrEmail } })
    }
    if (user !== null) {
      const passwordMatch = await bcrypt.compare(password, user.hashedPassword.toString());
      if (passwordMatch) {
        loginUser(req, res, user)
        return req.session.save(function () {
          res.redirect('/')
        })
      }
    }
    errors.push('Login failed')
  } else {
    errors = validatorErrors.array().map(error => error.msg);
  }

  res.render('log-in', {
    title: 'Log-in',
    usernameOrEmail,
    errors,
    token: req.csrfToken()
  })
}))

/* POST user log-out. */

router.post('/logout', (req, res) => {
  logoutUser(req, res);
  return req.session.save(function () {
    res.redirect('/')
  })
});


module.exports = router;
