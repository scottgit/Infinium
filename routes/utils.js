const csrf = require('csurf');

const csrfProtection = csrf({cookie: true});

const asyncHandler = (handler) => {
    return (req, res, next) => {
        return handler(req, res, next).catch(err => next(err));
    };
};

module.exports = {
    csrfProtection,
    asyncHandler,
}
