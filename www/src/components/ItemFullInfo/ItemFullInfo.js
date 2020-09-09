import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ItemFullInfo.scss';
import { NavLink, withRouter } from "react-router-dom";
import NewReview from "../NewReview/NewReview";
import { filterCurrency, pageToUp } from "../../utils";
import { getGoodById, initGetGoodById } from "../../store/actions/goodAction";
import Loader from "../Loader/Loader";
import { addItemToCart } from "../../store/actions/cartAction";
import { changeShowAuth } from "../../store/actions/authAction";


class ItemFullInfo extends Component {

  componentDidUpdate ( prevProps, prevState, snapshot ) {
    if ( this.props.location.pathname !== prevProps.location.pathname ) {
      this.props.getGoodById ( this.props.match.params.goodId )
    }
  }

  componentDidMount () {
    pageToUp ();

    this.props.getGoodById ( this.props.match.params.goodId )
  }

  changeTabs = ( e ) => {
    if ( e.target.id ) {
      document.querySelectorAll ( '.tabs' ).forEach ( i => {
        i.classList.remove ( 'active' )
      } );
      document.querySelector ( `#${ e.target.id }` ).classList.add ( 'active' );
      console.log ( `.${ e.target.id }` );
      document.querySelector ( `.${ e.target.id }` ).classList.add ( 'active' );
    }
  };

  changeVisibleBigImg = ( e ) => {
    const type = e.target.dataset.type;

    if ( type === 'show' ) {
      document.querySelector ( '.show-big-img' ).classList.add ( 'show' );
    }

    if ( type === 'hide' ) {
      document.querySelector ( '.show-big-img' ).classList.remove ( 'show' );
    }


  };


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
    const { goodById } = this.props;
    console.log ( 'goodById', goodById )
    return (
        <div className="wrapper-item-full-info">
          {
            ( !goodById )
                ? <Loader/>
                : <>
                  <div className="item-card">
                    <figure>
                      {
                        console.log ( 'goodById.img', goodById.img )
                      }
                      <img src={ `/img/items/${ goodById.img }.webp` } alt={ goodById.tag } data-type={ 'show' } onClick={ this.changeVisibleBigImg }/>
                    </figure>

                    <div className="show-big-img" data-type={ 'hide' } onClick={ this.changeVisibleBigImg }>
                      <figure data-type={ 'hide' } onClick={ this.changeVisibleBigImg }>
                        <img src={ `/img/items/${ goodById.img }.webp` } alt={ goodById.tag } data-type={ 'hide' } onClick={ this.changeVisibleBigImg }/>
                      </figure>
                    </div>

                    <div className="item-info">
                      <h2>{ goodById.name }</h2>
                      <div className="item-price">
                        <span className="item-oldPrice">
                          {
                            ( goodById.price < goodById.oldPrice && goodById.oldPrice !== 0 )
                                ? <>
                                  <span className="sale">SALE</span>
                                  { filterCurrency ( goodById.oldPrice ) }
                                </>
                                : <></>
                          }
                        </span>
                        <span className="price">{ filterCurrency ( goodById.price ) }</span>
                      </div>
                      <p className="item-description">
                        { goodById.itemShortDescription }
                      </p>
                      <div className="item-category">
                        <span className="category">Category:</span>
                        <span className="category-name">{ goodById.category.name }</span>
                      </div>
                      <div className="item-tag">
                        <span className="tag">Tags:</span>
                        <span className="tag-list">
                  {
                    goodById.tag.map ( ( i, idx ) => (
                        <><span key={ i }>{ i }</span>{ ( goodById.tag.length !== idx + 1 ) ? ', ' : '' }</>
                    ) )
                  }
                </span>
                      </div>
                      {
                        goodById.isActive
                            ? <span className="btn btn-add-to-cart" data-id={ goodById._id } onClick={ this.addToCart }>🛒 Add to cart</span>
                            : <span className="out-of-stock">Out of stock</span>
                      }
                    </div>
                  </div>
                  <div className="item-tabs">
                    <div className="tabs-header" onClick={ this.changeTabs }>
                      <div className="tabs active" id="tabs-description"> Description</div>
                      <div className="tabs" id="tabs-reviews" style={ { display : "none" } }> Reviews (0)</div>
                    </div>
                    <div className="tabs-body">
                      <div className="tabs tabs-description active">
                        <h2>{ goodById.descriptionTitle }</h2>
                        <pre style={ {} }>{ goodById.descriptionText }</pre>
                      </div>
                      <div className="tabs tabs-reviews">
                        <h2>Name</h2>
                        <pre>REVIEW Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab, adipisci aliquid amet consequatur distinctio eos eveniet quaerat sed vel voluptas. Consequatur consequuntur corporis cupiditate et, exercitationem fugit in labore laboriosam, odio, placeat quam quia quisquam repellat unde voluptatibus! Ab accusantium alias aperiam assumenda atque autem beatae consequuntur cupiditate dignissimos dolorem eaque eligendi error esse ex excepturi explicabo fuga fugiat, hic in incidunt itaque nobis placeat quaerat qui, quibusdam ratione reprehenderit saepe sit, suscipit tempora temporibus totam ullam voluptatum? Accusantium exercitationem facilis impedit ipsum modi molestiae mollitia natus nulla odio placeat provident, quod quos rerum sapiente, similique, suscipit tempore velit voluptates.
                </pre>


                        <NewReview/>


                      </div>
                    </div>
                  </div>
                </>
          }


        </div>
    )
  }
}

function mapStateToProps ( state ) {
  return {
    goodById : state.goodReducer.goodById,
    isAuth : state.authReducer.isAuth
  }
}

function mapDispatchToProps ( dispatch ) {
  return {
    getGoodById : ( id ) => dispatch ( getGoodById ( id ) ),
    addItemToCart : ( item, options ) => dispatch ( addItemToCart ( item, options ) ),
    changeShowAuth : () => dispatch ( changeShowAuth () )
  }
}

export default withRouter ( connect ( mapStateToProps, mapDispatchToProps ) ( ItemFullInfo ) );