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

