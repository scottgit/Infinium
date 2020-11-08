import {postFollow, deleteFollow} from './follow.js'

window.addEventListener("DOMContentLoaded", (event) => {
  let lightsaber = document.querySelector(".clap-pic")
  lightsaber.addEventListener('click', event => {
    let randomizer = Math.floor(Math.random() * 4.99);
    lightsaber.src = `/images/lightsaber-${randomizer}.png`
  })

 /* POST request to create a follow relationship */

 const follow = document.querySelector('.follow');
 const following = document.querySelector('.following');
 const followersCount = document.querySelector('.followers_count > span');
 const aboutFollowersCount = document.querySelector('.person_info_follower > span')

 //Follow links will not be visible to non-logged in users

 if (follow) {
   follow.addEventListener('click', async (event) => {
     event.preventDefault()
     postFollow(follow, following, followersCount, aboutFollowersCount);
   })
 }

/* DELETE request to remove a follow relationship */
 following.addEventListener('click', async (event) => {
   event.preventDefault()
   deleteFollow(follow, following, followersCount)
 })

  //Check prevents voting by non-logged in users as no id is set on the clapper
  if (clapper) {
    clapper.addEventListener('click', (e) => {
      const url = window.location.pathname;
      let storyIdArray = url.split('/');
      let storyId = storyIdArray[storyIdArray.length - 1];
      const body = { storyId }
      fetch(`/likes${url}/upvote`, {
          method: "POST",
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' }
        })
        .then (res => {
            if (!res.ok) throw Error(res.statusText);
            return res.json();
        })
        .then (data => {
            if (data.limitedOut) {
              alert('You reached your maximum of 50 likes.')
            } else {
              let score = document.getElementById('likesCount');
              //The likesCount is already the new value of +1
              score.innerHTML = data.likesCount;
            }
        })
        .catch (err => {
          alert(err.message);
        })
    });
  }
  else {
    clapper = document.querySelector('.clap-pic');
    clapper.addEventListener('click', e => {
      if(clapper.id === 'novote') {
        alert('You cannot ignite a lightsaber for your own story!');
      } else {
        alert('We\'re sorry, but you must log in to give lightsabers.');
      }
    })
  }

  const commentButton = document.querySelector(".comment_button");
  if (commentButton) {
    commentButton.addEventListener('click', event => {
      event.preventDefault()
      const commentsContainer = document.querySelector('.comments-container');
      if (commentsContainer.classList.contains("hide")) {
        commentsContainer.classList.remove("hide")
      }
      commentsContainer.classList.toggle("reveal")
      commentsContainer.classList.toggle("unreveal")
    })
  }
})
