document.addEventListener('DOMContentLoaded', () => {

  const recordsUrl = 'http://localhost:3000/records'
  const recordsContainer = document.querySelector('.records-container')

  fetch(recordsUrl)
  .then(res => res.json())
  .then(json => console.log(json))



})
