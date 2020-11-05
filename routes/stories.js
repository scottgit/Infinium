const express = require('express');

const { storyValidators } = require('../validations/stories');
const { validationResult } = require('express-validator');
const { Op } = require("sequelize");
const{requireAuth} = require('../auth');

const { User, Story } = require('../db/models');
const { csrfProtection,
        asyncHandler,
        wantsJSON,
        sendStoryList,
        getStoryList,
        getHighlights,
        getTrending
      } = require('./utils');

const router = express.Router();

/* GET all published stories */
router.get(`/`, asyncHandler(async (req, res) => {
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
router.get('/new-story', requireAuth, asyncHandler(async (req, res) => {
  const id = res.locals.user.id;
  const user = await User.findByPk(id);
  console.log(res)
  res.render('story-edit', {userId: user.id, name: user.username, contextMessage: `Draft by ${user.username}`, contextControls: `story-edit`, formAction: res.originalUrl})
}));


module.exports = router;
