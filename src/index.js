import APICommunicator from './services/adapter';
import Record from './record';
import {
  renderRecord, 
  navBar,
  recordsContainer,
  formDiv,
  searchBar,
  modalBtn,
  body  
} from './services/utils';
import {
  spotifyApi,
  getSpotifyUserInfo,
  getAlbum,
  accessUrl,
  accessToken
} from './services/SpotifyApi';
import '../styles/login.css';
import '../styles/styles.css';
import '../styles/navigation.css';

const API = new APICommunicator();
const userRecords = [];
let filtered;

// ---------------- RENDERS -------------------------//

function renderAllRecords(){
  navBar.style.display = "block";
  recordsContainer.style.display = "flex";
  recordsContainer.innerHTML = '';

  getSpotifyUserInfo()
    .then(data => {
      navBar.querySelector('.text-white').insertAdjacentHTML('beforeend', `
      <span class="spotify-span">
        <p class="spotify-user-name">Logged in as ${data.display_name}</p>
        <img 
        class="spotify-avatar"
        src=${data.images[0].url} alt="spotify profile image">
      </span>
      `)
    });

  API.fetchRecords()
  .then(records => {
    records.forEach(record => {
      renderRecord(record, recordsContainer)
    });
  });
};

function renderCollection(){
  userRecords.forEach(userRecord => renderRecord(userRecord, recordsContainer, true));
};

function renderFilteredRecords(filtered){
  recordsContainer.innerHTML = '';
  filtered.forEach(record => record.renderCard(recordsContainer));
};


function renderLogin() {
  navBar.style.display = 'none';
  recordsContainer.style.display = 'none';

  const landing = document.createElement('div');
  landing.setAttribute('class', 'landing');
  landing.innerHTML = `
  <h1 class="login-title">R-Collector</h1>
  <h3 class="login-text">Log-in</h3>
  <input class="login-div" id="log-in" placeholder="Enter Email"></input>
  <button class="login-div" data-action="login">Log-in</button><br>
  `;
  body.appendChild(landing);


  landing.addEventListener('click', e => {
    if (e.target.dataset.action === "login") {
      const logInInput = document.querySelector('#log-in').value;

      API.postUser(logInInput)
      .then(user => {
        window.location.href = accessUrl;
        localStorage.userId = user.id;
        user.records.forEach(r => userRecords.push(r));
        landing.remove();
        renderAllRecords();
      });
    };
  });
};

//-----------EVENT LISTENERS------------------------//
if(localStorage.userId){
  API.getUser(localStorage.userId)
  .then(user => {
    spotifyApi.setAccessToken(accessToken);
    user.records.forEach(r => userRecords.push(r));
    renderAllRecords();
  })
} else {
  renderLogin();
};

recordsContainer.addEventListener('click', (e) => {
  if (e.target.dataset.action === "add-record") {
    const recordId = e.target.dataset.recordId;
    API.postToCollection(localStorage.userId, recordId)
    .then(data => {
      if(data.message){
        alert(data.message);
      } else {
        userRecords.push(data.record);
        alert("Added");
      }
    });
  };

  if(e.target.dataset.action === "remove-record"){ 
    const recordId = e.target.dataset.recordId;
    API.removeFromCollection(localStorage.userId, recordId)
    .then(recordId => {
      userRecords.splice(userRecords.findIndex(record => record.id === recordId));
      const recordDiv = document.querySelector(`[data-record-card-id='${recordId}']`);
      recordDiv.remove();
    });
  };

  if(e.target.dataset.action === "play-record"){
    const title = e.target.parentElement.querySelector('h1.record-title').innerText;
    const artist = e.target.parentElement.querySelector('h2.record-artist').innerText;
    
    getAlbum(title, artist)
      .then(data => {
        const albumId = data.albums.items[0].id;
        const iframe = recordsContainer.querySelector('iframe');

        if (iframe) iframe.remove();

        recordsContainer.insertAdjacentHTML('beforeend', `
          <iframe 
            src="https://open.spotify.com/embed/album/${albumId}" 
            width="300" height="380" frameborder="0" 
            allowtransparency="true" 
            allow="encrypted-media">
          </iframe>`);
        }).catch(err => alert(err));
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

// change to a submit event
formDiv.addEventListener('click', (e) => {
  e.preventDefault();
  if (e.target.innerText === "Create Record") {
    const {title, artist, genre, image} = 
    Array.from(document.querySelectorAll('[type="text"]')).reduce((acc, cv) => {
      acc[cv.name] = cv.value
      return acc;
    }, {});
    API.postRecord(title, artist, genre, image)
      .then(record => {renderRecord(record, recordsContainer)})
      document.querySelectorAll('[type="text"]')
      .forEach(input => input.value = "");
  }
  if(e.target.innerText === "Close") {
    document.querySelectorAll('[type="text"]')
      .forEach(input => input.value = "");
  }
});

searchBar.addEventListener('input', (e) => {
  const searchInput = searchBar.value.toLowerCase();
  filtered = Record.all.filter(({ title, artist, genre}) => {
    return (title.toLowerCase().includes(searchInput) 
    || artist.toLowerCase().includes(searchBar.value.toLowerCase(searchInput)) 
    || genre.toLowerCase().includes(searchBar.value.toLowerCase(searchInput)))
  });

  renderFilteredRecords(filtered);
});
