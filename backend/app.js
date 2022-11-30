// Import des modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var helmet = require("helmet");

//Import dotenv
const dotenv = require("dotenv");
dotenv.config();

//route de controles de variables d'envirronement
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbUrl = process.env.DB_URL;

//Import path
const path = require("path");

//Import des routes
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

//Connection à la base de donnée MongoDB
mongoose
  .connect(`mongodb+srv://${dbUser}:${dbPassword}@${dbUrl}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//Création d'application express
const app = express();

//Gestion de helmet pour la sécurite de l'application express
//Autoriser le partage de ressources entre deux Port différents
app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));

//Header pour contourner erreurs de CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  // res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

//Rendre la requete exploitable
app.use(bodyParser.json());

//Routes attendues
app.use("/api/post", postRoutes);
app.use("/api/auth", userRoutes);

//Gestion de la ressource image de façon statique
app.use("/images", express.static(path.join(__dirname, "images")));

// On export notre module "app"
module.exports = app;
