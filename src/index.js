import { PixabayAPI } from './js/PixabayAPI';
import { createMarkup } from './js/createMarkup';
import { refs } from './js/refs';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const pixabay = new PixabayAPI();

console.log(pixabay);

async function onFormSubmit(event) {
  event.preventDefault();

  console.log(event);
  console.log(event.target);
  console.log(event.currentTarget);
}

refs.form.addEventListener('submit', onFormSubmit);
