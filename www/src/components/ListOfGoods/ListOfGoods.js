import React, { Component } from 'react'
import { connect } from 'react-redux';
import './ListOfGoods.scss';
import Sort from "../Sort/Sort";
import SliderItem from "../ItemSlider/SliderItem";
import Paginate from 'react-paginate';
import { changePaginationCurrentPages, fetchAllGoods } from "../../store/actions/goodAction";
import { pageToUp, pageToUpToTop } from "../../utils";

class ListOfGoods extends Component {

  componentDidMount () {
    pageToUpToTop ()
  }

  handlePageClick = ( page ) => {
    this.props.changePaginationCurrentPages ( page.selected + 1 );
    pageToUp ();
  };


  fetchPaginatePage = ( goods, currentPage, limitGoodsOfPage ) => {
    const startSlice = currentPage * limitGoodsOfPage - limitGoodsOfPage;
    const newGoods = goods.slice ( startSlice, startSlice + limitGoodsOfPage );
    return newGoods.map ( ( i ) => ( <SliderItem slide={ i }/> ) )
  };


  render () {
    const { limitGoodsOfPage, listOfGood, currentPage } = this.props;

    return (
        <div className="list-of-goods-wrapper">
          <Sort qtyResultOfFetchGoods={ listOfGood?.length - 1 }/>
          <div className="list-of-goods">
            {
              ( !listOfGood || listOfGood?.length === 0 )
                  ? <span className="no-good">No goods, change your choice</span>
                  : this.fetchPaginatePage ( listOfGood, currentPage, limitGoodsOfPage )
            }
          </div>
          <div className="paginate-wrapper">
            <Paginate
                previousLabel={ '<' }
                nextLabel={ '>' }
                breakLabel={ '...' }
                breakClassName={ 'break-me' }
                pageCount={ listOfGood?.length / limitGoodsOfPage }
                marginPagesDisplayed={ 2 }
                pageRangeDisplayed={ 5 }
                onPageChange={ this.handlePageClick }
                containerClassName={ 'pagination' }
                subContainerClassName={ 'pages pagination' }
                activeClassName={ 'active' }
                forcePage={ currentPage - 1 }//Переход на страницу #
            />
          </div>
        </div>
    )
  }
}

function mapStateToProps ( state ) {
  return {
    listOfGood : state.goodReducer.listOfGood,
    currentPage : state.goodReducer.search.currentPage
  }
}

function mapDispatchToProps ( dispatch ) {
  return {
    changePaginationCurrentPages : ( page ) => dispatch ( changePaginationCurrentPages ( page ) )
  }
}

export default connect ( mapStateToProps, mapDispatchToProps ) ( ListOfGoods );