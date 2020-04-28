import { COMMENT_LOADED, COMMENT_LOADING, CSV_LOADED, CSV_LOADING } from '../actions/types'

const initialState = {
  isLoading: false,
  comments: [],
  csvData: []
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
    default:
      return state
  }
}