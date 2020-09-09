import React, { Component } from 'react';
import { connect } from 'react-redux';

import './Filter.scss';
import FilterPriceRange from "./PriceRange/FilterPriceRange";
import Cart from "../Cart/Cart";
import {
  addCategoryForFilter, addPriceForFilter, addTagsForFilter,
  changePaginationCurrentPages,
  fetchCategoryOfGood,
  filterByPrice,
  filterByTag,
  filterGoods,
  filterGoodsByCategory, initAllFilter, initAveragePrice
} from "../../store/actions/goodAction";
import Loader from "../Loader/Loader";
import { pageToUp } from "../../utils";
import { withRouter } from "react-router-dom";

class Filter extends Component {
  state = {
    isFirst : true,
    categoryId : undefined
  };

  componentDidMount () {
    this.props.fetchCategoryOfGood ();
    this.props.filterGoods ();
    if ( this.props.match?.params.categoryId ) {
      this.setState ( { categoryId : this.props.match.params.categoryId } )
    }
  }

  handleClickCategory = ( e ) => {

    this.setState ( { isFirst : false } );
    this.props.initAllFilter ();
    this.props.initAveragePrice ();
    this.props.addCategoryForFilter ( e.target.dataset.id );
    this.props.changePaginationCurrentPages ( 1 );
    this.props.filterGoods ();

    this.props.history.push ( `/shop/category/${ e.target.dataset.id }` );

    pageToUp ();
  };

  filterByTag = ( e ) => {
    const tag = e.target.dataset.tag;
    this.props.addTagsForFilter ( tag );
    this.props.filterGoods ();
  };

  filterByPrice = () => {
    this.props.filterGoods ();
  };

  render () {
    const cart = [];

    const { isFirst, categoryId } = this.state;

    const { listCategory, price, tags, isAuth } = this.props;

    return (
        <div className="filter-wrapper">
          {
            ( !isAuth )
                ? <></>
                : <Cart data={ cart } type={ "mini" }/>
          }

          <div className="filter-category">
            <h3>Categories</h3>
            <div className="category-list">
              {

                ( !listCategory )
                    ? <Loader class={ 'mini' }/>
                    :
                    <>
                      <div className="category_radio">
                        {
                          ( isFirst )
                              ? <input id={ `category-${ 0 }` } type="radio" name="category" data-id={ 0 } checked onClick={ this.handleClickCategory }/>
                              : <input id={ `category-${ 0 }` } type="radio" name="category" data-id={ 0 } onClick={ this.handleClickCategory }/>
                        }

                        <label htmlFor={ `category-${ 0 }` }> All Goods </label>
                      </div>
                      {
                        listCategory.map ( ( i, idx ) => (
                            <div className="category_radio">
                              {
                               // console.log ( i._id.toString (), '===', categoryId?.toString (), i._id.toString () === categoryId?.toString () )
                              }
                              {
                                ( i._id.toString () === categoryId?.toString () )
                                    ? <input id={ `category-${ i._id }` } type="radio" name="category" data-id={ i._id } onClick={ this.handleClickCategory }/>
                                    : <input id={ `category-${ i._id }` } type="radio" name="category" data-id={ i._id } onClick={ this.handleClickCategory }/>
                              }

                              <label htmlFor={ `category-${ i._id }` }>{ i.name }</label>
                            </div>
                        ) )
                      }
                    </>
              }
            </div>
          </div>
          <div className="filter-by-price">
            <h3>Filter by price</h3>
            {
              ( !price )
                  ? <Loader class="mini"/>
                  : <FilterPriceRange min={ price.min } max={ price.max }/>
            }

          </div>
          <div className="filter-submit">
            <button className="btn btn-filter-submit" onClick={ this.filterByPrice }>Filter</button>
          </div>
          <div className="filter-tags">
            <h3>Tags</h3>
            <ul className="tags-list">

              { ( !tags )
                  ? <Loader class="mini"/>
                  : tags.map ( ( i, idx ) => (
                      <li><span className="tag-link" data-tag={ i } onClick={ this.filterByTag }>#{ i }</span></li>
                  ) )
              }
            </ul>
          </div>

        </div>
    )
  }
}

function mapStateToProps ( state ) {
  return {
    listCategory : state.goodReducer.listCategory,
    price : state.goodReducer.price,
    tags : state.goodReducer.search.tags,
    isAuth : state.authReducer.isAuth
  }
}

function mapDispatchToProps ( dispatch ) {
  return {
    filterGoods : () => dispatch ( filterGoods () ),
    fetchCategoryOfGood : () => dispatch ( fetchCategoryOfGood () ),
    initAveragePrice : () => dispatch ( initAveragePrice () ),
    addCategoryForFilter : ( _id ) => dispatch ( addCategoryForFilter ( _id ) ),
    addTagsForFilter : ( tag ) => dispatch ( addTagsForFilter ( tag ) ),
    changePaginationCurrentPages : ( page ) => dispatch ( changePaginationCurrentPages ( page ) ),
    initAllFilter : () => dispatch ( initAllFilter () )

    // fetchCategoryOfGood : () => dispatch ( fetchCategoryOfGood () ),

    // filterByTag : ( tag ) => dispatch ( filterByTag ( tag ) ),
    // filterByPrice : () => dispatch ( filterByPrice () ),


  }
}

export default withRouter ( connect ( mapStateToProps, mapDispatchToProps ) ( Filter ) );