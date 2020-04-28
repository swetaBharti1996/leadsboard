import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import postReducer from './postReducer';
import commentReducer from './commentReducer';
import { DESTROY_SESSION } from '../actions/types'

const appReducer = combineReducers({
 auth: authReducer,
 error: errorReducer,
 post: postReducer,
 comment: commentReducer
})

export const rootReducer = (state, action) => {
 // Clear all data in redux store to initial.
 if (action.type === DESTROY_SESSION) {
  localStorage.removeItem('fbstoken')
  state = undefined
 }

 return appReducer(state, action);
};