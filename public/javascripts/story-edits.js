const publishButton = document.querySelector('.story-publish');

if (publishButton) {
  publishButton.addEventListener('click', e => {
    editorForm = document.getElementById('story-editor');
    publisherForm = document.getElementById('story-publisher');
    //Show the form
    publisherForm.classList.remove('hide');
    //Grab any title updates
    publisherForm.querySelector('.story-publish-title').value = editorForm.querySelector('.story-edit-title').value;
    //Grab any draft updates
    publisherForm.querySelector('.story-publish-draft').value = editorForm.querySelector('.story-edit-title').value;
  });

  const imageRoute = document.querySelector('.story-publish-image-path');
  const publishImage = document.querySelector('.story-publish-image');
  imageRoute.addEventListener('blur', e => {
    publishImage.src = e.target.value;
  });
}
