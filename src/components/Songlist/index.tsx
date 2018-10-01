import * as React from "react";
import { getSpotifyApi } from "src/lib/spotify";
import "./Songlist.css";
import playing from "src/assets/playing.png";
import play from "src/assets/play.png";

const ListView = props => {
  return (
    <tr className={"track-list-view " + (props.isPlaying ? "active-row" : "")}>
      <td className={"play-pause " + (props.isPlaying ? "is-playing" : "")}>
        <div className="num">
          {props.num}
        </div>
        {props.previewUrl ? 
                  <div className="play-pause-btn">
          {props.isPlaying
            ? <img
                className="pause-btn"
                src={playing}
                onClick={props.onClick}
              />
            : <img
                className="play-btn"
                src={play}
                onClick={props.onClick}
              />}
        </div> : null
        }
      </td>
      <td className="album-art">
        <img src={props.imageUrl} />
      </td>
      <td className="track-name">
        <div title={props.trackName} className="wrap">
          {
            props.openUrl ?
            <a href={props.openUrl} target="_blank">{props.trackName}</a> 
            : props.trackName
           }
        </div>
      </td>
      <td className="artist-name">
        <div title={props.artistName} className="wrap">
          {props.artistName}
        </div>
      </td>
      <td className="album-name">
        <div title={props.albumName} className="wrap">
          {props.albumName}
        </div>
      </td>
      <td className="lyric-match">
        <div className="wrap" dangerouslySetInnerHTML={{__html: props.lyricMatch}}/>
      </td>
    </tr>
  );
};

interface state {
  displayedSongs: Array<any>,
  isLoading: boolean,
  playing: any
}

interface songlistProps {
  songs: Array<any>
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
    const promises = this.props.songs.map(song => {
      return new Promise(resolve => {
        const query = song.title + " " + song.artist;

        spotifyApi.searchTracks(query, { limit: 1 }, (err, result) => {
          if (err) {
            resolve({ err });
            return;
          }

          resolve(Object.assign({}, result.tracks.items[0], { lyricMatch: song.lyricMatch }));
        });
      });
    });

    const spotifySongs = await Promise.all(promises);
    this.setState({
      displayedSongs: spotifySongs,
      isLoading: false
    });
  };

  playTrack = (track) => {
    if (this.state.playing == track.preview_url) {
      this.audio.pause();

      this.setState({
        playing: null
      });
    } else {
      if (this.audio != null) {
        this.audio.pause();
      }

      this.audio = new Audio(track.preview_url);
      this.audio.play();
      this.setState({
        playing: track.preview_url
      });
    }
  };

  renderList = () => {
    const { displayedSongs, playing } = this.state;

    return (
      <div className="table-container">
        <table className="table table-tracks">
          <thead>
            <tr>
              <th className="play">#</th>
              <th className="album-art" />
              <th className="name">title</th>
              <th className="artist">artist</th>
              <th className="album">album</th>
              <th className="match">match</th>
            </tr>
          </thead>
          <tbody>
            {displayedSongs.filter(song => !!song.name).map((song: any, idx) => {
              return (
                <ListView
                  key={idx}
                  num={idx + 1}
                  trackName={song.name}
                  albumName={song.album.name}
                  artistName={song.artists[0].name}
                  imageUrl={song.album.images[2].url}
                  previewUrl={song.preview_url}
                  isPlaying={song.preview_url ? song.preview_url === playing : false}
                  openUrl={song.external_urls.spotify}
                  lyricMatch={song.lyricMatch}
                  onClick={() => {
                    this.playTrack(song);
                  }}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
  render() {
    return (
      this.state.isLoading ? 
        null
        :
        this.renderList()
    );
  }
}

export default Songlist;