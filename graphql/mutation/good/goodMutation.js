const { GraphQLInt, GraphQLID, GraphQLBoolean, GraphQLString, GraphQLFloat, GraphQLList} = require ( 'graphql' );
const { catchError } = require ( '../../../utils/mutationUtils' );

const { goodType } = require ( '../../schema/Schema' );
const Good = require ( '../../../models/goods/Good' );

const editExistGood = {
  description : 'Редактирование товара',
  type : goodType,
  args : {
    _id : { type : GraphQLID },
    name : { type : GraphQLString, description : 'Название товара' },
    price : { type : GraphQLFloat, description : 'Старая цена, для отображения SALE' },
    oldPrice : { type : GraphQLFloat, description : 'Текущая цена' },
    itemShortDescription : { type : GraphQLString, description : 'Короткое описание, для слайдера' },
    isActive : { type : GraphQLBoolean, description : 'Активность товара' },
    category : { type : GraphQLID, description : 'Категория товара' },
    tag : { type : GraphQLList (GraphQLString), description : 'Тэги для удобного поиска' },
    descriptionTitle : { type : GraphQLString, description : 'Заголовок описания' },
    descriptionText : { type : GraphQLString, description : 'Описание товара' },
    review : { type : GraphQLID, description : 'Обзоры, отзывы' },
    dataInsert : { type : GraphQLString, description : 'Дата добавления товара' }
  },
  async resolve ( parent, args ) {
    try {
      const { _id } = args;

      console.log ( 'args', args );
      const result = await Good.findByIdAndUpdate ( _id, { ...args } );
      return await Good.findById ( _id );
    } catch ( e ) {
      catchError ( e );
    }
  }
};

const addNewGood = {
  description : 'Добавление товара',
  type : goodType,
  args : {
    name : {
      type : GraphQLString,
      description : 'Название товара'
    },
    price : { type : GraphQLFloat, description : 'Текущая цена' },
    newPrice : { type : GraphQLFloat, description : 'Старая цена, для отображения SALE' },
    itemShortDescription : { type : GraphQLString, description : 'Короткое описание, для слайдера' },
    isActive : { type : GraphQLBoolean, description : 'Активность товара' },
    category : { type : GraphQLID, description : 'Категория товара' },
    tag : { type : GraphQLList(GraphQLString), description : 'Тэги для удобного поиска' },
    descriptionTitle : { type : GraphQLString, description : 'Заголовок описания' },
    descriptionText : { type : GraphQLString, description : 'Описание товара' },
    review : { type : GraphQLID, description : 'Обзоры, отзывы' },
    dataInsert : { type : GraphQLString, description : 'Дата добавления товара' }
  },

  async resolve ( parent, args ) {
    try {
      const result = await Good.insertMany ( [{ ...args }] );
      return await Good.findById ( result[ 0 ]._id );
    } catch ( e ) {
      catchError ( e );
    }
  }
};

const updateImgForGood = {
  description : 'Добавление изображения к товару',
  type : goodType,
  args : {
    _id : { type : GraphQLID },
    img : {
      type : GraphQLString,
      description : 'Путь к рисунку'
    }
  },
  async resolve ( parent, args ) {
    try {
      const { _id, img } = args;
      const result = await Good.updateOne (
          { "_id" : _id },
          { $set : { "img" : img } },
          ( err, raw ) => {
            if ( err ) console.log ( err );
            console.log ( raw );
            return raw;
          }
      );
      return await Good.findById ( _id );
    } catch ( e ) {
      catchError ( e );
    }
  }
};

module.exports = {
  addNewGood,
  editExistGood,
  updateImgForGood
};


