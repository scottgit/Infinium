window.addEventListener('DOMContentLoaded', e => {
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
    });

    // const menu = document.querySelector('.comments-container__comment-nav-menu');
    // menu.addEventListener('click', (e) => {
    //     menu.classList.remove('.comments-container__comment-nav-menu-dropdown--hidden');
    //     console.log('hello')
    // })
    
    document.querySelectorAll('.comments-container__comment-nav-menu').forEach(menu => {
        menu.addEventListener('click', async (e) => {
            console.log('hello'); 
            const id = menu.getAttribute('id'); 
            try {
                const res = await fetch(`http://localhost:8080/comments/${id}`);
                if (!res.ok) {
                    throw res;
                }
                window.location.href = "/comments/"
            } catch (err) {
                alert("Something went wrong. Please try again!")
            }
        })
    }); 
});