const express = require('express');
const router = express.Router();
const { requireAuth } = require('../auth');
const { parseHexadecimal } = require('./utils');

const { storyLike, Story } = require('../db/models');
const { asyncHandler } = require('./utils');

// POST for Likes fetch request
router.post(`/users/:id/stories/:storyId/upvote`, requireAuth, asyncHandler( async (req, res) => {
    let { storyId } = req.body
    // let test = parseInt(storyId)
    // console.log(typeof(test));
    let parsedStoryId = parseHexadecimal(storyId);
    // let parsedStoryId = parseHexadecimal(req.params.storyId);
    // let parsedUserId = parseInt(res.locals.user.id, 10);
    console.log("THIS IS HERE", storyId, parsedStoryId, res.locals.user.id);
    let likes = await storyLike.findAll({
      where: {
        storyId: parsedStoryId
      }
    })

    // let test = await storyLike.findOne({
    //   where: {
    //     userId: res.locals.user.id
    //   }
    // })

    let counter = 0;

    if (likes) {
      likes.forEach( async(like) => {
        if (like.userId === res.locals.user.id) {
          like.likesCount += 1;
          await like.save();
        }
        counter += like.likesCount;
      });
    } else {
      likes = await storyLike.create({
        likesCount: 1,
        userId: res.locals.user.id,
        storyId: parsedStoryId
      })
    }

    res.json({ likesCount: counter });

    // console.log(parsedUserId, parsedStoryId);
  }));




module.exports = router;
