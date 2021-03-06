// import the Rails Communicator
import APICommunicator from './services/Adapter';

// import the Record Model
import Record from './models/Record';

// import Record Form for adding a new Record
import NewRecordForm from './NewRecordForm';

// import Login form for adding user login before landing
import LoginForm from './LoginForm';

// import DOM Nodes
import { 
  navBar,
  recordsContainer,
  searchBar,
  iframe,
  renderSpotifyUserInfo,
} from './services/utils';

// import Spotify 
import {
  spotifyApi,
  getSpotifyUserInfo,
  getAlbum,
  getPlaylists,
  accessUrl,
  accessToken
} from './services/SpotifyApi';

// import all Styles
import '../styles/login.css';
import '../styles/styles.css';
import '../styles/navigation.css';
import '../styles/spotify.css';


const API = new APICommunicator();
const userRecords = [];
let filtered;
let currentView;

// ---------------- RENDERS -------------------------//

function renderRecord(record, container, inCollection = false) {
  const newRecord = new Record(record, inCollection);
  newRecord.renderCard(container);
};

function renderAllRecords(){
  currentView = "all"
  navBar.style.display = "block";
  iframe.style.display = 'none';
  recordsContainer.style.display = "flex";
  recordsContainer.innerHTML = '';
  
  const userSpan = document.querySelector('.spotify-span');
  if (!userSpan) {
    getSpotifyUserInfo()
    .then(userInfo => renderSpotifyUserInfo(userInfo));
  };
  
  API.fetchRecords()
  .then(records => records.forEach(record => renderRecord(record, recordsContainer)));
};

function renderCollection(){
  currentView = "collection"
  userRecords.forEach(userRecord => renderRecord(userRecord, recordsContainer, true));
};

function filterRecords(records) {
  const searchInput = searchBar.value.toLowerCase();
  filtered = records.filter(({ title, artist, genre }) => {
    return (title.toLowerCase().includes(searchInput)
    || artist.toLowerCase().includes(searchBar.value.toLowerCase(searchInput))
    || genre.toLowerCase().includes(searchBar.value.toLowerCase(searchInput)))
  });
  renderFilteredRecords(filtered);
};

function renderFilteredRecords(filtered){
  recordsContainer.innerHTML = '';
  if(currentView === "collection"){
    filtered.forEach(record => renderRecord(record, recordsContainer, true));
  } else {
    filtered.forEach(record => record.renderCard(recordsContainer));
  }
};

function renderLogin(){
  currentView = 'login';
  navBar.style.display = 'none';
  iframe.style.display = 'none';
  recordsContainer.style.display = 'none';

  loginForm.render()
  loginForm.div.addEventListener('submit', e => {
    e.preventDefault();
    const logInInput = document.querySelector('#log-in').value;
    loginForm.handleSubmit(logInInput)
      .then(user => {
        window.location.href = accessUrl;
        localStorage.userId = user.id;
        user.records.forEach(record => userRecords.push(record));
        landing.remove();
        renderAllRecords();
      }).catch(error => console.error)
  });
}

const formDiv = new NewRecordForm();
formDiv.render();
const loginForm = new LoginForm();

if (localStorage.userId){
  API.getUser(localStorage.userId)
  .then(user => {
    spotifyApi.setAccessToken(accessToken);
    user.records.forEach(r => userRecords.push(r));
    renderAllRecords();
  });
} else {
  renderLogin();
};

//-----------EVENT LISTENERS------------------------//
recordsContainer.addEventListener('click', (e) => {
  if (e.target.dataset.action === "add-record") {
    const recordId = e.target.dataset.recordId;
    API.postToCollection(localStorage.userId, recordId)
    .then(data => {
      if(data.message){
        alert(data.message);
      } else {
        e.target.parentElement.parentElement.parentElement.classList.add('rotate');
        userRecords.push(data.record);
      }
    });
  };
  
  if(e.target.dataset.action === "remove-record"){ 
    const recordId = e.target.dataset.recordId;
    API.removeFromCollection(localStorage.userId, recordId)
    .then(recordId => {
      const foundIndex = userRecords.findIndex(record => record.id === recordId);
      userRecords.splice(foundIndex, 1);
      const recordDiv = document.querySelector(`[data-record-card-id='${recordId}']`);
      recordDiv.remove();
    });
  };
  
  if(e.target.dataset.action === "play-record"){
    e.stopPropagation();
    const title = e.target.parentElement.querySelector('h1.record-title').innerText;
    const artist = e.target.parentElement.querySelector('h2.record-artist').innerText;
    
    getAlbum(title, artist)
    .then(data => {
      iframe.style.display = 'block';
      const albumId = data.albums.items[0].id;
        iframe.src = `https://open.spotify.com/embed/album/${albumId}`
      })
      .catch(() => iframe.src = `https://open.spotify.com/embed/album/`);
    };
  });
  
  navBar.addEventListener('click', (e) => {
    if (e.target.innerText === 'My Collection') {
      recordsContainer.innerHTML = '';
      renderCollection();
    } else if (e.target.innerText === 'All Records') {
      renderAllRecords();
    };
    
    if (e.target.dataset.action === 'flip'){
      const cards = document.querySelectorAll(".flip-card");
      cards.forEach(card => {
        card.classList.remove('flipped');
      });
    };
    
    if(e.target.dataset.action === "logout"){
      localStorage.removeItem("userId");
      renderLogin();
    }
  });
  
  
  searchBar.addEventListener('input', (e) => {
    if(currentView === "collection"){
      filterRecords(userRecords);
    } else {
      filterRecords(Record.all)
    }
  });
