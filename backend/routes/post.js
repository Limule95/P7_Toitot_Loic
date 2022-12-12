//Import des modules
const express = require("express");
const router = express.Router();
const postCtrl = require("../controllers/post");
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");

//routes post
router.post("/", auth, multer, postCtrl.createPost);
router.put("/:id", auth, multer, postCtrl.updatePost);
router.delete("/:id", auth, postCtrl.deletePost);
router.get("/", postCtrl.getAllPost);
router.get("/:id", auth, postCtrl.getOnePost);
// route pour noter un post ***** WORKING
router.patch("/:id", auth, postCtrl.ratePost);

// route d'obtention de moyenne **** PROLY NOT WORKING YET
// router.patch("/:id", postCtrl.postAverage);

// On export notre module "router"
module.exports = router;
