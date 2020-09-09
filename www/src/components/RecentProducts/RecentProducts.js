import React, { Component } from 'react';
import { connect } from 'react-redux';

import './RecentProducts.scss';
import Slider from "../Slider/Slider";
import SliderItem from "../ItemSlider/SliderItem";
import { filterGoodsByCategory, fetchCategoryOfGood, fetchAllGoods } from "../../store/actions/goodAction";
import Loader from "../Loader/Loader";
import { NavLink } from "react-router-dom";
import { showModalInformation } from "../../store/actions/layoutAction";


class RecentProducts extends Component {
  state = {
    isFirstCategory : true
  };

  componentDidMount () {
    this.props.fetchCategoryOfGood ();
    this.props.fetchAllGoods ();
  }

  handleClickCategory = ( e ) => {
    document.querySelectorAll ( '.nav-group-coffee > li' ).forEach ( i => {
      i.classList.remove ( 'active' )
    } );

    e.target.classList.add ( 'active' );
    this.props.filterGoodsByCategory ( e.target.dataset.id );
  };

  render () {
    const { listCategory, listOfGood } = this.props;

    return (
        <div className="main-container" style={ { height : 'initial' } }>
          <section className="recent-product">
            <header>
              <h5 className="subheader">Choose your coffee</h5>
              <h2 className="header">Recent Products</h2>
              <p className="header-text">Products</p>
            </header>
            <div className="body">

              <div className="recent-slider">

                <ul className="nav-group-coffee">
                  {
                    ( listCategory )
                        ? listCategory.map ( i => ( <li key={ i._id } data-id={ i._id } onClick={ this.handleClickCategory }>{ i.name }</li> ) )
                        : <li>Sorry, but I have not category...</li>
                  }
                </ul>

                <div className="items-slider">
                  {
                    ( listOfGood )
                        ? <Slider
                            width="100%"
                            dots={ false }
                            slides={ listOfGood }
                            autoplay={ true }
                            centerMode={ true }
                            infinite={ ( listOfGood.length >= 4 ) }
                            initialSlide={ 2 }
                            slidesToScroll={ 1 }
                            slidesToShow={ 4 }
                            typeSlider="Goods"
                        />
                        : <Loader class="mini"/>
                  }

                </div>
              </div>
              <NavLink to="/shop"><span className="btn-view-all-products">View all products</span></NavLink>
            </div>

          </section>
        </div>
    )
  }
}

function mapStateToProps ( state ) {
  return {
    searchListOfCategory : state.goodReducer.search.searchListOfCategory,
    listOfGood : state.goodReducer.listOfGood,
    listCategory : state.goodReducer.listCategory
  }
}

function mapDispatchToProps ( dispatch ) {
  return {
    filterGoodsByCategory : ( _id ) => dispatch ( filterGoodsByCategory ( _id ) ),
    fetchCategoryOfGood : () => dispatch ( fetchCategoryOfGood () ),
    fetchAllGoods : () => dispatch ( fetchAllGoods () ),
    showModalInformation : ( msg ) => dispatch ( showModalInformation ( msg ) )
  }
}

export default connect ( mapStateToProps, mapDispatchToProps ) ( RecentProducts );
