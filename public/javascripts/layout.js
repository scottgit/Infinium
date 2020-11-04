window.addEventListener("DOMContentLoaded", (event) => {

  // document.querySelector(".logout").addEventListener("click", event => {
  //   event.preventDefault();
  //   fetch("/users/logout", {
  //     method: "POST"
  //   })
  //     .then(function (res) {
  //       if (!res.ok) {
  //         throw Error(res.statusText);
  //       }
  //       return res.json()
  //     })
  //     .then(function (data) {

  //   }).catch((error) => console.log(error))
  // })
  let icons = document.querySelector(".icons");
  let image = document.querySelector("icons_image")
if (icons.contains(image)) {
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
  }
})