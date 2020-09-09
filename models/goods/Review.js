const { Schema, model } = require ( 'mongoose' );

const { getDate, setDate } = require ( '../utils/db' );

const reviewSchema = new Schema ( {
  title : {
    type : String,
    required : true
  },
  reviewText : {
    type : String,
    required : true
  },
  rating : {
    type : Number,
    min : 0,
    max : 5,
    default : 0
  },
  dateInsert : {
    type : Date,
    set : setDate,
    get : getDate
  },
  user : {
    type : Schema.Types.ObjectID,
    ref : 'Users'
  }
} );


module.exports = model ( 'Review', reviewSchema );