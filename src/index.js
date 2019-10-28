
import APICommunicator from './services/adapter';
import Record from './record';

const API = new APICommunicator();
// --------------- Selectors -----------------------------------//
const recordsContainer = document.querySelector('.records-container');
const navBar = document.querySelector('.nav-bar');
const formDiv = document.querySelector('.new-record-form');
const searchBar = document.getElementById('search-bar');
const modalBtn = document.getElementById('modal-button');
const body = document.querySelector('body');
const userRecords = [];
let filtered;
// ---------------- RENDERS -------------------------//


function renderRecord(record){
  const newRecord = new Record(record);
  newRecord.renderCard(recordsContainer);
};

function renderAllRecords(){
  navBar.style.display = "block";
  recordsContainer.style.display = "flex";
  recordsContainer.innerHTML = '';
  
  API.fetchRecords()
  .then(records => {
    records.forEach(record => {
      renderRecord(record)
    });
  });
};

function renderCollection(){
  if(userRecords.length > 0){
    userRecords.forEach(userRecord => {
      renderRecord(userRecord);
    })
  } else {
    API
    .getUser(localStorage.getItem('userId'))
    .then(user => {
      user.records.forEach(userRecord => {
        renderRecord(userRecord);
      });
    });
  };
};

function renderFilteredRecords(filtered){
  recordsContainer.innerHTML = '';
  filtered.forEach(record => {
    record.renderCard(recordsContainer);
  });
};


function renderLogin(){
  navBar.style.display = 'none';
  recordsContainer.style.display = 'none';

  const landing = document.createElement('div');
  landing.setAttribute('class', 'landing');
  landing.innerHTML = `
  <h1 class="login-title">R-Collector</h1>
  <h3 class="login-text">Log-in</h3>
  <input class="login-div" id="log-in" placeholder="Enter Email"></input>
  <button class="login-div" data-action="login">Log-in</button><br>
  <div></div>
  `;
  body.appendChild(landing);


  landing.addEventListener('click', e => {
    if (e.target.dataset.action === "login") {
      const logInInput = document.querySelector('#log-in').value;

      API.postUser(logInInput)
      .then(user => {
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
  renderAllRecords();
} else {
  renderLogin();
};

recordsContainer.addEventListener('click', (e) => {
  if(e.target.innerText === "Add to Collection") {
    let recordId = parseInt(e.target.dataset.recordId);
    const sucessModal = document.getElementById('succesModal');
    postToCollection(localStorage.userId, recordId);

    setTimeout(function() {
      succesModal.click()
    }, 1500)
  }

  if(e.target.innerText === "Remove from Collection"){
    const collectionId = e.target.dataset.collectionId
    removeFromCollection(collectionId)
    .then(() => {
      const recordDiv = e.target.parentNode;
      recordDiv.remove();
    })
  }
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
  const title = document.querySelector(".record-title").value;
  const artist = document.querySelector(".record-artist").value;
  const genre = document.querySelector(".record-genre").value;
  const image = document.querySelector(".record-img").value;

  if (e.target.innerText === "Create Record") {
    API.postRecord(title, artist, genre, image)
    .then(record => renderRecord(record))
    document.querySelector(".record-title").value = "";
    document.querySelector(".record-artist").value = "";
    document.querySelector(".record-genre").value = "";
    document.querySelector(".record-img").value = "";
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
