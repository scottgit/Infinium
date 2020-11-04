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
  const recent = await getStoryList({ordering: [['updatedAt', 'DESC']], limits});
  res.render('index', { title: 'Infinium', highlights, trending, recent });
}));

module.exports = router;
