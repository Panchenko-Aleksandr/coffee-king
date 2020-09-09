const path = require ( 'path' );

module.exports = {
  MONGODB_URI : 'mongodb://localhost:27017/coffee-shop',
  PORT : 3001,
  timeExpirationDate : 60, //minutes
  //pathImg : `${ path.join ( process.cwd (), 'uploads' ) }`,
   pathImg : `${ path.join ( process.cwd (), 'www', 'public', 'img', 'items' ) }`,
  msgSuccess : {
    code : 0,
    msg : 'Новый товар успешно добавлен!'
  },
  msgError : {
    code : 1,
    msg : 'Произошла ошибка при добавлении новго товара'
  },
  depthLogs : 3

};