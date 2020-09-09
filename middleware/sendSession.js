module.exports = ( req, res, next ) => {
  res.set ( 'token', req.sessionID );
  next ();
};