module.exports = (app) => {
    const notes = require('../controllers/note.controllers.js');

// Create a new Note
app.post('/create-note', notes.createNewNote);

app.get('/fetch-team-notes/:teamName', notes.getTeamNotes);

//Save a single Note for user
app.post('/create-user-note', notes.createNewUserNote);

//Retrieve a single Note with noteId
app.get('/notes/:noteId', notes.findOne);

//Retrieve Notes for the user
app.get('/fetch-user-saved-notes/:userId', notes.getUserNotes);

//Update a Note with noteId
//app.put('/notes/:noteId', notes.update);

//Delete a Note with noteId
app.delete('/notes/:noteId', notes.delete);

}