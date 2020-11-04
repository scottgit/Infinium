const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator'); 

const db = require('../db/models');
const { Comment, Story } = db; 
const { asyncHandler } = require('./utils'); 
const commentValidator = require('../validations/comments');


router.get('/', asyncHandler(async (req, res) => {
    const storyId = 3; //parseInt(req.params.id, 10); 
    let comments = await Comment.findAll({
        where: { storyId }, 
        include: Story,
    });
    
    const storyTitle = comments[0].Story.title; 
    comments = comments.map(comment => {
        return comment.comment;  
    });   

    res.render('comments', {
        storyTitle,
        comments, 
    })
}));

router.post('/', commentValidator, asyncHandler(async (req, res) => {
    const storyId = 3; //parseInt(req.params.id, 10); 
    const { comment } = req.body; 

    const userId = 2; //res.locals.user.id; 
    const newComment =  Comment.build({
        comment, 
        storyId,
        userId,
    });  

    const validateErrors = validationResult(req); 

    if (validateErrors.isEmpty()) {
        await newComment.save(); 
        res.redirect('/comments'); 
    } else {
        const errors = validateErrors.array().map(error => error.msg);  
        res.render('comments', { 
            errors,
        });      
    }
}));

router.put('/', commentValidator, asyncHandler(async (req, res) => {
    const commentId = 
}))

router.delete()

module.exports = router; 