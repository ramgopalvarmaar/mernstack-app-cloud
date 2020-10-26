const Voice  = require('../models/voice.model.js');
const User  = require('../models/user.model.js');
const multer = require('multer');
var fs = require('fs');
 

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'public')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname)
  }
})

var upload = multer({ storage: storage }).single('myAudio')

exports.createVoiceNote = (req, res) => {
        upload(req, res, function (err) {
               if (err instanceof multer.MulterError) {
                   return res.status(500).json(err)
               } else if (err) {
                   return res.status(500).json(err)
               }

                var mp3file = fs.readFileSync(req.file.path);
    
                console.log("audio id received "+req.body.audioId,)
                // Create an Voice instance
                const voice = new Voice({
                type: 'mp3',
                data: mp3file,
                sharedByUserImg: req.body.sharedByUserImg,
                sharedTo: req.body.sharedTo,
                audioId: req.body.audioId,
                sharedBy: req.body.sharedBy,
                createdBy: req.body.sharedBy
                });
                
                Voice.exists({audioId: req.body.audioId}, function (err, res){
                  console.log("exists"+res)
                  if(!res){
                    console.log("Audio not found so inserting")
                    voice.save();
                    User.findOneAndUpdate( {userid: req.body.sharedBy}, 
                      {$inc : {'points' : 100}}, 
                      {new: true}, 
                      function(err, response) { 
                        console.log("points updated for user "+req.body.sharedBy);
                      });
                  }else{
                    console.log("Audio found so updating")
                    Voice.updateOne(
                      { audioId: req.body.audioId },
                      { sharedBy: req.body.sharedBy, sharedTo: req.body.sharedTo },
                      function (err, doc){
                        if(err){
                          console.log("Updating sharedBy failed");
                        }
                      });
                      User.findOneAndUpdate( {userid: req.body.sharedBy}, 
                        {$inc : {'points' : 100}}, 
                        {new: true}, 
                        function(err, response) { 
                          console.log("points updated for user "+req.body.sharedBy    );
                        });
                  }
                })
            
          return res.status(200).send(req.file)
        })
};

exports.saveUserVoiceNotes = (req, res) => {
  upload(req, res, function (err) {
         if (err instanceof multer.MulterError) {
             return res.status(500).json(err)
         } else if (err) {
             return res.status(500).json(err)
         }

          var mp3file = fs.readFileSync(req.file.path);
          console.log(req.body.audioId);
          // Create an Voice instance
          const voice = new Voice({
          type: 'mp3',
          data: mp3file,
          createdBy: req.body.createdBy,
          sharedByUserImg: req.body.sharedByUserImg,
          audioId: req.body.audioId,
          });
          voice.save()
          .then(console.log("success fully saved audio"));
    return res.status(200).send(req.file)
  })
};

exports.getVoiceNotes = (req, res) => {
    console.log("fetching voice notesss from DB")
    Voice.find({sharedTo:req.params.teamName})
  .then(voice => {
      res.header('Content-Type', 'audio/mp3');
      res.send(voice);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while retrieving user."
      });
  });
};

exports.getUserVoiceNotes = (req, res) => {
  console.log("fetching voice notesss from DB")
  Voice.find({createdBy:req.params.userName})
.then(voice => {
    res.header('Content-Type', 'audio/mp3');
    res.send(voice);
}).catch(err => {
    res.status(500).send({
        message: err.message || "Some error occurred while retrieving user."
    });
});
};