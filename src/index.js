const recordsUrl = "http://localhost:3000/records";
const userUrl = "http://localhost:3000/users";
const collectionUrl = "http://localhost:3000/collections";

const navBar = document.querySelector('.nav-bar');
const formDiv = document.querySelector('.new-record-form');
const recordsContainer = document.querySelector('.records-container');
const searchBar = document.getElementById('search-bar');
const modalBtn = document.getElementById('modal-button');
const body = document.querySelector('body');
const piano = document.querySelectorAll('.piano');
const drums = document.querySelectorAll('.drums');


let userId;
let filtered;

// ---------------- RENDERS -------------------------//

function renderRecord(game) {
  const html = `
    <div class="flip-card">
      <div class="flip-card-inner">
        <div class="flip-card-front">
          <img class="card-image" src=${game.image_url} alt="Album Art" data-user-id=${userId} style="width:300px;height:300px;">
        </div>
        <div class="flip-card-back">
          <h1 class="record-title">${game.title}</h1>
          <h2 class="record-artist">${game.artist}</h2>
          <h3 class="record-genre">${game.genre}</h3>
          <button 
            id="modal-success-button" 
            class="record-button" 
            data-user-id=${userId} 
            data-record-id=${game.id} 
            data-toggle="modal" 
            data-target="#succesModal">
            Add to Collection
          </button>
        </div>
      </div>
    </div>
  `;

  recordsContainer.insertAdjacentHTML('beforeend', html)
};

function renderAllRecords(){
  navBar.style.display = "block";
  recordsContainer.style.display = "flex";
  recordsContainer.innerHTML = '';

  fetchRecords(recordsUrl)
  .then(records => {
    records.forEach(record => {
      renderRecord(record)
    })
  })
};

function renderCollection(){
  fetchRecords(collectionUrl)
  .then(collections => {
    collections.forEach(collection => {
      if (collection.user_id === userId) {
        const html = `
          <div class="flip-card">
            <div class="flip-card-inner">
              <div class="flip-card-front">
                <img class="card-image" src=${collection.record.image_url} alt="Album Art" data-user-id=${userId} style="width:300px;height:300px;">
              </div>
              <div class="flip-card-back">
                <h1 class="record-title">${collection.record.title}</h1>
                <h2 class="record-artist">${collection.record.artist}</h2>
                <h3 class="record-genre">${collection.record.genre}</h3>
                <button 
                  id="modal-success-button" 
                  class="record-button" 
                  data-user-id=${userId} 
                  data-record-id=${collection.record.id} 
                  data-toggle="modal" 
                  data-target="#succesModal">
                  Add to Collection
                </button>
                </div>
            </div>
          </div>`;

        recordsContainer.insertAdjacentHTML("beforeend", html);
      }
    })
  })
};

function renderLogin(){
  navBar.style.display = 'none';
  recordsContainer.style.display = 'none';

  const landing = document.createElement('div');
  landing.setAttribute('class', 'landing');
  landing.innerHTML = `
  <h1 class="login-title">R-Collector</h1>
  <h3 class="login-div">Log-in</h3>
  <input class="login-div" id="log-in" placeholder="Enter Email"></input>
  <button class="login-div">Log-in</button><br>
  <div></div>
  <!-- <iframe></iframe> -->
  `;
  // iFrame.style.display = 'none';
  body.appendChild(landing);

  //music box

  let password = [];
  let iFrame = document.querySelectorAll('iframe');

  document.addEventListener('keydown', (e => {
    password.push(e.key)
    console.log(password)
    if(e.key === "Enter") {
      password = []
    } else if (password.join('') === "piano") {
      landing.lastElementChild.remove()
      landing.innerHTML += `<iframe class="piano" src="http://www.freeonlinegames.com/embed/2681" width="500" height="300" frameborder="no" scrolling="no"></iframe>`
      password = []
    } else if(password.join('') === "drums") {
      landing.lastElementChild.remove()
      landing.innerHTML += `<iframe class="drums" src="http://www.freeonlinegames.com/embed/127254" width="500" height="500" frameborder="no" scrolling="no"></iframe>`
      password = []
    } else if(password.join('') === "games") {
      landing.lastElementChild.remove()
      landing.innerHTML += `<iframe class="games" src="http://www.freeonlinegames.com/embed/124792" width="800" height="440" frameborder="no" scrolling="no"></iframe>`
    }

  }))

  landing.addEventListener('click', e => {
    if (e.target.innerText === "Log-in") {
      let logInInput = document.querySelector('#log-in').value;

      postUser(logInInput)
      .then(user => {
        userId = user.id;
        landing.remove();
        renderAllRecords();
      })
    }
  })
};

function renderFilteredRecords(filtered){
  recordsContainer.innerHTML = '';
  filtered.forEach(record => {
    renderRecord(record)
  })
};

//-----------EVENT LISTENERS------------------------//

renderLogin();

recordsContainer.addEventListener('click', (e) => {
  if(e.target.innerText === "Add to Collection") {
    let recordId = parseInt(e.target.dataset.recordId);
    let sucessModal = document.getElementById('succesModal')
    postToCollection(userId, recordId)

    setTimeout(function(){
      succesModal.click()
    }, 1500)

  } else if(e.target.innerText === "Remove from Collection"){
    let collectionId = e.target.dataset.collectionId

    removeFromCollection(collectionId)
    .then(() => {
      let recordDiv = e.target.parentNode;
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
  }
});

formDiv.addEventListener('click', (e) => {
  e.preventDefault();
  const title = document.querySelector(".record-title").value;
  const artist = document.querySelector(".record-artist").value;
  const genre = document.querySelector(".record-genre").value;
  const image = document.querySelector(".record-img").value;

  if (e.target.innerText === "Create Record") {
    postRecord(title, artist, genre, image).then(record => renderRecord(record))
    document.querySelector(".record-title").value = "";
    document.querySelector(".record-artist").value = "";
    document.querySelector(".record-genre").value = "";
    document.querySelector(".record-img").value = "";
  }
});

searchBar.addEventListener('input', (e) => {
  let searchInput = searchBar.value.toLowerCase()
    fetchRecords(recordsUrl)
    .then(records => {
      filtered = records.filter(record => {
        return (record.title.toLowerCase().includes(searchInput) || record.artist.toLowerCase().includes(searchBar.value.toLowerCase(searchInput)) || record.genre.toLowerCase().includes(searchBar.value.toLowerCase(searchInput)))
      })

      renderFilteredRecords(filtered)
    })
});
