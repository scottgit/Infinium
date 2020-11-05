window.addEventListener("DOMContentLoaded", (event) => {
  document.querySelector(".icons_image").addEventListener("click", event => {
    document.getElementById('myDropdown').classList.toggle("show")
  })
    document.body.addEventListener('click', event => {
      const drop = document.getElementById('myDropdown')
      if (!event.target.matches('.icons_image'))
      if (drop.classList.contains('show')) {
        drop.classList.remove('show');
      }
    })
  document.querySelector(".about").addEventListener("click", event => {
    event.preventDefault();
    document.querySelector('.about').classList.add("hide")
    document.querySelector('.dot').classList.add("hide")
    document.querySelector('.person_info').classList.remove("hide")
    document.querySelector('.profilePic').classList.remove("hide")
    document.querySelectorAll('.recentStories').forEach(function (story) {
      story.classList.add("hide")
    })
  })
  
})