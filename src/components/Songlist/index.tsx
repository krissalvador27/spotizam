import * as React from "react";
import _ from "lodash";
import { getSpotifyApi } from "src/lib/spotify";
import { getAuthenticated } from "src/lib/auth";
import "./Songlist.css";

interface state {
  displayedSongs: Array<any>;
  isLoading: boolean;
  playing: any;
}

interface songlistProps {
  songs: Array<any>;
}

class Songlist extends React.Component<songlistProps, state> {
  spotifyApi: any;
  audio: any;
  props: songlistProps;

  constructor(props) {
    super(props);
    const songs = props.songs;

    this.state = {
      displayedSongs: [],
      isLoading: songs.length ? true : false,
      playing: null
    };

    this.spotifyApi = getSpotifyApi();
    this.getSpotifySongs();
  }

  componentDidUpdate(prevProps) {
    if (this.props.songs !== prevProps.songs) {
      this.setState({
        displayedSongs: [],
        isLoading: true
      });

      this.getSpotifySongs();
    }
  }

  getSpotifySongs = async () => {
    const spotifyApi = this.spotifyApi;
    const promises = _.uniqBy(this.props.songs, song => {
      // uniq by query
      return song.title + " " + song.artist;
    }).map(song => {
      return new Promise(resolve => {
        spotifyApi.searchTracks(
          song.title + " " + song.artist,
          { limit: 1 },
          (err, result) => {
            if (err) {
              if (err.status === 401) {
                getAuthenticated();
              }

              resolve({ err });
              return;
            }

            if (result.tracks.items[0]) {
              resolve(
                Object.assign({}, result.tracks.items[0], {
                  lyricMatch: song.lyricMatch
                })
              );
            } else {
              // Try search with just the song title
              spotifyApi.searchTracks(
                song.title,
                { limit: 1 },
                (err, result) => {
                  if (err) {
                    if (err.status === 401) {
                      getAuthenticated();
                    }

                    resolve({ err });
                    return;
                  }

                  resolve(
                    Object.assign({}, result.tracks.items[0], {
                      lyricMatch: song.lyricMatch
                    })
                  );
                }
              );
            }
          }
        );
      });
    });

    const spotifySongs = await Promise.all(promises);
    this.setState({
      displayedSongs: spotifySongs,
      isLoading: false
    });
  };

  renderList = () => {
    const { displayedSongs } = this.state;
    const uniqSongs = _.uniqBy(displayedSongs, "id").filter(
      song => !!song.name
    );

    return uniqSongs.length ? (
      uniqSongs.map((song, idx) => {
        const spotifyIframe = `
          <iframe
            src=https://open.spotify.com/embed/track/${song.id}
            width="300"
            height="380"
            frameBorder="0"
            allowTransparency={true}
            allow="encrypted-media"
          />
        `;

        return (
          <div className="spotify-player-container">
            <div
              key={idx}
              className="spotify-player"
              dangerouslySetInnerHTML={{ __html: spotifyIframe }}
            />
            <div className="spotify-player-overlay">
              <p
                className="lyric-match"
                dangerouslySetInnerHTML={{ __html: String(song.lyricMatch) }}
              />
            </div>
          </div>
        );
      })
    ) : (
      <h3 className="error">
        I couldn't find any results 😭. Don't give up, can you fine tune the
        lyrics for me?
      </h3>
    );
  };

  render() {
    return this.state.isLoading ? null : (
      <div className="songs">{this.renderList()}</div>
    );
  }
}

export default Songlist;
