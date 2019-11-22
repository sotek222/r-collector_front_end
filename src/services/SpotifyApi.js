const SpotifyWebApi = require('spotify-web-api-js');

const scopes = "streaming%20user-read-private%20user-read-email%20user-library-read%20playlist-read-private"
const accessUrl = `https://accounts.spotify.com/authorize?client_id=${process.env["ClientID"]}&redirect_uri=http://localhost:8080/&scope=${scopes}&response_type=token&show_dialog=false`;
const url = /\#(?:access_token)\=([\S\s]*?)\&/;
const accessToken = url.test(window.location.href) ? window.location.href.match(url)[1] : null;
const spotifyApi = new SpotifyWebApi();

function getSpotifyUserInfo(){
  return fetch("https://api.spotify.com/v1/me", {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${spotifyApi.getAccessToken()}`
    }
  })
  .then(resp => resp.json());
};


function getAlbum(title, artist){
  return fetch(`https://api.spotify.com/v1/search?q=album%3A${title}%20artist%3A${artist}&type=album`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${spotifyApi.getAccessToken()}`
    }
  })
  .then(resp => resp.json())
};

window.onSpotifyWebPlaybackSDKReady = () => {
  const token = spotifyApi.getAccessToken();
  const player = new Spotify.Player({
    name: 'Web Playback SDK M-Collector',
    getOAuthToken: cb => { cb(token); }
  });

  player.addListener('initialization_error', ({ message }) => { console.error(message); });
  player.addListener('authentication_error', ({ message }) => { console.error(message); });
  player.addListener('account_error', ({ message }) => { console.error(message); });
  player.addListener('playback_error', ({ message }) => { console.error(message); });

  player.addListener('player_state_changed', state => {
    console.log("Name of current album:", state.context);
  });
  player.addListener('ready', ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
  });
  player.addListener('not_ready', ({ device_id }) => {
    console.log('Device ID has gone offline', device_id);
  });
  player.connect();
};

export {
  spotifyApi,
  getSpotifyUserInfo,
  getAlbum,
  accessUrl,
  accessToken
}