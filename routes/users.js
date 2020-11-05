const express = require('express');
const router = express.Router();
const { userRegValidators, userSignInValidators } = require('../validations/users');
const { storyDraftValidators } = require('../validations/stories');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const{loginUser, logoutUser, requireAuth} = require('../auth');
const { Op } = require("sequelize");


const { User, Story } = require('../db/models')
const { csrfProtection,
        asyncHandler,
        preProcessStories,
        parseHexadecimal,
        wantsJSON,
        isPublished,
        isDraft,
        getAuthor,
        sendStoryList,
        getStoryList,
        buildMissingStoryTitle,
        prepareStoryEditorDetails,
        checkTitle,
      } = require('./utils');

/* GET the main user page */
router.get('/:userId(\\d+)', asyncHandler(async (req, res) => {
  const userId = req.params.userId
  const user = await User.findByPk(userId, {
    include: Story
        })
  const authUser = res.locals.user.id;
  const authCompare = parseInt(authUser, 10) === parseInt(userId, 10);
  const stories = [];
  user.Stories.map(story => stories.push(story))
  const name = user.username;
  res.render('user', {
    title: 'User',
    stories,
    authCompare,
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
  res.redirect('/')
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
router.get('/:userId(\\d+)/stories', requireAuth, asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const stories = await getStoryList({userId, ordering: [['updatedAt', 'DESC']]});
  sendStoryList(wantsJSON(req), res, stories, `Stories by ${stories[0].author}`);
}));

/* GET single user saved story draft */
router.get(/\/(\d+)\/stories\/([0-9a-f]+)\/draft$/, requireAuth, csrfProtection, storyDraftValidators, asyncHandler(async (req, res, next) => {
  const userId = parseInt(req.params[0], 10);
  const loggedInUser = res.locals.user.id;
  //Only allow users who are owners of the story to access this route, otherwise
  //send them on their way...
  if (userId !== loggedInUser) next();

  const storyId = parseHexadecimal(req.params[1]);

  let story = await Story.findOne({
    where: isDraft(userId, storyId),
    include: getAuthor(),
  });

  //Move story out of published status if needed
  if (!story.draft) {
    story.draft = story.published;
    story.published = '';
    await story.update({published: ''})
  }

  if (story) [story] = preProcessStories([story]);

  const name = story.author;

  const details = {
    userId,
    name,
    contextMessage: `Draft by ${name}`,
    contextControls: `story-edit-with-publish`,
    formAction: req.originalUrl,
    csrfToken: req.csrfToken(),
    title: story.title,
    subtitle: story.subtitle,
    author: name,
    date: story.date,
    draft: story.draft,
  };

  res.render('story-edit', {
    ...details
  })
}));

/* POST single user saved story draft to save edits */
router.post(/\/(\d+)\/stories\/([0-9a-f]+)\/draft$/, requireAuth, csrfProtection, storyDraftValidators, asyncHandler(async (req, res, next) => {
  const userId = parseInt(req.params[0], 10);
  const loggedInUser = res.locals.user.id;
  //Only allow users who are owners of the story to access this route, otherwise
  //send them on their way...
  if (userId !== loggedInUser) next();
  let {title, draft} = req.body;
  const storyId = parseHexadecimal(req.params[1]);

  let story = await Story.findOne({
    where: isDraft(userId, storyId),
    include: getAuthor(),
  });
  //If no title, build one from the body
  if (checkTitle(title) && draft) {
    title = buildMissingStoryTitle(draft);
  }

  const validatorErrors = validationResult(req);

  if (validatorErrors.isEmpty()) {
    story = await story.update({
      title,
      draft,
    });

    const details = prepareStoryEditorDetails(req, story);

    res.render('story-edit', {
      ...details
    })
  }
  else {
    const errors = validatorErrors.array().map(error => error.msg);
    const details = prepareStoryEditorDetails(req, story);
    res.render('story-edit', {
      ...details,
      errors,
    });
  }

}));

module.exports = router;
