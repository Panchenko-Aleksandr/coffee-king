import { FETCH_USER_CART, ADD_ITEM_TO_CART, DEL_ITEM_FROM_CART, CREATE_ORDER, FETCH_LAST_NOT_COMPLETE_CART, FETCH_CART_BY_ID, INIT_CART_FOR_THE_NEXT_SHOP } from '../actions/actionTypes';

const initialState = {
  // Корзина не оформленная
  cart : undefined,
  // Все корзины
  allCart : undefined,
//Поиск корзины по ID
  cartById : undefined
};

export default function cartReducer ( state = initialState, action ) {
  switch ( action.type ) {
    case INIT_CART_FOR_THE_NEXT_SHOP : {
      return {
        ...state,
        cart : undefined
      }
    }

    case FETCH_CART_BY_ID : {
      return {
        ...state,
        cartById : action.payload
      }
    }
    case FETCH_LAST_NOT_COMPLETE_CART : {
      return {
        ...state,
        cart : action.payload
      }
    }
    case FETCH_USER_CART: {
      return {
        ...state,
        allCart : action.payload
      }
    }
    case ADD_ITEM_TO_CART : {
      return {
        ...state,
        itemInCart : action.payload
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}
