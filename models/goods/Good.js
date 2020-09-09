const { Schema, model } = require ( 'mongoose' );
const moment = require ( 'moment' );
const { getDate } = require ( "../utils/db" );

const goodSchema = new Schema ( {
  name : {
    type : String,
    required : true
  },
  img : {
    type : String,
    required : false
  },
  price : {
    type : Number,
    required : true
  },
  oldPrice : {
    type : Number,
    required : true,
    default : 0
  },
  itemShortDescription : {
    type : String,
    required : true
  },
  isActive : {
    type : Boolean,
    required : true,
    default : false
  },
  category : {
    type : Schema.Types.ObjectID,
    ref : 'Category'
  },
  tag : [{ type : String }],

  descriptionTitle : {
    type : String,
    required : false
  },
  descriptionText : {
    type : String,
    required : false
  },
  review : {
    type : Schema.Types.ObjectID,
    ref : 'Review'
  },
  dateInsert : {
    type : Date,
    default : moment (),
    get : getDate
  }
} );


module.exports = model ( 'Good', goodSchema );
