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
  const followersCount = document.querySelector('.followers_count > span');
  const aboutFollowersCount = document.querySelector('.person_info_follower > span')

  //Follow links will not be visible to non-logged in users
  if (follow) {
    follow.addEventListener('click', async(event) => {
      event.preventDefault()
      let url = window.location.pathname
      const urlArray = url.split("/")
      const currentUserId = urlArray[2];
      if(urlArray.length === 5) { //from stories page
        url = urlArray.slice(0,3).join('/');
      }
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
              console.error(res);
              throw new Error('Failed to complete request.');
          }
          follow.classList.toggle("hide");
          following.classList.toggle("hide");
          const liveCountUpdate = parseInt(followersCount.innerHTML,10) + 1;
          followersCount.innerHTML= liveCountUpdate;
          aboutFollowersCount.innerHTML= liveCountUpdate;
      } catch (err) {
          alert(err.message);
      }
    })


    /* DELETE request to remove a follow relationship */

    following.addEventListener('click', async (event) => {
      event.preventDefault()
      let url = window.location.pathname
      const urlArray = url.split("/")
      const currentUserId = urlArray[2];
      if(urlArray.length === 5) { //from stories page
        url = urlArray.slice(0,3).join('/');
      }
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
          throw new Error('Failed to complete request.');
        }
        follow.classList.toggle("hide")
        following.classList.toggle("hide")
        followersCount.innerHTML= parseInt(followersCount.innerHTML,10) - 1;
      } catch (err) {
        console.error(res);
        alert(err.message);
      }
    })
  }
})
