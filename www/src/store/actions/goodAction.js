import {
  FETCH_ALL_GOODS,
  FETCH_LIST_CATEGORY,
  INIT_CREATE_NEW_CATEGORY,
  FETCH_NEW_CATEGORY_AFTER_CREATE,
  SEARCH_FOR_EDITOR_SHEET,
  SET_GOOD_FOR_EDIT,
  FETCH_FILTER_GOODS_BY_CATEGORY,
  INIT_GOOD_FOR_EDIT, SET_MIN_MAX_PRICE_OF_GOOD, SET_PRICE_FOR_SEARCH,
  FETCH_TAGS_FOR_SEARCH_GOODS, CHANGE_CURRENT_PAGINATION_PAGE, SET_TAGS_FOR_SEARCH,
  ADD_CATEGORY_FOR_FILTER,
  ADD_PRICE_FOR_FILTER,
  ADD_TAG_FOR_FILTER,
  INIT_AVERAGE_PRICE,
  INIT_ALL_FILTER,
  CHANGE_TYPE_ORDER_BY,
  GET_GOOD_BY_ID,
  INIT_GET_GOOD_BY_ID
} from './actionTypes';
import axios from 'axios';
import axiosCustom from '../../config/axios';
import { editorGoodURI } from '../../config/key';
import { catchError, showModalError, showModalInformation } from "./layoutAction";
import moment from 'moment';

function axiosQuery ( query ) {
  // console.log ( query )
  return axiosCustom ( {
    data : { query }
  } );
}


export function initCreateNewCategory () {
  return {
    type : INIT_CREATE_NEW_CATEGORY
  }
}

export function fetchNewCategoryAfterCreate ( payload ) {
  return {
    type : FETCH_NEW_CATEGORY_AFTER_CREATE,
    payload
  }
}

export function editCategory ( type, _id, newCategory ) {
  return async ( dispatch ) => {

    let query;
    dispatch ( initCreateNewCategory () );
    switch ( type ) {
      case 'add' : {
        query = `mutation {
                  addNewCategory(name: "${ newCategory }") {
                    _id
                    name
                  }
                }`;
        break;
      }
      case 'del' : {
        query = `mutation {
                  deleteCategory(_id: "${ _id }") {
                    _id
                    name
                  }
                }`;
        break;
      }
      case 'edit' : {
        query = `mutation {
                  editCategory(_id : "${ _id }", name : "${ newCategory }") {
                    _id
                    name
                  }
                }`;
        break;
      }
    }


    await axiosQuery ( query )
        .then ( res => {
          const response = ( res.data.data.addNewCategory ) ? res.data.data.addNewCategory : res.data.data.editCategory;
          dispatch ( fetchNewCategoryAfterCreate ( response ) );
          dispatch ( fetchCategoryOfGood () );
        } )
        .catch ( e => {
          dispatch ( catchError ( 'goodAction', 'editCategory', e ) )
        } )

  }
}

