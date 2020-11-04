const csrf = require('csurf');
const { User, Story } = require('../db/models');
const { Op } = require("sequelize");

const csrfProtection = csrf({cookie: true});

const asyncHandler = (handler) => {
    return (req, res, next) => {
        return handler(req, res, next).catch(err => next(err));
    };
};

/* Two helper functions for converting to hexadecimal for story URL routes */
const setHexadecimal = number => number.toString(16);

const parseHexadecimal = hexString => parseInt(hexString, 16);

/* Used to build a cleaner story object to send in requests, including the hexId for the URL path */
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

/* Reads request to determine if a JSON response is wanted, else HTML is sent */
const wantsJSON = req => {
    return /application\/json/.test(req.get('accept'));
}

/* Used to create the "where" query for stories, based on whether it is all users, one user, or one user's particular story */
const isPublished = (userId, storyId) => {
    const published = {
        [Op.and]: [{[Op.ne]: ''}, {[Op.ne]: null}]
    }
    if (userId) {
        if (storyId) {
            return {
                id: storyId,
                userId,
                published
            }
        }

        return {
            userId,
            published
        }
    }
    else {
        return {published}
    }
}

const isDraft = () => {
    return {
        draft: {
            [Op.and]: [{[Op.ne]: ''}, {[Op.ne]: null}]
        }
    }
}

/* Used for include statements in routes to get author name of a story */
const getAuthor = () => {
    return [{
        model: User,
        attributes: ['username']
    }];
}

/* User to route the response as either JSON or HTML based on request */
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

/* Trending filter callback */
const getTrending = (stories, req) => {
    //TODO implement actual trending logic, probably in the db query
    //Just randomly selecting trending stories
    const limits = req.params[1] ? parseInt(req.params[1],10) : 3;
    let limit = Math.min(limits, stories.length);

    let trending = [];
    if (stories) {
      for(let i=0; i<limit; i++) {
        const getIdx = Math.floor(Math.random() * stories.length);
        trending.push(...stories.splice(getIdx, 1));
      }
    }
    return trending;
}

/* Highlights filter callback */
const getHighlights = (stories) => {
    //TODO implement actual highlight logic, probably in the db query
    //Just randomly selecting highlight stories
    const limits = 5;
    let limit = Math.min(limits, stories.length);

    let highlight = [];
    if (stories) {
      for(let i=0; i<limit; i++) {
        const getIdx = Math.floor(Math.random() * stories.length);
        highlight.push(...stories.splice(getIdx, 1));
      }
    }
    return highlight
}

/* Get a list of stories based on critera; all parameters are optional, passed within an object for destructuring, but if storyId then userId is required; any filter function expects at least the stories list, possibly req and/or res */
const getStoryList = async ({req, res, userId, storyId, limits, ordering, filter} = {}) => {

    const queryParams = {
        where: isPublished(userId, storyId),
        include: getAuthor(),
    };

    if (limits) queryParams.limit = limits;
    if (ordering) queryParams.order = ordering;

    let stories = await Story.findAll(queryParams);

    if(stories) stories = preProcessStories(stories);

    if(filter) stories = filter(stories, req, res);
    console.log("filtered", stories)

    return stories;
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
    getStoryList,
    getHighlights,
    getTrending,
}
