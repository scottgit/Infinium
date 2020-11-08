window.addEventListener('DOMContentLoaded', e => {
    const respond = document.querySelector('.comments-container__new-comment'); 
    const url = window.location.pathname
    const urlArray = url.split("/")
    const storiesId = urlArray[4];

    /*Closing the comments side-bar functionality */ 
    const closeButton = document.querySelector('.comments-container__heading-div-container');
    closeButton.addEventListener('click', (e) => {
        const commentsContainer = document.querySelector('.comments-container');
        commentsContainer.classList.toggle('reveal');
        commentsContainer.classList.toggle("unreveal");
    })

    respond.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(respond); 
        const comment = formData.get("comment"); 
        const body = { comment, storiesId }; 
        let username; 
        try {
            const res = await fetch(`/stories/${storiesId}/comments`, {
                method: "POST", 
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            
            username = await res.json(); 

            if (!res.ok) {
                throw res; 
            }
        } catch (err) {
            alert(err.message); 
        }

        /*clear form */ 
        const textResponse = document.querySelector('.comments-container__new-comment-text-box');
        textResponse.value = ''; 

        //make elements 
        const commentContainer = document.createElement('div'); 
        commentContainer.setAttribute('class', 'comments-container__comment'); 
        const commentNavBar = document.createElement('div'); 
        commentNavBar.setAttribute('class', 'comments-container__comment-nav');
        const commentNavBarUser = document.createElement('div'); 
        commentNavBarUser.setAttribute('class', 'comments-container__comment-nav-user'); 
        const commentNavBarMenu = document.createElement('div'); 
        commentNavBarMenu.setAttribute('class', 'comments-container__comment-nav-menu'); 
        const commentNavBarMenuImage = document.createElement('img'); 
        commentNavBarMenuImage.setAttribute('src', '/images/3-dot-icon.jpg'); 
        commentNavBarMenuImage.setAttribute('class', 'comments-container__comment-nav-menu-image'); 
        const commentNavBarMenuDrop = document.createElement('div'); 
        commentNavBarMenuDrop.setAttribute('class', 'comments-container__comment-nav-menu-dropdown'); 
        commentNavBarMenuDrop.setAttribute('class', 'comments-container__comment-nav-menu-dropdown--hidden');
        const commentButtonEdit = document.createElement('button'); 
        commentButtonEdit.setAttribute('class', 'edit'); 
        const commentButtonDelete = document.createElement('button'); 
        commentButtonDelete.setAttribute('class', 'delete'); 
        commentButtonEdit.innerHTML = 'Edit'; 
        commentButtonDelete.innerHTML = 'Delete'; 
        const commentText = document.createElement('div'); 
        commentText.setAttribute('class', 'comments-container__comment-text-box'); 
        commentText.innerHTML = comment; 

        //set parents 
        const commentsContainer = document.querySelector('.comments-container__comments'); 
        commentsContainer.prepend(commentContainer); 
        commentContainer.appendChild(commentNavBar); 
        commentContainer.appendChild(commentText); 
        commentNavBar.appendChild(commentNavBarUser); 
        commentNavBar.appendChild(commentNavBarMenu); 
        commentNavBarMenu.appendChild(commentNavBarMenuImage);
        commentNavBarMenu.appendChild(commentNavBarMenuDrop);
        commentNavBarMenuDrop.appendChild(commentButtonDelete);
        commentNavBarMenuDrop.appendChild(commentButtonEdit);

        //set user 
        commentNavBarUser.innerHTML = username.username; 
    });
    
    document.querySelectorAll('.comments-container__comment-nav-menu').forEach(menu => {
        menu.addEventListener('click', async (e) => {
            const commentId = menu.getAttribute('id'); 
            const dropdown = menu.querySelector('.comments-container__comment-nav-menu-dropdown');
            const commentBlock = document.getElementById(commentId); 
            const remove = commentBlock.querySelector('.delete');
            const edit = commentBlock.querySelector('.edit'); 

            if (dropdown.classList.contains('comments-container__comment-nav-menu-dropdown--hidden')) {
                dropdown.classList.remove('comments-container__comment-nav-menu-dropdown--hidden'); 

                remove.addEventListener('click', (e) => {
                    const commentId = commentBlock.getAttribute('id');
                    const deleteContainer = commentBlock.querySelector('.delete-container'); 
                    const confirmButton = commentBlock.querySelector('.delete-container__inner-button-confirm');
                    const cancelButton = commentBlock.querySelector('.delete-container__inner-button-cancel');
                    deleteContainer.classList.remove('delete-container--hidden'); 

                    confirmButton.addEventListener('click', async (e) => {
                        try {
                            const res = await fetch(`/stories/${storiesId}/comments/${commentId}`, {
                                method: 'DELETE',
                            });
                            if (!res.ok) {
                                throw res; 
                            }
                            commentBlock.remove(); 
                        } catch (err) {
                            alert("Something went wrong. Please try again!"); 
                        }
                    })

                    cancelButton.addEventListener('click', (e) => {
                        deleteContainer.classList.add('delete-container--hidden'); 
                    })
                })
            

                edit.addEventListener('click', async (e) => {
                    const currentText = commentBlock.querySelector('.comments-container__comment-text-box');
                    const comment = commentBlock.querySelector('.comments-container__comment-text-box').innerHTML; 
                    //create form & attributes 
                    const form = document.createElement('form'); 
                    form.setAttribute('method', 'put'); 
                    form.setAttribute('class', 'comments-container__new-comment'); 
                    //create textbox & attributes 
                    const textBox = document.createElement('textarea'); 
                    textBox.setAttribute('class', 'comments-container__new-comment-text-box');
                    textBox.setAttribute('name', 'comment'); 
                    textBox.innerHTML = comment; 
                    //create div container for buttons 
                    const container = document.createElement('div'); 
                    container.setAttribute('class', 'comments-container__new-comment-button-div'); 
                    //create buttons 
                    const cancelButton = document.createElement('button'); 
                    const updateButton = document.createElement('button'); 
                    cancelButton.innerHTML = 'Cancel'; 
                    updateButton.setAttribute('class', 'comments-container__new-comment-button-respond'); 
                    //updateButton.setAttribute('type', 'submit');
                    updateButton.innerHTML = 'Update'; 

                    currentText.remove(); 
                    commentBlock.appendChild(form); 
                    form.appendChild(textBox); 
                    form.appendChild(container); 
                    container.appendChild(cancelButton); 
                    container.appendChild(updateButton); 

                    updateButton.addEventListener('click', async (e) => {
                        e.preventDefault();
                        const formData = new FormData(form); 
                        const comment = formData.get("comment"); 
                        const body = { comment }; 
                        try {
                            const res = await fetch(`/stories/${storiesId}/comments/${commentId}`, {
                                method: "PUT", 
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
                        const newComment = document.createElement('div'); 
                        newComment.setAttribute('class', 'comments-container__comment-text-box'); 
                        newComment.innerHTML = comment; 
                        form.remove(); 
                        container.remove(); 
                        cancelButton.remove(); 
                        updateButton.remove(); 
                        commentBlock.appendChild(newComment); 
                    })

                    cancelButton.addEventListener('click', (e) => {
                        form.remove(); 
                        cancelButton.remove(); 
                        updateButton.remove();
                        const textBox = document.createElement('div'); 
                        textBox.setAttribute('class', 'comments-container__comment-text-box'); 
                        textBox.innerHTML = comment; 
                        commentBlock.appendChild(textBox); 
                    })
                })
            } else {
                dropdown.classList.add('comments-container__comment-nav-menu-dropdown--hidden');
            }
        });
    })
});
