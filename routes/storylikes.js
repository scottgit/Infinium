const express = require('express');
const router = express.Router();
const { requireAuth } = require('../auth');
const parseHexadecimal = require('./utils');

const { storyLike, Story } = require('../db/models');
const { asyncHandler } = require('./utils');

// POST for Likes fetch request
router.post(`/users/:id/stories/:storyId/upvote`, requireAuth, asyncHandler( async (req, res) => {
    // let parsedStoryId = parseHexadecimal(req.params.storyId);
    // let parsedUserId = parseInt(res.locals.user.id, 10);
    let likes = await storyLike.findOne({
      where: {
        userId: res.locals.user.id,
        storyId: req.params.storyId
      }
    })

    if (likes) {
      likes.likesCount+= 1;
      await likes.save();
    } else {
      likes = await storyLike.create({
        likesCount: 1,
        userId: res.locals.user.id,
        storyId: req.params.storyId
      })
    }

    res.json({ likesCount: likes.likesCount });

    // console.log(parsedUserId, parsedStoryId);
  }));




module.exports = router;
