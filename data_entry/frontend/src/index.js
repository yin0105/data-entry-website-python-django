import React from "react";
import ReactDOM from "react-dom";
import { Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "assets/sass/light-bootstrap-dashboard-pro-react.scss?v=1.2.0";
import "assets/css/demo.css";
import "assets/css/pe-icon-7-stroke.css";

import AuthLayout from "layouts/Auth.jsx";
import AdminLayout from "layouts/Admin.jsx";
import DataCollectorLayout from "layouts/DataCollector.jsx";
import UserLayout from "layouts/User.jsx";

import { ConnectedRouter  } from 'connected-react-router'
import { PersistGate } from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
import {store, persistor, history} from './redux/store.jsx';
import ReduxToastr from 'react-redux-toastr'


const TITLE = 'Claim Manage App';

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConnectedRouter  history={history}>
        <React.Fragment>
          <Switch>
            <Route path="/frontend/auth" render={props => <AuthLayout {...props} />} />
            <Route path="/frontend/admin" render={props => <AdminLayout {...props} />} />
            <Route path="/frontend/data_collector" render={props => <DataCollectorLayout {...props} />} />
            <Route path="/frontend/user" render={props => <UserLayout {...props} />} />
            <Redirect from="/" to="/frontend/auth/login-page" />
          </Switch>
          <ReduxToastr timeOut={3000} transitionIn="fadeIn" transitionOut="fadeOut"/>
        </React.Fragment>
      </ConnectedRouter>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
