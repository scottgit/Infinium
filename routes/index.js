const express = require('express');

const { csrfProtection,
  asyncHandler,
  getStoryList,
  getHighlights,
  getTrending
} = require('./utils');

const router = express.Router();

/* GET home page. */
router.get('/', asyncHandler(async (req, res, next) => {
  const limits = 5;
  const highlights = await getStoryList({filter: getHighlights});
  const trending = await getStoryList({filter: getTrending, req});
  const recents = await getStoryList({ordering: [['updatedAt', 'DESC']], limits});
  const topStory = highlights.pop();
  res.render('index', { title: 'Infinium', highlights, trending, recents, topStory });
}));

/* GET about page. */
router.get('/about', asyncHandler(async (req, res, next) => {

  res.render('about', { title: 'Infinium', contextControls: 'not-home', aboutPage: true });
}));

module.exports = router;
