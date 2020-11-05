const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator'); 

const db = require('../db/models');
const { Comment, Story } = db; 
const { asyncHandler } = require('./utils'); 
const commentValidator = require('../validations/comments');
const { sequelize } = require('../db/models');
const{requireAuth} = require('../auth');


router.get('/', asyncHandler(async (req, res) => {
    const storyId = 3; //parseInt(req.params.id, 10); 
    const comments = await Comment.findAll({
        where: { storyId }, 
        order: [['createdAt', 'DESC']], 
    }); 

    const loggedInUser = 2; //res.locals.user.id; 

    comments.forEach(comment => {
        if (comment.userId === loggedInUser) {
            comment.authCompare = true; 
        }
    });

    res.render('comments', {
        comments, 
    })
}));

router.get('/:id(\\d+)', asyncHandler(async (req, res) => {
    const commentId = parseInt(req.params.id, 10);
    const comment = await Comment.findByPk(commentId); 
    
    const userId = comment.userId; 
    const loggedInUser = comment.userId; //res.locals.user.id; 
    const authCompare = userId === loggedInUser;
      
    if (userId !== loggedInUser) {
        res.redirect('/comments/'); 
    }

    const storyId = comment.storyId; 
    const comments = await Comment.findAll({
        where: { storyId }, 
        order: [['createdAt', 'DESC']], 
    }); 

    comments.forEach(comment => {
        if (comment.userId === loggedInUser) {
            comment.authCompare = authCompare; 
        }
    });

    comments.forEach(comment => {
        if (comment.authCompare === true) {
            console.log(comment); 
        }
    })

    res.render('comments', {
        comments, 
    });        
}))

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

router.put('/:id(\\d+)', commentValidator, asyncHandler(async (req, res) => {
    const { comment } = req.body; 
    const id = parseInt(req.params.id, 10); 
    const oldComment = await Comment.findByPk(id); 

    const validateErrors = validationResult(req); 

    if (validateErrors.isEmpty()) {
        oldComment.comment = comment;
        await comment.save(); 
        res.redirect('/comments');
    } else {
        const errors = validateErrors.array().map(error => error.msg);  
        res.render('comments', { 
            errors,
        });      
    }
}));

router.delete('/:id(\\d+)', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10); 
    await Comment.destroy({ where: { id } });
    res.redirect('/comments/'); 
}))

module.exports = router; 