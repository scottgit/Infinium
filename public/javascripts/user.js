window.addEventListener("DOMContentLoaded", (event) => {

  document.querySelector(".about").addEventListener("click", event => {
    event.preventDefault();
    let question = document.querySelector(".question");
    if (question) {
      document.querySelector('.question_ask').classList.add("hide")
      document.querySelector('.question_answer').classList.add("hide")
    }
    document.querySelector('.about').style.color = "black"
    document.querySelector('.about').classList.add("about_remove")
    document.querySelector('.person_info').classList.remove("hide")
    document.querySelector('.profilePic').classList.remove("hide")
    document.querySelectorAll('.recentStories').forEach(function (story) {
    story.classList.add("hide")
    })
  })


  /* POST request to create a follow relationship */

  const follow = document.querySelector('.follow');
  const following = document.querySelector('.following');

  follow.addEventListener('click', async(event) => {
    event.preventDefault()
    follow.classList.toggle("hide")
    following.classList.toggle("hide")
    const url = window.location.pathname
    const urlArray = url.split("/")
    const currentUserId = urlArray[2];
    const body = { currentUserId }; 
    try {
        const res = await fetch(`${url}/follows`, {
          method: "POST", 
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
          },
        }); 
        if (!res.ok) {
            throw res; 
        }
    } catch (err) {
        alert(err.message); 
    }
  })


  /* DELETE request to remove a follow relationship */

  following.addEventListener('click', async (event) => {
    event.preventDefault()
    follow.classList.toggle("hide")
    following.classList.toggle("hide")
    const url = window.location.pathname
    const urlArray = url.split("/")
    const currentUserId = urlArray[2];
    const body = { currentUserId }; 
    try {
      const res = await fetch(`${url}/follows`, {
        method: "DELETE", 
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }); 
      if (!res.ok) {
          throw res; 
      }
    } catch (err) {
      alert("Something went wrong. Please try again!"); 
    }
  })
})
