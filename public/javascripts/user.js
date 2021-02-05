import {postFollow, deleteFollow} from './follow.js'

window.addEventListener("DOMContentLoaded", (event) => {

  let showAbout = false;

  document.querySelector(".about").addEventListener("click", event => {
    event.preventDefault();
    showAbout = !showAbout;
    const question = document.querySelector(".question");
    const aboutButton = document.querySelector('.about');
    const aboutBlock = document.querySelector('.about_me');
    const storiesBlock = document.querySelector('.recentStories');

    if (question) {
      if (showAbout) {
        question.classList.add("hide")
      }
      else {
        question.classList.remove("hide")
      }
    }
    if (showAbout) {
      aboutButton.innerHTML = 'Stories';
      aboutBlock.classList.remove("hide")
      storiesBlock.classList.add("hide")
    }
    else {
      aboutButton.innerHTML = 'About';
      aboutBlock.classList.add("hide")
      storiesBlock.classList.remove("hide")
    }
  })

  /* Edit the user description */ 
  document.querySelector(".nameplate_bio_edit").addEventListener("click", event => {
    const parent = document.querySelector(".nameplate"); 
    const description = document.querySelector(".nameplate_bio"); 
    const originalText = description.innerHTML;
    description.remove(); 
    const newDescription = document.createElement("input"); 
    newDescription.setAttribute("class", "nameplate_bio_edit_textbox");
    newDescription.value = originalText;   
    parent.prepend(newDescription); 
  });


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
