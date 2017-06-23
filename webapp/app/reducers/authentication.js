import { hashHistory } from 'react-router';

const LOGIN = 'authentication/LOGIN';
const LOGIN_SUCCESS = 'authentication/LOGIN_SUCCESS';
const LOGIN_FAIL = 'authentication/LOGIN_FAIL';

const GET_SESSION = 'authentication/GET_SESSION';
const GET_SESSION_SUCCESS = 'authentication/GET_SESSION_SUCCESS';
const GET_SESSION_FAIL = 'authentication/GET_SESSION_FAIL';

const LOGOUT = 'authentication/LOGOUT';
const LOGOUT_SUCCESS = 'authentication/LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'authentication/LOGOUT_FAIL';

const ERROR_MESSAGE = 'authentication/ERROR_MESSAGE';

const initialState = {
  loading: false,
  isAuthenticated: false,
  account: {},
  errorMessage: null, // Errors returned from server side
  redirectMessage: null,
  showModalLogin: false
};

// Reducer

export default function reducer(state = initialState, action) {
  let isAuthenticated = false;
  switch (action.type) {
    case LOGIN:
      return {
        ...initialState,
        loading: true
      };
    case LOGIN_SUCCESS:
      return {
        ...initialState,
        isAuthenticated: true
      };
    case LOGIN_FAIL:
      return {
        ...initialState,
        errorMessage: action.error.data
      };
    case LOGOUT_SUCCESS:
      return {
        ...initialState
      };
    case GET_SESSION:
      return {
        ...state,
        loading: true
      };
    case GET_SESSION_SUCCESS:
      isAuthenticated = action.result.data ? action.result.data.activated : false;
      return {
        ...initialState,
        isAuthenticated,
        account: action.result.data
      };
    case GET_SESSION_FAIL:
      return {
        ...initialState,
        errorMessage: action.error.data
      };
    case ERROR_MESSAGE:
      return {
        ...initialState,
        redirectMessage: action.message
      };
    default:
      return state;
  }
}

export function displayAuthError(message) {
  return { type: ERROR_MESSAGE, message };
}

export function getSession() {
  return {
    types: [GET_SESSION, GET_SESSION_SUCCESS, GET_SESSION_FAIL],
    promise: client => client.get('/api/account')
  };
}

export function clearAuthToken() {
  if (localStorage.getItem('jhi-authenticationToken')) {
    localStorage.removeItem('jhi-authenticationToken');
  }
  if (sessionStorage.getItem('jhi-authenticationToken')) {
    sessionStorage.removeItem('jhi-authenticationToken');
  }
}

export function login(username, password, rememberMe = false) {
  const data = `j_username=${encodeURIComponent(username)
      }&j_password=${encodeURIComponent(password)
      }&remember-me=${rememberMe}&submit=Login`;
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: client => client.post('/api/authentication', data, { headers }),
    afterSuccess: (dispatch, getState, response) => {
      const routingState = getState().routing.locationBeforeTransitions.state || {};
      hashHistory.push(routingState.nextPathname || '/');
      dispatch(getSession());
    }
  };
}

export function logout() {
  return {
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    promise: client => client.post('/api/logout', {}),
    afterSuccess: (dispatch, getState, response) => {
      dispatch(getSession());
      hashHistory.push('/');
    }
  };
}

export function redirectToLoginWithMessage(messageKey) {
  return (dispatch, getState) => {
    dispatch(displayAuthError(messageKey));
    let currentPath = getState().routing.locationBeforeTransitions.pathname;
    if (currentPath === '/login') {
      currentPath = getState().routing.locationBeforeTransitions.state.nextPathname || '/';
    }
    hashHistory.replace({
      pathname: '/login',
      state: { nextPathname: currentPath }
    });
  };
}
