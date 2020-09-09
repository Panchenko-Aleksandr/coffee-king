import React, { Component } from 'react'
import { connect } from 'react-redux';

import InputRange from 'react-input-range';

import './FilterPriceRange.scss';
import Loader from "../../Loader/Loader";
import { changePriceForSearch } from "../../../store/actions/goodAction";

class FilterPriceRange extends Component {
  state = {
    rangeValue : {
      min : this.props.min,
      max : this.props.max
    }
  };


  componentDidUpdate ( prevProps, prevState, snapshot ) {
    if ( ( this.props.min !== prevProps.min ) || ( this.props.max !== prevProps.max ) ) {
      this.setState ( {
        rangeValue : {
          min : this.props.min,
          max : this.props.max
        }
      } );
    }

  }

  onChangeRangeHandler = ( e ) => {
    const { name, min, max, value } = e.target;

    let rangeValue = {};
    if ( name === 'max' ) {
      rangeValue = ( +max >= +value )
          ? { ...this.state.rangeValue, max : +value }
          : { ...this.state.rangeValue, max : +max };
    } else {
      rangeValue = ( min <= value )
          ? { ...this.state.rangeValue, min : +value }
          : { ...this.state.rangeValue, min : +min };

    }

    this.props.changePriceForSearch ( rangeValue );
    this.setState ( { rangeValue } );
  };

  render () {
    const { price, price : { min, max }, step, isShow, onShowHideHandler } = this.props;

    return (
        <div className="tm-goods-list-filter-item">
          {
            ( !price )
                ? <Loader class="mini"/>
                : <>
                  <div className="tm-goods-list-filter-item-header" style={ ( isShow ) ? { height : '6rem' } : { height : '1rem' } }>
                    <ul className="rn-edit-wrapper">
                      <span>от</span>
                      <input type='number' value={ this.state.rangeValue.min } min={ min } onChange={ this.onChangeRangeHandler } name='min'/>
                      <span>до</span>
                      <input type='number' value={ this.state.rangeValue.max } max={ max } onChange={ this.onChangeRangeHandler } name='max'/>
                    </ul>

                    <InputRange
                        maxValue={ max }
                        minValue={ min }
                        step={ step || 0.10 }
                        value={ this.state.rangeValue }
                        onChange={ rangeValue => {
                          const { min, max } = rangeValue;
                          this.props.changePriceForSearch ( rangeValue );
                          this.setState ( {
                            rangeValue : {
                              min : min.toFixed ( 2 ),
                              max : max.toFixed ( 2 )
                            }
                          } );
                        }
                        }/>
                  </div>
                </>
          }
        </div>
    );
  }
}

function mapStateToProps ( state ) {
  return {
    price : state.goodReducer.price
  }
}

function mapDispatchToProps ( dispatch ) {
  return {
    changePriceForSearch : ( price ) => dispatch ( changePriceForSearch ( price ) )
  }
}

export default connect ( mapStateToProps, mapDispatchToProps ) ( FilterPriceRange )