document.addEventListener('DOMContentLoaded', () => {

  const recordsUrl = "http://localhost:3000/records";
  const userUrl = "http://localhost:3000/users";
  const collectionUrl = "http://localhost:3000/collections";

  const navBar = document.querySelector('.nav-bar');
  const formDiv = document.querySelector('.form-container');
  const recordsContainer = document.querySelector('.records-container');
  const searchBar = document.getElementById('search-bar')
  const body = document.querySelector('body');

  let userId;
  let filtered;

//----------------- FETCHES ------------------------------//

  function postUser(email){
    return fetch(userUrl, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:  JSON.stringify({
        email: email
      })
    })
    .then(resp => resp.json())
  };

  function removeFromCollection(collectionId){
    console.log("THE CURRENT COLLECTION:", collectionId);
    return fetch(`${collectionUrl}/${collectionId}`, {
      method: "DELETE"
    })
  };

  function postToCollection(userId, recordId){
    return fetch(collectionUrl, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: userId,
        record_id: recordId
      })
    })
  };

  function fetchRecords(url) {
    return fetch(url)
    .then(res => res.json())
  };

  function postRecord(title, artist, genre, image){
    return fetch(recordsUrl, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: title,
        artist: artist,
        genre: genre,
        image_url: image
      })
    }).then(resp => resp.json())
  };
// ---------------- RENDERS -------------------------//


  function renderRecord(record) {
    recordsContainer.innerHTML += `
    <div>
      <h1>${record.title}</h1>
      <h2>${record.artist}</h2>
      <h3>${record.genre}</h3>
      <img data-user-id=${userId} data-record-id=${record.id} src=${record.image_url}>
      <button data-user-id=${userId} data-record-id=${record.id}>Add to Collection</button>
    </div>
    `
  };

  function renderAllRecords(){
    navBar.style.display = "block";
    console.log("Current User:", userId);
    recordsContainer.innerHTML = '';
    renderForm()
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
          recordsContainer.innerHTML += `
          <div>
          <h1>${collection.record.title}</h1>
          <h2>${collection.record.artist}</h2>
          <h3>${collection.record.genre}</h3>
          <img src=${collection.record.image_url}>
          <button data-collection-id=${collection.id}>Remove from Collection</button>
          </div>
          `
        }
      })
    })
  };

  function renderLogin(){
    navBar.style.display = 'none';
    const landing = document.createElement('div')
    landing.setAttribute('class', 'landing');
    landing.innerHTML = `
    <h1>R-Collector</h1>
    <h3>Log-in</h3>
    <input id="log-in" placeholder="Enter Email"></input>
    <button>Log-in</button>
    `
    body.appendChild(landing)

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

  function renderForm(){
    formDiv.innerHTML = `
    <form class="new-record-form" method="post">
      <h3>Add to the library</h3>
      <input class="record-title" type="text" name="title" value="" placeholder="Title">
      <input class="record-artist" type="text" name="artist" value="" placeholder="Artist">
      <input class="record-genre" type="text" name="genre" value="" placeholder="Genre">
      <input class="record-img" type="text" name="img" value="" placeholder="Image Url">
      <button type="submit" name="button">Create Record</button>
    </form>
    `;
  }

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

      postToCollection(userId, recordId)

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

});
