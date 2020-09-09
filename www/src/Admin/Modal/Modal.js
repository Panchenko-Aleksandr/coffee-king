import React, { Component } from 'react'
import M from 'materialize-css';
import { connect } from "react-redux";

import './Modal.scss';


class Modal extends Component {
  constructor ( props ) {
    super ( props );
    this.state = {
      id : this.props.id,
      type : this.props.type,
      title : this.props.title,
      text : this.props.text,
      fnAgree : this.props.fnAgree
    };
    this.instance = '';
  }

  componentWillUnmount () {
    const modal = document.querySelector ( '.modal-frame' );
    this.instance = M.Modal.getInstance ( modal );
    this.instance.destroy ();
  }

  componentDidUpdate ( prevProps, prevState, snapshot ) {

    //M.Modal.init ( document.querySelectorAll ( '.modal' ) );
  }

  render () {
    const { id, type, title, text, fnAgree, fnParam } = this.props;
    let agree = '';
    let disagree = '';

    switch ( type ) {
      case 'Error': {
        agree = 'Ok';
        disagree = null;
        break;
      }
      case 'Confirmation' : {
        agree = 'Да';
        disagree = 'Случайно нажал';
        break;
      }
      case 'Information' : {
        agree = 'Ok';
        disagree = null;
        break;
      }
      default :
        break;
    }

    return (
        <div>
          <div id={ `${ id }` } className={ `modal modal-frame ${ type } ` }>
            <div className="modal-content">
              <h5>{ title }</h5>
              <p>{ text }</p>
            </div>
            <div className="modal-footer">
              { ( disagree )
                  ? <div className="modal-close btn-flat">{ disagree }</div>
                  : null
              }
              <div className="modal-close btn-flat" onClick={ () => {
                if ( fnAgree ) fnAgree ( fnParam )
              } }>{ agree }</div>
            </div>
          </div>
        </div>
    )
  }
}

function mapStateToProps ( state ) {
  return {
    isShow : state.layoutReducer.Modal.isShow,
    id : state.layoutReducer.Modal.id,
    type : state.layoutReducer.Modal.type,
    title : state.layoutReducer.Modal.title,
    text : state.layoutReducer.Modal.text,
    fnParam : state.layoutReducer.Modal.fnParam,
    fnAgree : state.layoutReducer.Modal.fnAgree
  }
}


export default connect ( mapStateToProps, null ) ( Modal );