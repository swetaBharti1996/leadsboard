import { POST_LOADED, POST_LOADING, POST_UNLOADED, EMAILS_LOADED, EMAILS_LOADING, EMAILS_UNLOADED } from '../actions/types'

const initialState = {
  isLoading: false,
  posts: [],
  emails: []
}


export default function (state = initialState, action) {
  switch (action.type) {
    case POST_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case POST_LOADED:
      return {
        ...state,
        isLoading: false,
        posts: [...action.payload]
      }
    case POST_UNLOADED:
      return {
        isLoading: false,
        posts: []
      }
    case EMAILS_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case EMAILS_LOADED:
      return {
        ...state,
        isLoading: false,
        emails: [...action.payload]
      }
    case EMAILS_UNLOADED:
      return {
        ...state,
        emails: []
      }
    default:
      return state
  }
}