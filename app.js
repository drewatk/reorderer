$(document).ready(function () {
  // Constants
  var STATE_KEY = 'spotify_auth_state';
  var SPOTIFY_SCOPES = 'user-read-private user-read-email playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative';
  var SPOTIFY_CLIENT_ID = '945d641a6b2e4d0eb717daa495f4e188'; // Your client id
  var SPOTIFY_REDIRECT_URI = 'http://localhost:8080/'; // Your redirect uri

  // Set up handlebars templates
  var userProfileSource = document.getElementById('user-profile-template').innerHTML,
    userProfileTemplate = Handlebars.compile(userProfileSource),
    userProfilePlaceholder = document.getElementById('user-profile');

  var params = getHashParams();

  var access_token = params.access_token,
    state = params.state,
    storedState = localStorage.getItem(STATE_KEY);
  
  // Check for incorrect state
  if (access_token && (state == null || state !== storedState)) {
    alert('There was an error during the authentication');
    window.location = '/'; // refresh if there was an error
  } else {
    localStorage.removeItem(STATE_KEY);
    // If there is an access token, 
    if (access_token) {
      renderUserProfile();
    } else {
      renderHome();
    }

    $('#login-button').on('click', requestAuthorization);
  }

  function renderUserProfile() {
    $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function (response) {
          userProfilePlaceholder.innerHTML = userProfileTemplate(response);

          $('#login').hide();
          $('#loggedin').show();
        }
      });
  }

  function renderHome() {
    $('#login').show();
    $('#loggedin').hide();
  }

  function renderPlaylists() {

  }

  function renderTracks() {

  }

  function requestAuthorization() {
    console.log("Requesting Authorization...");

    var state = generateRandomString(16);

    localStorage.setItem(STATE_KEY, state);
    var scope = 'user-read-private user-read-email';

    var url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(SPOTIFY_CLIENT_ID);
    url += '&scope=' + encodeURIComponent(scope);
    url += '&redirect_uri=' + encodeURIComponent(SPOTIFY_REDIRECT_URI);
    url += '&state=' + encodeURIComponent(state);

    window.location = url;
  }

  /**
   * Generates a random string containing numbers and letters
   * @param  {number} length The length of the string
   * @return {string} The generated string
   */
  function generateRandomString(length) {
      var text = '';
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
  }

  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */
  function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }
});