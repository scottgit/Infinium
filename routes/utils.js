const csrf = require('csurf');

const csrfProtection = csrf({cookie: true});

const asyncHandler = (handler) => {
    return (req, res, next) => {
        return handler(req, res, next).catch(err => next(err));
    };
};

const setHexadecimal = number => number.toString(16);

const parseHexadecimal = hexString => parseInt(hexString, 16);


module.exports = {
    csrfProtection,
    asyncHandler,
}
