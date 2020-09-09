import React, { Component } from 'react';
import { connect } from 'react-redux';
import './EditorGoods.scss';

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import Review from "./Review/Review";
import EditGood from "./EditGood/EditGood";
import SearchModule from "../SearchModule/SearchModule";
import { initialGoodForEdit, searchForEditorSheet, setGoodForEdit } from "../../store/actions/goodAction";

class EditorGoods extends Component {
  state = {
    showEditorField : false,
    searchStr : '',
    isShowSearchModule : false
  };

  changeTabs = ( e ) => {
    if ( e.target.id ) {
      document.querySelectorAll ( '.tabs' ).forEach ( i => {
        i.classList.remove ( 'active' )
      } );
      document.querySelector ( `#${ e.target.id }` ).classList.add ( 'active' );
      document.querySelector ( `.${ e.target.id }` ).classList.add ( 'active' );
    }
  };


  changeStateSearch = ( e ) => {
    e.preventDefault ();
    this.props.initialGoodForEdit ();
  };

  handleChangeSearchGood = ( e ) => {
    e.preventDefault ();
    this.setState ( {
      searchStr : e.target.value,
      isShowSearchModule : true
    } );
    this.props.searchForEditorSheet ( e.target.value );
  };

  handleSearchGoodForEdit = async ( id ) => {
    await this.props.setGoodForEdit ( id );
    if ( this.props.selectedGoodForEdit ) {
      this.setState ( { isShowSearchModule : false } );
    }
  };

  render () {

    const { showEditorField, isShowSearchModule, searchStr } = this.state;
    const { searchListOfGoods, selectedGoodForEdit } = this.props;

    const title = 'Редактор товаров';
    const breadcrumbs = [
      {
        name : 'Редактор товаров',
        link : '/editor-goods'
      }
    ];
    const goodId = undefined;

    return (
        <div>
          <Breadcrumbs titlePage={ title } breadcrumbs={ breadcrumbs }/>
          <div className="editor-goods-container">

            <div className="editor-goods">
              <div className="tabs-header" onClick={ this.changeTabs }>
                <div className="tabs active" id="new-good">Новый товар</div>
                <div className="tabs " id="edit-good">Редактор существующих</div>
              </div>

              <div className="tabs-body">
                <div className="tabs new-good active">

                  <EditGood newItem/>

                </div>
                <div className="tabs edit-good ">


                  <div className="search-good">
                    <span>Введите товар для поиска</span>
                    <input name='str-search-good' className="str-search-good" onFocus={ this.handleChangeSearchGood } onChange={ this.handleChangeSearchGood }/>

                    {
                      ( isShowSearchModule )
                          ? <SearchModule
                              list={ searchListOfGoods }
                              isShow={ searchListOfGoods.length > 0 && searchStr !== '' }
                              fn={ this.handleSearchGoodForEdit }
                          />

                          : <></>
                    }


                  </div>

                  <EditGood editItem reSearchFn={ this.changeStateSearch }/>


                </div>
              </div>

            </div>

            <div className="review-goods">
              <Review goodId={ ( goodId ) ? goodId : 0 }/>
            </div>

          </div>
        </div>
    )
  }
}

function mapStateToProps ( state ) {
  return {
    searchListOfGoods : state.goodReducer.search.searchListOfGoods,
    selectedGoodForEdit : state.goodReducer.search.selectedGoodForEdit
  }
}

function mapDispatchToProps ( dispatch ) {
  return {
    searchForEditorSheet : ( str ) => dispatch ( searchForEditorSheet ( str ) ),
    setGoodForEdit : ( id ) => dispatch ( setGoodForEdit ( id ) ),
    initialGoodForEdit : () => dispatch ( initialGoodForEdit () )
  }
}

export default connect ( mapStateToProps, mapDispatchToProps ) ( EditorGoods );