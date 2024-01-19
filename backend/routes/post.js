//Import des modules
const express = require("express");
const router = express.Router();
const postCtrl = require("../controllers/post");
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");
const comments = require("../controllers/comments");

//routes post
router.post("/", auth, multer, postCtrl.createPost);
router.put("/:id", auth, multer, postCtrl.updatePost);
router.delete("/:id", auth, postCtrl.deletePost);
router.get("/", postCtrl.getAllPost);
router.get("/:id", auth, postCtrl.getOnePost);
// route pour noter un post ***** WORKING
router.patch("/:id", auth, postCtrl.ratePost);

// route pour afficher les commentaires
router.get("/:id/comments", auth, comments.getComs);

// route pour créer un commentaire
router.post("/:id/comments", auth, comments.postComs);

// // Route pour supprimer un commentaire
// router.delete("/comments/:id", auth, comments.delComs);

// On export notre module "router"
module.exports = router;
