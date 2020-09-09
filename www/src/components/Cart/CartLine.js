import React, { Component } from 'react'
import { connect } from 'react-redux';
import { filterCurrency } from "../../utils";
import { addItemToCart, delItemFromCart, subItemFromCart } from "../../store/actions/cartAction";
import { openModalWindow } from "../../store/actions/layoutAction";

class CartLine extends Component {
  constructor ( props ) {
    super ( props );
    this.state = {
      qty : this.props.data.qty,
      total : this.totalSummary ( this.props.data.qty, this.props.data.price )
    }
  }

  totalSummary = ( qty, price ) => {
    return ( qty * price ).toFixed ( 2 )
  };

  handleChangeCountItem = ( e ) => {
    const type = e.target.dataset.type;
    const id = e.target.dataset.id;

    if ( type === "inc" ) {
      this.props.addItemToCart ( id, { needMessage : false } );
    } else {
      this.props.subItemFromCart ( id );
    }
  };

  handleDeleteItems = ( e ) => {
    const params = {
      id : e.target.dataset.id,
      options : { needMessage : true }
    };
    const options = {
      id : 'modalQuestBeforeDeleteOrder',
      type : 'Confirmation',
      title : "Подтверждение",
      text : `Вы действительно хотите удалить товар "${ e.target.dataset.name }" ?`,
      fnParam : params,
      fnAgree : this.props.delItemFromCart,
    };
    this.props.openModalWindow ( options );
  };

  render () {
    const { data } = this.props;
    const { total } = this.state;
    return (
        <>
          <tr className="miniCart">
            <td>
              <span className="item-cross" data-id={ data.good._id } data-name={ data.good.name } onClick={ this.handleDeleteItems }>❌</span>
            </td>
            <td>
              <img className="item-img-product"
                   src={ `/img/items/${ data.good.img }-preview.webp` }
                   alt={ data.good.tag.map ( ( t, idx ) => ( data.good.tag.length !== idx + 1 ) ? `${ t },` : `${ t }` ) }
              />
            </td>
            <td><span className="item-name">{ data.good.name }</span></td>
          </tr>
          <tr className="item-line">
            <td>
              <span className="item-cross" data-id={ data.good._id } data-name={ data.good.name } onClick={ this.handleDeleteItems }>❌</span>
            </td>
            <td>
              <img className="item-img-product"
                   src={ `/img/items/${ data.good.img }-preview.webp` }
                   alt={ data.good.tag.map ( ( t, idx ) => ( data.good.tag.length !== idx + 1 ) ? `${ t },` : `${ t }` ) }
              />
            </td>
            <td><span className="item-name">{ data.good.name }</span></td>
            <td><span className="item-price">{ filterCurrency ( data.price.toFixed ( 2 ) ) }</span></td>
            <td>
              <div className="item-quantity-wrapper">
                <input type="number" value={ data.qty }/>
                <div className="btn-up-down-wrapper">
                  <div data-type={ 'inc' } data-id={ data.good._id } onClick={ this.handleChangeCountItem } className="btn-up-arrow"/>
                  <div data-type={ 'dec' } data-id={ data.good._id } onClick={ this.handleChangeCountItem } className="btn-down-arrow"/>
                </div>
              </div>
            </td>
            <td className="item-total"><span>{ filterCurrency ( ( data.price * data.qty ).toFixed ( 2 ) ) }</span></td>
          </tr>
        </>
    )
  }
}

function mapStateToProps ( state ) {
  return {}
}

function mapDispatchToProps ( dispatch ) {
  return {
    addItemToCart : ( item, options ) => dispatch ( addItemToCart ( item, options ) ),
    delItemFromCart : ( item, options ) => dispatch ( delItemFromCart ( item, options ) ),
    subItemFromCart : ( item ) => dispatch ( subItemFromCart ( item ) ),
    openModalWindow : ( options ) => dispatch ( openModalWindow ( options ) )
  }
}

export default connect ( mapStateToProps, mapDispatchToProps ) ( CartLine );