import React, { Component } from 'react'
import './InputImg.scss';

class InputImg extends Component {
  state = {
    files : null
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

  render () {
    const { name, value } = this.props;
    const { files } = this.state;
    return (
        <div className="upload-img-wrapper">
          {
            ( value )
                ? <>
                  <img src={ `/${ value[ 0 ] }-preview.webp` } alt=""/>
                </>
                : <></>
          }
          <input
              type="file"
              name={ name }
              ref={ ( ref ) => {
                this.uploadInput = ref;
              } }
              accept=".jpg, .jpeg, .png, .webp"
              onChange={ this.onHandleChange }

          />
          {

            ( files ) ?
                files.map ( ( img, idx ) => {
                  return (
                      <label>
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


export default InputImg;
