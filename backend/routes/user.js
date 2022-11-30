//Import des mdoules
const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const auth = require("../middleware/auth");

//routes user
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.get("/:id", userCtrl.getOneUser);
router.get("/", userCtrl.getAllUser);
router.delete("/:id", auth, userCtrl.deleteUser);

// On export notre module "router"
module.exports = router;
