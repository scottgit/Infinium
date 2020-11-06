const express = require('express');
const router = express.Router();
const { userRegValidators, userSignInValidators } = require('../validations/users');
const { storyDraftValidators, storyPublishValidators } = require('../validations/stories');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const{loginUser, logoutUser, requireAuth, checkUserRouteAccess} = require('../auth');
const { Op } = require("sequelize");


const { User, Story } = require('../db/models')
const { csrfProtection,
        asyncHandler,
        preProcessStories,
        parseHexadecimal,
        setHexadecimal,
        wantsJSON,
        isPublished,
        isDraft,
        getAuthor,
        sendStoryList,
        getStoryList,
        buildMissingStoryTitle,
        prepareStoryEditorDetails,
        checkEmpty,
      } = require('./utils');

/* GET the main user page */
router.get('/:userId(\\d+)', asyncHandler(async (req, res) => {
  const userId = req.params.userId
  const user = await User.findByPk(userId, {
    include: Story
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

/* GET single user story to read */
router.get(/\/(\d+)\/stories\/([0-9a-f]+)$/, asyncHandler(async (req, res, next) => {
  const userId = parseInt(req.params[0], 10);
  const storyId = parseHexadecimal(req.params[1]);
  let story = await Story.findOne({
    where: isPublished(userId, storyId),
    include: getAuthor(),
  });

  if (!story) next(); //Become a 404
  [story] = preProcessStories([story]);

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
    res.render('story-id', {
      ...details, userId, story
    })
  }
}));

/* GET all published stories by specific user */
router.get(
  '/:userId(\\d+)/stories',
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const stories = await getStoryList({userId, ordering: [['updatedAt', 'DESC']]});
    sendStoryList(wantsJSON(req), res, stories, `Stories by ${stories[0].author}`);
  })
);

/* GET single user saved story draft */
router.get(
  /\/(\d+)\/stories\/([0-9a-f]+)\/draft$/,
  requireAuth,
  checkUserRouteAccess,
  csrfProtection,
  storyDraftValidators,
  asyncHandler(
    async (req, res, next) => {
      const userId = res.locals.user.id;
      const storyId = parseHexadecimal(req.params[1]);

      let story = await Story.findOne({
        where: isDraft(userId, storyId),
        include: getAuthor(),
      });

      if (!story) next(); //Become a 404

      //Move story out of published status if needed
      if (!story.draft) {
        story.draft = story.published;
        story.published = '';
        await story.update({published: ''})
      }

      const details = prepareStoryEditorDetails(req, story);

      res.render('story-edit', {...details});
    })
);

/* POST single user saved story draft to save edits */
router.post(
  /\/(\d+)\/stories\/([0-9a-f]+)\/draft$/,
  requireAuth,
  checkUserRouteAccess,
  csrfProtection,
  storyDraftValidators,
  asyncHandler(
    async (req, res, next) => {
      const userId = res.locals.user.id;

      let {title, draft} = req.body;
      const storyId = parseHexadecimal(req.params[1]);

      let story = await Story.findOne({
        where: isDraft(userId, storyId),
        include: getAuthor(),
      });

      if (!story) next(); //Become a 404

      //If no title, build one from the body
      if (checkEmpty(title) && !checkEmpty(draft)) {
        title = buildMissingStoryTitle(draft);
      }

      const validatorErrors = validationResult(req);

      if (validatorErrors.isEmpty()) {
        story = await story.update({
          title,
          draft,
        });

        const details = prepareStoryEditorDetails(req, story);

        res.render('story-edit', {...details});
      }
      else {
        const errors = validatorErrors.array().map(error => error.msg);
        story.title = title;
        story.draft = draft;
        const details = prepareStoryEditorDetails(req, story);
        res.render('story-edit', {
          ...details,
          errors,
        });
      }

  })
);

/* POST single user publish story draft */
router.post(
  /\/(\d+)\/stories\/([0-9a-f]+)\/draft\/publish$/,
  requireAuth,
  checkUserRouteAccess,
  csrfProtection,
  storyPublishValidators,
  asyncHandler(
    async (req, res, next) => {
      const userId = res.locals.user.id;
      let {title, draft, subtitle, imageLink} = req.body;
      const storyId = parseHexadecimal(req.params[1]);

      let story = await Story.findOne({
        where: isDraft(userId, storyId),
        include: getAuthor(),
      });

      if (!story) next(); //Become a 404

      //If no title, build one from the body
      if (checkEmpty(title) && !checkEmpty(draft)) {
        title = buildMissingStoryTitle(draft);
      }

      const validatorErrors = validationResult(req);

      if (validatorErrors.isEmpty()) {
        story = await story.update({
          title,
          subtitle,
          imageLink,
          published: draft,
          draft: null,
        });

        const captureUrl = req.originalUrl.match(/^(?<url>.*)\/draft\/publish$/).groups;
        res.redirect(captureUrl.url)
      }
      else {
        const publishErrors = validatorErrors.array().map(error => error.msg);
        story.title = title;
        story.draft = draft;
        story.subtitle = subtitle;
        story.imageLink = imageLink;
        const details = prepareStoryEditorDetails(req, story);
        res.render('story-edit', {
          ...details,
          publishErrors,
        });
      }

  })
);

router.delete(
  /\/(\d+)\/stories\/([0-9a-f]+)$/,
  requireAuth,
  checkUserRouteAccess,
  asyncHandler(async (req, res) => {
    res.end(); //TODO finish this
  })
);


module.exports = router;
