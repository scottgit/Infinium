import {postFollow, deleteFollow} from './follow.js'

window.addEventListener("DOMContentLoaded", (event) => {

  document.querySelector(".about").addEventListener("click", event => {
    event.preventDefault();
    let question = document.querySelector(".question");
    if (question) {
      document.querySelector('.question_ask').classList.add("hide")
      document.querySelector('.question_answer').classList.add("hide")
    }
    document.querySelector('.about').style.color = "black"
    document.querySelector('.about').classList.add("about_remove")
    document.querySelector('.person_info').classList.remove("hide")
    document.querySelector('.profilePic').classList.remove("hide")
    document.querySelectorAll('.recentStories').forEach(function (story) {
    story.classList.add("hide")
    })
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
  if (following) {
    following.addEventListener('click', async (event) => {
      event.preventDefault()
      deleteFollow(follow, following, followersCount)
    })
  }
})
