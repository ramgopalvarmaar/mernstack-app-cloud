//Import the mongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Set up mongo connection with mongo db which is running in the cloud
//Db name is - pentagram-mongodb
//Collections would be users and notes 
var mongoDB = 'mongodb+srv://admin:admin@cluster0.tymh2.mongodb.net/pentagram-mongodb?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

