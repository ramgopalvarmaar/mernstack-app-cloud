var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ToDoSchema = new Schema({
    _id: { type: Schema.ObjectId, auto: true },
    toDoItem: { type: String},
    doByDateTime: { type: Date},
    createdBy:{ type: String}
});

module.exports = mongoose.model('ToDo', ToDoSchema);