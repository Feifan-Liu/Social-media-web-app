import authenticationReducer from './authenticationReducer'
import momentReducer from './momentReducer'
import friendReducer from './friendReducer'
import commentReducer from './commentReducer'
import { combineReducers } from 'redux'
import { firestoreReducer } from 'redux-firestore';
import { firebaseReducer } from 'react-redux-firebase'

const mainReducer = combineReducers({
  auth: authenticationReducer,
  moment: momentReducer,
  comment: commentReducer,
  friend: friendReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer
});

export default mainReducer