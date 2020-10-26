
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    _id: { type: Schema.ObjectId, auto: true },
    userid: { type: String, required: true, trim: true, unique: true},
    teams: { type: Array },
    userImg: { type: String },
    points: { type:Number, default:0},
});


module.exports = mongoose.model('User', userSchema);