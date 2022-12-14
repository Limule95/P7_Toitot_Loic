const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require('../models/Comments');

exports.getComs = (req, res) => {
    Post.findOne({ _id: req.params.id })
        .then((post) => {
            Comment.find().sort({ _id: -1 }).then((comment) => {
                res.status(200).json(comment)
            }).catch((error) => res.status(400).json({ message: "impossible d'afficher les commentaires" + err }));

        }).catch((error) => {
            res.status(400).json({ message: "post introuvable" });
        });
}

exports.postComs = (req, res) => {
    User.findOne({ _id: req.auth.userId })
        .then((user) => {
            if (user.isAuthor === true) {
                return res.status(408).json({ message: "Les auteurs ne peuvent pas commenter." })
            } else {
                Post.findOne({ _id: req.params.id })
                    .then((post) => {
                        const newComment = new Post({ content: req.body.content });
                        newComment.save()
                        post.comments.push(newComment);
                        console.log("hello " + post);
                        post.save();

                    }).catch((error) => {
                        res.status(400).json({ message: 'post introuable' });
                    });
            }
        }).catch((err) => res.status(500).json({ message: 'utilisateur introuable' + err }));
}