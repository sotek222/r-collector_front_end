document.addEventListener('DOMContentLoaded', () => {

  const recordsUrl = "http://localhost:3000/records"
  const recordsContainer = document.querySelector('.records-container')

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
    </div>
    `
  }


  function renderAllRecords(){
    fetchRecords(recordsUrl)
    .then(records => {
      records.forEach(record => {
        renderRecord(record)
        console.log(record)
      })
    })
  }
renderAllRecords()

})
