import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, Redirect, BrowserRouter } from "react-router-dom";
import "index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import Login from "containers/Login/login";
import Register from "containers/Login/register";


ReactDOM.render(
    <HashRouter>
      <Switch>
        <Route path="/login" render={props => <Login {...props} />} />
        <Route path="/register" render={props => <Register {...props} />} />
        {/* <Redirect from="/" to="/admin/dashboard" /> */}
      </Switch>
    </HashRouter>,
    document.getElementById("root")
);
// ReactDOM.render(
//     <BrowserRouter>
//         <App />
//     </BrowserRouter>,
//     document.getElementById("root")
// );

// serviceWorker.unregister();