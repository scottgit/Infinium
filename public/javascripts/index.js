document.getElementById('upvote').addEventListener('click', (e) => {
    fetch(`/stories/1/upvote`, {
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
        alert(res.message);
      })
});
