const recordsContainer = document.querySelector('.records-container');
const navBar = document.querySelector('.nav-bar');
const searchBar = document.getElementById('search-bar');
const iframe = document.querySelector('.web-player');

function colorRandomizer() {
  return `rgb(
    ${Math.floor(Math.random() * 255)}, 
    ${Math.floor(Math.random() * 255)}, 
    ${Math.floor(Math.random() * 255)})`;
};

function renderSpotifyUserInfo({display_name, images}){
  navBar.querySelector('.text-white').insertAdjacentHTML('beforeend', `
    <span class="spotify-span">
      <p class="spotify-user-name">Logged in as ${display_name}</p>
      <img 
      class="spotify-avatar"
      src=${images[0].url} alt="spotify profile image">
    </span>
    `);
};


export { 
  colorRandomizer, 
  recordsContainer,
  navBar,
  searchBar,
  iframe,
  renderSpotifyUserInfo,
}