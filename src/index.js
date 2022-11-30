import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

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
  fetchCountries(value).then(countries => renderOneCountry(countries));
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
    const markup = countries
    .map(
      country => `<div>
  <div>
    <img class ="flag" src="${country.flags.svg}" alt="flag" />
    <p>${country.name.official}</p>
  </div>
  <p>Capital:${country.capital}</p>
  <p>Population:${country.population}</p>
  <p>Languages:${country.languages}</p>
</div>`
    )
    .join('');
  refs.info.insertAdjacentHTML('beforeend', markup);
}
