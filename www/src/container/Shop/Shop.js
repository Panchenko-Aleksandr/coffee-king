import React from 'react'
import ListOfGoods from "../../components/ListOfGoods/ListOfGoods";

import './Shop.scss';
import Filter from "../../components/Filter/Filter";
//
// import { useEffect } from "react";
//
// function ScrollToTopOnMount () {
//   console.log('scroll')
//   useEffect ( () => {
//     window.scrollTo ( 0, 0 );
//   }, [] );
//
//   return null;
// }

export default props => {
  return (
      <>
        <div className="shop-wrapper">
          <div className="filter">
            <Filter/>
          </div>
          <ListOfGoods limitGoodsOfPage={ 6 }/>
        </div>
      </>
  )
}
