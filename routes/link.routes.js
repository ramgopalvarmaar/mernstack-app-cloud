module.exports = (app) => {
    const links = require('../controllers/link.controllers.js');

// Create a new Link
app.post('/create-link', links.createNewLink);

app.get('/fetch-team-links/:teamName', links.getTeamLinks);

//Save a single Link for user
app.post('/create-user-link', links.createNewUserLink);

//Retrieve a single Link with linkId
app.get('/links/:linkId', links.findOne);

//Retrieve Links for the user
app.get('/fetch-user-saved-links/:userId', links.getUserLinks);

//Update a Link with linkId
//app.put('/links/:linkId', links.update);

//Delete a Link with linkId
app.delete('/links/:linkId', links.delete);

}