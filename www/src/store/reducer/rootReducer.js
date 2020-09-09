import { combineReducers } from 'redux';
import goodReducer from "./goodReducer";
import layoutReducer from './layoutReducer';
import authReducer from './authReducer';
import cartReducer from './cartReducer';
import userReducer from './userReducer';

export default combineReducers ( {
  goodReducer : goodReducer,
  layoutReducer : layoutReducer,
  cartReducer : cartReducer,
  authReducer : authReducer,
  userReducer : userReducer
} );

