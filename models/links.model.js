var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var linksSchema = new Schema({
    linkTitle: { type: String, required: true, unique: true},
    linkUrl: { type: String},
    isShared: { type: Boolean, default:false},
    sharedWith: { type: Array },
    sharedBy : { type: String},
    sharedByUserImg : { type: String},
    createdBy:{type:String}
});

module.exports = mongoose.model('Link', linksSchema);