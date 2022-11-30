import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 1000;

let value = '';

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(selectCountries, DEBOUNCE_DELAY));

function selectCountries(e) {
  e.preventDefault();
  value = refs.input.value.trim();
  if (value === '') {
    clearMarkup();
    return;
  }
  fetchCountries(value)
    .then(countries => {
      if (countries.length === 1) {
        clearMarkup();
        renderOneCountry(countries);
      } else if (countries.length >= 1 && countries.length <= 10) {
        clearMarkup();
        renderList(countries);
      } else if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(error, clearMarkup());
}

function renderList(countries) {
  const markup = countries
    .map(
      country => `<li class="item">
      <img class='flag' src="${country.flags.svg}" alt="flag">
      <p class="name">${country.name.official}</p>
    </li>`
    )
    .join('');
  refs.list.insertAdjacentHTML('beforeend', markup);
}

function renderOneCountry(countries) {
  const lang = countries.map(({ languages }) => Object.values(languages));
  const markup = countries
    .map(
      country => `<div>
  <div class ="header">
    <img class ="big_flag" src="${country.flags.svg}" alt="flag" />
    <p class="title">${country.name.official}</p>
  </div>
  <p class="title">Capital:<span class="text">${country.capital}</span></p>
  <p class="title">Population:<span class="text">${country.population}</span></p>
  <p class="title">Languages:<span class="text">${lang}</span></p>
</div>`
    )
    .join('');
  refs.info.insertAdjacentHTML('beforeend', markup);
}

function clearMarkup() {
  refs.list.innerHTML = '';
  refs.info.innerHTML = '';
}

function error() {
  Notify.failure('Oops, there is no country with that name');
}
