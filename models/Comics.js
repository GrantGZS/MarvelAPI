const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const Mixed = Schema.Types.Mixed;

var comicsSchema = Schema( {
   userId: {type:Schema.Types.ObjectId, ref:'User'},
   id:String,
   name:String,
   resourceURI:String
} );

module.exports = mongoose.model( 'Comics', comicsSchema );
