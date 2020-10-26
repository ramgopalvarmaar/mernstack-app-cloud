const User  = require('../models/user.model.js');

exports.findTeams = (req, res) => {
    User.findOne({userid:req.params.userId})
  .then(user => {
      res.send(user);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while retrieving user."
      });
  });
};

exports.createNewUser = (req, res) => {
    console.log("$$$$$$$$$$$$$$$"+req.body.userid + req.body.userImg)
    const user = new User({
        userid: req.body.userid, 
        userImg: req.body.userImg
    });

    // Save user in the database
    user.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Note."
        });
    });
};

exports.addToTeam = (req, res) => {
    User.updateOne({userid:req.params.userId}, { $set: { teams: req.params.teamName} })
    .then(user => {
        console.log("Updated user"+user.json());
          res.send(user);
      }).catch(err => {
          res.status(500).send({
              message: err.message || "Some error occurred while updating team."
          });
      });
};