const { Schema, model } = require ( 'mongoose' );
const { getDate, setDate, getCurrency, setCurrency } = require ( '../utils/db' );

const userSchema = new Schema ( {
  login : {
    type : String,
    required : true,
    unique : true
  },

  password : {
    type : String,
    required : true
  },

  permission : {
    // 0 - Админ
    // 1 -Пользователь

    type : Number,
    required : true,
    default : 0,
    enum : [0, 1]
  },

  sessionId : {
    type : String,
    required : true
  },

  name : {
    type : String,
    required : true
  },

  email : {
    type : String,
    required : true,
    unique : true
  },

  isActivateAccount : {
    type : Boolean,
    default : false
  },

  addressDelivery : {
    type : String,
    required : true
  },

  cart : [{
    type : Schema.Types.ObjectID,
    ref : 'Cart'
  }]

} );

module.exports = model ( 'User', userSchema );
