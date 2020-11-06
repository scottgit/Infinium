window.addEventListener("DOMContentLoaded", (event) => {

  //Dropdown js moved to the layout.js which will also include into the story-id
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
    fetch(`/likes${url}/upvote`, {
        method: "POST",
      })
      .then (res => {
          if (!res.ok) throw Error(res.statusText);
          return res.json();
      })
      .then (data => {
        //   console.log(data);
          let score = document.getElementsByClassName('likesCount');
          score[0].innerHTML = data.likesCount;
      })
      .catch (err => {
        alert(err.message);
      })
});

})
