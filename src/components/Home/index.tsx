import * as React from "react";
import { Redirect } from 'react-router-dom';
import "./Home.css";
import logo from "src/assets/spotify-logo.svg";
import Songlist from "src/components/Songlist";
import { searchGoogle } from "src/lib/search";
import { makeSong } from "src/models/song";
import { getRecorder, requestSpeechToText} from "src/lib/audio";
import { setAccessToken, isAuthenticated } from "src/lib/auth";
import Recorder from "recorderjs";

interface state {
  recording: boolean,
  lyrics: string,
  songs: Array<any>,
  pages: number,
  totalPages: number,
  error: string
}

class Home extends React.Component<{}, state> {
  recorder: Recorder;
  tempLyrics: string;

  state = {
    recording: false,
    lyrics: "",
    songs: [],
    pages: 1,
    totalPages: 1,
    error: ""
  };
  
  componentWillMount() {
    setAccessToken();
  }

  async componentDidMount() {
    this.recorder = await getRecorder();
  }

  onClick = () => {
    const recorder = this.recorder;
  
    if (this.state.recording) {
      return;
    }

    recorder.record();
    this.setState({ recording: true });

    setTimeout(this.getLyricMatch, 5000);
  };

  getLyricMatch = () => {
    const recorder = this.recorder;
    recorder.stop();

    recorder.exportWAV((audioBlob: Blob) => {
      // Uncomment to play
      // const audioUrl = URL.createObjectURL(audioBlob);
      // const audio = new Audio(audioUrl);
      // audio.play();
      
      requestSpeechToText(audioBlob).then((res) => {
        // TODO error handling
        const lyrics = res.DisplayText.replace(".", "");

        if (lyrics && lyrics.split(" ").length < 3) {
          this.setState({ lyrics: "", error: "I couldn't quite get that. Try again with more lyrics!" });
        } else {
          this.tempLyrics = "";
          this.setState({ lyrics });
          searchGoogle(lyrics).then(res => {
            const songs = res.items.map(song => {
              return makeSong(song);
            });

            this.setState({ songs, error: "" });
          });
        }
      });

      this.recorder.clear();
    }, "audio/wav");

    this.setState({ recording: false });
  };

  updateInputValue = (evt) => {
    this.tempLyrics = evt.target.value;
  };

  onSubmit = () => {
    this.setState({ lyrics: this.tempLyrics });

    searchGoogle(this.tempLyrics).then(res => {
      const songs = res.items.map(song => {
        return makeSong(song);
      });
      this.tempLyrics = "";
      this.setState({ songs, error: "" });
    });
  };

  render() {
    const authenticated = isAuthenticated();
    const { songs, error, lyrics } = this.state;
    
    return (
      <div>
       {
         authenticated ? 
          <>
            <div className="home">
              <img onClick={this.onClick} src={logo} className={`app__logo ${this.state.recording ? "recording" : ""}`} alt="logo" /> 
              <form onSubmit={this.onSubmit} >
                <input placeholder="Type or sing the lyrics to search" className="home__input" type="text" value={lyrics || this.tempLyrics} onChange={evt => this.updateInputValue(evt)} />
              </form>
            </div>
            {
            songs.length ? 
              <Songlist songs={songs.slice(0, 10)} />
              :
              <h3>{error}</h3>
            }
          </>
          :
          <Redirect to={{pathname: "/login"}} />
       }  
      </div>
    );
  }
}

export default Home;
