const { check } = require('express-validator');
const db = require('../db/models');
const { Comment } = db;

const commentValidator = [
    check('comment')
        .exists({ checkFalsy: true })
        .withMessage('Please write something to submit a comment')
        .isLength({ max: 255 })
        .withMessage('Please keep your comment under 255 characters')
];