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
        menu.addEventListener('click', (e) => {
            const edit = document.getElementById('edit');
            const remove = document.getElementById('delete');
            
            if (menu.classList.contains('.comments-container__comment-nav-menu-dropdown--hidden')) {
                const commentUserId = menu.getAttribute('title'); 
                const currentUserId = res.locals.user.id; 
                
                if (commentUserId === currentUserId) {
                    menu.classList.remove('.comments-container__comment-nav-menu-dropdown--hidden');
                    
                    remove.addEventListener('click', async (e) => {
                        const id = menu.getAttribute('id');
                        const body = { id }; 
                        try {
                            const res = await fetch(`http://localhost:8080/comments/${id}`, {
                                method: "DELETE", 
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
                }
                    
            }
                
                // edit.addEventListener('click', async (e) => {
                //     const id = menu.getAttribute('id'); 
                //     const formData = new FormData(respond); 
                //     const comment = formData.get("comment"); 
                //     const body = { comment }; 
                //     try {
                //         const res = await fetch(`http://localhost:8080/comments/${id}`, {
                //             method: "PUT", 
                //             body: JSON.stringify(body),
                //             headers: {
                //                 "Content-Type": "application/json",
                //             },
                //         }); 
                //         if (!res.ok) {
                //             throw res; 
                //         }
                //         window.location.href = "/comments/";
                //     } catch (err) {
                //         alert("Something went wrong. Please try again!"); 
                //     }
                // });
            } else {
                menu.classList.add('.comments-container__comment-nav-menu-dropdown--hidden');
            }
        })
    });
});