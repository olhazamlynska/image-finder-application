import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { createMarkup } from './js/createMarkup';
import { pixabayAPI } from './js/PixabayAPI';
import { refs } from './js/refs';
import { spinnerPlay, spinnerStop } from './js/spinner';

spinnerPlay();

window.addEventListener('load', function (event) {
  spinnerStop();
});

const pixaby = new pixabayAPI();

let options = {
  root: null,
  rootMargin: '100px',
  threshold: 1.0,
};

let callback = async function (entries, observer) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      pixaby.incrementPage();
      observer.unobserve(entry.target);

      try {
        spinnerPlay();
        const { hits } = await pixaby.getPhotos();
        const markup = createMarkup(hits).join('');
        refs.gallery.insertAdjacentHTML('beforeend', markup);

        if (pixaby.isShowLoadMore) {
          const target = document.querySelector('.gallery a:last-child');
          observer.observe(target);
        } else
          Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
        modalGallery.refresh();
        scrollPage();
      } catch (error) {
        Notify.failure(error.message, 'Something went wrong!');
        clearPage();
      } finally {
        spinnerStop();
      }
    }
  });
};

let observer = new IntersectionObserver(callback, options);

const handleSubmit = async event => {
  event.preventDefault();

  const {
    elements: { searchQuery },
  } = event.currentTarget;

  const searchquery = searchQuery.value.trim().toLowerCase();

  if (!searchquery) {
    clearPage();
    Notify.info('Enter data to search!');
    return;
  }

  pixaby.query = searchquery;

  clearPage();

  try {
    spinnerPlay();
    const { hits, total } = await pixaby.getPhotos();

    if (hits.length === 0) {
      Notify.failure(
        `Sorry, there are no images matching your ${searchquery}. Please try again.`
      );
      return;
    }

    const markup = createMarkup(hits).join('');
    refs.gallery.insertAdjacentHTML('beforeend', markup);
    pixaby.calculateTotalPages(total);
    Notify.success(`Hooray! We found ${total} images.`);

    if (pixaby.isShowLoadMore) {
      const target = document.querySelector('.gallery a:last-child');
      observer.observe(target);
    }

    modalGallery.refresh();
  } catch (error) {
    Notify.failure(error.message, 'Something went wrong!');
    clearPage();
  } finally {
    spinnerStop();
  }
};

const onLoadMore = async () => {
  pixaby.incrementPage();

  if (!pixaby.isShowLoadMore) {
    refs.btnLoadMore.classList.add('is-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
  try {
    const { hits } = await pixaby.getPhotos();
    const markup = createMarkup(hits).join('');
    refs.gallery.insertAdjacentHTML('beforeend', markup);

    modalGallery.refresh();
  } catch (error) {
    Notify.failure(error.message, 'Something went wrong!');
    clearPage();
  }
};

function clearPage() {
  pixaby.resetPage();
  refs.gallery.innerHTML = '';
  refs.btnLoadMore.classList.add('is-hidden');
}

refs.form.addEventListener('submit', handleSubmit);
refs.btnLoadMore.addEventListener('click', onLoadMore);

const modalGallery = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

function scrollPage() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

window.addEventListener('scroll', function (event) {
  scrollFunction();
});

function scrollFunction() {
  if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
    refs.btnUpWrapper.style.display = 'block';
  } else {
    refs.btnUpWrapper.style.display = 'none';
  }
}
refs.btnUp.addEventListener('click', event => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
