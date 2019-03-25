document.addEventListener('DOMContentLoaded', () => {

  const recordsUrl = "http://localhost:3000/records"
  const userUrl = "http://localhost:3000/users"
  const collectionUrl = "http://localhost:3000/collections"
  const recordsContainer = document.querySelector('.records-container');
  const navBar = document.querySelector('.nav-bar');
  let userId;

  function fetchUser(){
    fetch(userUrl)
    .then(resp => resp.json())
    .then(users => {
      userId = users[0].id
    })
  };

  fetchUser();

  function fetchRecords(url) {
    return fetch(url)
    .then(res => res.json())
  }

  function renderRecord(record) {
    recordsContainer.innerHTML += `
    <div>
      <h1>${record.title}</h1>
      <h2>${record.artist}</h2>
      <h3>${record.genre}</h3>
      <img src=${record.image_url}>
      <button data-user-id=${userId} data-record-id=${record.id}>Add to Collection</button>
    </div>
    `
  }


  function renderAllRecords(){
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
        recordsContainer.innerHTML += `
        <div>
          <h1>${collection.record.title}</h1>
          <h2>${collection.record.artist}</h2>
          <h3>${collection.record.genre}</h3>
          <img src=${collection.record.image_url}>
          <button data-collection-id=${collection.id}>Remove from Collection</button>
        </div>
        `
      })
    })
  }

  recordsContainer.addEventListener('click', (e) => {
    if(e.target.innerText === "Add to Collection") {
      let recordId = parseInt(e.target.dataset.recordId);


      fetch(collectionUrl, {
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
    } else if(e.target.innerText === "Remove from Collection"){
      let collectionId = e.target.dataset.collectionId
      fetch(`${collectionUrl}/${collectionId}`, {
        method: "DELETE"
      })
    }
  })

  navBar.addEventListener('click', (e) => {
    if (e.target.innerText === 'My Collection') {
      recordsContainer.innerHTML = '';
      renderCollection();
    } else if (e.target.innerText === 'All Records') {
      renderAllRecords();
    }
  })


renderAllRecords();


})
