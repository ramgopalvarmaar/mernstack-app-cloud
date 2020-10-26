var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var notesSchema = new Schema({
    noteTitle: { type: String, required: true, unique: true},
    noteDesc: { type: String},
    isShared: { type: Boolean, default:false},
    sharedWith: { type: Array },
    sharedBy : { type: String},
    sharedByUserImg : { type: String},
    createdBy:{ type: String}
});

module.exports = mongoose.model('Note', notesSchema);