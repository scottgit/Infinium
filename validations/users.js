const { check, oneOf } = require('express-validator'); 

const userRegValidators = [
    check('username')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a value for User Name')
        .isLength({ max: 50 })
        .withMessage('User Name must not be more than 50 characters long')
        .matches(/@/)  
        .withMessage('User Name cannot contain @ symbol'),
    check('email')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a value for Email')
        .isLength({ max: 50 })
        .withMessage('Email must not be more than 50 characters long')
        .isEmail()
        .withMessage('Email is not a valid email'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a value for Password')
        .isLength({ max: 50 })
        .withMessage('Password must not be more than 50 characters long'),
    check('confirmPassword') 
        .exists({ checkFalsy: true })
        .withMessage('Please provide a value for Confirm Password')
        .isLength({ max: 50 })
        .withMessage('Confirm Password must not be more than 50 characters long'),
] 

const userSignInValidators = [ 
    oneOf([
        check('usernameOrEmail')
            .exists({ checkFalsy: true })
            .isLength({ max: 50 }),
        check('password')
            .exists({ checkFalsy: true })
            .isLength({ max: 50 })
    ], 'Please provide a value that is less than 50 characters'), 
]


module.exports = {userRegValidators, userSignInValidators }; 