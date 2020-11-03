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



module.exports = router;
