import jwtDecode from 'jwt-decode';
import * as auth from '../actions/auth.jsx';

const initialState = {
  isFetching: false,
  access: undefined,
  refresh: undefined,
};

export default (state = initialState, action) => {
  console.log("redux > reducers > auth");
  console.log("state => ", state);
  console.log("action => ", action);

  switch (action.type) {
    case auth.LOGIN_SUCCESS:
    case auth.REFRESH_TOKEN_SUCCESS:
      return {
        ...state,
        access: {
          token: action.payload.auth_token,
        },
        refresh: {
          token: action.payload.refresh,
        },
        isFetching: false,
      };

    case auth.LOGIN_REQUEST:
    case auth.REFRESH_TOKEN_REQUEST:
    case auth.GET_USER_INFO_REQUEST:
    case auth.GET_BASIC_DATA_REQUEST:
      return {
        ...state,
        isFetching: true,
      };

    case auth.LOGIN_FAILURE:
    case auth.LOGOUT:
    case auth.REFRESH_TOKEN_FAILURE:
    case auth.GET_USER_INFO_FAILURE:
    case auth.GET_CLAIM_TYPE_LIST_FAILURE:
    case auth.GET_SUBMISSION_TYPE_LIST_FAILURE:
    case auth.GET_SERVICE_ADVISOR_LIST_FAILURE:
    case auth.GET_TECHNICIAN_LIST_FAILURE:    
      return initialState;

    case auth.GET_USER_INFO_SUCCESS:
      return {
        ...state,
        isFetching: false,
        user: action.payload
      };

    case auth.GET_CLAIM_TYPE_LIST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        claim_types: action.payload
      };

    case auth.GET_SUBMISSION_TYPE_LIST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        submission_types: action.payload
      };

    case auth.GET_SERVICE_ADVISOR_LIST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        service_advisors: action.payload
      };

    case auth.GET_TECHNICIAN_LIST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        technicians: action.payload
      };
    
    default:
      return state
  }
}