const { GraphQLList, GraphQLString, GraphQLID, GraphQLBoolean } = require ( 'graphql' );

const { userType } = require ( '../../schema/Schema' );
const { cartType } = require ( '../../schema/Schema' );

const Cart = require ( '../../../models/users/Cart' );
const User = require ( '../../../models/users/Users' );
const Session = require ( '../../../models/users/Session' );
const ItemsInCart = require ( '../../../models/users/ItemsInCart' );

const bcrypt = require ( 'bcryptjs' );
const moment = require ( 'moment' );

module.exports = {

  getAllUsers : {
    description : 'Получить список всех пользователей',
    args : {
      login : { type : GraphQLString },
      name : { type : GraphQLString },
      email : { type : GraphQLString }
    },
    type : GraphQLList ( userType ),
    resolve : async ( parent, args ) => {
      const { login, name, email } = args;
      let requestStr = {};

      if ( login ) {
        requestStr = {
          ...requestStr,
          login : { $regex : '.*' + login + '.*', $options : 'i' }
        }
      }

      if ( name ) {
        requestStr = { ...requestStr, name : { $regex : '.*' + name + '.*', $options : 'i' } }
      }

      if ( email ) {
        requestStr = { ...requestStr, email : { $regex : '.*' + email + '.*', $options : 'i' } }
      }

      return User.find ( { ...requestStr } )
          .populate ( {
            path : 'cart',
            populate : {
              path : 'itemsGood',
              populate : {
                path : 'good'
              }
            }
          } );
    }
  },

  getCartUser : {
    description : 'Получить список товаров пользователя',
    args : {
      userId : { type : GraphQLID }
    },
    type : GraphQLList ( userType ),
    resolve : async ( parent, args ) => {
      const res = await User.find ( { "_id" : args.userId } )
          .populate ( {
            path : 'cart',
            populate : {
              path : 'itemsGood',
              populate : {
                path : 'good'
              }
            }
          } );
      return res;
    }
  },

  checkExistUser : {
    description : 'Проверка пользователя на существование',
    type : userType,
    args : {
      login : { type : GraphQLString },
    },
    async resolve ( parent, args ) {
      return User.findOne ( { login : args.login } );
    }
  },

  authUser : {
    description : 'Авторизация пользователя',
    type : userType,
    args : {
      login : { type : GraphQLString },
      password : { type : GraphQLString }
    },
    async resolve ( parent, args, req ) {
      const hashedPassword = await bcrypt.hash ( args.password, 12 );
      console.log ( hashedPassword );
      const authUser = await User.findOne ( { login : args.login } );
      console.log ( 'authUser', authUser );

      if ( authUser ) {
        if ( await bcrypt.compare ( args.password, authUser.password ) ) {
          console.log ( 'sessionId', req.sessionID );
          await User.findByIdAndUpdate ( authUser._id, { $set : { sessionId : req.sessionID } } );
          return User.findOne ( { login : args.login } );
        } else {
          return {
            code : 100,
            message : 'Ошибка авторизации, пароль не опознан!'
          }

        }
      }

    }
  },

  logoutUser : {
    description : 'Авторизация пользователя',
    type : userType,
    args : {
      token : { type : GraphQLString }
    },
    async resolve ( parent, args, req ) {
      const logoutUser = await User.findOne ( { sessionId : args.token } );
      console.log ( 'logout', logoutUser );

      if ( logoutUser ) {
        console.log ( 'sessionId!!!', req.sessionID );
        req.session.destroy ();
        await User.findByIdAndUpdate ( logoutUser._id, { $set : { sessionId : null} } );
        return User.findOne ( { _id : logoutUser._id } );
      } else {
        return {
          code : 100,
          message : 'Ошибка авторизации, пароль не опознан!'
        }

      }
    }

  },

  getUserByToken : {
    description : 'Получение пользователя по токену',
    type : userType,
    args : {
      token : { type : GraphQLString }
    },
    async resolve ( parent, args ) {
      const user = await User.findOne ( { sessionId : args.token } );
      console.log ( 'user', user )
      if ( user ) {
        const session = await Session.findOne ( { _id : args.token } );
        // console.log ( 'session', session );
        console.log ( 'time', moment ( session.expires ).utc ().diff ( moment ().utc () ) );
        if ( moment ( session.expires ).utc ().diff ( moment ().utc () ) > 0 ) {
          return user
        }
      }
    }

  },

  getCartById : {
    description : 'Получение корзины по её ID',
    type : cartType,
    args : {
      cartId : { type : GraphQLID }
    },
    async resolve ( parent, args ) {
      const cart = await Cart.findById ( args.cartId )
          .populate ( {
            path : 'itemsGood',
            populate : {
              path : 'good'
            }
          } );
      return cart;
    }
  }

};

