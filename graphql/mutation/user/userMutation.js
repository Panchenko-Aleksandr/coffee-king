const moment = require ( 'moment' );

const { GraphQLString, GraphQLID, GraphQLInt, GraphQLFloat } = require ( 'graphql' );
const { catchError } = require ( '../../../utils/mutationUtils' );


const { userType } = require ( '../../schema/Schema' );
const User = require ( '../../../models/users/Users' );
const Cart = require ( '../../../models/users/Cart' );
const Good = require ( '../../../models/goods/Good' );
const ItemsInCart = require ( '../../../models/users/ItemsInCart' );

const bcrypt = require ( 'bcryptjs' );
const { check, validationResult } = require ( 'express-validator' );
const session = require ( 'express-session' );
const { cartType } = require ( "../../schema/Schema" );

const addNewUser = {
  description : 'Добавление новой категории товара',
  type : userType,
  args : {
    login : { type : GraphQLString },
    password : { type : GraphQLString },
    permission : { type : GraphQLInt },
    name : { type : GraphQLString },
    email : { type : GraphQLString },
    addressDelivery : { type : GraphQLString }
  },

  async resolve ( parent, args, req ) {
    try {
      console.log ( 'session', req.sessionID );

      const hashedPassword = await bcrypt.hash ( args.password, 12 );

      const param = {
        ...args,
        password : hashedPassword,
        sessionId : req.sessionID
      };

      console.log ( 'param', param );

      const result = await User.insertMany ( [
        { ...param }
      ] );

      return await User.findById ( result[ 0 ]._id )

    } catch ( e ) {
      catchError ( e );
    }
  }
};

const addNewGoodInCart = {
  description : 'Добавление нового товара в корзину',
  type : userType,
  args : {
    userToken : { type : GraphQLID },
    goodId : { type : GraphQLID }
  },
  async resolve ( parent, args, req ) {
    try {
      const { userToken, goodId } = args;
      console.log ( 'session', req.sessionID );

      //Получаем пользователя по токену
      const user = await User.find ( { "sessionId" : userToken } )
          .populate ( {
            path : 'cart',
            populate : {
              path : 'itemsGood',
              populate : {
                path : 'good'
              }
            }
          } );

      const userId = user[ 0 ]._id;

      const good = await Good.find ( { "_id" : goodId } );

      // console.log ( 'user', user );
      console.log ( 'good', good );
      // console.log ( 'userCart', user[ 0 ].cart );


      //Находим корзину со статусом оформление заказа = 0
      const cart = user[ 0 ].cart.filter ( c => c.orderStatus === 0 )[ 0 ];


      //Проверяем на существование корзины покупок со статусом оформление
      if ( cart ) {
        //Корзина существует++++++
        console.log ( 'Корзина существует' );

        //ID - корзины
        const cartId = cart._id;

        //Получаем все товары данной корзины
        const itemsGood = cart.itemsGood;

        //Получаем текущую цену добавленного товара
        const goodPrice = good[ 0 ].price;

        //Проверяем на существования товара который пытаемся добавить
        const findExistGood = itemsGood.filter ( g => g.good._id.toString () === goodId.toString () )[ 0 ];

        if ( findExistGood ) {
          console.log ( 'ТОВАР СУЩЕСТВУЕТ' );
          //Товар существует, добавляем кол-во +1 и пересозраняем корзину
          //ID - товара в корзине покупателя cart.itemsGood._id
          //Новое кол-во
          const newQty = ++findExistGood.qty;
          //Обновляем только кол-во в корзине
          await ItemsInCart.findByIdAndUpdate ( findExistGood._id, { $set : { qty : newQty } }, ( err ) => {
            if ( err ) console.log ( err );
          } );
          //Обновлено

        } else {
          console.log ( 'ТОВАР НЕ СУЩЕСТВУЕТ' );
          //Добавляем товар в темповую корзину
          const res = await ItemsInCart.insertMany (
              {
                good : goodId,
                price : goodPrice,
                qty : 1
              } );

          //Получаем ID нового сформированного товара в корзине
          const newItemsInCartId = res[ 0 ]._id;

          //Формируем новый список товаров в существующей корзине
          const newItemsGood = [...itemsGood.reduce ( ( acc, item ) => [...acc, item._id], [] ), newItemsInCartId];

          //Перезаписываем список товаров в корзине
          await Cart.updateOne ( { "_id" : cartId }, { itemsGood : newItemsGood } );
        }


        //Корзина существует--------
      } else {
        console.log ( 'Корзины не существует' );
        //Корзины не существует+++++

        const tempItems = {
          good : goodId,
          price : good[ 0 ].price,
          qty : 1
        };

        //Создаем новый товар в схеме itemsInCartSchema
        const itemInCart = await ItemsInCart.insertMany ( { ...tempItems } );
        //Получаем _id созданного товара itemInCart[ 0 ]._id

        const tempNewCart = {
          itemsGood : itemInCart[ 0 ]._id
        };

        //Создаем новую корзину у пользователя и добавляем в неё товар наш ItemsInCart
        const tempCart = await Cart.insertMany ( { ...tempNewCart } );
        //Получаем _id созданной корзины cart[0]._id

        //Формируем список корзин пользователя с учетом существующих
        const newCart = [...user[ 0 ].cart.reduce ( ( acc, item ) => [...acc, item._id], [] ), tempCart[ 0 ]._id];

        console.log ( 'newCart', newCart );

        //Обновляем пользователя добавляя ему корзину
        await User.findByIdAndUpdate ( userId,
            {
              $set :
                  { cart : newCart }
            }
        );

        // console.log ( 'newCartIntoUser', newCartIntoUser );

        //Корзины не существует------
      }

    } catch ( e ) {
      catchError ( e );
    }
  }
};

