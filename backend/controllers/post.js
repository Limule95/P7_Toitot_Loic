// Import des modules
const Post = require("../models/Post");
const fs = require("fs");
const User = require("../models/User");
const { log } = require("console");

//  test

// *********************************************************************************
exports.createPost = (req, res) => {
  // On recupere la personne qui souhaite modifier le post
  // _id = l'id de l'user   ---   req.auth.userId = id du token decoder
  User.findOne({ _id: req.auth.userId }).then((user) => {
    if (user.isAuthor === true || user.isAdmin === true) {

      const protocol = req.protocol;
      const host = req.get("host");
      const messageFild = req.body.message;
      const authorName = user.firstName + " " + user.lastName;

      if (messageFild !== "" && !req.file) { // On crée un nouveau post avec juste un message
        const post = new Post({
          userId: req.auth.userId,
          title: req.body.title,
          pseudo: req.body.pseudo,
          author: authorName,
          message: req.body.message,
          image: "https://img5.goodfon.com/wallpaper/nbig/9/16/cyberpunk-car-supercar-art-anime-japan-kanji-japanse-street.jpg",

        });
        post.save().then(() => {
          res.status(201).json({ message: "Post enregistré !" });
        }).catch((error) => {
          res.status(400).json({
            message: "Vous devez ajouter un texte et une image" + error
          });
        });
      } else {
        // Si il y un message et un fichier else if (messageFild && req.file) { // On crée un nouveau post avec un message et une image
        const post = new Post({
          userId: req.auth.userId,
          title: req.body.title,
          pseudo: req.body.pseudo,
          author: authorName,
          message: req.body.message,
          image: `${protocol}://${host}/images/${req.file.filename
            }`
        });
        post.save().then(() => {
          res.status(201).json({ message: "Post enregistré !" });
        }).catch((error) => {
          res.status(400).json({
            message: "Vous devez ajouter un texte et une image" + error
          });
        });
      }

    }
    else {
      res.status(401).json({ message: "Not an Author or Admin" })
    }
  }).catch((err) => res.status(500).json(err));


};

exports.updatePost = (req, res) => {
  // On recupere la personne qui souhaite modifier le post
  // _id = l'id de l'user   ---   req.auth.userId = id du token decoder
  User.findOne({ _id: req.auth.userId })
    .then((user) => {
      // On récupère le post grace a son ID
      Post.findOne({ _id: req.params.id })
        .then((thing) => {
          // On vérifie si l'ID de la personne qui a crée le post, correspond a l'ID de la personne authantifier ou si l'utilisateur est admin
          if (thing.userId === req.auth.userId || user.isAdmin === true) {
            // Si il y a un message et une image
            if (req.body.message != "" && req.file) {
              // On Update (modifie) le post avec un nouveau message et une nouvelle image
              Post.updateOne(
                { _id: req.params.id },
                {
                  $set: {
                    message: req.body.message,
                    image: `${req.protocol}://${req.get("host")}/images/${req.file.filename
                      }`,
                  },
                }
              )
                .then(() => {
                  // Si il y a une nouvelle image
                  if (thing.image) {
                    // On remplace (supprime) l'encienne image
                    const filename = thing.image.split("/images/")[1];
                    fs.unlink(`images/${filename}`, () => {
                      console.log("image suppr");
                    });
                  }

                  res.status(200).json({ message: "Post modifié!" });
                })
                .catch((error) => res.status(401).json({ error }));
            }
            // Si il n'y a qu'un message
            else if (req.body.message != "" && !req.file) {
              // On Update (modifie) le post avec un nouveau message
              Post.updateOne(
                { _id: req.params.id },
                {
                  $set: {
                    message: req.body.message,
                  },
                }
              )
                .then(() => {
                  console.log("hello");
                  res.status(200).json({ message: "Post modifié!" });
                })
                .catch((error) => res.status(401).json({ error }));
            }
            // Si il n'y a qu'une image
            else if (req.file && !req.body.message) {
              // On Update (modifie) le post avec une nouvelle image
              Post.updateOne(
                { _id: req.params.id },
                {
                  $set: {
                    image: `${req.protocol}://${req.get("host")}/images/${req.file.filename
                      }`,
                  },
                }
              )
                .then(() => {
                  // Si il y a une nouvelle image
                  if (thing.image) {
                    // On remplace (supprime) l'encienne image
                    const filename = thing.image.split("/images/")[1];
                    fs.unlink(`images/${filename}`, () => {
                      console.log("image suppr");
                    });
                  }
                  res.status(200).json({ message: "Post modifié!" });
                })
                .catch((error) => res.status(401).json({ error }));
            }
          } else {
            res.status(401).json({ message: "Not authorized" });
          }
        })
        .catch((error) => {
          res.status(400).json({ error });
        });
    })
    .catch((err) => res.status(500).json(err));
};

