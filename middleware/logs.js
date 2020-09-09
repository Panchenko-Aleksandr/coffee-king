const { depthLogs } = require ( '../keys' );

module.exports = ( req, res, next ) => {

  switch ( depthLogs ) {
    case 0:
    case 1:
    case 3:
      console.log ( 'QUERY:', req.body.query );
      break;
    default: {
      return
    }
  }
  next ();
};