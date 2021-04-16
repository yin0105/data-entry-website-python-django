import {store} from '../redux/store.jsx';
import ApiHelper from './apiHelper.jsx';

class AuthHelper {
  login = (username, password) => {
    return ApiHelper.post('/api/auth/token/login', {username, password}, {}, false);
  };

  register = (firstName, lastName, email, password) => {
    return ApiHelper.post('/api/auth/register', {firstName, lastName, email, password}, {}, false);
  };

  refreshToken = data => {
    return ApiHelper.post('/api/auth/token/refresh', data, {}, false);
  };

  getUserInfo = () => {
    return ApiHelper.get('/api/accounts/data/');
  };

  getAccessToken = () => {
    let state = store.getState();
    if (state.auth.access) {
      return state.auth.access.token;
    }
    return null;
  };

  getRefreshToken = () => {
    let state = store.getState();
    if (state.auth.refresh) {
      return state.auth.refresh.token;
    }
    return null;
  };

  isAccessTokenExpired = state => {
    if (state.access && state.access.exp) {
      return 1000 * state.access.exp - (new Date()).getTime() < 5000;
    }
    return true;
  };

  isRefreshTokenExpired = state => {
    if (state.refresh && state.refresh.exp) {
      return 1000 * state.refresh.exp - (new Date()).getTime() < 5000;
    }
    return true;
  };

  isAuthenticated = () => {
    let state = store.getState();
    if (state && state.auth && state.auth.user) {
      return true;
    } else {
      return false;
    }
  };

  isAdmin = () => {
    let state = store.getState();
    if (state && state.auth && state.auth.user && state.auth.user.role == "admin") {
      return true;
    } else {
      return false;
    }
  };

  updateProfile = profile => {
    return ApiHelper.put('/api/auth/user');
  }

  getSportsId = () => {
    // return ApiHelper.put('/api/auth/user');  }
    return ({
      "sports": [
          {
              "sport_id": 1,
              "sport_name": "NCAA Football"
          },
          {
              "sport_id": 2,
              "sport_name": "NFL"
          },
          {
              "sport_id": 3,
              "sport_name": "MLB"
          },
          {
              "sport_id": 4,
              "sport_name": "NBA"
          },
          {
              "sport_id": 5,
              "sport_name": "NCAA Men's Basketball"
          },
          {
              "sport_id": 6,
              "sport_name": "NHL"
          },
          {
              "sport_id": 7,
              "sport_name": "UFC/MMA"
          },
          {
              "sport_id": 8,
              "sport_name": "WNBA"
          },
          {
              "sport_id": 9,
              "sport_name": "CFL"
          },
          {
              "sport_id": 10,
              "sport_name": "MLS"
          }
    ]});
  }

  // getClaimTypeList = () => {
  //   return ApiHelper.get('/api/claim/get_claim_types');
  // };

  // getSubmissionTypeList = () => {
  //   return ApiHelper.get('/api/claim/get_submission_types');
  // };

  // getServiceAdvisorList = () => {
  //   return ApiHelper.get('/api/claim/get_service_advisors');
  // };

  // getTechnicianList = () => {
  //   return ApiHelper.get('/api/claim/get_technicians');
  // };
}

export default new AuthHelper();

