import LoginPage from "views/Pages/LoginPage";
import LogoutPage from "views/Pages/LogoutPage";
import RegisterPage from "views/Pages/RegisterPage";
import ScheduleStatus from "views/Schedules/ScheduleStatus";
import ScheduleList from "views/Schedules/ScheduleList";
import ToDoList from "views/Schedules/ToDoList";
import AddSchedule from "views/Schedules/AddSchedule";
import UpdateSchedule from "views/Schedules/UpdateSchedule";
import CollectionList from "views/Collections/CollectionList";
import CollectionPage from "views/Collections/CollectionPage";
import CollectionStatus from "views/Collections/CollectionStatus";
import AddCollection from "views/Collections/AddCollection";
import UserList from "views/User/UserList"

var routes = [
  {
    path: "/dashboard",
    layout: "/frontend/admin",
    name: "Dashboard",
    icon: "pe-7s-graph",
    category: ["admin",],
    component: CollectionStatus
  },
  {
    path: "/collection_list",
    layout: "/frontend/admin",
    name: "Collection List",
    icon: "pe-7s-plugin",
    category: ["admin",],
    component: CollectionList
  },
  {
    path: "/schedule_list",
    layout: "/frontend/admin",
    name: "Schedule List",
    icon: "pe-7s-note2",
    category: ["admin",],
    component: ScheduleList
  },

  {
    path: "/add_collection",
    layout: "/frontend/admin",
    name: "Add Collection",
    mini: "AC",
    category: [],
    redirect: true,
    component: AddCollection
  },

  {
    path: "/add_schedule",
    layout: "/frontend/admin",
    name: "Add Schedule",
    mini: "AS",
    category: [],
    redirect: true,
    component: AddSchedule
  },
  {
    path: "/edit_schedule",
    layout: "/frontend/admin",
    name: "Edit Schedule",
    mini: "ES",
    category: [],
    redirect: true,
    component: UpdateSchedule
  },
  {
    path: "/users",
    layout: "/frontend/admin",
    name: "Users",
    icon: "pe-7s-users",
    category: ["admin",],
    component: UserList
  },    
  {
    path: "/dashboard",
    layout: "/frontend/user",
    name: "Home",
    icon: "pe-7s-graph",
    redirect: true,
    category: [],
    component: ToDoList
  },
  {
    path: "/collection_page",
    layout: "/frontend/user",
    name: "Dynamic Collection",
    icon: "pe-7s-date",
    redirect: true,
    category: [],
    component: CollectionPage
  },
  {
    path: "/login-page",
    layout: "/frontend/auth",
    name: "Login",
    icon: "pe-7s-users",
    category: [],
    component: LoginPage
  },
  {
    path: "/logout-page",
    layout: "/frontend/auth",
    name: "Log out",
    icon: "pe-7s-next-2",
    category: ["admin",],
    component: LogoutPage
  },
  {
    path: "/register-page",
    layout: "/frontend/auth",
    name: "Register",
    icon: "pe-7s-date",
    category: [],
    component: RegisterPage
  },






  // {
  //   path: "/dashboard",
  //   layout: "/frontend/admin",
  //   name: "Dashboard",
  //   icon: "pe-7s-graph",
  //   category: ["admin",],
  //   component: ScheduleStatus
  // },  
  // {
  //   path: "/dashboard",
  //   layout: "/frontend/dealership",
  //   name: "Dashboard",
  //   icon: "pe-7s-graph",
  //   category: ["dealership",],
  //   component: ScheduleStatus
  // },

  // {
  //   path: "/repair_order",
  //   layout: "/frontend/dealership",
  //   name: "Upload Repair Order",
  //   icon: "pe-7s-note2",
  //   category: ["dealership",],
  //   component: CollectionList
  // },
  // {
  //   path: "/upload_pdf",
  //   layout: "/frontend/dealership",
  //   name: "Upload Repair Order",
  //   icon: "pe-7s-note2",
  //   category: [],
  //   component: AddCollection
  // },
  // {
  //   path: "/login-page",
  //   layout: "/frontend/auth",
  //   name: "Login",
  //   icon: "pe-7s-users",
  //   category: [],
  //   component: LoginPage
  // },
  // {
  //   path: "/logout-page",
  //   layout: "/frontend/auth",
  //   name: "Log out",
  //   icon: "pe-7s-next-2",
  //   category: ["admin", "dealership",],
  //   component: LogoutPage
  // },
];
export default routes;
