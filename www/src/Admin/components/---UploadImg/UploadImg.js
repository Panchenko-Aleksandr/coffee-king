import React, { Component } from 'react'
import { connect } from 'react-redux';
import './UploadImg.scss';
import InputImg from "../InputImg";
// import { addNewGoodAlternativ } from "../../../store/actions/goodAction";

class UploadImg extends Component {
  state = {
    files : []
  };

  onHandleChange = ( e ) => {
    e.preventDefault ();
    const { files } = e.target;
    if ( files ) {
      let newArrPreviewImg = [];

      for ( let idx = 0; idx <= files.length - 1; idx++ ) {
        newArrPreviewImg = [...newArrPreviewImg, URL.createObjectURL ( files[ idx ] )];
      }
      this.setState ( { files : newArrPreviewImg } );
    }
  };

  onSubmitFormHandler = ( e ) => {
    e.preventDefault ();

    const formDataWithAttrName = Object.values ( { ...this.form } ).filter ( i => !!( i.name ) );
    const formData = new FormData ();
    const formDataFile = new FormData ();

    formDataWithAttrName.forEach ( i => {
      console.log ( i.type );
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

    //this.props.addNewGood ( formData );


    // // Display the key/value pairs]
    let newGood = '';
    for ( let key of formData.entries () ) {
      newGood += `"${ key[ 0 ] }" : "${ key[ 1 ] }"`;
      console.log ( key[ 0 ] + ' : ' + key[ 1 ] );
    }

    this.props.addNewGoodAlternativ ( '12311', formDataFile, 'nename',  );
    //this.clearForm ( e );
  };

  render () {
    const { name } = this.props;
    const { files } = this.state;
    return (
        <div className="upload-img-wrapper">
          <form id={ 'formData' } ref={ el => ( this.form = el ) }>
            <InputImg name={ 'fileUpload' }/>
            <input type="submit" value={ 'SUBMIT' } onClick={ this.onSubmitFormHandler }/>
          </form>
          <input
              type="file"
              name={ name }
              accept=".jpg, .jpeg, .png, .webp"
              onChange={ this.onHandleChange }
          />

          {
            ( files ) ?
                files.map ( ( img, idx ) => {
                  return (
                      <label key={ idx }>
                        <img className="preview-img" src={ img } alt={ '' }/>
                      </label>
                  )
                } )
                : <></>
          }

        </div>
    )
  }
}

function mapStateToProps ( state ) {
  return {}
}

function mapDispatchToProps ( dispatch ) {
  return {
    // addNewGoodAlternativ : ( _id, img, name ) => dispatch ( addNewGoodAlternativ ( _id, img, name ) ),
  }
}

export default connect ( mapStateToProps, mapDispatchToProps ) ( UploadImg );

