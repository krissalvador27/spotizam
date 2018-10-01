import SpotifyWebApi from "spotify-web-api-js";
import {getAccessTokenString} from "src/lib/auth";

export function getSpotifyApi() {
  const spotifyApi = new SpotifyWebApi();
  const accessToken = getAccessTokenString();
  spotifyApi.setAccessToken(accessToken);
   
  return spotifyApi;
}