import axios from 'axios';
import {
  COMMENT_LOADED,
  COMMENT_LOADING,
  COLLECT_EMAILS,
  SENDING_EMAIL,
  EMAIL_SENT
} from './types'
import { tokenConfig } from './authActions'

import { returnErrors } from './errorActions'

export const loadComments = (postUrl) => (dispatch, getState) => {
  dispatch({ type: COMMENT_LOADING });

  const body = JSON.stringify({ postUrl })

  axios.post(
    `http://localhost:8888/website/scrapper/facebook/getComments`,
    body,
    tokenConfig(getState)
  )
    .then(res => {
      dispatch({
        type: COMMENT_LOADED,
        payload: res.data.comments
      })
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data.message, err.response.status, err.response.data.success))
    })
}

export const collectEmails = (email) => (dispatch, getState) => {
  if (email) {
    dispatch({
      type: COLLECT_EMAILS,
      email
    })
  }
}


export const bulkEmailSend = (template) => (dispatch, getState) => {
  const emails = getState().comment.emailCollection;

  const body = JSON.stringify({
    emails,
    template
  });
  dispatch({ type: SENDING_EMAIL });
  axios.post(
    `http://localhost:8888/website/scrapper/facebook/sendBulkEmails`,
    body,
    tokenConfig(getState)
  )
    .then(res => {
      dispatch({
        type: EMAIL_SENT
      })
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data.message, err.response.status, err.response.data.success))
    })

}


// export const loadCSV = (postId) => (dispatch, getState) => {
//   dispatch({ type: CSV_LOADING });

//   const body = JSON.stringify({ postId })

//   axios.post(
//     'http://localhost:8888/website/scrapper/facebook/getComments',
//     body,
//     tokenConfig(getState)
//   )
//     .then(res => {
//       dispatch({
//         type: CSV_LOADED,
//         payload: res.data.comments
//       })

//     })
//     .catch(err => {
//       if (err.response.data) {
//         dispatch(returnErrors(err.response.data.message, err.response.status, err.response.data.success))
//       }
//     })
// }