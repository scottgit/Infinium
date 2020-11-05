const { check, oneOf } = require('express-validator');
const { User, Story } = require('../db/models');

const storyDraftValidators = [
  check('title')
    .isLength({max: 100})
    .withMessage('Title cannot exceed 100 characters'),
  check('draft')
    .exists({ checkFalsy: true })
    .withMessage('Oops, did you mean to write something so short? Please write more and try publishing again.')
];

module.exports = {storyDraftValidators};
