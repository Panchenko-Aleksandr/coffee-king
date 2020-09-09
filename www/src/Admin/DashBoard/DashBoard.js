import React, { Component } from 'react';
import './DashBoard.scss';
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";

class DashBoard extends Component {
  render () {
    const title = 'Статистика';
    const breadcrumbs = [
      {
        name : 'Статистика',
        link : '/editor-goods'
      }
    ];
    return (
        <div>
          <Breadcrumbs titlePage={ title } breadcrumbs={ breadcrumbs }/>
          <h1>EditorGoods</h1>
        </div>
    )
  }
}

export default DashBoard;
