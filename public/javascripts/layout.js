window.addEventListener("DOMContentLoaded", (event) => {

  if (document.querySelector(".dropdown")){
    document.querySelector(".icons_image").addEventListener("click", event => {
      event.preventDefault();
      document.getElementById('myDropdown').classList.toggle("show")
    })
  }
      document.addEventListener('click', event => {
        const drop = document.getElementById('myDropdown')
        if (!event.target.matches('.icons_image'))
          if (drop.classList.contains('show')) {
            drop.classList.remove('show');
          }
      })
    // }
  })