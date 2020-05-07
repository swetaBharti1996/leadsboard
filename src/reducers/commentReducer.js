import { COMMENT_LOADED, COMMENT_LOADING, SENDING_EMAIL, EMAIL_SENT, COLLECT_EMAILS } from '../actions/types'

const initialState = {
  isLoading: false,
  comments: [],
  csvData: [],
  emailCollection: [],
  isEmailSending: false
}


export default function (state = initialState, action) {
  switch (action.type) {
    case COMMENT_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case COMMENT_LOADED:
      return {
        ...state,
        isLoading: false,
        comments: [...action.payload]
      }
    case COLLECT_EMAILS:
      return {
        ...state,
        emailCollection: [...action.email]
      }
    case SENDING_EMAIL:
      return {
        ...state,
        isEmailSending: true
      }
    case EMAIL_SENT:
      return {
        ...state,
        isEmailSending: false
      }
    default:
      return state
  }
}