// ******************************************************************************************************
// Supression d'un post
exports.deletePost = (req, res) => {
  // On recupere la personne qui souhaite modifier le post
  // _id = l'id de l'user   ---   req.auth.userId = id du token decoder
  User.findOne({ _id: req.auth.userId }).then((user) => { // On récupère le post grace a son ID
    Post.findOne({ _id: req.params.id }).then((post) => { // On vérifie si l'ID de la personne qui a crée le post, correspond a l'ID de la personne authantifier ou si l'utilisateur est admin
      if (post.userId === req.auth.userId || user.isAdmin === true) { // Si il n'y a pas d'image
        if (!post.image) { // On supprime le post
          Post.deleteOne({ _id: req.params.id }).then(() => {
            res.status(200).json({ message: "Post supprimé !" });
          }).catch((error) => res.status(401).json({ error }));
        } else {
          // sinon si il y a une image
          // On supprime le post
          Post.deleteOne({ _id: req.params.id }).then(() => { // On supprimer l'image du post
            const filename = post.image.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => { });
            res.status(200).json({ message: "Post supprimé !" });
          }).catch((error) => res.status(401).json({ error }));
        }
      } else {
        res.status(401).json({ message: "Not authorized" });
      }
    }).catch((error) => {
      res.status(400).json({ error });
    });
  }).catch((err) => res.status(500).json(err));
};
// Récupèration d'un post par l'id
exports.getOnePost = (req, res, next) => { // On récupère le post grace a son ID
  Post.findOne({ _id: req.params.id }).then((post) => res.status(200).json(post)).catch((error) => res.status(404).json({ error }));
};
// Récupération de tous les posts
exports.getAllPost = (req, res) => { // On récupère tous les posts
  Post.find().sort({ _id: -1 }).then((post) => res.status(200).json(post)).catch((error) => res.status(400).json({ error }));
};

// Route pour noter un post****************
exports.ratePost = (req, res) => {
  User.findOne({ _id: req.auth.userId }).then((user) => {
    Post.findOne({ _id: req.params.id }).then((post) => {
      if (user.isAuthor === false) {
        Post.updateOne(
          { _id: req.params.id },
          {
            $push: {
              rate: req.body.rate,
            },
          }
        )
          .then((Note) => {
            // On identifie le post dont on veut la moyenne. post.findOne()
            Post.findOne({ _id: req.params.id }).then((post) => {
              let rateLength = post.rate.length;

              var i = 0, summ = 0, ArrayLen = rateLength;
              while (i < ArrayLen) {
                summ = summ + post.rate[i++];
              }
              let averageMoyenne = summ / ArrayLen;
              console.log(averageMoyenne);

              Post.updateOne(
                { _id: req.params.id },
                {
                  $set: {
                    moyenne: averageMoyenne,
                  }
                }
              )
                .then(() => {
                  res.status(200).json({ message: "Moyenne calculée!" });
                })
                .catch((error) => res.status(401).json({ error, message: "Erreur du calcule de la moyenne" }));

            })
          })
      } else {
        res.status(403).json({ message: "Un auteur ne peut voter." })
      }
    }).catch((error) => {
      res.status(400).json({
        error, message: "post non identifié."
      });
    });
  }).catch((err) => res.status(500).json({ error, message: "utilisateur introuvable" }));
}
