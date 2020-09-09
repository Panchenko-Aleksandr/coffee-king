import React from 'react';

import './ShopItem.scss';
import Filter from "../../components/Filter/Filter";
import ItemFullInfo from "../../components/ItemFullInfo/ItemFullInfo";

export default props => (
    <>
      <div className="shop-item-wrapper">
        <div className="filter">
          <Filter/>
        </div>
        <div className="item-of-goods-wrapper">
          <ItemFullInfo/>
        </div>
      </div>
    </>
)

