const { GraphQLObjectType } = require ( 'graphql' );

const listOfGoods = require ( './mutation/good/goodMutation' );
const listOfCategory = require ( './mutation/good/categoryMutation' );

const listOfUser = require ( './mutation/user/userMutation' );


module.exports = new GraphQLObjectType ( {
  name : 'Mutation',
  fields : () => ( {
    //-----Good-----
    ...listOfGoods,
    ...listOfCategory,
    // -----User-----
    ...listOfUser

  } )
} );