export function editorGood ( data, img, options ) {
  return async dispatch => {
    console.log ( options );
    const { isReloadImg, typeMutation } = options;
    let query = '';
    const tags = data.tags.split ( ',' ).map ( t => t.trim ().toLowerCase () );

    if ( typeMutation === 'add' ) {
      query = `mutation {
                      addNewGood(
                        name: "${ data.name }",
                        price :${ data.price },
                        itemShortDescription: """${ data.shortDescription }""",
                        isActive : ${ data.isActive },
                        category : "${ data.category || "5f4d8b82923d4c3d90a784f5" }",
                        tag : [${ tags.map ( t => `"${ t }"` ) }],
                        descriptionTitle :"""${ data.descriptionTitle }""",
                        descriptionText :"""${ data.fullDescription }"""
                      ) {
                        _id
                        name
                      }
                    }`;
      await axiosQuery ( query )
          .then ( res => {
            const response = ( res.data.data.addNewGood ) ? res.data.data.addNewGood : "";
            if ( response._id ) {
              dispatch ( addGoodsImg ( response._id, img, response.name ) );
            } else {
              dispatch ( showModalError ( 'Произошла ошибка при добавлении товара' ) );
            }
          } ).catch ( e => {
            dispatch ( catchError ( 'goodAction', 'addNewGood', e ) )
          } );
    } else {
      const price = ( data.oldPrice !== data.price ) ? ` oldPrice :${ data.oldPrice }, price :${ data.price },` : ``;
      query =
          `mutation {
                    editExistGood(
                    _id : "${ data._id }",
                    name: "${ data.name }",
                    ${ price }
                    itemShortDescription: """${ data.shortDescription }""",
                    isActive : ${ data.isActive },
                    category : "${ data.category || "5f4d8b82923d4c3d90a784f5" }",
                    tag : [${ tags.map ( t => `"${ t }"` ) }],
                    descriptionTitle :"""${ data.descriptionTitle }""",
                    descriptionText :"""${ data.fullDescription }"""
                    ) {
                    _id
                    name
                    }                    }`;
      await axiosQuery ( query )
          .then ( res => {
            const response = ( res.data.data.editExistGood ) ? res.data.data.editExistGood : "";
            if ( response._id ) {
              if ( isReloadImg ) {
                dispatch ( addGoodsImg ( response._id, img, response.name ) )
              } else dispatch ( showModalInformation (
                  `Товар "${ response.name }" успешно изменен!`
              ) );
            } else {
              dispatch ( showModalError ( 'Произошла ошибка при добавлении товара' ) );
            }
          } ).catch ( e => {
            dispatch ( catchError ( 'goodAction', 'editExistGood', e ) )
          } );
    }


    console.log ( 'query', query );


  }
}

export function addGoodsImg ( _id, img, name ) {
  return async dispatch => {
    console.log ( 'addGoodsImg._id', _id );
    img.append ( '_id', _id );
    await axios.post ( editorGoodURI, img )
        .then ( function ( response ) {
          //handle success
          dispatch ( updateGoodImage ( _id, response.data.nameImg, name ) )

        } )
        .catch ( function ( response ) {
          //handle error
          dispatch ( catchError ( 'goodAction', 'addGoodsImg', response ) )
        } );
  }
}

export function updateGoodImage ( _id, img, name ) {
  return async dispatch => {
    console.log ( '_id', _id, 'img', img );
    let query =
        `mutation {
    updateImgForGood(
    _id: "${ _id }",
    img : "${ img }"
    ) {
    _id
    name
    img
    }
    }`
    ;
    // const res = await axiosCustom ( {
    //   data : { query }
    // } );
    await axiosQuery ( query )
        .then ( res => {
          const response = ( res.data.data.updateImgForGood ) ? res.data.data.updateImgForGood : "";
          console.log ( 'responseAfterImg', response );
          dispatch ( showModalInformation (
              `Товар "${ name }" успешно добавлен (изменен)!`
          ) );
        } )
        .catch ( e => {
              dispatch ( catchError ( 'goodAction', 'updateGoodImage', e ) )
            }
        );
  }
}

export function searchForEditorSheet ( name ) {
  return async dispatch => {
    const query =
        `{
    searchNameGood (name : "${ name }") {
    _id
    name
    img
    price
    oldPrice
    itemShortDescription
    category {
    _id
    name
    }
    isActive
    tag
    descriptionTitle
    descriptionText
    review {
    title
    reviewText
    rating
    dateInsert
    user{
    _id
    login
    permission
    name
    email
  
    addressDelivery
    }
    }
    }
    }`
    ;
    await axiosQuery ( query )
        .then ( res => dispatch ( searchForEditorSheetSuccess ( res.data.data.searchNameGood ) ) )
        .catch ( e => dispatch ( catchError ( 'goodAction', 'searchForEditorSheet', e ) ) )
  }
}

export function searchForEditorSheetSuccess ( payload ) {
  return {
    type : SEARCH_FOR_EDITOR_SHEET,
    payload
  }

}

//Очищаем поиск если он уже осуществлялся, для повторного действия
export function initialGoodForEdit () {
  return {
    type : INIT_GOOD_FOR_EDIT
  }
}

export function setGoodForEdit ( id ) {
  return ( dispatch, getState ) => {
    try {
      const searchItem = getState ().goodReducer.search.searchListOfGoods.filter ( i => i._id === id );
      dispatch ( setGoodForEditSuccess ( ...searchItem ) );
    } catch ( e ) {
      dispatch ( catchError ( 'goodAction', 'setGoodForEdit', e ) )
    }
  }
}

