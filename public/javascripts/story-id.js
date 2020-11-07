window.addEventListener("DOMContentLoaded", (event) => {

  document.querySelector(".about").addEventListener("click", event => {
    event.preventDefault();
    // let question = document.querySelector(".question");
    // if (question) {
    //   document.querySelector('.question_ask').classList.add("hide")
    //   document.querySelector('.question_answer').classList.add("hide")
    // }
    document.querySelector('.about').classList.add("hide")
    document.querySelector('.dot').classList.add("hide")
    document.querySelector('.person_info').classList.remove("hide")
    document.querySelector('.profilePic').classList.remove("hide")
    document.querySelectorAll('.recentStories').forEach(function (story) {
      story.classList.add("hide")
    })
  })

  document.getElementById('upvote').addEventListener('click', (e) => {
    const url = window.location.pathname;
    console.log(url);
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
        //   console.log(data);
          let score = document.getElementById('likesCount');
          score.innerHTML = data.likesCount;
      })
      .catch (err => {
        alert(err.message);
      })
});

  document.querySelector(".comment_button").addEventListener('click', event => {
    event.preventDefault()
    const commentsContainer = document.querySelector('.comments-container');
    if (commentsContainer.classList.contains("hide")) {
      commentsContainer.classList.remove("hide")
    }
    commentsContainer.classList.toggle("reveal")
    commentsContainer.classList.toggle("unreveal")
  })

})
