import Record from '../record';

const recordsContainer = document.querySelector('.records-container'),
navBar = document.querySelector('.nav-bar'),
formDiv = document.querySelector('.new-record-form'),
searchBar = document.getElementById('search-bar'),
modalBtn = document.getElementById('modal-button'),
body = document.querySelector('body');

function colorRandomizer() {
  return `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
};

function renderRecord(record, container, inCollection = false) {
  const newRecord = new Record(record, inCollection);
  newRecord.renderCard(container);
};

export { 
  colorRandomizer, 
  renderRecord,
  recordsContainer,
  navBar,
  formDiv,
  searchBar,
  modalBtn,
  body
}