const subItemFromGood = {
  description : 'Удаление одной единицы товара из корзины',
  type : userType,
  args : {
    userToken : { type : GraphQLID },
    goodId : { type : GraphQLID }
  },
  async resolve ( parent, args, req ) {
    try {
      const { userToken, goodId } = args;

      //Получаем пользователя по токену
      const user = await User.find ( { "sessionId" : userToken } )
          .populate ( {
            path : 'cart',
            populate : {
              path : 'itemsGood',
              populate : {
                path : 'good'
              }
            }
          } );

      const userId = user[ 0 ]._id;

      //Находим корзину со статусом оформление заказа = 0
      const cart = user[ 0 ].cart.filter ( c => c.orderStatus === 0 )[ 0 ];

      //Получаем все товары данной корзины
      const itemsGood = cart.itemsGood;

      //Проверяем на существования товара который пытаемся вычесть
      const findExistGood = itemsGood.filter ( g => g.good._id.toString () === goodId.toString () )[ 0 ];

      if ( findExistGood ) {
        console.log ( 'ТОВАР СУЩЕСТВУЕТ' );
        // console.log ( 'findExistGood', findExistGood );
        //Товар существует, убираем кол-во -1 и пересозраняем корзину
        //ID - товара в корзине покупателя cart.itemsGood._id
        //Новое кол-во
        const newQty = --findExistGood.qty;
        //Если кол-во товара больше 0, то вычитаем, если меньше либо равно удаляем запись.
        if ( newQty > 0 ) {
          await ItemsInCart.findByIdAndUpdate ( findExistGood._id, { $set : { qty : newQty } }, ( err ) => {
            if ( err ) console.log ( err );
          } );
        } else {
          await ItemsInCart.findByIdAndDelete ( findExistGood._id );
        }
        //Обновлено

      } else {
        console.log ( 'ТОВАР НЕ СУЩЕСТВУЕТ' )
      }

    } catch ( e ) {
      catchError ( e );
    }
  }
};

const delItemFromCart = {
  description : 'Удаление товара из корзины',
  type : userType,
  args : {
    userToken : { type : GraphQLID },
    goodId : { type : GraphQLID }
  },
  async resolve ( parent, args, req ) {
    try {
      const { userToken, goodId } = args;

      //Получаем пользователя по токену
      const user = await User.find ( { "sessionId" : userToken } )
          .populate ( {
            path : 'cart',
            populate : {
              path : 'itemsGood',
              populate : {
                path : 'good'
              }
            }
          } );

      //Находим корзину со статусом оформление заказа = 0
      const cart = user[ 0 ].cart.filter ( c => c.orderStatus === 0 )[ 0 ];

      //Получаем все товары данной корзины
      const itemsGood = cart.itemsGood;

      //Проверяем на существования товара который пытаемся удалить
      const findExistGood = itemsGood.filter ( g => g.good._id.toString () === goodId.toString () )[ 0 ];

      if ( findExistGood ) {
        console.log ( 'ТОВАР СУЩЕСТВУЕТ' );
        //Товар существует, убираем его и пересохраняем корзину
        //ID - товара в корзине покупателя cart.itemsGood._id
        //Удаляем
        await ItemsInCart.findByIdAndDelete ( findExistGood._id );
        //Обновлено

      } else {
        console.log ( 'ТОВАР НЕ СУЩЕСТВУЕТ' )
      }

    } catch ( e ) {
      catchError ( e );
    }
  }
};


const changeStatusUserCart = {
  description : 'Меняем состояние заказа',
  type : cartType,
  args : {
    cartId : { type : GraphQLID },
    status : { type : GraphQLInt }
  },
  async resolve ( parent, args ) {
    const { cartId, status } = args;
    await Cart.findByIdAndUpdate ( cartId, { $set : { orderStatus : status, orderDate : moment () } } )
    return Cart.findById ( cartId )
        .populate ( {
          path : 'itemsGood',
          populate : {
            path : 'good'
          }
        } );
  }
};

module.exports = {
  addNewUser,
  addNewGoodInCart,
  subItemFromGood,
  delItemFromCart,
  changeStatusUserCart
};




