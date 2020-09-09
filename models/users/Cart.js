const { Schema, model } = require ( 'mongoose' );
const { getDate, setDate, getCurrency, setCurrency } = require ( '../utils/db' );
const moment = require ( 'moment' );

const cartSchema = new Schema ( {
  itemsGood : [{
    type : Schema.Types.ObjectID,
    ref : 'ItemsInCart'
  }],

  orderDate : {
    type : Date,
    required : true,
    default : moment (),
    get : getDate
  },

  orderStatus : {
    type : Number,
    required : true,
    default : 0,
    enum : [0, 1, 2]
  }
} );

module.exports = model ( 'Cart', cartSchema );
