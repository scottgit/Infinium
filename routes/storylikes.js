const express = require('express');
const router = express.Router();
const { requireAuth } = require('../auth');

const { storyLike } = require('../db/models');

// POST for Likes fetch request
router.post(`/:id/upvote`, async (req, res) => {
    let test = await storyLike.findOne({
      where: {
        userId: res.locals.user.id,
        storyId: req.params.id
      }
    })

    if (test) {
      test.likesCount+= 1;
      await test.save();
    } else {
      test = await storyLike.create({
        likesCount: 1,
        userId: res.locals.user.id,
        storyId: req.params.id
      })
    }

    res.json({ likesCount: test.likesCount });
  });




module.exports = router;
