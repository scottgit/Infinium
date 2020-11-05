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
    
    document.querySelectorAll('.comments-container__comment-nav-menu').forEach(menu => {
        menu.addEventListener('click', async (e) => {
            const dropdown = menu.querySelector('.comments-container__comment-nav-menu-dropdown');
            const edit = document.getElementById('edit');
            const remove = document.getElementById('delete'); 
            
            if (dropdown.classList.contains('comments-container__comment-nav-menu-dropdown--hidden')) {
                dropdown.classList.remove('comments-container__comment-nav-menu-dropdown--hidden'); 

                remove.addEventListener('click', (e) => {

                })



            } else {
                dropdown.classList.add('comments-container__comment-nav-menu-dropdown--hidden');
            }
        })
    });
});