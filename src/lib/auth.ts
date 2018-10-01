import _ from "lodash";

const AUTH_TOKEN_KEY: string = String(process.env.REACT_APP_AUTH_TOKEN_KEY);
const CLIENT_ID: string = String(process.env.REACT_APP_SPOTIFY_CLIENT_ID);

export function isAuthenticated() {
  const authToken = window.localStorage.getItem(AUTH_TOKEN_KEY);
  
  if (authToken) {
    const authObj = JSON.parse(authToken);
    if (authObj.expires_at < Date.now()) {
      // remove expired token
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
      return false;
    }
    return true;
  }
  
  return false;
}

export function startLoginFlow() {
  const loc = window.location;
  const redirectUri =
    loc.protocol +
    "//" +
    loc.hostname +
    (loc.port ? ":" + loc.port : "") +
    "/";

  if (!isAuthenticated()) {
    const scopes = "playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private";
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=token`;
  } else {
    window.location.href = `${redirectUri}`;
  }
}

export function setAccessToken() {
  const location: Location = window.location;
  const oauthData = _.fromPairs(location.hash.split('&').map(pair => pair.split('=')));
  
  if (!oauthData || !oauthData['#access_token']) {
    return;
  }

  oauthData.expires_at = (+new Date) + (oauthData.expires_in * 1000);
  window.localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(oauthData));
}

export function getAccessTokenString() {
  const authObj = String(window.localStorage.getItem(AUTH_TOKEN_KEY));

  return _.get(JSON.parse(authObj), "#access_token");
}
