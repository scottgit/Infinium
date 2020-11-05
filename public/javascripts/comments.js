const respond = document.querySelector('.comments-container__new-comment');

respond.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    const formData = new FormData(respond); 
    const comment = formData.get("comment"); 
    const body = { comment }; 
    try {
        const res = await fetch("http://localhost:8080/comments", {
            method: "POST", 
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        }); 
        if (!res.ok) {
            throw res; 
        }
        window.location.href = "/comments/";
    } catch (err) {
        alert("Something went wrong. Please try again!"); 
    }
})