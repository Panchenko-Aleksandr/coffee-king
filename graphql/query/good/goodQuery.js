const { GraphQLList, GraphQLString, GraphQLFloat, GraphQLBoolean, GraphQLID } = require ( 'graphql' );

const { goodType } = require ( '../../schema/Schema' );
const { reviewType } = require ( '../../schema/Schema' );
const { categoryType } = require ( '../../schema/Schema' );

const Good = require ( '../../../models/goods/Good' );
const Review = require ( '../../../models/goods/Review' );
const Category = require ( '../../../models/goods/Category' );

module.exports = {

  getAllGoods : {
    description : 'Получить список всего товара без сортировки',
    type : GraphQLList ( goodType ),
    resolve : async () => {
      const res = await Good.find ()
          .populate ( 'category' )
          .populate ( 'review' )
          .sort ( { isActive : "desc" } )
          .sort ( { price : "asc" } );
      return res;
    }
  },

  getGoodsFilterByCategory : {
    description : 'Получить товары определенной категории',
    type : GraphQLList ( goodType ),
    args : {
      categoryId : { type : GraphQLString }
    },
    resolve : async ( parent, args ) => {
      console.log ( 'args.categoryId', args.categoryId );
      return ( args.categoryId === "undefined" )
          ? await Good.find ( { "category" : args.categoryId } )
              .populate ( 'category', "_id name" )
              .sort ( { isActive : -1 } )
              .sort ( { price : "asc" } )
          : await Good.find ()
              .populate ( 'category', "_id name" )
              .sort ( { isActive : -1 } )
              .sort ( { price : "asc" } )

    }
  },

  getListOfCategory : {
    description : 'Получить все категории кофе',
    type : GraphQLList ( categoryType ),
    resolve : async () => await Category.find ().sort ( { "name" : 1 } )
  },

  searchNameGood : {
    description : 'Поиск товара по имени',
    args : {
      name : { type : GraphQLString },
      isActive : { type : GraphQLBoolean }
    },
    type : GraphQLList ( goodType ),
    resolve : async ( parent, args ) => {
      const res = await Good.find (
          {
            $or : [
              { "name" : { $regex : '.*' + args.name + '.*', $options : 'i' } }
            ]
          }
      )
          .populate ( 'category', 'name' )
          .populate ( 'review' )
          .limit ( 3 );
      console.log ( 'res', res );
      return res;
    }
  },


  filterGoods : {
    description : 'Выборка по существующим фильтрам',
    args : {
      filterName : { type : GraphQLString },
      categoryId : { type : GraphQLString },
      priceMin : { type : GraphQLFloat },
      priceMax : { type : GraphQLFloat },
      tag : { type : GraphQLString }
    },
    type : GraphQLList ( goodType ),
    resolve : async ( parent, args ) => {
      console.log ( 'args', args )
      console.log ( 'args.categoryId', args.categoryId )
      let request = {};

      if ( args.categoryId !== undefined ) {
        request = { ...request, "category" : args.categoryId }
      }

      if ( args.priceMin !== undefined || args.priceMax !== undefined ) {
        request = {
          ...request,
          $and : [
            { "price" : { $gte : args.priceMin } },
            { "price" : { $lte : args.priceMax } },
          ]
        }
      }

      if ( args.tag !== undefined ) {
        request = { ...request, "tag" : { $in : args.tag } }
      }

      return Good.find ( { ...request } )
          .populate ( 'category', "_id name" )
          .sort ( { isActive : -1 } )
          .sort ( { price : "asc" } );
    }
  },

  getGoodById : {
    description : 'Получить товар по его ID',
    args : {
      id : { type : GraphQLID }
    },
    type : GraphQLList ( goodType ),
    resolve : async ( parent, args ) => {
      return Good.find ( { "_id" : args.id } )
          .populate ( 'category', "_id name" )
    }
  }

};

