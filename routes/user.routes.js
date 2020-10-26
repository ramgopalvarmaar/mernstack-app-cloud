module.exports = (app) => {
    const user = require('../controllers/user.controllers.js');

app.get('/teams', (req, res) => {
    res.json({"team-name": "Expedia"});
});

app.get('/teams/:userId', user.findTeams);

app.get('/teams/:userId/:teamName', user.addToTeam);

app.post('/create-new-user', user.createNewUser);

}