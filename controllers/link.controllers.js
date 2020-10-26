const User  = require('../models/user.model.js');
const Link = require('../models/links.model.js');

// Create and Save a new Link
exports.create = (req, res) => {
 // Validate request
 if(!req.body.userid) {
    return res.status(400).send({
        message: "Userid cannot be empty"
    });
}
};

exports.createNewLink = (req, res) => {
    console.log("Creating the shared links in DB")

    console.log("Creating links model")
    // Create a Link
    const link = new Link({
        linkTitle: req.body.linkTitle || "Untitled Link", 
        linkUrl: req.body.linkUrl,
        isShared : req.body.isShared,
        sharedWith : req.body.teamName,
        sharedBy : req.body.userId,
        sharedByUserImg : req.body.userImg
    });

    console.log("Created model")
    console.log(link)
    // Save Link in the database
    
    Link.exists({linkTitle: req.body.linkTitle} ,function(err,result){
        console.log("exists"+result)
        if(!result){
            console.log("Link not found so inserting")
            link.save();
            User.findOneAndUpdate( {userid: req.body.userId}, 
                {$inc : {'points' : 50}}, 
                {new: true}, 
                function(err, response) { 
                  console.log("points updated for user "+req.body.userId);
                });
        }else{
            console.log("Link found so updating")
            Link.updateOne(
                {linkTitle: req.body.linkTitle},
                { sharedBy: req.body.userId, 
                    sharedWith: req.body.teamName,
                    sharedByUserImg: req.body.userImg,
                    isShared : req.body.isShared},
                function (err, doc){
                    console.log("Update call back method "+doc);
                    if(err === null){
                        console.log("Updating links success");
                        return res.status(200).send({"success":"success"});
                    } else {
                    console.log("Updating links for sharing failed");
                    return res.status(500).send({"error":"failed"});;
                  }
                });
                User.findOneAndUpdate( {userid: req.body.userId}, 
                    {$inc : {'points' : 50}}, 
                    {new: true}, 
                    function(err, response) { 
                      console.log("points updated for user "+req.body.userId);
                    });
        }
    })

    
};

exports.createNewUserLink = (req, res) => {
    console.log("Creating the shared links in DB")

    console.log("Creating links model")
    // Create a Note
    const link = new Link({
        linkTitle: req.body.linkTitle || "Untitled Link", 
        linkUrl: req.body.linkUrl,
        isShared : req.body.isShared,
        createdBy : req.body.userId,
    });

    console.log("Created model")
    console.log(link)
    // Save link in the database
    link.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Link."
        });
    });
};

exports.findAll = async (req, res) => {
    Link.find()
  .then(links => {
    console.log("Fetching all links");
      res.send(links);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while retrieving links."
      });
  });
};

exports.getUserLinks = (req, res) => {
    console.log("fetching user links from DB")
    Link.find({createdBy:req.params.userId})
  .then(links => {
      res.send(links);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while retrieving user links."
      });
  });
  };

  exports.getTeamLinks = (req, res) => {
    console.log("fetching team links from DB")
    Link.find({sharedWith:req.params.teamName})
  .then(links => {
      res.send(links);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while retrieving shared links."
      });
  });
  };

exports.findOne = (req, res) => {
    Link.findById(req.params.id)
  .then(link => {
      if(!link) {
          return res.status(404).send({
              message: "Link not found with id " + req.params.id
          });            
      }
      res.send(link);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "Link not found with id " + req.params.id
          });                
      }
      return res.status(500).send({
          message: "Error retrieving link with id " + req.params.id
      });
  });
};


// Delete a link with the specified linkId in the request
exports.delete = (req, res) => {
  
    Link.findByIdAndRemove(req.params.id)
  .then(link => {
      if(!link) {
          return res.status(404).send({
              message: "Link not found with id " + req.params.id
          });
      }
      res.send({message: "Link deleted successfully!"});
  }).catch(err => {
      if(err.kind === 'ObjectId' || err.name === 'NotFound') {
          return res.status(404).send({
              message: "Link not found with id " + req.params.id
          });                
      }
      return res.status(500).send({
          message: "Could not delete link with id " + req.params.id
      });
  });
};