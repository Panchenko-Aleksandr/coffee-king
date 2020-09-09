import React, { Component } from 'react'
import { connect } from 'react-redux';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import './Auth.scss';
import { authenticateUser, changeShowAuth, registerNewUser } from "../../store/actions/authAction";
import { email, required } from "../../Admin/Validators";

class Auth extends Component {
  state = {
    isShowReg : false,
    isErrorComparePassword : false
  };

  closeAuth = ( e ) => {
    e.preventDefault ();
    this.props.changeShowAuth ()
  };

  handleClickBtnRegister = () => {
    this.setState ( { isShowReg : !this.state.isShowReg } )
  };

  handleClickBtnAuth = () => {
    this.setState ( { isShowReg : !this.state.isShowReg } )
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
    //console.log ( JSONparse );

    if ( e.target.dataset.typeBtn === 'auth' ) {
      this.props.authenticateUser ( JSONparse );
    } else {
      this.props.registerNewUser ( JSONparse );
    }

    // this.clearForm ( e );
  };

  comparePassword = ( e ) => {
    const pass = document.querySelector ( '.register .password' );
    if ( pass.value !== e.target.value ) {
      this.setState ( { isErrorComparePassword : true } )
    } else {
      this.setState ( { isErrorComparePassword : false } )
    }
  };

  render () {
    const { error } = this.props;
    const { isShowReg, isErrorComparePassword } = this.state;

    return (
        <>
          <div className="module-auth-backdrop" onClick={ this.props.changeShowAuth }/>


          {
            ( !isShowReg )
                ? <div className="auth-wrapper animate__backInUp animate__animated wow">
                  <Form>
                    <form id={ 'formData' } className="auth" ref={ el => ( this.form = el ) }>
                      <span className="error">{ error }</span>
                      <h3>Authentication</h3>
                      <label>
                        Login:<span className="required-param">*</span>
                        <Input type="text" name="login" className="login" validations={ [required] }/>
                      </label>
                      <label>
                        Password:<span className="required-param">*</span>
                        <Input type="password" name="password" className="password" validations={ [required] }/>
                      </label>
                      <div className="btn-wrapper">
                        <Button className="btn btn-auth-ok" onClick={ this.onSubmitFormHandler } data-type-btn={ ( 'auth' ) }>Enter</Button>
                        <button className="btn btn-auth-cancel" onClick={ this.closeAuth }>Cancel</button>
                        <span className="btn btn-register" onClick={ this.handleClickBtnRegister }>Register</span>
                      </div>
                    </form>
                  </Form>
                </div>

                //Register
                : <div className="auth-wrapper animate__backInUp animate__animated wow">
                  <Form className="register">
                    <form id={ 'formData' } ref={ el => ( this.form = el ) }>
                      <span className="error">{ error }</span>
                      <h3>Registration</h3>
                      <label>
                        Login:<span className="required-param">*</span>
                        <Input type="text" name="login" className="login" validations={ [required] }/>
                      </label>
                      <label>
                        Password:<span className="required-param">*</span>
                        <Input type="password" name="password" className="password" validations={ [required] }/>
                      </label>
                      <label>
                        Re-password:<span className="required-param">*</span> {
                        ( isErrorComparePassword ) ? <span className="error">Пароли не совпадают</span> : <></>
                      }
                        <Input type="password" name="password" className="re-password" validations={ [required] } onBlur={ this.comparePassword }/>

                      </label>
                      <label>
                        Name:<span className="required-param">*</span>
                        <Input type="text" name="name" className="re-password" validations={ [required] }/>
                      </label>
                      <label>
                        Email:<span className="required-param">*</span>
                        <Input type="text" name="email" className="re-password" validations={ [required, email] }/>
                      </label>
                      <label>
                        Address:<span className="required-param">*</span>
                        <Input type="text" name="address" className="re-password" validations={ [required] }/>
                      </label>
                      <div className="btn-wrapper">
                        <Button className="btn btn-auth-ok" data-type-btn={ ( 'register' ) }
                                onClick={ this.onSubmitFormHandler }>Enter</Button>
                        <button className="btn btn-auth-cancel" onClick={ this.closeAuth }>Cancel</button>
                        <span className="btn btn-register" onClick={ this.handleClickBtnAuth }>Login</span>
                      </div>
                    </form>
                  </Form>
                </div>
          }


        </>

    )
  }
}

function mapStateToProps ( state ) {
  return {
    error : state.authReducer.error
  }
}

function mapDispatchToProps ( dispatch ) {
  return {
    changeShowAuth : () => dispatch ( changeShowAuth () ),
    registerNewUser : ( data ) => dispatch ( registerNewUser ( data ) ),
    authenticateUser : ( data ) => dispatch ( authenticateUser ( data ) )
  }
}


export default connect ( mapStateToProps, mapDispatchToProps ) ( Auth );