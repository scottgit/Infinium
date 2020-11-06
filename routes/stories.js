const express = require('express');

const { storyDraftValidators, storyPublishValidators } = require('../validations/stories');
const { validationResult } = require('express-validator');
const { Op } = require("sequelize");
const{requireAuth, checkUserRouteAccess, getRouteUserId} = require('../auth');

const { User, Story } = require('../db/models');
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

const router = express.Router();

/* GET all published stories */
router.get(`/all`, asyncHandler(async (req, res) => {
  const stories = await getStoryList();
  sendStoryList(wantsJSON(req), res, stories, 'Stories since the beginning of time...');
}));

/* GET all recent stories (limit 5 unless optional route indicates differently) */
router.get(/\/recent(\/(\d+))?/, asyncHandler(async (req, res) => {
  const limits = req.params[1] ? parseInt(req.params[1],10) : 5;
  const stories = await getStoryList({ordering: [['updatedAt', 'DESC']], limits});
  sendStoryList(wantsJSON(req), res, stories, `The ${limits} most recent stories`);
}));

/* GET all trending stories (limit 3 unless optional route indicates differently) */
router.get(/\/trending(\/(\d+))?/, asyncHandler(async (req, res) => {
  const stories = await getStoryList({filter: getTrending, req});
  sendStoryList(wantsJSON(req), res, stories, `Trending stories`);
}));

/* GET highlight stories (limit 5) */
router.get('/highlights', asyncHandler(async (req, res) => {
  const stories = await getStoryList({filter: getHighlights});
  sendStoryList(wantsJSON(req), res, stories, `Highlight stories`);
}));

/* GET new story */
router.get('/new-story', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
  const id = res.locals.user.id;
  const user = await User.findByPk(id);

  res.render('story-edit', {
    userId: user.id,
    name: user.username,
    contextMessage: `Draft by ${user.username}`,
    contextControls: `story-edit`,
    formAction: req.originalUrl,
    csrfToken: req.csrfToken(),
  });
}));

/* POST save new story for the first time */
router.post('/new-story', requireAuth, csrfProtection, storyDraftValidators, asyncHandler(async (req, res) => {
  let {title, draft} = req.body;
  const userId = res.locals.user.id;
  const name = res.locals.user.username;

  //If no title, build one from the body
  if (checkEmpty(title) && !checkEmpty(draft)) {
    title = buildMissingStoryTitle(draft);
  }

  let story = Story.build({
    title,
    draft,
    userId,
  });

  const validatorErrors = validationResult(req);

  if (validatorErrors.isEmpty()) {
    story = await story.save();
    const hexId = setHexadecimal(story.id);
    res.redirect(`/users/${userId}/stories/${hexId}/draft`);
  }
  else {
    const errors = validatorErrors.array().map(error => error.msg);
    const details = prepareStoryEditorDetails(req, story, name);
    res.render('story-edit', {
      ...details,
      errors,
    });
  }

}));

/* USER route integrated story display */
/* GET for ANY user to see a single user story to read */
router.get(/\/([0-9a-f]+)$/, asyncHandler(async (req, res, next) => {
  const userId = getRouteUserId(req);
  const storyId = parseHexadecimal(req.params[0]);
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
    });
  }
  console.log('HERE')
  res.end();
}));

/* GET all own stories by the specific logged in user */

router.get(
  '/', // This route handles /users/<id>/stories
  requireAuth,
  checkUserRouteAccess,
  asyncHandler(async (req, res, next) => {

    const userId = res.locals.user.id;
    const stories = await getStoryList({userId, ordering: [['updatedAt', 'DESC']]});
    if (!stories) res.redirect(`/users/${userId}`);
    const published = [];
    const drafts = [];
    stories.forEach(story => {
       if (story.published) published.push(story)
       else drafts.push(story);
    });

    sendStoryList(wantsJSON(req), res, [published, drafts], `Your stories`);
  })
);

/* GET single user's own saved story draft */
router.get(
  /\/([0-9a-f]+)\/draft$/,
  requireAuth,
  checkUserRouteAccess,
  csrfProtection,
  storyDraftValidators,
  asyncHandler(
    async (req, res, next) => {
      const userId = res.locals.user.id;
      const storyId = parseHexadecimal(req.params[0]);

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

/* POST single user's own saved story draft to save edits */
router.post(
  /\/([0-9a-f]+)\/draft$/,
  requireAuth,
  checkUserRouteAccess,
  csrfProtection,
  storyDraftValidators,
  asyncHandler(
    async (req, res, next) => {
      const userId = res.locals.user.id;
      const storyId = parseHexadecimal(req.params[0]);
      let {title, draft} = req.body;

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

/* POST single user's own publish story draft */
router.post(
  /\/([0-9a-f]+)\/draft\/publish$/,
  requireAuth,
  checkUserRouteAccess,
  csrfProtection,
  storyPublishValidators,
  asyncHandler(
    async (req, res, next) => {
      const userId = res.locals.user.id;
      const storyId = parseHexadecimal(req.params[0]);
      let {title, draft, subtitle, imageLink} = req.body;

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

/* GET user's own request to delete their story */
router.delete(
  /\/([0-9a-f]+)$/,
  requireAuth,
  checkUserRouteAccess,
  asyncHandler(async (req, res) => {
    res.end(); //TODO finish this
  })
);

module.exports = router;
