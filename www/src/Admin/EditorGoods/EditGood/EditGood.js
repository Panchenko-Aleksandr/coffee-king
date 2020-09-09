import React, { Component } from 'react';
import { connect } from 'react-redux';
import './EditGood.scss';
import './Checkbox.scss';

import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import Textarea from "react-validation/build/textarea";
import Select from "react-validation/build/select";

import InputImg from "../../components/InputImg";

import { required, number, requiredSelectCategory } from '../../Validators';
import { editorGood, editorGoodAlternativ, editCategory, fetchCategoryOfGood, initialGoodForEdit } from "../../../store/actions/goodAction";
import Loader from "../../../components/Loader/Loader";

import { openModalWindow } from "../../../store/actions/layoutAction";
import UploadImg from "../../components/---UploadImg/UploadImg";

class NewGood extends Component {
  state = {
    select : {
      selectedValue : '-1',
      fieldInput : false,
      fieldSelect : true,
      btnOk : false,
      btnEdit : false,
      btnAdd : true,
      btnDel : false,
      addingGood : false,
      newValue : ''
    },
    checked : this.props.selectedGoodForEdit?.isActive,
    goodParam : {
      name : '',
      price : '',
      tags : '',
      short : '',
      title : '',
      full : ''
    }
  };

  componentDidUpdate ( prevProps, prevState, snapshot ) {
    // console.log ( 'prevProps', prevProps );
    // console.log ( 'this.props', this.props );
    if ( this.props.selectedGoodForEdit?._id !== prevProps.selectedGoodForEdit?._id ) {
      if ( this.props.selectedGoodForEdit?.category._id ) {
        const previewImg = document.querySelector ( '.preview-img' );

        if ( previewImg ) {
          previewImg.removeAttribute ( "src" );
        }

        this.setState ( {
          select : {
            ...this.state.select,
            selectedValue : JSON.stringify ( {
              "_id" : this.props.selectedGoodForEdit?.category._id,
              "name" : this.props.selectedGoodForEdit?.category.name
            } )
          },
          checked : this.props.selectedGoodForEdit?.isActive
        } )
      }

    }

  }

  componentDidMount () {
    this.init ();
  }

  init = () => {
    this.props.fetchCategoryOfGood ()
  };

  clearForm = ( e ) => {
    e.preventDefault ();
    this.form.reset ();
  };

  onSubmitFormHandler = ( e ) => {
    e.preventDefault ();

    const formDataWithAttrName = Object.values ( { ...this.form } ).filter ( i => !!( i.name ) );
    const formData = new FormData ();
    const formDataFile = new FormData ();

    formDataWithAttrName.forEach ( i => {

      switch ( i.type ) {
        case 'file':
          for ( let idx = 0; idx <= i.files.length - 1; idx++ ) {
            formDataFile.append ( 'file', i.files[ idx ] );
          }
          break;
        case 'select-one' :
          formData.append ( i.name, JSON.parse ( i.value )._id );
          break;
        case 'radio' :
          if ( i.checked ) formData.append ( i.name, i.value );
          break;
        case 'checkbox':
          formData.append ( i.name, i.checked );
          break;
        default : {
          formData.append ( i.name, i.value );
          break;
        }
      }
    } );

    //this.props.editorGood ( formData );


    // // Display the key/value pairs]
    let newGood = '';
    for ( let key of formData.entries () ) {
      newGood += `"${ key[ 0 ] }" : "${ key[ 1 ].replace ( /\n/g, "\\n" ) }",`;
      // console.log ( key[ 0 ] + ' : ' + key[ 1 ] );
    }

    const JSONparse = JSON.parse ( `{${ newGood.slice ( 0, -1 ) }}` );
    console.log ( JSONparse );

    const options = {
      isReloadImg : !!document.querySelector ( '.preview-img' )?.src,
      typeMutation : e.target.dataset.typeBtn
    };


    this.props.editorGood ( JSONparse, formDataFile, options );
    // this.clearForm ( e );
  };

