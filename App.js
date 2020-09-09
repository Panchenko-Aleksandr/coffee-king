const express = require ( 'express' );
const config = require ( 'config' );
const path = require ( 'path' );
const fs = require ( 'fs' );

const cookieParser = require ( 'cookie-parser' );
const logger = require ( 'morgan' );
const bodyParser = require ( 'body-parser' );
const mongoose = Object ( require ( 'mongoose' ) );
mongoose.set ( 'useCreateIndex', true );
const session = require ( 'express-session' );
const MongoDBStore = require ( 'connect-mongodb-session' ) ( session );
const { graphqlHTTP } = require ( 'express-graphql' );
const compression = require ( 'compression' );
const cors = require ( 'cors' );

//Routes
const editorGood = require ( './routes/editorGood' );
const uploadRouter = require ( './routes/upload' );
const logoutSession = require ( './routes/logout' );
const env = require ( './keys' );
const schema = require ( './graphql/Schema' );
const logs = require ( './middleware/logs' );
const sendSession = require ( './middleware/sendSession' );
const app = express ();

//Constant
const PORT = process.env.PORT || config.get ( 'port' );
const MONGODB_URI = process.env.MONGODB_URI || config.get ( 'mongodb_uri' );

//Middleware
app.use ( cors () );

app.use ( logger ( 'dev' ) );

//Create Session
const store = new MongoDBStore ( {
  uri : MONGODB_URI,
  collection : 'sessions'
} );

// Catch errors
store.on ( 'error', function ( error ) {
  console.log ( 'ПОЛУЧИЛ ОШИБКУ БД', error );
} );

app.use ( require ( 'express-session' ) ( {
  secret : 'This is a secret',
  cookie : {
    maxAge : 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store : store,
  resave : true,
  saveUninitialized : true
} ) );


app.use ( bodyParser.json () );
app.use ( bodyParser.urlencoded ( { extended : false } ) );
app.use ( cookieParser () );

// app.use ( express.static ( path.join ( __dirname, 'img', 'items' ) ) );
//
// console.log ( 'PUBLIC', path.join ( __dirname, 'img', 'items' ) );

if ( process.env.NODE_ENV === 'production' ) {
  app.use ( '/', express.static ( path.join ( __dirname, 'www', 'build' ) ) );
  app.use ( '/', express.static ( path.join ( __dirname, 'www', 'build', 'img' ) ) );

  app.use ( '/graphql', graphqlHTTP ( {
    schema : schema,
    graphiql : true
  } ), sendSession );

  app.use ( '/editorGood', editorGood );

  app.use ( '/logout', logoutSession );

  app.get ( '*', ( req, res ) => {
    res.sendFile ( path.resolve ( __dirname, 'www', 'build', 'index.html' ) )
  } )
}

app.use ( compression () );
app.use ( logs );
//Routes

app.use ( '/graphql', graphqlHTTP ( {
  schema : schema,
  graphiql : true
} ), sendSession );

app.use ( '/editorGood', editorGood );
app.use ( '/upload', uploadRouter );
app.use ( '/logout', logoutSession );


//Exec
async function start () {
  try {
    const db = await mongoose.connect ( MONGODB_URI, {
      useNewUrlParser : true,
      useUnifiedTopology : true,
      useFindAndModify : false,
      useCreateIndex : true
    } );

    app.listen ( PORT, () => {
      console.log ( `Server is running on port ${ PORT }` )
    } );

  } catch ( e ) {
    console.log ( e );
  }
}

start ();
