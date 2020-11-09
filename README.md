![Logo of the project](./public/images/infinium-logo.JPG)

# Infinium
> Welcome to Infinium! 

A website created so that the ordinary human can escape from their own reality and enter a world of science fiction and fantasy. Browse endlessly through the countless tales of magic and wonder or create your own world with the story creation tools available. Follow your friends and interact with their recounts of heroism and adventure by liking and commenting.    

## Features

### Stories 

### Comments 

* Access and leave comments on any story 
* Comments dynamically update on your page after you publish, edit or delete them 

Comments functionality on the front-end were created with the use of the Fetch API to provide real-time site updates without the need for a page refresh.  

Example: Dynamically editing a comment with Fetch

```bash
const body = { comment };
try {
    const res = await fetch(`/stories/${storiesId}/comments/${commentId}`, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!res.ok) {
        throw res;
    }
} catch (err) {
    alert("Something went wrong. Please try again!");
}
```
PostgreSQL utilization for database storage of all comments, available for any Fetch method request. 

Example: Back-end routing established for accessing and deleting a comment from the database. 

```bash
router.delete('/:id(\\d+)', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const comment = await Comment.findByPk(id);

    if (comment) {
        await comment.destroy();
        res.status(204).end();
    } else {
        const errors = validateErrors.array().map(error => error.msg);
        res.render('comments', {
            errors,
        });
    }
}));
```

## FAQ

### How can I write a story or leave a comment? 

You will first need to sign-up for an account. Once you are logged in, you will have access to all features on the website, which include writing a story or leaving a comment. 

### How can I follow my favourite writers? 

See a story you like? You can click on the follow link at the top of any story page to begin following that writer.  

## Links

Your destiny awaits...follow this link to enter Infinium:

https://infinium.herokuapp.com/

## Contributing 

* Dale Sakamoto - DaleTsakamoto @ GitHub 
* Michael Jensen - Mjensen24 @ GitHub
* Scott Smith - scottgit @ GitHub 
* Rhys Previte - Preezey24 @ GitHub 

