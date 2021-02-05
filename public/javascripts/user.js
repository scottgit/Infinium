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
    //remove the original text and add a new text box for editing 
    console.log("HEYY")
    const editButton = document.querySelector(".nameplate_bio_edit");
    editButton.innerHTML = "Cancel"; 
    const description = document.querySelector(".nameplate_bio"); 
    const originalText = description.innerHTML;
    description.remove(); 
    const newDescription = document.createElement("textarea"); 
    newDescription.setAttribute("class", "nameplate_bio_edit_textbox");
    newDescription.setAttribute("rows", "7");
    newDescription.setAttribute("cols", "40");
    newDescription.setAttribute("maxlength", "250");
    newDescription.value = originalText;   
    editButton.before(newDescription); 
    editButton.remove(); 
    //add cancel & save button  
    const cancelButton = document.createElement("button"); 
    cancelButton.setAttribute("class", "nameplate_bio_cancel"); 
    cancelButton.innerHTML = "Cancel"; 
    newDescription.after(cancelButton); 
    const saveButton = document.createElement("button"); 
    saveButton.setAttribute("class", "nameplate_bio_save");
    saveButton.innerHTML = "Save";  
    cancelButton.after(saveButton); 
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
