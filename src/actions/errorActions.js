import { GET_ERRORS, CLEAR_ERRORS } from './types'

export const returnErrors = (message, status, success, id = null) => {
 return {
  type: GET_ERRORS,
  payload: {
   message,
   status,
   success,
   id
  }
 }
}

export const clearErrors = () => {
 return {
  type: CLEAR_ERRORS
 }
}