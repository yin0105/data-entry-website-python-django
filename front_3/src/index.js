import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, Redirect, BrowserRouter } from "react-router-dom";
import "index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "assets/sass/light-bootstrap-dashboard-pro-react.scss?v=1.2.0";
import "assets/css/demo.css";
import "assets/css/pe-icon-7-stroke.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import Login from "containers/Login/login";
import Register from "containers/Login/register";
import AuthLayout from "layouts/Auth.jsx";
import AdminLayout from "layouts/Admin.jsx";


ReactDOM.render(
    <HashRouter>
      <Switch>
        {/* <Route path="/login" render={props => <Login {...props} />} />
        <Route path="/register" render={props => <Register {...props} />} /> */}
        <Route path="/auth" render={props => <AuthLayout {...props} />} />
        <Route path="/admin" render={props => <AdminLayout {...props} />} />
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