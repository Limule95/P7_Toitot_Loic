const Post = require("../models/Post");
const User = require("../models/User");
const Comments = require("../models/Comments");

exports.getComs = (req, res) => {
  Post.findOne({ _id: req.params.id })
    .then((post) => {
      Comments.find()
        .sort({ _id: -1 })
        .then((comment) => {
          res.status(200).json(comment);
        })
        .catch((error) =>
          res
            .status(400)
            .json({ message: "impossible d'afficher les commentaires" + err })
        );
    })
    .catch((error) => {
      res.status(400).json({ message: "post introuvable" });
    });
};

exports.postComs = (req, res) => {
  User.findOne({ _id: req.auth.userId })
    .then((user) => {
      if (user.isAuthor === true) {
        return res
          .status(403)
          .json({ message: "Les auteurs ne sont pas autorisés à commenter." });
      } else {
        Post.findOne({ _id: req.params.id })
          .then((post) => {
            const newComment = new Comments({ content: req.body.content });
            newComment
              .save()
              .then((comment) => {
                post.comments.push(comment._id); // Ajoute l'ID du commentaire à la publication
                post
                  .save()
                  .then(() => {
                    res.status(201).json(comment);
                  })
                  .catch((error) => {
                    res.status(500).json({
                      message:
                        "Erreur lors de l'enregistrement du commentaire dans la publication",
                    });
                  });
              })
              .catch((error) => {
                res.status(500).json({
                  message: "Erreur lors de la création du commentaire",
                });
              });
          })
          .catch((error) => {
            res.status(404).json({ message: "Publication introuvable" });
          });
      }
    })
    .catch((err) =>
      res.status(500).json({ message: "Utilisateur introuvable" + err })
    );
};
