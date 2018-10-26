# Spotizam 🎧

Ever have a catchy hook stuck in your head, but can't remember the song? 🤔 (Always)<br>
Wish you could find out what that song is and play it on Spotify? 😁 (Would love that)

Now with Spotizam you can search spotify's music library with lyrics! 😮

LIVE DEMO: https://spotizam.glitch.me/

### Preface

Hacked up this app to experiment with a bunch of cool APIs and get my feet wet with [Typescript](https://www.typescriptlang.org/). Emphasis on _hack_ project, especially with how I used TS.

## This app brought to you by

- Spotify's awesome [web api](https://developer.spotify.com/documentation/web-api/)
- Google's custom [search api](https://developers.google.com/custom-search/json-api/v1/overview?authuser=1)
- Microsoft Azure's [speech to text api](https://azure.microsoft.com/en-us/services/cognitive-services/speech-to-text/)

## Set Up

Made with the ever so awesome [create react app](https://github.com/wmonk/create-react-app-typescript).

Yarn or npm install to grab dependencies

```
npm install
yarn install
```

You'll also need a `.env` file housing your necessary API ids and secrets with them named like so ..

```
REACT_APP_AUTH_TOKEN_KEY=<Your auth token key>
REACT_APP_SPOTIFY_CLIENT_ID=<Spotify provided client id>
REACT_APP_SPOTIFY_CLIENT_SECRET=<Spotify provided client secret>
REACT_APP_GOOGLE_API_KEY=<Google provided developer api key>
REACT_APP_GOOGLE_CX_ID=<Google provided custom search engine id>
REACT_APP_MICROSOFT_KEY=<Microsoft provided azure key>
```

Then start app with either npm or yarn

```
npm run start
yarn start
```

## Fun with docker & nginx

Wanted to experiment with docker & nginx so I set up commands to build and run two docker images with node,
and a docker image with nginx that handles simple load balancing. Try it with the command below

```
npm run do-the-docker
yarn do-the-docker
```

On success, you should have an instance running on `localhost:8081` and `localhost:8082` that serves
different footer texts (each instance exports a different value for the footer's displayed env variable).
You should also be able to go to `localhost:3000` which is running nginx with a load balancer that uses the default
round-robin evaluation to map you to either `localhost:8081` or `localhost:8082`
Hard refresh and view the changing footer text. 🥓 🍍

To clean up

```
npm run docker-clean
yarn docker-clean
```
