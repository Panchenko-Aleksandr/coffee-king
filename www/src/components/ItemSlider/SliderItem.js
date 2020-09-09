import React, { Component } from 'react';
import { connect } from 'react-redux';

import { NavLink } from "react-router-dom";

import './SliderItem.scss';
import Loader from "../Loader/Loader";
import { filterCurrency, pageToUp } from "../../utils";
import { addItemToCart } from "../../store/actions/cartAction";
import { changeShowAuth } from "../../store/actions/authAction";

class SliderItem extends Component {


  addToCart = ( e ) => {
    e.preventDefault ();
    e.stopPropagation ();

    if ( this.props.isAuth ) {
      this.props.addItemToCart ( e.target.dataset.id, { needMessage : true } );
    } else {
      this.props.changeShowAuth ();
    }
  };

  render () {
    const { _id, name, img, price, oldPrice, itemShortDescription, isActive } = this.props.slide;
    return (
        <div className="good-nav-link">

          {
            ( !_id )
                ? <Loader/>
                : (
                    <NavLink to={ `/shop/${ _id }` }>
                      <article className="slider-item">

                        {
                          ( oldPrice !== 0 && oldPrice > price ) ? <span className="sale">SALE</span> : <></>
                        }
                        <figure className="item-img">
                          <img src={ `/img/items/${ img }-preview.webp` } alt="cup-coffee"/>
                        </figure>

                        <span className="item-name">
                            { name }
                        </span>
                        <p className="item-description">
                          { `${ itemShortDescription?.slice ( 0, 45 ) }...` }
                        </p>
                        <div className="item-price">
                          {
                            ( oldPrice !== 0 && oldPrice > price ) ? <span className="item-oldPrice">{ filterCurrency ( oldPrice ) }</span> : <></>
                          }
                          <span className="price">{ filterCurrency ( price ) }</span>
                        </div>

                        {
                          isActive
                              ? <span className="btn btn-add-to-cart" data-id={ _id } onClick={ this.addToCart }>🛒 Add to cart</span>
                              : <span className="out-of-stock">Out of stock</span>
                        }

                      </article>
                    </NavLink>
                )
          }


        </div>
    )
  }
}

function mapStateToProps ( state ) {
  return {
    isAuth : state.authReducer.isAuth
  }
}

function mapDispatchToProps ( dispatch ) {
  return {
    addItemToCart : ( item, options ) => dispatch ( addItemToCart ( item, options ) ),
    changeShowAuth : () => dispatch ( changeShowAuth () )
  }
}

export default connect ( mapStateToProps, mapDispatchToProps ) ( SliderItem );
