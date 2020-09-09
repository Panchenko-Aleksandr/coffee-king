const { GraphQLString, GraphQLID } = require ( 'graphql' );
const { catchError } = require ( '../../../utils/mutationUtils' );

const { categoryType } = require ( '../../schema/Schema' );
const Category = require ( '../../../models/goods/Category' );

const addNewCategory = {
  description : 'Добавление новой категории товара',
  type : categoryType,
  args : {
    _id : {
      type : GraphQLID
    },
    name : {
      type : GraphQLString,
      description : 'Название новой категории'
    }
  },

  async resolve ( parent, args ) {
    try {
      const result = await Category.insertMany ( [{ ...args }] );
      return {
        _id : result[ 0 ]._id,
        name : result[ 0 ].name
      };
    } catch ( e ) {
      catchError ( e );
    }
  }
};

const editCategory = {
  description : 'Редактирование существующей категории, в качестве параметра передавать',
  type : categoryType,
  args : {
    _id : {
      type : GraphQLID,
      description : '_id - существующей категории'
    },
    name : {
      type : GraphQLString,
      description : 'Новое название категории товара'
    }
  },
  async resolve ( parent, args ) {
    try {
      const { _id, name } = args;
      const result = await Category.updateOne (
          { "_id" : _id },
          { $set : { "name" : name } },
          ( err, raw ) => {
            if ( err ) console.log ( err );
            console.log ( raw );
            return raw;
          }
      );

      return await Category.findById ( _id );

    } catch ( e ) {
      catchError ( e );
    }
  }
};

const deleteCategory = {
  description : 'Удаление существующей категории',
  type : categoryType,
  args : {
    _id : {
      type : GraphQLID,
      description : '_id - существующей категории'
    }
  },
  async resolve ( parent, args ) {
    try {

      const { _id } = args;
      return await Category.findByIdAndDelete ( _id );

    } catch ( e ) {
      catchError ( e );
    }
  }
};


module.exports = {
  addNewCategory,
  editCategory,
  deleteCategory
};



