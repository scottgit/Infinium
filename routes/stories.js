const express = require('express');

const { storyValidators } = require('../validations/stories');
const { validationResult } = require('express-validator');
const { Op } = require("sequelize");

const { User, Story } = require('../db/models');
const { csrfProtection,
        asyncHandler,
        preProcessStories,
        setHexadecimal,
        parseHexadecimal,
        wantsJSON,
        isPublished,
        isDraft,
        getAuthor,
        sendStoryList,
      } = require('./utils');

const router = express.Router();

router.get(`/`, asyncHandler(async (req, res) => {
  let stories = await Story.findAll({
    where: isPublished(),
    include: getAuthor(),
  });
  if (stories) stories = preProcessStories(stories);
  sendStoryList(wantsJSON(req), res, stories, 'Stories since the beginning of time...');
}));


router.get(/\/recent(\/(\d+))?/, asyncHandler(async (req, res) => {
  const limits = req.params[1] ? parseInt(req.params[1],10) : 5;
  let stories = await Story.findAll({
    where: isPublished(),
    include: getAuthor(),
    limit: limits,
    order: [['updatedAt', 'DESC']],
  });
  if (stories) stories = preProcessStories(stories);
  sendStoryList(wantsJSON(req), res, stories, `The ${limits} most recent stories`);
}));

router.get(/\/trending(\/(\d+))?/, asyncHandler(async (req, res) => {
  const limits = req.params[1] ? parseInt(req.params[1],10) : 3;
  let stories = await Story.findAll({
    where: isPublished(),
    include: getAuthor(),
  });
  let limit = Math.min(limits, stories.length);

  let trending = [];
  if (stories) {
    stories = preProcessStories(stories);
    //TODO implement actual trending logic, probably in the db query
    //Just randomly selecting trending stories
    for(let i=0; i<limit; i++) {
      const getIdx = Math.floor(Math.random() * stories.length);
      trending.push(...stories.splice(getIdx, 1));
    }
    stories = trending;
  }
  sendStoryList(wantsJSON(req), res, stories, `Trending stories`);
}));

router.get('/highlights', asyncHandler(async (req, res) => {
  const limits = 5;
  let stories = await Story.findAll({
    where: isPublished(),
    include: getAuthor(),
  });
  let limit = Math.min(limits, stories.length);

  let highlight = [];
  if (stories) {
    stories = preProcessStories(stories);
    //TODO implement actual highlight logic, probably in the db query
    //Just randomly selecting highlight stories
    for(let i=0; i<limit; i++) {
      const getIdx = Math.floor(Math.random() * stories.length);
      highlight.push(...stories.splice(getIdx, 1));
    }
    stories = highlight;
  }
  sendStoryList(wantsJSON(req), res, stories, `Highlight stories`);
}));



module.exports = router;
