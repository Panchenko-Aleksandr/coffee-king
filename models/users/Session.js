const { Schema, model } = require ( 'mongoose' );
const { getDate, setDate, getCurrency, setCurrency } = require ( '../utils/db' );

const sessionSchema = new Schema ( {
  _id : {
    type : String
  },
  expires : {
    type : String,
    get : getDate
  },
  session : {
    cookie : {
      originalMaxAge : { type : Number },
      expires : { type : String, get : getDate }
    }
  }
} );
module.exports = model ( 'Session', sessionSchema );