export function setGoodForEditSuccess ( payload ) {
  return {
    type : SET_GOOD_FOR_EDIT,
    payload

  }
}

export function setTagsForSearch ( listOfGood ) {
  return dispatch => {
    try {
      let tags = new Set ();
      listOfGood.forEach ( i => {
        //console.log ( 'i', i )
        i.tag.forEach ( t => {
              //   console.log ( 'tag', t )
              tags.add ( t );
            }
        )
      } );

      let newTags = [];
      for ( let value of tags ) newTags = [...newTags, value];
      dispatch ( setTagsForSearchSuccess ( newTags ) );

    } catch ( e ) {
      dispatch ( catchError ( 'goodAction', 'setTagsForSearch', e ) )
    }
  }
}

export function setTagsForSearchSuccess ( payload ) {
  return {
    type : SET_TAGS_FOR_SEARCH,
    payload
  }

}

//Получение списка товаров
export function fetchAllGoods () {
  return async dispatch => {
    const query = `{
                    filterGoods(filterName: "category") {
                      _id
                      name
                      img
                      price
                      oldPrice
                      itemShortDescription
                      category {
                        _id
                        name
                      }
                      isActive
                      tag
                      descriptionTitle
                      descriptionText
                      review {
                        title
                        reviewText
                        rating
                        dateInsert
                        user {
                          _id
                          name
                        }
                      }
                    }
                  }`;

    await axiosQuery ( query )
        .then ( res => {
          dispatch ( getAllGoodsSuccess ( res.data.data.filterGoods ) );
          dispatch ( filterGoodsByCategorySuccess ( res.data.data.filterGoods ) );
          dispatch ( setMinMaxPriceOfGoods ( res.data.data.filterGoods ) );
          dispatch ( setTagsForSearch ( res.data.data.filterGoods ) )
        } )
        .catch ( e => dispatch ( catchError ( 'goodAction', 'fetchAllGoods', e ) ) )
  }
}

//Получение списка товаров по категории
export function filterGoodsByCategory ( _id ) {
  return async dispatch => {

    const query = `{
                    filterGoods(filterName: "category", categoryId: "${ _id }") {
                      _id
                      name
                      img
                      price
                      oldPrice
                      itemShortDescription
                      category {
                        _id
                        name
                      }
                      isActive
                      tag
                      descriptionTitle
                      descriptionText
                      review {
                        title
                        reviewText
                        rating
                        dateInsert
                        user {
                          _id
                          name
                        }
                      }
                    }
                  } `;

    await axiosQuery ( query )
        .then ( res => {

          dispatch ( filterGoodsByCategorySuccess ( res.data.data.filterGoods, _id ) );
          dispatch ( setMinMaxPriceOfGoods ( res.data.data.filterGoods ) );
          dispatch ( setTagsForSearch ( res.data.data.filterGoods ) )
        } )
        .catch ( e => dispatch ( catchError ( 'goodAction', 'filterGoodsByCategory', e ) ) )
  }
}

export function filterGoodsByCategorySuccess ( payload, categoryId ) {
  return {
    type : FETCH_FILTER_GOODS_BY_CATEGORY,
    categoryId,
    payload
  }
}


