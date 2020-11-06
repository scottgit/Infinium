const publishButton = document.querySelector('.story-publish');

if (publishButton) {
  const editorForm = document.getElementById('story-editor');
  const publisherForm = document.getElementById('story-publisher');

  publishButton.addEventListener('click', e => {
    //Show the form
    publisherForm.classList.remove('hide');
    //Grab any title updates
    publisherForm.querySelector('.story-publish-title').value = editorForm.querySelector('.story-edit-title').value;
    //Grab any draft updates
    publisherForm.querySelector('.story-publish-draft').value = editorForm.querySelector('.story-edit-draft').value;
  });

  const imageRoute = document.querySelector('.story-publish-image-path');
  const publishImage = document.querySelector('.story-publish-image');
  if (publishImage.src) publishImage.classList.remove('hide');

  imageRoute.addEventListener('blur', e => {
    publishImage.src = e.target.value;
    if (publishImage.src) {
      publishImage.classList.remove('hide');
    } else {
      publishImage.classList.add('hide');
    }
  });

  const publisherCloseButton = document.querySelector('.story-publisher-close');
  publisherCloseButton.addEventListener('click', e => {
    publisherForm.classList.add('hide');
  })
}
