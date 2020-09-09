const { GraphQLObjectType } = require ( 'graphql' );

const listOfGoodQuery = require ( './query/good/goodQuery' );
const listOfUserQuery = require ( './query/user/userQuery' );

module.exports = new GraphQLObjectType ( {
  name : 'Query',

  fields : () => ( {

    ...listOfGoodQuery,
    ...listOfUserQuery
    //FRONT

  } )
} );
