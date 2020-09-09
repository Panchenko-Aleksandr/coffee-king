import React, { Component } from 'react'
import { connect } from 'react-redux';
import './SearchModule.scss';

class SearchModule extends Component {
  selectGood = ( e ) => {
    e.stopPropagation ();
    const id = e.target.closest ( '.search-good-line' ).dataset.id;
    this.props.fn ( id );
  };

  render () {
    const { isShow, list } = this.props;

    return ( <>          {
          ( isShow  )
              ? <div className="search-good-container animate__animated animate__backInUp wow">
                <table>
                  <tr>
                    <th>Рисунок</th>
                    <th>Товар</th>
                    <th>Активность</th>
                  </tr>
                  {
                    list.map ( i => (
                        <tr key={ i._id } className="search-good-line" data-id={ i._id } onClick={ this.selectGood }>
                          <td className="search-img"><img src={ `/img/items/${ i.img }-preview.webp` } alt=""/></td>
                          <td>{ i.name }</td>
                          <td className="search-good-active">{ ( i.isActive ) ? `✔️` : `❌` }</td>
                        </tr>
                    ) )
                  }

                </table>
              </div>
              : <></>
        }

        </>
    )
  }
}

function mapStateToProps ( state ) {
  return {}
}

function mapDispatchToProps ( dispatch ) {
  return {}
}

export default connect ( mapStateToProps, mapDispatchToProps ) ( SearchModule )