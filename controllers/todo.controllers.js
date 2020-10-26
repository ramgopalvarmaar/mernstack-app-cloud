const ToDo = require('../models/todo.model.js');


exports.create = (req, res) => {

    if(!req.body.userid) {
        return res.status(400).send({
            message: "UserId cannot be empty"
        });
    }

    const todo = new ToDo( {
        toDoItem: req.body.toDoItem,
        doByDateTime: req.body.doByDateTime,
        createdBy: req.body.userid
    });

    todo.save()
        .then(data => {res.send(data); })
        .catch(err => {
                res.status(500).send({message: err.message || "Some error occurred while creating the Note."});
            }
        );
};

exports.edit = (req, res) => {

    if(!req.body.userid) {
        return res.status(400).send({
            message: "UserId cannot be empty"
        });
    }

    ToDo.exists({_id: req.body._id}, function (er, doExists){
        console.log(`todo with id:${req.body._id} exists?=${doExists}`)
        if(doExists) {
            console.log("Notes found so updating")
            ToDo.updateOne(
                {_id: req.body._id},
                {
                    toDoItem: req.body.toDoItem,
                    doByDateTime: req.body.doByDateTime
                },
                function (err, doc) {
                    console.log("Update call back method " + JSON.stringify(doc));
                    if(err === null && doc.nModified === 1) {
                        console.log(`Updating todo success`);
                        return res.status(200).send({"success":"success"});
                    } else {
                        console.log(`Updating todo failed, error=${err}`);
                        return res.status(500).send({"error":"failed"});;
                    }
                }
            );
        }
    })
};

exports.findAll = (req, res) => {
    ToDo.find()
        .then(todos => {
                console.log("Fetching all To Do Items");
                res.send(todos);})
        .catch(err => {res.status(500).send({
                 message: err.message || "Some error occurred while retrieving to do items."
            });
        });
};

exports.findOne = (req, res) => {
    ToDo.findById(req.params.todoId)
        .then(todo => {
            if(!todo) {
                return res.status(404).send({
                    message: "To Do Item not found with id " + req.params.todoId
                });
            }
            res.send(todo);})
        .catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "To Do Item not found with id " + req.params.todoId
                });
            }
            return res.status(500).send({
                    message: "Error retrieving to do item with id " + req.params.todoId
            });
        });
};

exports.getUserToDos = (req, res) => {
    console.log("fetching user ToDo from DB")
    const decodedUserId = decodeURIComponent(req.params.userId);
    ToDo.find({createdBy:decodedUserId})
        .then(notes => {res.send(notes);})
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving user notes."
            });
        });
};



exports.delete = (req, res) => {
    ToDo.findByIdAndRemove(req.params.todoId)
        .then(todo => {
            if(!todo) {
                return res.status(404).send({
                        message: "To Do Item not found with id " + req.params.todoId
                });
            }
            res.send({message: "To Do item deleted successfully!"}); })

        .catch(err => {
            if(err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "To Do item not found with id " + req.params.todoId
                });
            }
            return res.status(500).send({
                message: "Could not delete To Do item with id " + req.params.todoId
            });
        });
};