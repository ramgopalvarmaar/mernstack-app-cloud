const User  = require('../models/user.model.js');

exports.fetchLeaderBoardData = (req, res) => {
  User.find()
  .then(user => {
      res.send(user);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while retrieving user."
      });
  });
};