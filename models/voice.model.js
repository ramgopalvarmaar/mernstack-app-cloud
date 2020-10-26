const mongoose = require('mongoose');
 
const VoiceSchema = mongoose.Schema({
    audioId: { type: String, required: true, unique: true},
    type: String,
    data: Buffer,
    sharedBy: String,
    sharedByUserImg: String,
    sharedTo: String,
    createdBy: String,
});
 
module.exports = mongoose.model('Voice', VoiceSchema);
