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
        wantsJSON,
      } = require('./utils');

const router = express.Router();

router.get(`/`, asyncHandler(async (req, res) => {
  const stories = await Story.findAll({
    where: {
      published: {
        [Op.and]: [{[Op.ne]: ''}, {[Op.ne]: null}]
      }
    }
  });
  if (stories) setHexIds(stories);
  if(wantsJSON(req)) {
    res.json({stories});
  }
  else {
    res.render('story-list', {
      title: 'Stories since the beginning of time...',
      stories
    })
  }
}));


router.get(/\/recent(\/(\d+))?/, asyncHandler(async (req, res) => {
  console.log('LIMIT', req.params[1]);
  const limits = req.params[1] ? parseInt(req.params[1],10) : 10;
  const countLimit = limits;
  const stories = await Story.findAll({
    where: {
      published: {
        [Op.and]: [{[Op.ne]: ''}, {[Op.ne]: null}]
      },
      order: ['updatedAt', DESC],
      limit: countLimit,
    }
  });
  if (stories) setHexIds(stories);
  if(wantsJSON(req)) {
    res.json({stories});
  }
  else {
    res.render('story-list', {
      title: `The ${countLimit} most recent stories`,
      stories
    })
  }
}));

module.exports = router;