  handleBtnClick = ( e ) => {
    e.preventDefault ();
    const $el = document.querySelector ( '#select-container' );
    const valueParse = JSON.parse ( $el.value );
    switch ( e.target.dataset.btnType ) {
      case 'btnAdd' : {
        this.setState ( {
          select : {
            ...this.state.select,
            fieldInput : !this.state.select.fieldInput,
            fieldSelect : !this.state.select.fieldSelect,
            btnOk : !this.state.select.btnOk,
            btnAdd : true,
            btnDel : false,
            btnEdit : ( $el.value !== -1 && this.state.select.fieldInput ),
            newValue : ''
          }
        } );
        break;
      }
      case 'btnEdit' : {
        this.setState ( {
          select : {
            ...this.state.select,
            fieldInput : !this.state.select.fieldInput,
            fieldSelect : !this.state.select.fieldSelect,
            btnOk : !this.state.select.btnOk,
            btnAdd : !this.state.select.btnAdd,
            btnEdit : true,
            btnDel : true,
            newValue : ( $el.value !== -1 ) ? valueParse.name : ''
          }
        } );
        break;
      }
      case 'btnDel' : {
        const params = valueParse._id;
        const options = {
          id : 'modalQuestBeforeDeleteOrder',
          type : 'Confirmation',
          title : "Подтверждение",
          text : `Вы действительно хотите удалить категорию ${ valueParse.name } ?`,
          fnParam : params,
          fnAgree : this.deleteCategory,
        };
        this.props.openModalWindow ( options );

        break;
      }
      case 'btnOk' : {
        // console.log ( 'btnOk', this.state.select.btnOk );
        // console.log ( 'btnAdd', this.state.select.btnAdd );
        // console.log ( 'btnEdit', this.state.select.btnEdit );
        // console.log ( 'newValue', this.state.select.newValue );
        // console.log ( 'valueParse', valueParse );

        if ( this.state.select.btnAdd ) {
          new Promise ( async ( resolve ) => {
            await this.props.editCategory ( 'add', 0, this.state.select.newValue );
            if ( this.props.newCategory ) resolve ()
          } )
              .then ( () => {
                this.selectedLine ( JSON.stringify ( this.props.newCategory ) )
              } );
        }

        if ( this.state.select.btnEdit ) {
          new Promise ( async ( resolve ) => {
            await this.props.editCategory ( 'edit', valueParse._id, this.state.select.newValue );
            if ( this.props.newCategory ) resolve ();
          } )
              .then ( () => {
                this.selectedLine ( JSON.stringify ( this.props.newCategory ) )
              } );
        }

        if ( this.state.select.btnDel ) {

        }

        break;
      }
    }
  };

  deleteCategory = ( id ) => {
    this.setState ( {
      select : {
        ...this.state.select,
        fieldSelect : true,
        btnOk : false,
        btnAdd : true,
        btnEdit : false,
        btnDel : false,
        newValue : "-1"
      }
    } );
    new Promise ( async ( resolve ) => {
      await this.props.editCategory ( 'del', id, this.state.select.newValue );
      if ( this.props.newCategory ) resolve ();
    } )
        .then ( () => {
          this.selectedLine ( "-1" )
        } );
  };

  selectedLine = ( value ) => {
    this.setState ( {
      select : {
        ...this.state.select,
        selectedValue : value,
        fieldInput : false,
        fieldSelect : true,
        btnOk : false,
        btnAdd : true,
        btnEdit : true
      }
    } );
  };

  //SELECT
  handleChangeCategory = ( e ) => {
    e.preventDefault ();


    const value = e.target.value;
    console.log ( value );

    if ( value === '-1' ) {
      this.setState ( {
        select : {
          ...this.state.select,
          selectedValue : value,
          btnEdit : false,
          btnDel : false
        }
      } )
    } else
      this.setState ( {
        select : {
          ...this.state.select,
          selectedValue : value,
          btnEdit : true,
          btnDel : true
        }
      } )

  };

