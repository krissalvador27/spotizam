import * as React from "react";
import { Switch, Route, Redirect } from 'react-router-dom';
import "./App.css";
import "./sp-bootstrap.min.css";
import Home from "./components/Home";
import login from './components/Home/login-redirect';

interface AppState {
  recording: boolean
}

class App extends React.Component<{}, AppState> {

  render() {
    return (
      <div className="app">
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path='/login' component={login} />
          <Redirect to="/" />
        </Switch>
      </div>
    );
  }
}

export default App;
