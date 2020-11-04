const express = require('express');
const router = express.Router();
const { userRegValidators, userSignInValidators } = require('../validations/users');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const{loginUser, logoutUser} = require('../auth');

const { User, Story } = require('../db/models')
const { csrfProtection,
        asyncHandler,
        preProcessStories,
        parseHexadecimal,
        wantsJSON,
        isPublished,
        getAuthor,
        sendStoryList,
        getStoryList,
      } = require('./utils');

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
        return res.redirect('/')
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
  res.redirect('/users/login')
});

/* GET single user story to read */
router.get(/\/(\d+)\/stories\/([0-9a-f]+)$/, asyncHandler(async (req, res) => {
  const userId = parseInt(req.params[0], 10);
  const storyId = parseHexadecimal(req.params[1]);

  let story = await Story.findOne({
    where: isPublished(userId, storyId),
    include: getAuthor(),
  });

  if (story) [story] = preProcessStories([story]);

  const details = {
    title: story.title,
    subtitle: story.subtitle,
    author: story.author,
    date: story.date,
    storyBody: story.published,
  };
  if(wantsJSON(req)) {
    res.json(details);
  }
  else {
    res.render('story-detail', {
      ...details
    })
  }
}));

/* GET all published stories by specific user */
router.get('/:userId(\\d+)/stories', asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const stories = await getStoryList({userId, ordering: [['updatedAt', 'DESC']]});
  sendStoryList(wantsJSON(req), res, stories, `Stories by ${stories[0].author}`);
}));

module.exports = router;
