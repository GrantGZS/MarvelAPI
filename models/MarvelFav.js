'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var marvelFavSchema = Schema( {
  id: Number,
  name:String,
  description:String


} );

module.exports = mongoose.model( 'MarvelFav', marvelFavSchema );
