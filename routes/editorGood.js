const { Router } = require ( 'express' );
const router = Router ();
const multer = require ( 'multer' );
const upload = multer ();
const sharp = require ( 'sharp' );

const { msgSuccess } = require ( '../keys' );
const { uploadImg } = require ( '../utils/mutationUtils' );

router.post ( "/", upload.any (), async ( req, res ) => {
  try {
    const { files } = req;
    const { _id } = req.body;
    console.log ( 'req.body', req.body );
    console.log ( files );

    const result = await uploadImg ( files, _id );

    console.log ( 'result', result )

    res.json ( {
      ...msgSuccess,
      nameImg : result[ 0 ]
    } )

  } catch ( e ) {
    console.log ( e );
  }

} );

module.exports = router;
