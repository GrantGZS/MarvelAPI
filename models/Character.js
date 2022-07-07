'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const Mixed = Schema.Types.Mixed;

var charSchema = Schema( {
    userId: {type:Schema.Types.ObjectId, ref:'User'},
    id: Number,
    name: String,
    description: String,
    modified: String,
    thumbnail: Object,
    resourceURI: String,
    comics: Object,
    series: Object,
    stories: Object,
    events: Object,
    urls: Array


} );

module.exports = mongoose.model( 'Character', charSchema );
