const fs = require ( 'fs' );
const path = require ( 'path' );
const sharp = require ( 'sharp' );

const { pathImg, pathImgA } = require ( '../keys' );

const catchError = function ( e, res ) {
  console.log ( e );
  return Promise.reject ( e )
      .then ( ( success ) => {
      }, ( err ) => {
        const { code, errmsg } = err.writeErrors[ 0 ].err;
        const errMsg = {
          code,
          msg : errmsg
        };
        console.log ( errMsg );
        res.json ( {
          ...errMsg
        } )
      } );
};


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

const rollbackInsert = async function ( Model, _id ) {
  //const { _tvId, _goodId } = listOfId;

  // if ( _tvId ) {
  await Model.deleteOne ( { "_id" : _id }, err => {
    if ( err ) catchError ( err );
  } );
  //}

  // if ( _goodId ) {
  //   await Good.deleteOne ( { "_id" : _goodId }, err => {
  //     if ( err ) catchError ( err );
  //   } );
  // }
};

module.exports = {
  catchError,
  uploadImg,
  rollbackInsert
};
