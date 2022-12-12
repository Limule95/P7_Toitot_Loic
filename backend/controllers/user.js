//Import des modules
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.config();
const hashSecu = process.env.HASH_SECU;

//Creation d'un compte
exports.signup = (req, res, next) => {
  let pseudoRegExp = new RegExp("^[a-zA-Z0-9]{4,}$");
  if (!pseudoRegExp.test(req.body.pseudo)) {
    return res.status(401).json({ message: "Pseudo invalid" });
  }
  let firstNameRegExp = new RegExp("^[a-zA-Z]{1,}$");

  if (!firstNameRegExp.test(req.body.firstName)) {
    return res.status(401).json({ message: "first name invalid" });
  }
  let lastNameRegExp = new RegExp("^[a-zA-Z]{1,}$");
  if (!lastNameRegExp.test(req.body.lastName)) {
    return res.status(401).json({ message: "last name invalid" });
  }
  let emailRegExp = new RegExp(
    "^[a-zA-Z0-9.-_]{2,}[@]{1}[a-zA-Z0-9.-_]{2,}[.]{1}[a-z]{2,5}$"
  );
  if (!emailRegExp.test(req.body.email)) {
    return res.status(402).json({ message: "Email invalid" });
  }
  let passworldRegExp = new RegExp("^[a-zA-Z0-9]{6,}$");
  if (!passworldRegExp.test(req.body.password)) {
    return res.status(403).json({ message: "Password invalid" });
  }

  bcrypt
    .hash(req.body.password, parseInt(hashSecu))
    .then((hash) => {
      const user = new User({
        pseudo: req.body.pseudo,
        email: req.body.email,
        password: hash,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        isAuthor: req.body.isAuthor
      });
      user
        .save()
        .then(() => res.status(201).json({ message: " Utilisateur créé !" }))
        .catch((err) => res.status(400).json({ err: "Erreur" }));
    })

    .catch((err) => res.status(500).json(err));
};
//Connection a un compte
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Utilisateur incorrect" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Paire identifiant/mot de passe incorrecte" });
          }

          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id, isAdmin: this.isAdmin },
              "RANDOM_TOKEN_SECRET",
              {
                expiresIn: "24h",
              }
            ),
          });
        })
        .catch((err) => res.status(200).send(err));
    })
    .catch((err) => res.status(500).json(err));
};
// Information utisilateur
exports.getOneUser = (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => res.status(500).json(err));
};
// Afficher tous les users
exports.getAllUser = async (req, res) => {
  //users attend la reponse de User.find sans paramettre pour afficher tous les users
  const users = await User.find().select("-password");
  res.status(201).json(users);
};
// Supprimer un user
exports.deleteUser = (req, res) => {
  User.deleteOne({ userId: req.auth.userId })
    .exec()
    .then(() => {
      res.status(201).json("user supprimer");
    })
    .catch((err) => res.status(500).json(err));
};
