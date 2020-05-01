import axios from 'axios';
import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  DESTROY_SESSION
} from './types'
import { returnErrors, clearErrors } from './errorActions'
import { history } from '../routers/AppRouter';
import {
  pushPath
} from 'redux-simple-router';

// Load user
export const loadUser = () => (dispatch, getState) => {
  dispatch({ type: USER_LOADING });

  axios.get(`https://app.leadsharvester.com/backend/website/scrapper/auth/user/me`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: USER_LOADED,
        payload: res.data
      })
      console.log('log in')
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data.message, err.response.status, err.response.data.success))
      dispatch({
        type: AUTH_ERROR
      })
    })
}


// Login user

export const login = ({ email, password }) => dispatch => {
  const config = {
    headers: {
      "Content-type": "application/json"
    }
  }
  dispatch({ type: USER_LOADING });

  const body = JSON.stringify({ email, password })

  axios.post(`https://app.leadsharvester.com/backend/website/scrapper/auth/login`, body, config)
    .then(res => {
      // let token = res.headers['x-auth'];
      // console.log('Token', res)
      // let payload = {
      //   ...res.data,
      //   token
      // }

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      })
      dispatch({
        type: USER_LOADED,
        payload: res.data
      })
    })
    .catch(err => {
      console.log('errrr', err)
      dispatch(
        returnErrors(err.response.data.message, err.response.status, err.response.data.success, 'LOGIN_ERROR')
      )
      dispatch({
        type: LOGIN_FAIL
      })
    })

}

export const logout = () => (dispatch, getState) => {

  axios.delete(`https://app.leadsharvester.com/backend/website/scrapper/auth/logout`, tokenConfig(getState))
    .then(res => {
      // history.push('/')
      dispatch({ type: DESTROY_SESSION });
      dispatch({ type: LOGOUT_SUCCESS });
    }).catch(err => {
      if (err.response) {
        dispatch(returnErrors(err.response.data.message, err.response.status, err.response.data.success))
        dispatch({
          type: AUTH_ERROR
        })
      }

    })
  // return dispatch => {
  //   // Your code here...
  //   history.push('/')
  // }; 
}

export const tokenConfig = getState => {
  const token = getState().auth.token;

  const config = {
    headers: {
      "Content-type": "application/json"
    }
  }

  if (token) {
    config.headers['x-auth'] = token;
  }

  return config
}