import React, { Component } from 'react';
import './Input.scss';

class Input extends Component {
  state = {
    value : this.props.value,
    isError : false
  };

  handleChange = ( e ) => {
    const { value } = e.target;
    this.setState ( { value } );
  };

  onBlurChecked = ( e ) => {
    const { type, name, value } = e.target;
    if ( this.props.validate ) {
      switch ( this.props.typeValid ) {
        case 'text' : {
          return ( value === '' ) ? this.changeError ( true ) : this.changeError ( false );
        }
      }
    }
  };

  changeError = ( param ) => {
    this.setState ( { isError : param } );
  };

  render () {
    const { type, inputClass, name, label, validation } = this.props;
    return (
        <>
          <input
              type="text"
              id="m-input-field"
              data-sub-type={ type }
              value={ this.state.value }
              onChange={ this.handleChange }
              className={ `${ inputClass } ${ ( this.state.isError ) ? 'error' : '' }` }
              onBlur={ this.onBlurChecked }
              name={ name }
          />
          <label htmlFor={ name }>{ label }</label>
        </>
    )
  }
}

export default Input;