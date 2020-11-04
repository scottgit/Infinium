const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator'); 

const db = require('../db/models');
const { Comment } = db; 
const { asyncHandler } = require('./utils'); 
const commentValidator = require('../validations/comments');


router.get('/', asyncHandler(async (req, res) => {
    const storyId = parseInt(req.params.id, 10); 
    const comments = await Comment.findAll({
        where: { storyId }
    });
    const story = await Story.findOne({
        where: { id: storyId }
    });
    const storyTitle = story.title; 

    res.render('comments', {
        storyTitle,
        comments, 
    })
}));

router.post('/', commentValidator, asyncHandler(async (req, res) => {
    const storyId = parseInt(req.params.id, 10); 
    const { comment } = req.body; 
    // How best to interact with the Session table to 
    // extract userId? 
    const newComment =  Comment.build({
        comment, 
        storyId,
        userId,
    });  

    const validateErrors = validationResult(req); 

    if (validateErrors.isEmpty()) {
        await newComment.save(); 
        const comments = await Comment.findAll({
            where: { storyId }
        });
        const story = await Story.findOne({
            where: { id: storyId }
        });
        const storyTitle = story.title; 

        res.render('comments', {
            storyTitle, 
            comments
        });
    } else {
        
    }
}));

module.exports = router; 