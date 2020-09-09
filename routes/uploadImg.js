const { Router } = require ( 'express' );
const router = Router ();
const multer = require ( 'multer' );
const upload = multer ();

const { msgSuccess } = require ( '../keys' );

router.get ( "/", upload.any (), async ( req, res ) => {
  try {
    const {} = req.body;

    console.log('BackEnd');
    res.set ( 'token', '1245678412' );
    res.status ( 202 );
    res.json ( {
      message : msgSuccess
    } )

  } catch ( e ) {
    console.log ( e );
  }

} );

module.exports = router;