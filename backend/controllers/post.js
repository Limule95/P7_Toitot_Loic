// Import des modules
const Post = require("../models/Post");
const fs = require("fs");
const User = require("../models/User");
const { log } = require("console");


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

  Post.findOne({ _id: req.params.id }).then((post) => {
    let length = post.rate.length;
    console.log(post);
    // Si l'user est un auteur, il ne peut pas voter. if (user.author === false) "alors on fait la fonction" else "action impossible"

    // si post.rate = null (=array vide)alors post.rate prend la valeur de choisie par l'user

    if (length === 0) {
      Post.updateOne(
        { _id: req.params.id },
        {
          $push: {
            rate: req.body.rate,
          },
        }
      )
        .then(() => {
          let moyenne = req.body.rate
          res.status(200).json({ moyenne, message: "Mention envoyée!" });
        })
        .catch((error) => res.status(401).json({ error }));
    }
    // // si post.rate != 0 alors post.rate rajoute la valeur choisie par l'user a l'array et en fait la moyenne
    if (length > 0) {

      Post.updateOne(
        { _id: req.params.id },
        {
          $push: {
            rate: req.body.rate,
          },
        }
      )
        .then(() => {
          Post.findOne({ _id: req.params.id }).then((ratedPost) => {
            var b = ratedPost.rate.length;
            var c = 0, i;
            for (i = 0; i < b; i++) {
              c += Number(ratedPost.rate[i]);
            }
            let moyenne = c / b
            res.status(200).json({ moyenne, message: "ok" });
          })
        })
        .catch((err) => res.status(500).json(err));
    }
  }).catch((error) => {
    res.status(400).json({ error });
  });
}

// ********** Route pour calculer la moyenne d'un livre **************
exports.postAverage = (req, res) => {
  // On identifie le post dont on veut la moyenne. post.findOne()

  // on récupère le tableau des rates dans une var . let averageRate = post.rate

  // on utilise notre fonction de calc de moy numAverage()

  // post.moyenne prends la valeur du résultat de l'opération. avec post.updateOne()

  // la réponse en .then "moyenne calculé".
  // 
}
