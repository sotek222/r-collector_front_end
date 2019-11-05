class ImplicitGrant{
  constructor(endpoint = "https://accounts.spotify.com/authorize", redirect="http://localhost:3000/") {
    this.endpoint = endpoint;
    this.redirect = redirect;
    this.clientId = null;
    this.clientSecret = null;
    this.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  }

  

}