import axios from 'axios';
import {
  POST_LOADED,
  POST_LOADING
} from './types'
import { tokenConfig } from './authActions'

import { returnErrors } from './errorActions'

export const loadPosts = () => (dispatch, getState) => {
  dispatch({ type: POST_LOADING });

  axios.get('https://app.leadsharvester.com/backend/website/scrapper/facebook/getPosts', tokenConfig(getState))
    .then(res => {
      dispatch({
        type: POST_LOADED,
        payload: res.data.posts
      })
    })
    .catch(err => {
      if (err.data) {
        dispatch(returnErrors(err.response.data.message, err.response.status, err.response.data.success))
      }

    })
}