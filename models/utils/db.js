const moment = require ( 'moment' );

const getPrice = function ( price ) {
  return `$ ${ price }`;
};

const setDate = function ( date ) {
  return moment ( date ).format ();
};

const getDate = function ( date ) {
  return moment ( date ).format ();
};

function getCurrency ( num ) {
  return ( num / 100 ).toFixed ( 2 );
}

function setCurrency ( num ) {
  return num * 100;
}


module.exports = {
  getPrice,
  setDate,
  getDate,
  getCurrency,
  setCurrency
};