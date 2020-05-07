import axios from 'axios';
import {
  POST_LOADED,
  POST_LOADING,
  EMAILS_LOADED,
  EMAILS_LOADING,
  EMAILS_UNLOADED
} from './types'
import { tokenConfig } from './authActions'

import { returnErrors } from './errorActions'

export const loadPosts = (queryType) => (dispatch, getState) => {
  dispatch({ type: POST_LOADING });



  axios.get(`https://app.leadsharvester.com/backend/website/scrapper/facebook/getPosts?type=${queryType}`, tokenConfig(getState))
    .then(res => {
      console.log(res);
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

export const loadEmails = (postUrl) => (dispatch, getState) => {
  dispatch({ type: EMAILS_UNLOADED });
  dispatch({ type: EMAILS_LOADING });
  const body = JSON.stringify({ postUrl })
  axios.post(`https://app.leadsharvester.com/backend/website/scrapper/facebook/getEmails`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: EMAILS_LOADED,
        payload: res.data
      })
    })
    .catch(err => {
      if (err.data) {
        dispatch(returnErrors(err.response.data.message, err.response.status, err.response.data.success))
      }

    })
}