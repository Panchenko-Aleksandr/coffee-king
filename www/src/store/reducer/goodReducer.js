import {
  FETCH_LIST_CATEGORY,
  INIT_CREATE_NEW_CATEGORY,
  FETCH_NEW_CATEGORY_AFTER_CREATE,
  SEARCH_FOR_EDITOR_SHEET,
  SET_GOOD_FOR_EDIT,
  FETCH_FILTER_GOODS_BY_CATEGORY,
  INIT_GOOD_FOR_EDIT,
  SET_MIN_MAX_PRICE_OF_GOOD,
  SET_PRICE_FOR_SEARCH,
  FETCH_TAGS_FOR_SEARCH_GOODS,
  CHANGE_CURRENT_PAGINATION_PAGE,
  SET_TAGS_FOR_SEARCH,
  FETCH_ALL_GOODS,
  ADD_CATEGORY_FOR_FILTER,
  ADD_PRICE_FOR_FILTER,
  ADD_TAG_FOR_FILTER,
  INIT_AVERAGE_PRICE,
  INIT_ALL_FILTER,
  CHANGE_TYPE_ORDER_BY,
  GET_GOOD_BY_ID,
  INIT_GET_GOOD_BY_ID
} from "../actions/actionTypes";

const initialState = {
  listOfGood : [],
  listCategory : undefined,
  newCategory : undefined,
  price : undefined,
  search : {

    categoryId : undefined,
    priceForSearch : undefined,
    tag : undefined,
    sort : undefined, //'Default sorting' ,'latest', 'price low to high', 'price high to low'

    searchListOfCategory : [],
    searchListOfGoods : [],
    selectedGoodForEdit : undefined,

    categoryForSearch : {},
    searchStr : {},
    currentPage : 1,
    tags : []
  },
  goodById : undefined
};

export default function goodReducer ( state = initialState, action ) {
  switch ( action.type ) {


    case INIT_GET_GOOD_BY_ID  : {
      return {
        ...state,
        goodById : undefined
      }
    }


    case GET_GOOD_BY_ID: {
      return {
        ...state,
        goodById : action.payload
      }
    }

    case CHANGE_TYPE_ORDER_BY : {
      return {
        ...state,
        search : {
          ...state.search,
          sort : action.payload
        }
      }
    }

    case INIT_ALL_FILTER : {
      return {
        ...state,
        search : {
          ...state.search,
          categoryId : undefined,
          priceForSearch : undefined,
          tag : undefined,
          sort : "Default sorting"
        }
      }
    }

    case INIT_AVERAGE_PRICE : {
      return {
        ...state,
        search : {
          ...state.search,
          priceForSearch : undefined
        }
      }

    }
    case FETCH_ALL_GOODS : {
      return {
        ...state,
        listOfGood : action.payload
      }
    }
    case SET_TAGS_FOR_SEARCH : {
      return {
        ...state,
        search : {
          ...state.search,
          tags : action.payload
        }
      }
    }
    case CHANGE_CURRENT_PAGINATION_PAGE: {
      return {
        ...state,
        search : {
          ...state.search,
          currentPage : action.payload
        }
      }
    }

    case SET_PRICE_FOR_SEARCH : {
      return {
        ...state,
        search : {
          ...state.search,
          priceForSearch : { ...action.payload }
        }
      }
    }

    case SET_MIN_MAX_PRICE_OF_GOOD : {
      return {
        ...state,
        price : {
          ...action.payload,
        }
      }
    }

      //*****************************

    case ADD_CATEGORY_FOR_FILTER : {
      return {
        ...state,
        search : {
          ...state.search,
          categoryId : action.payload
        }
      }
    }

    case ADD_TAG_FOR_FILTER : {
      return {
        ...state,
        search : {
          ...state.search,
          tag : action.payload
        }
      }
    }



      //*****************************


    case FETCH_FILTER_GOODS_BY_CATEGORY : {
      return {
        ...state,
        listOfGood : action.payload,
        search : {
          ...state.search,
          categoryId : action.categoryId
        }
      }
    }
    case INIT_GOOD_FOR_EDIT : {
      return {
        ...state,
        search : {
          ...state.search,
          selectedGoodForEdit : []
        }
      }
    }
    case SET_GOOD_FOR_EDIT : {
      return {
        ...state,
        search : {
          ...state.search,
          selectedGoodForEdit : action.payload
        }
      }
    }
    case SEARCH_FOR_EDITOR_SHEET : {
      return {
        ...state,
        search : {
          ...state.search,
          searchListOfGoods : action.payload
        }
      }
    }
    case INIT_CREATE_NEW_CATEGORY: {
      return {
        ...state,
        newCategory : undefined
      }
    }
    case FETCH_NEW_CATEGORY_AFTER_CREATE : {
      return {
        ...state,
        newCategory : action.payload
      }
    }
    case FETCH_LIST_CATEGORY : {
      return {
        ...state,
        listCategory : action.payload
      }
    }
    default : {
      return { ...state }
    }
  }

}
