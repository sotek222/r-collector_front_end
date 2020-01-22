const recordsContainer = document.querySelector('.records-container');
const navBar = document.querySelector('.nav-bar');
const searchBar = document.getElementById('search-bar');
const modalBtn = document.getElementById('modal-button');
const iframe = document.querySelector('.web-player');

function colorRandomizer() {
  return `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
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

const loginHTML = `
  <h1 class="login-title">R-Collector</h1>
  <h3 class="login-text">Log-in</h3>
  <form>
    <input type="text" class="login-div" id="log-in" placeholder="Enter Email"/>
    <br/>
    <br/>
    <input disabled type="text" class="login-div" id="password" placeholder="Enter Password"/>
    <br/>
    <br/>
    <input type="submit" class="login-div" data-action="login" value="Log In" /><br>
  </form>`;

export { 
  colorRandomizer, 
  recordsContainer,
  navBar,
  searchBar,
  modalBtn,
  iframe,
  renderSpotifyUserInfo,
  loginHTML
}