  // INPUT
  handleChangeValue = ( e ) => {
    e.preventDefault ();
    const { value } = e.target;
    this.setState ( {
      select : {
        ...this.state.select,
        newValue : value
      }
    } );
  };

  //CHECKED
  handleChangeStateIsActive = ( e ) => {
    this.setState ( { checked : !this.state.checked } );
  };

  render () {
    const { listCategory, selectedGoodForEdit, editItem, reSearchFn } = this.props;
    const { select, goodParam : { name, price, tags, title, short, full }, checked } = this.state;

    return (
        <>
          <Form id={ 'formData2' }>
            <form id={ 'formData' } ref={ el => ( this.form = el ) }>
              <input type="hidden" name="_id" value={ ( selectedGoodForEdit?._id ) }/>

              <div className="good-name">
                <label>
                  Название товара<span className="required-param">*</span>
                  <Input placeholder="Введите название товара" value={ selectedGoodForEdit?.name || '' } name='name' validations={ [required] }/>
                </label>
              </div>

              {
                ( editItem )
                    ? (
                        <div className="good-price">
                          <label>
                            Текущая цена
                            <Input name='oldPrice' value={ selectedGoodForEdit?.price.toFixed ( 2 ) } disabled/>
                          </label>
                        </div>
                    )
                    : <></>
              }

              <div className="good-price">
                <label>
                  Введите цену<span className="required-param">*</span>
                  <Input placeholder="Введите цену товара" name='price' value={ selectedGoodForEdit?.price.toFixed ( 2 ) } validations={ [number] }/>
                </label>
              </div>

              {
                ( !editItem )
                    ? <div className="good-is-active">
                      <input type="checkbox" className="is-active-checkbox" id="isActive" name="isActive"/>
                      <label htmlFor="isActive">Активность товара</label>
                    </div>
                    : <div className="good-is-active">
                      <input type="checkbox" className="is-active-checkbox" id="isActiveEditItem" checked={ checked } name="isActive"
                             onChange={ this.handleChangeStateIsActive }/>
                      <label htmlFor="isActiveEditItem">Активность товара</label>
                    </div>
              }


              <div className="good-category">
                <label>
                  Выберите категорию<span className="required-param">*</span>
                  {
                    ( !listCategory )
                        ? <Loader class={ 'mini' }/>
                        : (
                            <div className="list-category">

                              <div className="list-category-input-wrapper">
                                <Select
                                    id={ 'select-container' }
                                    value={ select.selectedValue }
                                    name={ `category` }
                                    validations={ [requiredSelectCategory] }
                                    style={ { display : `${ ( select.fieldSelect ) ? 'block' : 'none' }` } }
                                    onChange={ this.handleChangeCategory }
                                >
                                  <option value="-1">Выберите категорию</option>
                                  {
                                    listCategory.map ( i => {
                                      return (
                                          <option
                                              key={ i._id }
                                              value={ JSON.stringify ( { "_id" : i._id, "name" : i.name } ) }
                                          >{ i.name }</option>
                                      )
                                    } )
                                  }
                                </Select>

                                <Input
                                    placeholder="Введите новую категорию"
                                    name='newCategory'
                                    className="new-category"
                                    value={ select.newValue }
                                    onChange={ this.handleChangeValue }
                                    style={ { display : `${ ( select.fieldInput ) ? 'block' : 'none' }` } }
                                />
                              </div>

                              {
                                ( !editItem )
                                    ? <>
                                      <button
                                          title={ 'Подтвердить изменение' }
                                          data-btn-type={ "btnOk" }
                                          className="btnOk"
                                          style={ { display : `${ ( select.btnOk ) ? 'block' : 'none' }` } }
                                          onClick={ this.handleBtnClick }
                                      >✔️
                                      </button>
                                      <button
                                          title={ 'Редактировать' }
                                          data-btn-type={ "btnEdit" }
                                          className="btnEdit"
                                          style={ { display : `${ ( select.btnEdit ) ? 'block' : 'none' }` } }
                                          onClick={ this.handleBtnClick }
                                      > 📝
                                      </button>
                                      <button
                                          title={ 'Добавить' }
                                          data-btn-type={ "btnAdd" }
                                          className="btnAdd"
                                          style={ { display : `${ ( select.btnAdd ) ? 'block' : 'none' }` } }
                                          onClick={ this.handleBtnClick }
                                      >➕
                                      </button>
                                      <button
                                          title={ 'Удалить' }
                                          data-btn-type={ "btnDel" }
                                          className="btnDel"
                                          style={ { display : `${ ( select.btnDel ) ? 'block' : 'none' }` } }
                                          onClick={ this.handleBtnClick }
                                      >❌
                                      </button>
                                    </>
                                    : <></>


                              }


                            </div>
                        )
                  }

                </label>
              </div>

              <div className="good-img">
                <label>
                  Фото товара
                  <InputImg name={ 'fileUpload' }/>
                  {
                    ( editItem && selectedGoodForEdit?.img )
                        ? <img className="good-img-edit-img" src={ `/img/items/${ selectedGoodForEdit?.img }.webp` } alt={ `${ selectedGoodForEdit?.name }` }/>
                        : <></>
                  }
                </label>
              </div>
              <div className="good-tags">
                <label>
                  Тэги<span className="required-param">*</span>
                  <Input placeholder="Введите тэги через ," name='tags' value={ ( selectedGoodForEdit?.tag || '' ) } validations={ [required] }/>
                </label>
              </div>
              <div className="good-small-description">
                <label>
                  Краткое описание товара<span className="required-param">*</span>
                  <Input placeholder="Введите краткое описание товара" value={ ( selectedGoodForEdit?.itemShortDescription || '' ) } name='shortDescription'
                         validations={ [required] }/>
                </label>
              </div>
              <div className="good-title-description">
                <label>
                  Введите заголовок описания<span className="required-param">*</span>
                  <Input placeholder=" Введите заголовок описания товара" value={ ( selectedGoodForEdit?.descriptionTitle || '' ) } name='descriptionTitle'
                         validations={ [required] }/>
                </label>
              </div>
              <div className="good-description">
                <label>
                  Введите описание товара<span className="required-param">*</span>
                  <Textarea placeholder="Введите описание товара товара" value={ ( selectedGoodForEdit?.descriptionText || '' ) } name='fullDescription'
                            validations={ [required] }/>
                </label>
              </div>
              <div className="good-btn">
                <Button className="btn btn-submit-new-good"
                        data-type-btn={ ( !editItem ) ? 'add' : 'edit' }
                        onClick={ this.onSubmitFormHandler }>{ ( !editItem ) ? 'Добавить товар' : 'Сохранить' +
                    ' изменения' }</Button>
              </div>
            </form>
          </Form>
        </>
    )
  }
}

function mapStateToProps ( state ) {
  return {
    listCategory : state.goodReducer.listCategory,
    newCategory : state.goodReducer.newCategory,
    selectedGoodForEdit : state.goodReducer.search.selectedGoodForEdit
  }
}

function mapDispatchToProps ( dispatch ) {
  return {
    editorGood : ( dataItem, img, options ) => dispatch ( editorGood ( dataItem, img, options ) ),
    fetchCategoryOfGood : () => dispatch ( fetchCategoryOfGood () ),
    editCategory : ( type, _id, newCategory ) => dispatch ( editCategory ( type, _id, newCategory ) ),
    openModalWindow : ( options ) => dispatch ( openModalWindow ( options ) )
  }
}

export default connect ( mapStateToProps, mapDispatchToProps ) ( NewGood );