// export function filterByTag ( tag ) {
//   return async ( dispatch, getState ) => {
//     try {
//       const listOfGood = getState ().goodReducer.listOfGood;
//
//       const newSearchGoods = listOfGood.filter ( i => {
//         return i.tag.indexOf ( tag ) !== -1
//       } );
//
//       await dispatch ( changePaginationCurrentPages ( 1 ) );
//       await dispatch ( setMinMaxPriceOfGoods ( newSearchGoods ) );
//       await dispatch ( filterGoodsByCategorySuccess ( newSearchGoods ) );
//
//     } catch ( e ) {
//       dispatch ( catchError ( 'goodAsction', 'filterByTag', e ) )
//     }
//   }
// }
//
// export function filterByPrice () {
//   return async ( dispatch, getState ) => {
//     try {
//       const price = getState ().goodReducer.search.priceForSearch;
//       const query = `{
//                     filterGoods(filterName: "price", priceMin: ${ price.min }, priceMax : ${ price.max }) {
//                       _id
//                       name
//                       img
//                       price
//                       oldPrice
//                       itemShortDescription
//                       category {
//                         _id
//                         name
//                       }
//                       isActive
//                       tag
//                       descriptionTitle
//                       descriptionText
//                       review {
//                         title
//                         reviewText
//                         rating
//                         dateInsert
//                         user {
//                           _id
//                           name
//                         }
//                       }
//                     }
//                   } `;
//
//
//       await axiosQuery ( query )
//           .then ( res => {
//
//             dispatch ( filterGoodsByCategorySuccess ( res.data.data.filterGoods ) );
//             dispatch ( setMinMaxPriceOfGoods ( res.data.data.filterGoods ) );
//             dispatch ( setTagsForSearch ( res.data.data.filterGoods ) );
//             dispatch ( changePaginationCurrentPages ( 1 ) );
//           } )
//           .catch ( e => dispatch ( catchError ( 'goodAction', 'filterGoodsByCategory', e ) ) );
//
//       // await dispatch ( setMinMaxPriceOfGoods ( newSearchGoods ) );
//
//
//     } catch ( e ) {
//       dispatch ( catchError ( 'goodAction', 'filterByPrice', e ) )
//     }
//   }
// }

export function changePaginationCurrentPages ( payload ) {
  return {
    type : CHANGE_CURRENT_PAGINATION_PAGE,
    payload
  }
}

export function addCategoryForFilter ( payload ) {
  return {
    type : ADD_CATEGORY_FOR_FILTER,
    payload
  }
}

export function addTagsForFilter ( payload ) {
  return {
    type : ADD_TAG_FOR_FILTER,
    payload
  }
}

export function setMinMaxPriceOfGoods ( listOfGood ) {
  return dispatch => {
    try {
      const filterListOfGood = listOfGood.filter ( i => i.isActive );

      if ( filterListOfGood.length === 0 ) return;
      let price;
      if ( filterListOfGood.length > 0 ) {
        price = { min : filterListOfGood[ 0 ].price, max : filterListOfGood[ filterListOfGood.length - 1 ].price }
      } else {
        price = { min : listOfGood[ 0 ].price, max : listOfGood[ listOfGood.length - 1 ].price }
      }

      dispatch ( setMinMaxPriceOfGoodsSuccess ( price ) );
      dispatch ( changePriceForSearch ( price ) );


    } catch ( e ) {
      dispatch ( catchError ( 'goodAction', 'setMinMaxPriceOfGoods', e ) )
    }

  }
}

export function setMinMaxPriceOfGoodsSuccess ( payload ) {
  return {
    type : SET_MIN_MAX_PRICE_OF_GOOD,
    payload
  }
}

export function changePriceForSearch ( payload ) {
  return {
    type : SET_PRICE_FOR_SEARCH,
    payload
  }
}

export function fetchCategoryOfGood () {
  return async dispatch => {
    try {
      const  query = `{
                    getListOfCategory {
                      _id
                      name
                    }
                  }`;
      await axiosQuery ( query )
          .then ( res => {
            const listCategory = res.data.data.getListOfCategory;
            dispatch ( fetchCategoryOfGoodSuccess ( listCategory ) );
          } )
          .catch ( e => dispatch ( catchError ( 'goodAction', 'fetchCategoryOfGood', e ) ) )

    } catch ( e ) {
      console.log ( e );
    }
  }
}

export function fetchCategoryOfGoodSuccess ( payload ) {
  return {
    type : FETCH_LIST_CATEGORY,
    payload
  }
}

