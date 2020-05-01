import axios from 'axios';
import {
  COMMENT_LOADED,
  COMMENT_LOADING,
} from './types'
import { tokenConfig } from './authActions'

import { returnErrors } from './errorActions'

export const loadComments = (postUrl) => (dispatch, getState) => {
  dispatch({ type: COMMENT_LOADING });

  const body = JSON.stringify({ postUrl })

  axios.post(
    `https://app.leadsharvester.com/backend/website/scrapper/facebook/getComments`,
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


// export const loadCSV = (postId) => (dispatch, getState) => {
//   dispatch({ type: CSV_LOADING });

//   const body = JSON.stringify({ postId })

//   axios.post(
//     'https://app.leadsharvester.com/backend/website/scrapper/facebook/getComments',
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