const express = require('express');
const { Follower, User } = require('../db/models');
const { includes } = require('../validations/comments');
const { requireAuth } = require('../auth');

const { csrfProtection,
  asyncHandler,
  getStoryList,
  getHighlights,
  getTrending,
  req
} = require('./utils');

const router = express.Router();

/* GET home page. */
router.get('/', requireAuth, asyncHandler(async (req, res, next) => {
  const followersList = await Follower.findAll({
    where: {
      userId: res.locals.user.id
    }
  });
  const userProfile = await User.findAll({});
  const limits = 5;
  const highlights = await getStoryList({filter: getHighlights});
  const trending = await getStoryList({filter: getTrending, req});
  const recents = await getStoryList({ordering: [['updatedAt', 'DESC']], limits});
  const topStory = highlights.pop();
  res.render('index', { title: 'Infinium', userProfile, highlights, followersList, trending, recents, topStory });
}));

/* GET about page. */
router.get('/about', asyncHandler(async (req, res, next) => {

  res.render('about', { title: 'Infinium', contextControls: 'not-home', aboutPage: true });
}));

module.exports = router;
