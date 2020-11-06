window.addEventListener("DOMContentLoaded", (event) => {

  document.querySelector(".icons_image_holder").addEventListener("click", event => {
    event.preventDefault();
        document.getElementById('myDropdown').classList.toggle("show")
      })
      document.addEventListener('click', event => {
        const drop = document.getElementById('myDropdown')
        if (!event.target.matches('.icons_image'))
          if (drop.classList.contains('show')) {
            drop.classList.remove('show');
          }
      })
    // }
  })