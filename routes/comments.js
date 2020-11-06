const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator'); 

const db = require('../db/models');
const { Comment, Story } = db; 
const { asyncHandler } = require('./utils'); 
const commentValidator = require('../validations/comments');
const { sequelize } = require('../db/models');
const{requireAuth} = require('../auth');

const commentNotFoundError = (id) => {
    const error = new Error(`Comment ${id} not found`); 
    error.title = 'Comment not found'; 
    error.status = 404; 
    return error; 
}

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
        res.status(204).end(); 
    } else {
        const errors = validateErrors.array().map(error => error.msg);  
        res.render('comments', { 
            errors,
        });      
    }
}));

router.put('/:id(\\d+)', commentValidator, asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10); 
    const oldComment = await Comment.findByPk(id); 
    
    const validateErrors = validationResult(req); 
    
    if (validateErrors.isEmpty()) {
        const { comment } = req.body; 
        oldComment.comment = comment; 
        await oldComment.save(); 
        res.status(204).end(); 
    } else {
        const errors = validateErrors.array().map(error => error.msg);  
        res.render('comments', { 
            errors,
        });      
    }
}));

router.delete('/:id(\\d+)', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10); 
    const comment = await Comment.findByPk(id); 

    if (comment) {
        await comment.destroy(); 
        res.status(204).end(); 
    } else {
        next(commentNotFoundError(error)) 
    }
}));

module.exports = router; 