export function filterGoods () {
  return async ( dispatch, getState ) => {
    try {
      const { categoryId, priceForSearch, tag } = getState ().goodReducer.search;

      let queryStr = '';


      if ( categoryId && +categoryId !== 0 ) {
        queryStr += `categoryId : "${ categoryId }",`
      }

      if ( priceForSearch ) {
        queryStr += `priceMin : ${ priceForSearch.min }, priceMax : ${ priceForSearch.max },`;
      }

      if ( tag ) {
        queryStr += `tag : "${ tag }",`
      }

      if ( queryStr !== '' ) {
        queryStr = `(${ queryStr.slice ( 0, -1 ) })`
      }


      const query = `{
                    filterGoods${ queryStr } {
                      _id
                      name
                      img
                      price
                      oldPrice
                      itemShortDescription
                      category {
                        _id
                        name
                      }
                      dateInsert
                      isActive
                      tag
                      descriptionTitle
                      descriptionText
                      review {
                        title
                        reviewText
                        rating
                        dateInsert
                        user {
                          _id
                          name
                        }
                      }
                    }
                  } `;

      await axiosQuery ( query )
          .then ( async res => {
            await dispatch ( getAllGoodsSuccess ( res.data.data.filterGoods ) );
            await dispatch ( setMinMaxPriceOfGoods ( res.data.data.filterGoods ) );
            await dispatch ( setTagsForSearch ( res.data.data.filterGoods ) );
          } )
          .catch ( e => dispatch ( catchError ( 'goodAction', 'filterGoods', e ) ) )

    } catch ( e ) {
      dispatch ( catchError ( 'goodAction', 'filterGoods', e ) )
    }
  }
}

export function getAllGoodsSuccess ( payload ) {
  return {
    type : FETCH_ALL_GOODS,
    payload
  }
}

export function changeTypeOrderBy ( param ) {
  return {
    type : CHANGE_TYPE_ORDER_BY,
    payload : param
  }
}

export function orderBy ( param ) {
  return async ( dispatch, getState ) => {
    try {


      const listOfGood = getState ().goodReducer.listOfGood;
      switch ( param ) {
        case 'latest': {
          listOfGood.sort ( function ( a, b ) {
            if ( moment ( a.dateInsert ) > moment ( b.dateInsert ) ) {
              return -1;
            }
            if ( moment ( a.dateInsert ) < moment ( b.dateInsert ) ) {
              return 1;
            }
            // a должно быть равным b
            return 0;
          } );
          break;
        }
        case 'price low to high' : {
          listOfGood.sort ( function ( a, b ) {
            if ( a.price < b.price ) {
              return -1;
            }
            if ( a.price > b.price ) {
              return 1;
            }
            // a должно быть равным b
            return 0;
          } );
          break;
        }
        case 'price high to low' : {
          listOfGood.sort ( function ( a, b ) {
            if ( a.price > b.price ) {
              return -1;
            }
            if ( a.price < b.price ) {
              return 1;
            }
            // a должно быть равным b
            return 0;
          } );
          break;
        }
      }

      await dispatch ( getAllGoodsSuccess ( listOfGood ) );
      await dispatch ( changePaginationCurrentPages ( 0 ) );
      await dispatch ( changePaginationCurrentPages ( 1 ) );

    } catch ( e ) {
      dispatch ( catchError ( 'goodAction', 'orderBy', e ) )
    }
  }
}


export function initAveragePrice () {
  return {
    type : INIT_AVERAGE_PRICE
  }
}

export function initAllFilter () {
  return {
    type : INIT_ALL_FILTER
  }
}

export function getGoodById ( id ) {
  return async dispatch => {

    const query = `{
                      getGoodById(id: "${ id }") {
                        _id
                        name
                        img
                        price
                        oldPrice
                        itemShortDescription
                        category {
                          _id
                          name
                        }
                        isActive
                        tag
                        descriptionTitle
                        descriptionText
                        review {
                          title
                          reviewText
                          rating
                          dateInsert
                          user {
                            _id
                            login
                            name
                            email
                          }
                        }
                      }
                    }`;


    await axiosQuery ( query )
        .then ( res => {
          const response = res.data.data.getGoodById;
          dispatch ( getGoodByIdSuccess ( ...response ) );
        } )
        .catch ( e => {
          dispatch ( catchError ( 'goodAction', 'editCategory', e ) )
        } )
  }
}

export function getGoodByIdSuccess ( payload ) {
  return {
    type : GET_GOOD_BY_ID,
    payload
  }
}

export function initGetGoodById () {
  return {
    type : INIT_GET_GOOD_BY_ID
  }
}
