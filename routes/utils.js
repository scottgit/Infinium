const csrf = require('csurf');
const { User } = require('../db/models');
const { Op } = require("sequelize");

const csrfProtection = csrf({cookie: true});

const asyncHandler = (handler) => {
    return (req, res, next) => {
        return handler(req, res, next).catch(err => next(err));
    };
};

const setHexadecimal = number => number.toString(16);

const parseHexadecimal = hexString => parseInt(hexString, 16);

const preProcessStories = stories => {
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    const processed = stories.map(story => {
        story = story.toJSON();
        story.hexId = setHexadecimal(story.id);
        story.author = story.User.username;
        story.date = story.updatedAt.toLocaleDateString("en-US", dateOptions);
        delete story.User;
        return story;
    });
    return processed;
};

const wantsJSON = req => {
    return /application\/json/.test(req.get('accept'));
}

const isPublished = () => {
    return {
        published: {
            [Op.and]: [{[Op.ne]: ''}, {[Op.ne]: null}]
        }
    }
}

const isDraft = () => {
    return {
        draft: {
            [Op.and]: [{[Op.ne]: ''}, {[Op.ne]: null}]
        }
    }
}

const getAuthor = () => {
    return [{
        model: User,
        attributes: ['username']
    }];
}

const sendStoryList = (byJSON, res, stories, title) => {
    if(byJSON) {
        res.json({stories});
    }
    else {
        res.render('story-list', {
            title,
            stories
        });
    }
}

module.exports = {
    csrfProtection,
    asyncHandler,
    setHexadecimal,
    parseHexadecimal,
    preProcessStories,
    wantsJSON,
    isPublished,
    isDraft,
    getAuthor,
    sendStoryList,
}
