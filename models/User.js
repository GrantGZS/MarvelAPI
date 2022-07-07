
'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var userSchema = Schema( {
  username: String,
  passphrase: String,
  age: String,
  email: String,
  pic: String,
  favHeros: Array,  
  //favComics:{type:Schema.Types.ObjectId, ref:'Comics'}
  

} );

module.exports = mongoose.model( 'User', userSchema );