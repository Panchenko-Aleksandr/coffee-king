import React, { Component } from 'react'
import { connect } from 'react-redux';
import './Sort.scss';
import { changeTypeOrderBy, orderBy } from "../../store/actions/goodAction";

class Sort extends Component {


  componentDidMount () {
    this.props.changeTypeOrderBy ( 'Default sorting' );
  }

  handleChangeSelectOrderBy = ( e ) => {
    this.props.changeTypeOrderBy ( e.target.value );
    this.props.orderBy ( e.target.value );

  };

  render () {
    const { qtyResultOfFetchGoods, sort } = this.props;

    const orderBy = ['latest', 'price low to high', 'price high to low'];

    return (
        <div className="wrapper-sort">
          <span>Find { qtyResultOfFetchGoods + 1 } item(s)</span>
          <select className="orderBy" value={ sort } onChange={ this.handleChangeSelectOrderBy }>
            <option value="Default sorting" disabled selected>Default sorting</option>
            {
              orderBy.map ( i => (
                  <option value={ i } key={ i }>Sort by { i }</option>
              ) )
            }
          </select>
        </div>
    )
  }
}

function mapStateToProps ( state ) {
  return {
    sort : state.goodReducer.search.sort
  }
}

function mapDispatchToProps ( dispatch ) {
  return {
    changeTypeOrderBy : ( param ) => dispatch ( changeTypeOrderBy ( param ) ),
    orderBy : ( param ) => dispatch ( orderBy ( param ) )
  }
}

export default connect ( mapStateToProps, mapDispatchToProps ) ( Sort );