document.addEventListener("DOMContentLoaded", e => {
  const draftsTab = document.querySelector('.tab-drafts');
  const publishedTab = document.querySelector('.tab-published');
  const drafts = document.getElementById('drafts');
  const published = document.getElementById('published');
  const storiesContainer = document.querySelector('.stories-container');

  if (draftsTab && publishedTab) {
    draftsTab.addEventListener('click', e => {
      e.stopPropagation();
      draftsTab.classList.add('active');
      publishedTab.classList.remove('active');
      drafts.classList.remove('hide');
      published.classList.add('hide');
    });
    publishedTab.addEventListener('click', e => {
      e.stopPropagation();
      publishedTab.classList.add('active');
      draftsTab.classList.remove('active');
      drafts.classList.add('hide');
      published.classList.remove('hide');
    });
  }

  storiesContainer.addEventListener('click', e => {
    const target = e.target;
    const menu = target.nextSibling;
    if (menu.classList.contains('hide')) {
      target.classList.add('active');
      menu.classList.remove('hide');
    } else {
      target.classList.remove('active');
      menu.classList.add('hide');
    }
  });

  
})
