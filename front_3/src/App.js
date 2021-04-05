import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Login from "./containers/Login/login";
import SignUp from "./containers/Login/register";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path='/' component={Login} />
          <Route path="/sign-in" component={Login} />
          <Route path="/sign-up" component={SignUp} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
