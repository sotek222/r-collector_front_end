import Record from '../models/Record';

const recordsContainer = document.querySelector('.records-container'),
navBar = document.querySelector('.nav-bar'),
formDiv = document.querySelector('.new-record-form'),
searchBar = document.getElementById('search-bar'),
modalBtn = document.getElementById('modal-button'),
body = document.querySelector('body'),
iframe = document.querySelector('.web-player');

function colorRandomizer() {
  return `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
};

function renderRecord(record, container, inCollection = false) {
  const newRecord = new Record(record, inCollection);
  newRecord.renderCard(container);
};

function renderSpotifyUserInfo({display_name, images}){
  navBar.querySelector('.text-white').insertAdjacentHTML('beforeend', `
    <span class="spotify-span">
      <p class="spotify-user-name">Logged in as ${display_name}</p>
      <img 
      class="spotify-avatar"
      src=${images[0].url} alt="spotify profile image">
    </span>
    `);
};

export { 
  colorRandomizer, 
  renderRecord,
  recordsContainer,
  navBar,
  formDiv,
  searchBar,
  modalBtn,
  body,
  iframe,
  renderSpotifyUserInfo
}