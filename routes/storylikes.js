const express = require('express');
const router = express.Router();
const { requireAuth } = require('../auth');
const { parseHexadecimal, getAuthor, isPublished } = require('./utils');

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

    // console.log("THIS IS HERE", likes,);
    let counter;
    // console.log('COUNTER', counter);

    if (!likes.length) {
      counter = 0;
      console.log('THIS WORKS')
    } else {
      counter = likes[0].dataValues.likesCount;
    }


    if (likes.length) {
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
    console.log(counter);
    res.json({ likesCount: counter });

    // console.log(parsedUserId, parsedStoryId);
  }));




module.exports = router;
