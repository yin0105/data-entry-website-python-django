/*!

=========================================================
* Light Bootstrap Dashboard PRO React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Dashboard.jsx";
import Buttons from "views/Components/Buttons.jsx";
import GridSystem from "views/Components/GridSystem.jsx";
import Panels from "views/Components/Panels.jsx";
import SweetAlert from "views/Components/SweetAlertPage.jsx";
import Notifications from "views/Components/Notifications.jsx";
import Icons from "views/Components/Icons.jsx";
import Typography from "views/Components/Typography.jsx";
import RegularForms from "views/Forms/RegularForms.jsx";
import ExtendedForms from "views/Forms/ExtendedForms.jsx";
import ValidationForms from "views/Forms/ValidationForms.jsx";
import Wizard from "views/Forms/Wizard/Wizard.jsx";
import RegularTables from "views/Tables/RegularTables.jsx";
import ExtendedTables from "views/Tables/ExtendedTables.jsx";
import ReactTables from "views/Tables/ReactTables.jsx";
import GoogleMaps from "views/Maps/GoogleMaps.jsx";
import FullScreenMap from "views/Maps/FullScreenMap.jsx";
import VectorMap from "views/Maps/VectorMap.jsx";
import Charts from "views/Charts.jsx";
import Calendar from "views/Calendar.jsx";
import UserPage from "views/Pages/UserPage.jsx";
import LoginPage from "views/Pages/LoginPage.jsx";
import RegisterPage from "views/Pages/RegisterPage_2.jsx";
import LockScreenPage from "views/Pages/LockScreenPage.jsx";

var routes = [
  {
    path: "/dashboard",
    layout: "/admin",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard
  },
  {
    collapse: true,
    path: "/components",
    name: "Collections",
    state: "openComponents",
    icon: "pe-7s-plugin",
    views: [
      {
        path: "/buttons",
        layout: "/admin",
        name: "Add Collection",
        mini: "B",
        component: Buttons
      },
      {
        path: "/grid-system",
        layout: "/admin",
        name: "Collection List",
        mini: "GS",
        component: GridSystem
      },
    ]
  },
  {
    collapse: true,
    path: "/forms",
    name: "Schedules",
    state: "openForms",
    icon: "pe-7s-note2",
    views: [
      {
        path: "/regular-forms",
        layout: "/admin",
        name: "Add Schedule",
        mini: "RF",
        component: RegularForms
      },
      {
        path: "/extended-forms",
        layout: "/admin",
        name: "Schedule List",
        mini: "EF",
        component: ExtendedForms
      },
    ]
  },
  {
    path: "/charts",
    layout: "/admin",
    name: "Users",
    icon: "pe-7s-users",
    component: Charts
  },
  {
    path: "/login-page",
    layout: "/auth",
    name: "Login",
    icon: "pe-7s-users",
    component: LoginPage
  },
  {
    path: "/register-page",
    layout: "/auth",
    name: "Register",
    icon: "pe-7s-date",
    component: RegisterPage
  },
];
export default routes;
