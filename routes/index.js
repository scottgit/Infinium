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

module.exports = router;
