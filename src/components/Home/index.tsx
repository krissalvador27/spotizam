import * as React from "react";
import { Redirect } from "react-router-dom";
import "./Home.css";
import logo from "src/assets/spotify-logo-white.png";
import Songlist from "src/components/Songlist";
import { searchGoogle } from "src/lib/search";
import { makeSong } from "src/models/song";
import { getRecorder, requestSpeechToText } from "src/lib/audio";
import { setAccessToken, isAuthenticated } from "src/lib/auth";
import Recorder from "recorderjs";
import xButton from "src/assets/x-button.svg";
import mic from "src/assets/microphone.svg";
interface state {
  recording: boolean;
  lyrics: string;
  songs: Array<any>;
  pages: number;
  totalPages: number;
  error: string;
}

class Home extends React.Component<{}, state> {
  recorder: Recorder;

  state = {
    recording: false,
    songs: [],
    lyrics: "",
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

  startRecording = () => {
    const recorder = this.recorder;

    if (this.state.recording) {
      return;
    }

    if (!recorder) {
      this.setState({
        error: "Recording doesn't seem to work on your device 😭"
      });
    } else {
      recorder.record();
      this.setState({ recording: true });

      setTimeout(this.getLyricMatch, 5000);
    }
  };

  getLyricMatch = () => {
    const recorder = this.recorder;
    recorder.stop();

    recorder.exportWAV((audioBlob: Blob) => {
      // Uncomment to play
      // const audioUrl = URL.createObjectURL(audioBlob);
      // const audio = new Audio(audioUrl);
      // audio.play();

      requestSpeechToText(audioBlob).then(res => {
        this.setState({ recording: false });
        const lyrics = res.DisplayText ? res.DisplayText.replace(".", "") : "";

        if (lyrics === "") {
          this.setState({
            songs: [],
            lyrics: "",
            error: "Oops! I couldn't quite get that. Can you sing it again? 😅"
          });
        } else if (lyrics.split(" ").length < 3) {
          this.setState({
            songs: [],
            error:
              "Hmm.. Can you give me a little more lyrics? 3 word minimum pls 😇"
          });
        } else {
          this.setState({ lyrics: lyrics });
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
  };

  updateInputValue = evt => {
    this.setState({
      lyrics: evt.target.value
    });
  };

  onSubmit = e => {
    const { lyrics } = this.state;

    if (lyrics.split(" ").length < 3) {
      this.setState({
        songs: [],
        error:
          "Hmm.. Can you give me a little more lyrics? 3 word minimum pls 😇"
      });
    } else {
      searchGoogle(lyrics).then(res => {
        const songs = res.items.map(song => {
          return makeSong(song);
        });

        this.setState({ songs, error: "" });
      });
    }

    e.preventDefault();
  };

  render() {
    const authenticated = isAuthenticated();
    const { songs, error } = this.state;

    return (
      <>
        {authenticated ? (
          <div className="home">
            <div
              className={`logo-container ${
                this.state.recording ? "recording" : ""
              }`}
            >
              <img
                onClick={this.startRecording}
                src={logo}
                className={`logo ${this.state.recording ? "recording" : ""}`}
                alt="logo"
              />
            </div>
            <form onSubmit={this.onSubmit}>
              <input
                placeholder="Type or sing to search by lyrics"
                className="home__input"
                type="text"
                value={this.state.lyrics}
                onChange={evt => this.updateInputValue(evt)}
                autoFocus={true}
              />
              {this.state.lyrics ? (
                <img
                  onClick={() => {
                    this.setState({ lyrics: "" });
                  }}
                  className="x-button"
                  src={xButton}
                />
              ) : (
                <img
                  className="mic-button"
                  src={mic}
                  onClick={this.startRecording}
                />
              )}
            </form>
            {songs.length ? (
              <Songlist songs={songs} />
            ) : (
              <h3 className="error">{error}</h3>
            )}
          </div>
        ) : (
          <Redirect to={{ pathname: "/login" }} />
        )}
      </>
    );
  }
}

export default Home;
