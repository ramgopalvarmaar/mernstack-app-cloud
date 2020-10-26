module.exports = (app) => {
const leaderboard = require('../controllers/leaderboard.controllers.js');

app.get('/fetch-leaderboard', leaderboard.fetchLeaderBoardData);

}
