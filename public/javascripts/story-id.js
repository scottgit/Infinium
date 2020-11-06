window.addEventListener("DOMContentLoaded", (event) => {

  if (document.querySelector(".dropdown")){
    document.querySelector(".icons_image").addEventListener("click", event => {
      event.preventDefault();
      document.getElementById('myDropdown').classList.toggle("show")
    })
  }
  document.body.addEventListener('click', event => {
    const drop = document.getElementById('myDropdown')
    if (!event.target.matches('.icons_image'))
      if (drop.classList.contains('show')) {
        drop.classList.remove('show');
      }
  })

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