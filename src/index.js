document.addEventListener('DOMContentLoaded', () => {

  const recordsUrl = "http://localhost:3000/records"
  const userUrl = "http://localhost:3000/users"
  const collectionUrl = "http://localhost:3000/collections"
  const recordsContainer = document.querySelector('.records-container')
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
    fetchRecords(recordsUrl)
    .then(records => {
      records.forEach(record => {
        renderRecord(record)
      })
    })
  }

  recordsContainer.addEventListener('click', (e) => {
    if(e.target.innerText === "Add to Collection") {
      let recordId = parseInt(e.target.dataset.recordId);
      console.log("Record id:", typeof recordId);
      console.log("User Id:", typeof userId);

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
    }
  })

renderAllRecords();


})
