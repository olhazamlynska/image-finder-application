import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api';
const KEY_API = '30707124-090c2c800eff03e7656171a71';

export class PixabayAPI {
  #page = 1;
  #per_Page = 40;
  #searchQ = '';
  #totalPages = 0;
  #params = {
    params: {
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
    },
  };
  async getPhotos() {
    const response = await axios.get(
      `?key=${KEY_API}&q=${this.#searchQ}&page=${this.#page}`,
      this.#params
    );

    return await response.json();
  }
}
