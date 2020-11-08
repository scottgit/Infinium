window.addEventListener("DOMContentLoaded", (event) => {

  let clapper = document.getElementById('upvote');
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
            let score = document.getElementById('likesCount');
            score.innerHTML = data.likesCount + 1;
        })
        .catch (err => {
          alert(err.message);
        })
    });
  }
  else {
    clapper = document.querySelector('.clap-pic');
    clapper.addEventListener('click', e => {
      alert('We\'re sorry, but you must log in to give claps.')
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
