const { Schema, model } = require ( 'mongoose' );
const { getDate, setDate, getCurrency, setCurrency } = require ( '../utils/db' );
const moment = require ( 'moment' );

const itemsInCartSchema = new Schema ( {
  good : {
    type : Schema.Types.ObjectID,
    ref : 'Good'
  },
  qty : { type : Number },
  price : { type : Number }

} );

module.exports = model ( 'ItemsInCart', itemsInCartSchema );
