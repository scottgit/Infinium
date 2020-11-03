const express = require('express');

const { storyValidators } = require('../validations/stories');
const { validationResult } = require('express-validator');
const { Op } = require("sequelize");

const { User, Story } = require('../db/models');
const { csrfProtection,
        asyncHandler,
        setHexIds,
        setHexadecimal,
        parseHexadecimal,
      } = require('./utils');

const router = express.Router();

router.get(`/`, asyncHandler((req, res, next) => {
  const stories = await Story.findAll({
    where: {published: {[Op.ne]: '' || null}}
  });
  if (stories) setHexIds(stories);
  const resType = req.get('Content-Type');
  if(/html$/.test(resType)) {
    res.render('story-list', {
      title: 'Stories since the beginning of time...',
      stories
    })
  }
  else if(/json$/.test(resType)) {
    res.json({stories});
  }
  else {
    next();
  }
}));



module.exports = router;
