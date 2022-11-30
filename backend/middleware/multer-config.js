//Import modules Multer
const multer = require("multer");

//Type d'image utilisable
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

//Instauration du stockage d'image
const storage = multer.diskStorage({
  // indique à multer d'enregistrer les fichiers dans le dossier images
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    console.log(file);
    //On indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores
    const name = file.originalname.split(" ").join("_");
    //On utilise ensuite la constante dictionnaire de type MIME_TYPE pour résoudre l'extension de fichier appropriée
    const extension = MIME_TYPES[file.mimetype];
    // On renvoie les information avec un timestamp Date.now() qui viendra s'ajouter dans le nom de l'image
    callback(null, name + Date.now() + "." + extension);
  },
});

//On exporte ensuite l'élément multer, on lui passe notre constante storage et on indique qu'on gère uniquement les téléchargements d'image
module.exports = multer({ storage: storage }).single("image");
