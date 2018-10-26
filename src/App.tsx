import * as React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import "./App.css";
import "./sp-bootstrap.min.css";
import Home from "./components/Home";
import login from "./components/Home/login-redirect";
import heart from "src/assets/heart.png";
import { startLoginFlow } from "src/lib/auth";

interface AppState {
  recording: boolean;
}

class App extends React.Component<{}, AppState> {
  componentWillMount() {
    startLoginFlow();
  }

  render() {
    return (
      <>
        <div className="app">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={login} />
            <Redirect to="/" />
          </Switch>
        </div>
        <div className="footer">
          Made with
          <a href="https://github.com/krissalvador27/spotizam">
            <img src={heart} />
          </a>
          &nbsp;
          {/* This is the fun load balancing part! */}
          {process.env.REACT_APP_FOOD ? `& ${process.env.REACT_APP_FOOD}` : ""}
        </div>
      </>
    );
  }
}

export default App;
