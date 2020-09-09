const { Router } = require ( 'express' );
const path = require ( 'path' );
const router = Router ();
const multer = require ( 'multer' );
// const upload = multer ( { dest : path.join ( process.cwd (), '..', 'frontend', 'public', 'img', 'items' )} );
const upload = multer (  );
const sharp = require ( 'sharp' );
const {  pathImg } = require ( '../keys' );

const uploadImg = async function ( files, nameFromId ) {
  let goodImg = [];

  for ( let idx = 0; idx <= files.length - 1; idx++ ) {
    const inputBuffer = await files[ idx ].buffer;
    const newNameImage = `${ nameFromId }-${ idx }`;

    await sharpUpload ( inputBuffer, { width : 320, height : 240 }, `\\${ newNameImage }-preview.webp` );
    await sharpUpload ( inputBuffer, { width : 640, height : 480 }, `\\${ newNameImage }.webp` );

    goodImg = [...goodImg, newNameImage];
  }
  console.log ( 'goodImg', goodImg )
  return goodImg;
};

const sharpUpload = ( inputBuffer, { width, height }, newNameImage ) => {
  sharp ( inputBuffer )
      .resize ( {
        fit : sharp.fit.contain,
        width, height,
        background : { r : 0, g : 0, b : 0, alpha : 0 }
      } )
      .webp ( { quality : 60 } )
      .toFile ( `${ pathImg }${ newNameImage }`, err => {
        if ( err ) console.log ( 'ERROR', err );
      } );
};

router.post ( '/',  upload.any (), async ( req, res ) => {
  const { files } = req;
  console.log ( 'files', files );
  const result = await uploadImg ( files, '24' );
  res.setHeader('content-type', 'application/json');
  res.send ( 'Ok' );
} );

module.exports = router;
