//Import des modules
const Post = require("../models/Post");
const fs = require("fs");
const User = require("../models/User");
const { log } = require("console");

//Création d'un post
exports.createPost = (req, res) => {
  const protocol = req.protocol;
  const host = req.get("host");
  const messageFild = req.body.message;

  // Si il y a un message mais pas de fichier
  if (messageFild !== "" && !req.file) {
    // On crée un nouveau post avec juste un message
    const post = new Post({
      userId: req.auth.userId,
      pseudo: req.body.pseudo,
      message: req.body.message,
    });
    post
      .save()
      .then(() => {
        res.status(201).json({ message: "Post enregistré !" });
      })
      .catch((error) => {
        res.status(400).json({
          message: "Vous devez ajouter un texte et une image" + error,
        });
      });
  }
  // Si il y un message et un fichier
  else if (messageFild && req.file) {
    // On crée un nouveau post avec un message et une image
    const post = new Post({
      userId: req.auth.userId,
      pseudo: req.body.pseudo,
      message: req.body.message,
      image: `${protocol}://${host}/images/${req.file.filename}`,
    });
    post
      .save()
      .then(() => {
        res.status(201).json({ message: "Post enregistré !" });
      })
      .catch((error) => {
        res.status(400).json({
          message: "Vous devez ajouter un texte et une image" + error,
        });
      });
  }
};
//Modification d'un post
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
                    image: `${req.protocol}://${req.get("host")}/images/${
                      req.file.filename
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
                    image: `${req.protocol}://${req.get("host")}/images/${
                      req.file.filename
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
//Supression d'un post
exports.deletePost = (req, res) => {
  // On recupere la personne qui souhaite modifier le post
  // _id = l'id de l'user   ---   req.auth.userId = id du token decoder
  User.findOne({ _id: req.auth.userId })
    .then((user) => {
      // On récupère le post grace a son ID
      Post.findOne({ _id: req.params.id })
        .then((post) => {
          // On vérifie si l'ID de la personne qui a crée le post, correspond a l'ID de la personne authantifier ou si l'utilisateur est admin
          if (post.userId === req.auth.userId || user.isAdmin === true) {
            // Si il n'y a pas d'image
            if (!post.image) {
              // On supprime le post
              Post.deleteOne({ _id: req.params.id })
                .then(() => {
                  res.status(200).json({ message: "Post supprimé !" });
                })
                .catch((error) => res.status(401).json({ error }));
            } else {
              // sinon si il y a une image
              // On supprime le post
              Post.deleteOne({ _id: req.params.id })
                .then(() => {
                  // On supprimer l'image du post
                  const filename = post.image.split("/images/")[1];
                  fs.unlink(`images/${filename}`, () => {});
                  res.status(200).json({ message: "Post supprimé !" });
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
//Récupèration d'un post par l'id
exports.getOnePost = (req, res, next) => {
  // On récupère le post grace a son ID
  Post.findOne({ _id: req.params.id })
    .then((post) => res.status(200).json(post))
    .catch((error) => res.status(404).json({ error }));
};
//Récupération de tous les posts
exports.getAllPost = (req, res) => {
  // On récupère tous les posts
  Post.find()
    .sort({ _id: -1 })
    .then((post) => res.status(200).json(post))
    .catch((error) => res.status(400).json({ error }));
};

// ********** A modifier => **************

//**Liker un Post**/
exports.likePost = async (req, res) => {
  //ajout de l'id de l'user ayant liké au array likers du post
  try {
    //on identifie l'id du post//on transmet l'id de la personne ayant like au array likers
    await Post.findByIdAndUpdate(
      { _id: req.params.id },
      { $addToSet: { likers: req.auth.userId } },
      { new: true }
    );

    //ajout de l'id du créateur de post au array likes du liker
    //on trouve l'id du liker//on transmet l'id du post au array likes du liker
    await User.findByIdAndUpdate(
      req.auth.userId,
      { $addToSet: { likes: req.params.id } },
      { new: true }
    )
      .then((data) => res.send(data))
      .catch((err) => res.status(500).send({ err: " erreur " }));
  } catch (err) {
    return res.status(400).send({ err: "ca marche mais cela fait une erreur" });
  }
};
//**Unliker un post**/
exports.unlikePost = async (req, res) => {
  try {
    //on identifie l'id du post//on enlève l'id de la personne ayant like du array likers
    await Post.findByIdAndUpdate(
      { _id: req.params.id },
      { $pull: { likers: req.auth.userId } },
      { new: true }
    );
    //suppresion de l'id du post du array likes du liker
    //on trouve l'id du liker//on enlève l'id du post du array likes du liker
    await User.findByIdAndUpdate(
      req.auth.userId,
      { $pull: { likes: req.params.id } },
      { new: true }
    )
      .then((data) => res.send(data))
      .catch((err) => res.status(500).send({ message: err }));
  } catch (err) {
    return res.status(400).send(err);
  }
};
