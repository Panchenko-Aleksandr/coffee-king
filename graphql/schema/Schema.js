const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLBoolean,
  GraphQLFloat
} = require ( 'graphql' );

const reviewType = new GraphQLObjectType ( {
  name : 'review',
  description : 'List of Review',
  fields : () => ( {
    title : { type : GraphQLString },
    reviewText : { type : GraphQLString },
    rating : { type : GraphQLInt },
    dateInsert : { type : GraphQLString },
    user : {
      type : userType,
      resolve ( parent ) {
        return parent.category
      }
    }
  } )
} );

const categoryType = new GraphQLObjectType ( {
  name : 'category',
  description : 'List of Category',
  fields : () => ( {
    _id : { type : GraphQLID },
    name : { type : GraphQLString }
  } )
} );

const goodType = new GraphQLObjectType ( {
  name : 'good',
  description : 'Object of good',
  fields : () => ( {
    _id : { type : GraphQLID },
    name : { type : GraphQLString },
    img : { type : GraphQLString },
    price : { type : GraphQLFloat },
    oldPrice : { type : GraphQLFloat },
    itemShortDescription : { type : GraphQLString },
    category : {
      type : categoryType,
      resolve ( parent ) {
        return parent.category
      }
    },
    isActive : { type : GraphQLBoolean },
    tag : { type : GraphQLList ( GraphQLString ) },
    descriptionTitle : { type : GraphQLString },
    descriptionText : { type : GraphQLString },
    dateInsert : { type : GraphQLString },
    review : {
      type : GraphQLList ( reviewType ),
      resolve ( parent ) {
        return parent.review
      }
    }
  } )
} );

const itemsInCart = new GraphQLObjectType ( {
  name : 'itemsInCart',
  description : 'Товары в корзине',
  fields : () => ( {
    _id : { type : GraphQLID },
    good : {
      type : goodType,
      resolve ( parent ) {
        return parent.good
      }
    },
    qty : { type : GraphQLInt },
    price : { type : GraphQLFloat }
  } )
} );

const cartType = new GraphQLObjectType ( {
  name : 'cart',
  description : 'List of Users',
  fields : () => ( {
    _id : { type : GraphQLID },
    itemsGood : { type : GraphQLList ( itemsInCart ) },
    orderDate : { type : GraphQLString },
    orderStatus : { type : GraphQLInt }
  } )
} );

const userType = new GraphQLObjectType ( {
  name : 'user',
  description : 'List of Users',
  fields : () => ( {
    _id : { type : GraphQLID },
    login : { type : GraphQLString },
    password : { type : GraphQLString },
    permission : { type : GraphQLInt },
    sessionId : { type : GraphQLID },
    name : { type : GraphQLString },
    email : { type : GraphQLString },
    addressDelivery : { type : GraphQLString },
    isActivateAccount : { type : GraphQLBoolean },
    cart : {
      type : GraphQLList ( cartType ),
      resolve ( parent ) {
        return parent.cart
      }
    }

  } )
} );


module.exports = {
  userType,
  cartType,
  itemsInCart,
  goodType,
  categoryType,
  reviewType
};
